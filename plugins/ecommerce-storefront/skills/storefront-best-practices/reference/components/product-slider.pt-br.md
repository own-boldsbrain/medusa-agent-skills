# Componente de Controle Deslizante de Produtos

## Conteúdo

- [Componente Slider de Produto](#product-slider-component)
  - [Conteúdos](#conteúdos)
  - [Visão Geral](#visao-geral)
  - [Quando Usar Sliders de Produtos](#quando-usar-sliders-de-produtos)
  - [Padrões do Slider](#slider-patterns)
  - [Exibição do Produto](#exibicao-do-produto)
  - [Controles de Navegação](#controles-de-navegacao)
  - [Móveis Sliders](#móveis-sliders)
  - [Desempenho](#performance)
  - [Checklist](#checklist)

## Visão Geral

O slider de produtos (carrossel) exibe vários produtos horizontalmente com navegação para percorrê-los. Usado para produtos relacionados, recentemente visualizados, mais vendidos e produtos em destaque.

**Conhecimento prévio**: Os agentes de IA sabem como criar carrosséis com navegação. Esse se concentra em padrões de carregador de produtos de comércio eletrônico.

**Requisitos principais:**

- Horizontal scrolling of product cards
- Navegação por setas (anterior/próximo)
- Indicadores de ponto opcionais

### Indicadores de Ponto Opcionais

Em alguns casos, é possível usar indicadores de ponto opcionais para indicar que um caractere ou grupo de caracteres é opcional. Isso é útil quando você precisa representar um caractere que pode ou não estar presente em uma string.

#### Exemplo

```regex
^ab(c)?d$
```

Nesse exemplo, o caractere `c` é opcional, pois está entre parênteses e precedido por um `?`. Isso significa que a string pode ou não conter o caractere `c`.

#### Como funciona

O operador `?` após o parêntese indica que o grupo entre parênteses é opcional. Isso significa que a string pode ou não conter o caractere ou grupo de caracteres dentro do parêntese.

#### Exemplo de uso

Suponha que você esteja criando um padrão para validar um número de telefone. O número de telefone pode ou não conter um código de área. Você pode usar indicadores de ponto opcionais para representar isso:

```regex
^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$
```

Nesse exemplo, o código de área (representado por `[0-9]{3}`) é opcional, pois está entre parênteses e precedido por um `?`. Isso significa que a string pode ou não conter o código de área.

### Referências

- [Documentação do Regex em Python](https://docs.python.org/3/library/re.html)
- [Documentação do Regex em JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions)

- Móvel: Suporte ao gesto de rolagem
- Contagem de produtos responsiva (4-6 visíveis em desktop, 2-3 em mobile)
- Carregamento preguiçoso para produtos fora da tela

## When to Use Product Sliders

**Use para:**

- Produtos relacionados (página do produto)
- Recentemente visualizado (página do produto, página inicial)
- Você também pode gostar de:

# Você também pode gostar de

### Sugestões baseadas em compras semelhantes

- [Clique aqui para ver as sugestões](link para as sugestões)
- [Clique aqui para ver as recomendações](link para as recomendações)

### Sugestões baseadas em categorias

- [Clique aqui para ver as sugestões](link para as sugestões)
- [Clique aqui para ver as recomendações](link para as recomendações)

### Sugestões baseadas em marcas

- [Clique aqui para ver as sugestões](link para as sugestões)
- [Clique aqui para ver as recomendações](link para as recomendações)
- Melhores Vendedores / Produtos Destaque (página inicial)
- "Frequentemente Comprados Juntos" (página do produto)
- Chegadas novas (página inicial)
- Categorias em destaque (página inicial)

**Não use para:**

- Imagens principais do produto (use a galeria em vez disso)
- Conteúdo crítico (não todos os usuários rodam/roçam)
- Fluxo de finalização da compra (manter linear)
- Navegação primária (utilize grade para descoberta)

## Padrões de Slider

**Rolagem contínua:**

- Mostra 4-6 produtos de uma vez (desktop)
- Role para a esquerda/direita 1-2 produtos por vez
- Transição animada suave (300-400ms)
- Padrão mais comum

**Bússola de infinito (opcional):**

- Envolve para o início após o fim
- Bom para conjuntos de produtos pequenos (<10 itens)
- Cria uma sensação de navegação contínua
- Não necessário para conjuntos grandes

**Alinhamento de snap:**

- Produtos se alinham à grade após rolagem.
- Impede a visibilidade parcial do produto
- Ajuste visual melhorado
- Melhora a experiência de navegação

**Reprodução automática (NÃO recomendado para produtos):**

- Rolagem automática sem ação do usuário
- Má experiência do usuário com sliders de produtos (usuários perdem o controle)
- Use apenas para banners promocionais/imagens de destaque
- Se estiver usando: Pausa ao passar o mouse, velocidade lenta (5-7s)

## Exibição de Produto

**Cartões de produtos em carrosséis:**

- Mesmas cartas como nas grades de produtos (ver product-card.md)
- Simplificado no mobile (menos detalhes, imagens menores)
- Image, title, price minimum
- Opcional: Avaliação, "Adicionar ao Carrinho" (somente desktop)
- Espaçamento adequado entre os cartões (16-24px)

**Exibição responsiva:**

- Large desktop (>1440px): 5-6 products visible
- Desktop (1024-1440px): 4-5 produtos
- Tablet (768-1024px): 3-4 produtos
- Móvel (<768px): 2 produtos (às vezes 1,5 para dica de rolagem)

**Scroll hint on mobile:**

- Mostre 1.5 produtos (visibilidade parcial do próximo)
- Indica mais conteúdo para deslizar
- Melhora a descoberta
- Melhor do que mostrar exatamente 2 produtos

## Controles de Navegação

**Arrow buttons:**

- Setas esquerda/direita fora do slider
- Área de trabalho: Sempre visível ou mostrar ao passar o mouse
- Mobile: Oculto (gesto de deslizar preferido)
- Posição: Centralizado verticalmente
- Tamanho: alvos de toque de 40-48px
- Desativar a seta esquerda no início, seta direita no final (sem loop infinito)

**Indicadores de ponto (opcional):**

- Mostrar progresso através de controle deslizante
- Cada ponto = uma "página" de produtos
- Posição: Abaixo do slider, centralizado.
- Pequeno (8-12px pontos)
- Somente se muitos produtos (>12)
- Menos comum para sliders de produtos (mais para carrosséis de destaque)

**Navegação pelo teclado:**

- Navegue através dos cartões de produto visíveis
- Teclas de seta rolam o controle deslizante (opcional)
- Gerenciamento de foco no rolar

## Sliders Móveis

**Gestos de toque:**

- Deslize horizontal para rolar
- Roda nativa de momentum de rolagem
- Ajustar ao alinhamento do produto
- Botões de seta (o deslize é intuitivo)

**Ajustes específicos para dispositivos móveis:**

- 2 produtos visíveis (ou 1,5 para dica)
- Alvos de toque maiores em produtos
- Remova recursos exclusivos para *hover* (Visualização Rápida)
- Animações de rolagem mais rápidas (200-300ms)

**Desempenho em dispositivos móveis:**

- Carregamento preguiçoso de produtos fora da tela
- Tamanhos de imagem menores
- Limite de produtos iniciais carregados (8-10)
- Carregar mais ao rolar

## Desempenho

**Carregamento preguiçoso (crítico):**

- Somente carregue os produtos visíveis inicialmente
- Carregue produtos adjacentes (esquerda/direita) sob demanda
- Melhora significativamente o tempo de carregamento da página
- Use Intersection Observer API

**Otimização de imagens:**

- Imagens responsivas (menores para dispositivos móveis)
- Formato WebP com fallback
- Imagens com carregamento preguiçoso fora da tela
- Miniaturas otimizadas (<300KB)

**Limitar comprimento do controle deslizante:**

- Máx. 20-30 produtos por slider
- Link "Ver Tudo" para a página completa da categoria
- Melhora o desempenho
- Evita rolagem infinita

## Checklist

**Recursos essenciais:**

- [ ] 4-6 produtos visíveis (desktop), 2 (mobile)
- [ ] Navegação por setas (desktop)
- [ ] Movimento de deslizar (mobile)
- [ ] Cartões de produtos com imagem, título, preço
- [ ] Contagem de produtos responsiva
- [ ] Transições de rolagem suave (300-400ms)
- [ ] Alinhar ao produto
- [ ] Carregar produtos fora da tela sob demanda
- [ ] link "Ver Todos" se muitos produtos (>20)
- [ ] Desativar setas no início/fim
- [ ] Acessível por teclado (Navegue pelos produtos com Tab)
- [ ] Mobile: Sem setas, apenas deslizar
- [ ] Imagens otimizadas (<300KB)
- [ ] Espaçamento entre produtos (16-24px)
- [ ] Rótulos ARIA na navegação (`aria-label="Previous products"`)
- [ ] `role="region"` no contêiner do controle deslizante
- [ ] Sem reprodução automática para os carrosséis de produtos
