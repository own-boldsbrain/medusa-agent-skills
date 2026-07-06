# Exibição de entidades — Padrões e componentes

## Índice

- [Quando usar cada padrão](#quando-usar-cada-padrao)
- [Padrão DataTable](#padrao-datatable)
  - [Implementação completa do DataTable](#padrao-datatable)
  - [Solução de problemas do DataTable](#padrao-datatable)
- [Padrões de lista simples](#padroes-simples-de-lista)
  - [Item de lista de produtos/variantes](#padroes-simples-de-lista)
  - [Lista de texto simples (sem miniaturas)](#padroes-simples-de-lista)
  - [Lista compacta (sem cartões)](#padroes-simples-de-lista)
  - [Exibição em grade](#grid-display)
- [Elementos-chave de design](#elementos-chave-do-design)
- [Estados vazios](#estados-vazios)
- [Estados de carregamento](#estados-de-carregamento)
- [Renderização condicional com base na contagem](#renderizacao-condicional-com-base-na-contagem)
- [Padrões comuns de classes](#padroes-comuns-de-classes)

## Quando usar cada padrão

**Use a DataTable quando:**

- For necessário exibir um número potencialmente grande de entradas (>5-10 itens)
- Os usuários precisarem pesquisar, filtrar ou paginar
- Forem necessárias ações em massa (seleção múltipla, exclusão etc.)
- A exibição for feita em uma visualização de lista principal

**Use componentes de lista simples quando:**

- For exibir poucas entradas (<5-10 itens)
- Em um widget ou na barra lateral
- Como uma pré-visualização ou resumo
- O espaço for limitado

## Padrão DataTable

**⚠️ Usuários do pnpm**: Os exemplos do DataTable podem usar o `react-router-dom` para navegação. Instale-o ANTES de implementar, se necessário.

### Implementação completa do DataTable

```tsx
import {
  DataTable,
  DataTableRowSelectionState,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
} from "@medusajs/ui"
import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminProduct>()

const columns = [
  columnHelper.select(), // For row selection
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  }),
]

export function ProductTable() {
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  )
  const [searchValue, setSearchValue] = useState("")
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const limit = pagination.pageSize
  const offset = pagination.pageIndex * limit

  // Fetch products with search and pagination
  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.admin.product.list({
        limit,
        offset,
        q: searchValue || undefined, // Search query
      }),
    queryKey: ["products", limit, offset, searchValue],
    keepPreviousData: true, // Smooth pagination
  })

  const table = useDataTable({
    data: data?.products || [],
    columns,
    getRowId: (product) => product.id,
    rowCount: data?.count || 0,
    isLoading,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    search: {
      state: searchValue,
      onSearchChange: setSearchValue,
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <DataTable instance={table}>
      <DataTable.Toolbar>
        <div className="flex gap-2">
          <DataTable.Search placeholder="Search products..." />
        </div>
      </DataTable.Toolbar>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable>
  )
}
```

### Solução de problemas com o DataTable

**“O DataTable.Search foi renderizado, mas a pesquisa não está habilitada”**

É necessário passar a configuração do estado de pesquisa para o `useDataTable`:

```tsx
search: {
  state: searchValue,
  onSearchChange: setSearchValue,
}
```

**“Não é possível desestruturar a propriedade 'pageIndex' da paginação, pois ela está indefinida”**

Sempre inicialize o estado da paginação com ambas as propriedades:

```tsx
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 15,
})
```

## Padrões simples de lista

### Item de lista de produto/variante

Para exibir uma pequena lista de produtos ou variantes com miniaturas:

```tsx
import { Thumbnail, Text } from "@medusajs/ui"
import { TriangleRightMini } from "@medusajs/icons"
import { Link } from "react-router-dom"

// Component for displaying a product variant
const ProductVariantItem = ({ variant, link }) => {
  const Inner = (
    <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-2 transition-colors">
      <div className="flex items-center gap-3">
        <div className="shadow-elevation-card-rest rounded-md">
          <Thumbnail src={variant.product?.thumbnail} />
        </div>
        <div className="flex flex-1 flex-col">
          <Text size="small" leading="compact" weight="plus">
            {variant.title}
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {variant.options.map((o) => o.value).join(" ⋅ ")}
          </Text>
        </div>
        <div className="size-7 flex items-center justify-center">
          <TriangleRightMini className="text-ui-fg-muted rtl:rotate-180" />
        </div>
      </div>
    </div>
  )

  if (!link) {
    return <div key={variant.id}>{Inner}</div>
  }

  return (
    <Link
      to={link}
      key={variant.id}
      className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md [&:hover>div]:bg-ui-bg-component-hover"
    >
      {Inner}
    </Link>
  )
}

// Usage in a widget
const RelatedProductsDisplay = ({ products }) => {
  if (products.length > 10) {
    // Use DataTable for many items
    return <ProductDataTable products={products} />
  }

  // Use simple list for few items
  return (
    <div className="flex flex-col gap-2">
      {products.map((product) => (
        <ProductVariantItem
          key={product.id}
          variant={product}
          link={`/products/${product.id}`}
        />
      ))}
    </div>
  )
}
```

### Lista simples de texto (sem miniaturas)

Para entidades sem imagens (categorias, regiões etc.):

```tsx
import { Text } from "@medusajs/ui"
import { TriangleRightMini } from "@medusajs/icons"
import { Link } from "react-router-dom"

const SimpleListItem = ({ title, description, link }) => {
  const Inner = (
    <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-3 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-y-1">
          <Text size="small" leading="compact" weight="plus">
            {title}
          </Text>
          {description && (
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {description}
            </Text>
          )}
        </div>
        <div className="size-7 flex items-center justify-center">
          <TriangleRightMini className="text-ui-fg-muted rtl:rotate-180" />
        </div>
      </div>
    </div>
  )

  if (!link) {
    return <div>{Inner}</div>
  }

  return (
    <Link
      to={link}
      className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md [&:hover>div]:bg-ui-bg-component-hover"
    >
      {Inner}
    </Link>
  )
}

// Usage
<div className="flex flex-col gap-2">
  {categories.map((cat) => (
    <SimpleListItem
      key={cat.id}
      title={cat.name}
      description={cat.description}
      link={`/categories/${cat.id}`}
    />
  ))}
</div>
```

### Lista compacta (sem cartões)

Para exibições muito compactas:

```tsx
import { Text } from "@medusajs/ui"

<div className="flex flex-col gap-y-2">
  {items.map((item) => (
    <div key={item.id} className="flex items-center justify-between">
      <Text size="small" leading="compact" weight="plus">
        {item.title}
      </Text>
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {item.metadata}
      </Text>
    </div>
  ))}
</div>
```

### Exibição em grade

Para exibir itens em uma grade:

```tsx
<div className="grid grid-cols-2 gap-4">
  {items.map((item) => (
    <div
      key={item.id}
      className="shadow-elevation-card-rest bg-ui-bg-component rounded-md p-4"
    >
      <div className="flex flex-col gap-y-2">
        <Thumbnail src={item.thumbnail} />
        <Text size="small" leading="compact" weight="plus">
          {item.title}
        </Text>
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {item.description}
        </Text>
      </div>
    </div>
  ))}
</div>
```

## Elementos-chave do design

### Para exibição de produtos/variantes

- Sempre exiba a miniatura usando o componente `<Thumbnail />`
- Exiba o título com `<Text size="small" leading="compact" weight="plus">`
- Exiba informações secundárias com `<Text size="small" leading="compact" className="text-ui-fg-subtle">`
- Use `shadow-elevation-card-rest` para elevar o cartão
- Inclua estados de foco com `bg-ui-bg-component-hover`
- Adicione indicadores de navegação (setas) quando os itens forem clicáveis

### Para outras entidades

- Use padrões de cartão semelhantes, mas adapte o conteúdo
- Mantenha um espaçamento consistente (`gap-3` para itens, `gap-2` para listas)
- Sempre use o componente Text com os padrões tipográficos corretos
- Mantenha a hierarquia visual com `weight="plus"` para o texto principal e `text-ui-fg-subtle` para o texto secundário

## Estados vazios

Sempre lide com os estados vazios de maneira elegante:

```tsx
{items.length === 0 ? (
  <Text size="small" leading="compact" className="text-ui-fg-subtle">
    No items to display
  </Text>
) : (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <ItemDisplay key={item.id} item={item} />
    ))}
  </div>
)}
```

## Estados de carregamento

Mostrar os estados de carregamento enquanto os dados estão sendo buscados:

```tsx
import { Spinner } from "@medusajs/ui"

{isLoading ? (
  <div className="flex items-center justify-center p-8">
    <Spinner />
  </div>
) : (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <ItemDisplay key={item.id} item={item} />
    ))}
  </div>
)}
```

## Renderização condicional com base na contagem

```tsx
const DisplayComponent = ({ items }) => {
  // Use DataTable for many items
  if (items.length > 10) {
    return <ItemsDataTable items={items} />
  }

  // Use simple list for few items
  if (items.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SimpleListItem key={item.id} item={item} />
        ))}
      </div>
    )
  }

  // Empty state
  return (
    <Text size="small" leading="compact" className="text-ui-fg-subtle">
      No items to display
    </Text>
  )
}
```

## Padrões comuns de classes

### Cartão com elevação e efeito ao passar o mouse

```tsx
className="shadow-elevation-card-rest bg-ui-bg-component rounded-md transition-colors hover:bg-ui-bg-component-hover"
```

### Contêiner flexível com espaçamento consistente

```tsx
className="flex flex-col gap-2" // For vertical lists
className="flex items-center gap-3" // For horizontal items
```

### Estados de foco para elementos interativos

```tsx
className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md"
```

### Suporte a RTL para ícones direcionais

```tsx
className="text-ui-fg-muted rtl:rotate-180"
```
