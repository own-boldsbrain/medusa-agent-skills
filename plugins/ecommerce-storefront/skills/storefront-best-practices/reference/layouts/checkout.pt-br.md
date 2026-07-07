# Fluxo de finalização da compra – Referência

Orientações para a implementação do fluxo de finalização de compra na loja virtual YSH Store. Este documento de referência descreve a arquitetura, as etapas visíveis ao usuário, a lógica de aprovação B2B e os padrões estabelecidos na base de código.

## Estrutura de decisão: Estratégia de finalização da compra

### Finalização de compra em várias etapas (implementação atual)

**Quando usar:**

- Fluxos B2B complexos com requisitos de aprovação
- Vários campos de coleta de dados (empresa, endereço, remessa, cobrança, contato, pagamento)
- A divulgação progressiva reduz a carga cognitiva

**A YSH Store utiliza 4 etapas de superfície** (mapeadas a partir dos IDs internos das etapas):

| Passo de superfície | Etapas internas abordadas | Descrição |
|---|---|---|
| `endereço` | `endereço-de-entrega`, `endereço-de-faturamento`, `informações-de-contato` | Todos os endereços e dados de contato |
| `entrega` | `entrega` | Seleção do método de envio |
| `pagamento` | `pagamento` | Seleção da forma de pagamento |
| `resenha` | `resenha` | Confirmação final do pedido |

> ⚠️ O seletor da interface do usuário pode exibir mais rótulos do que as etapas da interface (por exemplo, Entrega, Faturamento, Frete, Contato, Pagamento). O sistema de etapas da interface é a máquina de estados oficial; o seletor tem apenas função de apresentação.

---

## Arquitetura

### Separação entre servidor e cliente

```
CheckoutWorkspace (server)          → fetches shipping/payment methods from Medusa
  └── CheckoutWorkspaceClient (client) → manages all UI state, step transitions, form data
        ├── Address step UI
        ├── Delivery step UI
        ├── Payment step UI
        └── Review step UI
```

**Por que essa divisão é importante:**

- O `CheckoutWorkspace` recupera `listCartShippingMethods` e `listCartPaymentMethods` no lado do servidor, evitando cascatas no lado do cliente
- O `CheckoutWorkspaceClient` é um componente do tipo “cliente de uso” que mantém todo o estado interativo
- As substituições (`availableShippingMethodsOverride`, `availablePaymentMethodsOverride`) permitem a realização de testes de ponta a ponta sem um backend ativo

### Lógica dos Passos de Superfície (`lib/surface-steps.ts`)

```typescript
// Step order is authoritative – do not reorder
const CHECKOUT_SURFACE_STEP_ORDER: CheckoutSurfaceStep[] = [
  "address",
  "delivery",
  "payment",
  "review",
]

// Resolves which step to show based on cart state + URL ?step= param
export const resolveCheckoutSurfaceState = (cart, rawStep) => {
  const furthestAccessibleStep = getCheckoutSurfaceStepFromCart(cart)
  const requestedStep = normalizeCheckoutSurfaceStep(rawStep)
  // ...
}
```

**Invariante-chave:** Um cliente nunca pode ultrapassar o `furthestAccessibleStep`. Os degraus tornam-se acessíveis à medida que o carrinho avança.

---

## Fluxo de aprovação B2B

O processo de finalização de compra da YSH Store segue uma lógica específica para o setor B2B:

```typescript
// In CheckoutWorkspace (server)
const requiresApproval =
  cart.company?.approval_settings?.requires_admin_approval ||
  cart.company?.approval_settings?.requires_sales_manager_approval

const isApprovedAdmin =
  customer?.employee?.is_admin &&
  cart.approval_status?.status === ApprovalStatusType.APPROVED
```

### Bloqueio de etapas de pagamento

- Quando `requiresApproval && !isApprovedAdmin` → `paymentLocked = true`
- Quando o pagamento está bloqueado, a etapa de pagamento não é exibida
- Um `ApprovalStatusBanner` mostra o status de aprovação pendente
- Usuários administradores com status aprovado ignoram o bloqueio

### Limite de gastos na etapa de revisão

```typescript
// In Review component
const spendLimitExceeded = customer ? checkSpendingLimit(cart, customer) : false

// If exceeded → show warning + disabled "Revisar aprovacao" button
// If within limit → show PaymentButton (place order)
```

---

## Página de finalização da compra

### Rota

```
app/[countryCode]/(checkout)/checkout/page.tsx
```

### Modo de fixture local para E2E

A página de checkout oferece suporte ao modo de fixture local para testes E2E sem um backend ativo:

```typescript
const isLocalE2EMode = isLocalE2EModeEnabled()
const localFixture = isLocalE2EMode
  ? getLocalCheckoutFixture(resolvedSearchParams?.fixture)
  : null

const cart = localFixture?.cart ?? (await retrieveCart(cartId))
const customer = localFixture?.customer ?? (await retrieveCustomer())
```

**Padrão:** Sempre proteja `localFixture` por meio de `isLocalE2EModeEnabled()` — esse sinalizador nunca deve estar ativo em produção.

---

## Obtenção de formas de pagamento

**CRÍTICO:** Sempre obtenha as formas de pagamento do Medusa por ID de região — nunca utilize valores fixos.

```typescript
// In CheckoutWorkspace (server)
const availablePaymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
```

**Por que:** Os provedores de pagamento variam de acordo com a região. A codificação estática faz com que o checkout pare de funcionar quando as regiões mudam.

---

## Componente de etapas do checkout

O componente de etapas é de apresentação — ele lê `?step=` dos parâmetros da URL.

```typescript
const CHECKOUT_STEPS = [
  { id: "shipping-address", label: "Entrega" },
  { id: "billing-address", label: "Faturamento" },
  { id: "delivery", label: "Frete" },
  { id: "contact-details", label: "Contato" },
  { id: "payment", label: "Pagamento" },
] as const
```

**Requisito-chave de acessibilidade:** Cada círculo de etapa utiliza `aria-current="step"` quando está ativo.

---

## Padrão de navegação por etapas

A navegação entre as etapas utiliza `useRouter` + `useSearchParams`:

```typescript
const createQueryString = useCallback(
  (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  },
  [searchParams]
)

// Navigate forward
router.push(pathname + "?" + createQueryString("step", "delivery"), {
  scroll: false,
})
```

**Use `scroll: false`** em todas as transições entre etapas para evitar saltos na página. O layout do checkout é um fluxo de página única, no qual o conteúdo das etapas é atualizado dinamicamente, sem a necessidade de rolar até o topo.

---

## Integração de pagamento

### Stripe

```typescript
// Check if provider is Stripe-like
const isStripeLike = (providerId: string) => providerId.startsWith("pp_stripe")

// Stripe-specific UX
if (isStripeLike(selectedPaymentMethod) && !activeSession) {
  // Show CardElement for card input
  // Only route to review after card data is captured
}
```

### Iniciação da sessão de pagamento

```typescript
await initiatePaymentSession(cart, {
  provider_id: selectedPaymentMethod,
})
```

**Padrão:** Sempre chame `initiatePaymentSession` quando o provedor for alterado OU quando não houver nenhuma sessão ativa.

### Wrapper de pagamento

O `PaymentWrapper` fornece o contexto do Stripe para todo o processo de checkout:

```typescript
// app/[countryCode]/(checkout)/checkout/page.tsx
<Wrapper cart={cart}>
  <CheckoutWorkspace ... />
</Wrapper>
```

O `StripeContext` (por meio de `useContext`) está disponível em toda a árvore do checkout.

---

## Formulários de endereço

### Endereço de entrega

```typescript
// Component: modules/checkout/components/shipping-address
// Form: modules/checkout/components/shipping-address-form
```

- Salva por meio de `setShippingAddress(cart.id, addressPayload)`
- Os países são obtidos de `cart.region?.countries` — **NUNCA exiba todos os países**, apenas os países da região
- Armazena o endereço no `localStorage` para preenchimento automático em visitas subsequentes

### Endereço de cobrança

```typescript
// Component: modules/checkout/components/billing-address
// Form: modules/checkout/components/billing-address-form
```

- Oferece a opção “igual ao endereço de entrega”
- Formulário de endereço independente quando o endereço de cobrança difere do de entrega
- Utiliza `updateCart` para salvar o endereço de cobrança

### Seleção de endereço (endereços salvos)

```typescript
// Component: modules/checkout/components/address-select
```

- Para usuários autenticados com endereços salvos
- Preenche os campos do formulário com os dados do endereço selecionado

---

## Etapa da empresa (B2B)

```typescript
// Component: modules/checkout/components/company
// Form: modules/checkout/components/company-form
```

- Exibido quando `cart?.company` existe
- Coleta o nome da empresa, o número de registro e o CNPJ
- Obrigatório antes de prosseguir para o endereço de entrega

---

## Totais da finalização da compra

```typescript
// Component: modules/checkout/components/checkout-totals
```

- Exibe subtotal, frete, impostos, desconto, vale-presente e total
- Usa `convertToLocale` para formatação de preços
- **NÃO divida os preços por 100** — os preços do Medusa estão no formato de exibição

---

## Tratamento de erros

```typescript
// Component: modules/checkout/components/error-message
```

- Todas as ações das etapas assíncronas detectam erros e definem o estado `error`
- O componente `ErrorMessage` é exibido abaixo do botão de envio
- Redefina `error` como `null` sempre que `isOpen` mudar (mudança de foco da etapa)

---

## Erros comuns a evitar

- ❌ **Busca de formas de pagamento no lado do cliente** — faça a busca no lado do servidor em `CheckoutWorkspace` para evitar o efeito cascata
- ❌ **Exibir todos os países** — exiba apenas `cart.region?.countries`
- ❌ **Codificar manualmente os provedores de pagamento** — use sempre `listCartPaymentMethods(region_id)`
- ❌ **Pular etapas** — sempre aplique `furthestAccessibleStep` a partir da lógica das etapas da interface
- ❌ **Ignorar `scroll: false`** na navegação por etapas — causa um deslocamento brusco para o topo
- ❌ **Finalizar o pedido antes da sessão de pagamento** — certifique-se de que `initiatePaymentSession` seja concluído antes do redirecionamento para a página de revisão
- ❌ **Dividir os preços por 100** — o Medusa armazena os preços como valores de exibição
- ❌ **Não limpar o estado do carrinho após o pedido** — após a finalização bem-sucedida do pedido, invalide o contexto/cache do carrinho

---

## Painel de resumo do checkout

```typescript
// Template: modules/checkout/templates/checkout-summary
```

- Mostra os itens do carrinho, quantidades e totais em uma barra lateral (desktop) ou em um painel recolhível (dispositivos móveis)
- Inclui o componente `PromotionCode` para inserção de código de desconto
- Permanece visível em todas as etapas do checkout

---

## Testando o checkout

### Testes unitários

- Teste a lógica de `resolveCheckoutSurfaceState` com vários estados do carrinho
- Teste casos extremos de `normalizeCheckoutSurfaceStep`
- Teste a ordem de `canAccessCheckoutSurfaceStep`

### Testes E2E

- Use o modo de fixture local (`isLocalE2EModeEnabled()`) para testes determinísticos do checkout
- O fixture fornece carrinho, cliente, formas de envio e formas de pagamento
- Consulte `e2e/checkout-flow.spec.ts` para ver os padrões de teste E2E existentes

### Lista de verificação para verificação manual

- [ ] Não é possível avançar para uma etapa além daquela permitida pelo estado do carrinho
- [ ] As formas de pagamento são carregadas do Medusa (não estão codificadas manualmente)
- [ ] O menu suspenso de países mostra apenas os países da região
- [ ] O elemento de cartão do Stripe é exibido para o provedor Stripe
- [ ] O bloqueio de pagamento B2B funciona quando é necessária aprovação
- [ ] O aviso de limite de gastos é exibido quando excedido
- [ ] O pedido é concluído com sucesso e o carrinho é esvaziado
- [ ] O layout para dispositivos móveis não apresenta problemas de rolagem/excesso de conteúdo