# Análise aprofundada da arquitetura: integração do painel de administração

O painel de administração do Medusa é um aplicativo React que se conecta à sua API de back-end. Entender como ampliá-lo com widgets e rotas de interface do usuário é essencial para desenvolver funcionalidades completas.

## Arquitetura do painel de administração

```
┌─────────────────────────────────────────────────┐
│  Admin Dashboard (React + Vite)                 │
│  Running at: http://localhost:9000/app          │
│                                                 │
│  ┌──────────────┐    ┌──────────────┐          │
│  │   Widgets    │    │  UI Routes   │          │
│  │  (Inject)    │    │  (New Pages) │          │
│  └───────┬──────┘    └───────┬──────┘          │
│          │                   │                  │
│          └────────┬──────────┘                  │
│                   │                             │
│                   ▼                             │
│           ┌──────────────┐                      │
│           │   JS SDK     │                      │
│           └──────┬───────┘                      │
└──────────────────┼─────────────────────────────┘
                   │ HTTP Requests
                   ▼
┌─────────────────────────────────────────────────┐
│  Backend API (Node.js)                          │
│  Running at: http://localhost:9000              │
│                                                 │
│  ┌──────────────┐    ┌──────────────┐          │
│  │  API Routes  │    │  Workflows   │          │
│  └──────┬───────┘    └───────┬──────┘          │
│         │                    │                  │
│         └──────────┬─────────┘                  │
│                    ▼                            │
│           ┌──────────────┐                      │
│           │   Modules    │                      │
│           └──────────────┘                      │
└─────────────────────────────────────────────────┘
```

## Widgets x Rotas da IU

### Widgets: Ampliar páginas existentes

**O que são**: Componentes React inseridos em páginas de administração existentes em zonas predefinidas

**Quando usar**:

- Adicionar informações a páginas existentes
- Exibir dados relacionados
- Ampliar entidades principais (produtos, pedidos, clientes)

**Exemplos**:

- Mostrar a marca na página de detalhes do produto
- Mostrar avaliações na página de detalhes do produto
- Mostrar o status do envio na página de detalhes do pedido

```typescript
// Widget Example
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const ProductBrandWidget = ({ data: product }) => {
  return <Container>Brand: {product.brand?.name}</Container>
}

export const config = defineWidgetConfig({
  zone: "product.details.before",  // Where to inject
})

export default ProductBrandWidget
```

### Rotas da interface do usuário: Criar novas páginas

**O que**: Páginas totalmente novas no painel de administração

**Quando usar**:

- Gerenciamento de entidades personalizadas
- Painéis ou relatórios personalizados
- Interfaces administrativas independentes

**Exemplos**:

- Página de gerenciamento de marcas
- Página de gerenciamento de avaliações
- Painel de análise personalizado

```typescript
// UI Route Example
import { defineRouteConfig } from "@medusajs/admin-sdk"

const BrandsPage = () => {
  return (
    <Container>
      <Heading>Brands</Heading>
      <DataTable data={brands} />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
})

export default BrandsPage
```

## Principais diferenças

| Aspecto | Widgets | Rotas da interface do usuário |
|--------|---------|-----------|
| Finalidade | Estender páginas existentes | Criar novas páginas |
| Localização | Injetados em zonas | Novas URLs |
| Navegação | Sem entrada na barra lateral | Item do menu da barra lateral |
| Caminho do arquivo | `src/admin/widgets/` | `src/admin/routes/` |
| Configuração | `defineWidgetConfig()` | `defineRouteConfig()` |
| Props | Recebe entidade da página | Sem props especiais |

## Padrões de integração de widgets

### Padrão 1: Widget de exibição (somente leitura)

Exibe informações de entidades vinculadas:

```typescript
// Product Brand Widget - Display Only
const ProductBrandWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+brand.*",  // Include brand relation
    }),
    queryKey: ["product", product.id, "brand"],
  })

  const brand = (queryResult?.product as ProductWithBrand)?.brand

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brand</Heading>
      </div>
      <div className="px-6 py-4">
        <Text>{brand?.name || "-"}</Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})
```

**Pontos-chave**:

- Utiliza `DetailWidgetProps<T>` para garantir a segurança de tipos
- Recebe a entidade como a propriedade `data`
- Utiliza o React Query para buscar dados
- Utiliza o parâmetro `fields` para incluir relações

### Padrão 2: Widget interativo (com ações)

Widget com botões e ações do usuário:

```typescript
// Product Brand Widget - With Actions
const ProductBrandWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [isEditing, setIsEditing] = useState(false)

  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+brand.*",
    }),
    queryKey: ["product", product.id, "brand"],
  })

  const updateMutation = useMutation({
    mutationFn: (brandId: string) => {
      return sdk.client.fetch(`/admin/products/${product.id}/brand`, {
        method: "POST",
        body: JSON.stringify({ brand_id: brandId }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product", product.id, "brand"])
      setIsEditing(false)
    },
  })

  if (isEditing) {
    return (
      <Container>
        <BrandSelector
          onSelect={(brandId) => updateMutation.mutate(brandId)}
          onCancel={() => setIsEditing(false)}
        />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading level="h2">Brand</Heading>
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
      </div>
      <Text>{brand?.name || "-"}</Text>
    </Container>
  )
}
```

**Pontos-chave**:

- Estado local para o modo de edição
- Utiliza `useMutation` para atualizações
- Invalida o cache de consultas após a mutação
- Interface de usuário separada para os modos de visualização e edição

### Padrão 3: Widget com modal

Formulários complexos em um modal:

```typescript
// Product Brand Widget - With Modal
const ProductBrandWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+brand.*",
    }),
    queryKey: ["product", product.id, "brand"],
  })

  return (
    <>
      <Container>
        <div className="flex items-center justify-between">
          <Heading level="h2">Brand</Heading>
          <Button onClick={() => setModalOpen(true)}>Change Brand</Button>
        </div>
        <Text>{brand?.name || "-"}</Text>
      </Container>

      {modalOpen && (
        <ChangeBrandModal
          product={product}
          currentBrand={brand}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
```

## Padrões de integração de rotas da interface do usuário

### Padrão 1: Página de lista com DataTable

Padrão mais comum para páginas de gerenciamento:

```typescript
// Brands List Page
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid } from "@medusajs/icons"
import { Container, Heading, DataTable, useDataTable } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"

const BrandsPage = () => {
  const [pagination, setPagination] = useState({
    pageSize: 15,
    pageIndex: 0,
  })

  const { data, isLoading } = useQuery({
    queryFn: () => sdk.client.fetch(`/admin/brands`, {
      query: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      },
    }),
    queryKey: ["brands", pagination.pageSize, pagination.pageIndex],
  })

  const table = useDataTable({
    columns: [
      { accessor: "id", header: "ID" },
      { accessor: "name", header: "Name" },
      { accessor: "products", header: "Products", cell: (props) => props.getValue()?.length || 0 },
    ],
    data: data?.brands || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar>
          <Heading>Brands</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
})

export default BrandsPage
```

**Pontos-chave**:

- Utiliza o hook `useDataTable` para gerenciamento de tabelas
- O estado da paginação é gerenciado localmente (ou na URL, em ambiente de produção)
- Utiliza `sdk.client.fetch()` para endpoints de API personalizados
- Componentes DataTable para uma interface de usuário consistente

### Padrão 2: Página de detalhes

Para visualizar/editar registros individuais:

```typescript
// Brand Detail Page - src/admin/routes/brands/[id]/page.tsx
import { useParams } from "react-router-dom"

const BrandDetailPage = () => {
  const { id } = useParams()

  const { data: brand, isLoading } = useQuery({
    queryFn: () => sdk.client.fetch(`/admin/brands/${id}`),
    queryKey: ["brand", id],
  })

  if (isLoading) return <Loading />

  return (
    <Container>
      <Heading>{brand.name}</Heading>

      <Section title="Details">
        <LabeledInput label="Name" value={brand.name} />
        <LabeledInput label="Created" value={brand.created_at} />
      </Section>

      <Section title="Products">
        <ProductsList products={brand.products} />
      </Section>
    </Container>
  )
}

export default BrandDetailPage
```

**Estrutura de arquivos para rotas aninhadas**:

```
src/admin/routes/brands/
├── page.tsx              → /app/brands (list)
└── [id]/
    └── page.tsx          → /app/brands/:id (detail)
```

### Padrão 3: Formulário de criação/edição

Para criar ou editar registros:

```typescript
// Create Brand Page - src/admin/routes/brands/create/page.tsx
const CreateBrandPage = () => {
  const navigate = useNavigate()

  const createMutation = useMutation({
    mutationFn: (data: { name: string }) => {
      return sdk.client.fetch(`/admin/brands`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    onSuccess: (result) => {
      toast.success("Brand created successfully")
      navigate(`/brands/${result.brand.id}`)
    },
    onError: (error) => {
      toast.error(`Failed to create brand: ${error.message}`)
    },
  })

  return (
    <Container>
      <Heading>Create Brand</Heading>

      <Form onSubmit={(data) => createMutation.mutate(data)}>
        <Input name="name" label="Name" required />
        <Button type="submit" isLoading={createMutation.isLoading}>
          Create
        </Button>
      </Form>
    </Container>
  )
}

export default CreateBrandPage
```

## Padrões de consulta no React

### Padrão 1: Consultas separadas para exibição e modal

**Problema**: O widget usa uma consulta, enquanto o modal usa outra consulta

**Solução**: Chaves de consulta separadas

```typescript
// In widget - lightweight query for display
const { data: product } = useQuery({
  queryFn: () => sdk.admin.product.retrieve(productId, {
    fields: "id,title,brand.name",  // Only what we need
  }),
  queryKey: ["product", productId, "widget"],  // Different key
})

// In modal - full query for editing
const { data: fullProduct } = useQuery({
  queryFn: () => sdk.admin.product.retrieve(productId, {
    fields: "*,brand.*,variants.*",  // Everything
  }),
  queryKey: ["product", productId, "modal"],  // Different key
  enabled: modalOpen,  // Only fetch when modal opens
})
```

### Padrão 2: Atualizações otimistas

Atualizar a interface do usuário imediatamente e reverter em caso de erro:

```typescript
const updateMutation = useMutation({
  mutationFn: (updates) => sdk.client.fetch(`/admin/brands/${brandId}`, {
    method: "POST",
    body: JSON.stringify(updates),
  }),
  onMutate: async (updates) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(["brand", brandId])

    // Snapshot previous value
    const previous = queryClient.getQueryData(["brand", brandId])

    // Optimistically update
    queryClient.setQueryData(["brand", brandId], (old) => ({
      ...old,
      ...updates,
    }))

    return { previous }
  },
  onError: (err, updates, context) => {
    // Revert on error
    queryClient.setQueryData(["brand", brandId], context.previous)
  },
  onSettled: () => {
    // Refetch to sync
    queryClient.invalidateQueries(["brand", brandId])
  },
})
```

### Padrão 3: Invalidação após mutações

Atualizar consultas após alterações nos dados:

```typescript
const createBrandMutation = useMutation({
  mutationFn: (data) => sdk.client.fetch(`/admin/brands`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  onSuccess: () => {
    // Invalidate brands list to refetch
    queryClient.invalidateQueries(["brands"])

    // Also invalidate if product pages show brand
    queryClient.invalidateQueries(["products"])
  },
})
```

## Integração do SDK para rotas personalizadas

### Padrão de recuperação do SDK Client

Para pontos de extremidade de API personalizados, use `sdk.client.fetch()`:

```typescript
// Standard Medusa entities - use built-in methods
const product = await sdk.admin.product.retrieve(id)
const products = await sdk.admin.product.list()

// Custom entities - use client.fetch()
const brand = await sdk.client.fetch(`/admin/brands/${id}`)
const brands = await sdk.client.fetch(`/admin/brands`)

// Custom actions - use client.fetch() with method
const result = await sdk.client.fetch(`/admin/brands/${id}/approve`, {
  method: "POST",
  body: JSON.stringify({ approved: true }),
})
```

### Configuração do SDK

Inicialize uma vez em `src/admin/lib/sdk.ts`:

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",  // Important for admin!
  },
})
```

**Pontos importantes**:

- Use `import.meta.env` (variáveis de ambiente do Vite)
- Use “/” como padrão para solicitações da mesma origem
- Use o tipo de autenticação “session” para o administrador
- Habilite a depuração no ambiente de desenvolvimento

## Componentes da interface do usuário do Medusa

Sempre utilize os componentes da interface do usuário do Medusa para garantir um estilo consistente:

```typescript
import {
  Container,
  Heading,
  Text,
  Button,
  Input,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
} from "@medusajs/ui"

import { TagSolid, PlusSolid } from "@medusajs/icons"
```

**Componentes comuns**:

- **Container**: Contêiner de página/seção
- **Heading**: Títulos de página
- **Text**: Texto do corpo
- **Botão**: Ações
- **Entrada**: Campos de formulário
- **DataTable**: Tabelas com paginação/classificação
- **Botão com ícone**: Botões apenas com ícone
- **Badge**: Indicadores de status
- **Toast**: Notificações

## Referência de zonas

Zonas comuns de widgets:

**Páginas de produtos**:

- `product.details.before`
- `product.details.after`
- `product.details.side.before`
- `product.details.side.after`

**Páginas de pedidos**:

- `order.details.before`
- `order.details.after`

**Páginas de clientes**:

- `customer.details.before`
- `customer.details.after`

## Práticas recomendadas

### 1. Nomeação de chaves de consulta

Use uma nomenclatura consistente e hierárquica:

```typescript
// Good - hierarchical, specific
["product", productId, "brand"]
["brands", limit, offset]
["brand", brandId, "products"]

// Bad - flat, ambiguous
["productBrand"]
["getBrands"]
```

### 2. Estados de carregamento

Sempre lide com os estados de carregamento e de erro:

```typescript
const { data, isLoading, error } = useQuery({ ... })

if (isLoading) return <Spinner />
if (error) return <ErrorMessage error={error} />

return <Content data={data} />
```

### 3. Segurança de tipos

Defina os tipos em suas consultas e mutações:

```typescript
type Brand = {
  id: string
  name: string
  products?: Product[]
}

const { data } = useQuery<{ brands: Brand[] }>({
  queryFn: () => sdk.client.fetch(`/admin/brands`),
  queryKey: ["brands"],
})

// Now data.brands is typed correctly
```

### 4. Separar consultas de exibição e consultas modais

Não reutilize a mesma consulta para casos de uso diferentes:

```typescript
// Display query - lightweight
const displayQuery = useQuery({
  queryKey: ["entity", id, "display"],
  queryFn: () => fetch(`/api/entity/${id}?fields=id,name`),
})

// Modal query - comprehensive
const modalQuery = useQuery({
  queryKey: ["entity", id, "modal"],
  queryFn: () => fetch(`/api/entity/${id}?fields=*`),
  enabled: modalOpen,
})
```

## Resumo

A integração do painel de administração amplia a interface do usuário do Medusa:

**Widgets**:

- ✅ Ampliar páginas existentes
- ✅ Inserir em zonas predefinidas
- ✅ Receber a entidade da página como props
- ✅ Usar para informações relacionadas

**Rotas de interface do usuário**:

- ✅ Criar novas páginas
- ✅ Adicionar navegação na barra lateral
- ✅ Usar para entidades personalizadas
- ✅ Controle total da página

**Tecnologias-chave**:

- **React Query**: Busca e armazenamento em cache de dados
- **JS SDK**: Comunicação com a API de backend
- **Medusa UI**: Estilo consistente
- **Vite**: Ferramenta de compilação e servidor de desenvolvimento

**Lembre-se**: O Admin é um aplicativo React separado que se comunica com o backend via HTTP. Use o SDK para chamadas de API, o React Query para gerenciamento de estado e o Medusa UI para um design consistente.
