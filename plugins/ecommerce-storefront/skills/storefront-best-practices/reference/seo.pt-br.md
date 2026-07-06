# Otimização de SEO para lojas virtuais

## Índice

- [Visão geral](#visao-geral)
- [Requisitos das metatags](#requisitos-para-meta-tags)
- [Dados estruturados (fundamentais para o comércio eletrônico)](#dados-estruturados-fundamentais-para-o-comercio-eletronico)
- [Padrões de URL para comércio eletrônico](#padroes-de-urls-para-comercio-eletronico)
- [SEO da página de produto](#seo-da-pagina-do-produto)
- [Problemas com conteúdo duplicado](#problemas-com-conteudo-duplicado)
- [Sitemaps dinâmicos](#mapas-de-site-dinamicos)
- [Erros comuns de SEO](#erros-comuns-de-seo)

## Visão geral

O SEO é fundamental para o comércio eletrônico — a busca orgânica gera tráfego de alta intenção. A implementação adequada ajuda os mecanismos de busca a entender os produtos e possibilita resultados enriquecidos (avaliações por estrelas, preço, disponibilidade na busca).

**Conhecimentos prévios necessários**: Os agentes de IA possuem conhecimentos básicos de SEO (meta tags, Open Graph, Core Web Vitals). Este guia se concentra em padrões específicos do comércio eletrônico.

### O que toda página de produto precisa ter

- Título e descrição exclusivos (nome do produto + características)
- Esquema do produto com preço, disponibilidade e avaliação
- Esquema de trilha de navegação (hierarquia de categorias)
- URL canônica (evita conteúdo duplicado)
- Texto alternativo descritivo para imagens
- Tempo de carregamento rápido (LCP < 2,5 s)

## Requisitos para meta tags

Gere meta tags exclusivas para cada página de produto dinamicamente a partir dos dados do produto:

- **Título**: “Nome do produto - Característica principal | Nome da loja” (50-60 caracteres)
- **Descrição**: Características principais + USP (150-160 caracteres)
- Tags **Open Graph** para compartilhamento nas redes sociais (imagem 1200x630px)
- **URL canônica** para variantes e caminhos de categorias

**Erro comum**: Título/descrição iguais em todos os produtos. Gere-os dinamicamente a partir dos dados do produto.

## Dados estruturados (fundamentais para o comércio eletrônico)

Permitem resultados enriquecidos na pesquisa (avaliações por estrelas, preço e disponibilidade exibidos diretamente nos resultados da pesquisa).

### Esquema do produto (obrigatório em todas as páginas de produtos)

Implemente os dados estruturados de produto do schema.org com estes campos essenciais:

**Campos essenciais:**

- `name`, `description`, `image`, `sku`, `brand`
- Objeto `offers` com:
  - `price`: Preço atual (Medusa: use como está; outros back-ends: verifique o formato)
  - `priceCurrency`: código ISO 4217 (USD, EUR, GBP)
  - `availability`: deve refletir com precisão o status real do estoque (InStock, OutOfStock, PreOrder)
  - `priceValidUntil`: obrigatório para o Google Shopping (defina para mais de 30 dias no futuro)

**Crítico**: `availability` deve ser dinâmico e preciso. Marcar itens fora de estoque como InStock viola as diretrizes do Google.

### Esquema AggregateRating (quando houver avaliações)

Adicione o objeto `aggregateRating` ao esquema Product quando houver avaliações reais:

- `ratingValue`: Classificação média (por exemplo, “4,5”)
- `reviewCount`: Número total de avaliações
- `bestRating`: “5”, `worstRating`: “1”

Exibe classificações por estrelas nos resultados de pesquisa — muito eficaz para a CTR. **Use apenas para avaliações reais** — avaliações falsas violam as diretrizes.

### Esquema de Breadcrumb (Hierarquia de Navegação)

Implemente o BreadcrumbList do schema.org mostrando a hierarquia de categorias:

- Página inicial → Categoria → Produto
- Cada nível possui `position`, `name` e `item` na URL
- Ajuda os mecanismos de busca a compreender a estrutura do site

### Esquema da organização (somente na página inicial)

Adicione apenas na página inicial: nome da organização, URL, logotipo e informações de contato. Ajuda a estabelecer a identidade da marca nas buscas.

## Padrões de URLs para comércio eletrônico

**URLs de produtos**: Use slugs legíveis com hífens (`/produtos/fones-de-ouvido-sem-fio-pro`). Inclua palavras-chave de forma natural, mantenha-os curtos (<75 caracteres) e nunca altere as URLs.

**URLs de categorias**: Escolha uma estrutura consistente:

- Hierárquica (`/categorias/eletrônicos/laptops`) para catálogos extensos
- Estrutura plana (`/categories/laptops`) para facilitar o gerenciamento
- Não misture as duas abordagens

**URLs de paginação**: Use parâmetros de consulta (`/products?page=2`). Implemente as tags `rel="prev"` e `rel="next"`. Cada página é canônica em relação a si mesma (NÃO em relação à página 1), para que todas as páginas possam ser indexadas.

**URLs de filtro**: Use parâmetros de consulta (`/products?color=blue&size=large`).

**Decisão canônica para filtros:**

- Poucos filtros (2-3): Indexe as páginas filtradas (navegação principal)
- Muitos filtros (5 ou mais): Defina como canônica a versão não filtrada (evita conteúdo duplicado)
- Combinações populares: considere indexá-las separadamente

## SEO da página do produto

**Tags de título**: Siga o padrão “Nome do produto - Característica principal | Nome da loja” (50-60 caracteres). Evite títulos genéricos ou excesso de palavras-chave.

**Meta descrições**: Inclua 2 a 3 características principais + USP (frete grátis, devoluções, garantia) em 150-160 caracteres. Faça com que seja atraente.

**Texto alternativo da imagem**: Descritivo e específico. Descreva o que está visível, inclua o nome do produto e os principais atributos visuais. Não exagere no uso de palavras-chave. Mantenha o texto com menos de 125 caracteres.

## Problemas com conteúdo duplicado

### Desafios do conteúdo duplicado no comércio eletrônico

**Cenários comuns:**

1. **Variantes de produto**: o mesmo produto em várias cores/tamanhos
2. **Várias categorias**: produto listado em várias categorias
3. **Combinações de filtros**: visualizações filtradas criam URLs exclusivas
4. **Parâmetros de classificação**: visualizações classificadas geram URLs exclusivas

### Solução: URLs canônicas

**Tratamento de variantes:**

- Escolha uma variante como canônica (geralmente a padrão)
- Todas as outras variantes são canônicas em relação a essa
- Exemplo: camisas azuis, vermelhas e verdes são todas canônicas em relação à azul (padrão)

**Caminhos de categorias múltiplas:**

- Escolha uma categoria como canônica (geralmente a categoria principal)
- Exemplo: Produto nas categorias “Eletrônicos” e “Laptops” → canônica para “Laptops”

**Visualizações filtradas/classificadas:**

- A página canônica é aquela sem filtragem e com classificação padrão
- Exemplo: `/products?color=blue&sort=price` → a página canônica é `/products`

**Implementação:**

```html
<!-- On variant page (Red shirt) -->
<link rel="canonical" href="https://yourstore.com/products/cotton-tshirt" />

<!-- On filtered page -->
<link rel="canonical" href="https://yourstore.com/products" />
```

## Mapas de site dinâmicos

Gere mapas de site dinamicamente a partir do banco de dados para ajudar os mecanismos de busca a descobrir todos os produtos e categorias.

**Requisitos:**

- Incluir todas as páginas públicas de produtos e categorias
- Atualizar `lastModified` quando houver alterações nos produtos (buscar no banco de dados)
- Excluir páginas `noindex` e URLs filtradas/classificadas
- Dividir em vários mapas do site se houver mais de 50.000 URLs
- Prioridade: Página inicial (1,0) > Produtos (0,8) > Categorias (0,6)

**Crítico**: Regenerar o mapa do site quando produtos forem adicionados/atualizados. Enviar a URL do mapa do site para o Google Search Console.

## Erros comuns de SEO

**Problemas de SEO específicos do comércio eletrônico:**

1. **Conteúdo duplicado** — O mesmo produto pode ser acessado por meio de várias URLs (variantes, categorias). Use URLs canônicas para consolidar os sinais.

2. **Ausência do esquema de produto** — Ausência de dados estruturados nas páginas de produtos. Implemente o esquema de produto para obter resultados enriquecidos (avaliações, preço na pesquisa).

3. **Status de disponibilidade incorreto** — Marcar itens fora de estoque como “Em estoque” no esquema. Defina dinamicamente com base nos níveis reais de estoque (viola as diretrizes do Google).

4. **Conteúdo insuficiente do produto** — Apenas imagem e preço, sem descrição. Adicione descrições detalhadas, especificações e avaliações (mais de 200 palavras).

5. **Mapa do site estático** — Nunca é atualizado quando os produtos mudam. Gere-o dinamicamente a partir do banco de dados para que os mecanismos de busca descubram novos produtos.

6. **Texto alternativo de imagem inadequado** — Ausente ou genérico, como “imagem do produto”. Use texto alternativo descritivo para atrair tráfego de pesquisa por imagens.

## Lista de verificação de SEO

### Em todas as páginas de produto

- [ ] Tag de título exclusiva e descritiva (50 a 60 caracteres)
- [ ] Meta descrição exclusiva e atraente (150 a 160 caracteres)
- [ ] Tags Open Graph e Twitter Card
- [ ] Esquema de produto com preço, disponibilidade e avaliação (caso haja avaliações)
- [ ] Esquema de trilha de navegação (hierarquia de categorias)
- [ ] Texto alternativo descritivo em todas as imagens
- [ ] URL canônica (especialmente para variantes)
- [ ] Tempo de carregamento rápido (LCP < 2,5 s)
- [ ] Design responsivo para dispositivos móveis
- [ ] Links internos para produtos/categorias relacionados
- [ ] Descrição detalhada do produto (idealmente, mais de 200 palavras)

### Em todo o site

- [ ] Mapa do site em XML dinâmico enviado aos mecanismos de busca
- [ ] Arquivo robots.txt configurado corretamente
- [ ] Certificado SSL (HTTPS)
- [ ] Design otimizado para dispositivos móveis (áreas de toque de 44px)
- [ ] Esquema de organização na página inicial
- [ ] Hierarquia adequada de títulos (H1 para o título do produto)
- [ ] Paginação implementada com rel="prev/next"
- [ ] URLs canônicas para páginas filtradas/classificadas
- [ ] Páginas 404 com navegação útil
- [ ] Otimização de imagens (WebP, carregamento diferido)
- [ ] Indicadores Core Web Vitals dentro das metas (LCP < 2,5 s, CLS < 0,1, INP < 200 ms)
