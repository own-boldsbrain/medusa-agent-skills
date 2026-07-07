# Responsividade móvel para lojas virtuais

## Índice

- [Visão geral](#visao-geral)
- [Padrões de comércio eletrônico móvel](#padroes-de-comercio-eletronico-para-dispositivos-moveis)
- [Interações otimizadas para tela sensível ao toque](#interacoes-otimizadas-para-toque)
- [Desempenho móvel](#desempenho-em-dispositivos-moveis)
- [Margens da área segura (iOS)](#margens-da-area-segura-ios)
- [Erros comuns em dispositivos móveis](#erros-comuns-em-dispositivos-moveis)

## Visão geral

Mais de 60% do tráfego de comércio eletrônico vem de dispositivos móveis. O design “mobile-first” é essencial para a conversão.

### Requisitos principais

- CSS “mobile-first” (consultas de mídia com min-width)
- Áreas de toque com tamanho mínimo de 44x44px
- Cabeçalho fixo com acesso ao carrinho
- Campos de formulário grandes (altura mínima de 48px)
- Imagens otimizadas para dispositivos móveis
- Carregamento rápido (LCP < 2,5 s)

**Conhecimentos prévios**: Os agentes de IA já conhecem os princípios de design “mobile-first”, pontos de quebra e CSS responsivo. Este guia se concentra em padrões móveis específicos para comércio eletrônico.

## Padrões de comércio eletrônico para dispositivos móveis

### Elementos fixos (fundamentais para a conversão)

**Acesso ao carrinho sempre visível:**

- Cabeçalho fixo com ícone do carrinho (canto superior direito)
- Ou: Navegação inferior fixa com o carrinho
- Nunca oculte o carrinho na barra de menu tipo “hambúrguer”
- Exibe o selo de quantidade, com atualizações em tempo real

**Barra fixa “Adicionar ao carrinho” (páginas de produtos):**

- Fixada na parte inferior da tela
- Exibe: Preço + botão “Adicionar ao carrinho”
- Aparece após rolar a tela para além da dobra
- Sempre acessível sem necessidade de rolagem
- **CRÍTICO: É obrigatório usar `env(safe-area-inset-bottom)` para dispositivos iOS** (consulte a seção “Safe Area Insets”)
- Taxas de conversão significativamente mais altas

### Padrões de navegação em dispositivos móveis

**Navegação inferior (padrão opcional):**

- Considere para lojas com grande volume de tráfego móvel (>70% de tráfego móvel)
- 4 a 5 ações principais: Página inicial, Categorias, Carrinho, Conta, Pesquisa
- Fixo na parte inferior (acesso mais fácil com o polegar)
- Ícones + rótulos para maior clareza

**Quando usar:**

- Marcas com foco em dispositivos móveis (moda, beleza)
- Público mais jovem (18 a 34 anos)
- Quando se busca uma experiência semelhante à de um aplicativo

**Quando NÃO usar:**

- Tráfego predominantemente em computadores
- Necessidades complexas de navegação (>5 itens)
- Lojas B2B (focadas em computadores)

### Navegação de produtos em dispositivos móveis

**Galerias de imagens:**

- Carrossel deslizável em largura total
- Aperte para ampliar
- Toque para abrir a visualização em tela cheia
- Indicadores de pontos (1/5, 2/5)

**Gaveta de filtros:**

- Botão “Filtros” com contador (por exemplo, “Filtros (3)”)
- Gaveta deslizante (tela inteira ou 80% da largura)
- Seções em acordeão para as categorias de filtros
- Botão “Aplicar” na parte inferior (filtragem em lote)
- Opção “Limpar tudo” na parte superior

**Por que usar a filtragem em lote no celular:**

- Evita múltiplas atualizações da página em conexões lentas
- O usuário ajusta vários filtros antes de aplicar
- Experiência do usuário (UX) menos disruptiva no celular

### Otimização do checkout no celular

**Prioridade para carteiras digitais (CRÍTICO para a conversão no celular):**

- Botões do Apple Pay / Google Pay em destaque na parte superior (se houver suporte no back-end do e-commerce)
- Pode aumentar a conversão no checkout em dispositivos móveis em 20 a 40%
- Pagamento com um clique e endereços de entrega pré-preenchidos (se houver suporte no back-end do e-commerce)
- Considere definir a carteira digital como padrão em dispositivos móveis

**Decisão: Posicionamento do resumo do pedido**

- Recolhível na parte superior (recomendado): economiza espaço na tela para o formulário, expansível para revisão
- Fixo na parte inferior: sempre visível, mas ocupa espaço do formulário
- Use a opção recolhível em dispositivos móveis para priorizar o preenchimento do formulário

**Otimizações de formulários:**

- Layout de coluna única (nunca use várias colunas em dispositivos móveis)
- Altura mínima de 44-48px para campos de entrada
- Tipos de teclado adequados (`inputMode="email"`, `"numeric"`, `"tel"`)
- Atributos de autocompletar para preenchimento automático (`autocomplete="email"`, `"name"`, `"address-line1"`)
- Priorize o layout de página única em vez de etapas múltiplas (menos atrito em dispositivos móveis)

## Interações otimizadas para toque

**Áreas de toque padrão:** mínimo de 44x44px para todos os elementos interativos. Preste atenção especial a:

- Caixas de seleção de filtro nas listas de produtos
- Botões de quantidade +/- nas páginas de produtos
- Pequenos botões de ação nos cartões de produtos
- Botões de fechamento de modais

**Gestos de deslizar para comércio eletrônico:**

- Galerias de imagens de produtos (fundamental — os usuários esperam imagens que possam ser deslizadas)
- Sliders de produtos relacionados
- Carrosséis de categorias

**Otimização de entrada em dispositivos móveis:**

- Tamanho mínimo de fonte de 16px para campos de entrada (evita o zoom automático do iOS)
- Atributos `inputMode` adequados: `"email"`, `"numeric"`, `"tel"`
- Atributos de preenchimento automático: `autocomplete="email"`, `"name"`, `"address-line1"`

## Desempenho em dispositivos móveis

**Prioridades de desempenho no comércio eletrônico:**

1. **Imagens de produtos** (maior impacto): otimizar para dispositivos móveis (<500 KB), carregamento diferido abaixo da dobra da tela, imagens responsivas com tamanhos adequados
2. **Interface do usuário otimizada**: a contagem do carrinho é atualizada imediatamente, com feedback instantâneo ao adicionar ao carrinho
3. **Telas esqueléticas**: exiba marcadores de carregamento para grades de produtos, em vez de páginas em branco

**Problemas críticos de desempenho em dispositivos móveis:**

- Imagens de produtos não otimizadas (>1 MB) – problema mais comum
- Carregamento de todo o catálogo de produtos de uma só vez – use paginação ou rolagem infinita
- Scripts de análise pesados na página de finalização da compra — adiar para após a compra

**Meta**: LCP < 2,5 s, imagens otimizadas para dispositivos móveis, renderização do lado do servidor para páginas de produtos

## Margens da área segura (iOS)

Use `env(safe-area-inset-*)` para lidar com o entalhe da tela e os cantos arredondados do iOS em:

- Cabeçalhos fixos (margem superior)
- Navegação fixa na parte inferior ou barras de “Adicionar ao carrinho” (recuo inferior)
- Modais em tela cheia

**Crítico para comércio eletrônico**: As barras inferiores de “Adicionar ao carrinho” serão cortadas pelo indicador de tela inicial do iOS sem o recuo inferior (~34px). Teste em dispositivos iOS reais com entalhes.

## Erros comuns em dispositivos móveis

**Problemas específicos do comércio eletrônico em dispositivos móveis:**

1. **Ocultar o carrinho no menu deslizante** — Ícone do carrinho oculto no menu “hambúrguer”. Mantenha o carrinho sempre visível no cabeçalho (canto superior direito).

2. **Ausência de acesso fixo ao carrinho** — O carrinho sai da tela nas páginas de produtos. Use um cabeçalho fixo ou uma barra fixa na parte inferior com o botão “Adicionar ao carrinho”.

3. **Imagens com tamanho de desktop** — Exibição de imagens de produtos com mais de 2 MB em dispositivos móveis. Use imagens responsivas otimizadas para dispositivos móveis (<500 KB).

4. **Experiência ruim nos formulários** — Campos de entrada pequenos, teclados inadequados, ausência de preenchimento automático. Use campos de entrada de 48 px, `inputMode` adequado e atributos de preenchimento automático.

5. **Interações apenas ao passar o mouse** — A visualização rápida e a lista de desejos só funcionam ao passar o mouse. Adicione manipuladores de toque para exibir o conteúdo ao tocar.

6. **Ignorar margens da área segura** — As barras inferiores de “Adicionar ao carrinho” são cortadas pelo indicador de tela inicial do iOS. Use `env(safe-area-inset-bottom)` para elementos fixos na parte inferior.

7. **Ausência de opções de carteira digital** — Falta o Apple Pay/Google Pay no checkout móvel. Os usuários móveis esperam opções de checkout com um único toque.

## Lista de verificação para dispositivos móveis

**Otimizações essenciais para dispositivos móveis:**

- [ ] CSS com prioridade para dispositivos móveis (consultas de mídia com min-width)
- [ ] Áreas de toque com tamanho mínimo de 44x44px em todo o site
- [ ] Espaçamento adequado entre elementos interativos (8-16px)
- [ ] Cabeçalho fixo com ícone do carrinho (sempre visível)
- [ ] Ou: Barra fixa na parte inferior com o botão “Adicionar ao carrinho” nas páginas de produtos
- [ ] Campos de formulário grandes (altura mínima de 48px)
- [ ] Tipos de campo apropriados (`inputMode="email"`, `"numeric"`, `"tel"`)
- [ ] Galerias de imagens com navegação por deslize nas páginas de produtos
- [ ] Menu de filtros com aplicação em lote nas listas de produtos
- [ ] Carteiras digitais em destaque na finalização da compra (Apple Pay, Google Pay)
- [ ] Resumo do pedido recolhível na página de finalização da compra
- [ ] Imagens otimizadas para dispositivos móveis (<500 KB)
- [ ] Carregamento diferido para conteúdo abaixo da área visível
- [ ] Margens de segurança para entalhes do iOS (elementos fixos)
- [ ] Tamanho mínimo de fonte de 16 px (evita o zoom automático do iOS)
- [ ] Teste em dispositivos móveis reais (não apenas no Chrome DevTools)
- [ ] Indicadores Core Web Vitals dentro das metas (LCP < 2,5 s, CLS < 0,1, INP < 200 ms)
