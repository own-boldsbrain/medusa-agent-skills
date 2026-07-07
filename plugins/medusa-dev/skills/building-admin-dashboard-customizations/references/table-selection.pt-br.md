# Padrão de Seleção de Tabelas

## Índice

- [Requisitos prévios à implementação do pnpm](#requisitos-previos-à-implementacao-do-pnpm)
- [Exemplo completo de widget: Seleção de produtos relacionados](#exemplo-completo-de-widget-selecao-de-produtos-relacionados)
- [Detalhes-chave da implementação](#detalhes-chave-da-implementacao)
- [Variações do padrão](#variacoes-de-padrao)
- [Observações importantes](#observacoes-importantes)

Esta é uma implementação de referência completa para seleção a partir de grandes conjuntos de dados (produtos, categorias, regiões etc.) nas personalizações do Medusa Admin. Este padrão utiliza o FocusModal com o DataTable para proporcionar uma experiência do usuário (UX) ideal.

## Requisitos prévios à implementação do pnpm

**⚠️ Usuários do pnpm**: Este exemplo requer os seguintes pacotes. Instale-os ANTES de implementar:

- `@tanstack/react-query` - para useQuery e useMutation
- `react-router-dom` - para o componente Link (opcional, pode ser removido se não for necessário)

Verifique e instale as versões exatas:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
pnpm add @tanstack/react-query@[exact-version]

pnpm list react-router-dom --depth=10 | grep @medusajs/dashboard
pnpm add react-router-dom@[exact-version]
```

Consulte o arquivo SKILL.md principal para obter instruções completas sobre a configuração do pnpm.

## Exemplo completo de widget: Seleção de produtos relacionados

```tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Button,
  toast,
  FocusModal,
  Text,
  DataTable,
  DataTableRowSelectionState,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
} from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useMemo, useState } from "react"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"
import { PencilSquare } from "@medusajs/icons"

const ProductRelatedProductsWidget = ({
  data: product
}: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Parse existing related products from metadata
  const initialIds = useMemo(() => {
    if (product?.metadata?.related_product_ids) {
      try {
        const ids = JSON.parse(product.metadata.related_product_ids as string)
        return Array.isArray(ids) ? ids : []
      } catch {
        return []
      }
    }
    return []
  }, [product?.metadata?.related_product_ids])

  // Initialize selection state with existing related products
  const initialState = useMemo(() => {
    return initialIds.reduce((acc, id) => {
      acc[id] = true
      return acc
    }, {} as DataTableRowSelectionState)
  }, [initialIds])

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(initialState)
  const [searchValue, setSearchValue] = useState("")
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  // IMPORTANT: Separate queries for display and modal selection

  // Query 1: Fetch selected products for display (loads on mount)
  const { data: displayProducts } = useQuery({
    queryFn: async () => {
      if (initialIds.length === 0) return { products: [] }
      // Fetch specific products by IDs for display
      const response = await sdk.admin.product.list({
        id: initialIds, // Fetch only the selected products
        limit: initialIds.length,
      })
      return response
    },
    queryKey: ["related-products-display", initialIds],
    enabled: initialIds.length > 0, // Only fetch if there are IDs
  })

  // Query 2: Fetch products for modal selection (only when modal is open)
  const limit = pagination.pageSize
  const offset = pagination.pageIndex * limit

  const { data: modalProducts, isLoading } = useQuery({
    queryFn: () => sdk.admin.product.list({
      limit,
      offset,
      q: searchValue || undefined,
    }),
    queryKey: ["products-selection", limit, offset, searchValue],
    keepPreviousData: true, // Smooth pagination
    enabled: open, // Only load when modal is open
  })

  // Mutation to update the product metadata
  const updateProduct = useMutation({
    mutationFn: (relatedProductIds: string[]) => {
      return sdk.admin.product.update(product.id, {
        metadata: {
          ...product.metadata,
          related_product_ids: JSON.stringify(relatedProductIds),
        },
      })
    },
    onSuccess: () => {
      // Invalidate queries to refresh the display
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      queryClient.invalidateQueries({ queryKey: ["related-products-display"] })
      toast.success("Success", {
        description: "Related products updated successfully",
        dismissLabel: "Close",
      })
      setOpen(false)
    },
    onError: (error) => {
      console.error("Error saving related products:", error)
      toast.error("Error", {
        description: "Failed to update related products",
        dismissLabel: "Close",
      })
    },
  })

  // Get selected product IDs
  const selectedProductIds = useMemo(() => Object.keys(rowSelection), [rowSelection])

  // Use display query for showing selected products
  const selectedProducts = displayProducts?.products || []

  const handleSubmit = () => {
    updateProduct.mutate(selectedProductIds)
  }

  const columns = useColumns()

  // Use modalProducts for the selection table
  const availableProducts = useMemo(() => {
    if (!modalProducts?.products) return []
    return modalProducts.products.filter(p => p.id !== product.id)
  }, [modalProducts?.products, product.id])

  const table = useDataTable({
    data: availableProducts,
    columns,
    getRowId: (row) => row.id,
    rowCount: modalProducts?.count || 0,
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
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Related Products</Heading>
        <Button
          size="small"
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          <PencilSquare />
        </Button>
      </div>
      <div className="px-6 py-4">
        {selectedProducts.length === 0 ? (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            No related products selected
          </Text>
        ) : (
          <div className="flex flex-col gap-y-2">
            {selectedProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <Text size="small" leading="compact" weight="plus">
                  {p.title}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <div className="flex h-full flex-col overflow-hidden">
            <FocusModal.Header />
            <FocusModal.Body className="flex items-start justify-center">
              <div className="w-full max-w-3xl">
                <div className="flex flex-col gap-y-6">
                  <DataTable instance={table}>
                    <DataTable.Toolbar>
                      <div className="flex gap-2">
                        <DataTable.Search placeholder="Search products..." />
                      </div>
                    </DataTable.Toolbar>
                    <DataTable.Table />
                    <DataTable.Pagination />
                  </DataTable>
                </div>
              </div>
            </FocusModal.Body>
            <FocusModal.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </FocusModal.Close>
                <Button
                  size="small"
                  onClick={handleSubmit}
                  isLoading={updateProduct.isPending}
                >
                  Save
                </Button>
              </div>
            </FocusModal.Footer>
          </div>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminProduct>()

const useColumns = () => {
  return useMemo(() => [
    columnHelper.select(),
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
  ], [])
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductRelatedProductsWidget
```

## Detalhes-chave da implementação

### 1. Tipografia

- Use `<Text size="small" leading="compact" weight="plus">` para títulos e rótulos de produtos
- Use `<Text size="small" leading="compact" className="text-ui-fg-subtle">` para descrições
- Os cabeçalhos dos contêineres podem usar o componente `<Heading>`
- Consulte [typography.md](typography.md) para obter as diretrizes completas de tipografia

### 2. Gerenciamento de estado

- Use `DataTableRowSelectionState` para rastrear linhas selecionadas
- Inicialize com as seleções existentes a partir dos metadados
- Use `DataTablePaginationState` com `pageIndex` e `pageSize`

### 3. Padrão de carregamento de dados - CRÍTICO

**Sempre use consultas separadas para exibição e seleção modal:**

```tsx
// Display query - loads on mount, fetches specific items
const { data: displayProducts } = useQuery({
  queryFn: () => sdk.admin.product.list({
    id: initialIds, // Fetch specific products by IDs
  }),
  queryKey: ["related-products-display", initialIds],
  enabled: initialIds.length > 0,
})

// Modal query - loads when modal opens, paginated
const { data: modalProducts } = useQuery({
  queryFn: () => sdk.admin.product.list({
    limit, offset, q: searchValue,
  }),
  queryKey: ["products-selection", limit, offset, searchValue],
  enabled: open, // Only when modal is open
  keepPreviousData: true,
})
```

**Por que esse padrão?**

- Os dados de exibição são carregados imediatamente ao serem montados
- Os dados modais só são carregados quando necessário
- Evita a mensagem “Sem dados” ao atualizar a página
- Lida corretamente com referências baseadas em ID

### 4. Atualização com useMutation e invalidação de cache

```tsx
const updateProduct = useMutation({
  mutationFn: (payload) => sdk.admin.product.update(id, payload),
  onSuccess: () => {
    // Invalidate BOTH the product and display queries
    queryClient.invalidateQueries({ queryKey: ["product", id] })
    queryClient.invalidateQueries({ queryKey: ["related-products-display"] })
    toast.success("Updated successfully")

    // Note: No need to invalidate ["products-selection"] - that's modal data
  },
})
```

### 5. Configuração do DataTable

Sempre forneça todas as configurações necessárias:

```tsx
const table = useDataTable({
  data: data?.products || [],
  columns,
  getRowId: (row) => row.id,
  rowCount: data?.count || 0,
  isLoading,
  rowSelection: { /* config */ },
  search: { /* config */ },
  pagination: { /* config */ },
})
```

### 6. Estrutura do componente

```tsx
<DataTable instance={table}>
  <DataTable.Toolbar>
    <div className="flex gap-2">
      <DataTable.Search placeholder="Search..." />
    </div>
  </DataTable.Toolbar>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable>
```

## Variações de padrão

### Para seleção de categorias

```tsx
const { data, isLoading } = useQuery({
  queryFn: () => sdk.admin.productCategory.list({ limit, offset }),
  queryKey: ["categories", limit, offset],
})
```

### Para seleção de regiões

```tsx
const { data, isLoading } = useQuery({
  queryFn: () => sdk.admin.region.list({ limit, offset }),
  queryKey: ["regions", limit, offset],
})
```

### Para pontos de extremidade personalizados

```tsx
const { data, isLoading } = useQuery({
  queryFn: () => sdk.client.fetch("/admin/custom-endpoint", {
    query: { limit, offset, search: searchValue }
  }),
  queryKey: ["custom-data", limit, offset, searchValue],
})
```

## Observações importantes

1. **Considerações sobre o gerenciador de pacotes**:
   - **Usuários do pnpm**: DEVEM instalar `@tanstack/react-query` e `react-router-dom` ANTES da implementação (consulte os Requisitos pré-implementação acima)
   - **Usuários do npm/yarn**: NÃO instalem esses pacotes — eles já estão disponíveis no painel
2. **Sempre use `keepPreviousData: true`** para a paginação, a fim de evitar tremulação na interface do usuário
3. **A pesquisa é feita no lado do servidor** — Passe o valor da pesquisa na função de consulta
4. **Atualizações de metadados substituem o objeto inteiro** — Espalhe os metadados existentes ao atualizar
5. **Utilize dependências adequadas nas chaves de consulta** — Inclua todos os parâmetros que afetam os dados

Esse padrão oferece uma maneira consistente e eficiente de lidar com a seleção de grandes conjuntos de dados nas personalizações do Medusa Admin.
