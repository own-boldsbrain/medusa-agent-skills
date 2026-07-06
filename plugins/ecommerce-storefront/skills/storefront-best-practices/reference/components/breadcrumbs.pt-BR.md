# Componente de Breadcrumbs (Trilha de Navegação)

## Conteúdo

- [Componente de Breadcrumbs](#componente-de-breadcrumbs-trilha-de-navegação)
  - [Conteúdo](#conteúdo)
  - [Visão Geral](#visão-geral)
    - [Requisitos Essenciais](#requisitos-essenciais)
  - [Quando Usar Breadcrumbs](#quando-usar-breadcrumbs)
  - [Padrões de Breadcrumbs para E-commerce](#padrões-de-breadcrumbs-para-e-commerce)
    - [Breadcrumbs em Páginas de Produtos](#breadcrumbs-em-páginas-de-produtos)
    - [Breadcrumbs em Páginas de Categoria](#breadcrumbs-em-páginas-de-categoria)
    - [Construção do Caminho](#construção-do-caminho)
  - [Breadcrumbs em Dispositivos Móveis](#breadcrumbs-em-dispositivos-móveis)
    - [Padrão Mobile: Reduzir para Link "Voltar"](#padrão-mobile-reduzir-para-link-voltar)
  - [Dados Estruturados para SEO](#dados-estruturados-para-seo)
  - [Lista de Verificação](#lista-de-verificação)

## Visão Geral

Os breadcrumbs mostram a localização do usuário dentro da hierarquia do site (Home → Categoria → Subcategoria → Produto). Eles são fundamentais para a navegação em e-commerces e para SEO.

**Conhecimento prévio assumido**: Agentes de IA sabem como criar breadcrumbs com separadores e links. Este guia se concentra em padrões específicos para e-commerce.

### Requisitos Essenciais

- Mostrar o caminho completo da página inicial até a página atual
- Cada nível deve ser clicável (exceto a página atual)
- Posicionado abaixo da barra de navegação, acima do título da página
- Incluir dados estruturados para SEO (JSON-LD)
- Otimizado para dispositivos móveis (padrão de link "Voltar")

## Quando Usar Breadcrumbs

**Use para:**

- Páginas de produtos (Home → Categoria → Subcategoria → Produto)
- Páginas de categoria (Home → Categoria → Subcategoria)
- Hierarquias profundas de site (3+ níveis)
- Catálogos grandes com muitas categorias

**Não use para:**

- Página inicial (não possui páginas pai)
- Estruturas de site planas (1-2 níveis)
- Fluxo de checkout (linear, não hierárquico)
- Resultados de pesquisa (não hierárquicos)

## Padrões de Breadcrumbs para E-commerce

### Breadcrumbs em Páginas de Produtos

**Padrão padrão:**

- Home / Categoria / Subcategoria / Nome do Produto
- Exemplo: Home / Eletrônicos / Laptops / Laptop Gamer Pro

**Considerações principais:**

- Todos os níveis, exceto o nome do produto, são clicáveis
- O nome do produto é a página atual (não clicável, texto em cor mais escura)
- Mostra a localização do produto no catálogo

**Múltiplas categorias:**

- Se o produto pertencer a várias categorias, escolha a primária/canônica
- Combine a categoria na URL com o caminho de navegação
- Seja consistente em todo o site

### Breadcrumbs em Páginas de Categoria

**Padrão padrão:**

- Home / Categoria Pai / Categoria Atual
- Exemplo: Home / Eletrônicos / Laptops

**Categoria atual:**

- Não clicável (texto simples)
- Visualmente distinta dos links (cor mais escura ou negrito)

### Construção do Caminho

**Hierarquia:**

- Comece com "Home" (ou ícone de início/casa)
- Siga a hierarquia das categorias
- Termine com a página atual
- Máximo de 5-6 níveis (mantenha a estrutura rasa)

**Alinhamento de URL:**

- O caminho dos breadcrumbs deve corresponder à hierarquia da URL
- Nomenclatura consistente entre URLs e breadcrumbs
- Exemplo: `/categorias/eletronicos/laptops` → "Home / Eletrônicos / Laptops"

## Breadcrumbs em Dispositivos Móveis

### Padrão Mobile: Reduzir para Link "Voltar"

**Abordagem recomendada:**

- Mostrar apenas o nível anterior como link de "voltar"
- Ícone de seta "voltar" (←) + nome da página pai
- Exemplo: "← Laptops Gamer"

**Por que:**

- Economiza espaço vertical em dispositivos móveis
- Oferece uma funcionalidade clara (navegação para trás)
- Mais simples que o caminho completo dos breadcrumbs
- Os usuários mobile já têm o botão "voltar" no próprio dispositivo

**Alternativa: Caminho truncado**

- Mostrar "Home ... Página Atual"
- Ocultar os níveis intermediários
- Equilibra uso de espaço e contexto

## Dados Estruturados para SEO

**Schema BreadcrumbList (CRÍTICO)**: Adicione dados estruturados JSON-LD. Os breadcrumbs aparecem nos resultados de pesquisa, o que melhora o CTR (Taxa de Cliques) e ajuda os motores de busca a entenderem a estrutura do site.

**Implementação**: `BreadcrumbList` do schema.org com um array de itens. Cada item tem uma posição (1, 2, 3...), nome e URL. Consulte `seo.md` para detalhes sobre schema.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Posicionado abaixo da barra de navegação, acima do título da página
- [ ] Caminho completo exibido (Home → Categoria → Produto)
- [ ] Todos os níveis clicáveis, exceto a página atual
- [ ] Página atual visualmente distinta (não clicável, mais escura)
- [ ] Separadores claros (›, /, > ou chevron)
- [ ] Mobile: Padrão de link voltar ("← Categoria")
- [ ] Dados estruturados (JSON-LD BreadcrumbList)
- [ ] HTML Semântico (`<nav aria-label="Breadcrumb">`)
- [ ] Atributo `aria-current="page"` no item atual
- [ ] Acessível via teclado (navegação pelos links com Tab)
- [ ] Truncar nomes longos (máximo de 20-30 caracteres)
- [ ] Consistência com os nomes da navegação
- [ ] Máximo de 5-6 níveis de profundidade
