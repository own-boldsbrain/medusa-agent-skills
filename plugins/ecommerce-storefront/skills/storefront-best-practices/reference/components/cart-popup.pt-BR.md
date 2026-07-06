# Componente de Popup do Carrinho

## Contents

- [Visão Geral](#visão-geral)
- [Quando Mostrar o Pop-up do Carrinho](#quando-mostrar-o-pop-up-do-carrinho)
- [Padrões de Layout](#padroes-de-layout)
- [Exibição do Carrinho](#exibição-do-carrinho)
- [Ações e Chamadas à Ação](#ações-e-chamadas-à-ação)
- [Estado Vazio](#empty-state)
- [Considerações sobre Dispositivos Móveis](#consideracoes-sobre-dispositivos-moveis)
- [Lista de Verificação](#checklist)

## Visão geral

Popup do carrinho (mini carrinho/gaveta do carrinho) mostra uma visão rápida do carrinho sem precisar navegar para longe. Abre ao clicar no ícone do carrinho ou após adicionar itens.

**⚠️ CRÍTICO: Sempre exiba os detalhes da variante (tamanho, cor, material, etc.) no pop-up do carrinho, não apenas os títulos dos produtos.**

**Conhecimento pré-requisito**: agentes de IA sabem como construir modais, diálogos e sobreposições. Este foco está nos padrões específicos de comércio eletrônico.

**Popup de carrinho vs página completa de carrinho:**

- Popup: Visão geral rápida, caminho rápido para o checkout, continue comprando facilmente
- Página inteira: Análise detalhada, códigos promocionais, operações complexas
- **Recomendado**: Ambos - pop-up para velocidade, página completa do carrinho para detalhes

## # Quando Mostrar o Popup do Carrinho

O popup do carrinho deve ser exibido quando o usuário adicionar um item ao carrinho. Isso pode ser feito usando JavaScript para detectar a ação de adicionar ao carrinho e, em seguida, exibir o popup.

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Código para adicionar ao carrinho
      // ...

      // Exibir o popup do carrinho
      const cartPopup = document.getElementById('cart-popup');
      cartPopup.style.display = 'block';
    });
  });
});
```

O código acima adiciona um ouvinte de evento aos botões "Adicionar ao Carrinho". Quando um botão é clicado, o código adiciona o item ao carrinho (supondo que você tenha uma função para isso) e, em seguida, exibe o popup do carrinho usando `getElementById` e definindo o estilo de exibição como 'block'.

Lembre-se de personalizar o código de acordo com a estrutura do seu site e as funções específicas que você usa para adicionar itens ao carrinho.

**Opções de gatilho:**

1. **Ao clicar no ícone do carrinho** (sempre) - Clicar no ícone do carrinho na barra de navegação abre um popup
2. **Após adicionar ao carrinho** (recomendado) - Abre automaticamente o pop-up quando o item é adicionado, confirma a ação, permite finalizar a compra ou continuar comprando
3. **Ícone do carrinho ao passar o mouse** (apenas desktop, opcional) - Visualização rápida ao passar o mouse. Pode ser acidental, não recomendado.

**Alternativas de feedback para adição ao carrinho:**

- Mostrar pop-up (mais comum) - Confirmação imediata, caminho claro para o checkout
- Toast apenas (menos intrusivo) - Pequena notificação, usuário clica no ícone do carrinho para ver os detalhes
- Navegue até a página do carrinho (tradicional) - Vai diretamente para a página completa do carrinho, menos comum agora.

## Layout Patterns

**Dois padrões comuns:**

**1. Dropdown (recomendado para simplicidade):**

- Desce do ícone do carrinho, posicionado abaixo da navbar
- Largura: 280-320px, altura máxima com rolagem
- Nenhum fundo sobreposto (clique fora para fechar)
- Melhor para poucos itens, implementação mais simples

**2. Gaveta deslizante (mais proeminente):**

- Slides da direita, altura total, largura 320-400px (desktop) ou 80-90% (mobile)
- Sobreposição de fundo semi-transparente (clique para fechar)
- Melhor para múltiplos itens ou carrinhos complexos

Ambos os padrões têm:

- Cabeçalho: Título + contagem de itens + botão de fechar (opcional para dropdown)
- Conteúdo rolável: Lista de itens do carrinho
- Rodapé fixo: Subtotal + botões de ação (Finalizar compra, Ver Carrinho)

## Exibição do Carrinho

**Buscar dados do carrinho do backend:**

- Cart ID do localStorage
- Itens de linha (produtos, variantes, quantidades, preços)
- Totais do carrinho (subtotal, imposto, frete)
- Veja connecting-to-backend.md para integração com o backend

**Quando buscar:**

- Na inicialização do aplicativo (atualizar o ícone do carrinho com badge)
- Ao abrir pop-up (exibir estado de carregamento)
- Após atualizações do carrinho (adicionar/remover/alterar quantidade)

**Gerenciamento de estado:**

- Armazene os dados do carrinho globalmente (React Context ou TanStack Query)
- Persist cart ID no localStorage
- Atualizações otimistas de UI (atualizar imediatamente, reverter em caso de erro)
- **CRÍTICO: Limpar estado do carrinho após o pedido ser feito** - Veja [connecting-to-backend.md](connecting-to-backend.md) para o padrão de limpeza do carrinho
- Problema comum: O pop-up do carrinho exibe itens antigos após o checkout porque o estado do carrinho não foi limpo
- Veja connecting-to-backend.md para padrões de estado do carrinho

**Exibição do item do carrinho:**

**CRÍTICO: Sempre mostre os detalhes da variante (tamanho, cor, material, etc.) para cada item do carrinho.**

Sem detalhes da variante, os usuários não podem confirmar se adicionaram a variante correta. Isso é especialmente crítico quando os produtos têm várias opções.

- Imagem do produto (miniatura de 60-80px)
- Produto título
(truncado para 2 linhas)
- **Detalhes da variante (OBRIGATÓRIO)**: Tamanho, cor, material ou outras opções de variante
  - Format: "Size: Large, Color: Black" or "Large / Black"
  - Show ALL selected variant options, not just product title
  - Exiba abaixo do título, texto menor (cinza)
- Quantidade controles (+/- botões, debounce 300-500ms)
- Preço unitário e preço total (total do item = preço × quantidade)
- Botão de remoção (ícone X, sem confirmação necessária)

**Por que os detalhes da variante são críticos:**

- Confirmação do usuário: "Eu adicionei o tamanho certo?"
- Evita o abandono de carrinho por incerteza
- Permite correções antes do checkout
- Essencial para produtos com múltiplas variantes (roupas, calçados, produtos configuráveis)

## Ações e CTAs

**Cart summary display:**

- Subtotal (soma de todos os itens)
- Frete e imposto: "Calculado no checkout" ou valor real
- Total: **Negrito e proeminente**

**Indicador de frete grátis (opcional):**

- "Adicione mais $25 para frete grátis" com barra de progresso
- Incentiva pedidos maiores, atualizações conforme alterações no carrinho

**Códigos promocionais:**

- Normalmente NÃO no pop-up do carrinho (muito apertado)
- Reserve para página do carrinho completo
- Exceção: Entrada de código simples, se houver espaço disponível

**Botões de ação:**

1. **Checkout** (primário) - Mais proeminente, alto contraste (cor da marca), navega para o checkout
2. **Ver Carrinho** (secundário) - Contorno ou sutil, navega para a página completa do carrinho

Ambos os botões com largura total, altura de 44-48px no celular.

## Empty State

Exibir ícone/ilustração + "Seu carrinho está vazio" + botão "Continuar comprando". Design centrado, amigável e minimalista.

## Carregando e Estados de Erro

**Ao abrir o popup**: Mostrar esqueleto/estrutura de carregamento enquanto busca (evitar tela em branco)

**During updates**:

- Quantity changes: Inline spinner, disable controls, debounce 300-500ms
- Item removal: Fade out animation, disable remove button during request
- Add to cart: Loading indicator on button ("Adding...")

**Error handling**:

- Erros de rede: Mostrar opção de tentar novamente, não fechar o popup
- Invalid cart ID: Create new cart automatically
- Fora de estoque: Desabilitar aumento de quantidade, exibir mensagem
- Reverter atualizações otimistas em caso de falha

**Animações**: Transições suaves (250-350ms), gaveta deslizante, desvanecimento do fundo ao aparecer/desaparecer. Destacar itens recém-adicionados.

## Mobile Considerations

**Menu suspenso no celular:**

- Largura total (100% menos margens)
- Max height 60-70% viewport, scrollable
- Tap outside to close

**Gaveta no celular:**

- 85-95% screen width or full screen
- Desliza da direita ou de baixo
- Deslize para fechar gesto suportado
- Sobreposição de fundo

**Mobile adjustments:**

- Large touch targets (44-48px minimum)
- Full-width action buttons (48-52px height)
- Imagens menores (60px), truncar títulos
- Rodapé fixo com ações
- Large close button (44x44px)

## Lista de verificação

**Funcionalidades essenciais:**

- [ ] Abre ao clicar no ícone do carrinho
- [ ] Dropdown (280-320px) or drawer (320-400px) layout
- [ ] Close button or click outside to close
- [ ] Sobreposição de fundo se a gaveta
- [ ] **CRÍTICO: Itens do carrinho exibem detalhes da variante (tamanho, cor, etc.) - não apenas o título do produto**
- [ ] Itens do carrinho com imagem, título, opções de variante, quantidade, preços
- [ ] Quantity controls (+/- buttons, debounced)
- [ ] Botão de remoção de item
- [ ] Subtotal exibido
- [ ] Botão de checkout (primário)
- [ ] Botão Ver Carrinho (secundário)
- [ ] Estado vazio com "Continue Comprando" CTA
- [ ] Estados de carregamento (esqueleto/spinner)
- [ ] Animações suaves (250-350ms)
- [ ] Mobile: Dropdown de largura total ou gaveta de 85-95%
- [ ] Alvos de toque mínimo de 44-48px
- [ ] `role="dialog"` e `aria-modal="true"`
- [ ] Rótulos ARIA no botão do carrinho ("Carrinho de compras com 3 itens")
- [ ] Acessível por teclado (armadilha de foco, Escape fecha, retorna o foco)
- [ ] Anúncios do leitor de tela (item adicionado/removido)
- [ ] Atualização em tempo real do ícone de contagem de carrinho
