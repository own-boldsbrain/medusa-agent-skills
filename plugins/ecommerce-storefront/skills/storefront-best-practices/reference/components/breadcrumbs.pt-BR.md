# Component de Navegação por Rastreamento

## Conteúdo

- [Componente de Navegação por Rastreamento](#componente-de-navegacao-por-rastreamento)
  - [Conteúdo](#conteudo)
  - [Visão Geral](#visao-geral)
    - [Requisitos Essenciais](#requisitos-essenciais)
  - [Quando Usar Navegação por Rastreamento](#quando-usar-navegacao-por-rastreamento)
  - [Padrões de Navegação por Rastreamento para E-commerce](#padroes-de-navegacao-por-rastreamento-para-e-commerce)
    - [Breadcrumbs em Páginas de Produtos](#breadcrumbs-em-paginas-de-produtos)
    - [Breadcrumbs em Páginas de Categoria](#breadcrumbs-em-paginas-de-categoria)
    - [Construção da Rota](#construcao-da-rota)
  - [Navegação por Rastreamento para Dispositivos Móveis](#navegacao-por-rastreamento-para-dispositivos-mobiles)
    - [Padrão para Dispositivos Móveis: Link "Voltar"](#padrao-para-dispositivos-mobiles-link-voltar)
  - [Dados Estruturados para SEO](#dados-estruturados-para-seo)
  - [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

A navegação por rastreamento mostra ao usuário sua localização dentro da hierarquia do site (Home �?' Categoria �?' Subcategoria �?' Produto). Essencial para a navegação e SEO em e-commerce.

**Conhecimento assumido:** Agentes de IA sabem como criar rastreadores com separadores e links. Este guia se concentra em padrões específicos para e-commerce.

### Requisitos Essenciais

- Mostrar a rota completa da página inicial à página atual
- Cada nível deve ser clicável (exceto a página atual)
- Posicionado abaixo da barra de navegação, acima do título da página
- Incluir dados estruturados para SEO (JSON-LD)
- Otimizado para dispositivos móveis (padrão de link "Voltar")

## Quando Usar Navegação por Rastreamento

**Use para:**

- Páginas de produtos (Home �?' Categoria �?' Subcategoria �?' Produto)
- Páginas de categoria (Home �?' Categoria �?' Subcategoria)
- Hierarquias complexas do site (3+ níveis)
- Catálogos grandes com muitas categorias

**Não use para:**

- Página inicial (sem páginas parentes)
- Estruturas de sites planas (1-2 níveis)
- Fluxo de checkout (linear, não hierárquico)
- Resultados de pesquisa (não hierárquico)

## Padrões de Navegação por Rastreamento para E-commerce

### Breadcrumbs em Páginas de Produtos

**Padrão padrão:**

- Home / Categoria / Subcategoria / Nome do Produto
- Exemplo: Home / Eletrônicos / Laptops / Laptop Gamer Pro

**Considerações importantes:**

- Todos os níveis, exceto o nome do produto, são clicáveis
- O nome do produto é a página atual (não clicável, texto em cor escura)
- Mostra a localização do produto no catálogo

**Múltiplas categorias de pertencimento:**

- Se o produto pertence a várias categorias, escolha a categoria primária/canônica
- Correspondência da categoria na URL ou caminho de navegação
- Seja consistente em todo o site

### Breadcrumbs em Páginas de Categoria

**Padrão padrão:**

- Home / Categoria Pai / Categoria Atual
- Exemplo: Home / Eletrônicos / Laptops

**Categoria atual:**

- Não clicável (texto simples)
- Visualmente distinta dos links (cor ou negrito mais escuro)

### Construção da Rota

**Hierarquia:**

- Comece com "Home" (ou ícone de casa)
- Siga a hierarquia da categoria
- Termine com a página atual
- Máximo 5-6 níveis (mantenha-o curto)

**Alinhamento da URL:**

- A rota do rastreador deve corresponder à hierarquia da URL
- Nomes consistentes entre URLs e rastreadores
- Exemplo: `/categorias/eletronicos/laptops` �?' "Home / Eletrônicos / Laptops"

## Navegação por Rastreamento para Dispositivos Móveis

### Padrão para Dispositivos Móveis: Link "Voltar"

**Abordagem recomendada:**

- Mostrar apenas o nível anterior como link
- Ícone de seta "voltar" (�?�) + nome da página pai
- Exemplo: "�?� Laptops Gamer"

**Por que:**

- Economiza espaço vertical em dispositivos móveis
- Fornece uma indicação clara (navegação para trás)
- Mais simples do que a trilha completa
- Os usuários de dispositivos móveis têm o botão de voltar no dispositivo

**Alternativa: Rota truncada**

- Mostrar "Home ... Página Atual"
- Ocultar os níveis intermediários
- Equilíbrio entre espaço e contexto

## Dados Estruturados para SEO

**Schema BreadcrumbList (CRÍTICO):** Adicione dados estruturados JSON-LD. A navegação por rastreamento aparece nos resultados de pesquisa, melhora a CTR, ajuda os mecanismos de busca a entender a estrutura do site.

**Implementação:** schema.org BreadcrumbList com array "items". Cada item tem posição (1, 2, 3...), nome e URL. Veja seo.md para detalhes sobre o schema.

