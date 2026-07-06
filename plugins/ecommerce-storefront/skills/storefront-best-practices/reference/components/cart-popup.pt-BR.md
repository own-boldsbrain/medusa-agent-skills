# Componente de Pop-up do Carrinho

## Índice

- [Visão Geral](#visão-geral)
- [Quando Mostrar o Pop-up do Carrinho](#quando-mostrar-o-pop-up-do-carrinho)
- [Padrões de Layout](#padrões-de-layout)
- [Exibição do Carrinho](#exibição-do-carrinho)
- [Ações e Chamadas à Ação](#ações-e-chamadas-à-ação)
- [Estado Vazio](#estado-vazio)
- [Carregamento e Estados de Erro](#carregamento-e-estados-de-erro)
- [Considerações para Dispositivos Móveis](#considerações-para-dispositivos-móveis)
- [Lista de Verificação](#lista-de-verificação)

## Visão Geral

O pop-up do carrinho (ou gaveta do carrinho) exibe uma visão rápida do carrinho sem que o usuário precise navegar para longe da página atual. Ele é aberto ao clicar no ícone do carrinho ou logo após a adição de itens.

**⚠️ CRÍTICO: Sempre exiba os detalhes da variante (tamanho, cor, material, etc.) no pop-up do carrinho, não apenas os títulos dos produtos.**

**Conhecimento presumido:** Agentes de IA sabem como construir modais, diálogos e overlays. O foco aqui está nos padrões específicos para storefronts de e-commerce (Next.js, React, Medusa).

**Pop-up do carrinho vs página completa do carrinho:**

- Pop-up: Visão geral rápida, caminho direto para finalizar compra, facilita continuar comprando.
- Página completa: Análise detalhada, códigos promocionais, operações complexas (ex: cálculo de frete antecipado).
- **Recomendado:** Utilizar ambos. O pop-up para velocidade e a página completa do carrinho para detalhes.

## Quando Mostrar o Pop-up do Carrinho

**Opções de gatilho:**

1. **Ao clicar no ícone do carrinho**: sempre deve abrir o pop-up, menu suspenso ou gaveta.
2. **Após adicionar ao carrinho**: recomendado para confirmar a ação e oferecer "Finalizar compra" ou "Continuar comprando".
3. **Ao passar o mouse no ícone do carrinho**: opcional apenas em desktop; evite como único gatilho porque pode abrir acidentalmente.

**Alternativas de feedback ao adicionar ao carrinho:**

- **Abrir pop-up**: confirmação imediata e caminho claro para finalizar compra.
- **Mostrar toast**: menos intrusivo, mas exige que o usuário abra o carrinho para revisar detalhes.
- **Navegar para a página do carrinho**: padrão tradicional, útil para fluxos mais detalhados.

## Padrões de Layout

**Dois padrões comuns:**

**1. Menu suspenso (recomendado para simplicidade):**

- Desce a partir do ícone do carrinho, posicionado abaixo da navegação principal.
- Largura: 280-320px, altura máxima com barra de rolagem.
- Sem sobreposição de fundo (clique fora para fechar).
- Melhor para poucos itens e implementação mais simples.

**2. Gaveta do carrinho (mais proeminente):**

- Desliza da direita, ocupa toda a altura da tela, largura de 320-400px (desktop) ou 80-90% (mobile).
- Fundo semi-transparente escurecendo a página (clique no fundo para fechar).
- Melhor para múltiplos itens ou fluxos de carrinho complexos.

**Ambos os padrões incluem:**

- Cabeçalho: Título + contagem de itens + botão de fechar (opcional para menu suspenso).
- Conteúdo rolável: Lista de itens adicionados.
- Rodapé fixo: Subtotal + botões de ação ("Finalizar compra", "Ver carrinho").

## Exibição do Carrinho

**Integração de Estado e Backend (Medusa/React):**

A implementação recomendada para ecossistemas modernos (como Next.js e Medusa) exige controle de estado rigoroso:

- **Identificação:** Guarde sempre o `cart.id` no `localStorage` após a criação no primeiro acesso.
- **Estado Global:** Armazene os detalhes completos do carrinho utilizando React Context, Zustand, Redux ou TanStack Query para evitar *prop drilling* e garantir sincronia em toda a interface.
- **Ciclo de Vida das Mutações:** Ao adicionar, remover ou alterar a quantidade de um item, invalide a consulta (refetch) via TanStack Query para sincronizar o carrinho imediatamente com o backend.
- **Atualizações Otimistas:** Atualize a interface antes do servidor responder, mas reverta silenciosamente em caso de erro.
- **Tratamento de Carrinho Inválido:** Se o `cart.id` armazenado estiver expirado, inválido ou ausente, a aplicação deve interceptar o erro e criar um novo carrinho automaticamente, substituindo o ID no `localStorage`.
- **Limpeza Pós-Checkout:** É **CRÍTICO** limpar o estado global e o `localStorage` do carrinho assim que o pedido for concluído (place order). Evite a todo custo o bug de exibir itens antigos em um pop-up de carrinho após a compra.
- **Autenticação:** Realize o merge do carrinho de convidado (guest) com o carrinho do usuário após o login.

**Exibição dos Itens do Carrinho:**

**CRÍTICO: Sempre mostre os detalhes da variante (tamanho, cor, material, etc.) para cada item do carrinho.** Sem esses detalhes, os usuários ficam inseguros se adicionaram a variante correta.

A estrutura de cada item deve conter:

- Imagem do produto (miniatura de 60-80px).
- Título do produto, truncado em até 2 linhas.
- **Detalhes da variante (OBRIGATÓRIO)**: Tamanho, cor, material ou outras opções selecionadas.
  - Formato: "Tamanho: M, Cor: Preto" ou "M / Preto".
  - O pop-up do carrinho deve sempre exibir tamanho, cor, material e demais opções selecionadas da variante, não apenas o título do produto. Exiba abaixo do título com texto menor.
- Controles de quantidade (botões de +/- com debounce de 300-500ms).
- Preço unitário e preço total da linha (preço × quantidade).
- Botão de remoção (ícone X ou lata de lixo, ação direta sem confirmação prévia).

## Ações e Chamadas à Ação

**Resumo de totais:**

- Subtotal (soma de todos os itens).
- Frete e impostos: Exiba "Calculado na finalização" ou o valor real (se aplicável).
- Total: Em **negrito** e com alto destaque.

**Indicador de frete grátis (opcional):**

- "Faltam {valor_para_frete_gratis} para frete grátis" acompanhado de uma barra de progresso.
- Incentiva o aumento do ticket médio, atualizando dinamicamente conforme os itens mudam.

**Códigos promocionais:**

- Normalmente NÃO devem ser incluídos no pop-up do carrinho (falta de espaço).
- Reserve a inserção de cupons para a página completa do carrinho ou para o fluxo de checkout.

**Botões de ação principais:**

1. **Finalizar compra** (Primário): Mais proeminente, alto contraste (cor principal da marca), navega direto para o fluxo de checkout.
2. **Ver carrinho** (Secundário): Botão contornado, fantasma ou link em texto, navega para a página completa do carrinho.

## Estado Vazio

Deve exibir um ícone ou ilustração neutra acompanhada do texto "Seu carrinho está vazio" e um botão claro de "Continuar comprando". O design deve ser centrado, minimalista e amigável, incentivando a navegação.

## Carregamento e Estados de Erro

**Ao abrir o pop-up:** Mostre um *skeleton* (estrutura de carregamento) enquanto os dados são buscados do backend, evitando exibir uma tela em branco momentânea.

**Durante atualizações (Mutações):**

- **Alteração de quantidade:** Exiba um *spinner* pequeno (inline), desabilite os botões de controle para evitar cliques duplos e use debounce.
- **Remoção de item:** Utilize animação de desvanecimento (fade-out) suave, desabilitando o botão de remoção durante a requisição.
- **Adicionar ao carrinho:** Indicador de estado de carregamento no próprio botão que disparou a ação (ex: texto "Adicionando..." ou ícone giratório).

**Tratamento de erros:**

- **Erros de rede:** Exiba a opção de tentar novamente; não feche o pop-up inesperadamente.
- **Fora de estoque:** Desabilite o botão de aumento de quantidade e exiba uma mensagem textual de aviso.
- Reverter quaisquer atualizações otimistas caso o servidor retorne falha.

## Considerações para Dispositivos Móveis

**Ajustes de interface em telas pequenas:**

- A gaveta do carrinho deve ocupar entre 85% a 100% (tela cheia) da largura em dispositivos móveis, deslizando da direita ou de baixo.
- Suporte a gestos de deslizar (swipe) para fechar.
- Rodapé fixo na parte inferior contendo os botões de ação e os totais para estarem sempre alcançáveis pelo polegar.
- Botões de "Finalizar compra" com largura total (100%).

**Alvos de toque (Touch Targets):**
Recomendado: 44-48px para conforto em dispositivos móveis. Mínimo WCAG AA: 24x24px ou espaçamento equivalente.

## Lista de Verificação

**Arquitetura e Implementação:**

- [ ] Gatilhos corretos de abertura implementados (ícone e/ou após adição).
- [ ] Layout em formato de menu suspenso ou gaveta.
- [ ] Fechamento via botão X, clique fora (quando aplicável) e tecla Escape.
- [ ] **CRÍTICO: Exibição obrigatória de variantes (tamanho, cor, etc.) - não apenas o título.**
- [ ] Itens exibem imagem, título, variante, quantidade, preço unitário e total.
- [ ] Controle de quantidade com debounce e desativação temporal (loading).
- [ ] Remoção rápida de item sem confirmações intrusivas.
- [ ] Subtotal do carrinho claramente visível.
- [ ] CTA primário de "Finalizar compra".
- [ ] CTA secundário de "Ver carrinho".
- [ ] Estado vazio bem desenhado com botão "Continuar comprando".
- [ ] Estados de carregamento (*skeleton*) e de erro tratados visualmente.
- [ ] Atualização em tempo real do ícone (badge) com o total de itens.
- [ ] Limpeza do estado do carrinho no frontend (Context/TanStack) após pedido finalizado.
- [ ] Tratamento autônomo e recuperação de ID de carrinho inválido/expirado.
- [ ] Responsividade adaptada (gaveta/menu) para dispositivos móveis.

**Acessibilidade (Operacional e W3C):**

- [ ] O contêiner pai utiliza `role="dialog"`.
- [ ] A propriedade `aria-modal="true"` é utilizada apenas se o componente funcionar como gaveta modal e o conteúdo de fundo estiver realmente inerte.
- [ ] O modal possui `aria-labelledby` apontando para o ID do título do pop-up.
- [ ] Foco inicial: O foco é enviado para dentro do pop-up assim que ele é aberto.
- [ ] Foco preso (Focus Trap): Teclas `Tab` e `Shift+Tab` não escapam do modal enquanto ele estiver aberto.
- [ ] Retorno de foco: Ao fechar o pop-up, o foco retorna para o elemento que o disparou (geralmente o ícone do carrinho).
- [ ] Botão de fechar visível e acessível para teclado e leitores.
- [ ] Anúncios dinâmicos: Utilização de `aria-live` para anunciar quando um item é adicionado ou removido para o leitor de tela.
