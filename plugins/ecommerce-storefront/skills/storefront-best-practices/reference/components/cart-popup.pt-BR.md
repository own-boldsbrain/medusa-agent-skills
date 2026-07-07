# Componente Cart Popup

## Conteúdo

- [Visão Geral](#visao-geral)
- [Quando Exibir o Cart Popup](#quando-exibir-o-cart-popup)
- [Padrões de Layout](#padroes-de-layout)
- [Exibição do Carrinho](#exibicao-do-carrinho)
- [Ações e CTAs](#acoes-e-ctas)
- [Estado Vazio](#estado-vazio)
- [Considerações para Dispositivos Móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

O Cart popup (mini carrinho/drawer do carrinho) mostra uma visão geral rápida do carrinho sem que o usuário saia da página atual. Ele é aberto ao clicar no ícone do carrinho ou após adicionar itens.

**⚠️ CRÍTICO: Sempre exiba os detalhes da variante (tamanho, cor, material, etc.) no cart popup, não apenas os títulos dos produtos.**

**Conhecimento presumido**: Agentes de IA sabem como construir modais, diálogos e overlays. Este documento se concentra em padrões específicos de e-commerce.

**Cart popup vs página completa do carrinho:**

- Popup: Visão geral rápida, caminho rápido para o checkout, facilidade para continuar comprando
- Página completa: Revisão detalhada, códigos promocionais, operações complexas
- **Recomendado**: Ambos - popup para velocidade, página completa do carrinho para detalhes

## Quando Exibir o Cart Popup

**Opções de gatilho:**

1. **Ao clicar no ícone do carrinho** (sempre) - Clicar no ícone do carrinho na barra de navegação abre o popup
2. **Após adicionar ao carrinho** (recomendado) - Abrir o popup automaticamente quando um item for adicionado, confirma a ação e permite ir ao checkout ou continuar comprando
3. **Passar o mouse no ícone do carrinho** (apenas desktop, opcional) - Espiadela rápida ao passar o mouse. Pode ser acidental, não recomendado.

**Alternativas de feedback ao adicionar ao carrinho:**

- Mostrar popup (mais comum) - Confirmação imediata, caminho claro para o checkout
- Apenas toast (menos intrusivo) - Pequena notificação, o usuário clica no ícone do carrinho para ver os detalhes
- Redirecionar para a página do carrinho (tradicional) - Vai direto para a página completa do carrinho, menos comum hoje em dia

## Padrões de Layout

**Dois padrões comuns:**

**1. Dropdown (recomendado pela simplicidade):**

- Cai a partir do ícone do carrinho, posicionado abaixo da barra de navegação
- Largura: 280-320px, altura máxima com scroll
- Sem overlay de fundo (clique fora para fechar)
- Melhor para poucos itens, implementação mais simples

**2. Drawer deslizante (mais proeminente):**

- Desliza a partir da direita, altura total, largura 320-400px (desktop) ou 80-90% (mobile)
- Overlay de fundo semitransparente (clique para fechar)
- Melhor para múltiplos itens ou carrinhos complexos

**Ambos os padrões possuem:**

- Cabeçalho: Título + contagem de itens + botão de fechar (opcional para dropdown)
- Conteúdo com scroll: Lista de itens do carrinho
- Rodapé fixo: Subtotal + botões de ação (Checkout, Ver Carrinho)

## Exibição do Carrinho

**Buscar dados do carrinho no backend:**

- ID do carrinho a partir do localStorage
- Itens de linha (produtos, variantes, quantidades, preços)
- Totais do carrinho (subtotal, imposto, frete)
- Consulte connecting-to-backend.md para integração com o backend

**Quando buscar dados:**

- Na inicialização do app (para atualizar o badge do ícone do carrinho)
- Ao abrir o popup (mostrar estado de carregamento)
- Após atualizações no carrinho (adicionar/remover/mudar quantidade)

**Gerenciamento de estado:**

- Armazenar dados do carrinho globalmente (React Context ou TanStack Query)
- Persistir o ID do carrinho no localStorage
- Atualizações de UI otimistas (atualizar imediatamente, reverter em caso de erro)
- **CRÍTICO: Limpar o estado do carrinho após o pedido ser feito** - Consulte connecting-to-backend.md para o padrão de limpeza do carrinho
- Problema comum: O cart popup mostra itens antigos após o checkout porque o estado do carrinho não foi limpo
- Consulte connecting-to-backend.md para padrões de estado do carrinho

**Exibição de itens do carrinho:**

**CRÍTICO: Sempre mostre os detalhes da variante (tamanho, cor, material, etc.) para cada item do carrinho.**

Sem detalhes da variante, os usuários não conseguem confirmar se adicionaram a variante correta. Isso é especialmente crítico quando os produtos têm várias opções.

- Imagem do produto (miniatura de 60-80px)
- Título do produto (truncado para 2 linhas)
- **Detalhes da variante (OBRIGATÓRIO)**: Tamanho, cor, material ou outras opções da variante
  - Formato: "Tamanho: Grande, Cor: Preto" ou "Grande / Preto"
  - Mostre TODAS as opções da variante selecionada, não apenas o título do produto
  - Exiba abaixo do título, com texto menor (cinza)
- Controles de quantidade (botões +/-, debounce 300-500ms)
- Preço unitário e preço total (total do item de linha = preço × quantidade)
- Botão remover (ícone X, sem necessidade de confirmação)

**Por que os detalhes da variante são críticos:**

- Confirmação do usuário: "Adicionei o tamanho certo?"
- Evita o abandono do carrinho por incerteza
- Permite correções antes do checkout
- Essencial para produtos com várias variantes (roupas, sapatos, produtos configuráveis)

## Ações e CTAs

**Exibição do resumo do carrinho:**

- Subtotal (soma de todos os itens)
- Frete e impostos: "Calculado no checkout" ou valor real
- Total: Em negrito e proeminente

**Indicador de frete grátis (opcional):**

- "Adicione mais $25 para frete grátis" com barra de progresso
- Incentiva pedidos maiores, atualiza conforme o carrinho muda

**Códigos promocionais:**

- Normalmente NÃO estão no cart popup (muito apertado)
- Reserve para a página completa do carrinho
- Exceção: Entrada simples de código se o espaço permitir

**Botões de ação:**

1. **Checkout** (primário) - Mais proeminente, alto contraste (cor da marca), navega para o checkout
2. **Ver Carrinho** (secundário) - Contorno ou sutil, navega para a página completa do carrinho

Ambos os botões com largura total, altura de 44-48px no mobile.

## Estado Vazio

Mostrar ícone/ilustração + "Seu carrinho está vazio" + botão "Continuar Comprando". Design centralizado, amigável e minimalista.

## Estados de Carregamento e Erro

**Ao abrir o popup**: Mostrar skeleton/placeholder durante o fetch (evite tela em branco)

**Durante atualizações**:

- Mudanças de quantidade: Spinner inline, desativar controles, debounce 300-500ms
- Remoção de item: Animação de esmaecimento (fade out), desativar botão remover durante a requisição
- Adicionar ao carrinho: Indicador de carregamento no botão ("Adicionando...")

**Tratamento de erro**:

- Erros de rede: Mostrar opção de tentar novamente, não fechar o popup
- ID de carrinho inválido: Criar novo carrinho automaticamente
- Fora de estoque: Desativar aumento de quantidade, mostrar mensagem
- Reverter atualizações otimistas em caso de falha

**Animações**: Transições suaves (250-350ms), drawer deslizante, fade-in/out no backdrop. Destacar itens recém-adicionados.

## Considerações para Dispositivos Móveis

**Dropdown no mobile:**

- Largura total (100% menos margens)
- Altura máxima 60-70% da viewport, com scroll
- Toque fora para fechar

**Drawer no mobile:**

- 85-95% da largura da tela ou tela inteira
- Desliza da direita ou de baixo
- Suporte a gesto de deslizar para fechar
- Overlay de fundo

**Ajustes mobile:**

- Alvos de toque grandes (44-48px no mínimo)
- Botões de ação com largura total (altura de 48-52px)
- Imagens menores (60px), truncar títulos
- Rodapé fixo com ações
- Botão de fechar grande (44x44px)

## Lista de Verificação

**Recursos essenciais:**

- [ ] Abre ao clicar no ícone do carrinho
- [ ] Layout dropdown (280-320px) ou drawer (320-400px)
- [ ] Botão de fechar ou clique fora para fechar
- [ ] Overlay de fundo se for drawer
- [ ] **CRÍTICO: Itens do carrinho mostram detalhes da variante (tamanho, cor, etc.) - não apenas o título do produto**
- [ ] Itens do carrinho com imagem, título, opções de variante, quantidade, preços
- [ ] Controles de quantidade (botões +/-, debounced)
- [ ] Botão para remover item
- [ ] Subtotal exibido
- [ ] Botão Checkout (primário)
- [ ] Botão Ver Carrinho (secundário)
- [ ] Estado vazio com CTA "Continuar Comprando"
- [ ] Estados de carregamento (skeleton/spinner)
- [ ] Animações suaves (250-350ms)
- [ ] Mobile: Dropdown de largura total ou drawer de 85-95%
- [ ] Alvos de toque de 44-48px no mínimo
- [ ] `role="dialog"` e `aria-modal="true"`
- [ ] Rótulos ARIA no botão do carrinho ("Carrinho de compras com 3 itens")
- [ ] Acessível via teclado (focus trap, Esc fecha, retorna foco)
- [ ] Anúncios de leitor de tela (item adicionado/removido)
- [ ] Atualizações em tempo real no badge de contagem do carrinho
