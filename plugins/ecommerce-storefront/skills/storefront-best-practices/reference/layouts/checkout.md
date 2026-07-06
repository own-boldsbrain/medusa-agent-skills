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
- When payment is locked, the payment step is not rendered
- An `ApprovalStatusBanner` shows the pending approval state
- Admin users with approved status bypass the lock

### Review Step Spending Limit

```typescript
// In Review component
const spendLimitExceeded = customer ? checkSpendingLimit(cart, customer) : false

// If exceeded → show warning + disabled "Revisar aprovacao" button
// If within limit → show PaymentButton (place order)
```

---

## Checkout Page

### Route

```
app/[countryCode]/(checkout)/checkout/page.tsx
```

### E2E Local Fixture Mode

The checkout page supports local fixture mode for E2E testing without a live backend:

```typescript
const isLocalE2EMode = isLocalE2EModeEnabled()
const localFixture = isLocalE2EMode
  ? getLocalCheckoutFixture(resolvedSearchParams?.fixture)
  : null

const cart = localFixture?.cart ?? (await retrieveCart(cartId))
const customer = localFixture?.customer ?? (await retrieveCustomer())
```

**Pattern:** Always guard `localFixture` behind `isLocalE2EModeEnabled()` — this flag should never be active in production.

---

## Fetching Payment Methods

**CRITICAL:** Always fetch payment methods from Medusa by region ID — never hardcode.

```typescript
// In CheckoutWorkspace (server)
const availablePaymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
```

**Why:** Payment providers vary per region. Hardcoding causes checkout to break when regions change.

---

## Checkout Stepper Component

The stepper is presentational — it reads `?step=` from URL params.

```typescript
const CHECKOUT_STEPS = [
  { id: "shipping-address", label: "Entrega" },
  { id: "billing-address", label: "Faturamento" },
  { id: "delivery", label: "Frete" },
  { id: "contact-details", label: "Contato" },
  { id: "payment", label: "Pagamento" },
] as const
```

**Key accessibility requirement:** Each step circle uses `aria-current="step"` when active.

---

## Step Navigation Pattern

Navigation between steps uses `useRouter` + `useSearchParams`:

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

**Use `scroll: false`** on all step transitions to prevent page jump. The checkout layout is a single-page flow where step content replaces inline without scroll-to-top.

---

## Payment Integration

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

### Payment Session Initiation

```typescript
await initiatePaymentSession(cart, {
  provider_id: selectedPaymentMethod,
})
```

**Pattern:** Always call `initiatePaymentSession` when the provider changes OR when there is no active session.

### Payment Wrapper

`PaymentWrapper` provides Stripe context to the entire checkout:

```typescript
// app/[countryCode]/(checkout)/checkout/page.tsx
<Wrapper cart={cart}>
  <CheckoutWorkspace ... />
</Wrapper>
```

The `StripeContext` (via `useContext`) is available throughout the checkout tree.

---

## Address Forms

### Shipping Address

```typescript
// Component: modules/checkout/components/shipping-address
// Form: modules/checkout/components/shipping-address-form
```

- Saves via `setShippingAddress(cart.id, addressPayload)`
- Countries are fetched from `cart.region?.countries` — **NEVER show all countries**, only the region's countries
- Persists address to `localStorage` for pre-fill on return visits

### Billing Address

```typescript
// Component: modules/checkout/components/billing-address
// Form: modules/checkout/components/billing-address-form
```

- Supports "same as shipping" toggle
- Independent address form when billing differs from shipping
- Uses `updateCart` to persist billing address

### Address Select (Saved Addresses)

```typescript
// Component: modules/checkout/components/address-select
```

- For authenticated users with saved addresses
- Populates form fields from selected address

---

## Company Step (B2B)

```typescript
// Component: modules/checkout/components/company
// Form: modules/checkout/components/company-form
```

- Shown when `cart?.company` exists
- Collects company name, registration number, tax ID
- Required before proceeding to shipping address

---

## Checkout Totals

```typescript
// Component: modules/checkout/components/checkout-totals
```

- Displays subtotal, shipping, taxes, discount, gift card, total
- Uses `convertToLocale` for price formatting
- **Do NOT divide prices by 100** — Medusa prices are in display format

---

## Error Handling

```typescript
// Component: modules/checkout/components/error-message
```

- All async step actions catch errors and set `error` state
- `ErrorMessage` component renders below submit button
- Reset `error` to `null` whenever `isOpen` changes (step focus changes)

---

## Common Mistakes to Avoid

- ❌ **Fetching payment methods client-side** — fetch server-side in `CheckoutWorkspace` to avoid waterfall
- ❌ **Showing all countries** — only show `cart.region?.countries`
- ❌ **Hardcoding payment providers** — always use `listCartPaymentMethods(region_id)`
- ❌ **Jumping steps** — always enforce `furthestAccessibleStep` from surface steps logic
- ❌ **Skipping `scroll: false`** on step navigation — causes jarring scroll-to-top
- ❌ **Placing order before payment session** — ensure `initiatePaymentSession` completes before routing to review
- ❌ **Dividing prices by 100** — Medusa stores prices as display values
- ❌ **Not clearing cart state after order** — after successful order placement, invalidate cart context/cache

---

## Checkout Summary Panel

```typescript
// Template: modules/checkout/templates/checkout-summary
```

- Shows cart items, quantities, and totals in a sidebar (desktop) or collapsible panel (mobile)
- Includes `PromotionCode` component for discount code entry
- Stays visible across all checkout steps

---

## Testing Checkout

### Unit Tests

- Test `resolveCheckoutSurfaceState` logic with various cart states
- Test `normalizeCheckoutSurfaceStep` edge cases
- Test `canAccessCheckoutSurfaceStep` ordering

### E2E Tests

- Use local fixture mode (`isLocalE2EModeEnabled()`) for deterministic checkout tests
- Fixture provides cart, customer, shipping methods, and payment methods
- See `e2e/checkout-flow.spec.ts` for existing E2E test patterns

### Manual Verification Checklist

- [ ] Cannot navigate to a step beyond what cart state allows
- [ ] Payment methods load from Medusa (not hardcoded)
- [ ] Countries dropdown only shows region's countries
- [ ] Stripe card element appears for Stripe provider
- [ ] B2B payment lock works when approval required
- [ ] Spend limit warning shows when exceeded
- [ ] Order places successfully and cart clears
- [ ] Mobile layout does not have scroll/overflow issues