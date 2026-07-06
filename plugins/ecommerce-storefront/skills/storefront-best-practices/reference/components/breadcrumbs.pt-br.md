# Componente de trilha de navegação

## Índice

- [Componente de trilha de navegação](#padroes-de-trilha-de-navegacao-no-comercio-eletronico)
  - [Índice](#contents)
  - [Visão geral](#visao-geral)
    - [Requisitos principais](#requisitos-principais)
  - [Quando usar o Breadcrumbs](#quando-usar-trilhas-de-navegacao)
  - [Padrões de Breadcrumbs para comércio eletrônico](#padroes-de-trilha-de-navegacao-no-comercio-eletronico)
    - [Breadcrumbs na página de produto](#quando-usar-trilhas-de-navegacao)
    - [Breadcrumbs na página de categoria](#quando-usar-trilhas-de-navegacao)
    - [Construção do caminho](#path-construction)
  - [Breadcrumbs para dispositivos móveis](#trilhas-de-navegacao-em-dispositivos-moveis)
    - [Padrão para dispositivos móveis: link “Voltar” ao recolher](#trilhas-de-navegacao-em-dispositivos-moveis)
  - [Dados estruturados para SEO](#dados-estruturados-para-seo)
  - [Lista de verificação](#lista-de-verificacao)

## Visão geral

A trilha de navegação mostra a localização do usuário na hierarquia do site (Página inicial → Categoria → Subcategoria → Produto). É fundamental para a navegação em comércio eletrônico e para o SEO.

**Conhecimento prévio**: os agentes de IA sabem como criar trilhas de navegação com separadores e links. Este guia se concentra em padrões específicos para comércio eletrônico.

### Requisitos principais

- Mostrar o caminho completo desde a página inicial até a página atual
- Cada nível é clicável (exceto a página atual)
- Posicionado abaixo da barra de navegação, acima do título da página
- Inclui dados estruturados para SEO (JSON-LD)
- Otimizado para dispositivos móveis (padrão de link de retorno)

## Quando usar trilhas de navegação

**Use para:**

- Páginas de produtos (Página inicial → Categoria → Subcategoria → Produto)
- Páginas de categoria (Página inicial → Categoria → Subcategoria)
- Hierarquias profundas do site (3 ou mais níveis)
- Catálogos grandes com muitas categorias

**Não use para:**

- Página inicial (sem páginas pai)
- Estruturas planas do site (1 a 2 níveis)
- Fluxo de checkout (linear, não hierárquico)
- Resultados da pesquisa (não hierárquicos)

## Padrões de trilha de navegação no comércio eletrônico

### Trilha de navegação na página do produto

**Padrão padrão:**

- Página inicial / Categoria / Subcategoria / Nome do produto
- Exemplo: Página inicial / Eletrônicos / Laptops / Laptop para jogos Pro

**Principais considerações:**

- Todos os níveis, exceto o nome do produto, são clicáveis
- O nome do produto corresponde à página atual (não clicável, texto em tom mais escuro)
- Mostra a localização do produto no catálogo

**Pertencimento a várias categorias:**

- Se o produto estiver em várias categorias, escolha a principal/canônica
- Corresponder à categoria na URL ou no caminho de navegação
- Manter a consistência em todo o site

### Trilha de navegação da página de categoria

**Padrão padrão:**

- Página inicial / Categoria principal / Categoria atual
- Exemplo: Página inicial / Eletrônicos / Laptops

**Categoria atual:**

- Não clicável (texto simples)
- Visualmente distinta dos links (mais escura ou em negrito)

### Construção do caminho

**Hierarquia:**

- Comece com “Página inicial” (ou ícone da página inicial)
- Siga a hierarquia das categorias
- Termine com a página atual
- Máximo de 5 a 6 níveis (mantenha a estrutura simples)

**Alinhamento com a URL:**

- O caminho de navegação deve corresponder à hierarquia da URL
- Nomenclatura consistente entre URLs e trilhas de navegação
- Exemplo: `/categories/electronics/laptops` → “Página inicial / Eletrônicos / Laptops”

## Trilhas de navegação em dispositivos móveis

### Padrão para dispositivos móveis: recolher para criar link de volta

**Abordagem recomendada:**

- Mostrar apenas o nível anterior como link de volta
- Ícone de seta para trás (←) + nome da página pai
- Exemplo: “← Laptops para jogos”

**Por que:**

- Economiza espaço vertical em dispositivos móveis
- Funcionalidade clara (navegação para trás)
- Mais simples do que uma trilha de navegação completa
- Os usuários de dispositivos móveis têm o botão “Voltar” do aparelho

**Alternativa: Caminho truncado**

- Exibir “Página inicial... Página atual”
- Ocultar níveis intermediários
- Equilibrar espaço e contexto

## Dados estruturados para SEO

**Esquema BreadcrumbList (CRÍTICO)**: Adicionar dados estruturados em JSON-LD. A trilha de navegação aparece nos resultados de busca, melhora a CTR e ajuda os mecanismos de busca a compreender a estrutura do site.

**Implementação**: BreadcrumbList do schema.org com matriz de itens. Cada item possui posição (1, 2, 3...), nome e URL. Consulte o arquivo seo.md para obter detalhes sobre o esquema.

## Lista de verificação

**Recursos essenciais:**

- [ ] Posicionado abaixo da barra de navegação, acima do título da página
- [ ] Caminho completo exibido (Página inicial → Categoria → Produto)
- [ ] Todos os níveis clicáveis, exceto a página atual
- [ ] Página atual visualmente diferenciada (não clicável, mais escura)
- [ ] Separadores claros (›, /, > ou seta)
- [ ] Dispositivos móveis: padrão de link “Voltar” (“← Categoria”)
- [ ] Dados estruturados (JSON-LD BreadcrumbList)
- [ ] HTML semântico (`<nav aria-label="Breadcrumb">`)
- [ ] `aria-current="page"` no item atual
- [ ] Acessível por teclado (navegação por links com a tecla Tab)
- [ ] Rastreamento de rótulos longos (máximo de 20 a 30 caracteres)
- [ ] Consistente com os rótulos de navegação
- [ ] No máximo 5 a 6 níveis de profundidade
