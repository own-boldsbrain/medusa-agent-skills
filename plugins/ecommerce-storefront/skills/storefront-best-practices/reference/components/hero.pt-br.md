# Componente da Seção Hero

## Conteúdo

- [Visão Geral](#overview)
- [Tipos de Heróis e Quando Usá-los](#tipos-de-herois-e-quando-usar)
- [Diretrizes de Conteúdo](#diretrizes-de-conteúdo)
- [Múltiplos Heróis (Carousel)](#múltiplos-heróis-carousel)
- [Hero Móvel](#mobile-hero)
- [Desempenho](#performance)
- [Lista de Verificação](#checklist)

## Visão Geral

A seção hero é o banner de destaque no topo da página inicial, imediatamente abaixo da navegação. Primeiro conteúdo que os usuários veem - define o tom para a experiência de compra.

**Conhecimento prévio**: Os agentes de IA sabem como criar banners de largura completa com imagens e sobreposições de texto. Isso se concentra em padrões de hero do e-commerce.

**Requisitos principais:**

- Acima da dobra (visível imediatamente)
- Proposta de valor clara ou mensagem promocional
- Imagens de alta qualidade
- Chamada de ação forte
- Carregamento rápido (crítico para primeira impressão)

## Tipos de Herói e Quando Usar

### 1. Banner de Largura Total (O Mais Comum)

**Características:**

- Acelera o conteúdo até a largura da viewport
- Imagem de fundo grande ou vídeo
- Texto sobreposta com título + chamada para ação
- Mensagem única e focada

**Melhor para:**

- Campanhas sazonais ("Venda de Verão")
- Chegadas de novos produtos
- Racismo de marca

**Definição**A história de marca é a forma como uma empresa apresenta sua identidade e propósito através de uma narrativa atraente e emocionante.**Importância**A história de marca é fundamental para qualquer empresa que deseje se destacar no mercado. Ela ajuda a criar uma conexão emocional com os clientes, a diferenciar a empresa de seus concorrentes e a estabelecer uma identidade única.**Tipos de histórias de marca***Histórias de fundação: contam a história de como a empresa foi fundada e o propósito por trás dela.

- Histórias de missão: destacam a missão e os valores da empresa.
- Histórias de produto: contam a história de como um produto ou serviço foi criado e como ele pode ajudar os clientes.
- Histórias de personalidade: destacam a personalidade da marca e como ela se relaciona com os clientes.

**Exemplos de histórias de marca bem-sucedidas***A história de fundação da Apple, que conta a história de como a empresa foi fundada e o propósito por trás dela.

- A história de missão da Patagonia, que destaca a missão e os valores da empresa.
- A história de produto da Nike, que conta a história de como um produto ou serviço foi criado e como ele pode ajudar os clientes.

**Dicas para criar uma história de marca eficaz***Seja autêntico e consistente em sua narrativa.

- Use linguagem clara e concisa.
- Destaque a conexão emocional com os clientes.
- Seja criativo e inovador em sua abordagem.
- Use histórias para transmitir mensagens e valores.

**Recursos adicionais***[Livro: "A História de Marca: Como Criar uma Narrativa que Inspire e Conecte" de Jonah Sachs](https://www.amazon.com.br/Hist%C3%ADria-Marca-Criar-Narrativa-Inspire/dp/8576053805)

- [Artigo: "A Importância da História de Marca para Empresas" da HubSpot](https://blog.hubspot.com/pt/marketing/a-importancia-da-historia-de-marca-para-empresas)
- [Curso: "Criar Histórias de Marca Eficientes" da Udemy](https://www.udemy.com/course/criar-historias-de-marca-eficientes/)

- Enfoque de promoção único

**Enfoque de promoção único**O enfoque de promoção único é uma estratégia de marketing que se concentra em uma única mensagem, produto ou oferta para promover um negócio ou produto. Isso pode incluir uma campanha publicitária, promoção de vendas ou qualquer outra forma de comunicação com os clientes.**Vantagens***Maior visibilidade e reconhecimento do produto ou negócio

- Capacidade de criar uma identidade única e consistente
- Possibilidade de se conectar com o público-alvo de forma mais eficaz

**Exemplos***Uma empresa de cosméticos pode lançar uma campanha publicitária que se concentre em um único produto, como um creme hidratante.

- Uma loja de roupas pode promover uma única peça de roupa, como um casaco de inverno, com uma promoção especial.
- Uma empresa de tecnologia pode lançar uma campanha publicitária que se concentre em um único produto, como um smartphone.

**Dicas***Defina claramente o objetivo da campanha de promoção única.

- Selecione um público-alvo específico e personalize a mensagem de acordo com as necessidades e interesses desse público.
- Use uma linguagem e um tom que sejam consistentes com a marca e o produto.
- Acompanhe e ajuste a campanha de acordo com os resultados e feedback dos clientes.

**Código de exemplo**

```html
<div class="promo-unique">
  <h1>Enfoque de promoção único</h1>
  <p>Mensagem de promoção única aqui.</p>
  <button>Compre agora!</button>
</div>
```

- Mensagem simples, **destacada**

**Exemplo:** Imagem de fundo de produtos, manchete "40% de desconto na liquidação de verão", CTA "Compre agora"

### 2. Divida o Herói (Imagem + Conteúdo)

**Características:**

- Divisão de layout 50/50 ou 60/40
- Imagem de um lado, conteúdo de texto do outro
- Não sobrepor texto na imagem
- Mais limpo, mais fácil de ler

**Melhor para:**

- Lançamentos de produtos (mostre o produto claramente)
- Comunicação detalhada (mais espaço de texto)
- Acessibilidade (nenhum problema de contraste de texto-imagem)
- Lojas Profissionais/B2B

**Exemplo:** Imagem do produto (esquerda 50%), título + benefícios + CTB (direita 50%)

### 3. Herói Minimalista

**Características:**

- Imagem grande, texto mínimo
- A imagem conta histórias
- Título sutil, pequeno CTA
- Destaque para a marca visual

**Melhor para:**

- Marcas de luxo (estética sofisticada)
- Marcas de estilo de vida (imagens aspiracionais)
- Produtos focados em fotografia
- Brand over promotion

### 4. **Hero de Vídeo**

**Características:**

- Background video (muted, looping)
- Textos de sobreposição em vídeo
- Imagem de fallback para conexões lentas

**Melhor para:**

- Marcas de moda (mostre os produtos em movimento)
- Produtos de estilo de vida (demonstram uso)
- Caminhantes de alto orçamento
- Contando histórias de marca com movimento

**Importante:** Reprodução automática sem som, forneça controles de reprodução/pausa, otimize o tamanho do arquivo (<5MB), use imagem de pôster como fallback.

### 5. Destaque do Produto Hero

**Characteristics:**

- Multiple featured products in hero
- Grid of 2-4 products
- Links rápidos para páginas de produtos
- Menos promocional, mais descoberta

**Melhor para:**

- Lojas de multi-categorias
- Focado no produto (não focado na campanha)
- Quick product discovery
- Marketing mínimo, navegação máxima

## Diretrizes de Conteúdo

**Práticas recomendadas para títulos:**

- Curto e impactante (5-10 palavras)
- Proposta de valor clara ("Frete Grátis em Todos os Pedidos")
- Urgência se sensível ao tempo ("Promoção Relâmpago de 48 Horas")
- Focado em benefícios ("Atualize seu Estilo")
- Evite frases genéricas ("Bem-vindo à Nossa Loja")

**Subtexto (opcional):**

- 10-20 palavras no máximo.
- Expanda o benefício do título.
- Adicione contexto ou detalhes
- Nem sempre necessário (design limpo)

**Chamada para ação:**

- Botão principal de CTA único
- Texto orientado à ação ("Compre Agora", "Explore Categoria", "Comece Agora")
- Contraste alto (destaca-se na imagem)
- Grande o suficiente (altura mínima de 48px)
- Link para a página de destino relevante (promoção, categoria, lista de produtos)

**Seleção de imagem:**

- Fotografia profissional de alta qualidade
- Shows products or lifestyle context
- Representa a estética da marca
- Otimizado para web (<500KB)
- Responsivo (culturas diferentes para dispositivos móveis)
- Garanta que a sobreposição de texto seja legível (contraste adequado)

## Vários Heróis (Carrossel)

**Padrão Carrossel:**

- 2-4 slides girando automaticamente
- Cada slide = herói independente (mensagem própria, imagem, CTA)
- Girar automaticamente a cada 5-7 segundos (lento o suficiente para ler)
- Controles manuais (setas anterior/próxima, indicadores de pontos)
- Pausa ao passar o cursor (acessibilidade)

**Quando usar carrossel:**

- Múltiplas campanhas concorrentes (Venda de Inverno + Novidades)
- Diferentes segmentos de público (Homens/Mulheres/Crianças)
- Exibição de variedade sazonal
- Espaço limitado acima da dobra

**Quando NÃO usar carousel:**

- Campanha focada única (use apenas um herói)
- Usuários raramente veem slides além do primeiro (cegueira de carrossel)
- Carregamento mais lento da página (múltiplas imagens)
- Preocupações de acessibilidade (conteúdo de rotação automática)

**Melhores práticas para Carrosséis:**

- Máximo de 3-4 slides (mais = ignorado)
- Primeiro slide mais importante (mais visualizado)
- Layout consistente entre os slides
- Indicadores claros mostrando progresso
- Não confie em slides posteriores para informações críticas
- Pausar na interação (hover, foco)

## Herói Móvel

**Ajustes móveis (CRÍTICO):**

**Layout:**

- Largura total, proporção retrato (2:3 ou 3:4)
- Composição vertical (sobreposição de texto no centro/inferior)
- Texto maior para legibilidade
- Mensagem simplificada (título mais curto)

**Split hero on mobile:**

- Empilhar verticalmente (imagem acima, texto abaixo)
- Não use lado a lado (muito apertado)

**Desempenho:**

- Imagens menores (<300KB)
- Diferente corte de imagem para retrato mobile
- Use `srcset` ou `<picture>` para imagens responsivas
- Considere imagem estática em vez de vídeo (dados móveis)

**Interações por toque:**

- Botão CTA grande (altura mínima de 48px)
- Easy carousel controls (if used)
- Gesto de deslizar para slides do carrossel

## Desempenho

**Crítico para a primeira impressão:**

**Otimização de imagem:**

- Formato WebP com fallback para JPEG
- Carregamento preguiçoso do conteúdo abaixo da dobra (não do hero - ele está acima da dobra)
- Imagens responsivas (mobile recebe tamanho menor)
- Alvo: <500KB desktop, <300KB mobile
- Use CDN para entrega mais rápida

**Otimização de vídeo:**

- <5MB file size maximum
- Muted, autoplay, loop
- Pôster da imagem (exibido antes do carregamento do vídeo)
- Fallback para imagem em conexões lentas
- Considere não usar em dispositivos móveis (dados/desempenho)

**Otimização de LCP:**

- Imagem do herói geralmente é o Maior Conteúdo de Pintura
- Preload hero image: `<link rel="preload" as="image" href="hero.jpg">`
- CSS crítico em linha para herói
- Evite deslocamento de layout (defina dimensões da imagem)

**Métricas-alvo:**

- LCP < 2.5 seconds
- No layout shift (CLS < 0.1)
- Interação rápida (hero CTA clicável imediatamente)

## Lista de Verificação

**Essential features:**

- [ ] Acima da dobra (imediatamente visível)
- [ ] Clear headline (5-10 words, value proposition)
- [ ] Imagem de alta qualidade (profissional, alinhada à marca)
- [ ] Primary CTA button (action-oriented, high contrast)
- [ ] Fast loading (<500KB image desktop, <300KB mobile)
- [ ] Imagens responsivas (diferentes tamanhos/cortes para dispositivos)
- [ ] Mobile: Portrait aspect ratio (2:3 or 3:4)
- [ ] Mobile: Posicionamento do texto na vertical (central/inferior)
- [ ] Mobile: Large CTA (48px height minimum)
- [ ] Sobreposição de texto legível (contraste adequado, sobreposição de fundo)
- [ ] If carousel: Max 3-4 slides
- [ ] Se carrossel: Rotação automática de 5-7 segundos
- [ ] Se carrossel: Pausar ao passar o mouse/focar
- [ ] If carousel: Manual controls (arrows, dots)
- [ ] Se vídeo: Silenciado, reprodução automática, loop
- [ ] Se vídeo: Imagem de fallback do pôster
- [ ] Se vídeo: <5MB de tamanho de arquivo
- [ ] Pré-carregar imagem do herói (otimização do LCP)
- [ ] Sem deslocamento de layout (definir dimensões da imagem)
- [ ] Rótulos ARIA nos controles do carrossel
- [ ] Acessível por teclado (Tab para CTA, teclas de seta para carrossel)
