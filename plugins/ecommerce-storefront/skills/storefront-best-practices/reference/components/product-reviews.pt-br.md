# Componente de Avaliações de Produtos

## Índice

- [Visão geral](#visao-geral)
- [Padrões de exibição de avaliações](#padroes-de-exibicao-das-avaliacoes)
- [Resumo e distribuição das notas](#resumo-e-distribuicao-da-classificacao)
- [Classificação e filtragem](#classificacao-e-filtragem)
- [Envio de avaliações](#padroes-de-exibicao-das-avaliacoes)
- [Sinais de confiança](#sinais-de-confianca)
- [Integração com SEO](#integracao-com-seo)

## Visão geral

As avaliações de produtos geram confiança e influenciam as decisões de compra. Produtos com avaliações têm uma taxa de conversão 270% maior do que aqueles sem avaliações.

**Conhecimento prévio**: Claude sabe como criar formulários e exibir listas. Este guia enfoca os padrões de avaliação no comércio eletrônico e os sinais de confiança.

### Requisitos principais

- Resumo da classificação por estrelas (1 a 5 estrelas) com distribuição
- Avaliações individuais com classificação, texto, autor e data
- Classificação (Mais recentes, Mais úteis, Classificação mais alta/mais baixa)
- Filtragem por classificação (somente 5 estrelas, 4+ estrelas)
- Emblemas de compra verificada
- Votos de utilidade (sistema de votos positivos)
- Formulário para envio de avaliações
- Otimizado para dispositivos móveis

## Padrões de exibição das avaliações

### Posicionamento

**Na página do produto:**

- Abaixo dos detalhes do produto (após o botão “Adicionar ao carrinho”)
- Antes dos produtos relacionados
- Link de âncora nas informações do produto: “★★★★★ (127 avaliações)”

**Página separada de avaliações:**

- Apenas para catálogos muito grandes (mais de 500 avaliações)
- Link: “Ver todas as avaliações”
- A maioria das lojas exibe as avaliações diretamente na página do produto

## Resumo e distribuição da classificação

### Exibição da classificação média

**Exibir com destaque:**

- Classificação média: “★★★★★ 4,5 de 5”
- Número total de avaliações: “Com base em 127 avaliações”
- Estrelas grandes (24–32 px)

### Distribuição da classificação (CRÍTICO)

**Divisão visual com barras clicáveis:**

```
5 ★ [████████████████████] 82 (65%)
4 ★ [██████░░░░░░░░░░░░░░] 25 (20%)
3 ★ [██░░░░░░░░░░░░░░░░░░] 10 (8%)
2 ★ [█░░░░░░░░░░░░░░░░░░░] 5 (4%)
1 ★ [█░░░░░░░░░░░░░░░░░░░] 5 (3%)
```

**Tornar as barras clicáveis:**

- Clique para filtrar avaliações por nota
- Mostra apenas as notas selecionadas
- “Mostrar tudo” para redefinir o filtro

**Por que a distribuição é importante:**

- Uma nota perfeita de 5,0 parece falsa (os clientes confiam mais em uma média entre 4,2 e 4,5)
- Mostrar avaliações negativas gera confiança
- A distribuição ajuda os clientes a entender a qualidade do produto

### Situação sem avaliações

**Quando não há avaliações:**

- “Ainda não há avaliações”
- “Seja o primeiro a avaliar este produto”
- Botão “Escreva uma avaliação” em destaque
- Não mostre 0 estrelas ou classificação em branco

## Classificação e filtragem

### Opções de classificação (CRÍTICO)

**Classificação essencial:**

- **Mais recentes** (padrão) — mostra os comentários mais recentes
- **Mais úteis** (por votos positivos) — destaca as melhores avaliações
- **Melhor classificação** (5 estrelas primeiro) — veja os comentários positivos
- **Classificação mais baixa** (1 estrela primeiro) — veja as reclamações

**Seletor suspenso:**

```
Sort by: [Most Recent ▾]
```

### Opções de filtragem

**Filtrar por classificação:**

- Todas as classificações (padrão)
- Apenas 5 estrelas
- 4+ estrelas
- 3 estrelas ou menos (veja os comentários negativos)

**Filtrar por critérios:**

- Apenas compras verificadas (máximo de confiança)
- Apenas com fotos (prova visual)
- Recentes (últimos 30 dias, 6 meses)

**Mostrar contagem filtrada:**

- “Mostrando 24 de 127 avaliações”

## Envio de avaliação

### Campos do formulário de avaliação

**Obrigatórios:**

- Classificação por estrelas (seletor de 1 a 5 estrelas)
- Texto da avaliação (área de texto, 50 a 500 caracteres)
- Nome do avaliador (se não estiver conectado)

**Opcional:**

- Título/cabeçalho da avaliação
- Enviar imagens (máximo de 2 a 5)
- Você recomendaria? (Sim/Não)

**Posicionamento do formulário:**

- O botão “Escreva uma avaliação” abre um formulário modal ou embutido
- Posicionar próximo ao resumo da avaliação

### Validação do formulário

**Requisitos:**

- É necessário selecionar uma nota
- Comprimento mínimo da avaliação (50 caracteres)
- Exibir contador de caracteres: “50 / 500 caracteres”
- Validar antes do envio

**Sucesso:**

- “Obrigado pela sua avaliação!”
- “Sua avaliação está aguardando aprovação” (se a moderação estiver ativada)

## Sinais de confiança

### Emblema de compra verificada (CRÍTICO)

**Exibição:**

- Emblema ou marca de seleção: “✓ Compra verificada”
- Posicionar próximo ao nome do avaliador
- Cor verde ou ícone de marca de seleção
- Apenas para clientes confirmados

**Por que isso é importante:**

- Gera confiança (cliente real, não falso)
- Reduz a suspeita de avaliações pagas
- Maior credibilidade

### Votos úteis

**Sistema de votos positivos/negativos:**

- “Esta avaliação foi útil?”
- [👍 Sim (24)] [👎 Não (2)]
- Clique para votar (um voto por usuário)
- Permite a classificação por “Mais úteis”

**Benefícios:**

- Destaca as avaliações mais úteis
- Validação da comunidade
- Reduz o impacto de avaliações inúteis

### Imagens nas avaliações (opcional)

Fotos enviadas pelos clientes (máximo de 3 a 4 por avaliação, miniaturas de 60 a 80 px, clique para ampliar). A prova visual aumenta a confiança e o engajamento.

### Respostas da loja (recomendado)

O vendedor responde abaixo da avaliação original (recuada, com fundo cinza claro). Responda às avaliações negativas de forma profissional — isso demonstra que você se importa e aborda as preocupações sem ficar na defensiva.

## Integração com SEO

**Esquema AggregateRating (CRÍTICO):** Adicione dados estruturados para exibir classificações por estrelas nos resultados de pesquisa. Inclua `ratingValue` (classificação média), `reviewCount`, `bestRating` (5), `worstRating` (1).

**Benefícios de SEO:** Classificações por estrelas nos resultados de busca, maior CTR, rich snippets. Consulte seo.md para detalhes de implementação.

**Importante:** Inclua apenas se as avaliações forem reais. Avaliações falsas violam as diretrizes do Google.

## Padrões de exibição

**Cartão de avaliação individual:**
Classificação por estrelas (16-20 px) + texto + nome do avaliador (nome + inicial) + data + selo de verificação + votos de utilidade. Trunque avaliações longas (200-300 caracteres) com “Leia mais”.

**Dispositivos móveis:**
Coluna única, votos otimizados para toque (44px), seleção de classificação em tela cheia, barra de filtragem na parte inferior, paginação com “Carregar mais”.

## Lista de verificação

**Recursos essenciais:**

- [ ] Resumo da classificação por estrelas (média + contagem)
- [ ] Gráfico de barras com distribuição de avaliações (5 a 1 estrela)
- [ ] Barras clicáveis para filtrar por avaliação
- [ ] Menu suspenso de classificação (Mais recentes, Mais úteis, Mais altas/Mais baixas)
- [ ] Opções de filtro (verificadas, com fotos, por avaliação)
- [ ] Avaliações individuais com: estrelas, texto, nome, data
- [ ] Emblema de compra verificada
- [ ] Votos de utilidade (voto positivo/negativo)
- [ ] Formulário de envio de avaliação (classificação, texto)
- [ ] Validação do formulário (comprimento mínimo, classificação obrigatória)
- [ ] “Leia mais” para avaliações longas
- [ ] Respostas da loja às avaliações (recomendado)
- [ ] Imagens de avaliações (enviadas pelos clientes, opcional)
- [ ] Dispositivos móveis: áreas de toque com no mínimo 44px
- [ ] Paginação ou botão “Carregar mais”
- [ ] Nenhuma avaliação ("Seja o primeiro a avaliar")
- [ ] Dados estruturados de AggregateRating (SEO)
- [ ] Rótulos ARIA para classificações por estrelas
- [ ] Acessível por teclado (todas as interações)
