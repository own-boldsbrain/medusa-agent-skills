# Recurso de Promoções

## Conteúdo

- [Visão Geral](#visão-geral)
- [Tipos de Promoção e Quando Usá-los](#tipos-de-promoção-e-quando-usá-los)
- [Exibição do Preço de Venda](#exibicao-do-preco-de-venda)
- [Código de Promoção de Entrada](#codigo-de-promocao-de-entrada)
- [Limiar de Frete Grátis](#limiar-de-frete-grátis)
- [Banners Promocionais](#banners-promocionais)
- [Temporizadores de Contagem Regressiva](#countdown-timers)
- [Considerações de Móvel](#considerações-de-móvel)
- [Lista de Verificação](#checklist)

## Resumo

Promoções são reduções temporárias de preço, descontos ou ofertas especiais projetadas para impulsionar as vendas e incentivar as compras. Uma interface de promoção eficaz comunica claramente o valor, cria urgência e facilita o resgate.

**Integração de Back-end (CRÍTICO):**

Todas as lógicas de promoção e dados devem vir do backend de ecommerce. Faça isso com base no backend integrado. Faça o fetch de promoções ativas, códigos de desconto e regras de preço do backend API. Nunca hardcode a lógica de promoção no frontend.

### Requisitos Básicos do Comércio Eletrônico

### Requisitos Básicos do Comércio Eletrônico

#### 1. **Integração com o sistema de pagamento**Para que o sistema de pagamento seja integrado com o sistema de comércio eletrônico, é necessário:***Integração com cartões de crédito**(Visa, Mastercard, American Express, etc.)***Integração com serviços de pagamento online**(PayPal, PagSeguro, etc.)***Integração com outros métodos de pagamento**(Boleto, Depósito, etc.)

#### 2.**Segurança e privacidade**Para garantir a segurança e privacidade dos clientes, é necessário:***Criptografia de dados**(HTTPS, SSL, etc.)***Autenticação de usuários**(login, senha, etc.)***Proteção contra ataques cibernéticos**(firewall, antivírus, etc.)

#### 3.**Interação com o cliente**Para que o sistema de comércio eletrônico seja interativo e atraente para o cliente, é necessário:***Interface de usuário amigável**(design responsivo, fácil de usar, etc.)***Suporte a múltiplos idiomas**(português, inglês, espanhol, etc.)***Suporte a diferentes dispositivos**(desktop, tablet, smartphone, etc.)

#### 4.**Integração com sistemas externos**Para que o sistema de comércio eletrônico seja integrado com outros sistemas externos, é necessário:***Integração com sistemas de gestão de estoque**(ERP, etc.)***Integração com sistemas de gerenciamento de pedidos**(WMS, etc.)***Integração com sistemas de análise de dados**(BI, etc.)

#### 5.**Manutenção e atualização**Para que o sistema de comércio eletrônico seja atualizado e mantido de forma eficaz, é necessário:***Manutenção regular**(atualização de software, etc.)***Suporte técnico**(suporte a clientes, etc.)***Desenvolvimento contínuo** (melhoria do sistema, etc.)

- Comunicação de desconto claro (preço com linha de corte, porcentagem de desconto)
- Código de promoção de entrada (carrinho/checkout)
- Progresso do limite para frete grátis (aumentar AOV)
- Contadores de tempo (criar urgência)
- Aplicação de desconto automática
- Insígnias de venda (descoberta de produtos)

### Objetivo

**Otimização de conversão:**

- Aumente as vendas e melhore a taxa de conversão.
- Aumente o valor médio do pedido (limite de frete grátis, descontos escalonados)
- Adquirir novos clientes (descontos na primeira compra)
- Crie urgência (ofertas de tempo limitado)
- Limpar inventário (promoções sazonais)
- Reward loyalty (VIP codes, member discounts)

## Tipos de Promoção e Quando Usá-los

### Vendas (Reduções de Preço)

**O que é**: Selecione produtos com preços reduzidos, aplicados automaticamente. Nenhum código necessário.

**Use quando:**

- Vendas sazonais (Black Friday, vendas de feriado)
- Liquidação ou inventário de fim de temporada

***Clearance**: <https://pt.wikipedia.org/wiki/Liquidação_(comércio)>
***end-of-season inventory**:

    ```markdown
    # Inventário de fim de temporada

    ## Descrição

    O inventário de fim de temporada é uma prática comum em lojas e empresas que vendem produtos de moda, eletrônicos e outros itens que têm uma estação de vida curta.

    ## Motivos

    ***Descontinuação de produtos**: Quando uma empresa decide descontinuar um produto ou linha de produtos, ela precisa vender os estoques existentes para evitar perdas financeiras.
    ***Estoque excessivo**: Se uma empresa tem um estoque excessivo de produtos, ela precisa vender esses itens para liberar espaço e evitar custos de armazenamento.
    ***Mudanças de estilo**: Quando há mudanças de estilo ou tendências, as lojas precisam vender os produtos que não mais são populares e substituí-los por novos itens.

    ## Tipos de inventário de fim de temporada

    ***Liquidação**: É uma venda em massa de produtos com descontos significativos, geralmente para esvaziar o estoque e evitar perdas financeiras.
    ***Venda de fim de temporada**: É uma venda que ocorre no final de uma estação de vida (por exemplo, no final do verão ou do inverno) para vender produtos que não mais são populares.
    ***Venda de produtos de descontinuação**: É uma venda de produtos que foram descontinuados pela empresa, geralmente com descontos significativos.

    ## Benefícios

    ***Venda de estoque**: O inventário de fim de temporada ajuda a vender o estoque existente e evitar perdas financeiras.
    ***Liberar espaço**: Ao vender os produtos, as lojas podem liberar espaço e evitar custos de armazenamento.
    ***Mudanças de estilo**: O inventário de fim de temporada permite que as lojas mudem de estilo e substituam produtos que não mais são populares.
    ```

- Promoções específicas do produto
- Você deseja que os preços reduzidos estejam visíveis nas páginas de produtos (aumenta a taxa de cliques)

**Display:**

- Risque o preço original (fornece contexto para economia)
- Preço de venda **em destaque e proeminente** (vermelho ou cor da marca)
- Badge de venda em cartões de produto ("Venda", "30% de Desconto")

**Implementação da Medusa:**
Use Price Lists com preços especiais para produtos. Fornece preço de risco automático no carrinho e nas páginas de produtos.

### Códigos de Desconto

**O que é**: O cliente insere um código para desbloquear um desconto (porcentagem, valor fixo ou frete grátis).

**Use quando:**

- Inscrições no boletim informativo ("Obtenha 10% de desconto com WELCOME10")
- Membros do programa VIP ou de fidelidade (códigos exclusivos)
- Campanhas de marketing direcionadas (e-mail, redes sociais)
- Incentivos para clientes pela primeira vez
- Descontos para amigos e familiares (distribuição limitada)

**Exibição:**

- Campo de entrada de código promocional no carrinho/checkout
- Mensagem de sucesso: "Código aplicado: WELCOME10"
- Desconto exibido na resumo da ordem com nome do código
- Remover opção (ícone X ou link "Remover")

**Implementação da Medusa:**
Sistema de código de desconto/promo com lógica avançada (descontos por ordem, limites de uso, datas de vencimento).

### Descontos Automáticos

**O que é**: Desconto aplicado automaticamente quando as condições são atendidas. Não é necessário inserir um código.

**Use quando:**

- Limite de envio grátis ("Envio grátis a partir de $50")
- Descontos de volume ("Gaste $100, ganhe $20 de desconto")
- Buy One Get One (BOGO) offers
- Incentivando valores maiores de carrinho (aumentar AOV)

**Exibição:**

- Banner anunciando a promoção
- Indicador de progresso em direção ao limite (ver seção Limite de Frete Grátis)
- Mensagem "Desconto aplicado" no carrinho
- Adição automática à soma do pedido

### Compre X, Ganhe Y (BOGO)

**O que é**: Compre determinados produtos para desbloquear itens grátis/descontos.

**Use quando:**

- Movimentação de estoque (eliminar produtos de baixa rotação)
- Venda cruzada de produtos relacionados ("Compre protetor solar, ganhe 50% de desconto na bolsa de praia")
- Aumento de unidades por transação

**Exibição:**

- Texto de promoção claro na página do produto ("Compre 2, Leve 3")
- Item gratuito/com desconto mostrado no carrinho com explicação
- Linha de desconto no resumo do pedido

**Implementação da Medusa:**  
Compre X, ganhe Y com desconto automático. O item gratuito/descontado deve ser adicionado ao carrinho para ativar.

## Exibição de Preço Promocional

### Riscado Pricing Pattern

**Formato:**

```
$49.99  $34.99
(Original, strikethrough)  (Sale price, bold)
```

**Design:**

- Preço original: ~~cinza claro desbotado~~, menor
- Preço de promoção: **negrito**, maior, vermelho ou cor de destaque
- Hierarquia visual clara (o preço de venda domina)

**Colocação:**

- Cartões de produto: Abaixo imagem
- Página do produto: Perto do botão "Adicionar ao Carrinho"
- Carrinho: Coluna de preço do item

### Porcentagem de Desconto na Exibição

Mostre as economias para enfatizar o valor.

**Opções:**

- "Emblema de 'Economize 30%'"
- "30% de desconto" label
- "$15 de desconto" (economia absoluta)

**Colocação:**

- Insígnia na imagem do produto (canto superior esquerdo ou canto superior direito)
- Preço próximo (inline ou abaixo)
- No resumo do carrinho ("Economias totais: $45")

### Tag de Oferta

Insígnia brilhante na imagem do produto (vermelho, laranja, amarelo) no canto superior. 48-64px desktop, 40-48px mobile. Texto: "Promoção", "30% de Desconto" ou "Economize $15".

## Código Promocional

### Colocação e Design

**Location:**
Cart page order summary or checkout page. Position in right sidebar (desktop) or below items (mobile).

**Layout:**

- Rótulo: "Cupom promocional" ou "Código de desconto"
- Texto de entrada (200-280px desktop, largura total no celular)
- Botão "Aplicar" em linha ou empilhado (móvel)
- Auto-uppercase ao enviar (códigos geralmente maiúsculos)

**Padrão expansível (opcional):**
Link "Possui um código promocional?" que expande para exibir o campo de entrada. Economiza espaço vertical, reduz a desordem visual.

### Sucesso e Estados de Erro

**Sucesso:**

- Marca de seleção verde ou mensagem de sucesso: "Código aplicado: WELCOME10"
- Desconto exibido na soma do pedido com o nome do código: "Desconto (WELCOME10) -$10,00"
- Remover opção: ícone X ou link "Remover"
- Atualizar total do carrinho imediatamente

**Erro:**

- Mensagem de erro vermelha abaixo do campo de entrada: "Código inválido", "Código expirado" ou "Compra mínima não atingida"
- A entrada permanece visível para nova tentativa
- Não limpe o campo de entrada (o usuário pode ter cometido um erro de digitação).

**Exibição do código aplicado no resumo do pedido:**

```
Subtotal              $100.00
Discount (WELCOME10)  -$10.00
Shipping              $5.00
─────────────────────
Total                 $95.00
```

## Limiar de Frete Grátis

**Objetivo (CRÍTICO)**: Aumentar o valor médio do pedido incentivando os clientes a adicionar mais itens para atingir o frete grátis.

### Barra de Progresso Pattern

**Exibir no carrinho:**

- "Adicione mais $25 para FRETE GRÁTIS"
- Barra de progresso horizontal mostrando proximidade ao limite
- Updates automatically as cart value changes
- Verde quando o limite for atingido

**Exemplo:**

```
Add $25.00 more for FREE SHIPPING
[███████░░░░░░░░] 50%
```

**Quando o limite for alcançado:**

- "Você desbloqueou o frete grátis!" (mensagem de sucesso)
- Green checkmark or badge
- Cobrança de frete riscada no resumo do pedido

**Por que funciona:**

- Visualiza a proximidade do objetivo (aversão à perda)
- Aumenta o AOV em 15-30% em média
- Reduz o abandono de carrinho (o frete grátis é o principal motivo para concluir a compra)

### Banner de Frete Grátis

Anúncio em todo o site: "Frete grátis em pedidos acima de $50". Exibir no banner superior ou próximo ao ícone do carrinho. Visível em todas as páginas para conscientização.

## Banners Promocionais

### Faixa Superior

Faixa de largura total no topo da página (altura de 48-64px). Cor vibrante contrastando com a barra de navegação. Mensagem curta: "Frete grátis em pedidos acima de R$50" ou "Promoção: Até 50% de desconto - Compre Agora".

**Posição:**

- Acima da navbar (mais comum)
- Abaixo da navbar (alternativa)
- Sticky (permanece visível ao rolar, opcional)

**CTA:**
Link para página de venda ("Compre Agora", "Saiba Mais") ou banner todo clicável.

### Herói Banner

Seção de destaque grande na página inicial com mensagem promocional. Imagem de fundo, manchete ("Promoção de Black Friday"), subtítulo ("Até 60% de desconto em todo o site"), botão de CTA ("Aproveitar a Oferta"), cronômetro opcional.

### Banners Inline

Within page content (product pages, cart). Examples: Free shipping reminder on cart page, "Sale ends soon" on product page. Less prominent than hero.

## Countdown Timers

Use for time-sensitive promotions to create urgency and FOMO.

**Quando usar:**

- Flash sales (24-hour sales)
- Ofertas por tempo limitado
- Promoções de feriado
- Nunca para vendas permanentes (urgência falsa prejudica a confiança)

**Display format:**

- "Venda termina em: 2d 14h 32m 15s"
- Or simpler: "Ends in 2 days"
- Ou: "Rápido! Restam apenas 14 horas"

**Colocação:**  
Banner superior, página do produto próximo ao preço, página do carrinho ou seção principal.

**Implementation:**
Server-side time to prevent client manipulation, auto-hide when expired, update in real-time.

## Considerações Móveis

**Top banner:**
Shorter text (fewer words), smaller height (40-48px), dismissible (X button).

**Sale badges:**
Slightly smaller (40-48px), still clearly visible, don't obstruct product image.

**Promo code input:**
Full-width input and button, stacked layout (input above button), large touch targets (48px height), expandable section to save space.

**Cronômetro regressivo:**
Formato simplificado ("Termina em 14 horas" vs completo d:h:m:s), texto maior para melhor legibilidade.

## Checklist

**Recursos essenciais:**

- [ ] Riscar o preço original para vendas
- [ ] Preço de venda em negrito, destacado, colorido
- [ ] Emblemas de promoção nas imagens dos produtos (40-64px)
- [ ] Porcentagem de desconto exibida ("30% Off")
- [ ] Campo de entrada de código promocional no carrinho/checkout
- [ ] Botão "Aplicar" ao lado do campo de entrada de promoção
- [ ] Success message after applying code
- [ ] Error message for invalid codes
- [ ] Código aplicado exibido no resumo do pedido com nome
- [ ] Remover opção de código (ícone X ou link "Remover")
- [ ] Economias totais destacadas no carrinho
- [ ] Barra de progresso de frete grátis (se aplicável)
- [ ] Progress updates as cart value changes
- [ ] Success message when threshold met
- [ ] Countdown timer for time-limited offers (server-side)
- [ ] Promotional banners (top banner, hero)
- [ ] Integração com o backend (buscar promoções da API)
- [ ] Mobile: Full-width promo input, stacked layout
- [ ] Mobile: Alvos de toque grandes (48px)
- [ ] Expandable promo section (optional, saves space)
- [ ] ARIA labels on promo input
- [ ] Anúncios de leitor de tela para mudanças de preço
- [ ] Acessível via teclado (Tab, Enter)
- [ ] Texto de alto contraste (mínimo de 4,5:1)
