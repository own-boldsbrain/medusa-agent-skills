# Princípios e padrões de carregamento de dados

## Índice

- [Regras fundamentais](#regras-fundamentais)
- [Lista de verificação “Pense antes de programar”](#lista-de-verificacao-pense-antes-de-programar)
- [Erro comum x Padrão correto](#erro-comum-x-padrao-correto)
- [Trabalhando com o Tanstack Query](#trabalhando-com-o-tanstack-query)
- [Buscando dados com useQuery](#buscando-dados-com-usequery)
  - [Consulta básica](#consulta-basica)
  - [Consulta paginada](#consulta-paginada)
  - [Consulta com dependências](#consulta-com-dependencias)
  - [Recuperação de vários itens por IDs](#recuperacao-de-varios-itens-por-ids)
- [Atualização de dados com useMutation](#atualizacao-de-dados-com-usemutation)
  - [Mutação básica](#mutacao-basica)
  - [Mutação com estado de carregamento](#mutacao-com-estado-de-carregamento)
  - [Criação de mutação](#mutacao-com-estado-de-carregamento)
  - [Exclusão de mutação](#mutacao-com-estado-de-carregamento)
- [Diretrizes para invalidação de cache](#diretrizes-para-invalidacao-de-cache)
- [Observações importantes sobre metadados](#observacoes-importantes-sobre-metadados)
- [Padrões comuns](#padroes-comuns)
  - [Padrão: Busca de dados com paginação](#padrao-busca-de-dados-com-paginacao)
  - [Padrão: Pesquisa com debounce](#padrao-pesquisa-com-debounce)
  - [Padrão: Atualização de metadados com useMutation](#padrao-atualizacao-de-metadados-com-usemutation)
- [Problemas comuns e soluções](#problemas-comuns-e-solucoes)
- [Exemplo completo: Widget com consultas separadas](#exemplo-completo-widget-com-consultas-separadas)

## Regras fundamentais

1. **SEMPRE use o SDK do Medusa JS** — NUNCA use o fetch() comum para solicitações de API (a falta de cabeçalhos causa erros de autenticação/autorização)
2. **Os dados exibidos devem ser carregados na montagem** — Quaisquer dados exibidos na interface principal do widget devem ser buscados quando o componente for montado, e não de forma condicional
3. **Separar as preocupações** — As consultas de dados de modais/formulários devem ser independentes das consultas de dados de exibição
4. **Lidar adequadamente com dados de referência** — Ao armazenar IDs/referências (em metadados ou em qualquer outro lugar), é necessário buscar as entidades completas para exibi-las
5. **Sempre mostre o status de carregamento** — Os usuários devem ver indicadores de carregamento, e não telas vazias, enquanto os dados estão sendo buscados
6. **Invalide as consultas corretas** — Após alterações, invalide as consultas que fornecem dados de exibição, e não apenas as consultas dos modais

## Lista de verificação “Pense antes de programar”

Antes de implementar qualquer widget que exiba dados:

- [ ] Estou usando o SDK do Medusa JS para todas as solicitações de API (em vez do `fetch` comum)?
- [ ] Para endpoints integrados, estou usando os métodos existentes do SDK (em vez de `sdk.client.fetch`)?
- [ ] Quais dados precisam estar visíveis imediatamente?
- [ ] Onde esses dados estão armazenados? (metadados, endpoint separado, entidades relacionadas)
- [ ] Se estiver armazenando IDs, como vou buscar as entidades completas para exibição?
- [ ] Minhas consultas de exibição estão separadas das consultas de interação?
- [ ] Adicionei estados de carregamento para todas as buscas de dados?
- [ ] Quais consultas precisam ser invalidadas após atualizações para atualizar a exibição?

## Erro comum x Padrão correto

### ❌ ERRADO - Uma única consulta tanto para a exibição quanto para o modal

```tsx
// This breaks on page refresh!
const { data } = useQuery({
  queryFn: () => sdk.admin.product.list(),
  enabled: modalOpen, // Display won't work on mount!
})

// Trying to display filtered data from modal query
const displayItems = data?.filter((item) => ids.includes(item.id)) // No data until modal opens
```

**Por que isso está errado:**

- Ao atualizar a página, o modal é fechado, portanto a consulta não é executada
- O usuário vê uma tela vazia em vez de seus dados
- A exibição depende da interação com o modal

### ✅ CORRETO - Consultas separadas com invalidação adequada

```tsx
// Display data - loads immediately
const { data: displayData } = useQuery({
  queryFn: () => fetchDisplayData(),
  queryKey: ["display-data", product.id],
  // No 'enabled' condition - loads on mount
})

// Modal data - loads when needed
const { data: modalData } = useQuery({
  queryFn: () => fetchModalData(),
  queryKey: ["modal-data"],
  enabled: modalOpen, // OK for modal-only data
})

// Mutation with proper cache invalidation
const updateMutation = useMutation({
  mutationFn: updateFunction,
  onSuccess: () => {
    // Invalidate display data query to refresh UI
    queryClient.invalidateQueries({ queryKey: ["display-data", product.id] })
    // Also invalidate the entity if it caches the data
    queryClient.invalidateQueries({ queryKey: ["product", product.id] })
  },
})
```

**Por que isso está correto:**

- A consulta de exibição é executada imediatamente ao montar o componente
- A consulta modal só é executada quando necessário
- A invalidação adequada garante que a interface do usuário seja atualizada após as alterações
- Cada consulta tem uma responsabilidade clara e distinta

## Usando o SDK do Medusa JS

**⚠️ CRÍTICO: SEMPRE use o SDK do Medusa JS para TODAS as solicitações de API — NUNCA use o fetch() comum**

### Por que o SDK é necessário

- **Rotas de administração** exigem o cabeçalho `Authorization` e o cookie de sessão — o SDK os adiciona automaticamente
- **Rotas da loja** exigem o cabeçalho `x-publishable-api-key` — o SDK os adiciona automaticamente
- **O fetch() padrão** não inclui esses cabeçalhos → erros de autenticação/autorização
- O uso de métodos existentes do SDK oferece maior segurança de tipos e autocompletar

### Quando usar o quê

```tsx
import { sdk } from "../lib/client"

// ✅ CORRECT - Built-in endpoint: Use existing SDK method
const product = await sdk.admin.product.retrieve(productId, {
  fields: "+metadata,+variants.*"
})

// ✅ CORRECT - Custom endpoint: Use sdk.client.fetch()
const reviews = await sdk.client.fetch(`/admin/products/${productId}/reviews`)

// ❌ WRONG - Using regular fetch for ANY endpoint
const response = await fetch(`http://localhost:9000/admin/products/${productId}`)
// ❌ Error: Missing Authorization header!
```

### Seleção de métodos do SDK

**Para endpoints integrados do Medusa:**

- Use os métodos existentes do SDK: `sdk.admin.product.list()`, `sdk.store.product.list()`, etc.
- Oferece segurança de tipos, autocompletar e tratamento adequado dos cabeçalhos
- Referência: [Documentação do SDK do Medusa para JS](https://docs.medusajs.com/resources/medusa-js-sdk)

**Para rotas de API personalizadas:**

- Use `sdk.client.fetch()` para seus endpoints personalizados
- O SDK ainda lida com todos os cabeçalhos necessários (autenticação, chaves de API)
- Passe objetos simples para o corpo da solicitação (o SDK lida com a serialização JSON)

## Trabalhando com o Tanstack Query

Os widgets e rotas de administração já vêm com o Tanstack Query pré-configurado.

**⚠️ Usuários do pnpm**: É OBRIGATÓRIO instalar o `@tanstack/react-query` ANTES de usar o `useQuery` ou o `useMutation`. Instale a versão exata indicada no painel:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
pnpm add @tanstack/react-query@[exact-version]
```

**Usuários do npm/yarn**: NÃO instale `@tanstack/react-query` — ele já está disponível por meio das dependências do painel de controle.

## Buscando dados com useQuery

### Consulta básica

```tsx
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client"

const { data, isLoading, error } = useQuery({
  queryFn: () => sdk.admin.product.retrieve(productId, {
    fields: "+metadata,+variants.*",
  }),
  queryKey: ["product", productId],
})
```

### Consulta paginada

```tsx
const limit = 15
const offset = pagination.pageIndex * limit

const { data: products } = useQuery({
  queryFn: () =>
    sdk.admin.product.list({
      limit,
      offset,
      q: searchTerm, // for search
    }),
  queryKey: ["products", limit, offset, searchTerm],
  keepPreviousData: true, // Prevents UI flicker during pagination
})
```

### Consulta com dependências

```tsx
// Only fetch if productId exists
const { data } = useQuery({
  queryFn: () => sdk.admin.product.retrieve(productId),
  queryKey: ["product", productId],
  enabled: !!productId, // Only run when productId is truthy
})
```

### Recuperação de vários itens por IDs

```tsx
// For display - fetch specific items by IDs
const { data: displayProducts } = useQuery({
  queryFn: async () => {
    if (selectedIds.length === 0) return { products: [] }

    const response = await sdk.admin.product.list({
      id: selectedIds, // Fetch only the selected products
      limit: selectedIds.length,
    })
    return response
  },
  queryKey: ["related-products-display", selectedIds],
  enabled: selectedIds.length > 0, // Only fetch if there are IDs
})
```

## Atualização de dados com useMutation

### Mutação básica

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@medusajs/ui"

const queryClient = useQueryClient()

const updateProduct = useMutation({
  mutationFn: (payload) => sdk.admin.product.update(productId, payload),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["product", productId] })
    toast.success("Product updated successfully")
  },
  onError: (error) => {
    toast.error(error.message || "Failed to update product")
  },
})

// Usage
const handleSave = () => {
  updateProduct.mutate({
    metadata: {
      ...existingMetadata,
      new_field: "value",
    },
  })
}
```

### Mutação com estado de carregamento

```tsx
<Button
  onClick={handleSave}
  isLoading={updateProduct.isPending}
>
  Save
</Button>
```

### Criar mutação

```tsx
const createProduct = useMutation({
  mutationFn: (data) => sdk.admin.product.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success("Product created successfully")
    setOpen(false)
  },
})
```

### Excluir mutação

```tsx
const deleteProduct = useMutation({
  mutationFn: (id) => sdk.admin.product.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success("Product deleted")
  },
})
```

## Diretrizes para invalidação de cache

Após alterações, invalide as consultas que afetam o que o usuário vê:

```tsx
onSuccess: () => {
  // Invalidate the entity itself if it stores the data
  queryClient.invalidateQueries({ queryKey: ["product", productId] })

  // Invalidate display-specific queries
  queryClient.invalidateQueries({ queryKey: ["related-products", productId] })

  // Don't need to invalidate modal selection queries
  // queryClient.invalidateQueries({ queryKey: ["products-list"] }) // Not needed
}
```

**Pontos-chave:**

- Use chaves de consulta específicas com IDs para invalidação direcionada
- Invalide tanto as consultas de dados da entidade quanto as de exibição quando necessário
- Leve em consideração o que o usuário vê e garanta que essas consultas sejam atualizadas
- Consultas modais/de seleção normalmente não precisam de invalidação

## Observações importantes sobre metadados

- Ao atualizar objetos aninhados nos metadados, passe o objeto inteiro (o Medusa não mescla objetos aninhados)
- Para remover uma propriedade de metadados, defina-a como uma string vazia
- Os metadados são armazenados como JSONB no banco de dados

**Exemplo: Atualização de metadados**

```tsx
// ✅ CORRECT - Spread existing metadata
updateProduct.mutate({
  metadata: {
    ...product.metadata,
    new_field: "value",
  },
})

// ❌ WRONG - Overwrites all metadata
updateProduct.mutate({
  metadata: {
    new_field: "value", // All other fields lost!
  },
})
```

## Padrões comuns

### Padrão: Busca de dados com paginação

```tsx
const limit = 15
const offset = pagination.pageIndex * limit

const { data } = useQuery({
  queryFn: () => sdk.admin.product.list({ limit, offset }),
  queryKey: ["products", limit, offset],
  keepPreviousData: true, // Prevents UI flicker during pagination
})
```

### Padrão: Pesquisa com debounce

```tsx
import { useDebouncedValue } from "@mantine/hooks" // or implement your own

const [search, setSearch] = useState("")
const [debouncedSearch] = useDebouncedValue(search, 300)

const { data } = useQuery({
  queryFn: () => sdk.admin.product.list({ q: debouncedSearch }),
  queryKey: ["products", debouncedSearch],
})
```

### Padrão: Atualização de metadados com useMutation

```tsx
const updateMetadata = useMutation({
  mutationFn: (metadata) => sdk.admin.product.update(productId, { metadata }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["product", productId] })
    toast.success("Updated successfully")
  },
})
```

## Problemas comuns e soluções

### Erros de autenticação/autorização ao buscar dados

**Sintomas:**

- A API retorna 401 Não autorizado ou 403 Proibido
- Erro “Faltando o cabeçalho x-publishable-api-key”
- Erro “Não autorizado” nas rotas de administração

**Causa:** Uso do `fetch()` comum em vez do SDK do Medusa JS

**Solução:**

```tsx
// ❌ WRONG - Missing required headers
const { data } = useQuery({
  queryFn: () => fetch('http://localhost:9000/admin/products').then(r => r.json()),
  queryKey: ["products"]
})

// ✅ CORRECT - SDK handles headers automatically
const { data } = useQuery({
  queryFn: () => sdk.admin.product.list(),
  queryKey: ["products"]
})

// ✅ CORRECT - For custom routes
const { data } = useQuery({
  queryFn: () => sdk.client.fetch('/admin/custom-route'),
  queryKey: ["custom-data"]
})
```

### “Nenhum QueryClient definido; use o QueryClientProvider para definir um”

- **Usuários do pnpm**: Você esqueceu de instalar o `@tanstack/react-query` antes da implementação. Instale-o agora com a versão exata indicada no painel
- **Usuários do npm/yarn**: Você instalou incorretamente o `@tanstack/react-query` — remova-o do `package.json`
- Nunca envolva seu componente em `QueryClientProvider` — ele já está disponível

### A pesquisa não está filtrando os resultados

- A pesquisa ocorre no lado do servidor por meio do parâmetro `q`
- Certifique-se de passar o valor da pesquisa em seu `queryFn`:

```tsx
queryFn: () => sdk.admin.product.list({ q: searchValue })
```

### Atualizações de metadados não estão funcionando

- Sempre passe o objeto de metadados completo (atualizações parciais não são mescladas)
- Para remover um campo, defina-o como uma string vazia, e não como `null` ou `undefined`

### O widget não atualiza após a mutação

- Use `queryClient.invalidateQueries()` com a chave de consulta correta
- Certifique-se de que sua chave de consulta inclua todas as dependências (busca, paginação etc.)

### Os dados aparecem vazios ao atualizar a página

- Sua consulta contém `enabled: modalOpen` ou uma condição semelhante
- Os dados exibidos NUNCA devem ser ativados condicionalmente com base no estado da interface do usuário
- Mude as consultas condicionais para modais/formulários apenas

## Exemplo completo: Widget com consultas separadas

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { Container, Heading, Button, FocusModal, toast } from "@medusajs/ui"
import { sdk } from "../lib/client"

const RelatedProductsWidget = ({ data: product }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Parse existing related product IDs from metadata
  const relatedIds = useMemo(() => {
    if (product?.metadata?.related_product_ids) {
      try {
        const ids = JSON.parse(product.metadata.related_product_ids)
        return Array.isArray(ids) ? ids : []
      } catch {
        return []
      }
    }
    return []
  }, [product?.metadata?.related_product_ids])

  // Query 1: Fetch selected products for display (loads on mount)
  const { data: displayProducts } = useQuery({
    queryFn: async () => {
      if (relatedIds.length === 0) return { products: [] }
      const response = await sdk.admin.product.list({
        id: relatedIds,
        limit: relatedIds.length,
      })
      return response
    },
    queryKey: ["related-products-display", relatedIds],
    enabled: relatedIds.length > 0,
  })

  // Query 2: Fetch products for modal selection (only when modal is open)
  const { data: modalProducts, isLoading } = useQuery({
    queryFn: () => sdk.admin.product.list({ limit: 10, offset: 0 }),
    queryKey: ["products-selection"],
    enabled: open, // Only load when modal is open
  })

  // Mutation to update the product metadata
  const updateProduct = useMutation({
    mutationFn: (relatedProductIds) => {
      return sdk.admin.product.update(product.id, {
        metadata: {
          ...product.metadata,
          related_product_ids: JSON.stringify(relatedProductIds),
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      queryClient.invalidateQueries({ queryKey: ["related-products-display"] })
      toast.success("Related products updated")
      setOpen(false)
    },
  })

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading>Related Products</Heading>
        <Button onClick={() => setOpen(true)}>Edit</Button>
      </div>

      {/* Display current selection */}
      <div>
        {displayProducts?.products.map((p) => (
          <div key={p.id}>{p.title}</div>
        ))}
      </div>

      {/* Modal for selection */}
      <FocusModal open={open} onOpenChange={setOpen}>
        {/* Modal content with selection UI */}
      </FocusModal>
    </Container>
  )
}
```
