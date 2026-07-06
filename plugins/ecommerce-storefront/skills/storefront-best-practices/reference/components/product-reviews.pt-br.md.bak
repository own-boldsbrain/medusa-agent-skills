# Componente de Avaliações de Produtos

## Conteúdo

- [Visão Geral](#visão-geral)
- [Padrões de Exibição de Avaliações](#padrões-de-exibição-de-avaliações)
- [Resumo e Distribuição da Classificação](#resumo-e-distribuição-da-classificação)
- [Ordenação e Filtragem](#ordenacao-e-filtragem)
- [Submissão de Avaliação](#submissão-de-avaliação)
- [Sinais de Confiança](#sinais-de-confiança)
- [Integração de SEO](#integracao-de-seo)

## Visão Geral

Avaliações de produtos geram confiança e influenciam as decisões de compra. Avaliações com classificações convertem 270% melhor do que produtos sem.

**Conhecimento assumido**: Claude sabe como criar formulários e exibir listas. Este guia foca nos padrões de avaliações de comércio eletrônico e sinais de confiança.

### Key Requirements

- Resumo de classificação de estrelas (1-5 estrelas) com distribuição

### Classificação de Estrelas

#### 1 Estrela

- 0% dos usuários

#### 2 Estrelas

- 0% dos usuários

#### 3 Estrelas

- 0% dos usuários

#### 4 Estrelas

- 0% dos usuários

#### 5 Estrelas

- 0% dos usuários

- Avaliações individuais com classificações, texto, autor, data
- Ordenação (Mais Recente, Mais Útil, Maior/Menor Classificação)
- Filtering by rating (5 stars only, 4+ stars)
- Verified purchase badges
- Votos úteis (sistema de votos positivos)
- **Formulário de envio de avaliação**
- Mobile-optimized

## Revisão de Padrões de Exibição

### Posicionamento

**On product page:**

- Abaixo dos detalhes do produto (após adicionar ao carrinho)
- Antes de produtos relacionados
- Link âncora nas informações do produto: "★★★★★ (127 avaliações)"

**Página de avaliações separada:**

- Somente para catálogos muito grandes (500+ avaliações)
- Link: "Ver Todas as Avaliações"
- A maioria das lojas exibe avaliações embutidas na página do produto

## Classificação Resumo e Distribuição

### Exibição da Classificação Média

**Exibir de forma proeminente:**

- Classificação média: "★★★★★ 4.5 de 5"
- Contagem total de avaliações: "Com base em 127 avaliações"
- Large stars (24-32px)

### Distribuição de Classificações (CRÍTICO)

**Desdobramento visual com barras clicáveis:**

```
5 ★ [████████████████████] 82 (65%)
4 ★ [██████░░░░░░░░░░░░░░] 25 (20%)
3 ★ [██░░░░░░░░░░░░░░░░░░] 10 (8%)
2 ★ [█░░░░░░░░░░░░░░░░░░░] 5 (4%)
1 ★ [█░░░░░░░░░░░░░░░░░░░] 5 (3%)
```

**Torne as barras clicáveis:**

- Clique para filtrar avaliações por classificação
- Mostra apenas as classificações de estrelas selecionadas
- Mostrar tudo para redefinir o filtro

**Por que a distribuição é importante:**

- Classificação perfeita de 5.0 parece falsa (os clientes confiam em uma média de 4.2-4.5)
- Mostrar avaliações negativas constrói confiança
- Distribuição ajuda os clientes a entender a qualidade do produto

### Sem Avaliações

**Quando não houver avaliações:**

- "Ainda sem avaliações"
- Seja o primeiro a avaliar este produto
- Botão **"Write a Review"** proeminente
- Não mostre 0 estrelas ou classificação vazia

## Ordenação e Filtragem

### Opções de Ordenação (CRÍTICO)

**Classificação essencial:**

- **Mais Recentes** (padrão) - mostra os feedbacks mais recentes
- **Mais Úteis** (por votos) - exibe as melhores avaliações
- **Maior Avaliação** (5 estrelas primeiro) - veja o feedback positivo
- **Menor Avaliação** (1 estrela primeiro) - veja as preocupações

**Seletor de menu suspenso:**

```
Sort by: [Most Recent ▾]
```

### Opções de Filtro

**Filtrar por classificação:**

- Todas as classificações (padrão)
- 5 estrelas apenas
- 4+ estrelas
- 3 estrelas ou menos (veja feedback negativo)

**Filtrar por critérios:**

- Compras verificadas apenas (maior confiança)
- Com fotos apenas (prova visual)
- Recente (últimos 30 dias, 6 meses)

**Exibir contagem filtrada:**

- Exibindo 24 de 127 avaliações

## Review Submission

### Formulário de Revisão

**Obrigatório:**

- Classificação por estrelas (seletor de 1 a 5 estrelas)
- Texto de revisão (área de texto, 50-500 caracteres)
- Nome do revisor (se não estiver conectado)

**Opcional:**

- Título/revisão
- Envie imagens (2-5 no máximo)
- Você recomendaria? (Sim/Não)

**Colocação do formulário:**

- Botão "Write a Review" abre modal ou formulário inline
- Posição próxima ao resumo da avaliação

### Validação de Formulário

**Requisitos:**

- A classificação deve ser selecionada
- Comprimento mínimo da avaliação (50 caracteres)
- Exibir contador de caracteres: "50 / 500 caracteres"
- Valide antes de enviar

**Sucesso:**

- Obrigado pela sua avaliação!
- Sua avaliação está pendente de aprovação

## Sinais de Confiança

### Insígnia de Compra Verificada (CRÍTICO)

**Exibição:**

- Badge ou marca de seleção: "✓ Compra Verificada"
- Position near reviewer name
- Cor verde ou ícone de marca de seleção
- Somente para clientes confirmados

**Why it matters:**

- Constrói confiança (cliente real, não falso)
- Reduz suspeitas de avaliações pagas
- Maior credibilidade

### Votos úteis

**Sistema de votos positivos/negativos:**

- "Esta avaliação foi útil?"
- [👍 Yes (24)] [👎 No (2)]
- Click to vote (one vote per user)
- Powers "Mais Úteis" sorting

**Benefits:**

- Surfaces most useful reviews
- Validação da comunidade
- Reduz o impacto de avaliações inúteis

### Revisar Imagens (Opcional)

Customer-uploaded photos (3-4 max per review, 60-80px thumbnails, click to enlarge). Visual proof increases trust and engagement.

### Armazenar Respostas (Recomendado)

Respostas do vendedor abaixo da avaliação original (recuadas, fundo cinza claro). Responda às avaliações negativas de forma profissional - mostra que você se importa, aborda preocupações sem ser defensivo.

## Integração de SEO

**AggregateRating Schema (CRITICAL):** Add structured data to show star ratings in search results. Include `ratingValue` (avg rating), `reviewCount`, `bestRating` (5), `worstRating` (1).

**Benefícios de SEO:** Classificações por estrelas nos resultados de pesquisa, maior CTR, rich snippets. Veja seo.md para detalhes de implementação.

**Important:** Only include if reviews are real. Fake reviews violate Google guidelines.

## Padrões de Exibição

**Individual review card:**
Star rating (16-20px) + text + reviewer name (first name + initial) + date + verified badge + helpful votes. Truncate long reviews (200-300 chars) with "Read more".

**Mobile:**
Coluna única, votos otimizados para toque (44px), seletor de ordenação em tela cheia, filtro em bottom sheet, paginação "Carregar mais".

## Lista de Verificação

**Recursos essenciais:**

- [ ] Star rating summary (average + count)
- [ ] Gráfico de barras de distribuição de avaliações (5 a 1 estrelas)
- [ ] Clickable bars to filter by rating
- [ ] Sort dropdown (Most Recent, Most Helpful, Highest/Lowest)
- [ ] Opções de filtro (verificadas, com fotos, por classificação)
- [ ] Individual reviews with: stars, text, name, date
- [ ] Verified purchase badge
- [ ] Helpful votes (upvote/downvote)
- [ ] Revisar formulário de envio (avaliação, texto)
- [ ] Validação de formulário (comprimento mínimo, avaliação obrigatória)
- [ ] "Leia mais" para resenhas longas
- [ ] Armazenar respostas para avaliações (recomendado)
- [ ] Revisar imagens (envios dos clientes, opcional)
- [ ] Mobile: Alvos de toque mínimo de 44px
- [ ] Pagination or "Load more" button
- [ ] Sem avaliações ("Seja o primeiro a avaliar")
- [ ] Dados estruturados de AggregateRating (SEO)
- [ ] Rótulos ARIA para classificações de estrelas
- [ ] Acessível por teclado (todas as interações)
