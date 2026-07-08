# Lição 3: Personalizar o painel de administração do Medusa

## Objetivos de aprendizagem

Ao final desta lição, você será capaz de:

- **Criar** widgets de administração para ampliar páginas existentes
- **Criar** rotas da interface do usuário para novas páginas de administração
- **Usar** o React Query para buscar dados
- **Integrar** componentes da interface do usuário do Medusa

**Tempo**: 45 a 60 minutos

**Pré-requisitos**: Ter concluído as Lições 1 e 2 (Módulo de Marca, links, hooks de fluxo de trabalho)

## O que estamos criando

Agora que as marcas já existem no back-end, vamos criar a interface de usuário de administração:

1. **Widget de Marca do Produto**: Exibir o nome da marca nas páginas de detalhes do produto
2. **Página de gerenciamento de marcas**: listar todas as marcas com seus produtos

**Ao final**, os administradores poderão:

- Ver a qual marca um produto pertence
- Acessar a página de gerenciamento de marcas
- Visualizar todas as marcas e seus produtos em uma tabela

**Documentação**: [Widgets de administrador](https://docs.medusajs.com/learn/fundamentals/admin/widgets) | [Rotas da interface de usuário de administrador](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes)

---

## Parte 1: Inicializar o JS SDK

O **JS SDK** simplifica o envio de solicitações às rotas da API do Medusa.

Crie o arquivo `src/admin/lib/sdk.ts`:

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})
```

**Configuração**:

- `baseUrl`: URL do servidor Medusa (use uma variável de ambiente ou o padrão “/”)
- `debug`: Ativa o registro de logs no ambiente de desenvolvimento
- `auth.type`: “session” para o painel de administração

**Importante**: O painel de administração usa o Vite, portanto, as variáveis de ambiente são `import.meta.env.*`

**Documentação**: [Referência do SDK JS](https://docs.medusajs.com/resources/js-sdk)

---

## Parte 2: Criar o widget de marca do produto

### O que é um widget?

Um **widget** é um componente React inserido em páginas de administração existentes em zonas predefinidas.

**Zonas comuns**:

- `product.details.before` - Parte superior da página de detalhes do produto
- `product.details.after` - Parte inferior da página de detalhes do produto
- `order.details.before` - Parte superior da página de detalhes do pedido

Crie `src/admin/widgets/product-brand.tsx`:

```tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

type AdminProductBrand = AdminProduct & {
  brand?: {
    id: string
    name: string
  }
}

const ProductBrandWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { data: queryResult, isLoading } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+brand.*",
    }),
    queryKey: ["product", product.id, "brand"],
  })

  const brandName = (queryResult?.product as AdminProductBrand)?.brand?.name

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Text size="small">Loading brand...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brand</Heading>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Name
        </Text>
        <Text size="small" leading="compact">
          {brandName || "-"}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductBrandWidget
```

**Conceitos-chave**:

**1. Props dos widgets**:

```tsx
DetailWidgetProps<AdminProduct>
```

- Os widgets nas páginas de detalhes recebem a entidade como a propriedade `data`
- Defina-a com o tipo de entidade apropriado

**2. Busca de dados**:

```tsx
useQuery({
  queryFn: () => sdk.admin.product.retrieve(product.id, {
    fields: "+brand.*",
  }),
  queryKey: ["product", product.id, "brand"],
})
```

- Use o React Query (`useQuery`) para buscar dados
- A chave da consulta deve incluir dependências
- Use o parâmetro `fields` para obter a marca associada

**3. Componentes da interface do usuário do Medusa**:

- Sempre use componentes do `@medusajs/ui`
- Comuns: `Container`, `Heading`, `Text`, `Button`
- Mantém um design consistente

**4. Configuração do widget**:

```tsx
export const config = defineWidgetConfig({
  zone: "product.details.before",
})
```

- Define onde o widget aparece
- Deve ser exportado como `config`

**Documentação**: [Guia de Widgets](https://docs.medusajs.com/learn/fundamentals/admin/widgets) | [Componentes da interface do usuário do Medusa](https://docs.medusajs.com/ui)

---

## Ponto de verificação 3.1: Testar o widget da marca do produto

### Etapas do teste

1. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Abra o painel de administração**: <http://localhost:9000/app>

3. **Acesse a seção de produtos**: Vá para Produtos → Selecione um produto com uma marca

4. **Verifique o widget**: Observe o widget da marca na parte superior da página

### Problemas comuns

**O widget não está sendo exibido**:

- Verifique se o nome da zona está correto
- Certifique-se de que `config` foi exportado
- Reinicie o servidor de desenvolvimento

**“Não é possível encontrar o módulo '@tanstack/react-query'” (somente para usuários do pnpm)**:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
pnpm add @tanstack/react-query@[exact-version]
```

---

## Parte 3: Criar uma rota de interface do usuário para “Brands”

### O que é uma rota de interface do usuário?

Uma **rota de interface do usuário** é uma nova página no painel de administração.

**O caminho do arquivo determina a URL**:

- `src/admin/routes/brands/page.tsx` → `/app/brands`
- `src/admin/routes/settings/team/page.tsx` → `/app/settings/team`

### Etapa 3.1: Criar rota GET da API de marcas

Primeiro, atualize o backend para oferecer suporte à paginação.

Atualize `src/api/admin/brands/route.ts`:

```typescript
// Add this after your existing POST handler

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

  const {
    data: brands,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "brand",
    ...req.queryConfig,
  })

  res.json({
    brands,
    count,
    limit: take,
    offset: skip,
  })
}
```

Em seguida, configure o middleware de consulta em `src/api/middlewares.ts`:

```typescript
import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
// ... other imports

export const GetBrandsSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    // ... existing routes ...
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetBrandsSchema,
          {
            defaults: ["id", "name", "products.*"],
            isList: true,
          }
        ),
      ],
    },
  ],
})
```

**Documentação**: [Middleware de configuração de consultas de solicitação](https://docs.medusajs.com/learn/fundamentals/module-links/query#request-query-configurations)

### Etapa 3.2: Criar rota da interface do usuário para marcas

Crie `src/admin/routes/brands/page.tsx`:

```tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid } from "@medusajs/icons"
import {
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useState, useMemo } from "react"

type Brand = {
  id: string
  name: string
  products?: { id: string; title: string }[]
}

type BrandsResponse = {
  brands: Brand[]
  count: number
  limit: number
  offset: number
}

const columnHelper = createDataTableColumnHelper<Brand>()

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("products", {
    header: "Products",
    cell: ({ getValue }) => {
      const products = getValue()
      return products?.length || 0
    },
  }),
]

const BrandsPage = () => {
  const limit = 15
  const [pagination, setPagination] = useState({
    pageSize: limit,
    pageIndex: 0,
  })

  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/brands`, {
      query: { limit, offset },
    }),
    queryKey: ["brands", limit, offset],
  })

  const table = useDataTable({
    columns,
    data: data?.brands || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
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

**Conceitos-chave**:

**1. Configuração da rota**:

```tsx
export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
})
```

- Adiciona um link na barra lateral
- `label`: Nome exibido
- `icon`: Do pacote `@medusajs/icons`

**2. Configuração da tabela de dados**:

```tsx
const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
]

const table = useDataTable({
  columns,
  data: data?.brands || [],
  rowCount: data?.count || 0,
  pagination: { state, onPaginationChange },
})
```

**3. Busca personalizada via API**:

```tsx
sdk.client.fetch(`/admin/brands`, {
  query: { limit, offset },
})
```

- Use `sdk.client.fetch()` para rotas personalizadas
- Passe os parâmetros de consulta no objeto `query`

**Documentação**: [Guia de Rotas da IU](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes) | [Componente DataTable](https://docs.medusajs.com/ui/components/data-table)

---

## Ponto de verificação 3.2: Testar a rota de interface do usuário da Brands

### Etapas do teste

1. **Reinicie o servidor de desenvolvimento** (para carregar os novos arquivos)
2. **Abra o painel de administração**: <http://localhost:9000/app>
3. **Encontre “Marcas” na barra lateral**: Deve aparecer um novo item no menu
4. **Clique em “Marcas”**: Veja a tabela de marcas com o número de produtos
5. **Teste a paginação**: Se houver mais de 15 marcas, a paginação deve funcionar

### Problemas comuns

**Rota não aparece**:

- Verifique se o nome do arquivo é `page.tsx` (não `route.tsx`)
- Certifique-se de que `config` esteja exportado
- Reinicie o servidor de desenvolvimento

**Tabela vazia**:

- Verifique se a rota da API está funcionando: `curl http://localhost:9000/admin/brands`
- Verifique se o middleware de consulta está configurado
- Verifique se as marcas existem no banco de dados

---

## Lição 3 concluída! 🎉

### O que você criou

Fantástico! Você personalizou o Medusa Admin:

- ✅ **JS SDK**: configurado para fazer solicitações de API
- ✅ **Widget de marca do produto**: exibe a marca nas páginas de produtos
- ✅ **Rota de interface do usuário para marcas**: Página completa com tabela de marcas e paginação

### O que você aprendeu

**Widgets do painel de administração**:

- Ampliar páginas existentes sem modificar o núcleo
- Usar o React Query para buscar dados
- Manter um design consistente com a interface do usuário do Medusa

**Rotas de interface do usuário**:

- Criar novas páginas do painel de administração
- Usar o DataTable para listas
- Implementar paginação
- Adicionar links de navegação

**React Query**:

- `useQuery` para buscar dados
- Chaves de consulta para armazenamento em cache
- Estados de carregamento

**Medusa UI**:

- Componentes consistentes
- Integração com o sistema de design

### Tutorial completo! 🎊

Você concluiu todas as 3 lições e criou um recurso completo:

**Back-end**:

- Módulo de marca (modelo de dados, serviço)
- createBrandWorkflow (com reversão)
- POST /admin/brands (criar marca)
- Link do módulo (marca ↔ produto)
- Hook de fluxo de trabalho (link na criação do produto)
- GET /admin/brands (listar marcas com produtos)

**Frontend**:

- Widget de marca do produto (mostrar a marca na página do produto)
- Rota da interface de usuário de marcas (gerenciar marcas)

### Envie suas alterações

```bash
git add .
git commit -m "Complete Lesson 3: Admin Dashboard customization"
```

### Próximos passos

**Implemente seu recurso**:

1. Execute os testes (se houver)
2. Compile para produção: `npm run build`
3. Implemente no [Medusa Cloud](https://cloud.medusajs.com)

**Crie mais funcionalidades**:

- Módulo de categorias
- Avaliações de produtos
- Listas de desejos
- Formas de envio personalizadas

Parabéns por concluir o tutorial de aprendizagem do Medusa! Agora você entende a arquitetura e pode criar funcionalidades personalizadas com confiança.
