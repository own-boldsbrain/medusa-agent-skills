# Componente de Slider de Produtos

## Índice

- [Componente de Slider de Produtos](#quando-usar-sliders-de-produtos)
  - [Índice](#contents)
  - [Visão geral](#visao-geral)
  - [Quando usar sliders de produtos](#quando-usar-sliders-de-produtos)
  - [Padrões de carrossel](#padroes-de-slider)
  - [Exibição de produtos](#quando-usar-sliders-de-produtos)
  - [Controles de navegação](#controles-de-navegacao)
  - [Carrosséis para dispositivos móveis](#controles-deslizantes-para-dispositivos-moveis)
  - [Desempenho](#desempenho)
  - [Lista de verificação](#lista-de-verificacao)

## Visão geral

O slider de produtos (carrossel) exibe vários produtos horizontalmente, com navegação para percorrê-los. É usado para produtos relacionados, vistos recentemente, mais vendidos e produtos em destaque.

**Conhecimento prévio**: Os agentes de IA sabem como criar carrosséis com navegação. Este guia se concentra em padrões de sliders de produtos para comércio eletrônico.

**Requisitos principais:**

- Rolagem horizontal dos cartões de produto
- Navegação por setas (anterior/próximo)
- Indicadores de pontos opcionais
- Dispositivos móveis: suporte ao gesto de deslizar
- Contagem responsiva de produtos (4 a 6 visíveis no desktop, 2 a 3 no celular)
- Carregamento diferido para produtos fora da tela

## Quando usar sliders de produtos

**Use para:**

- Produtos relacionados (página do produto)
- Visualizados recentemente (página do produto, página inicial)
- “Você também pode gostar” (página do produto)
- Mais vendidos / Produtos em destaque (página inicial)
- “Frequentemente comprados juntos” (página do produto)
- Novidades (página inicial)
- Destaques por categoria (página inicial)

**Não use para:**

- Imagens principais do produto (use uma galeria em vez disso)
- Conteúdo essencial (nem todos os usuários rolam a tela ou deslizam)
- Fluxo de checkout (mantenha-o linear)
- Navegação principal (use uma grade para facilitar a descoberta)

## Padrões de slider

**Rolagem contínua:**

- Mostra de 4 a 6 produtos por vez (desktop)
- Role para a esquerda/direita de 1 a 2 produtos por vez
- Transição animada suave (300-400 ms)
- Padrão mais comum

**Loop infinito (opcional):**

- Retorna ao início após o fim
- Ideal para conjuntos pequenos de produtos (<10 itens)
- Cria uma sensação de navegação contínua
- Não é necessário para conjuntos grandes

**Alinhamento automático:**

- Os produtos se alinham à grade após a rolagem
- Evita a visibilidade parcial dos produtos
- Melhor alinhamento visual
- Melhora a experiência de navegação

**Reprodução automática (NÃO recomendado para produtos):**

- Rolagem automática sem ação do usuário
- Experiência do usuário (UX) insatisfatória para sliders de produtos (os usuários perdem o controle)
- Use apenas para banners promocionais/imagens de destaque
- Se for usar: pausar ao passar o mouse, velocidade lenta (5-7s)

## Exibição do produto

**Cartões de produto em sliders:**

- Os mesmos cartões das grades de produtos (consulte product-card.md)
- Versão simplificada para dispositivos móveis (menos detalhes, imagens menores)
- Imagem, título e preço, no mínimo
- Opcional: Avaliação, “Adicionar ao carrinho” (somente em desktop)
- Espaçamento adequado entre os cartões (16-24px)

**Exibição responsiva:**

- Computador de tela grande (>1440px): 5 a 6 produtos visíveis
- Computador (1024-1440px): 4 a 5 produtos
- Tablet (768-1024px): 3 a 4 produtos
- Dispositivos móveis (<768px): 2 produtos (às vezes 1,5 para indicar a necessidade de rolagem)

**Indicação de rolagem em dispositivos móveis:**

- Mostrar 1,5 produtos (visibilidade parcial do próximo)
- Indica que há mais conteúdo para deslizar
- Melhora a descoberta de conteúdo
- Melhor do que mostrar exatamente 2 produtos

## Controles de navegação

**Botões de seta:**

- Setas para a esquerda/direita fora do slider
- Computador: sempre visíveis ou exibidas ao passar o mouse
- Celular: ocultas (prefere-se o gesto de deslizar)
- Posição: centralizadas verticalmente
- Tamanho: alvos de toque de 40 a 48px
- Desativar a seta para a esquerda no início e a seta para a direita no final (sem loop infinito)

**Indicadores de pontos (opcional):**

- Mostram o progresso por meio do controle deslizante
- Cada ponto = uma “página” de produtos
- Posição: abaixo do controle deslizante, centralizado
- Pequenos (pontos de 8 a 12 px)
- Apenas se houver muitos produtos (>12)
- Menos comum em controles deslizantes de produtos (mais comum em carrosséis de destaque)

**Navegação por teclado:**

- Navegue pelas fichas de produtos visíveis usando a tecla Tab
- As setas do teclado rolam o controle deslizante (opcional)
- Gerenciamento do foco durante a rolagem

## Controles deslizantes para dispositivos móveis

**Gestos de toque:**

- Deslize horizontalmente para rolar
- Inércia de rolagem nativa
- Alinhamento automático aos produtos
- Sem botões de seta (o deslizar é intuitivo)

**Ajustes específicos para dispositivos móveis:**

- 2 produtos visíveis (ou 1,5 como sugestão)
- Áreas de toque maiores nos produtos
- Remover recursos ativados apenas ao passar o cursor (Visualização Rápida)
- Animações de rolagem mais rápidas (200-300 ms)

**Desempenho no celular:**

- Carregamento diferido de produtos fora da tela
- Imagens com tamanhos menores
- Limitar o número de produtos carregados inicialmente (8 a 10)
- Carregar mais à medida que a tela é rolada

## Desempenho

**Carregamento diferido (crítico):**

- Carregar inicialmente apenas os produtos visíveis
- Carregar produtos adjacentes (esquerda/direita) sob demanda
- Melhora significativamente o tempo de carregamento da página
- Utiliza a API Intersection Observer

**Otimização de imagens:**

- Imagens responsivas (menores para dispositivos móveis)
- Formato WebP com alternativa
- Carregamento diferido de imagens fora da tela
- Miniaturas otimizadas (<300 KB)

**Limitar o comprimento do slider:**

- Máximo de 20 a 30 produtos por slider
- Link “Ver tudo” para a página completa da categoria
- Melhora o desempenho
- Evita a rolagem infinita

## Lista de verificação

**Recursos essenciais:**

- [ ] 4 a 6 produtos visíveis (computador), 2 (dispositivos móveis)
- [ ] Navegação por setas (computador)
- [ ] Gesto de deslizar (dispositivos móveis)
- [ ] Cartões de produto com imagem, título e preço
- [ ] Contagem responsiva de produtos
- [ ] Transições suaves de rolagem (300-400 ms)
- [ ] Alinhamento automático dos produtos
- [ ] Carregamento diferido de produtos fora da tela
- [ ] Link “Ver tudo” se houver muitos produtos (>20)
- [ ] Desativar setas no início/fim
- [ ] Acessível por teclado (navegação entre produtos com a tecla Tab)
- [ ] Celular: sem setas, apenas deslizar
- [ ] Imagens otimizadas (<300 KB)
- [ ] Espaçamento entre produtos (16-24 px)
- [ ] Rótulos ARIA na navegação (`aria-label="Produtos anteriores"`)
- [ ] `role="region"` no contêiner do slider
- [ ] SEM reprodução automática para os sliders de produtos
