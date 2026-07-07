# Recurso de Promoções

## Conteúdo

- [Visão Geral](#visao-geral)
- [Tipos de Promoção e Quando Usá-los](#tipos-de-promocao-e-quando-usa-los)
- [Exibição do Preço Promocional](#exibicao-do-preco-promocional)
- [Entrada de Código Promocional](#entrada-de-codigo-promocional)
- [Limite de Frete Grátis](#limite-de-frete-gratis)
- [Banners Promocionais](#banners-promocionais)
- [Temporizadores de Contagem Regressiva](#temporizadores-de-contagem-regressiva)
- [Considerações para Dispositivos Móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

Promoções são reduções temporárias de preço, descontos ou ofertas especiais projetadas para impulsionar as vendas e incentivar as compras. Uma interface de promoção eficaz comunica claramente o valor, cria urgência e facilita o resgate.

**Integração de Backend (CRÍTICO):**

Toda a lógica de promoção e os dados devem vir do backend de e-commerce. Faça isso com base no backend integrado. Busque promoções ativas, códigos de desconto e regras de preço da API do backend. Nunca codifique a lógica de promoção (hardcode) no frontend.

### Requisitos Principais de E-commerce

- Comunicação clara de desconto (preço riscado, porcentagem de desconto)
- Entrada de código promocional (carrinho/checkout)
- Progresso do limite de frete grátis (aumentar AOV)
- Temporizadores de contagem regressiva (criar urgência)
- Aplicação automática de desconto
- Selos de promoção (descoberta de produtos)

### Objetivo

**Otimização de conversão:**

- Aumentar as vendas e melhorar a taxa de conversão
- Aumentar o valor médio do pedido (limites de frete grátis, descontos escalonados)
- Adquirir novos clientes (descontos na primeira compra)
- Criar urgência (ofertas por tempo limitado)
- Limpar estoque (promoções sazonais)
- Recompensar fidelidade (códigos VIP, descontos para membros)

## Tipos de Promoção e Quando Usá-los

### Promoções (Reduções de Preço)

**O que é**: Produtos selecionados com preços reduzidos, aplicados automaticamente. Nenhum código necessário.

**Use quando:**

- Promoções sazonais (Black Friday, liquidações de fim de ano)
- Liquidação ou estoque de fim de temporada
- Promoções específicas de produtos
- Você deseja que preços reduzidos sejam visíveis nas páginas de produtos (aumenta os cliques)

**Exibição:**

- Preço original riscado (fornece contexto para economia)
- Preço promocional em negrito e proeminente (vermelho ou cor de destaque)
- Selo de promoção nos cards de produtos ("Promoção", "30% de Desconto")

**Implementação Medusa:**
Use Price Lists com preços especiais para produtos. Fornece o preço riscado automaticamente no carrinho e nas páginas de produtos.

### Códigos de Desconto

**O que é**: O cliente insere um código para desbloquear um desconto (porcentagem, valor fixo ou frete grátis).

**Use quando:**

- Inscrições de newsletter ("Ganhe 10% de desconto com WELCOME10")
- Membros de programa VIP ou fidelidade (códigos exclusivos)
- Campanhas de marketing direcionadas (e-mail, mídias sociais)
- Incentivos para clientes da primeira compra
- Descontos para amigos e família (distribuição limitada)

**Exibição:**

- Campo de entrada de código promocional no carrinho/checkout
- Mensagem de sucesso: "Código aplicado: WELCOME10"
- Desconto exibido no resumo do pedido com o nome do código
- Opção de remover (ícone X ou link "Remover")

**Implementação Medusa:**
Sistema de código de desconto/promo com lógica avançada (descontos no nível do pedido, limites de uso, datas de validade).

### Descontos Automáticos

**O que é**: Desconto aplicado automaticamente quando as condições são atendidas. Não é necessário inserir código.

**Use quando:**

- Limites de frete grátis ("Frete grátis acima de $50")
- Descontos por volume ("Gaste $100, ganhe $20 de desconto")
- Ofertas do tipo Compre Um Leve Outro (BOGO)
- Incentivar valores de carrinho maiores (aumentar AOV)

**Exibição:**

- Banner anunciando a promoção
- Indicador de progresso em direção ao limite (ver seção Limite de Frete Grátis)
- Mensagem "Desconto aplicado" no carrinho
- Adição automática ao resumo do pedido

### Compre X, Ganhe Y (BOGO)

**O que é**: Compre determinados produtos para desbloquear itens gratuitos/com desconto.

**Use quando:**

- Mover estoque (limpar produtos de movimentação lenta)
- Cross-selling de produtos relacionados ("Compre protetor solar, ganhe bolsa de praia com 50% de desconto")
- Aumentar unidades por transação

**Exibição:**

- Texto de promoção claro na página do produto ("Compre 2, Leve 1 Grátis")
- Item gratuito/com desconto exibido no carrinho com explicação
- Linha de desconto no resumo do pedido

**Implementação Medusa:**
Desconto automático Compre X Ganhe Y. O item gratuito/com desconto deve ser adicionado ao carrinho para ser ativado.

## Exibição do Preço Promocional

### Padrão de Preço Riscado

**Formato:**

```
$49.99  $34.99
(Original, strikethrough)  (Sale price, bold)
```

**Design:**

- Preço original: Riscado, cor cinza suave, menor
- Preço promocional: Negrito, maior, vermelho ou cor de destaque
- Hierarquia visual clara (preço promocional domina)

**Posicionamento:**

- Cards de produto: Abaixo da imagem
- Página do produto: Perto do botão "Adicionar ao Carrinho"
- Carrinho: Coluna de preço do item

### Exibição de Porcentagem de Desconto

Mostre a economia para enfatizar o valor.

**Opções:**

- Selo "Economize 30%"
- Rótulo "30% de Desconto"
- "$15 de Desconto" (economia absoluta)

**Posicionamento:**

- Selo na imagem do produto (canto superior esquerdo ou superior direito)
- Próximo ao preço (em linha ou abaixo)
- No resumo do carrinho ("Economia total: $45")

### Selo de Promoção

Selo brilhante na imagem do produto (vermelho, laranja, amarelo) no canto superior. 48-64px desktop, 40-48px mobile. Texto: "Promoção", "30% de Desconto" ou "Economize $15".

## Entrada de Código Promocional

### Posicionamento e Design

**Localização:**
Resumo do pedido na página do carrinho ou página de checkout. Posição na barra lateral direita (desktop) ou abaixo dos itens (dispositivos móveis).

**Layout:**

- Rótulo: "Código promocional" ou "Código de desconto"
- Entrada de texto (200-280px desktop, largura total em dispositivos móveis)
- Botão "Aplicar" em linha ou empilhado (dispositivos móveis)
- Letras maiúsculas automáticas ao enviar (códigos geralmente são em maiúsculas)

**Padrão expansível (opcional):**
Link "Tem um código promocional?" que se expande para mostrar a entrada. Economiza espaço vertical, reduz a confusão visual.

### Estados de Sucesso e Erro

**Sucesso:**

- Marca de seleção verde ou mensagem de sucesso: "Código aplicado: WELCOME10"
- Desconto exibido no resumo do pedido com o nome do código: "Desconto (WELCOME10) -$10.00"
- Opção de remover: Ícone X ou link "Remover"
- Atualizar total do carrinho imediatamente

**Erro:**

- Mensagem de erro vermelha abaixo da entrada: "Código inválido", "Código expirado" ou "Compra mínima não atingida"
- A entrada permanece visível para tentar novamente
- Não limpe o campo de entrada (o usuário pode ter cometido um erro de digitação)

**Exibição do código aplicado no resumo do pedido:**

```
Subtotal              $100.00
Discount (WELCOME10)  -$10.00
Shipping              $5.00
─────────────────────
Total                 $95.00
```

## Limite de Frete Grátis

**Propósito (CRÍTICO)**: Aumentar o valor médio do pedido incentivando clientes a adicionar mais itens para alcançar o frete grátis.

### Padrão de Barra de Progresso

**Exibição no carrinho:**

- "Adicione mais $25 para FRETE GRÁTIS"
- Barra de progresso horizontal mostrando proximidade ao limite
- Atualiza automaticamente conforme o valor do carrinho muda
- Verde quando o limite é atingido

**Exemplo:**

```
Add $25.00 more for FREE SHIPPING
[███████░░░░░░░░] 50%
```

**Quando o limite é atingido:**

- "Você desbloqueou o frete grátis!" (mensagem de sucesso)
- Marca de seleção verde ou selo
- Custo de frete riscado no resumo do pedido

**Por que funciona:**

- Visualiza a proximidade da meta (aversão à perda)
- Aumenta o AOV em 15-30% em média
- Reduz o abandono do carrinho (o frete grátis é o motivo principal para concluir a compra)

### Banner de Frete Grátis

Anúncio em todo o site: "Frete grátis em pedidos acima de $50". Exiba no top banner ou próximo ao ícone do carrinho. Visível em todas as páginas para conscientização.

## Banners Promocionais

### Top Banner

Faixa de largura total no topo da página (48-64px de altura). Cor brilhante contrastando com a barra de navegação. Mensagem curta: "Frete grátis em pedidos acima de $50" ou "Promoção: Até 50% de desconto - Compre Agora".

**Posição:**

- Acima da navbar (mais comum)
- Abaixo da navbar (alternativa)
- Fixo (permanece visível ao rolar, opcional)

**CTA:**
Link para a página da promoção ("Compre Agora", "Saiba Mais") ou banner inteiro clicável.

### Hero Banner

Seção hero grande na página inicial com mensagem promocional. Imagem de fundo, título ("Promoção de Black Friday"), subtítulo ("Até 60% de desconto em todo o site"), botão CTA ("Aproveite a Promoção"), temporizador de contagem regressiva opcional.

### Banners Em Linha

Dentro do conteúdo da página (páginas de produto, carrinho). Exemplos: Lembrete de frete grátis na página do carrinho, "A promoção termina em breve" na página do produto. Menos proeminente que o hero.

## Temporizadores de Contagem Regressiva

Use para promoções sensíveis ao tempo para criar urgência e FOMO.

**Quando usar:**

- Vendas relâmpago (promoções de 24 horas)
- Ofertas por tempo limitado
- Promoções de fim de ano
- Nunca para promoções permanentes (urgência falsa prejudica a confiança)

**Formato de exibição:**

- "A promoção termina em: 2d 14h 32m 15s"
- Ou mais simples: "Termina em 2 dias"
- Ou: "Rápido! Restam apenas 14 horas"

**Posicionamento:**
Top banner, página do produto perto do preço, página do carrinho ou seção hero.

**Implementação:**
Tempo via server-side para evitar manipulação do cliente, ocultar automaticamente quando expirado, atualizar em tempo real.

## Considerações para Dispositivos Móveis

**Top banner:**
Texto mais curto (menos palavras), menor altura (40-48px), descartável (botão X).

**Selos de promoção:**
Ligeiramente menores (40-48px), ainda claramente visíveis, não obstrua a imagem do produto.

**Entrada de código promocional:**
Entrada e botão com largura total, layout empilhado (entrada acima do botão), grandes alvos de toque (altura de 48px), seção expansível para economizar espaço.

**Temporizador de contagem regressiva:**
Formato simplificado ("Termina em 14 horas" vs formato completo d:h:m:s), texto maior para legibilidade.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Preço original riscado para promoções
- [ ] Preço promocional em negrito, proeminente e colorido
- [ ] Selos de promoção em imagens de produtos (40-64px)
- [ ] Porcentagem de desconto exibida ("30% de Desconto")
- [ ] Campo de entrada de código promocional no carrinho/checkout
- [ ] Botão "Aplicar" ao lado da entrada da promoção
- [ ] Mensagem de sucesso após aplicar o código
- [ ] Mensagem de erro para códigos inválidos
- [ ] Código aplicado exibido no resumo do pedido com nome
- [ ] Opção de remover código (ícone X ou link "Remover")
- [ ] Total de economias destacado no carrinho
- [ ] Barra de progresso de frete grátis (se aplicável)
- [ ] Atualizações de progresso conforme o valor do carrinho muda
- [ ] Mensagem de sucesso quando o limite é atingido
- [ ] Temporizador de contagem regressiva para ofertas por tempo limitado (server-side)
- [ ] Banners promocionais (top banner, hero)
- [ ] Integração de backend (buscar promoções da API)
- [ ] Dispositivos móveis: Entrada de promoção com largura total, layout empilhado
- [ ] Dispositivos móveis: Grandes alvos de toque (48px)
- [ ] Seção de promoção expansível (opcional, economiza espaço)
- [ ] Rótulos ARIA na entrada da promoção
- [ ] Anúncios de leitor de tela para mudanças de preço
- [ ] Acessível via teclado (Tab, Enter)
- [ ] Texto de alto contraste (mínimo de 4.5:1)
