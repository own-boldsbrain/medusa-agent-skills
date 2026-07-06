---
name: building-admin-dashboard-customizations
description: Load automatically when planning, researching, or implementing Medusa Admin dashboard UI (widgets, custom pages, forms, tables, data loading, navigation). REQUIRED for all admin UI work in ALL modes (planning, implementation, exploration). Contains design patterns, component usage, and data loading patterns that MCP servers don't provide.
---

# Personalizações do painel de administração do Medusa

Crie extensões personalizadas da interface do usuário para o painel de administração do Medusa usando o Admin SDK e os componentes da interface do usuário do Medusa.

**Observação:** “Rotas da interface do usuário” são páginas de administração personalizadas, diferentes das rotas da API de back-end (que utilizam a habilidade “building-with-medusa”).

## Quando aplicar

**Utilize essa habilidade para QUALQUER tarefa de desenvolvimento da interface de administração, incluindo:**

- Criação de widgets para páginas de produtos, pedidos e clientes
- Criação de páginas de administração personalizadas
- Implementação de formulários e janelas modais
- Exibição de dados em tabelas ou listas
- Adição de navegação entre páginas

**Carregue também essas habilidades quando:**

- **building-with-medusa:** Criação de rotas de API de back-end chamadas pela interface de usuário de administração
- **building-storefronts:** Se estiver trabalhando na interface do cliente em vez do painel de administração

## CRÍTICO: Carregue os arquivos de referência quando necessário

**A referência rápida abaixo NÃO é suficiente para a implementação.** Você DEVE carregar os arquivos de referência relevantes antes de escrever o código para esse componente.

**Carregue essas referências de acordo com o que você estiver implementando:**

- **Criando widgets?** → É OBRIGATÓRIO carregar `references/data-loading.md` primeiro
- **Criando formulários/modais?** → É OBRIGATÓRIO carregar `references/forms.md` primeiro
- **Exibindo dados em tabelas/listas?** → É OBRIGATÓRIO carregar `references/display-patterns.md` primeiro
- **Selecionando a partir de grandes conjuntos de dados?** → É OBRIGATÓRIO carregar `references/table-selection.md` primeiro
- **Adicionando navegação?** → É OBRIGATÓRIO carregar `references/navigation.md` primeiro
- **Definindo estilos para componentes?** → É OBRIGATÓRIO carregar `references/typography.md` primeiro

**Requisito mínimo:** Carregue pelo menos 1 ou 2 arquivos de referência relevantes para sua tarefa específica antes da implementação.

## Quando usar esta habilidade em comparação com o servidor MCP do MedusaDocs

**⚠️ IMPORTANTE: Esta habilidade deve ser consultada PRIMEIRO para planejamento e implementação.**

**Use esta habilidade como (FONTE PRINCIPAL):**

- **Planejamento**

- Compreender como estruturar os recursos da interface de usuário administrativa
- **Padrões de componentes**

- Widgets, páginas, formulários, tabelas, janelas modais
- **Sistema de design**

- Tipografia, cores, espaçamento, classes semânticas
- **Carregamento de dados**

- Padrão de consulta separada crítica, invalidação de cache
- **Melhores práticas**

- Padrões corretos x incorretos (por exemplo, exibição de consultas na montagem)
- **Regras essenciais**

- O que NÃO fazer (erros comuns, como consultas de exibição condicionais)

**Use o servidor MCP do MedusaDocs como (FONTE SECUNDÁRIA):**

- Assinaturas específicas de propriedades de componentes, depois que você souber qual componente usar
- Lista de zonas de widget disponíveis
- Detalhes dos métodos do SDK JS
- Referência de opções de configuração

**Por que as habilidades vêm em primeiro lugar:**

- As habilidades contêm padrões essenciais, como consultas separadas para exibição e modais, que o MCP não enfatiza
- As habilidades mostram padrões corretos versus incorretos; o MCP mostra o que é possível
- O planejamento requer a compreensão dos padrões, não apenas a referência à API

## Regras essenciais de configuração

### Configuração do cliente do SDK

**CRÍTICO:** Sempre use a configuração exata — valores diferentes causam erros:

```tsx
// src/admin/lib/client.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})
```

### SOMENTE para usuários do pnpm

**CRÍTICO:** Instale as dependências de pares ANTES de escrever qualquer código:

```bash
# Find exact version from dashboard
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
# Install that exact version
pnpm add @tanstack/react-query@[exact-version]

# If using navigation (Link component)
pnpm list react-router-dom --depth=10 | grep @medusajs/dashboard
pnpm add react-router-dom@[exact-version]
```

**Usuários do npm/yarn:** NÃO instalem esses pacotes — eles já estão disponíveis.

## Categorias de regras por prioridade

| Prioridade | Categoria | Impacto | Prefixo |
|----------|----------|--------|--------|
| 1 | Carregamento de dados | CRÍTICA | `data-` |
| 2 | Sistema de design | CRÍTICA | `design-` |
| 3 | Exibição de dados | ALTA (inclui regra de preço CRÍTICA) | `display-` |
| 4 | Tipografia | ALTA | `typo-` |
| 5 | Formulários e modais | MÉDIA | `form-` |
| 6 | Padrões de seleção | MÉDIA | `select-` |

## Referência rápida

### 1. Carregamento de dados (CRÍTICA)

- `data-sdk-always` - **SEMPRE use o SDK do Medusa JS para TODAS as solicitações de API**

- NUNCA use o `fetch()` comum (a falta de cabeçalhos de autenticação causa erros)
- `data-sdk-method-choice` - Use os métodos existentes do SDK para endpoints integrados (`sdk.admin.product.list()`), use `sdk.client.fetch()` para rotas personalizadas
- `data-display-on-mount` - As consultas de exibição DEVEM ser carregadas no momento da montagem (sem condição de ativação baseada no estado da interface do usuário)
- `data-separate-queries` - Separe as consultas de exibição das consultas de modais/formulários
- `data-invalidate-display` - Invalide as consultas de exibição após mutações, não apenas as consultas de modais
- `data-loading-states` - Sempre exiba estados de carregamento (Spinner), e não estados vazios
- `data-pnpm-install-first` - Os usuários do pnpm DEVEM instalar o @tanstack/react-query ANTES de começar a programar

### 2. Sistema de Design (CRÍTICO)

- `design-semantic-colors` - Sempre use classes de cores semânticas (bg-ui-bg-base, text-ui-fg-subtle), nunca codifique valores fixos
- `design-spacing` - Use px-6 py-4 para preenchimento de seções, gap-2 para listas e gap-3 para itens
- `design-button-size` - Sempre use size="small" para botões em widgets e tabelas
- `design-medusa-components` - Sempre use componentes da Medusa UI (Container, Button, Text), e não HTML bruto

### 3. Exibição de dados (ALTA)

- `display-price-format` - **CRÍTICO**: Os preços do Medusa são armazenados tal como estão (US$ 49,99 = 49,99, NÃO em centavos). Exiba-os diretamente — NUNCA divida por 100

### 4. Tipografia (ALTA)

- `typo-text-component` - Sempre use o componente Text do @medusajs/ui, nunca tags span/p simples
- `typo-labels` - Use `<Text size="small" leading="compact" weight="plus">` para rótulos/títulos
- `typo-descriptions` - Use `<Text size="small" leading="compact" className="text-ui-fg-subtle">` para descrições
- `typo-no-heading-widgets` - Nunca use o elemento `Heading` para seções curtas em widgets (use `Text` em vez disso)

### 5. Formulários e modais (MÉDIO)

- `form-focusmodal-create` - Use o FocusModal para criar novas entidades
- `form-drawer-edit` - Use o Drawer para editar entidades existentes
- `form-disable-pending` - Sempre desative ações durante mutações (disabled={mutation.isPending})
- `form-show-loading` - Mostre o estado de carregamento no botão de envio (isLoading={mutation.isPending})

### 6. Padrões de seleção (MÉDIO)

- `select-small-datasets` - Use o componente `Select` para 2 a 10 opções (status, tipos etc.)
- `select-large-datasets` - Use o DataTable com o FocusModal para conjuntos de dados grandes (produtos, categorias etc.)
- `select-search-config` - É necessário passar a configuração de pesquisa para o useDataTable a fim de evitar o erro “pesquisa não habilitada”

## Padrão crítico de carregamento de dados

**SIGA SEMPRE este padrão — nunca carregue dados de exibição condicionalmente:**

```tsx
// ✅ CORRECT - Separate queries with proper responsibilities
const RelatedProductsWidget = ({ data: product }) => {
  const [modalOpen, setModalOpen] = useState(false)

  // Display query - loads on mount
  const { data: displayProducts } = useQuery({
    queryFn: () => fetchSelectedProducts(selectedIds),
    queryKey: ["related-products-display", product.id],
    // No 'enabled' condition - loads immediately
  })

  // Modal query - loads when needed
  const { data: modalProducts } = useQuery({
    queryFn: () => sdk.admin.product.list({ limit: 10, offset: 0 }),
    queryKey: ["products-selection"],
    enabled: modalOpen, // OK for modal-only data
  })

  // Mutation with proper invalidation
  const updateProduct = useMutation({
    mutationFn: updateFunction,
    onSuccess: () => {
      // Invalidate display data query to refresh UI
      queryClient.invalidateQueries({ queryKey: ["related-products-display", product.id] })
      // Also invalidate the entity query
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      // Note: No need to invalidate modal selection query
    },
  })

  return (
    <Container>
      {/* Display uses displayProducts */}
      {displayProducts?.map(p => <div key={p.id}>{p.title}</div>)}

      <FocusModal open={modalOpen} onOpenChange={setModalOpen}>
        {/* Modal uses modalProducts */}
      </FocusModal>
    </Container>
  )
}

// ❌ WRONG - Single query with conditional loading
const BrokenWidget = ({ data: product }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const { data } = useQuery({
    queryFn: () => sdk.admin.product.list(),
    enabled: modalOpen, // ❌ Display breaks on page refresh!
  })

  // Trying to display from modal query
  const displayItems = data?.filter(item => ids.includes(item.id)) // No data until modal opens

  return <div>{displayItems?.map(...)}</div> // Empty on mount!
}
```

**Por que isso é importante:**

- Ao atualizar a página, o modal é fechado, portanto a consulta condicional não é executada
- O usuário vê uma tela vazia em vez de seus dados
- A exibição depende da interação com o modal (experiência do usuário prejudicada)

## Lista de verificação de erros comuns

Antes de implementar, verifique se você NÃO está cometendo estes erros:

**Carregamento de dados:**

- [ ] Usar o fetch() comum em vez do SDK do Medusa JS (causa erros de falta de cabeçalho de autenticação)
- [ ] Não usar os métodos existentes do SDK para endpoints integrados (por exemplo, usar sdk.client.fetch("/admin/products") em vez de sdk.admin.product.list())
- [ ] Carregar dados de exibição condicionalmente com base no estado do modal/da interface do usuário
- [ ] Usar uma única consulta tanto para a exibição quanto para o modal
- [ ] Esquecer de invalidar as consultas de exibição após alterações
- [ ] Não lidar com os estados de carregamento (mostrar uma tela vazia em vez do indicador de carregamento)
- [ ] Usuários do pnpm: Não instalar o @tanstack/react-query antes de começar a programar

**Sistema de Design:**

- [ ] Usar cores codificadas em vez de classes semânticas
- [ ] Esquecer de definir size="small" nos botões dos widgets
- [ ] Não usar px-6 py-4 para o preenchimento das seções
- [ ] Usar elementos HTML brutos em vez de componentes da Medusa UI

**Exibição de dados:**

- [ ] **CRÍTICO**: Dividir os preços por 100 ao exibi-los (os preços são armazenados como estão: $49,99 = 49,99, NÃO em centavos)

**Tipografia:**

- [ ] Usar tags span/p simples em vez do componente Text
- [ ] Não usar weight="plus" para rótulos
- [ ] Não usar text-ui-fg-subtle para descrições
- [ ] Usar Heading em seções pequenas do widget

**Formulários:**

- [ ] Usar Drawer para criar (deveria usar FocusModal)
- [ ] Usar FocusModal para editar (deveria usar Drawer)
- [ ] Não desativar botões durante alterações
- [ ] Não exibe o status de carregamento ao enviar

**Seleção:**

- [ ] Usar DataTable para menos de 10 itens (exagero)
- [ ] Usar Select para mais de 10 itens (experiência do usuário insatisfatória)
- [ ] Não configurar a pesquisa no useDataTable (causa erro)

## Arquivos de referência disponíveis

Carregue estes arquivos para ver os padrões detalhados:

```
references/data-loading.md       - useQuery/useMutation patterns, cache invalidation
references/forms.md              - FocusModal/Drawer patterns, validation
references/table-selection.md    - Complete DataTable selection pattern
references/display-patterns.md   - Lists, tables, cards for entities
references/typography.md         - Text component patterns
references/navigation.md         - Link, useNavigate, useParams patterns
```

Cada referência contém:

- Guias de implementação passo a passo
- Exemplos de código correto e incorreto
- Erros comuns e soluções
- Exemplos completos e funcionais

## Integração com o backend

**⚠️ IMPORTANTE: SEMPRE use o SDK do Medusa JS para TODAS as solicitações de API — NUNCA use o fetch() comum**

A interface de usuário administrativa se conecta às rotas da API do backend usando o SDK:

```tsx
import { sdk } from "[LOCATE SDK INSTANCE IN PROJECT]"

// ✅ CORRECT - Built-in endpoint: Use existing SDK method
const { data: product } = useQuery({
  queryKey: ["product", productId],
  queryFn: () => sdk.admin.product.retrieve(productId),
})

// ✅ CORRECT - Custom endpoint: Use sdk.client.fetch()
const { data: reviews } = useQuery({
  queryKey: ["reviews", product.id],
  queryFn: () => sdk.client.fetch(`/admin/products/${product.id}/reviews`),
})

// ❌ WRONG - Using regular fetch
const { data } = useQuery({
  queryKey: ["reviews", product.id],
  queryFn: () => fetch(`http://localhost:9000/admin/products/${product.id}/reviews`),
  // ❌ Error: Missing Authorization header!
})

// Mutation to custom backend route
const createReview = useMutation({
  mutationFn: (data) => sdk.client.fetch("/admin/reviews", {
    method: "POST",
    body: data
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", product.id] })
    toast.success("Review created")
  },
})
```

**Por que o SDK é necessário:**

- As rotas de administração exigem os cabeçalhos `Authorization` e o cookie de sessão
- As rotas da loja exigem o cabeçalho `x-publishable-api-key`
- O SDK lida com todos os cabeçalhos necessários automaticamente
- Chamada `fetch()` comum sem cabeçalhos → erros de autenticação/autorização
- O uso dos métodos existentes do SDK oferece maior segurança de tipos

**Quando usar o quê:**

- **Endpoints integrados**: use os métodos existentes do SDK (`sdk.admin.product.list()`, `sdk.store.product.list()`)
- **Endpoints personalizados**: use `sdk.client.fetch()` para suas rotas de API personalizadas

**Para implementar rotas de API de back-end**, carregue a skill `building-with-medusa`.

## Widget x Rota de interface do usuário

**Widgets** ampliam as páginas de administração existentes:

```tsx
// src/admin/widgets/custom-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"

const MyWidget = ({ data }: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  return <Container>Widget content</Container>
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default MyWidget
```

**Rotas da interface do usuário** para criar novas páginas de administração:

```tsx
// src/admin/routes/custom-page/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"

const CustomPage = () => {
  return <div>Page content</div>
}

export const config = defineRouteConfig({
  label: "Custom Page",
})

export default CustomPage
```

## Problemas comuns e soluções

**Erros do tipo “Não é possível encontrar o módulo” (usuários do pnpm):**

- Instale as dependências peer ANTES de programar
- Use as versões exatas indicadas no painel

**Erro “No QueryClient set”:**

- pnpm: Instale @tanstack/react-query
- npm/yarn: Remova o pacote instalado incorretamente

**“DataTable.Search não habilitado”:**

- É necessário passar a configuração de pesquisa para o `useDataTable`

**Widget não está sendo atualizado:**

- Invalide as consultas de exibição, não apenas as consultas modais
- Inclua todas as dependências nas chaves de consulta

**Exibição vazia ao atualizar:**

- A consulta de exibição possui um `enabled` condicional com base no estado da interface do usuário
- Remova a condição — os dados de exibição devem ser carregados na montagem

## Próximos passos — Testando sua implementação

**Após implementar um recurso com sucesso, sempre forneça estes próximos passos ao usuário:**

### 1. Inicie o servidor de desenvolvimento

Se o servidor ainda não estiver em execução, inicie-o:

```bash
npm run dev      # or pnpm dev / yarn dev
```

### 2. Acesse o painel de administração

Abra seu navegador e acesse:

- **Painel de administração:** <http://localhost:9000/app>

Faça login com suas credenciais de administrador.

### 3. Acesse sua interface de usuário personalizada

**Para widgets:**
Acesse a página onde seu widget é exibido. Zonas comuns de widgets:

- **Widgets de produtos:** Vá para Produtos → Selecione um produto → Seu widget aparecerá na zona que você configurou (por exemplo, `product.details.after`)
- **Widgets de pedidos:** Acesse Pedidos → Selecione um pedido → Seu widget aparecerá na zona configurada
- **Widgets de clientes:** Acesse Clientes → Selecione um cliente → Seu widget aparecerá na zona configurada

**Para rotas da interface do usuário (páginas personalizadas):**

- Procure sua página personalizada na barra lateral/navegação do painel de administração (com base no `label` que você configurou)
- Ou acesse diretamente: `http://localhost:9000/app/[seu-caminho-da-rota]`

### 4. Teste a funcionalidade

Dependendo do que foi implementado, teste:

- **Formulários:** Tente criar/editar entidades, verifique a validação e as mensagens de erro
- **Tabelas:** Teste a paginação, a pesquisa, a ordenação e a seleção de linhas
- **Exibição de dados:** Verifique se os dados são carregados corretamente e se são atualizados após alterações
- **Modais:** Abra o FocusModal/Drawer, teste o envio de formulários e verifique se os dados são atualizados
- **Navegação:** Clique nos links e verifique se o redirecionamento funciona corretamente

### Formato para apresentar os próximos passos

Sempre apresente os próximos passos em um formato claro e prático após a implementação:

```markdown
## Implementation Complete

The [feature name] has been successfully implemented. Here's how to see it:

### Start the Development Server
[command based on package manager]

### Access the Admin Dashboard
Open http://localhost:9000/app in your browser and log in.

### View Your Custom UI

**For Widgets:**
1. Navigate to [specific admin page, e.g., "Products"]
2. Select [an entity, e.g., "any product"]
3. Scroll to [zone location, e.g., "the bottom of the page"]
4. You'll see your "[widget name]" widget

**For UI Routes:**
1. Look for "[page label]" in the admin navigation
2. Or navigate directly to http://localhost:9000/app/[route-path]

### What to Test
1. [Specific test case 1]
2. [Specific test case 2]
3. [Specific test case 3]
```
