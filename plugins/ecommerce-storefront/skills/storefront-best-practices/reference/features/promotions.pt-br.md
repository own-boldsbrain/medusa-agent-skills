# Recurso de promoções

## Índice

- [Visão geral](#visao-geral)
- [Tipos de promoção e quando usá-los](#tipos-de-promocao-e-quando-usa-los)
- [Exibição do preço promocional](#exibicao-do-preco-promocional)
- [Inserção do código promocional](#insercao-do-codigo-promocional)
- [Limite para frete grátis](#limite-para-frete-gratis)
- [Banners promocionais](#banners-promocionais)
- [Contadores regressivos](#contadores-regressivos)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

Promoções são reduções temporárias de preço, descontos ou ofertas especiais destinadas a impulsionar as vendas e incentivar as compras. Uma interface de usuário eficaz para promoções comunica claramente o valor, cria urgência e facilita o resgate.

**Integração com o backend (CRÍTICO):**

Toda a lógica e os dados de promoções devem vir do backend do e-commerce. Faça isso com base na integração com o backend. Obtenha as promoções ativas, os códigos de desconto e as regras de preço pela API do backend. Nunca codifique a lógica de promoções diretamente no frontend.

### Principais requisitos de comércio eletrônico

- Comunicação clara sobre descontos (preços riscados, porcentagem de desconto)
- Inserção de código promocional (carrinho/finalização da compra)
- Progresso para frete grátis (aumentar o valor médio do pedido)
- Contadores regressivos (criar urgência)
- Aplicação automática de descontos
- Emblemas de promoção (descoberta de produtos)

### Objetivo

**Otimização da conversão:**

- Impulsionar as vendas e aumentar a taxa de conversão
- Aumentar o valor médio do pedido (limites para frete grátis, descontos por faixas)
- Conquistar novos clientes (descontos na primeira compra)
- Criar urgência (ofertas por tempo limitado)
- Liquidar estoque (promoções sazonais)
- Recompensar a fidelidade (códigos VIP, descontos para membros)

## Tipos de promoção e quando usá-los

### Promoções (reduções de preço)

**O que é**: Produtos selecionados com preços reduzidos, aplicados automaticamente. Não é necessário código.

**Quando usar:**

- Promoções sazonais (Black Friday, promoções de fim de ano)
- Liquidação ou estoque de fim de temporada
- Promoções específicas para produtos
- Quando você quiser que os preços reduzidos fiquem visíveis nas páginas dos produtos (aumenta a taxa de cliques)

**Exibição:**

- Preço original riscado (fornece contexto para a economia)
- Preço promocional em negrito e em destaque (vermelho ou na cor da marca)
- Selo de promoção nos cartões de produto (“Promoção”, “30% de desconto”)

**Implementação no Medusa:**
Use Listas de Preços com preços especiais para os produtos. Isso fornece preços riscados automaticamente no carrinho e nas páginas dos produtos.

### Códigos de desconto

**O que é**: O cliente insere o código para obter o desconto (porcentual, valor fixo ou frete grátis).

**Quando usar:**

- Inscrições na newsletter (“Ganhe 10% de desconto com WELCOME10”)
- Membros do programa VIP ou de fidelidade (códigos exclusivos)
- Campanhas de marketing direcionadas (e-mail, redes sociais)
- Incentivos para novos clientes
- Descontos para amigos e familiares (distribuição limitada)

**Exibição:**

- Campo para inserção do código promocional no carrinho/finalização da compra
- Mensagem de sucesso: “Código aplicado: WELCOME10”
- Desconto exibido no resumo do pedido com o nome do código
- Opção de remoção (ícone X ou link “Remover”)

**Implementação do Medusa:**
Sistema de descontos/códigos promocionais com lógica avançada (descontos por pedido, limites de uso, datas de validade).

### Descontos automáticos

**O que é**: Desconto aplicado automaticamente quando as condições são atendidas. Não é necessário inserir nenhum código.

**Quando usar:**

- Limites para frete grátis (“Frete grátis para compras acima de US$ 50”)
- Descontos por volume (“Gaste US$ 100 e ganhe US$ 20 de desconto”)
- Ofertas do tipo “Compre um, ganhe outro” (BOGO)
- Incentivo a valores maiores no carrinho (aumentar o valor médio do pedido)

**Exibição:**

- Banner anunciando a promoção
- Indicador de progresso em relação ao limite (consulte a seção “Limite para frete grátis”)
- Mensagem “Desconto aplicado” no carrinho
- Adição automática ao resumo do pedido

### Compre X, ganhe Y (BOGO)

**O que é**: Compre determinados produtos para desbloquear itens gratuitos ou com desconto.

**Quando usar:**

- Liquidação de estoque (eliminar produtos de baixa rotatividade)
- Venda cruzada de produtos relacionados (“Compre protetor solar e ganhe 50% de desconto na bolsa de praia”)
- Aumento do número de unidades por transação

**Exibição:**

- Texto claro da promoção na página do produto (“Compre 2, ganhe 1 grátis”)
- Item gratuito/com desconto exibido no carrinho com explicação
- Linha de desconto no resumo do pedido

**Implementação no Medusa:**
Desconto automático “Compre X e ganhe Y”. O item gratuito/com desconto deve ser adicionado ao carrinho para ativar o desconto.

## Exibição do preço promocional

### Padrão de preço com risca

**Formato:**

```
$49.99  $34.99
(Original, strikethrough)  (Sale price, bold)
```

**Design:**

- Preço original: com risca, cor cinza suave, menor
- Preço promocional: em negrito, maior, vermelho ou cor de destaque
- Hierarquia visual clara (o preço promocional se destaca)

**Posicionamento:**

- Fichas de produto: abaixo da imagem
- Página do produto: próximo ao botão “Adicionar ao carrinho”
- Carrinho: coluna de preço do item

### Exibição da porcentagem de desconto

Mostre a economia para destacar o valor.

**Opções:**

- Emblema “Economize 30%”
- Rótulo “30% de desconto”
- “Desconto de $15” (economia absoluta)

**Posicionamento:**

- Emblema na imagem do produto (canto superior esquerdo ou direito)
- Próximo ao preço (ao lado ou abaixo)
- No resumo do carrinho (“Economia total: $45”)

### Emblema de promoção

Emblema chamativo na imagem do produto (vermelho, laranja, amarelo) no canto superior. 48-64px no desktop, 40-48px no celular. Texto: “Promoção”, “30% de desconto” ou “Economize $15”.

## Inserção do código promocional

### Posicionamento e design

**Localização:**
Resumo do pedido na página do carrinho ou na página de finalização da compra. Posicionado na barra lateral direita (computador) ou abaixo dos itens (dispositivos móveis).

**Layout:**

- Rótulo: “Código promocional” ou “Código de desconto”
- Campo de texto (200–280 px no computador, largura total em dispositivos móveis)
- Botão “Aplicar” alinhado ou empilhado (dispositivos móveis)
- Conversão automática para maiúsculas ao enviar (os códigos geralmente são em maiúsculas)

**Padrão expansível (opcional):**
Link “Tem um código promocional?” que se expande para exibir o campo de entrada. Economiza espaço vertical e reduz a poluição visual.

### Estados de sucesso e erro

**Sucesso:**

- Marca de seleção verde ou mensagem de sucesso: “Código aplicado: WELCOME10”
- Desconto exibido no resumo do pedido com o nome do código: “Desconto (WELCOME10) -$10,00”
- Opção de remoção: ícone X ou link “Remover”
- Atualização imediata do total do carrinho

**Erro:**

- Mensagem de erro em vermelho abaixo do campo de entrada: “Código inválido”, “Código expirado” ou “Valor mínimo de compra não atingido”
- O campo de entrada permanece visível para nova tentativa
- Não limpar o campo de entrada (o usuário pode ter cometido um erro de digitação)

**Exibição do código aplicado no resumo do pedido:**

```
Subtotal              $100.00
Discount (WELCOME10)  -$10.00
Shipping              $5.00
─────────────────────
Total                 $95.00
```

## Limite para frete grátis

**Objetivo (CRÍTICO)**: Aumentar o valor médio dos pedidos, incentivando os clientes a adicionarem mais itens para atingir o valor mínimo para frete grátis.

### Padrão da barra de progresso

**Exibição no carrinho:**

- “Adicione mais US$ 25 para FRETE GRÁTIS”
- Barra de progresso horizontal mostrando a proximidade do limite
- Atualiza automaticamente conforme o valor do carrinho muda
- Verde quando o limite é atingido

**Exemplo:**

```
Add $25.00 more for FREE SHIPPING
[███████░░░░░░░░] 50%
```

**Quando o limite é atingido:**

- “Você ganhou frete grátis!” (mensagem de sucesso)
- Marca de seleção verde ou selo
- Taxa de frete riscada no resumo do pedido

**Por que funciona:**

- Visualiza a proximidade da meta (aversão à perda)
- Aumenta o valor médio do pedido (AOV) em 15 a 30%, em média
- Reduz o abandono de carrinho (frete grátis é o principal motivo para concluir a compra)

### Banner de frete grátis

Anúncio em todo o site: “Frete grátis para pedidos acima de US$ 50”. Exiba no banner superior ou próximo ao ícone do carrinho. Visível em todas as páginas para aumentar a visibilidade.

## Banners promocionais

### Banner superior

Faixa que ocupa toda a largura na parte superior da página (48 a 64 px de altura). Cor viva que contraste com a barra de navegação. Mensagem curta: “Frete grátis para pedidos acima de US$ 50” ou “Promoção: até 50% de desconto – Compre agora”.

**Posicionamento:**

- Acima da barra de navegação (mais comum)
- Abaixo da barra de navegação (alternativa)
- Fixo (permanece visível durante a rolagem, opcional)

**CTA:**
Link para a página da promoção (“Compre agora”, “Saiba mais”) ou banner inteiro clicável.

### Banner Hero

Grande seção hero na página inicial com mensagem promocional. Imagem de fundo, título (“Promoção da Black Friday”), subtítulo (“Até 60% de desconto em todo o site”), botão de CTA (“Compre na promoção”), contador regressivo opcional.

### Banners embutidos

Dentro do conteúdo da página (páginas de produtos, carrinho). Exemplos: lembrete de frete grátis na página do carrinho, “A promoção termina em breve” na página do produto. Menos destacados que o banner principal.

## Contadores regressivos

Use-os em promoções com prazo limitado para criar urgência e o sentimento de “FOMO” (medo de ficar de fora).

**Quando usar:**

- Vendas relâmpago (promoções de 24 horas)
- Ofertas por tempo limitado
- Promoções de feriados
- Nunca em promoções permanentes (a urgência falsa prejudica a confiança)

**Formato de exibição:**

- “A promoção termina em: 2d 14h 32m 15s”
- Ou, de forma mais simples: “Termina em 2 dias”
- Ou: “Corra! Faltam apenas 14 horas”

**Posicionamento:**
Banner superior, página do produto próximo ao preço, página do carrinho ou seção de destaque.

**Implementação:**
Tempo calculado no servidor para evitar manipulação pelo cliente, ocultação automática ao expirar, atualização em tempo real.

## Considerações para dispositivos móveis

**Banner superior:**
Texto mais curto (menos palavras), altura menor (40-48px), com opção de fechar (botão X).

**Emblemas de promoção:**
Ligeiramente menores (40-48px), mas ainda claramente visíveis; não devem obstruir a imagem do produto.

**Campo de inserção do código promocional:**
Campo e botão em largura total, layout empilhado (campo acima do botão), áreas de toque amplas (48 px de altura), seção expansível para economizar espaço.

**Contador regressivo:**
Formato simplificado (“Termina em 14 horas” em vez de d:h:m:s completo), texto maior para facilitar a leitura.

## Lista de verificação

**Recursos essenciais:**

- [ ] Preço original riscado para promoções
- [ ] Preço promocional em negrito, destacado e colorido
- [ ] Emblemas de promoção nas imagens dos produtos (40-64px)
- [ ] Porcentagem de desconto exibida (“30% de desconto”)
- [ ] Campo para inserção do código promocional no carrinho/finalização da compra
- [ ] Botão “Aplicar” ao lado do campo de código promocional
- [ ] Mensagem de sucesso após a aplicação do código
- [ ] Mensagem de erro para códigos inválidos
- [ ] Código aplicado exibido no resumo do pedido com o nome
- [ ] Opção para remover o código (ícone X ou link “Remover”)
- [ ] Economia total destacada no carrinho
- [ ] Barra de progresso do frete grátis (se aplicável)
- [ ] Atualizações de progresso conforme o valor do carrinho muda
- [ ] Mensagem de sucesso quando o valor mínimo for atingido
- [ ] Contador regressivo para ofertas por tempo limitado (do lado do servidor)
- [ ] Banners promocionais (banner superior, hero)
- [ ] Integração com o backend (busca de promoções pela API)
- [ ] Celular: campo de promoção em largura total, layout empilhado
- [ ] Celular: alvos de toque grandes (48px)
- [ ] Seção de promoções expansível (opcional, economiza espaço)
- [ ] Rótulos ARIA no campo de promoção
- [ ] Anúncios do leitor de tela para alterações de preço
- [ ] Acessível por teclado (Tab, Enter)
- [ ] Texto com alto contraste (mínimo de 4,5:1)
