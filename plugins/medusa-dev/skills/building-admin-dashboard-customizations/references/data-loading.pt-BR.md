# Princípios e Padrões de Carregamento de Dados

## Sumário

- [Regras Fundamentais](#regras-fundamentais)
- [Checklist: Pense Antes de Codificar](#checklist-pense-antes-de-codificar)
- [Erro Comum vs. Padrão Correto](#erro-comum-vs-padrão-correto)
- [Trabalhando com Tanstack Query](#trabalhando-com-tanstack-query)
- [Busca de Dados com useQuery](#busca-de-dados-com-usequery)
  - [Consulta Básica](#consulta-básica)
  - [Consulta Paginação](#consulta-paginação)
  - [Consulta com Dependências](#consulta-com-dependências)
  - [Busca de Múltiplos Itens por IDs](#busca-de-múltiplos-itens-por-ids)
- [Atualizando Dados com useMutation](#atualizando-dados-com-usemutation)
  - [Mutação Básica](#mutação-básica)
  - [Mutação com Estado de Carregamento](#mutação-com-estado-de-carregamento)
  - [Mutação de Criação](#mutação-de-criação)
  - [Mutação de Exclusão](#mutação-de-exclusão)
- [Diretrizes de Invalidação de Cache](#diretrizes-de-invalidação-de-cache)
- [Notas Importantes sobre Metadados](#notas-importantes-sobre-metadados)
- [Padrões Comuns](#padrões-comuns)
  - [Padrão: Busca de Dados com Paginação](#padrão-busca-de-dados-com-paginação)
  - [Padrão: Busca com Debounce](#padrão-busca-com-debounce)
  - [Padrão: Atualização de Metadados com useMutation](#padrão-atualização-de-metadados-com-usemutation)
- [Problemas e Soluções Comuns](#problemas-e-soluções-comuns)
- [Exemplo Completo: Widget com Consultas Separadas](#exemplo-completo-widget-com-consultas-separadas)

## Regras Fundamentais

1. **SEMPRE use o Medusa JS SDK** - NUNCA use `fetch()` padrão para requisições de API (ausência de headers causa erros de autenticação/autorização)
2. **Exibição de dados deve carregar no mount** - Qualquer dado exibido na interface principal do widget deve ser buscado quando o componente montar, e não de forma condicional.
3. **Separe as preocupações (Separate concerns)** - As consultas de dados de modais/formulários devem ser independentes das consultas de dados de exibição.
4. **Trate dados de referência adequadamente** - Ao armazenar IDs/referências (em metadados ou em outro lugar), você deve buscar as entidades completas para exibi-las.
5. **Sempre mostre estados de carregamento** - Os usuários devem ver indicadores de carregamento, e não estados vazios, enquanto os dados estão sendo buscados.
6. **Invalidar as consultas corretas** - Após mutações, invalide as consultas que fornecem os dados de exibição, e não apenas as consultas do modal.

## Checklist: Pense Antes de Codificar

Antes de implementar qualquer widget que exiba dados:

- [ ] Estou usando o Medusa JS SDK para todas as requisições de API (e não `fetch()` padrão)?
- [ ] Para endpoints embutidos, estou usando métodos existentes do SDK (e não `sdk.client.fetch`)?
- [ ] Quais dados precisam ser visíveis imediatamente?
- [ ] Onde esses dados estão armazenados? (metadados, endpoint separado, entidades relacionadas)
- [ ] Se estiver armazenando IDs, como vou buscar as entidades completas para exibição?
- [ ] Minhas consultas de exibição estão separadas das consultas de interação?
- [ ] Adicionei estados de carregamento para todos os carregamentos de dados?
- [ ] Quais consultas precisam de invalidação após atualizações para atualizar a exibição?

## Erro Comum vs. Padrão Correto

### ❌ ERRADO - Consulta única para exibição e modal

```tsx
// Isso falha ao recarregar a página!
const { data } = useQuery({
  queryFn: () => sdk.admin.product.list(),
  enabled: modalOpen, // A exibição não funcionará no mount!
})

// Tentando exibir dados filtrados da consulta do modal
const displayItems = data?.filter((item) => ids.includes(item.id)) // Sem dados até que o modal abra
```

**Por que isso está errado:**

- Ao recarregar a página, o modal está fechado, então a consulta não é executada.
- O usuário vê o estado vazio em vez de seus dados.
- A exibição depende da interação do modal.

### ✅ CORRETO - Consultas separadas com invalidação adequada

```tsx
// Dados de exibição - carregam imediatamente
const { data: displayData } = useQuery({
  queryFn: () => fetchDisplayData(),
  queryKey: ["display-data", product.id],
  // Sem condição 'enabled' - carrega no mount
})

// Dados do modal - carregam apenas quando necessário
const { data: modalData } = useQuery({
  queryFn: () => fetchModalData(),
  queryKey: ["modal-data"],
  enabled: modalOpen, // OK para dados apenas do modal
})

// Mutação com invalidação de cache adequada
const updateMutation = useMutation({
  mutationFn: updateFunction,
  onSuccess: () => {
    // Invalida a consulta de dados de exibição para atualizar a UI
    queryClient.invalidateQueries({ queryKey: ["display-data", product.id] })
    // Também invalida a entidade se ela armazenar os dados em cache
    queryClient.invalidateQueries({ queryKey: ["product", product.id] })
  },
})
```

**Por que isso está certo:**

- A consulta de exibição é executada imediatamente no mount do componente.
- A consulta do modal só é executada quando necessário.
- A invalidação adequada garante que a UI seja atualizada após as mudanças.
- Cada consulta tem uma responsabilidade clara e separada.

## Usando o Medusa JS SDK

**⚠️ CRÍTICO: SEMPRE use o Medusa JS SDK para TODAS as requisições de API - NUNCA use `fetch()` padrão**

### Por que o SDK é obrigatório

- **Rotas Admin** exigem o header `Authorization` e o cookie de sessão - o SDK adiciona automaticamente.
- **Rotas Store** exigem o header `x-publishable-api-key` - o SDK adiciona automaticamente.
- **`fetch()` padrão** não inclui esses headers → erros de autenticação/autorização.
- Usar métodos existentes do SDK fornece melhor segurança de tipo e autocompletar.

### Quando usar o quê

```tsx
import { sdk } from "../lib/client"

// ✅ CORRETO - Endpoint embutido: Use método existente do SDK
const product = await sdk.admin.product.retrieve(productId, {
  fields: "+metadata,+variants.*"
})

// ✅ CORRETO - Endpoint personalizado: Use sdk.client.fetch()
const reviews = await sdk.client.fetch(`/admin/products/${productId}/reviews`)

// ❌ ERRADO - Usar fetch() padrão para QUALQUER endpoint
const response = await fetch(`http://localhost:9000/admin/products/${productId}`)
// ❌ Erro: Header Authorization ausente!
```

### Seleção de Método do SDK

**Para endpoints embutidos do Medusa:**

- Use métodos existentes do SDK: `sdk.admin.product.list()`, `sdk.store.product.list()`, etc.
- Fornece segurança de tipo, autocompletar e tratamento adequado de headers.
- Referência: [Medusa JS SDK Documentation](https://docs.medusajs.com/resources/medusa-js-sdk)

**Para rotas de API personalizadas:**

- Use `sdk.client.fetch()` para seus endpoints personalizados.
- O SDK ainda cuida de todos os headers necessários (auth, chaves de API).
- Passe objetos simples para o corpo (SDK cuida da serialização JSON).

## Trabalhando com Tanstack Query

Widgets e rotas admin possuem Tanstack Query pré-configurado.

**⚠️ Usuários pnpm**: Você DEVE instalar `@tanstack/react-query` ANTES de usar `useQuery` ou `useMutation`. Instale com a versão exata do dashboard:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
pnpm add @tanstack/react-query@[versão-exata]
```

**Usuários npm/yarn**: NÃO instale `@tanstack/react-query` - ele já está disponível pelas dependências do dashboard.

## Busca de Dados com useQuery

### Consulta Básica

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

### Consulta Paginação

```tsx
const limit = 15
const offset = pagination.pageIndex * limit

const { data: products } = useQuery({
  queryFn: () =>
    sdk.admin.product.list({
      limit,
      offset,
      q: searchTerm, // para busca
    }),
  queryKey: ["products", limit, offset, searchTerm],
  keepPreviousData: true, // Evita piscadas na UI durante a paginação
})
```

### Consulta com Dependências

```tsx
// Apenas busca se productId existir
const { data } = useQuery({
  queryFn: () => sdk.admin.product.retrieve(productId),
  queryKey: ["product", productId],
  enabled: !!productId, // Só roda quando productId for truthy
})
```

### Busca de Múltiplos Itens por IDs

```tsx
// Para exibição - busca itens específicos por IDs
const { data: displayProducts } = useQuery({
  queryFn: async () => {
    if (selectedIds.length === 0) return { products: [] }

    const response = await sdk.admin.product.list({
      id: selectedIds, // Busca apenas os produtos selecionados
      limit: selectedIds.length,
    })
    return response
  },
  queryKey: ["related-products-display", selectedIds],
  enabled: selectedIds.length > 0, // Só busca se houver IDs
})
```

## Atualizando Dados com useMutation

### Mutação Básica

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@medusajs/ui"

const queryClient = useQueryClient()

const updateProduct = useMutation({
  mutationFn: (payload) => sdk.admin.product.update(productId, payload),
  onSuccess: () => {
    // Invalida e busca novamente
    queryClient.invalidateQueries({ queryKey: ["product", productId] })
    toast.success("Produto atualizado com sucesso")
  },
  onError: (error) => {
    toast.error(error.message || "Falha ao atualizar produto")
  },
})

// Utilização
const handleSave = () => {
  updateProduct.mutate({
    metadata: {
      ...existingMetadata,
      new_field: "value",
    },
  })
}
```

### Mutação com Estado de Carregamento

```tsx
<Button
  onClick={handleSave}
  isLoading={updateProduct.isPending}
>
  Salvar
</Button>
```

### Mutação de Criação

```tsx
const createProduct = useMutation({
  mutationFn: (data) => sdk.admin.product.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success("Produto criado com sucesso")
    setOpen(false)
  },
})
```

### Mutação de Exclusão

```tsx
const deleteProduct = useMutation({
  mutationFn: (id) => sdk.admin.product.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success("Produto excluído")
  },
})
```

## Diretrizes de Invalidação de Cache

Após mutações, invalide as consultas que afetam o que o usuário vê:

```tsx
onSuccess: () => {
  // Invalide a entidade em si, se ela armazena os dados
  queryClient.invalidateQueries({ queryKey: ["product", productId] })

  // Invalide consultas específicas de exibição
  queryClient.invalidateQueries({ queryKey: ["related-products", productId] })

  // Não é necessário invalidar as consultas de seleção do modal
  // queryClient.invalidateQueries({ queryKey: ["products-list"] }) // Não necessário
}
```

**Pontos Chave:**

- Use chaves de consulta específicas com IDs para invalidação direcionada.
- Invalide tanto as consultas da entidade quanto as consultas de dados de exibição quando necessário.
- Considere o que o usuário vê e garanta que essas consultas sejam atualizadas.
- Consultas de modal/seleção geralmente não precisam de invalidação.

## Notas Importantes sobre Metadados

- Ao atualizar objetos aninhados em metadados, passe o objeto inteiro (Medusa não mescla objetos aninhados).
- Para remover uma propriedade de metadado, defina-a como string vazia.
- Metadados são armazenados como JSONB no banco de dados.

**Exemplo: Atualizando Metadados**

```tsx
// ✅ CORRETO - Espalha (spread) o metadado existente
updateProduct.mutate({
  metadata: {
    ...product.metadata,
    new_field: "value",
  },
})

// ❌ ERRADO - Sobrescreve todos os metadados
updateProduct.mutate({
  metadata: {
    new_field: "value", // Todos os outros campos perdidos!
  },
})
```

## Padrões Comuns

### Padrão: Busca de Dados com Paginação

```tsx
const limit = 15
const offset = pagination.pageIndex * limit

const { data } = useQuery({
  queryFn: () => sdk.admin.product.list({ limit, offset }),
  queryKey: ["products", limit, offset],
  keepPreviousData: true, // Evita piscadas na UI durante a paginação
})
```

### Padrão: Busca com Debounce

```tsx
import { useDebouncedValue } from "@mantine/hooks" // ou implemente o seu próprio

const [search, setSearch] = useState("")
const [debouncedSearch] = useDebouncedValue(search, 300)

const { data } = useQuery({
  queryFn: () => sdk.admin.product.list({ q: debouncedSearch }),
  queryKey: ["products", debouncedSearch],
})
```

### Padrão: Atualização de Metadados com useMutation

```tsx
const updateMetadata = useMutation({
  mutationFn: (metadata) => sdk.admin.product.update(productId, { metadata }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["product", productId] })
    toast.success("Atualizado com sucesso")
  },
})
```

## Casos de Uso Yello Solar Hub

- **Cotação B2B por ID de Equipamentos:** O administrador precisa gerar uma cotação comercial B2B (ex: 5 inversores + 3 painéis). Deve-se usar uma consulta baseada em múltiplos IDs (`selectedIds`) e garantir que o cálculo do preço final (Mutação) invalide o cache da lista de produtos para refletir possíveis ajustes de preço ou tributos.
- **Gestão de Kits Solares (Metadata):** Ao criar um novo kit, o administrador cadastra múltiplos componentes (módulos, estruturas, inversores). O uso de `useMutation` deve atualizar o campo de `metadata` (`related_product_ids`) de forma atômica, seguindo o padrão de passar o objeto completo para evitar sobrescrever dados existentes.
- **Visualização de Canais Regionais:** Em um dashboard de gestão, é necessário listar todos os distribuidores regionais ativos. Isso exige uma consulta paginada (`Paginated Query`) onde o `searchTerm` filtra por região ou CNPJ, e a navegação deve manter o estado de carregamento (`keepPreviousData: true`).
- **Atualização de Catálogo e Especificações Técnicas:** O time comercial altera as especificações de um inversor. A interface deve primeiro carregar os dados de exibição (`displayData`) e, ao salvar, usar a `Mutation` para atualizar os metadados e, crucialmente, invalidar tanto a consulta da entidade do produto quanto quaisquer widgets de exibição relacionados (Ex: "Produtos relacionados").

## Problemas e Soluções Comuns

### Erros de Autenticação/Autorização ao buscar dados

**Sintomas:**

- API retorna 401 Unauthorized ou 403 Forbidden.
- Erro "Missing x-publishable-api-key header".
- Erro "Unauthorized" em rotas admin.

**Causa:** Uso de `fetch()` padrão em vez do Medusa JS SDK.

**Solução:**

```tsx
// ❌ ERRADO - Headers obrigatórios ausentes
const { data } = useQuery({
  queryFn: () => fetch('http://localhost:9000/admin/products').then(r => r.json()),
  queryKey: ["products"]
})

// ✅ CORRETO - SDK trata os headers automaticamente
const { data } = useQuery({
  queryFn: () => sdk.admin.product.list(),
  queryKey: ["products"]
})

// ✅ CORRETO - Para rotas personalizadas
const { data } = useQuery({
  queryFn: () => sdk.client.fetch('/admin/custom-route'),
  queryKey: ["custom-data"]
})
```

### "Nenhum QueryClient definido, use QueryClientProvider para definir um"

- **Usuários pnpm**: Você esqueceu de instalar `@tanstack/react-query` antes de implementar. Instale agora com a versão exata do dashboard.
- **Usuários npm/yarn**: Você instalou incorretamente `@tanstack/react-query` - remova-o do package.json.
- Nunca envolva seu componente em `QueryClientProvider` - ele já é fornecido.

### Busca não filtra os resultados

- A busca ocorre no lado do servidor via parâmetro `q`.
- Certifique-se de passar o valor de busca em sua `queryFn`:

```tsx
queryFn: () => sdk.admin.product.list({ q: searchValue })
```

### Atualizações de metadados não funcionam

- Sempre passe o objeto de metadados completo (atualizações parciais não são mescladas).
- Para remover um campo, defina-o como string vazia, e não `null` ou `undefined`.

### Widget não atualiza após mutação

- Use `queryClient.invalidateQueries()` com a chave de consulta correta.
- Garanta que sua chave de consulta inclua todas as dependências (busca, paginação, etc.).

### Dados mostram vazio no recarregamento da página

- Sua consulta possui `enabled: modalOpen` ou condição similar.
- Os dados de exibição NUNCA devem ser habilitados condicionalmente com base no estado da UI.
- Mova consultas condicionais apenas para modais/formulários.

## Exemplo Completo: Widget com Consultas Separadas

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { Container, Heading, Button, FocusModal, toast } from "@medusajs/ui"
import { sdk } from "../lib/client"

const RelatedProductsWidget = ({ data: product }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Analisa os IDs de produto relacionados existentes nos metadados
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

  // Consulta 1: Busca produtos selecionados para exibição (carrega no mount)
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

  // Consulta 2: Busca produtos para seleção no modal (apenas quando o modal estiver aberto)
  const { data: modalProducts, isLoading } = useQuery({
    queryFn: () => sdk.admin.product.list({ limit: 10, offset: 0 }),
    queryKey: ["products-selection"],
    enabled: open, // Carrega apenas quando o modal está aberto
  })

  // Mutação para atualizar os metadados do produto
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
      toast.success("Produtos relacionados atualizados")
      setOpen(false)
    },
  })

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading>Produtos Relacionados</Heading>
        <Button onClick={() => setOpen(true)}>Editar</Button>
      </div >

      {/* Exibe a seleção atual */}
      <div >
        {displayProducts?.products.map((p) => (
          <div key={p.id}>{p.title}</div >
        ))}
      </div>

      {/* Modal para seleção */}
      <FocusModal open={open} onOpenChange={setOpen}>
        {/* Conteúdo do modal com UI de seleção */}
      </FocusModal>
    </Container>
  )
}
```stop
