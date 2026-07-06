# Navegação e Roteamento

## Conteúdo

- [Pré-requisitos de Implementação para pnpm](#pre-requisitos-de-implementacao-para-pnpm)
- [Navegação Básica com Componente Link](#navegacao-basica-com-componente-link)
- [Navegação Programática](#navegacao-programatica)
- [Acessando Parâmetros de Rota](#acessando-parametros-de-rota)
- [Linkagem para Páginas Admin Nativas](#linkagem-para-paginas-admin-nativas)
- [Navegação a partir de Widgets](#navegacao-a-partir-de-widgets)
- [Padrões Comuns de Navegação](#padrões-comuns-de-navegação)

## Pré-requisitos de Implementação para pnpm

**⚠️ Usuários pnpm**: A navegação exige `react-router-dom`. Instale ANTES de implementar:

```bash
pnpm list react-router-dom --depth=10 | grep @medusajs/dashboard
pnpm add react-router-dom@[exact-version]
```

**Usuários npm/yarn**: NÃO instale - já está disponível nas dependências do dashboard.

## Navegação Básica com Link Component

Use o componente `Link` para navegação interna em widgets e páginas customizadas:

```tsx
import { Link } from "react-router-dom"
import { Text } from "@medusajs/ui"
import { TriangleRightMini } from "@medusajs/icons"

// Link para uma página customizada
<Link
  to="/custom/my-page"
  className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md [&:hover>div]:bg-ui-bg-component-hover"
>
  <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-3 transition-colors">
    <div className="flex items-center gap-3">
      <Text size="small" leading="compact" weight="plus">
        Ir para a Página Customizada
      </Text>
      <div className="size-7 flex items-center justify-center">
        <TriangleRightMini className="text-ui-fg-muted rtl:rotate-180" />
      </div>
    </div>
  </div>
</Link>
```

### Link com ID Dinâmico

```tsx
// Link para detalhes do produto
<Link to={`/products/${product.id}`}>
  <Text size="small" leading="compact" weight="plus">
    {product.title}
  </Text>
</Link>
```

### Link Estilizado como Botão

```tsx
import { Button } from "@medusajs/ui"
import { Link } from "react-router-dom"

<Button asChild size="small" variant="secondary">
  <Link to="/custom/my-page">
    Ver Detalhes
  </Link>
</Button>
```

## Navegação Programática

Use `useNavigate` para navegação após ações (por exemplo, após criar uma entidade):

```tsx
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast, Button } from "@medusajs/ui"
import { sdk } from "../lib/client"

const CreateProductWidget = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createProduct = useMutation({
    mutationFn: (data) => sdk.admin.product.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Produto criado com sucesso")

      // Navega para a página do novo produto
      navigate(`/products/${result.product.id}`)
    },
    onError: (error) => {
      toast.error(error.message || "Falha ao criar o produto")
    },
  })

  const handleCreate = () => {
    createProduct.mutate({
      title: "Novo Produto",
      // ... outros campos
    })
  }

  return (
    <Button onClick={handleCreate} isLoading={createProduct.isPending}>
      Criar e Visualizar Produto
    </Button>
  )
}
```

### Navegar com Estado

Passar dados para a página de destino:

```tsx
navigate("/custom/review", {
  state: { productId: product.id, productTitle: product.title }
})

// Acesso na página de destino
import { useLocation } from "react-router-dom"

const ReviewPage = () => {
  const location = useLocation()
  const { productId, productTitle } = location.state || {}

  return <div >Revisando: {productTitle}</div>
}
```

### Voltar

```tsx
const navigate = useNavigate()

<Button onClick={() => navigate(-1)}>
  Voltar
</Button>
```

## Acessando Parâmetros de Rota

Em páginas customizadas, acesse parâmetros de URL com `useParams`:

```tsx
// Página customizada em: /custom/products/:id
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client"
import { Container, Heading } from "@medusajs/ui"

const ProductDetailsPage = () => {
  const { id } = useParams() // Obtém :id da URL

  const { data: product, isLoading } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(id, {
      fields: "+metadata,+variants.*",
    }),
    queryKey: ["product", id],
    enabled: !!id, // Apenas busca se o ID existir
  })

  if (isLoading) return <div >Carregando...</div >

  return (
    <Container>
      <Heading>{product?.title}</Heading>
      {/* Detalhes do produto */}
    </Container>
  )
}

export default ProductDetailsPage
```

### Múltiplos Parâmetros

```tsx
// Rota: /custom/orders/:orderId/items/:itemId
const { orderId, itemId } = useParams()

const { data } = useQuery({
  queryFn: () => sdk.client.fetch(`/admin/orders/${orderId}/items/${itemId}`),
  queryKey: ["order-item", orderId, itemId],
  enabled: !!orderId && !!itemId,
})
```

### Parâmetros de Consulta

Use `useSearchParams` para parâmetros de string de consulta:

```tsx
import { useSearchParams } from "react-router-dom"

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get("status") // Obtém ?status=published
  const page = searchParams.get("page") // Obtém ?page=2

  const { data } = useQuery({
    queryFn: () => sdk.admin.product.list({
      status,
      offset: (parseInt(page) || 0) * 15,
    }),
    queryKey: ["products", status, page],
  })

  // Atualiza parâmetros de consulta
  const handleFilterChange = (newStatus: string) => {
    setSearchParams({ status: newStatus, page: "0" })
  }

  return (
    <div >
      <Button onClick={() => handleFilterChange("published")}>
        Publicado Apenas
      </Button>
      {/* Lista de produtos */}
    </div >
  )
}
```

## Linkagem para Páginas Admin Nativas

Linkar para páginas admin padrão do Medusa:

```tsx
import { Link } from "react-router-dom"

// Detalhes do produto
<Link to={`/products/${productId}`}>Ver Produto</Link>

// Detalhes do pedido
<Link to={`/orders/${orderId}`}>Ver Pedido</Link>

// Detalhes do cliente
<Link to={`/customers/${customerId}`}>Ver Cliente</Link>

// Categorias de produto
<Link to="/categories">Ver Categorias</Link>

// Configurações
<Link to="/settings">Configurações</Link>

// Campo customizado em configurações
<Link to="/settings/custom-field-name">Configurações Personalizadas</Link>
```

### Rotas Nativas Comuns

```tsx
const ADMIN_ROUTES = {
  products: "/products",
  productDetails: (id: string) => `/products/${id}`,
  orders: "/orders",
  orderDetails: (id: string) => `/orders/${id}`,
  customers: "/customers",
  customerDetails: (id: string) => `/customers/${id}`,
  categories: "/categories",
  inventory: "/inventory",
  pricing: "/pricing",
  settings: "/settings",
}

// Uso
<Link to={ADMIN_ROUTES.productDetails(product.id)}>
  Ver Produto
</Link>
```

## Navegação a partir de Widgets

### Padrão: Link Ver Todos

Adicionar um link "Ver Todos" de um widget para uma página customizada:

```tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { DetailWidgetProps } from "@medusajs/framework/types"

const RelatedProductsWidget = ({ data: product }) => {
  // ... lógica do widget

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Produtos Relacionados</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary" onClick={() => setOpen(true)}>
            Editar
          </Button>
          <Button asChild size="small" variant="transparent">
            <Link to={`/custom/products/${product.id}/related`}>
              Ver Todos
            </Link>
          </Button>
        </div >
      </div >
      {/* Conteúdo do widget */}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default RelatedProductsWidget
```

### Padrão: Navegação de Item da Lista

Tornar itens de lista clicáveis para navegar:

```tsx
import { Thumbnail, Text } from "@medusajs/ui"
import { TriangleRightMini } from "@medusajs/icons"
import { Link } from "react-router-dom"

const ProductListItem = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md [&:hover>div]:bg-ui-bg-component-hover"
    >
      <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-2 transition-colors">
        <div className="flex items-center gap-3">
          <Thumbnail src={product.thumbnail} />
          <div className="flex flex-1 flex-col">
            <Text size="small" leading="compact" weight="plus">
              {product.title}
            </Text>
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {product.status}
            </Text>
          </div >
          <div className="size-7 flex items-center justify-center">
            <TriangleRightMini className="text-ui-fg-muted rtl:rotate-180" />
          </div >
        </div >
      </div >
    </Link>
  )
}
```

## Padrões Comuns de Navegação

### Padrão: Voltar para a Lista

Navegar de volta para a lista após visualizar detalhes:

```tsx
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"

const DetailsPage = () => {
  const navigate = useNavigate()

  return (
    <div >
      <div className="flex items-center gap-x-2 mb-4">
        <IconButton onClick={() => navigate("/custom/products")}>
          <ArrowLeft />
        </IconButton>
        <Heading>Detalhes do Produto</Heading>
      </div >
      {/* Conteúdo dos detalhes */}
    </div >
  )
}
```

### Padrão: Navegação Breadcrumb

```tsx
import { Link } from "react-router-dom"
import { Text } from "@medusajs/ui"

const Breadcrumbs = ({ product }) => {
  return (
    <div className="flex items-center gap-x-2">
      <Link to="/products">
        <Text size="small" className="text-ui-fg-subtle hover:text-ui-fg-base">
          Produtos
        </Text>
      </Link>
      <Text size="small" className="text-ui-fg-muted">/</Text>
      <Link to={`/products/${product.id}`}>
        <Text size="small" className="text-ui-fg-subtle hover:text-ui-fg-base">
          {product.title}
        </Text>
      </Link>
      <Text size="small" className="text-ui-fg-muted">/</Text>
      <Text size="small" weight="plus">Detalhes</Text>
    </div >
  )
}
```

### Padrão: Navegação por Abas (Tabs)

Navegar entre diferentes visualizações usando abas:

```tsx
import { useSearchParams, Link } from "react-router-dom"
import { Tabs } from "@medusajs/ui"

const ProductTabs = () => {
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "details"

  return (
    <Tabs value={activeTab}>
      <Tabs.List>
        <Tabs.Trigger value="details" asChild>
          <Link to="?tab=details">Detalhes</Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="variants" asChild>
          <Link to="?tab=variants">Variantes</Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="media" asChild>
          <Link to="?tab=media">Mídia</Link>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="details">
        {/* Conteúdo dos detalhes */}
      </Tabs.Content>
      <Tabs.Content value="variants">
        {/* Conteúdo das variantes */}
      </Tabs.Content>
      <Tabs.Content value="media">
        {/* Conteúdo da mídia */}
      </Tabs.Content>
    </Tabs>
  )
}
```

### Padrão: Ação com Navegação

Executar uma ação e depois navegar:

```tsx
const deleteProduct = useMutation({
  mutationFn: (id) => sdk.admin.product.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
    toast.success("Produto excluído")
    navigate("/products") // Navega para a lista após exclusão
  },
})
```

### Padrão: Navegação Condicional

Navegar com base no estado ou dados:

```tsx
const handleComplete = () => {
  if (hasErrors) {
    toast.error("Por favor, corrija os erros primeiro")
    return
  }

  if (isDraft) {
    navigate(`/custom/products/${id}/publish`)
  } else {
    navigate("/products")
  }
}
```

## Casos de Uso Yello Solar Hub

- **Visualização de Catálogo B2B:** Ao navegar pelo catálogo Medusa, clicar em um item (Painel Solar, Inversor) deve usar o componente `<Link>` para levar o usuário de forma otimizada para a página de detalhes do produto, carregando o SKU, modelos e especificações técnicas.
- **Fluxo de Cotação (Programático):** Após o administrador finalizar o preenchimento de uma cotação B2B e clicar em "Submeter Cotação", a função deve usar `useMutation` e, em caso de sucesso, chamar `navigate` para redirecionar o usuário diretamente para a tela de acompanhamento da cotação recém-criada (`/quotes/:id`).
- **Rastreamento de Serviço em Campo:** Um widget de "Serviço Recente" deve exibir um botão "Ver Histórico" que utiliza `Link` com parâmetros dinâmicos, direcionando para `/services/device/:id` para que o técnico visualize todas as intervenções registradas no módulo de ativos.
- **Filtro Operacional de Produtos:** Em listas de produtos ou equipamentos, usar `useSearchParams` para permitir que o usuário filtre resultados complexos (ex: `?status=em_estoque&marca=Yello&vetor=string`) e atualizar a URL sem recarregar a página.

## Notas Importantes

1. **Usuários pnpm**: Devem instalar `react-router-dom` com versão exata do dashboard
2. **Usuários npm/yarn**: NÃO devem instalar `react-router-dom` - já está disponível
3. **Sempre usar caminhos relativos** começando com `/` para navegação interna
4. **Usar Link para links de navegação** - melhor para SEO e acessibilidade
5. **Usar navigate para navegação programática** - após ações ou baseada em lógica
6. **Sempre tratar estados de carregamento** ao buscar dados baseados em parâmetros de rota
7. **Limpar em desmontagem** ao usar *listeners* ou *subscriptions* em rotas
8. **Manter o gerenciamento de foco** para acessibilidade ao navegarstop
