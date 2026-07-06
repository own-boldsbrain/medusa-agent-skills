# Integração do SDK de front-end

## Índice

- [Padrão do SDK de front-end](#padrao-do-sdk-de-front-end)
  - [Localizando o SDK](#padrao-do-sdk-de-front-end)
  - [Usando sdk.client.fetch()](#using-sdkclientfetch)
- [Padrão do React Query](#padrao-do-sdk-de-front-end)
- [Melhores práticas para chaves de consulta](#melhores-praticas-para-chaves-de-consulta)
- [Tratamento de erros](#tratamento-de-erros)
- [Atualizações otimistas](#atualizacoes-otimistas)

Este guia aborda como integrar rotas de API personalizadas do Medusa a aplicativos front-end usando o SDK do Medusa e o React Query.

**Observação:** as rotas de API também são chamadas de “endpoints” — esses termos são intercambiáveis.

## Padrão do SDK de front-end

### Localizando o SDK

**IMPORTANTE:** Nunca codifique manualmente os caminhos de importação do SDK. Sempre localize primeiro onde o SDK é instanciado no projeto.

Procure por `@medusajs/js-sdk`

A instância do SDK é normalmente exportada como `sdk`:

```typescript
import { sdk } from "[LOCATE IN PROJECT]"
```

### Usando sdk.client.fetch()

**⚠️ CRÍTICO: SEMPRE use o SDK Medusa JS para TODAS as solicitações de API — NUNCA use o fetch() comum**

**Por que isso é crítico:**

- **As rotas da API da loja** exigem a chave de API publicável nos cabeçalhos
- **As rotas da API de administração** exigem cabeçalhos de autenticação
- **A chamada fetch() padrão** sem esses cabeçalhos causará erros
- O SDK lida automaticamente com todos os cabeçalhos necessários para você

**Quando usar o quê:**

- **Endpoints existentes** (rotas integradas do Medusa): Use métodos existentes do SDK, como `sdk.store.product.list()`, `sdk.admin.order.retrieve()`
- **Endpoints personalizados** (suas rotas de API personalizadas): Use `sdk.client.fetch()` para rotas personalizadas

**⚠️ IMPORTANTE: O SDK lida com a serialização JSON automaticamente. NUNCA use JSON.stringify() no corpo da solicitação.**

Chame rotas de API personalizadas usando o SDK:

```typescript
import { sdk } from "[LOCATE SDK INSTANCE IN PROJECT]"

// ✅ CORRECT - Pass object directly
const result = await sdk.client.fetch("/store/my-route", {
  method: "POST",
  body: {
    email: "user@example.com",
    name: "John Doe",
  },
})

// ❌ WRONG - Don't use JSON.stringify
const result = await sdk.client.fetch("/store/my-route", {
  method: "POST",
  body: JSON.stringify({  // ❌ DON'T DO THIS!
    email: "user@example.com",
  }),
})
```

**Pontos-chave:**

- **O SDK lida com a serialização JSON automaticamente** — basta passar objetos simples
- **NUNCA use JSON.stringify()** — isso prejudicará a solicitação
- Não é necessário definir cabeçalhos Content-Type — o SDK os adiciona
- A autenticação por sessão/JWT é tratada automaticamente
- A chave de API publicável é adicionada automaticamente

### Endpoints integrados x Endpoints personalizados

**⚠️ IMPORTANTE: Use o método apropriado do SDK de acordo com o tipo de endpoint**

```typescript
import { sdk } from "[LOCATE SDK INSTANCE IN PROJECT]"

// ✅ CORRECT - Built-in endpoint: Use existing SDK method
const products = await sdk.store.product.list({
  limit: 10,
  offset: 0
})

// ✅ CORRECT - Custom endpoint: Use sdk.client.fetch()
const reviews = await sdk.client.fetch("/store/products/prod_123/reviews")

// ❌ WRONG - Using regular fetch for ANY endpoint
const products = await fetch("http://localhost:9000/store/products")
// ❌ Error: Missing publishable API key header!

// ❌ WRONG - Using regular fetch for custom endpoint
const reviews = await fetch("http://localhost:9000/store/products/prod_123/reviews")
// ❌ Error: Missing publishable API key header!

// ❌ WRONG - Using sdk.client.fetch() for built-in endpoint when SDK method exists
const products = await sdk.client.fetch("/store/products")
// ❌ Less type-safe than using sdk.store.product.list()
```

**Por que isso é importante:**

- **Rotas de loja** exigem o cabeçalho `x-publishable-api-key` — o SDK o adiciona automaticamente
- **Rotas de administração** exigem os cabeçalhos `Authorization` e o cookie de sessão — o SDK os adiciona automaticamente
- **O fetch() comum** não inclui esses cabeçalhos → a API retorna erros de autenticação/autorização
- Usar os métodos existentes do SDK oferece **maior segurança de tipos** e autocompletar

## Padrão de consulta no React

Use `useQuery` para solicitações GET e `useMutation` para POST/DELETE:

```typescript
import { sdk } from "[LOCATE SDK INSTANCE IN PROJECT]"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function MyComponent({ userId }: { userId: string }) {
  const queryClient = useQueryClient()

  // GET request - fetching data
  const { data, isLoading } = useQuery({
    queryKey: ["my-data", userId],
    queryFn: () => sdk.client.fetch(`/store/my-route?userId=${userId}`),
    enabled: !!userId,
  })

  // POST request - mutation with cache invalidation
  const mutation = useMutation({
    mutationFn: (input: { email: string }) =>
      sdk.client.fetch("/store/my-route", { method: "POST", body: input }),
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["my-data"] })
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <p>{data?.title}</p>
      <button
        onClick={() => mutation.mutate({ email: "test@example.com" })}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Loading..." : "Submit"}
      </button>
      {mutation.isError && <p>Error occurred</p>}
    </div>
  )
}
```

**Estados-chave:** `isLoading`, `isPending`, `isSuccess`, `isError`, `error`

## Melhores práticas para chaves de consulta

Estruture as chaves de consulta para um gerenciamento eficaz do cache:

```typescript
// Good: Hierarchical structure
queryKey: ["products", productId]
queryKey: ["products", "list", { page, filters }]

// Invalidate all product queries
queryClient.invalidateQueries({ queryKey: ["products"] })

// Invalidate specific product
queryClient.invalidateQueries({ queryKey: ["products", productId] })
```

## Tratamento de erros

Lide com erros da API de maneira adequada:

```typescript
const mutation = useMutation({
  mutationFn: (input) => sdk.client.fetch("/store/my-route", {
    method: "POST",
    body: input
  }),
  onError: (error) => {
    console.error("Mutation failed:", error)
    // Show error message to user
  },
})

// In component
{mutation.isError && (
  <p className="error">
    {mutation.error?.message || "An error occurred"}
  </p>
)}
```

## Atualizações otimistas

Atualize a interface do usuário imediatamente antes da confirmação do servidor:

```typescript
const mutation = useMutation({
  mutationFn: (newItem) =>
    sdk.client.fetch("/store/items", { method: "POST", body: newItem }),
  onMutate: async (newItem) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["items"] })

    // Snapshot previous value
    const previousItems = queryClient.getQueryData(["items"])

    // Optimistically update
    queryClient.setQueryData(["items"], (old) => [...old, newItem])

    // Return context with snapshot
    return { previousItems }
  },
  onError: (err, newItem, context) => {
    // Rollback on error
    queryClient.setQueryData(["items"], context.previousItems)
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ["items"] })
  },
})
```
