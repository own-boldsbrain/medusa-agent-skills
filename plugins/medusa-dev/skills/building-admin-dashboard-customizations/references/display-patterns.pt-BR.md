# Exibindo Entidades - Padrões e Componentes

## Conteúdo

- [Quando Usar Cada Padrão](#quando-usar-cada-padrão)
- [Padrão DataTable](#padrão-datatable)
  - [Implementação Completa do DataTable](#implementação-completa-do-datatable)
  - [Solução de Problemas do DataTable](#solução-de-problemas-do-datatable)
- [Padrões de Lista Simples](#padrões-de-lista-simples)
  - [Item de Lista de Produtos/Variantes](#item-de-lista-de-produtosvariações)
  - [Lista de Texto Simples (Sem Miniaturas)](#lista-de-texto-simples-sem-miniaturas)
  - [Lista Compacta (Sem Cards)](#lista-compacta-sem-cards)
  - [Exibição em Grade](#exibição-em-grade)
- [Elementos Chave de Design](#elementos-chave-de-design)
- [Estados Vazios](#estados-vazios)
- [Estados de Carregamento](#estados-de-carregamento)
- [Renderização Condicional Baseada em Contagem](#renderização-condicional-baseada-em-contagem)
- [Padrões de Classe Comuns](#padrões-de-classe-comuns)

## Quando Usar Cada Padrão

**Use DataTable quando:**- Exibir potencialmente muitos registros (>5-10 itens)
- Os usuários precisam buscar, filtrar ou paginar
- Ações em lote são necessárias (selecionar múltiplos, excluir, etc.)
- Exibir em uma visão de lista principal**Use componentes de lista simples quando:**- Exibir poucos registros (<5-10 itens)
- Em um contexto de widget ou barra lateral
- Como uma prévia ou resumo
- Quando o espaço é limitado

## Padrão DataTable**⚠️ Usuários pnpm**: Os exemplos de DataTable podem usar `react-router-dom` para navegação. Instale-o ANTES de implementar, se necessário.

### Implementação Completa do DataTable

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
  columnHelper.select(), // Para seleção de linha
  columnHelper.accessor("title", {
    header: "Título",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("created_at", {
    header: "Criado",
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
  const offset = pagination.pageIndex *limit

  // Buscar produtos com busca e paginação
  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.admin.product.list({
        limit,
        offset,
        q: searchValue || undefined, // Consulta de busca
      }),
    queryKey: ["products", limit, offset, searchValue],
    keepPreviousData: true, // Paginação suave
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
          <DataTable.Search placeholder="Buscar produtos..." />
        </div>
      </DataTable.Toolbar>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable>
  )
}
```

### Solução de Problemas do DataTable**"DataTable.Search foi renderizado, mas a busca não está ativada"**Você deve passar a configuração de estado de busca para `useDataTable`:

```tsx
search: {
  state: searchValue,
  onSearchChange: setSearchValue,
}
```**"Não é possível desestruturar a propriedade 'pageIndex' de pagination porque é undefined"**Sempre inicialize o estado de paginação com ambas as propriedades:

```tsx
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 15,
})
```

## Padrões de Lista Simples

### Item de Lista de Produtos/Variantes

Para exibir uma pequena lista de produtos ou variantes com miniaturas:

```tsx
import { Thumbnail, Text } from "@medusajs/ui"
import { TriangleRightMini } from "@medusajs/icons"
import { Link } from "react-router-dom"

// Componente para exibir uma variante de produto
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

// Uso em um widget
const RelatedProductsDisplay = ({ products }) => {
  if (products.length > 10) {
    // Usar DataTable para muitos itens
    return <ProductDataTable products={products} />
  }

  // Usar lista simples para poucos itens
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

### Lista de Texto Simples (Sem Miniaturas)

Para entidades sem imagens (categorias, regiões, etc.):

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

// Uso
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

### Lista Compacta (Sem Cards)

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

### Exibição em Grade

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

## Elementos Chave de Design

### Para exibição de Produtos/Variantes

- Sempre exibir a miniatura usando o componente `<Thumbnail />`
- Exibir o título com `<Text size="small" leading="compact" weight="plus">`
- Mostrar informações secundárias com `<Text size="small" leading="compact" className="text-ui-fg-subtle">`
- Usar `shadow-elevation-card-rest` para elevação de cartão
- Incluir estados hover com `bg-ui-bg-component-hover`
- Adicionar indicadores de navegação (setas) quando os itens são clicáveis

### Para outras entidades

- Usar padrões de cartão semelhantes, mas adaptar o conteúdo
- Manter espaçamento consistente (`gap-3` para itens, `gap-2` para listas)
- Sempre usar o componente Text com padrões de tipografia corretos
- Manter hierarquia visual com `weight="plus"` para texto primário e `text-ui-fg-subtle` para texto secundário

## Casos de Uso Yello Solar Hub

-**Visualização de Catálogo (DataTable):**Exibição da lista completa de produtos (módulos, inversores, baterias) no painel administrativo, permitindo que a equipe filtre por marca, status de estoque ou data de aprovação comercial.
-**Fluxo de Cotação B2B (DataTable/Lista Simples):**Apresentação de uma lista paginada de cotações B2B geradas, onde o analista pode ver rapidamente o cliente, o status da aprovação comercial e o valor total cotado.
-**Seleção de Regiões/Distribuidores (Lista Simples):**Exibição em um widget de navegação de todos os distribuidores ou regiões atendidas, permitindo acesso direto ao painel operacional específico daquela área.
-**Visualização de Kits Solares (Exibição em Grade):**Mostrar diferentes kits solares montados (combinação de inversor, módulos e estruturas) de forma visual e atraente, destacando o preço final e a capacidade instalada.
-**Estado de Dados Ausentes (Empty States):** Quando um vendedor consulta um canal regional sem nenhuma cotação B2B registrada, o sistema deve exibir o estado vazio de forma informativa: "Nenhuma cotação B2B encontrada para a Região Sul, por favor, crie a primeira."

## Estados Vazios

Sempre tratar os estados vazios de forma elegante:

```tsx
{items.length === 0 ? (
  <Text size="small" leading="compact" className="text-ui-fg-subtle">
    Nenhum item para exibir
  </Text>
) : (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <ItemDisplay key={item.id} item={item} />
    ))}
  </div>
)}
```

## Estados de Carregamento

Mostrar estados de carregamento enquanto os dados estão sendo buscados:

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

## Renderização Condicional Baseada em Contagem

```tsx
const DisplayComponent = ({ items }) => {
  // Usar DataTable para muitos itens
  if (items.length > 10) {
    return <ItemsDataTable items={items} />
  }

  // Usar lista simples para poucos itens
  if (items.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SimpleListItem key={item.id} item={item} />
        ))}
      </div>
    )
  }

  // Estado vazio
  return (
    <Text size="small" leading="compact" className="text-ui-fg-subtle">
      Nenhum item para exibir
    </Text>
  )
}
```

## Padrões de Classe Comuns

### Card com elevação e hover

```tsx
className="shadow-elevation-card-rest bg-ui-bg-component rounded-md transition-colors hover:bg-ui-bg-component-hover"
```

### Container flex com espaçamento consistente

```tsx
className="flex flex-col gap-2" // Para listas verticais
className="flex items-center gap-3" // Para itens horizontais
```

### Estados de foco para elementos interativos

```tsx
className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md"
```

### Suporte RTL para ícones direcionais

```tsx
className="text-ui-fg-muted rtl:rotate-180"
```stop
