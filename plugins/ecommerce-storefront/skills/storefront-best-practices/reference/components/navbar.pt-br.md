# Componente Navbar

## Conteúdos

- [Visão geral](#visão-geral)
- [Decisão: Dropdown Simples vs Megamenu](#decisão-simple-dropdown-vs-megamenu)
- [Principais Padrões de E-commerce](#principais-padroes-de-e-commerce)
- [Estrutura de Layout](#layout-structure)
- [Essenciais de Acessibilidade](#essenciais-de-acessibilidade)
- [Erros Comuns em E-commerce](#erros-comuns-em-e-commerce)
- [Integração com o Backend](#integração-com-o-backend)
- [Lista de Verificação](#checklist)

## Visão geral

Navegação principal para lojas virtuais. Desktop: menu horizontal com links de categorias. Mobile: gaveta do hambúrguer com subcategorias em acordeão.

### ⚠️ CRÍTICO: NUNCA Hardcode Categorias

**ALWAYS fetch categories dynamically from the backend. NEVER hardcode static category arrays.**

❌ **WRONG - DO NOT DO THIS:**

```typescript
// WRONG - Static hardcoded categories
const categories = [
  { name: "Women", href: "/categories/women" },
  { name: "Men", href: "/categories/men" },
  { name: "Accessories", href: "/categories/accessories" }
]
```

✅ **CORRECT - Fetch from backend:**

```typescript
// CORRECT - Fetch categories dynamically
const [categories, setCategories] = useState([])

useEffect(() => {
  fetch(`${apiUrl}/store/product-categories`)
    .then(res => res.json())
    .then(data => setCategories(data.product_categories))
}, [])
```

**Why this matters:**

- As categorias mudam frequentemente (novas categorias, renomeadas, reordenadas)
- Categorias codificadas tornam-se desatualizadas imediatamente
- Requires code changes every time categories change
- Não é possível escalar para lojas com catálogos dinâmicos
- Defeats the purpose of headless commerce

### Requisitos Principais

- Desktop: Horizontal category links, cart/account/search right-aligned
- Mobile: Hamburger drawer, cart stays visible in header (not hidden in drawer)
- **CRÍTICO: Buscar categorias do back-end dinamicamente (NUNCA codificar matrizes estáticas)**
- Fixo: Recomendado para fácil acesso ao carrinho enquanto navega
- Real-time updates: Cart count, login state, category changes

## Decisão: Dropdown Simples vs Megamenu

**Use Dropdown Simples quando:**

- <10 top-level categories
- Hierarquia plana ou rasa (1-2 níveis de profundidade)
- Minimal subcategories per parent
- Catálogo de produtos focado/especializado

**Use Megamenu when:**

- 10+ top-level categories
- Hierarquia profunda (3+ níveis)
- Precisa exibir produtos em destaque na navegação
- Catálogo de produtos complexo
- Moda, eletrônicos ou grande estoque

**Mobile**: Always use drawer with accordion pattern, never megamenu on mobile.

See [megamenu.md](megamenu.md) for megamenu implementation details.

## Principais Padrões de Ecommerce

### Indicador de Carrinho (CRÍTICO)

**Sempre visível tanto no desktop quanto no celular:**

- Área de trabalho: Canto superior direito, ícone do carrinho + badge de contagem
- Mobile: No canto superior direito do cabeçalho (NÃO escondido no menu hambúrguer)
- This is non-negotiable - users expect cart always accessible

**Badge display:**

- Mostra o número de itens (NÃO preço - confuso quando as variantes mudam)
- Only visible when cart has items (count > 0)
- Mostrar a contagem real até 99, depois "99+"
- Position: Top-right corner of cart icon
- Etiqueta ARIA: `aria-label="Carrinho de compras com 3 itens"`

**Atualizações em tempo real:**

- Atualize a contagem imediatamente ao adicionar itens (UI otimista)
- Nenhuma atualização de página necessária
- Sincronizar com o estado do carrinho no backend
- Handle errors gracefully (restore count if add fails)

**Comportamento do clique:**

- Opção 1: Navegue para a página de carrinho
- Opção 2: Abrir popup/gaveta do carrinho (ver cart-popup.md)
- A escolha depende do tipo de loja (consulte cart-popup.md para os critérios de decisão)

✅ **CORRETO:**

- Ícone do carrinho visível no cabeçalho móvel
- Badrão mostra contagem (não preço)
- Atualizações em tempo real sem recarregar a página
- Alvo de toque 44x44px
- Links para o carrinho ou abre popup do carrinho

❌ **ERRADO:**

- Escondendo o carrinho na gaveta do menu hambúrguer (os usuários não conseguem encontrá-lo)
- Mostrando preço em badge (€25,99) em vez de quantidade.
- Contagem do carrinho não atualiza até a atualização da página
- Sem feedback visual quando itens são adicionados

### Navegação por Categoria

**CRÍTICO: Buscar dinamicamente do backend (NUNCA codificar manualmente):**

❌ **ERRADO - Estas são todas abordagens incorretas:**

```typescript
// WRONG - Hardcoded array
const categories = ["Women", "Men", "Kids", "Accessories"]

// WRONG - Static object array
const categories = [
  { id: 1, name: "Women", slug: "women" },
  { id: 2, name: "Men", slug: "men" }
]

// WRONG - Importing static data
import { categories } from "./categories.ts"
```

✅ **CORRETO - Fetch de API de backend:**

- Medusa: Use o método da lista de categorias do SDK (verifique o método exato com docs/MCP)
- Outros back-ends: Chamada do endpoint de categorias (ver documentação da API)
- Obter no mount do componente ou durante a renderização do lado do servidor

**Por que é necessário o carregamento dinâmico:**

- Proprietários de lojas adicionam/removem/renominam categorias frequentemente
- Alterações na ordem e hierarquia de categorias
- Lojas multilíngues precisam de nomes de categorias traduzidos
- Categorias em destaque rotativas (sazonais, promoções)
- Valores hardcoded exigem intervenção do desenvolvedor para mudanças simples

**Estratégia de cache:**

- Categorias de cache (revalidar em intervalo ou gatilho manual)
- Use SWR, TanStack Query, ou cacheamento de nível do framework
- Revalidar a cada 5-10 minutos ou ao navegar pela página
- Atualize imediatamente quando as categorias do backend mudarem

**Organização:**

- 4-7 categorias de nível superior ideais (máximo 10 no desktop)
- A ordem vem do backend (respeita a ordenação do administrador)
- Mantenha "Venda" ou "Novas chegadas" em destaque se o backend fornecer
- Máximo 2 níveis em dropdown simples (categoria → subcategoria)
- Hierarquias mais profundas: Use megamenu ou páginas de categorias separadas

**Comportamento do Desktop:**

- Links horizontais com menus suspensos ao passar o mouse para subcategorias
- Pequeno atraso ao passar o cursor para evitar acionamentos acidentais
- Clique no pai para navegar para a página de categoria
- Clique em criança para navegar para a subcategoria

**Comportamento móvel:**

- Todas as categorias na gaveta de hambúrguer
- Padrão de acordeão para subcategorias (expandir/colapsar)
- Feche a gaveta ao clicar na categoria (exceto no acordeão expansível)
- Deslizante de rolagem se as categorias excederem a altura da viewport

✅ **CORRETO:**

- Categorias recuperadas da API backend no mount
- Cache com estratégia de revalidação
- Respeita a ordem e hierarquia do backend
- 4-7 itens de nível superior no desktop (com base no que o backend retorna)
- Cabeçalho móvel para subcategorias
- Ordenação consistente entre dispositivos

❌ **ERRADO:**

- Categorias de array fixas no componente (NUNCA FAÇA ISSO)
- Categorias estáticas importadas de arquivo (NUNCA FAÇA ISSO)
- No cache invalidation (stale categories)
- Muitos itens de nível superior (>10, deslumbrante)
- Ordem de categoria diferente no desktop vs móvel
- Categorias não atualizam quando as alterações são feitas no backend

### Problema

Categories don't update when backend changes

### Causas

* Alterações feitas no backend não estão sendo refletidas nas categorias
* Falta de sincronização entre o backend e as categorias

### Exemplo

```python
# Código do backend que não está atualizando as categorias
def alterar_categoria(id_categoria, novo_nome):
    # Código que atualiza a categoria no backend
    pass

# Código que não está atualizando as categorias
def atualizar_categorias():
    # Código que deve chamar a função alterar_categoria
    pass
```

### Solução

1. Verifique se o backend está atualizando as categorias corretamente
2. Verifique se há alguma configuração ou problema de sincronização entre o backend e as categorias
3. Implemente um mecanismo de sincronização entre o backend e as categorias

### Recursos

* [Documentação do backend](https://example.com/backend-documentation)
* [Ferramenta de sincronização](https://example.com/sync-tool)

### User Account Indicator

**Dois estados baseados na autenticação:**

**Sessão encerrada:**

- Área de trabalho: texto "Entrar" ou "Fazer Login" + ícone de usuário
- Mobile: User icon only
- Clique navega para a página de login
- Clear call-to-action

**Conectado:**

- Desktop: User name, initials, or email + dropdown
- Mobile: User name/initials or icon → account page
- Menu suspenso (desktop): Minha Conta, Pedidos, Lista de Desejos, Sair
- Buscar usuário atual do estado de autenticação do backend

**Gerenciamento do estado de autenticação:**

- Verifique o estado de autenticação no backend (não apenas no localStorage)
- Atualize imediatamente em eventos de login/logout
- Lidar com a expiração da sessão de forma graciosa
- Sincronize entre abas se possível

✅ **CORRETO:**

- Exibe "Entrar" quando estiver desconectado
- Shows user identifier when logged in
- Dropdown com ações da conta
- Verifica o estado de autenticação do backend (não apenas o estado do cliente)

❌ **ERRADO:**

- Não há indicação de estado de login
- Depende apenas do localStorage (pode estar desatualizado)
- Nenhum menu suspenso para ações da conta ao fazer login
- Opção de logout ausente

### Navegação Móvel (Mobile Navigation Pattern)

**Gaveta de hambúrgueres:**

- Acionador: Ícone de hambúrguer (canto superior esquerdo)
- Gaveta: Slides da esquerda, 80-85% de largura, altura total, rolagem possível.
- Plano de fundo: sobreposição semi-transparente, clique para fechar.
- Conteúdo: Todas as categorias com subcategorias em acordeão

**CRÍTICO: Mantenha o carrinho no cabeçalho:**

- Ícone do carrinho permanece no cabeçalho mobile (topo-direita)
- Não esconda o carrinho dentro da gaveta
- Os usuários esperam que o carrinho esteja sempre acessível
- Mesmo para o ícone de pesquisa se estiver usando apenas o ícone de pesquisa

**Conta em gaveta:**

- Desconectado: link "**Entrar**" no cabeçalho da gaveta ou no topo do menu
- Entrou: Nome de usuário/iniciais no cabeçalho da gaveta com link para a conta

**Comportamento de fechamento:**

- Botão de fechar (X) no cabeçalho do painel
- Clique no fundo sobreposto
- Navegue até a categoria (a gaveta fecha)
- Tecla de escape

✅ **CORRETO:**

- Carrinho fica no cabeçalho móvel (visível)
- Hambúrguer abre gaveta da esquerda
- Sobreposição de fundo escurece o plano de fundo
- Feche na navegação ou clique no fundo.
- Scrollable drawer para menus longos

❌ **ERRADO:**

- Carrinho escondido dentro do menu hambúrguer (pecado capital)
- Full-screen drawer (no backdrop)
- A gaveta não fecha na navegação
- Não rolável (categorias cortadas)

### Navegação Inferior (Alternativa para Mobile)

**Quando usar:**

- Loja tem 3-5 seções principais (Início, Navegar, Carrinho, Conta, Busca)
- Experiência similar a de um aplicativo desejada
- Seção de alternância frequente
- Não adequado para hierarquias de categorias complexas

**Padrão:**

- Barra fixa na parte inferior da tela (somente para mobile)
- Ícone + rótulo para cada seção
- Seção ativa em destaque
- 5 itens no máximo
- Navegação direta, sem menus suspensos

## Estrutura de Layout

**Desktop:**

- Esquerda: Logo → Página Inicial
- Centro: Links de Categorias (horizontal)
- Certo: Pesquisar, Conta, Carrinho

**Celular:**

- Esquerda: Hambúrguer
- Centro: Logo
- Certo: Carrinho (+ ícone de Pesquisa opcional)

**Recomendado fixo:**

- Mantém o carrinho/conta acessível enquanto rola a página
- Use `position: sticky` ou `position: fixed`
- Cor de fundo sólida (ocultar conteúdo de rolagem)
- Adequate z-index to stay above content

## Acessibilidade Essenciais

**Ecommerce específico ARIA:**

- Contagem do carrinho: `aria-live="polite"` para anunciar alterações (ex., "3 itens no carrinho")
- Gaveta móvel: `role="dialog"`, `aria-modal="true"`
- Botão de hambúrguer: `aria-label="Abrir menu de navegação"`, `aria-expanded="false"`
- Página ativa: `aria-current="page"` no link da categoria atual
- Indicadores de dropdown: `aria-expanded`, `aria-controls` para relações de megamenu

**Navegação pelo teclado:**

- Tabule todas as **links/botões**
- Enter/Espaço para ativar
- Escape para fechar o menu móvel ou dropdowns
- Visible focus indicators (outline/ring)

**Generic accessibility applies:**

- Semântico HTML (`<header>`, `<nav>`)
- Ícones de botões precisam de rótulos ARIA
- 4,5:1 contraste mínimo de cores
- 44x44px alvos de toque em dispositivos móveis

## Common Ecommerce Mistakes

❌ **CRÍTICO: Categorias estáticas hardcoded** - NUNCA crie arrays de categorias estáticos como `const categorias = ["Women", "Men"]` ou importe de arquivos estáticos. SEMPRE busque da API backend. Categorias mudam constantemente - novas categorias são adicionadas, nomes alterados, ordem atualizada. Categorias hardcoded exigem intervenção do desenvolvedor para mudanças simples e anulam o propósito de plataformas de comércio dinâmicas. Esse é o #1 erro mais comum.

❌ **Hiding cart in mobile drawer** - Users expect cart always visible. Keep cart icon in header (top-right), not hidden inside hamburger menu.

❌ **No real-time cart updates** - Update count immediately when items added (optimistic UI). Don't require page refresh.

❌ **Exibindo preço no emblema do carrinho** - Exibir quantidade de itens (número), não o preço total. A exibição de preço causa confusão quando variantes têm quantidades diferentes.

❌ **No cache invalidation** - Categories become stale when backend changes. Revalidate periodically (5-10 min) or on manual trigger.

❌ **Hover-only dropdowns on mobile** - Use click/tap interactions. Hover doesn't work on touch devices.

❌ **Navegação de desktop no celular** - Use o padrão de menu hambúrguer, não o menu horizontal que não se encaixa.

❌ **Ordem de categorias inconsistente** - Mesma ordem no desktop e no mobile para consistência. Respeite a ordem de categorias do backend.

## Integração de Backend

### Categoria de Recuperação (CRÍTICO - NUNCA Codificar Diretamente)

**Padrões de implementação:**

**Client-side fetching:**

- Buscar categorias no useEffect ao montar
- Store in state (use appropriate types for Medusa: StoreProductCategory)
- Handle loading and error states
- Mapear categorias para links de navegação
- Use category.id as key, category.handle for URL, category.name for display

**Com cache (RECOMENDADO):**

- Use o TanStack Query com queryKey ['categories']
- Set staleTime: 5-10 minutes (categories rarely change)
- Automatic loading/error states
- Request deduplication if multiple components need categories

**Server-side fetching:**

- Buscar no componente do servidor ou na função de carregamento
- Sem estado de carregamento necessário (renderizado no servidor)
- Melhor para SEO

**Padrão de sincronização do estado do carrinho:**

- Inscrever-se no estado global do carrinho (Contexto)
- Atualizar a contagem do carrinho na barra de navegação quando o carrinho mudar
- Handle optimistic updates (show new count immediately on add to cart)
- Sync with backend on events or interval

**Authentication state pattern:**

- Verifique o estado de autenticação do backend na montagem
- Ouça por eventos de login/logout
- Update account indicator immediately
- Handle session expiration gracefully

**Gatilhos de atualização de categoria:**

- Ao carregar/navegar na página
- No acionador de atualização manual
- No intervalo de revalidação (5-10 minutos)
- After admin updates categories (webhook or polling)

## Lista de Verificação

**Recursos essenciais da barra de navegação:**

- [ ] **CRÍTICO: Categorias buscadas dinamicamente da API do backend (NÃO arrays fixos)**
- [ ] **CRITICAL: No static category imports or hardcoded category lists**
- [ ] Desktop: Ligações de categorias horizontais
- [ ] Mobile: Hamburger drawer with accordion
- [ ] Ícone do carrinho visível no cabeçalho de desktop e mobile (NÃO escondido na gaveta)
- [ ] O emblema do carrinho mostra a contagem de itens (não o preço)
- [ ] Atualizações da contagem de carrinhos em tempo real
- [ ] Categorias usam ordenação do backend (não ordenação manual)
- [ ] Indicador de conta mostra o estado de login
- [ ] Logo links para a página inicial
- [ ] 4-7 categorias de nível superior exibidas (máx. 10)
- [ ] Gaveta móvel fecha na navegação
- [ ] Navegação fixa (recomendado)
- [ ] Alvos de toque mínimos de 44x44px
- [ ] Rótulos ARIA nos botões de ícone
- [ ] `aria-live` no contador do carrinho para leitores de tela
- [ ] Acessível com teclado e estados de foco visíveis
- [ ] Categorias armazenadas em cache com estratégia de revalidação (5-10 min)
- [ ] Manipulação de erros para coleta de categoria falhada