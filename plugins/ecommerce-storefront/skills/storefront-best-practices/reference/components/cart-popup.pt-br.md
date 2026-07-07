# Componente de pop-up do carrinho

## Índice

- [Visão geral](#visao-geral)
- [Quando exibir o pop-up do carrinho](#quando-exibir-a-janela-pop-up-do-carrinho)
- [Padrões de layout](#padroes-de-layout)
- [Exibição do carrinho](#exibicao-do-carrinho)
- [Ações e CTAs](#acoes-e-ctas)
- [Estado vazio](#estado-vazio)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

O pop-up do carrinho (mini carrinho/gaveta do carrinho) exibe uma visão geral rápida do carrinho sem a necessidade de sair da página. Ele é aberto ao clicar no ícone do carrinho ou após a adição de itens.

**⚠️ IMPORTANTE: Sempre exiba os detalhes das variantes (tamanho, cor, material etc.) no pop-up do carrinho, não apenas os nomes dos produtos.**

**Conhecimento prévio**: Os agentes de IA sabem como criar janelas modais, diálogos e sobreposições. Este conteúdo se concentra em padrões específicos do comércio eletrônico.

**Janela pop-up do carrinho x página completa do carrinho:**

- Pop-up: Visão geral rápida, processo de finalização de compra ágil, continuação fácil das compras
- Página completa: Revisão detalhada, códigos promocionais, operações complexas
- **Recomendado**: Ambos — janela pop-up para agilidade, página completa do carrinho para detalhes

## Quando exibir a janela pop-up do carrinho

**Opções de acionamento:**

1. **Ao clicar no ícone do carrinho** (sempre) — clicar no ícone do carrinho na barra de navegação abre a janela pop-up
2. **Após adicionar ao carrinho** (recomendado) — abre automaticamente a janela pop-up quando o item é adicionado, confirma a ação e permite finalizar a compra ou continuar comprando
3. **Ícone do carrinho ao passar o mouse** (somente para desktop, opcional) — Visualização rápida ao passar o mouse. Pode ocorrer acidentalmente; não recomendado.

**Alternativas de feedback para “Adicionar ao carrinho”:**

- Exibir pop-up (mais comum) — Confirmação imediata, caminho claro para o checkout
- Apenas notificação (menos intrusiva) — Pequena notificação; o usuário clica no ícone do carrinho para ver os detalhes
- Navegar para a página do carrinho (tradicional) — leva diretamente à página completa do carrinho, menos comum atualmente

## Padrões de layout

**Dois padrões comuns:**

**1. Menu suspenso (recomendado por ser simples):**

- Abre a partir do ícone do carrinho, posicionado abaixo da barra de navegação
- Largura: 280-320 px, altura máxima com rolagem
- Sem sobreposição de fundo (clique fora da área para fechar)
- Mais adequado para poucos itens, implementação mais simples

**2. Gaveta deslizante (mais destacada):**

- Desliza da direita, altura total, largura de 320-400 px (desktop) ou 80-90% (celular)
- Sobreposição de fundo semitransparente (clique para fechar)
- Mais adequado para vários itens ou carrinhos complexos

**Ambos os padrões possuem:**

- Cabeçalho: Título + número de itens + botão de fechar (opcional para o menu suspenso)
- Conteúdo rolável: Lista de itens do carrinho
- Rodapé fixo: Subtotal + botões de ação (Finalizar compra, Ver carrinho)

## Exibição do carrinho

**Buscar dados do carrinho do backend:**

- ID do carrinho do localStorage
- Itens da linha (produtos, variantes, quantidades, preços)
- Totais do carrinho (subtotal, impostos, frete)
- Consulte connecting-to-backend.md para integração com o backend

**Quando buscar:**

- Na inicialização do aplicativo (atualizar o ícone do carrinho)
- Ao abrir o pop-up (mostrar estado de carregamento)
- Após atualizações no carrinho (adicionar/remover/alterar quantidade)

**Gerenciamento de estado:**

- Armazenar os dados do carrinho globalmente (React Context ou TanStack Query)
- Persistir o ID do carrinho no localStorage
- Atualizações otimistas da interface do usuário (atualizar imediatamente, reverter em caso de erro)
- **CRÍTICO: Limpar o estado do carrinho após a finalização do pedido**

- Consulte connecting-to-backend.md para conhecer o padrão de limpeza do carrinho
- Problema comum: a janela pop-up do carrinho exibe itens antigos após a finalização do pedido porque o estado do carrinho não foi limpo
- Consulte connecting-to-backend.md para conhecer os padrões de estado do carrinho

**Exibição dos itens do carrinho:**

**CRÍTICO: Sempre exiba os detalhes da variante (tamanho, cor, material etc.) para cada item do carrinho.**

Sem os detalhes da variante, os usuários não podem confirmar se adicionaram a variante correta. Isso é especialmente crítico quando os produtos têm várias opções.

- Imagem do produto (miniatura de 60-80px)
- Título do produto (truncado para 2 linhas)
- **Detalhes da variante (OBRIGATÓRIO)**: Tamanho, cor, material ou outras opções de variante
  - Formato: “Tamanho: Grande, Cor: Preto” ou “Grande / Preto”
  - Mostrar TODAS as opções de variantes selecionadas, não apenas o título do produto
  - Exibir abaixo do título, em fonte menor (cinza)
- Controles de quantidade (botões +/-, tempo de espera de 300 a 500 ms)
- Preço unitário e preço total (total do item = preço × quantidade)
- Botão “Remover” (ícone X, sem necessidade de confirmação)

**Por que os detalhes das variantes são essenciais:**

- Confirmação do usuário: “Adicionei o tamanho certo?”
- Evita o abandono do carrinho devido à incerteza
- Permite correções antes da finalização da compra
- Essencial para produtos com várias variantes (roupas, sapatos, produtos configuráveis)

## Ações e CTAs

**Exibição do resumo do carrinho:**

- Subtotal (soma de todos os itens)
- Frete e impostos: “Calculado na finalização da compra” ou valor real
- Total: em negrito e em destaque

**Indicador de frete grátis (opcional):**

- “Adicione mais US$ 25 para frete grátis” com barra de progresso
- Incentiva pedidos maiores, atualiza-se conforme o carrinho muda

**Códigos promocionais:**

- Normalmente NÃO aparecem na janela pop-up do carrinho (espaço muito apertado)
- Reservar para a página completa do carrinho
- Exceção: inserção simples do código, se o espaço permitir

**Botões de ação:**

1. **Finalizar compra** (principal) — Mais destacado, com alto contraste (cor da marca), leva à página de finalização da compra
2. **Ver carrinho** (secundário) — Contorno ou discreto, leva à página completa do carrinho

Ambos os botões ocupam toda a largura, com altura de 44 a 48 px no celular.

## Estado vazio

Mostrar ícone/ilustração + “Seu carrinho está vazio” + botão “Continuar comprando”. Centralizado, amigável, design minimalista.

## Estados de carregamento e erros

**Ao abrir o pop-up**: Mostrar esboço/marcador de posição durante a busca (evitar tela em branco)

**Durante atualizações**:

- Alterações na quantidade: Indicador de carregamento embutido, desativar controles, tempo de espera de 300 a 500 ms
- Remoção de item: Animação de desvanecimento, desativar o botão de remoção durante a solicitação
- Adicionar ao carrinho: Indicador de carregamento no botão (“Adicionando...”)

**Tratamento de erros**:

- Erros de rede: Mostrar opção de repetição da tentativa, não fechar a janela pop-up
- ID do carrinho inválido: Criar novo carrinho automaticamente
- Esgotado: Desativar aumento da quantidade, mostrar mensagem
- Reverter atualizações otimistas em caso de falha

**Animações**: Transições suaves (250-350 ms), gaveta deslizante, fade-in/out do plano de fundo. Destacar itens recém-adicionados.

## Considerações para dispositivos móveis

**Menu suspenso em dispositivos móveis:**

- Largura total (100% menos margens)
- Altura máxima de 60 a 70% da janela de visualização, com rolagem
- Toque fora da área para fechar

**Gaveta em dispositivos móveis:**

- 85 a 95% da largura da tela ou tela inteira
- Desliza da direita ou da parte inferior
- Gestos de deslizar para fechar são suportados
- Sobreposição de fundo

**Ajustes para dispositivos móveis:**

- Áreas de toque grandes (mínimo de 44 a 48 px)
- Botões de ação em largura total (48-52 px de altura)
- Imagens menores (60 px), títulos truncados
- Rodapé fixo com ações
- Botão de fechar grande (44x44 px)

## Lista de verificação

**Recursos essenciais:**

- [ ] Abre ao clicar no ícone do carrinho
- [ ] Layout de menu suspenso (280-320px) ou gaveta (320-400px)
- [ ] Botão de fechar ou clicar fora da área para fechar
- [ ] Sobreposição de fundo se for gaveta
- [ ] **CRÍTICO: Os itens do carrinho mostram detalhes das variantes (tamanho, cor etc.) — não apenas o título do produto**
- [ ] Itens do carrinho com imagem, título, opções de variantes, quantidade e preços
- [ ] Controles de quantidade (botões +/-, sem rebote)
- [ ] Botão “Remover item”
- [ ] Exibição do subtotal
- [ ] Botão “Finalizar compra” (primário)
- [ ] Botão “Ver carrinho” (secundário)
- [ ] Estado vazio com CTA “Continuar comprando”
- [ ] Estados de carregamento (esqueleto/ícone giratório)
- [ ] Animações suaves (250-350 ms)
- [ ] Dispositivos móveis: menu suspenso em largura total ou gaveta de 85-95%
- [ ] Áreas de toque com no mínimo 44-48px
- [ ] `role="dialog"` e `aria-modal="true"`
- [ ] Rótulos ARIA no botão do carrinho (“Carrinho de compras com 3 itens”)
- [ ] Acessível por teclado (armadilha de foco, tecla Escape fecha, retorna o foco)
- [ ] Anúncios do leitor de tela (item adicionado/removido)
- [ ] Atualizações em tempo real do ícone de contagem do carrinho
