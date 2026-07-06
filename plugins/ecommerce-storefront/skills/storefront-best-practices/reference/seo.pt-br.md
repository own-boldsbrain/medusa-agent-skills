# Otimização de SEO para Lojas Virtuais

## Conteúdos

- [Visão Geral](#visão-geral)
- [Meta Tags Requisitos](#meta-tags-requisitos)
- [Dados Estruturados (Crítico para E-commerce)](#dados-estruturados-critico-para-e-commerce)
- [Padrões de URL de E-commerce](#padrões-de-url-de-e-commerce)
- [Página de Produto SEO](#página-de-produto-seo)
- [Duplicate Content Issues](#duplicate-content-issues)
- [Mapas do Site Dinâmicos](#dynamic-sitemaps)
- [Erros comuns de SEO](#erros-comuns-de-seo)

## Visão geral

SEO é crítico para e-commerce - a busca orgânica direciona tráfego de alta intenção. A implementação adequada ajuda os mecanismos de busca a entender os produtos e possibilita resultados ricos (avaliações em estrela, preço, disponibilidade na busca).

**Conhecimento assumido**: Agentes de IA conhecem SEO básico (meta tags, Open Graph, Core Web Vitals). Este guia foca em padrões específicos para e-commerce.

### Toda Página de Produto Precisa

- Título e descrição exclusivos (nome do produto + recursos)
- Produto schema com preço, disponibilidade, classificação
- Trilha de navegação (hierarquia de categorias)
- URL canônica (evita conteúdo duplicado)
- Texto alternativo descritivo da imagem
- Tempo de carregamento rápido (LCP < 2,5s)

## Meta Tags Requirements

Gere metatags exclusivos para cada página de produto dinamicamente a partir dos dados do produto:

- **Title**: "Product Name - Key Feature | Store Name" (50-60 characters)
- **Description**: Key features + USP (150-160 characters)
- **Open Graph** tags for social sharing (image 1200x630px)
- **URL canônica** para variantes e caminhos de categorias

**Erro comum**: Mesmo título/descrição para todos os produtos. Gere dinamicamente a partir dos dados do produto.

## Dados Estruturados (Crítico para Ecommerce)

Enables rich results in search (star ratings, price, availability shown directly in search results).

### Esquema de Produto (Obrigatório em Todas as Páginas de Produto)

Implement schema.org Product structured data with these critical fields:

**Essential fields:**

- `nome`, `descrição`, `imagem`, `sku`, `marca`
- `oferece` objeto com:
  - `price`: Current price (Medusa: use as-is; other backends: check format)
  - `priceCurrency`: ISO 4217 code (USD, EUR, GBP)
  - `availability`: Must accurately reflect real stock status (InStock, OutOfStock, PreOrder)
  - `priceValidUntil`: Necessário para o Google Shopping (definir para 30+ dias no futuro)

**Crítico**: `availability` deve ser dinâmico e preciso. Marcar itens fora de estoque como InStock viola as diretrizes do Google.

### Esquema AggregateRating (Quando Existem Avaliações)

Adicione o objeto `aggregateRating` ao esquema de Produto quando existirem avaliações reais:

- `ratingValue`: Average rating (e.g., "4.5")
- `reviewCount`: Total number of reviews
- `bestRating`: "5", `worstRating`: "1"

Displays star ratings in search results - powerful for CTR. **Only use for real reviews** - fake reviews violate guidelines.

### Breadcrumb Schema (Navigation Hierarchy)

Implementar schema.org BreadcrumbList mostrando a hierarquia de categorias:

- Início → Categoria → Produto
- Cada nível tem `posição`, `nome`, URL do `item`
- Helps search engines understand site structure

### Esquema de Organização (Apenas na Página Inicial)

Adicione apenas na página inicial: Nome da organização, URL, logotipo, informações de contato. Ajuda a estabelecer a identidade da marca na pesquisa.

## Ecommerce URL Patterns

**URLs de Produto**: Use slugs legíveis com hífens (`/produtos/fones-de-ouvido-sem-fio-pro`). Inclua palavras-chave naturalmente, mantenha curto (<75 caracteres), nunca altere os URLs.

**Category URLs**: Choose consistent structure:

- Hierárquico (`/categories/electronics/laptops`) para catálogos extensos
- Plano (`/categorias/notebooks`) para uma gestão mais simples
- Não misture ambas as abordagens

**URLs de Paginação**: Use parâmetros de consulta (`/products?page=2`). Implemente as tags `rel="prev"` e `rel="next"`. Cada página é canônica para si mesma (NÃO para a página 1), para que todas as páginas possam ser indexadas.

**Filtre URLs**: Use parâmetros de consulta (`/produtos?cor=azul&tamanho=grande`).

**Decisão canônica para filtros:**

- Poucos filtros (2-3): Índice de páginas filtradas (navegação primária)
- Muitos filtros (5+): Canônico para não filtrado (previne conteúdo duplicado)
- Combinações populares: Considere indexar separadamente

## Otimização da Página de Produto para SEO

### O que é a Otimização da Página de Produto para SEO?

A otimização da página de produto é um conjunto de técnicas e estratégias utilizadas para garantir que as páginas de produtos de um site sejam indexadas e visíveis nos motores de busca, aumentando assim a visibilidade e a acessibilidade dos produtos ao público.

### Importância da Otimização da Página de Produto

A otimização da página de produto é fundamental para o sucesso de uma estratégia de SEO, pois ajuda a:

- Aumentar a visibilidade dos produtos no mercado
- Melhorar a experiência do usuário
- Aumentar as taxas de conversão
- Reduzir a competição por palavras-chave

### Técnicas de Otimização da Página de Produto

Aqui estão algumas técnicas básicas de otimização da página de produto:

#### 1. **Título da Página de Produto***O título da página de produto deve ser claro e conciso

- Deve incluir a palavra-chave principal do produto

- Deve ser único para cada página de produto

```html
<title>Produto X - Descrição e Preço</title>
```

#### 2. **Meta Descrição***A meta descrição é uma breve descrição da página de produto

- Deve ser escrita de forma a atrair o usuário

- Deve incluir a palavra-chave principal do produto

```html
<meta name="description" content="Produto X é uma ótima escolha para quem busca...">
```

#### 3. **Palavras-Chave***As palavras-chave devem ser incluídas na página de produto de forma natural

- Deve haver uma quantidade razoável de palavras-chave na página

- Deve ser evitada a sobre-otimização

#### 4. **Imagens e Vídeos***As imagens e vídeos devem ser otimizados para SEO

- Deve ser incluído texto alternativo para as imagens

- Deve ser incluído um título e uma descrição para os vídeos

#### 5. **Links Internos***Os links internos devem ser otimizados para SEO

- Deve ser incluído um título e uma descrição para os links

- Deve ser evitada a sobre-otimização

### Ferramentas para Otimização da Página de Produto

Aqui estão algumas ferramentas básicas para otimização da página de produto:

***Google Search Console**: Ferramenta oficial do Google para monitorar e otimizar a página de produto
***Google Analytics**: Ferramenta para monitorar e analisar o comportamento do usuário
***Ahrefs**: Ferramenta para analisar e otimizar as palavras-chave
***SEMrush**: Ferramenta para analisar e otimizar a página de produto

### Conclusão

A otimização da página de produto é uma técnica fundamental para o sucesso de uma estratégia de SEO. Ao seguir as técnicas e estratégias apresentadas acima, é possível aumentar a visibilidade e a acessibilidade dos produtos ao público, melhorar a experiência do usuário e aumentar as taxas de conversão.

**Títulos**: Modelo "Nome do Produto - Característica-chave | Nome da Loja" (50-60 caracteres). Evite títulos genéricos ou infiltração de palavras-chave.

**Meta descrições**: Inclua 2-3 recursos principais + USP (frete grátis, trocas, garantia) em 150-160 caracteres. Faça-o cativante.

**Texto alternativo da imagem**: Descreve e específico. Descreva o que está visível, inclua o nome do produto e as principais características visuais. Não abuse dos keywords. Mantenha em menos de 125 caracteres.

## **Problemas de Conteúdo Duplicado**

### Desafios de Conteúdo Duplicado em Ecommerce

**Cenários comuns:**

1. **Variantes de produto**: Mesmo produto em várias cores/tamanhos
2. **Categorias múltiplas**: Produto listado em múltiplas categorias
3. **Combinações de filtros**: Visões filtradas criam URLs únicas
4. **Parâmetros de ordenação**: Visualizações ordenadas criam URLs únicas

### Solução: URLs canônicas

**Manipulação de variantes:**

- Escolha uma variante como canônica (geralmente padrão)
- Todas as outras variantes canônicas para aquela uma
- Exemplo: Camisetas azuis, vermelhas e verdes todos são canônicos para Azul (padrão)

**Caminhos de múltiplas categorias:**

- Escolha uma categoria como canônica (geralmente a categoria principal)
- Exemplo: Produto em ambos "Eletrônicos" e "Laptops" → canônico para "Laptops"

**Vistas filtradas/ordenadas:**

- Canonical para a página não filtrada, ordenada por padrão.
- Exemplo: `/produtos?cor=azul&amp;ordem=preco` → canônico para `/produtos`

**Parâmetros de URL**Quando você precisa criar uma URL canônica para uma URL que contém parâmetros, você pode usar a técnica de "parâmetros de URL" para remover os parâmetros desnecessários.

### Exemplo

Suponha que você tenha uma URL `/produtos?cor=azul&amp;ordem=preco` e você quer criar uma URL canônica para `/produtos`.

```bash
/products?cor=azul&amp;ordem=preco → /produtos
```

Para fazer isso, você pode usar uma função que remova os parâmetros da URL. Aqui está um exemplo de como você pode fazer isso em Python:

```python
from urllib.parse import urlparse, parse_qs

def remove_params(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    return f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"

url = "/produtos?cor=azul&amp;ordem=preco"
print(remove_params(url))  # Output: /produtos
```

### Como funciona

A função `remove_params` usa a biblioteca `urllib.parse` para analisar a URL e remover os parâmetros. A função `parse_qs` é usada para converter a string de parâmetros em um dicionário. Em seguida, a função `f-strings` é usada para criar a URL canônica sem parâmetros.

### Exemplo de uso

```python
url = "/produtos?cor=azul&amp;ordem=preco"
print(remove_params(url))  # Output: /produtos

url = "/produtos?cor=azul&amp;ordem=preco&amp;pagina=2"
print(remove_params(url))  # Output: /produtos
```

### Dicas* Sempre use a técnica de "parâmetros de URL" para criar URLs canônicas

- Certifique-se de que a função `remove_params` seja chamada com a URL correta.

- Use a função `f-strings` para criar a URL canônica sem parâmetros.

### Links

- [urllib.parse](https://docs.python.org/3/library/urllib.parse.html)
- [parse_qs](https://docs.python.org/3/library/urllib.parse.html#urllib.parse.parse_qs)

**Implementação:**

```html
<!-- On variant page (Red shirt) -->
<link rel="canonical" href="https://yourstore.com/products/cotton-tshirt" />

<!-- On filtered page -->
<link rel="canonical" href="https://yourstore.com/products" />
```

## Sitemaps Dinâmicos

Gerar mapas do site dinamicamente a partir do banco de dados para ajudar os mecanismos de busca a descobrir todos os produtos e categorias.

**Requisitos:**

- Inclua todas as páginas de produto e categoria públicas
- Atualize `lastModified` quando os produtos mudarem (busque no banco de dados)
- Excluir páginas `noindex` e URLs filtradas/ordenadas
- Divida em múltiplos mapas de site se > 50.000 URLs
- Prioridade: Página Inicial (1.0) > Produtos (0.8) > Categorias (0.6)

**Crítico**: Regenerar o mapa do site quando os produtos são adicionados/atualizados. Enviar URL do mapa do site para o Google Search Console.

## Erros Comuns de SEO

**Problemas de SEO específicos de comércio eletrônico:**

1. **Conteúdo duplicado** - Mesmo produto acessível por meio de múltiplos URLs (variantes, categorias). Use URLs canônicas para consolidar sinais.

2. **Esquema de Produto ausente** - Nenhuma estrutura de dados nas páginas de produtos. Implemente o Esquema de Produto para resultados ricos (avaliações, preço em busca).

3. **Status de disponibilidade incorreto** - Marcar itens fora de estoque como "InStock" no schema. Definir dinamicamente com base nos níveis de estoque reais (violando as diretrizes do Google).

4. **Conteúdo de produto fino** - Apenas imagem e preço, sem descrição. Adicione descrições detalhadas, especificações, avaliações (200+ palavras).

5. **Mapa do site estático** - Nunca é atualizado quando os produtos mudam. Gere dinamicamente a partir do banco de dados para que os mecanismos de busca descubram novos produtos.

6. **Texto alternativo da imagem ruim** - Imagem do produto ausente ou genérica. Use texto alternativo descritivo para tráfego de pesquisa de imagem.

## Checklist de SEO

### # Em Cada Página de Produto

## Visão Geral

A página de produto é a sua oportunidade de brilhar e encantar os clientes com detalhes irresistíveis. Aqui, você pode contar a história por trás de cada item, destacando seus recursos únicos e benefícios.

### O Que Incluir

- **Descrição Detalhada:**Descreva o produto de forma cativante, destacando suas características e vantagens.
-*Imagens*: Mostre o produto em diferentes ângulos e cenários para uma experiência visual completa.
- **Especificações:**Forneça informações técnicas e detalhes precisos para os clientes mais exigentes.
-*Avaliações e Comentários*: Inclua depoimentos de clientes satisfeitos para construir confiança.
- **Recursos Adicionais:**Adicione vídeos, guias de uso ou qualquer outro conteúdo relevante para uma experiência de compra mais rica.

[Link para a Página de Produto](https://exemplo.com/produto)

## Estrutura Sugerida

1.**Cabeçalho Chamativo:**Crie um título cativante que chame a atenção do cliente.
2.*Galeria de Imagens:*Uma coleção de imagens de alta qualidade para uma visão completa.
3.**Descrição Completa:**Aqui, você entra em detalhes, respondendo às perguntas dos clientes.
4.*Especificações Técnicas:*Detalhes precisos para os mais curiosos.
5.**Avaliações:**Deixe que os clientes falem por si mesmos.
6.*Recursos Extras:*Vá além com conteúdo interativo e útil.
7.**Chamada para Ação:** Incentive os clientes a adicionar ao carrinho ou comprar agora.

- [ ] Título da tag de descrição única e descritiva (50-60 caracteres)
- [ ] Descrição meta única e atraente (150-160 caracteres)
- [ ] Tags Open Graph e Twitter Card
- [ ] Esquema do produto com preço, disponibilidade, classificação (se existirem avaliações)
- [ ] Schema de breadcrumbs (hierarquia de categorias)
- [ ] Texto descritivo de alternativa em todas as imagens
- [ ] URL canônica (especialmente para variantes)
- [ ] Tempo de carga rápido (LCP < 2.5s)
- [ ] Design responsivo para dispositivos móveis
- [ ] Links internos para produtos relacionados/categorias
- [ ] Descrição detalhada do produto (200+ palavras ideal)

### Página inteira

- [ ] Mapa de sitemap XML dinâmico enviado para os motores de busca
- [ ] Robots.txt configurado corretamente
- [ ] Certificado SSL (HTTPS)
- [ ] Mobile-friendly design (44px touch targets)
- [ ] Esquema de organização na página inicial
- [ ] Hierarquia adequada de cabeçalhos (H1 para título do produto)
- [ ] Paginação implementada com rel="prev/next"
- [ ] URLs canônicas para páginas filtradas/ordenadas
- [ ] Páginas 404 com navegação útil
- [ ] Otimização de imagens (WebP, carregamento preguiçoso)
- [ ] Núcleos de Vitais da Web dentro dos alvos (LCP < 2,5s, CLS < 0,1, INP < 200ms)
