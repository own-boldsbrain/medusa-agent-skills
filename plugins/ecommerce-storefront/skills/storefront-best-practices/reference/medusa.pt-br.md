# Integração Backend Medusa

## Conteúdo

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração do SDK](#configuracao-do-sdk)
- [Vite Configuration](#configuração-vite-tanstack-start-vite-projects)
- [Tipos TypeScript](#typescript-types)
- [Exibição de Preços](#exibição-de-preços)
- [Organização do SDK](#organizacao-do-sdk)
- [Padrões de Medusa Críticos](#padrões-de-medusa-críticos)
- [Gerenciamento de Estado da Região](#gerenciamento-de-estado-da-região)

## Visão geral

Guide for connecting your storefront to Medusa backend using the [Medusa JS SDK](https://docs.medusajs.com/resources/js-sdk).

**When to use this guide:**

- Construindo uma loja com backend Medusa
- Preciso integrar o SDK da Medusa corretamente
- Trabalhando com lojas multi-região
- Manipulando preços e regiões específicos do Medusa

**Para padrões gerais de backend**, veja `reference/connecting-to-backend.md`.

## ⚠️ CRÍTICO: Siga o Fluxo de Trabalho de Verificação em 5 Passos

**ANTES de escrever código que chama métodos da SDK Medusa**, siga o fluxo de trabalho obrigatório do SKILL.md:

1. **PAUSA** - Não escreva código ainda
2. **CONSULTA** servidor MCP ou documentos (<https://docs.medusajs.com/resources/js-sdk>) para o método exato
3. **VERIFIQUE** com o usuário o que você encontrou.
4. **ESCREVA** código usando método verificado
5. **CHECK** for TypeScript errors - Type errors mean wrong method name or parameters

**Se você vir erros de TypeScript nos métodos do SDK, você usou métodos incorretos. Volte ao Passo 2 e verifique novamente.**

**Este arquivo mostra PADRÕES (o que fazer), não métodos exatos (como fazer). Sempre verifique os nomes dos métodos com MCP/docs antes de usar.**

## 💡 RECOMENDADO: Configurar o Servidor Medusa MCP

**Se o servidor Medusa MCP não estiver instalado, recomenda-se fortemente configurá-lo.**

**Instruções de configuração**: adicionar servidor HTTP MCP com URL <https://docs.medusajs.com/mcp>

O servidor MCP fornece verificação de método em tempo real sem sair do seu IDE.

## Instalação

```bash
npm install @medusajs/js-sdk@latest @medusajs/types@latest
```

Ambos necessários: SDK fornece funcionalidade, tipos fornecem suporte TypeScript.

## Configuração do SDK

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

**CRITICAL: Always set publishableKey.**

- Necessário para lojas multirregionais obterem preços corretos
- Required for accessing products with regional prices
- Sem ele, as consultas de produtos podem falhar ou retornar preços incorretos
- Obtenha a chave publicável no painel de administração do Medusa em Configurações → Chaves de API Publicáveis

**IMPORTANTE: Configuração da Porta da Loja**

- **Execute a loja virtual na porta 8000** para evitar erros de CORS
- A configuração CORS padrão do backend do Medusa espera uma loja em `http://localhost:8000`
- Se estiver usando uma porta diferente, configure o CORS no backend do Medusa em `medusa-config.ts`:

  ```typescript
  store_cors: process.env.STORE_CORS || "http://localhost:YOUR_PORT"
  ```

- Padrões comuns de estrutura:
  - Next.js: Porta 3000 (precisa de atualização de configuração CORS)
  - TanStack Início: Porta 3000 (precisa de atualização na configuração CORS)
  - Vite: Porta 5173 (precisa de atualização na configuração do CORS)
  - **Recomendado**: Use a porta 8000 para evitar alterações de configuração

## Configuração do Vite (TanStack Start, Projetos Vite)

**IMPORTANTE: Para projetos baseados em Vite, configure as dependências externas do SSR.**

Adicione isso ao seu `vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  ssr: {
    noExternal: ['@medusajs/js-sdk'],
  },
})
```

**Por que isso é necessário:**

- Medusa JS SDK deve ser processado pelo Vite durante o SSR
- Sem esta configuração, as chamadas do SDK falharão durante a renderização no lado do servidor
- Aplica-se ao TanStack Start, vanilla Vite e outros frameworks baseados em Vite

## Tipos TypeScript

**IMPORTANT: Always use `@medusajs/types` - never define custom types.**

```typescript
import type {
  StoreProduct,
  StoreCart,
  StoreCartLineItem,
  StoreRegion,
  StoreProductCategory,
  StoreCustomer,
  StoreOrder
} from "@medusajs/types"
```

**Por que usar tipos oficiais:**

- Definições de tipo completas e precisas
- Atualizado a cada lançamento do Medusa
- Inclui todos os relacionamentos e campos de entidade
- Evita incompatibilidades de tipo com respostas da API

## Price Display

**CRÍTICO: Os preços do Medusa são armazenados como estão - NÃO divida por 100.**

Ao contrário do Stripe (onde os valores são em centavos), o Medusa armazena os preços no valor de exibição.

```typescript
// ❌ WRONG - Dividing by 100
<div>${product.variants[0].prices[0].amount / 100}</div>

// ✅ CORRECT - Display as-is
<div>${product.variants[0].prices[0].amount}</div>
```

**Formatação correta de preços:**

```typescript
const formatPrice = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}
```

**Campos de preço a serem usados:**

- `variant.calculated_price.calculated_amount` - Preço final incluindo promoções
- `variant.calculated_price.original_amount` - Preço original antes de descontos
- Ambos já estão no formato de exibição - nenhuma conversão necessária

## SDK Organização

O Medusa SDK é organizado por recursos:

- `sdk.store.product.*` - Operações de produto
- `sdk.store.cart.*` - Operações de carrinho
- `sdk.store.category.*` - Operações de categoria
- `sdk.store.customer.*` - Customer operations (authenticated)
- `sdk.store.order.*` - Operações de pedidos (autenticado)
- `sdk.store.payment.*` - Operações de pagamento
- `sdk.store.fulfillment.*` - Operações de envio/entrega
- `sdk.store.region.*` - Operações de região

**Para encontrar métodos específicos**: Consulte a documentação (<https://docs.medusajs.com/resources/js-sdk>) ou use o servidor MCP.

## Padrões Críticos da Medusa

**IMPORTANTE**: Os padrões abaixo mostram O QUE fazer, não o EXATAMENTE COMO. Sempre verifique nomes e assinaturas de métodos com o servidor MCP ou documentação antes de usar.

### 1. Sempre passe `region_id` para Produtos

**Padrão**: Consultas de produtos exigem o parâmetro `region_id` para preços corretos.

**Por que:** Sem `region_id`, `calculated_price` será ausente ou incorreto.

**Para implementar**: Consultar MCP/docs para métodos de listagem e recuperação de produtos. Passar `region_id: selectedRegion.id` como parâmetro.

### 2. Padrão de Atualizações do Carrinho

**Padrão**: Itens de linha têm métodos dedicados (criar, atualizar, excluir). Outras propriedades do carrinho usam um método genérico de atualização.

**Operações de item de linha** (verificar nomes exatos dos métodos com MCP/docs):

- Adicionar item ao carrinho
- Atualizar quantidade do item
- Remova o item do carrinho

**Outras atualizações do carrinho** (e-mail, endereços, região, cupons de promoção):

- Use cart's generic update method

**Para implementar**: Consulte o servidor MCP ou a documentação para assinaturas exatas dos métodos de carrinho:  
<https://docs.medusajs.com/resources/references/js-sdk/store/cart>

### 3. Padrão de Fluxo de Pagamento

**Fluxo de trabalho de alto nível:**

1. Consultar os provedores de pagamento disponíveis para a região do carrinho
2. Usuário seleciona método de pagamento
3. Inicializar sessão de pagamento para o provedor selecionado
4. Renderizar interface específica do provedor (Stripe Elements, etc.)
5. Complete payment through provider

**Para implementar**: Consultar MCP/docs para:

- Método de listagem de provedor de pagamento
- Payment session initialization method
- Payment completion method

**Recursos**:

- Servidor MCP (se instalado)
- Medusa payment docs: <https://docs.medusajs.com/resources/references/js-sdk/store/payment>
- `referência/layouts/checkout.md` para fluxo de checkout

### 4. Padrão de Fluxo de Checkout

**Fluxo de trabalho de alto nível:**

1. Collect shipping address
2. Query available shipping options for cart
3. User selects shipping method
4. Coletar informações de pagamento
5. Initialize payment session
6. Completar/fazer pedido

**To implement**: Query MCP/docs for each step's methods. Don't guess method names.

### 5. Busca de Categoria

**Pattern**: Fetch categories from `sdk.store.category.*` resource.

**To implement**: Query MCP/docs for category listing method. See `reference/components/navbar.md` for usage patterns.

## Region State Management

**Crítico para a Medusa**: A região determina a moeda, os preços, os impostos e os produtos disponíveis.

### Why Region Context Matters

Medusa requer região para:

- Criando carrinhos (deve passar `region_id`)
- Recuperando produtos com preços corretos
- Determinando cálculos de moeda e impostos
- Filtering available payment and shipping methods

### Implementation Approach

**Fluxo de trabalho de alto nível:**

1. Buscar regiões disponíveis ao carregar o aplicativo (consultar MCP/documentação para método de listagem de regiões)
2. Detectar o país do usuário (IP, localidade do navegador ou seleção do usuário)
3. Encontre a região que contém esse país
4. Armazene a região selecionada globalmente (React Context, Zustand, etc.)
5. Use `selectedRegion.id` for all cart and product operations

**Quando o usuário muda de país:**

- Encontre uma nova região contendo o país
- Update cart with new region_id (query MCP/docs for cart update method)
- Store selection in localStorage for persistence

**To implement**: Query MCP server or docs for exact region and cart methods. Don't copy example code without verification.

**Para uma implementação detalhada de região com exemplos de código**, veja:

- `reference/components/country-selector.md`
- Servidor Medusa MCP (se instalado)
- Documentação do Medusa: <https://docs.medusajs.com/resources/storefront-development/regions/context>

## **Tratamento de Erros**

SDK lança `FetchError` com:

- `status`: código de status HTTP
- `statusText`: Código de erro
- `message`: Mensagem descritiva

```typescript
try {
  const data = await sdk.store.customer.retrieve()
} catch (error) {
  const fetchError = error as FetchError
  if (fetchError.statusText === "Unauthorized") {
    redirect('/login')
  }
}
```

## Pontos de extremidade personalizados

Para rotas de API personalizadas:

```typescript
const data = await sdk.client.fetch(`/custom/endpoint`, {
  method: "POST",
  body: { /* ... */ },
})
```

## Recursos

- **Medusa JS SDK docs**: <https://docs.medusajs.com/resources/js-sdk>
- **Desenvolvimento de loja**: <https://docs.medusajs.com/resources/storefront-development>
- **Fluxo de finalização da compra**: <https://docs.medusajs.com/resources/storefront-development/checkout>
- **Contexto de região**: <https://docs.medusajs.com/resources/storefront-development/regions/context>
- **Use Medusa MCP server** se disponível para pesquisa de método em tempo real
