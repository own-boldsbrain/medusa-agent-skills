# Layout da página inicial

## Índice

- [Visão geral](#visao-geral)
- [Seções essenciais da página inicial](#secoes-essenciais-da-pagina-inicial)
- [Seção Hero](#secao-de-destaque)
- [Categorias em destaque](#categorias-em-destaque)
- [Seções de produtos](#secoes-de-produtos)
- [Propostas de valor](#propostas-de-valor)
- [Inscrição na newsletter](#inscricao-na-newsletter)
- [Hierarquia de conteúdo](#hierarquia-de-conteudo)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

A página inicial é a principal página de destino de uma loja virtual. Objetivo: causar uma boa primeira impressão, orientar os usuários aos produtos, comunicar valor e impulsionar conversões.

**Integração com o backend (CRÍTICO):**

Todo o conteúdo (categorias, produtos, promoções) deve ser obtido do backend do e-commerce. Faça isso com base na integração com o backend. Nunca codifique manualmente o conteúdo da página inicial. Obtenha dinamicamente os produtos em destaque, os mais vendidos, as novidades e as categorias.

### Principais funções do comércio eletrônico

- Criar uma primeira impressão positiva (gerar confiança)
- Orientar os usuários para os produtos que desejam (reduzir a taxa de rejeição)
- Destacar produtos em destaque e promoções (aumentar a conversão)
- Comunicar propostas de valor (frete grátis, devoluções)
- Captar endereços de e-mail (criar lista de marketing)
- Impulsionar conversões e vendas

## Seções essenciais da página inicial

### Seções indispensáveis

**Fundamental para toda página inicial:**

1. Seção principal (acima da dobra)
2. Navegação por categorias (descoberta de produtos)
3. Produtos em destaque/mais vendidos (prova social)
4. Rodapé (contato, informações legais, navegação)

**Altamente recomendado:**

1. Propostas de valor (frete grátis, devoluções etc.)
2. Prova social (avaliações, depoimentos, selos de confiança)
3. Seção de novidades ou promoções
4. Inscrição na newsletter

### Decisão sobre a hierarquia do conteúdo

**Acima da dobra (primeira tela):**

- Seção principal com a mensagem principal
- Chamada à ação principal
- Principais propostas de valor (opcional)

**Seções do meio:**

- Categorias em destaque
- Seções de produtos (mais vendidos, novidades, promoções)
- Banners promocionais
- Prova social

**Seções inferiores:**

- Inscrição na newsletter
- Rodapé

## Seção de destaque

Grande banner na parte superior da página inicial, a primeira coisa que os usuários veem (acima da dobra). Comunica a mensagem principal ou a promoção.

**Opções de conteúdo:**

- Campanha sazonal ou promoção
- Novos produtos
- Mensagem da marca ou proposta de valor
- Categoria de produto em destaque
- Vários slides alternados (carrossel) — no máximo 3 a 4 slides

**Veja também:** [hero.md](../components/hero.md) para obter orientações detalhadas sobre a seção de destaque, incluindo padrões de carrossel, otimização para dispositivos móveis e desempenho.

## Categorias em destaque

### Objetivo e exibição

**Objetivo**: Ajudar os usuários a navegar por categoria, reduzir o número de cliques necessários para acessar os produtos e proporcionar acesso rápido aos principais tipos de produtos.

**Seleção de categorias:**

- 4 a 8 categorias principais
- Categorias mais populares ou sazonais
- Representação equilibrada
- **Buscar dinamicamente do backend** (nunca codificar estaticamente)

### Padrões de exibição

**Padrão 1: Grade de categorias com imagens**
3 a 6 blocos de categorias com imagens, nome da categoria sobreposto; clicar para navegar. Blocos de tamanho igual em layout de grade (3 a 4 colunas no desktop, 2 no celular).

**Padrão 2: Cartões de categorias**
Layout de cartão com imagem da categoria, nome e contagem de itens (“120 produtos”). Botão “Comprar [Categoria]” em cada cartão. 2 a 4 colunas no desktop, 2 no celular.

**Padrão 3: Controle deslizante de categorias**
Categorias com rolagem horizontal, exibindo de 4 a 6 itens por vez. Setas para navegação. Consulte [product-slider.md](../components/product-slider.md).

## Seções de produtos

### Seção de produtos mais vendidos (CRÍTICO)

**Objetivo**: Apresentar produtos populares, criar prova social e orientar compradores indecisos.

**Seleção de produtos (controlada pelo backend):**

- Ordenar por volume total de vendas
- Atualizar regularmente (semanalmente ou mensalmente)
- Mistura de categorias (não apenas um tipo)
- Mostrar de 8 a 15 produtos

**Layout:**
Controle deslizante ou grade de produtos, cartões de produto com imagem, título, preço e avaliação (se disponível). Link “Ver tudo” para a página completa dos mais vendidos.

### Seção de Novidades

**Objetivo**: Destacar os produtos mais recentes, criar uma sensação de novidade e incentivar visitas repetidas.

**Seleção de produtos:**

- Produtos adicionados mais recentemente (últimos 30 dias)
- Classificados por ordem de novidade (os mais recentes primeiro)
- Excluir itens fora de estoque
- Mostrar de 10 a 20 produtos

**Layout:**
Slider de produtos, selo opcional “Novo” nos produtos. Link “Comprar Novidades”.

### Produtos em promoção

**Objetivo**: Gerar urgência e conversões, escoar o estoque excedente.

**Seleção de produtos:**

- Produtos com preços promocionais ativos no back-end
- Classificados por porcentagem de desconto
- Promoções por tempo limitado ou sazonais

**Exibição:**
Slider de produtos com selos de promoção, preços riscados e contador regressivo opcional (se for uma promoção por tempo limitado).

## Propostas de valor

### Recursos de confiança e conveniência

**Objetivo**: Gerar confiança rapidamente, abordar preocupações comuns (custo de frete, devoluções) e diferenciar-se dos concorrentes.

**Propostas de valor comuns:**

- Frete grátis (acima de um determinado valor ou sempre)
- Devoluções gratuitas (30/60/90 dias)
- Finalização de compra segura
- Atendimento ao cliente (24 horas por dia, 7 dias por semana, por telefone e chat)
- Entrega rápida (2 dias, no mesmo dia)
- Garantia de qualidade

### Padrão de exibição

**Linha de ícones (mais comum):**
3 a 4 ícones com texto abaixo da seção principal. Ícone + texto curto (ícone de caminhão + “Entrega gratuita”). Linha única, centralizada. 100 a 150 px por item.

**Posicionamento:**
Abaixo da seção de destaque (mais comum) ou acima do rodapé.

## Inscrição na newsletter

### Seção de captura de e-mail

**⚠️ IMPORTANTE: Verifique primeiro o rodapé — não duplique formulários de inscrição na newsletter.**

Se o seu rodapé já incluir um formulário de inscrição na newsletter, **NÃO adicione outra seção de newsletter na página inicial**. Dois formulários de inscrição na newsletter na mesma página:

- Gera confusão (qual usar?)
- Parece pouco profissional e repetitivo
- Reduz a conversão (fadiga de decisão)
- Desperdiça espaço valioso na página inicial

**Decisão:**

- O rodapé já tem newsletter? → Ignore a seção de newsletter na página inicial e use esse espaço para outro conteúdo
- O rodapé não tem newsletter? → Adicione uma seção de newsletter na página inicial (posicionamento recomendado: no meio da página)
- Quer as duas? → Somente se servirem a propósitos diferentes (por exemplo, rodapé = newsletter geral, página inicial = campanha/oferta específica)

**Objetivo**: Aumentar a lista de e-mails para fins de marketing, oferecer incentivo para construir relacionamento.

**Elementos essenciais do design:**

- Título: “Fique por dentro”, “Ganhe 10% de desconto”
- Subtítulo: Benefício da inscrição (não basta dizer apenas “inscreva-se”)
- Campo para inserção de e-mail
- Botão “Enviar”
- Aviso de privacidade (opcional): “Respeitamos sua privacidade”

**Incentivo (FUNDAMENTAL):**

- 10% de desconto no primeiro pedido (mais comum)
- Acesso antecipado a promoções
- Conteúdo ou produtos exclusivos
- Código de frete grátis

**Opções de layout:**

- Seção em largura total (seção dedicada, cor de fundo, centralizada)
- Formulário embutido (entre seções, menor)
- Boletim informativo no rodapé (parte do rodapé) — consulte footer.md

**Posicionamento:**
No meio da página (após 2 a 3 seções) ou acima do rodapé.

## Hierarquia de conteúdo

### Recomendação de ordem das seções

**Estrutura típica da página inicial:**

1. Seção de destaque
2. Propostas de valor (frete grátis, devoluções)
3. Categorias em destaque
4. Mais vendidos ou produtos em destaque
5. Banner promocional (no meio da página, opcional)
6. Novidades
7. Inscrição na newsletter (pule se o rodapé já tiver o formulário de inscrição)
8. Rodapé

### Ritmo visual

**Varie os tipos de seção:**
Seção de produtos → Banner → Seção de produtos. Evite a monotonia (todas as seções de produtos seguidas). Alterne entre seções com muito texto e seções com muitas imagens.

**Espaçamento:**
Espaço generoso entre as seções (64-120 px no desktop, 40-60 px no celular). Espaçamento consistente. Fundos nas seções para criar separação.

## Considerações para dispositivos móveis

**Layout responsivo:**
Coluna única para a maioria das seções, elementos empilhados verticalmente, áreas de toque maiores (mínimo de 44 px), navegação simplificada.

**Seções de produtos:**
Sliders horizontais com gestos de deslizar ou grades de produtos empilhadas (2 colunas). Cartões de produtos menores, otimizados para dispositivos móveis.

**Seção Hero:**
Proporção retrato (2:3 ou 3:4), posicionamento vertical do texto (centrado/na parte inferior). Consulte [hero.md](../components/hero.md) para obter detalhes sobre a seção Hero em dispositivos móveis.

**Desempenho:**
Carregamento diferido de imagens abaixo da dobra da tela, otimização da imagem principal (<200 KB), uso do formato WebP. Abordagem “mobile-first”.

## Lista de verificação

**Elementos essenciais:**

- [ ] Seção principal com mensagem clara e CTA
- [ ] Categorias em destaque (4 a 8 categorias com imagens)
- [ ] Categorias obtidas dinamicamente do backend
- [ ] Seção de produtos mais vendidos ou em destaque
- [ ] Seção de novidades
- [ ] Propostas de valor (frete grátis, devoluções etc.)
- [ ] Prova social (avaliações, notas, depoimentos)
- [ ] Formulário de inscrição na newsletter (somente se o rodapé não tiver um — verifique o rodapé primeiro)
- [ ] Sem formulários duplicados para a newsletter (página inicial + rodapé)
- [ ] Rodapé com navegação e links legais
- [ ] Layout responsivo para dispositivos móveis (coluna única, alvos de toque de 44px)
- [ ] Tempo de carregamento rápido (<3 segundos)
- [ ] Imagens otimizadas (<200KB, formato WebP)
- [ ] Carregamento diferido para conteúdo abaixo da dobra
- [ ] Integração com o backend (todo o conteúdo obtido via API)
- [ ] HTML semântico (main, section, h1, h2)
- [ ] Hierarquia adequada de títulos (h1 → h2 → h3)
- [ ] Acessível por teclado
- [ ] Rótulos ARIA nas seções
- [ ] Texto de alto contraste (mínimo de 4,5:1)
- [ ] CTAs claras em cada seção
