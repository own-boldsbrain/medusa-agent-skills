# Componente de Cartão de Produto

## Conteúdos

- [Overview](#overview)
- [Price Display (Ecommerce-Specific)](#price-display-ecommerce-specific)
- [Botões de Ação e Manipulação de Variantes](#botoes-de-acao-e-manipulacao-de-variantes)
- [Badges and Labels](#badges-and-labels)
- [Considerações sobre Mobile](#consideracoes-sobre-mobile)
- [Ecommerce Checklist](#ecommerce-checklist)

## Visão geral

Os cartões de produto exibem produtos em grades (listagens de produtos, resultados de busca, produtos relacionados). Considerações importantes para ecommerce: preço claro, adição rápida ao carrinho e indicadores de estoque.

**Assumed knowledge**: AI agents know how to build cards with images, titles, and buttons. This guide focuses on ecommerce-specific patterns.

### Principais Requisitos de Ecommerce

- Preços claros e destacados (incluindo preços promocionais)
- Variant handling for add-to-cart
- Stock status indicators
- Venda/Novo/Fora de Estoque badges
- Grade responsiva (1 col móvel, 2-3 tablet, 3-4 desktop)
- Fast image loading (lazy load, optimized)

## Exibição de Preços (Específico para E-commerce)

### Regular vs Sale Pricing

**Exibição do preço promocional:**

- Sale price: Larger, bold, red or accent color
- Original price: Smaller, struck through (~~$79.99~~), gray
- Posicione o preço de venda antes do preço original
- Opcional: Mostrar selo de porcentagem de desconto (-20%)

**Formate de forma consistente:**

- Sempre inclua o símbolo de moeda ($49.99)
- Consistent decimals ($49.99 not $49.9 or $50)
- For Medusa: Display prices as-is (no divide by 100)

### Price Range (Multiple Variants)

**Quando variantes têm preços diferentes:**

- Mostrar "A partir de R$49" ou "R$49 - R$79"
- Deixa claro que o preço varia conforme a seleção
- Don't show range if all variants same price

## Botões de Ação e Manipulação de Variantes

### Adicionar ao Carrinho com Variantes (CRÍTICO)

**Desafio principal**: Produtos com variantes exigem a seleção de variantes antes de adicionar ao carrinho.

**Estratégias de manejo:**

1. **Adicionar a primeira variante por padrão** - Clique adiciona `product.variants[0]`. Rápido para produtos simples (1-2 variantes).
2. **Redirect to product page** - Navigate to detail page for variant selection. Best for complex products (size + color + material).
3. **Quick View modal** - Seletor de variante no modal. Bom meio-termo (somente desktop).

**Decisão:**

- Produtos simples (1-2 variantes): Adicionar a primeira variante
- Moda/vestuário com tamanhos: Requer seleção de tamanho (redirecionamento ou Visualização Rápida)
- Produtos complexos (3+ tipos de variantes): Redirecione para a página do produto

**Comportamento do botão:**

- Carregando estado ("Adicionando..."), desabilitar durante o carregamento
- Atualização otimista da IU (contagem do carrinho imediatamente)
- Feedback de sucesso (toast, popup do carrinho ou marca de verificação)
- **Não navegue embora** (fique na página de listagem)
- Trate erros (falta de estoque, falha na API)

**Botão de lista de desejos (opcional)**: Ícone de coração, no canto superior direito sobre a imagem. Vazio quando não salvo, preenchido (vermelho) quando salvo. Consulte wishlist.md para mais detalhes.

## Iniciantes e Intermediários

### Badges e Labels

#### Introdução

Os badges e labels são elementos visuais importantes em uma interface de usuário, pois eles fornecem informações rápidas e claras ao usuário sobre o estado atual de um item ou processo.

#### Exemplos de Uso

***Badges**:
    *Indicar o número de notificações não lidas.*   Mostrar o progresso de um processo em andamento.
    *Identificar o status de um item (por exemplo, "novamente disponível").***Labels**:
    *Rotular itens ou categorias de forma clara e concisa.*   Identificar o tipo de conteúdo (por exemplo, "vídeo", "artigo", etc.).
    *Fornecer informações adicionais sobre um item (por exemplo, "prioridade alta").

#### Dicas de Design*   Use cores consistentes para badges e labels para evitar confusão

- Certifique-se de que os badges e labels sejam legíveis mesmo em tamanhos pequenos.

- Evite usar badges e labels excessivamente, pois isso pode causar distração e confusão.

### Exemplo de Código

```html
<!-- Exemplo de badge -->
<span class="badge">2</span>

<!-- Exemplo de label -->
<span class="label">Prioridade Alta</span>
```

### Recursos Adicionais

- [Material Design: Badges](https://material.io/components/badges)
- [Material Design: Labels](https://material.io/components/labels)

**Prioridade da insígnia** (exiba no máximo 1-2 por cartão):

1. **Esgotado** (mais alto) - Sobreposição cinza/preta na imagem, desativa a opção de adicionar ao carrinho
2. **Promoção/Desconto** - "Promoção" ou "-20%", vermelho/accent, canto superior-esquerdo
3. **Novo** - "Novo" para produtos recentes, azul/verde, canto superior esquerdo
4. **Estoque Baixo** (opcional) - "Só 3 sobraram", laranja, cria urgência

**Exibição**: Canto superior esquerdo (exceto sobreposto "Fora de Estoque"), pequeno mas legível, alto contraste.

## Considerações de Dispositivo Móvel

### Layout de Grid

**Ajustes específicos para dispositivos móveis:**

- 2 colunas no máximo em dispositivos móveis (nunca 3+)
- Alvos de toque maiores (44px mínimo para botões)
- Sempre exiba o botão "Adicionar ao Carrinho" (não apenas hover)
- Conteúdo simplificado (esconda elementos opcionais como marca)
- Imagens menores para desempenho (<400px de largura)

### Interações por Toque

### Introdução

- [Touch events](https://developer.mozilla.org/pt-PT/docs/Web/API/Touch_events)
- [Mouse events](https://developer.mozilla.org/pt-PT/docs/Web/API/Mouse_events)

### Eventos de Toque

***Eventos de Toque Primários***`touchstart`
    *`touchmove`*   `touchend`
    *`touchcancel`***Eventos de Toque Secundários***`touchhold`
    *`touchrelease`

### Exemplo

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Exemplo de Interações por Toque</title>
  </head>
  <body>
    <p>Move o dedo sobre a área abaixo para ver os eventos de toque:</p>
    <div id="area-de-toque" style="width: 300px; height: 200px; border: 1px solid black;"></div>
    <script>
      const areaDeToque = document.getElementById('area-de-toque');
      areaDeToque.addEventListener('touchstart', (evento) => {
        console.log('Toque iniciado');
      });
      areaDeToque.addEventListener('touchmove', (evento) => {
        console.log('Toque em movimento');
      });
      areaDeToque.addEventListener('touchend', (evento) => {
        console.log('Toque finalizado');
      });
      areaDeToque.addEventListener('touchcancel', (evento) => {
        console.log('Toque cancelado');
      });
    </script>
  </body>
</html>
```

### Recursos Adicionais*   [MDN - Touch Events](https://developer.mozilla.org/pt-PT/docs/Web/API/Touch_events)

- [MDN - Mouse Events](https://developer.mozilla.org/pt-PT/docs/Web/API/Mouse_events)

**Sem estados de hover em dispositivos móveis:**

- Não esconda ações atrás de hover
- Sempre mostrar o botão principal
- Use estados de toque (estado ativo) em vez de hover

## Checklist de Comércio Eletrônico

**Recursos essenciais:**

- [ ] Imagem de produto clara (otimizada, carregada de forma preguiçosa)
- [ ] Título do produto (truncado para 2 linhas max)
- [ ] Preço exibido de forma destacada
- [ ] Preço de venda exibido corretamente (preço original riscado)
- [ ] Símbolo de moeda incluído
- [ ] Para Medusa: Preço exibido como está (não dividido por 100)
- [ ] Botão Adicionar ao Carrinho com estado de carregamento
- Estratégia de manipulação de variantes (primeira variante, redirecionar ou Visualização Rápida)
- [ ] Atualização otimista da IU (contagem do carrinho imediatamente)
- [ ] Feedback de sucesso (toast ou popup de carrinho)
- [ ] Não navegue para longe depois de adicionar ao carrinho
- [ ] Emblema de Fora de Estoque (desativa adicionar ao carrinho)
- [ ] Inicie a venda com um selo de preço reduzido
- [ ] Grade responsiva (1 coluna móvel, 2-3 tablet, 3-4 desktop)
- [ ] Amigável para toque em dispositivos móveis (botões de 44px)
- [ ] Acessível por teclado (estados de foco, Enter para ativar)
- [ ] Texto alternativo descritivo em imagens
- [ ] HTML Semântico (`<article>` wrapper)
