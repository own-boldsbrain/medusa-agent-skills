# Componente de Pesquisa

## Contents

- [Visão geral](#visão-geral)
- [Search Placement](#search-placement)
- [Autocompletar e Sugestões de Produtos](#autocompletar-e-sugestoes-de-produtos)
- [Search Results Page](#search-results-page)
- [Estados Vazios](#estados-vazios)
- [Pesquisas Recentes e Populares](#pesquisas-recentes-e-populares)
- [Pesquisa Mobile](#mobile-search)

## Visão geral

Search is critical for ecommerce - users with search intent convert at higher rates. Provide fast, relevant product discovery with autocomplete.

**Assumed knowledge**: AI agents know how to build search inputs with icons and clear buttons. This guide focuses on ecommerce search patterns.

### Requisitos Principais

- Entrada de pesquisa proeminente (sempre acessível)
- Autocompletar instantâneo após 2-3 caracteres
- Sugestões de produtos com imagens
- Resultados de busca rápidos e relevantes
- Filtros para refinar resultados
- Empty state guidance
- Tela de busca em modo tela cheia no dispositivo móvel

## Posicionamento de Busca

**Desktop**: Barra de navegação central (entre o logo e o carrinho) ou lado direito. Sempre visível, largura de 300-500px. Parte da barra de navegação fixa. Nunca ocultar no menu hambúrguer.

**Mobile**: Ícone de lupa no canto superior direito (44x44px no mínimo). Abre um modal em tela cheia - elimina distrações, maximiza o espaço para sugestões, melhora a experiência de digitação.

## Autocomplete e Sugestões de Produtos

**Mostrar sugestões** após 2-3 caracteres (não 1). Debounce de 300ms para evitar chamadas excessivas à API.

**Display 5-10 product suggestions:**

- Imagem pequena (40-60px), título, preço
- Clicável para a página do produto
- Opcional: Sugestões de categoria/marca, termos populares
- Divida as seções com cabeçalhos
- "Ver todos os resultados para [query]" link de rodapé

**Backend integration**: Fetch from search API. Check with ecommerce platform's documentation for API reference.

## Página de Resultados de Pesquisa

**Cabeçalho**: "Resultados da Pesquisa para '[query]'" + contagem de resultados ("24 produtos encontrados"). Barra de pesquisa visível e preenchida para refinamento.

**Grid layout**: Same as product listings (see product-listing.md). 1-4 columns based on device.

**Sorting**: Relevance (default, unique to search), Price Low/High, Newest.

**Filters**: Sidebar (desktop) or drawer (mobile). Category, Price, Brand, Availability with result counts.

## Estados Vazios

**Sem resultados**: "Nenhum resultado para '[consulta]'" com sugestões úteis (verifique a ortografia, tente palavras-chave mais amplas, navegue pelas categorias). Botão "Ver Todos os Produtos" + links para categorias populares.

**Estado de carregamento**: Esqueletos do cartão do produto (6-8 cartões), exibição mínima de 300ms para evitar piscar.

## Pesquisas Recentes e Populares

**Recent searches** (user-specific, localStorage): Show 3-5 recent searches when input focused (before typing). Helps re-search without retyping.

**Pesquisas populares** (em todo o site, a partir do backend): Mostrar de 5-10 termos em alta ao focar. Estilo de pill/tag.

Display both on: Empty input focus (desktop dropdown), mobile modal open.

## Busca Mobile

**Full-screen modal pattern:**

- Header: Back button (44x44px) + search input (48px height, auto-focus, `type="search"`)
- Content: Recent/popular searches (empty), autocomplete (typing), scrollable
- Fechar: Botão Voltar, gesto de voltar do dispositivo, tecla Escape

## Lista de Verificação de Pesquisa para Ecommerce

**Recursos essenciais:**

- [ ] Entrada de pesquisa proeminente na barra de navegação (desktop)
- [ ] Search icon clearly visible (mobile)
- [ ] Modal de tela cheia ao tocar no celular
- [ ] Autocomplete after 2-3 characters
- [ ] Debounced API calls (300ms)
- [ ] Sugestões de produtos com imagens, preços
- [ ] "View all results" link in dropdown
- [ ] Search results page shows query
- [ ] Contagem de resultados exibida
- [ ] Sort by Relevance (default for search)
- [ ] Filtros para refinar resultados (categoria, preço, marca)
- [ ] Estado vazio com orientação útil
- [ ] Indicador de estado de carregamento (esqueleto)
- [ ] Pesquisas recentes (localStorage)
- [ ] Pesquisas populares (do backend)
- [ ] Mobile: Auto-foco, grande entrada (48px)
- [ ] Navegação por teclado (setas, Enter, Escape)
- [ ] Rótulos ARIA (`role="search"`, `aria-label`)
- [ ] Acessível a leitores de tela
