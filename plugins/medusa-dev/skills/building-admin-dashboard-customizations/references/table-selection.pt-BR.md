# Padrão de Seleção de Tabela

## Conteúdos

- [Pré-Requisitos de Implementação para pnpm](#pré-requisitos-de-implementação-para-pnpm)
- [Exemplo Completo de Widget: Seleção de Produtos Relacionados](#exemplo-completo-de-widget-seleção-de-produtos-relacionados)
- [Detalhes Chave de Implementação](#detalhes-chave-de-implementação)
- [Variações do Padrão](#variações-do-padrão)
- [Observações Importantes](#observações-importantes)

Esta é uma implementação de referência completa para seleção a partir de grandes conjuntos de dados (Produtos, Categorias, Regiões, etc.) em personalizações do Medusa Admin. Este padrão utiliza FocusModal com DataTable para uma experiência de usuário (UX) ótima.

## Pré-Requisitos de Implementação para pnpm

**⚠️ Usuários pnpm**: Este exemplo exige os seguintes pacotes. Instale-os ANTES de implementar:

- `@tanstack/react-query` - para `useQuery` e `useMutation`
- `react-router-dom` - para o componente Link (opcional, pode ser removido se não for necessário)

Verifique e instale com versões exatas:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
pnpm add @tanstack/react-query@[versão-exata]

pnpm list react-router-dom --depth=10 | grep @medusajs/dashboard
pnpm add react-router-dom@[versão-exata]
```

Consulte o arquivo SKILL.md principal para instruções completas de configuração pnpm.

## Exemplo Completo de Widget: Seleção de Produtos Relacionados

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

  // Analisar produtos relacionados existentes no metadado
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

  // Inicializar o estado de seleção com os produtos relacionados existentes
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

  // IMPORTANTE: Consultas separadas para exibição e seleção no modal

  // Consulta 1: Buscar produtos selecionados para exibição (carrega no montagem)
  const { data: displayProducts } = useQuery({
    queryFn: async () => {
      if (initialIds.length === 0) return { products: [] }
      // Buscar produtos específicos por IDs para exibição
      const response = await sdk.admin.product.list({
        id: initialIds, // Buscar apenas os produtos selecionados
        limit: initialIds.length,
      })
      return response
    },
    queryKey: ["related-products-display", initialIds],
    enabled: initialIds.length > 0, // Apenas buscar se houver IDs
  })

  // Consulta 2: Buscar produtos para seleção no modal (somente quando o modal estiver aberto)
  const limit = pagination.pageSize
  const offset = pagination.pageIndex * limit

  const { data: modalProducts, isLoading } = useQuery({
    queryFn: () => sdk.admin.product.list({
      limit,
      offset,
      q: searchValue || undefined,
    }),
    queryKey: ["products-selection", limit, offset, searchValue],
    keepPreviousData: true, // Paginação suave
    enabled: open, // Somente carregar quando o modal estiver aberto
  })

  // Mutação para atualizar o metadado do produto
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
      // Invalidar consultas para atualizar a exibição
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      queryClient.invalidateQueries({ queryKey: ["related-products-display"] })
      toast.success("Sucesso", {
        description: "Produtos relacionados atualizados com sucesso",
        dismissLabel: "Fechar",
      })
      setOpen(false)
    },
    onError: (error) => {
      console.error("Erro ao salvar produtos relacionados:", error)
      toast.error("Erro", {
        description: "Falha ao atualizar produtos relacionados",
        dismissLabel: "Fechar",
      })
    },
  })

  // Obter IDs dos produtos selecionados
  const selectedProductIds = useMemo(() => Object.keys(rowSelection), [rowSelection])

  // Usar query de exibição para mostrar produtos selecionados
  const selectedProducts = displayProducts?.products || []

  const handleSubmit = () => {
    updateProduct.mutate(selectedProductIds)
  }

  const columns = useColumns()

  // Usar modalProducts para a tabela de seleção
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
        <Heading level="h2">Produtos Relacionados</Heading>
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
            Nenhum produto relacionado selecionado
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
                        <DataTable.Search placeholder="Buscar produtos..." />
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
                    Cancelar
                  </Button>
                </FocusModal.Close>
                <Button
                  size="small"
                  onClick={handleSubmit}
                  isLoading={updateProduct.isPending}
                >
                  Salvar
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
      header: "Título",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("created_at", {
      header: "Criado",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    }),
  ], [])
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductRelatedProductsWidget
```

## Casos de Uso Yello Solar Hub

Este padrão é crucial para garantir que a cotação e o catálogo do Yello Solar Hub mantenham a integridade dos componentes em um ecossistema de sistemas solares complexos.

- **Cotações B2B Multicomponente:** Selecionar múltiplos equipamentos interconectados (ex: Inversor A + Módulos B + Bateria C) em um único registro de cotação, permitindo que o sistema calcule automaticamente o requisito de potência ou o *footprint* total do projeto.
- **Rastreabilidade de Kits de Reparo:** Ao registrar um kit de reparo em campo, o uso do padrão permite selecionar todas as peças de estoque (estrutura, parafusos, módulos) que pertencem ao mesmo sistema, garantindo que o histórico de peças possa ser consultado rapidamente.
- **Variação e Compatibilidade de Produtos:** Quando um usuário modifica um componente (ex: troca de um Inversor de 10kW para 15kW), o padrão garante que a seleção de produtos complementares (módulos, estruturas) seja ajustada e limitada apenas a modelos compatíveis com o novo componente selecionado.
- **Catálogo e Cross-selling:** Em páginas de visualização de produtos em catálogo, o widget pode ser usado para permitir que o vendedor adicione "Produtos Sugeridos/Complementares" que fazem parte do mesmo ecossistema de energia, mas que não são a peça principal do produto visualizado.

## Detalhes Chave de Implementação

### 1. Tipografia

- Use `<Text size="small" leading="compact" weight="plus">` para títulos e rótulos de produtos
- Use `<Text size="small" leading="compact" className="text-ui-fg-subtle">` para descrições
- Os cabeçalhos do contêiner podem usar o componente `<Heading>`
- Consulte [typography.md](typography.md) para guias completos de tipografia

### 2. Gerenciamento de Estado

- Use `DataTableRowSelectionState` para rastrear linhas selecionadas
- Inicialize com seleções existentes no metadado
- Use `DataTablePaginationState` com `pageIndex` e `pageSize`

### 3. Padrão de Carregamento de Dados - CRÍTICO

**Sempre use consultas separadas para exibição vs seleção no modal:**

```tsx
// Consulta de exibição - carrega no montagem, busca itens específicos
const { data: displayProducts } = useQuery({
  queryFn: () => sdk.admin.product.list({
    id: initialIds, // Buscar produtos específicos por IDs
  }),
  queryKey: ["related-products-display", initialIds],
  enabled: initialIds.length > 0,
})

// Consulta do modal - carrega quando o modal abre, paginado
const { data: modalProducts } = useQuery({
  queryFn: () => sdk.admin.product.list({
    limit, offset, q: searchValue,
  }),
  queryKey: ["products-selection", limit, offset, searchValue],
  enabled: open, // Apenas quando o modal estiver aberto
  keepPreviousData: true,
})
```

**Por que este padrão?**

- Os dados de exibição carregam imediatamente ao montar
- Os dados do modal só carregam quando necessários
- Evita o problema de "Nenhum dado" em recarregamentos de página
- Lida corretamente com referências baseadas em ID

### 4. Atualização com useMutation e Invalidação de Cache

```tsx
const updateProduct = useMutation({
  mutationFn: (payload) => sdk.admin.product.update(id, payload),
  onSuccess: () => {
    // Invalidar AS DUAS consultas: o produto e a de exibição
    queryClient.invalidateQueries({ queryKey: ["product", id] })
    queryClient.invalidateQueries({ queryKey: ["related-products-display"] })
    toast.success("Atualizado com sucesso")

    // Nota: Não é necessário invalidar ["products-selection"] - são dados do modal
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

### 6. Estrutura do Componente

```tsx
<DataTable instance={table}>
  <DataTable.Toolbar>
    <div className="flex gap-2">
      <DataTable.Search placeholder="Buscar..." />
    </div>
  </DataTable.Toolbar>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable>
```

## Variações do Padrão

### Para Seleção de Categorias

```tsx
const { data, isLoading } = useQuery({
  queryFn: () => sdk.admin.productCategory.list({ limit, offset }),
  queryKey: ["categories", limit, offset],
})
```

### Para Seleção de Regiões

```tsx
const { data, isLoading } = useQuery({
  queryFn: () => sdk.admin.region.list({ limit, offset }),
  queryKey: ["regions", limit, offset],
})
```

### Para Endpoints Customizados

```tsx
const { data, isLoading } = useQuery({
  queryFn: () => sdk.client.fetch("/admin/custom-endpoint", {
    query: { limit, offset, search: searchValue }
  }),
  queryKey: ["custom-data", limit, offset, searchValue],
})
```

## Observações Importantes

1. **Considerações do Gerenciador de Pacotes**:
   - **Usuários pnpm**: É OBRIGATÓRIO instalar `@tanstack/react-query` e `react-router-dom` ANTES de implementar (veja Pré-Requisitos acima)
   - **Usuários npm/yarn**: NÃO instale esses pacotes - eles já estão disponíveis através do dashboard
2. **Sempre use `keepPreviousData: true`** para paginação, evitando piscar a interface (UI flicker).
3. **Busca é no lado do servidor** - Passe o valor da busca na função da consulta (query function).
4. **Atualizações de metadados substituem o objeto inteiro** - Espalhe (spread) os metadados existentes ao atualizar.
5. **Use dependências de `queryKey` corretas** - Inclua todos os parâmetros que afetam os dados.

Este padrão fornece uma maneira consistente e performática de lidar com a seleção a partir de grandes conjuntos de dados em personalizações do Medusa Admin.stop
