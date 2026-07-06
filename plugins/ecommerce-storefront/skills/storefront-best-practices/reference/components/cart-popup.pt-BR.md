# Component de Popup do Carrinho

## Conteúdo

- [Visão Geral](#visao-geral)
- [Quando Mostrar o Popup do Carrinho](#quando-mostrar-o-popup-do-carrinho)
- [Padrões de Layout](#padroes-de-layout)
- [Exibição do Carrinho](#ex exibicao-do-carrinho)
- [Ações e CTAs (Call to Action)](#acoes-e-ctas)
- [Estado Vazio](#estado-vazio)
- [Considerações para Mobile](#consideracoes-para-mobile)
- [Checklist](#checklist)

## Visão Geral

O popup do carrinho (carrinho mini/painel lateral) mostra uma visão rápida do carrinho sem precisar navegar. Abre ao clicar no ícone do carrinho ou após adicionar itens.

**IMPORTANTE: Sempre exiba detalhes da variação (tamanho, cor, material, etc.) no popup do carrinho, e não apenas os títulos dos produtos.****Conhecimento Presumido:**Os agentes de IA sabem como criar modais, diálogos e sobreposições. Este guia se concentra em padrões específicos para comércio eletrônico.**Popup do Carrinho vs. Página Completa do Carrinho:**- Popup: Visão rápida, caminho rápido para o checkout, fácil continuar comprando

- Página completa: Revisão detalhada, códigos promocionais, operações complexas
-**Recomendado:**Ambos - popup para velocidade, página completa para detalhes

## Quando Mostrar o Popup do Carrinho**Opções de gatilho:**1.**Ao clicar no ícone do carrinho**(sempre) - Clicar no ícone do carrinho na barra de navegação abre o popup

2.**Após adicionar ao carrinho**(recomendado) - Abrir automaticamente o popup quando um item for adicionado, confirma a ação, permite checkout ou continuar comprando
3.**Ao passar o mouse sobre o ícone do carrinho**(apenas desktop, opcional) - Vista rápida ao passar o mouse. Pode ser acidental, não recomendado.**Alternativas para "Adicionar ao Carrinho":**- Mostrar popup (mais comum) - Confirmação imediata, caminho claro para o checkout

- Apenas Toast (menos intrusivo) - Notificação pequena, usuário clica no ícone do carrinho para ver os detalhes
- Navegar para a página do carrinho (tradicional) - Vai diretamente para a página completa do carrinho, menos comum agora

## Padrões de Layout**Dois padrões comuns:****1. Dropdown (recomendado pela simplicidade):**- Desdobra a partir do ícone do carrinho, posicionado abaixo da barra de navegação

- Largura: 280-320px, altura máxima com rolagem
- Sem sobreposição de fundo (clique fora para fechar)
- Melhor para poucos itens, implementação mais simples**2. Slide-in drawer (mais proeminente):**- Desliza da direita, altura total, largura 320-400px (desktop) ou 80-90% (mobile)
- Sobreposição de fundo semi-transparente (clique para fechar)
- Melhor para vários itens ou carrinhos complexos**Ambos os padrões têm:**- Cabeçalho: Título + número de itens + botão de fechamento (opcional para dropdown)
- Conteúdo rolável: Lista de itens do carrinho
- Rodapé fixo: Subtotal + botões de ação (Checkout, Ver Carrinho)

## Exibição do Carrinho**Recupere os dados do carrinho do backend:**- ID do carrinho de localStorage

- Itens da linha (produtos, variantes, quantidades, preços)
- Totais do carrinho (subtotal, imposto, frete)
- Veja connecting-to-backend.md para integração com o backend**Quando recuperar:**- Na inicialização do aplicativo (atualize a contagem no ícone do carrinho)
- Ao abrir o popup (mostre o estado de carregamento)
- Após atualizações do carrinho (adicione/remova/altere a quantidade)**Gerenciamento de estado:**- Armazene os dados do carrinho globalmente (React Context ou TanStack Query)
- Persista o ID do carrinho em localStorage
- Atualizações de UI otimistas (atualize imediatamente, reverta em caso de erro)
-**IMPORTANTE: Limpe o estado do carrinho após a conclusão da compra**- Veja connecting-to-backend.md para padrão de limpeza do carrinho
- Problema comum: O popup do carrinho exibe itens antigos após o checkout porque o estado do carrinho não foi limpo
- Veja connecting-to-backend.md para padrões de estado do carrinho**Exibição do item do carrinho:****IMPORTANTE: Sempre mostre detalhes da variação (tamanho, cor, material, etc.) para cada item no carrinho.**Sem detalhes da variação, os usuários não conseguem confirmar se adicionaram a variação correta. Isso é especialmente crítico quando os produtos têm várias opções.

- Imagem do produto (miniatura de 60-80px)
- Título do produto (truncado em 2 linhas)
-**Detalhes da variação (OBRIGATÓRIO):**Tamanho, cor, material ou outras opções de variação
  - Formato: "Tamanho: Grande, Cor: Preto" ou "Grande / Preto"
  - Mostre TODAS as opções de variação selecionadas, não apenas o título do produto
  - Exiba abaixo do título, texto menor (cinza)
- Controles da quantidade (+/- botões, debounce 300-500ms)
- Preço unitário e preço total (total da linha = preço*quantidade)
- Botão de remover (ícone X, sem confirmação necessária)**Por que os detalhes da variação são críticos:**- Confirmação do usuário: "Eu adicionei o tamanho certo?"
- Evita a perda de carrinho devido à incerteza
- Permite correções antes do checkout
- Essencial para produtos com várias variantes (roupas, sapatos, produtos configuráveis)

## Ações e CTAs (Call to Action)**Exibição do resumo do carrinho:**- Subtotal (soma de todos os itens)

- Frete e imposto: "Calculado no checkout" ou valor real
- Total: Em negrito e proeminente**Indicador de frete grátis (opcional):**- "Adicione mais $25 para frete grátis" com barra de progresso
- Incentiva pedidos maiores, atualiza conforme o carrinho muda**Códigos promocionais:**- Geralmente NÃO no popup do carrinho (muito apertado)
- Reserve para a página completa do carrinho
- Exceção: Campo de entrada de código se houver espaço**Botões de ação:**1.**Checkout**(principal) - Mais proeminente, cor da marca, navega para o checkout
2.**Ver Carrinho**(secundário) - Contorno ou sutil, navega para a página completa do carrinho

Ambos os botões com largura total, altura de 44-48px em mobile.

## Estado Vazio

Mostre ícone/ilustração + "Seu carrinho está vazio" + Botão "Continuar Comprando". Centralizado, amigável, design minimalista.

## Status de Carregamento e Erro**Ao abrir o popup:**- Mostre um esqueleto/placeholder enquanto recupera (evite tela em branco)**Durante as atualizações:**- Alterações de quantidade: Spinner inline, desabilite os controles, debounce 300-500ms

- Remoção de itens: Animação de fade-out, desabilite o botão de remoção durante a solicitação
- Adicionar ao carrinho: Indicador de carregamento no botão ("Adicionando...")**Tratamento de erros:**- Erros de rede: Opção para tentar novamente, não feche o popup
- ID do carrinho inválido: Crie um novo carrinho automaticamente
- Em falta: Desabilite o aumento da quantidade, mostre mensagem
- Reverta as atualizações otimistas em caso de falha**Animações:**Transições suaves (250-350ms), slide-in drawer, fade-in/out de fundo. Destaque os itens recém-adicionados.

## Considerações para Mobile**Dropdown no mobile:**- Largura total (100% menos margens)

- Altura máxima 60-70% da tela, rolável
- Toque para fechar
- Swipe para fechar (suportado)**Drawer no mobile:**

- 85-95% de largura da tela ou tela inteira
- Desliza da direita ou da parte inferior
- Gestos de deslizar para fechar suportados
- Sobreposição de fundo
