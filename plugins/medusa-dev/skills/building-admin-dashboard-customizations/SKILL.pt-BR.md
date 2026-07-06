---
name: building-admin-dashboard-customizations
description: Carregado automaticamente ao planejar, pesquisar ou implementar a UI do Painel de Controle Medusa (widgets, páginas personalizadas, formulários, tabelas, carregamento de dados, navegação). OBRIGATÓRIO para todo trabalho de UI de admin em TODOS os modos (planejamento, implementação, exploração). Contém padrões de design, uso de componentes e padrões de carregamento de dados que os servidores MCP não fornecem.
---


# Personalizações do Painel de Controle Medusa Admin

Crie extensões de UI personalizadas para o painel de controle Medusa Admin usando o Admin SDK e os componentes Medusa UI.

**Nota:** "Rotas UI" são páginas de administração personalizadas, diferentes das rotas de API do backend (que usam a skill `building-with-medusa`).

## Quando Aplicar

**Carregue esta skill para QUALQUER tarefa de desenvolvimento de UI de admin, incluindo:**

- Criação de widgets para páginas de produto/pedido/cliente.
- Construção de páginas de administração personalizadas.
- Implementação de formulários e modais.
- Exibição de dados com tabelas ou listas.
- Adição de navegação entre páginas.

**Também carregue estas skills quando:**

- **building-with-medusa:** Construindo rotas de API de backend que a UI admin chama.
- **building-storefronts:** Se estiver trabalhando na storefront em vez do painel de controle admin.

## CRÍTICO: Carregue Arquivos de Referência Quando Necessário

**O guia de referência abaixo NÃO é suficiente para implementação.** Você DEVE carregar arquivos de referência relevantes antes de escrever código para esse componente.

**Carregue estas referências com base no que você está implementando:**

- **Criando widgets?** → DEVE carregar `references/data-loading.md` primeiro
- **Construindo formulários/modais?** → DEVE carregar `references/forms.md` primeiro
- **Exibindo dados em tabelas/listas?** → DEVE carregar `references/display-patterns.md` primeiro
- **Selecionando de grandes conjuntos de dados?** → DEVE carregar `references/table-selection.md` primeiro
- **Adicionando navegação?** → DEVE carregar `references/navigation.md` primeiro
- **Estilizando componentes?** → DEVE carregar `references/typography.md` primeiro

**Requisito mínimo:** Carregar pelo menos 1-2 arquivos de referência relevantes para sua tarefa específica antes de implementar.

## Quando Usar Esta Skill vs MedusaDocs MCP Server

**⚠️ CRÍTICO: Esta skill deve ser consultada PRIMEIRO para planejamento e implementação.**

**Use esta skill para (FONTE PRIMÁRIA):**

- **Planejamento** - Entender como estruturar recursos da UI de admin.
- **Padrões de componentes** - Widgets, páginas, formulários, tabelas, modais.
- **Sistema de design** - Tipografia, cores, espaçamento, classes semânticas.
- **Carregamento de dados** - Padrão de consulta separado e invalidação de cache críticos.
- **Melhores práticas** - Padrões corretos vs incorretos (ex.: consultas de exibição em mount).
- **Regras críticas** - O que NÃO fazer (erros comuns como consultas de exibição condicionais).

**Use o servidor MedusaDocs MCP para (FONTE SECUNDÁRIA):**

- Assinaturas de props de componentes específicos após você saber qual componente usar.
- Lista de zonas de widget disponíveis.
- Detalhes do método JS SDK.
- Referência de opções de configuração.

**Por que as skills vêm primeiro:**

- Skills contêm padrões críticos como consultas de exibição/modal separadas que o MCP não enfatiza.
- Skills mostram padrões corretos vs incorretos; o MCP mostra o que é possível.
- O planejamento requer entender padrões, não apenas a referência da API.

## Casos de Uso Yello Solar Hub

- **Visualização de Cotações B2B (Widgets):** Adicionar um widget na página de Pedidos (Orders) que exiba o status de uma cotação B2B (Ex: "Aguardando Aprovação Comercial") usando dados de um sistema de CRM externo.
- **Seleção de Componentes em Kits (Tabelas/Modals):** Criar uma página personalizada na seção de Produtos ou Kits para que o administrador possa montar e visualizar a compatibilidade de módulos e inversores, carregando grandes datasets de peças.
- **Gestão de Status Operacional (Paginação):** Implementar um Painel de Controle (UI Route) dedicado para o monitoramento do fluxo de instalação solar, exibindo o status operacional (Aprovado, Em Logística, Instalado) e o cliente associado.
- **Flutuação de Dados em Aprovação Financeira (Data Loading):** Utilizar a separação de consultas (Display vs Modal) ao carregar a página de aprovação de um pedido, para que os detalhes do equipamento (Display Query) carreguem instantaneamente, enquanto a revisão financeira (Modal Query) só carrega ao clicar no modal de notas.

## Regras de Configuração Críticas

### Configuração do Cliente SDK

**CRÍTICO:** Sempre use a configuração exata - valores diferentes causam erros:

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

### Apenas usuários pnpm

**CRÍTICO:** Instale dependências *peer* ANTES de escrever qualquer código:

```bash
# Encontre a versão exata no dashboard
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
# Instale aquela versão exata
pnpm add @tanstack/react-query@[versão-exata]

# Se estiver usando navegação (Componente Link)
pnpm list react-router-dom --depth=10 | grep @medusajs/dashboard
pnpm add react-router-dom@[versão-exata]
```

**Usuários npm/yarn:** NÃO instalem esses pacotes - já estão disponíveis.

## Categorias de Regras por Prioridade

| Prioridade | Categoria | Impacto | Prefixo |
|----------|----------|--------|--------|
| 1 | Carregamento de Dados | CRÍTICO | `data-` |
| 2 | Sistema de Design | CRÍTICO | `design-` |
| 3 | Exibição de Dados | ALTO (inclui regra crítica de preço) | `display-` |
| 4 | Tipografia | ALTO | `typo-` |
| 5 | Formulários e Modais | MÉDIO | `form-` |
| 6 | Padrões de Seleção | MÉDIO | `select-` |

## Referência Rápida

### 1. Carregamento de Dados (CRÍTICO)

- `data-sdk-always` - **SEMPRE** use o Medusa JS SDK para TODOS os pedidos de API - NUNCA use `fetch()` regular (falha nos cabeçalhos de autenticação causa erros).
- `data-sdk-method-choice` - Use métodos existentes do SDK para endpoints integrados (`sdk.admin.product.list()`), use `sdk.client.fetch()` para rotas personalizadas.
- `data-display-on-mount` - As consultas de exibição DEVEM carregar no mount (nenhuma condição `enabled` baseada no estado da UI).
- `data-separate-queries` - Separe as consultas de exibição das consultas de modal/formulário.
- `data-invalidate-display` - Invalidar consultas de exibição após mutações, e não apenas as consultas de modal.
- `data-loading-states` - Sempre mostrar estados de carregamento (Spinner), não estados vazios.
- `data-pnpm-install-first` - Usuários pnpm DEVEM instalar @tanstack/react-query ANTES de codificar.

### 2. Sistema de Design (CRÍTICO)

- `design-semantic-colors` - Sempre use classes de cores semânticas (bg-ui-bg-base, text-ui-fg-subtle), nunca hardcoded.
- `design-spacing` - Use `px-6 py-4` para preenchimento de seções, `gap-2` para listas, `gap-3` para itens.
- `design-button-size` - Sempre use `size="small"` para botões em widgets e tabelas.
- `design-medusa-components` - Sempre use os componentes Medusa UI (Container, Button, Text), não HTML bruto.

### 3. Exibição de Dados (ALTO)

- `display-price-format` - **CRÍTICO**: Os preços do Medusa são armazenados como-is ($49.99 = 49.99, NÃO em centavos). Exiba-os diretamente - NUNCA divida por 100.

### 4. Tipografia (ALTO)

- `typo-text-component` - Sempre use o componente Text do @medusajs/ui, nunca tags `span`/`p` simples.
- `typo-labels` - Use `<Text size="small" leading="compact" weight="plus">` para rótulos/títulos.
- `typo-descriptions` - Use `<Text size="small" leading="compact" className="text-ui-fg-subtle">` para descrições.
- `typo-no-heading-widgets` - Nunca use Heading para pequenas seções em widgets (use Text em vez disso).

### 5. Formulários e Modais (MÉDIO)

- `form-focusmodal-create` - Use FocusModal para criar novas entidades.
- `form-drawer-edit` - Use Drawer para editar entidades existentes.
- `form-disable-pending` - Sempre desative ações durante mutações (`disabled={mutation.isPending}`).
- `form-show-loading` - Mostrar estado de carregamento no botão de envio (`isLoading={mutation.isPending}`).

### 6. Padrões de Seleção (MÉDIO)

- `select-small-datasets` - Use o componente Select para 2-10 opções (status, tipos, etc.).
- `select-large-datasets` - Use DataTable com FocusModal para grandes datasets (produtos, categorias, etc.).
- `select-search-config` - Deve passar a configuração de pesquisa para useDataTable para evitar o erro "search not enabled".

## Padrão Crítico de Carregamento de Dados

**SEMPRE siga este padrão - nunca carregue dados de exibição condicionalmente:**

```tsx
// ✅ CORRETO - Consultas separadas com responsabilidades adequadas
const RelatedProductsWidget = ({ data: product }) => {
  const [modalOpen, setModalOpen] = useState(false)

  // Consulta de exibição - carrega no mount
  const { data: displayProducts } = useQuery({
    queryFn: () => fetchSelectedProducts(selectedIds),
    queryKey: ["related-products-display", product.id],
    // Sem condição 'enabled' - carrega imediatamente
  })

  // Consulta de modal - carrega quando necessário
  const { data: modalProducts } = useQuery({
    queryFn: () => sdk.admin.product.list({ limit: 10, offset: 0 }),
    queryKey: ["products-selection"],
    enabled: modalOpen, // OK para dados somente em modal
  })

  // Mutação com invalidação correta
  const updateProduct = useMutation({
    mutationFn: updateFunction,
    onSuccess: () => {
      // Invalida a consulta de dados de exibição para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["related-products-display", product.id] })
      // Também invalida a consulta da entidade
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      // Nota: Não é necessário invalidar a consulta de seleção de modal
    },
  })

  return (
    <Container>
      {/* A exibição usa displayProducts */}
      {displayProducts?.map(p => <div key={p.id}>{p.title}</div>)}

      <FocusModal open={modalOpen} onOpenChange={setModalOpen}>
        {/* O modal usa modalProducts */}
      </FocusModal>
    </Container>
  )
}

// ❌ ERRADO - Consulta única com carregamento condicional
const BrokenWidget = ({ data: product }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const { data } = useQuery({
    queryFn: () => sdk.admin.product.list(),
    enabled: modalOpen, // ❌ A exibição falha ao recarregar a página!
  })

  // Tentando exibir do modal query
  const displayItems = data?.filter(item => ids.includes(item.id)) // Sem dados até o modal abrir

  return <div>{displayItems?.map(...)}</div> // Vazio ao montar!
}
```

**Por que isso importa:**

- Ao recarregar a página, o modal está fechado, então a consulta condicional não executa.
- O usuário vê estado vazio em vez de seus dados.
- A exibição depende da interação do modal (UX quebrada).

## Checklist de Erros Comuns

Antes de implementar, verifique se você NÃO está fazendo isto:

**Carregamento de Dados:**

- [ ] Usando `fetch()` regular em vez do Medusa JS SDK (causa erros de cabeçalho de autenticação ausente).
- [ ] Não usando métodos existentes do SDK para endpoints integrados (ex.: usando `sdk.client.fetch("/admin/products")` em vez de `sdk.admin.product.list()`).
- [ ] Carregando dados de exibição condicionalmente com base no estado do modal/UI.
- [ ] Usando uma única consulta tanto para exibição quanto para modal.
- [ ] Esquecer de invalidar consultas de exibição após mutações.
- [ ] Não tratar estados de carregamento (mostrar vazio em vez de spinner).
- [ ] Usuários pnpm: Não instalar @tanstack/react-query antes de codificar.

**Sistema de Design:**

- [ ] Usando cores hardcoded em vez de classes semânticas.
- [ ] Esquecer `size="small"` em botões em widgets.
- [ ] Não usar `px-6 py-4` para preenchimento de seções.
- [ ] Usando elementos HTML brutos em vez de componentes Medusa UI.

**Exibição de Dados:**

- [ ] **CRÍTICO**: Dividir preços por 100 ao exibir (os preços são armazenados como-is: $49.99 = 49.99, NÃO em centavos).

**Tipografia:**

- [ ] Usando tags `span`/`p` simples em vez do componente Text.
- [ ] Não usar `weight="plus"` para rótulos.
- [ ] Não usar `text-ui-fg-subtle` para descrições.
- [ ] Usando Heading em pequenas seções de widgets.

**Formulários:**

- [ ] Usando Drawer para criar (deve usar FocusModal).
- [ ] Usando FocusModal para editar (deve usar Drawer).
- [ ] Não desativando botões durante mutações.
- [ ] Não mostrar estado de carregamento no envio.

**Seleção:**

- [ ] Usando DataTable para <10 itens (exagero).
- [ ] Usando Select para >10 itens (má UX).
- [ ] Não configurar a pesquisa em useDataTable (causa erro).

## Arquivos de Referência Disponíveis

Carregue estes para padrões detalhados:

```
references/data-loading.md       - padrões useQuery/useMutation, invalidação de cache
references/forms.md              - padrões FocusModal/Drawer, validação
references/table-selection.md    - padrão completo de seleção de DataTable
references/display-patterns.md   - listas, tabelas, cartões para entidades
references/typography.md         - padrões do componente Text
references/navigation.md         - padrões Link, useNavigate, useParams
```

Cada referência contém:

- Guias de implementação passo a passo.
- Exemplos de código correto vs incorreto.
- Erros comuns e soluções.
- Exemplos completos funcionais.

## Integração com Backend

**⚠️ CRÍTICO: SEMPRE use o Medusa JS SDK para TODOS os pedidos de API - NUNCA use `fetch()` regular.**

A UI Admin se conecta às rotas de API de backend usando o SDK:

```tsx
import { sdk } from "[LOCALIZAR INSTÂNCIA SDK NO PROJETO]"

// ✅ CORRETO - Endpoint integrado: Use método SDK existente
const { data: product } = useQuery({
  queryKey: ["product", productId],
  queryFn: () => sdk.admin.product.retrieve(productId),
})

// ✅ CORRETO - Endpoint customizado: Use sdk.client.fetch()
const { data: reviews } = useQuery({
  queryKey: ["reviews", product.id],
  queryFn: () => sdk.client.fetch(`/admin/products/${product.id}/reviews`),
})

// ❌ ERRADO - Usando fetch regular
const { data } = useQuery({
  queryKey: ["reviews", product.id],
  queryFn: () => fetch(`http://localhost:9000/admin/products/${product.id}/reviews`),
  // ❌ Erro: Cabeçalho de Autorização ausente!
})

// Mutação para rota de backend customizada
const createReview = useMutation({
  mutationFn: (data) => sdk.client.fetch("/admin/reviews", {
    method: "POST",
    body: data
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", product.id] })
    toast.success("Review criado")
  },
})
```

**Por que o SDK é obrigatório:**

- As rotas Admin precisam de cabeçalhos `Authorization` e cookie de sessão.
- As rotas Store precisam do cabeçalho `x-publishable-api-key`.
- O SDK trata todos os cabeçalhos necessários automaticamente.
- `fetch()` regular sem cabeçalhos → erros de autenticação/autorização.
- Usar métodos existentes do SDK fornece melhor segurança de tipos.

**Quando usar o quê:**

- **Endpoints integrados**: Use métodos SDK existentes (`sdk.admin.product.list()`, `sdk.store.product.list()`).
- **Endpoints customizados**: Use `sdk.client.fetch()` para suas rotas de API personalizadas.

**Para implementar rotas de API de backend**, carregue a skill `building-with-medusa`.

## Widget vs Rota UI

**Widgets** estendem páginas admin existentes:

```tsx
// src/admin/widgets/custom-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"

const MyWidget = ({ data }: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  return <Container>Conteúdo do widget</Container>
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default MyWidget
```

**Rotas UI** criam novas páginas admin:

```tsx
// src/admin/routes/custom-page/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"

const CustomPage = () => {
  return <div >Conteúdo da página</div>
}

export const config = defineRouteConfig({
  label: "Página Personalizada",
})

export default CustomPage
```

## Problemas e Soluções Comuns

**Erros "Cannot find module" (usuários pnpm):**

- Instalar dependências *peer* ANTES de codificar.
- Usar versões exatas do dashboard.

**Erro "No QueryClient set":**

- pnpm: Instalar @tanstack/react-query.
- npm/yarn: Remover o pacote instalado incorretamente.

**"DataTable.Search not enabled":**

- Deve passar a configuração de pesquisa para useDataTable.

**Widget sem atualizar:**

- Invalidação de consultas de exibição, não apenas de consultas de modal.
- Incluir todas as dependências nas chaves da consulta.

**Exibição vazia no refresh:**

- A consulta de exibição tem `enabled` condicional baseado no estado da UI.
- Remover condição - os dados de exibição devem carregar no mount.

## Próximos Passos - Testando Sua Implementação

**Após implementar um recurso com sucesso, sempre forneça estes próximos passos ao usuário:**

### 1. Iniciar o Servidor de Desenvolvimento

Se o servidor ainda não estiver rodando, inicie-o:

```bash
npm run dev      # ou pnpm dev / yarn dev
```

### 2. Acessar o Painel de Controle Admin

Abra seu navegador e navegue para:

- **Dashboard Admin:** <http://localhost:9000/app>

Faça login com suas credenciais de administrador.

### 3. Navegar até sua UI Personalizada

**Para Widgets:**
Navegue até a página onde seu widget é exibido. Zonas de widget comuns:

- **Produtos:** Vá para Produtos → Selecionar um produto → Seu widget aparece na zona configurada (ex.: `product.details.after`).
- **Pedidos:** Vá para Pedidos → Selecionar um pedido → Seu widget aparece na zona configurada.
- **Clientes:** Vá para Clientes → Selecionar um cliente → Seu widget aparece na zona configurada.

**Para Rotas UI (Páginas Personalizadas):**

- Procure sua página personalizada na barra lateral/navegação admin (baseado no `label` que você configurou).
- Ou navegue diretamente para: `http://localhost:9000/app/[seu-caminho-de-rota]`

### 4. Testar Funcionalidade

Dependendo do que foi implementado, teste:

- **Formulários:** Tente criar/editar entidades, verifique validação e mensagens de erro.
- **Tabelas:** Teste paginação, pesquisa, ordenação e seleção de linhas.
- **Exibição de dados:** Verifique se os dados carregam corretamente e se atualizam após mutações.
- **Modais:** Abrir FocusModal/Drawer, testar envio de formulário, verificar atualização de dados.
- **Navegação:** Clique nos links e verifique se o roteamento funciona corretamente.

### Formato para Apresentação dos Próximos Passos

Sempre apresente os próximos passos em um formato claro e acionável após a implementação:

```markdown
## Implementação Concluída

O [nome do recurso] foi implementado com sucesso. Veja como acessá-lo:

### Iniciar o Servidor de Desenvolvimento
[comando baseado no gerenciador de pacotes]

### Acessar o Painel de Controle Admin
Abra http://localhost:9000/app em seu navegador e faça login.

### Ver Sua UI Personalizada

**Para Widgets:**
1. Navegue até [página admin específica, ex.: "Produtos"]
2. Selecione [uma entidade, ex.: "qualquer produto"]
3. Role até [localização da zona, ex.: "o final da página"]
4. Você verá o widget "[nome do widget]"

**Para Rotas UI:**
1. Procure por "[rótulo da página]" na navegação admin
2. Ou navegue diretamente para http://localhost:9000/app/[caminho-da-rota]

### O Que Testar
1. [Caso de teste específico 1]
2. [Caso de teste específico 2]
3. [Caso de teste específico 3]
```stop
