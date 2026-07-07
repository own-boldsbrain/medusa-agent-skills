# Layout da página de detalhes do produto

## Índice

- [Visão geral](#visao-geral)
- [Estrutura do layout](#estrutura-do-layout)
- [Exibição de preços e integração com o Medusa](#exibicao-de-preco)
- [Seleção de variantes (crítico)](#selecao-de-variantes-critico)
- [Disponibilidade de estoque](#disponibilidade-de-estoque)
- [Comportamento ao adicionar ao carrinho](#comportamento-do-botao-adicionar-ao-carrinho)
- [Organização dos detalhes do produto](#organizacao-dos-detalhes-do-produto)
- [Estratégia de produtos relacionados](#estrategia-de-produtos-relacionados)
- [Sinais de confiança e conversão](#sinais-de-confianca-e-conversao)
- [Otimização para dispositivos móveis](#otimizacao-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

A página mais importante para a conversão. É aqui que os clientes tomam suas decisões de compra com base nas informações do produto, imagens, avaliações e sinais de confiança.

### Requisitos principais

- Imagens de produtos de alta qualidade com recurso de zoom
- Exibição clara do preço (com capacidade de lidar com variações de preço entre variantes)
- Seleção de variantes (tamanho, cor, material)
- Indicadores de disponibilidade de estoque
- Botão “Adicionar ao carrinho” em destaque, com feedback adequado
- Detalhes do produto (descrição, especificações)
- Avaliações e notas dos clientes
- Recomendações de produtos relacionados
- Sinais de confiança (frete, devoluções, checkout seguro)
- Otimizado para dispositivos móveis (mais de 60% do tráfego)

### Padrão de roteamento

**CRÍTICO: Sempre use rotas dinâmicas, NUNCA páginas estáticas.**

As páginas de detalhes do produto devem usar rotas dinâmicas que aceitem um parâmetro (handle, slug ou ID):

**Exemplos corretos:**

- Next.js App Router: `app/products/[handle]/page.tsx`
- Next.js Pages Router: `pages/products/[handle].tsx`
- SvelteKit: `routes/products/[handle]/+page.svelte`
- TanStack Start: `routes/products/$handle.tsx`
- Remix: `routes/products.$handle.tsx`

**Exemplos incorretos:**

- ❌ `pages/products/blue-shirt.tsx` (arquivo estático por produto)
- ❌ `pages/products/red-shoes.tsx` (não é escalável)

Busque os dados do produto na rota dinâmica com base no parâmetro handle/ID da URL.

## Estrutura do layout

**Desktop (duas colunas):**

- Esquerda: Imagens do produto (50-60% da largura)
- Direita: Informações do produto, variantes, adicionar ao carrinho (40-50%)
- Abaixo: Detalhes do produto, avaliações, produtos relacionados (largura total)

**Disposição em dispositivos móveis (empilhada):**

- Imagens na parte superior (largura total, com possibilidade de deslizar)
- Informações do produto abaixo (título, preço, avaliação)
- Variantes e botão “Adicionar ao carrinho”
- Menu em acordeão para detalhes do produto
- Seção de avaliações
- Produtos relacionados
- Barra fixa “Adicionar ao carrinho” na parte inferior

**Opção de barra lateral fixa (desktop):**

- A coluna de informações do produto permanece visível durante a rolagem
- Botão “Adicionar ao carrinho” sempre acessível
- Útil para descrições longas de produtos
- Melhora a conversão

## Exibição de preço

### Exibição padrão de preço

**Preço atual:**

- Fonte grande e em negrito (28-36px)
- Símbolo da moeda incluído ($49,99)
- Cor principal ou preto

**Preço promocional:**

- Preço original com linha riscada: ~~$79,99~~ $49,99
- Preço promocional em vermelho ou na cor da marca
- Emblema “Economize X%” próximo
- Exemplo: Economize 37%

**Alterações no preço das variantes:**

- **Quando nenhuma variante estiver selecionada**: exibir “A partir de $X”, onde X é o preço mínimo entre todas as variantes
- **Quando uma variante estiver selecionada**: atualizar o preço dinamicamente para mostrar o preço exato da variante
- Não é necessário recarregar a página
- Mostrar a alteração de preço de forma clara (destacar brevemente ao ocorrer a alteração)
- Exemplo: Produto com variantes com preços de $29,99, $34,99, $39,99 → Mostrar “A partir de $29,99” inicialmente

### Preços no Medusa (CRÍTICO)

**Diferença importante em relação ao Stripe:**

- O Medusa armazena os preços exatamente como estão (por exemplo, 49,99)
- Exibição direta: se a API retornar 49,99, exiba $49,99
- **NÃO divida por 100** (ao contrário do Stripe, que armazena em centavos)
- Exemplo: Medusa 49,99 → Exiba $49,99 (NÃO $0,4999)

**Multimoeda (Medusa):**

- O Medusa oferece suporte a preços para várias regiões
- Exiba o preço na moeda da região do usuário
- Obtenha os preços da região selecionada
- Mostrar código da moeda (usd, eur, etc.)

## Seleção de variantes (crítico)

Este é um desafio complexo específico do comércio eletrônico. As variantes afetam o preço, o estoque e as imagens.

### Complexidade das variantes

**Principais desafios:**

- Vários tipos de variantes (tamanho, cor, material)
- A disponibilidade das variantes varia (alguns tamanhos estão em falta)
- Os preços podem variar de acordo com a variante
- As imagens mudam de acordo com a variante de cor
- Níveis de estoque por variante
- Pode não haver combinações disponíveis (o tamanho M + cor vermelha pode não existir)

**Buscar no backend:**

```typescript
// Get all variants for product
// Change this based on the backend integrated
const product = await fetch(`/products/${id}?fields=*variants`)
// Returns variants with: id, sku, options, calculated_price, inventory_quantity
```

### Padrões de seleção de variantes

**Use o grupo de botões quando:**

- 2 a 8 opções por tipo de variante
- Seleção de tamanho (XS, S, M, L, XL)
- Opções simples de cor (5 a 6 cores)
- Os usuários precisam ver todas as opções de uma só vez

**Benefícios:**

- Opções visíveis (não é preciso clicar para exibir)
- Seleção mais rápida
- Feedback visual claro
- Melhor experiência do usuário (UX)

**Use o menu suspenso quando:**

- Mais de 10 opções por tipo de variante
- Opções de material/estilo com nomes longos
- Layouts com espaço limitado
- É necessária otimização para dispositivos móveis

**Benefícios:**

- Economiza espaço
- Funciona melhor para muitas opções
- Otimizado para dispositivos móveis

**Use amostras visuais quando:**

- Variações de cor ou padrão
- Materiais com diferenças visuais
- O aspecto visual é fundamental para a decisão
- Moda, decoração de interiores, produtos personalizáveis

**Implementação:**

- Amostras circulares/quadradas (40-48px)
- Borda ao selecionar
- Exibir a imagem do produto nessa cor quando selecionada
- Nome da cor ao passar o mouse
- Desativar visualmente as cores indisponíveis

### Fluxo de seleção de variantes

**Sequência crítica:**

1. O usuário seleciona o primeiro tipo de variante (por exemplo, Cor: Azul)
2. **Atualizar as opções disponíveis** para outros tipos de variantes
3. Mostrar apenas as opções de tamanho disponíveis para a cor azul
4. Desativar/desativar combinações indisponíveis
5. Atualizar o preço caso o preço da variante seja diferente
6. Atualizar a imagem principal do produto para mostrar a variante selecionada
7. Atualizar a disponibilidade de estoque
8. Ativar/desativar o botão “Adicionar ao carrinho” com base na disponibilidade

**Exemplo: Duas variantes (Cor + Tamanho)**

```typescript
// When color selected
// Change this based on the backend integrated
onColorSelect(color) {
  // Find selected variant
  const selectededVariant = product.variants.find((variant) => variant.options?.every(
    (optionValue) => optionValue.id === selectedOptions[optionValue.option_id!]
  ))

  // Check if size is selected and update price
  if (selectededVariant) {
    const variant = findVariant(color, selectedSize)
    updatePrice(variant.price)
    updateStock(variant.inventory_quantity)
  }
}
```

### Validação e tratamento de erros

**Impedir a adição sem seleção:**

- Desativar o botão “Adicionar ao carrinho” até que todas as variantes obrigatórias sejam selecionadas
- Ou: Exibir a mensagem de erro “Selecione um tamanho”
- Destacar a seleção ausente (borda vermelha ao redor das opções)
- Navegar até a seleção de variantes em caso de erro

**Tratamento de variantes fora de estoque:**

- Desativar visualmente as opções indisponíveis
- Texto “Fora de estoque” ao passar o mouse
- Não permitir a seleção de variantes fora de estoque
- Sugerir variantes alternativas, se disponíveis

**Tratamento de variante não encontrada:**

- Quando a combinação não existir (Tamanho M + Cor Vermelha)
- Desativar a segunda opção quando a primeira for selecionada
- Mostrar apenas combinações válidas
- Ou: Mostrar “Esta combinação não está disponível”

## Disponibilidade de estoque

**Padrões de exibição:**

**Em estoque:**

- Indicador verde (✓ ou ponto)
- “Em estoque” ou “Disponível”
- Quantidade, se estiver baixa: “Restam apenas 3”
- Incentiva a urgência sem ser insistente

**Esgotado:**

- Indicador vermelho (✗ ou ponto)
- Mensagem “Esgotado”
- Desativar o botão “Adicionar ao carrinho” (desativado)
- Oferecer a opção “Notificar-me quando estiver disponível”
- Captura de e-mail para notificações de reposição de estoque (se compatível com o backend)

**Aviso de estoque baixo:**

- “Restam apenas X em estoque”
- Mostra a escassez (aumenta a urgência)
- Normalmente exibido quando há <= 5 itens
- Cor laranja/amarela

**Pré-venda:**

- Status “Faça a pré-venda agora”
- Data prevista de disponibilidade: “Envio em [Data]”
- Texto diferente no botão: “Pré-venda” em vez de “Adicionar ao carrinho”
- Cobrança agora ou mais tarde (especificar)

**Integração com o backend:**

```typescript
// Fetch stock for selected variant
const stock = selectedVariant.inventory_quantity

if (stock === 0) {
  showOutOfStock()
} else if (stock <= 5) {
  showLowStock(stock) // "Only 3 left"
} else {
  showInStock()
}
```

## Comportamento do botão “Adicionar ao carrinho”

**Estados do botão:**

- Padrão: Ativado (após a seleção da variante)
- Ao passar o mouse: Leve mudança de cor ou escala
- Carregando: Indicador giratório dentro do botão (durante a chamada à API)
- Sucesso: Marca de seleção exibida brevemente, depois reverte
- Desativado: Desativado (sem variante ou fora de estoque)

**Comportamento ao clicar (Crítico):**

1. Mostrar estado de carregamento (desativar o botão, exibir o indicador de carregamento)
2. Chamar a API para adicionar o item ao carrinho (back-end)
3. **IU otimista**: Atualizar a quantidade no carrinho imediatamente (antes da resposta da API)
4. Mostrar feedback de sucesso (notificação, marca de seleção ou pop-up do carrinho)
5. Atualizar a contagem do carrinho no cabeçalho da barra de navegação
6. **NÃO sair da página** — permanecer na página do produto
7. Tratar erros: restaurar a contagem caso a API falhe

**Opções de feedback de sucesso:**

- Notificação pop-up: “Adicionado ao carrinho” (canto superior direito)
- Pop-up do carrinho: exibir mini-carrinho com os itens (consulte cart-popup.md)
- Marca de seleção no botão por um breve instante, depois reverter
- Todas as três opções combinadas (marca de seleção + notificação pop-up ou janela pop-up do carrinho)

**Tratamento de erros:**

```typescript
async function addToCart(variantId, quantity) {
  try {
    // Optimistic update
    updateCartCountUI(+quantity)

    // API call
    // Change this based on the backend integrated
    await fetch(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity })
    })

    // Success feedback
    showToast('Added to cart')
    showCartPopup() // Optional
  } catch (error) {
    // Revert optimistic update
    updateCartCountUI(-quantity)

    // Show error
    if (error.message === 'OUT_OF_STOCK') {
      showError('Sorry, this item is now out of stock')
      updateStockStatus('out_of_stock')
    } else {
      showError('Failed to add to cart. Please try again.')
    }
  }
}
```

**Botão “Comprar agora” (opcional):**

- Ignora o carrinho e leva diretamente para o checkout
- Útil para: itens de alto valor, lojas com um único item, clientes decididos
- Botão secundário abaixo de “Adicionar ao carrinho”
- Texto: “Comprar agora” ou “Compre agora”
- Adiciona ao carrinho e redireciona para o checkout em uma única ação

## Organização dos detalhes do produto

### Decisão: Abas x Acordeão

**Use abas (desktop) quando:**

- Houver de 3 a 5 seções distintas
- Cada seção tiver conteúdo substancial
- Os usuários quiserem comparar as seções
- O desktop tiver espaço na tela
- Exemplos: Descrição, Especificações, Frete, Avaliações

**Usar sempre o acordeão (dispositivos móveis):**

- Economiza espaço vertical
- Os usuários expandem o que precisam
- Padrão padrão para dispositivos móveis
- Recolhe após a leitura

**Abordagem híbrida (recomendada):**

- Abas no desktop (navegação horizontal)
- Acordeão em dispositivos móveis (expansão vertical)
- Mesmo conteúdo, apresentação diferente
- O melhor dos dois mundos

### Seções comuns

**Descrição:**

- Visão geral do produto (2 a 4 parágrafos)
- Principais recursos (lista com marcadores)
- Casos de uso
- Materiais e acabamento

**Especificações:**

- Detalhes técnicos (formato de tabela)
- Dimensões, peso, materiais
- Instruções de cuidados
- Informações sobre compatibilidade

**Envio e devoluções:**

- Opções e custos de envio
- Prazos de entrega
- Política de devolução (30 dias, 60 dias)
- Processo de devolução
- Link para a página completa da política

**Avaliações:**

- Incorporadas em aba/acordeão
- Ou: seção separada abaixo
- Filtro por classificação, ordenação por data
- Formulário para envio de avaliações

## Estratégia de produtos relacionados

**Tipos de recomendações:**

**“Você também pode gostar” (produtos semelhantes):**

- Mesma categoria, faixa de preço semelhante
- Algoritmo: correspondência de categoria + faixa de preço
- Objetivo: Mostrar alternativas caso o usuário esteja em dúvida sobre o produto atual

**“Frequentemente comprados juntos” (Complementares):**

- Produtos comumente comprados juntos
- Algoritmo: análise do histórico de pedidos
- Objetivo: Aumentar o valor médio do pedido
- Exemplo: Celular + Capa + Protetor de tela
- Mostrar desconto de pacote, se disponível

**“Vistos recentemente” (histórico de navegação):**

- Histórico de navegação do usuário (sessão ou conta cadastrada)
- Ajuda os usuários a retornarem aos produtos de que gostaram
- Objetivo: reduzir a indecisão

**“Os clientes também viram”:**

- Produtos visualizados por outras pessoas que viram este
- Algoritmo: padrões de visualização conjunta
- Objetivo: Descoberta e alternativas

### Padrão de exibição

**Slider de produtos:**

- 4 a 6 produtos visíveis (desktop)
- 2 a 3 visíveis (dispositivos móveis)
- Rolagem horizontal (deslizar no celular)
- Cartões de produto: imagem, título, preço, avaliação
- Opcional: botão rápido “Adicionar ao carrinho” ao passar o mouse

**Posicionamento:**

- Abaixo dos detalhes e avaliações do produto
- Acima do rodapé
- Seção em largura total
- Título claro para cada tipo

**Integração com o backend:**

```typescript
// Fetch recommendations
// Change this based on the backend integrated
const recommendations = await fetch(`/products/${id}/recommendations`)
// Returns: similar, bought_together, recently_viewed
```

## Sinais de confiança e conversão

**Sinais de confiança essenciais:**

**Próximo ao botão “Adicionar ao carrinho”:**

- Emblema de frete grátis (se aplicável)
- Ícone e texto de devoluções gratuitas
- Ícone de checkout seguro
- Garantia de devolução do dinheiro
- Informações sobre garantia (se aplicável)

**Abaixo do título do produto:**

- Avaliação dos clientes e número de avaliações (4,8 ★ 324 avaliações)
- Link para a seção de avaliações
- Emblema “Mais vendido” ou “Mais bem avaliado”

**Formas de pagamento:**

- Ícones das formas de pagamento aceitas (Visa, Mastercard, PayPal, Apple Pay)
- Ícones pequenos (40px)
- Abaixo de “Adicionar ao carrinho” ou no rodapé
- Mostra as opções de pagamento disponíveis

**Para marcas novas/desconhecidas:**

- Depoimentos de clientes
- “Junte-se a mais de 10.000 clientes satisfeitos”
- Selos de segurança (se forem legítimos — não falsifique)
- Prova social (fotos do Instagram, conteúdo de usuários)
- Informações de contato claras

**Para produtos de alto valor:**

- Especificações detalhadas
- Fotografia profissional
- Demonstrações em vídeo
- Detalhes da garantia exibidos com destaque
- Informações de contato do atendimento ao cliente visíveis

## Otimização para dispositivos móveis

**Padrões essenciais para dispositivos móveis:**

**Barra fixa “Adicionar ao carrinho”:**

- Fixada na parte inferior da tela
- Sempre acessível (não é necessário rolar a tela)
- Exibe: preço + botão “Adicionar ao carrinho”
- Aparece após a rolagem para além da dobra
- Taxas de conversão mais altas

**Galeria de imagens:**

- Carrossel deslizável em largura total
- Aperte para ampliar
- Indicadores de pontos (1/5, 2/5)
- Toque para abrir a visualização em tela cheia

**Seleção de variantes:**

- Áreas de toque grandes (44-48px)
- Amostras visuais mais fáceis de usar do que menus suspensos
- Estado de seleção claro
- Mensagens de erro visíveis

**Acordeão para detalhes:**

- Descrição, especificações e frete apresentados em formato de acordeão
- Inicia recolhido (para economizar espaço)
- O usuário expande o que precisa
- Indicadores claros de expansão/colapso

**Seção de avaliações:**

- Expansível (começa com 2 a 3 avaliações)
- Botão “Mostrar mais”
- Filtro por classificação
- Gráfico de distribuição de classificação por estrelas

## Lista de verificação

**Recursos essenciais da página de detalhes do produto:**

- [ ] Imagens do produto em alta qualidade com zoom
- [ ] Preço exibido corretamente (Medusa: use o valor tal como está, sem dividir)
- [ ] O preço exibe “A partir de $X” quando nenhuma variante está selecionada (X = preço mínimo da variante)
- [ ] É necessário selecionar uma variante antes de adicionar ao carrinho
- [ ] Atualizações ao selecionar uma variante: preço, estoque, imagem
- [ ] Desativar opções de variantes indisponíveis (desativar com cinza)
- [ ] Indicador de disponibilidade de estoque (em estoque, estoque baixo, esgotado)
- [ ] “Restam apenas X” exibido quando o estoque estiver baixo (<=5)
- [ ] Botão “Adicionar ao carrinho” desativado até que uma variante seja selecionada
- [ ] Atualização otimista da interface do usuário (a contagem do carrinho é atualizada imediatamente)
- [ ] Confirmação de sucesso (notificação, janela pop-up do carrinho ou marca de seleção)
- [ ] Permanecer na página do produto após a adição (não sair da página)
- [ ] Tratamento de erros (fora de estoque, falha na API)
- [ ] Descrição e especificações do produto
- [ ] Avaliações e notas dos clientes
- [ ] Recomendações de produtos relacionados (semelhantes, comprados juntos)
- [ ] Sinais de confiança (frete grátis, devoluções, checkout seguro)
- [ ] Ícones de formas de pagamento exibidos
- [ ] Navegação por trilha de navegação
- [ ] Celular: Galeria de imagens com rolagem por deslize
- [ ] Celular: Acordeão para detalhes do produto
- [ ] Celular: Barra fixa “Adicionar ao carrinho” (opcional, mas eficaz)
- [ ] Abas no desktop, acordeão no celular (híbrido)
- [ ] Carregamento rápido (<2 s, otimizar imagens)
- [ ] Acessível por teclado (navegar pelas opções com a tecla Tab, pressionar Enter para adicionar)
- [ ] Rótulos ARIA na seleção de variantes (role="group", aria-label)
