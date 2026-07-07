# Página de confirmação do pedido

## Índice

- [Visão geral](#visao-geral)
- [Informações essenciais](#informacoes-essenciais)
- [Exibição dos detalhes do pedido](#exibicao-dos-detalhes-do-pedido)
- [Seção de próximos passos](#secao-proximos-passos)
- [Padrões de layout](#padroes-de-layout)
- [Botões de chamada à ação](#botoes-de-chamada-à-acao)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

A página de confirmação do pedido é exibida imediatamente após a conclusão bem-sucedida da finalização da compra. Objetivo: confirmar a compra, fornecer os detalhes do pedido, orientar os clientes sobre as próximas etapas e reforçar a confiança pós-compra.

**Integração com o backend:**

Recupere os detalhes do pedido da API do backend imediatamente após a conclusão da finalização da compra. Faça isso com base na integração com o backend. Nunca codifique manualmente nem simule dados do pedido.

### Principais funções do comércio eletrônico

- Confirme a compra bem-sucedida (reduz a ansiedade)
- Forneça o número de referência do pedido (para rastreamento e suporte)
- Defina as expectativas de entrega (reduz as consultas do tipo “cadê meu pedido?”)
- Oriente o cliente sobre as próximas etapas (reduz a carga de trabalho do suporte)
- Incentive compras repetidas (CTA para continuar comprando)
- Crie confiança pós-compra (reduz o remorso do comprador)

## Informações essenciais

### Mensagem de sucesso (CRÍTICA)

**Título de confirmação:**
Título grande e em destaque, mensagem positiva e tranquilizadora, ícone de sucesso (marca de seleção verde), visível imediatamente acima da dobra da página.

**Exemplos de mensagens:**

- “Pedido confirmado!”
- “Obrigado pelo seu pedido!”
- “Sucesso! Seu pedido foi confirmado”

**Subtítulo:**
Breve mensagem tranquilizadora, menção ao e-mail de confirmação, previsão do prazo de entrega.

**Exemplo:**

```
✓ Order Confirmed!

Thank you for your purchase! We've sent a confirmation
email to customer@example.com with your order details.
```

### Número do pedido

**Requisitos de exibição:**

- Muito destacado
- Identificado claramente como “Número do pedido:” ou “Nº do pedido”
- Fácil de selecionar e copiar (texto selecionável)
- Fonte monoespaçada ou sans-serif
- Alto contraste para melhor visibilidade
- Opcional: botão “Copiar” ao lado do número

**Exemplo:**

```
Order Number: #ORD-123456789
```

### Aviso de confirmação por e-mail

E-mail de confirmação enviado, endereço de e-mail utilizado, lembrete para verificar a pasta de spam (opcional), opção de reenviar o e-mail (opcional).

## Exibição dos detalhes do pedido

### Lista de itens pedidos

Exibição por item:

- Imagem do produto (miniatura, 60-80 px)
- Título do produto (nome completo)
- Informações sobre variantes (tamanho, cor, etc.)
- Quantidade (“× 2”)
- Preço unitário
- Total da linha (quantidade × preço)

### Resumo do pedido (preços)

**Discriminação do preço:**

- Subtotal (soma dos itens)
- Custo de frete (com o nome do método)
- Imposto (se aplicável)
- Desconto/código promocional (se utilizado, mostrar a economia)
- **Total do pedido** (em negrito, fonte maior)

**Observação sobre preços no Medusa:**
O Medusa armazena os preços como estão (não em centavos). Exiba os preços diretamente, sem dividir por 100. Exemplo: se o backend retornar 49,99, exiba $49,99.

**Exemplo:**

```
Subtotal:              $139.97
Shipping (Express):      $5.99
Tax:                    $11.20
Discount (SAVE10):     -$14.00
─────────────────────────────
Order Total:           $143.16
```

### Informações de entrega e cobrança

**Endereço de entrega:**
Nome do destinatário, endereço completo, número de telefone, forma de entrega selecionada, data estimada de entrega.

**Endereço de cobrança:**
Se for o mesmo do endereço de entrega: “O mesmo que o endereço de entrega”. Se for diferente: exibir o endereço de cobrança completo.

**Informações de pagamento:**
Tipo de forma de pagamento, últimos 4 dígitos (se for cartão), formas alternativas (e-mail do PayPal, Apple Pay). **Nunca exiba o número completo do cartão.**

## Seção “Próximos Passos”

### O que acontece a seguir (CRÍTICO)

**Orientação sobre prazos:**
Informações sobre o processamento do pedido, prazo de envio, quando o rastreamento estará disponível, data prevista de entrega.

**Exemplo:**

```
What's Next?

1. Order Processing (1-2 business days)
   We're carefully preparing your items for shipment.

2. Shipment Notification
   You'll receive an email with tracking information
   when your order ships.

3. Delivery (By January 30)
   Your package will arrive at your address.
```

**Benefícios:**
Estabelece expectativas claras, reduz as consultas do tipo “cadê meu pedido” e gera confiança no processo.

## Padrões de layout

### Layout de coluna única (recomendado)

Conteúdo em largura total, centralizado na página, com todas as seções dispostas verticalmente. Otimizado para dispositivos móveis por padrão.

**Ordem das seções:**

1. Mensagem de confirmação e número do pedido
2. Notificação de confirmação por e-mail
3. Lista de itens do pedido
4. Resumo do pedido (preços)
5. Endereço de entrega
6. Endereço de cobrança
7. Forma de pagamento
8. Próximos passos/prazo
9. CTAs (continuar comprando, imprimir, rastrear)

### Layout de duas colunas (alternativa para desktop)

- Coluna esquerda (60-70%): Conteúdo principal (confirmação de compra, número do pedido, itens, endereços, próximas etapas)
- Coluna direita (30-40%): Barra lateral (resumo do pedido, CTAs, rastreamento)
- Celular: Reduz-se a uma única coluna

## Botões de chamada à ação

### Ações principais

**Continuar comprando (MAIS IMPORTANTE):**
Botão grande e destacado (cor principal), retorna à página inicial ou à página da loja. Texto: “Continuar comprando” ou “Voltar à loja”. Incentiva visitas repetidas.

### Ações secundárias

**Criar conta (para pedidos de visitantes):**
Incentive a criação de conta, preencha automaticamente o e-mail com os dados do pedido e inclua mensagens sobre benefícios (“Acompanhe seus pedidos com facilidade”). Opcional, não obrigatório.

**Imprimir recibo:**
CSS otimizado para impressão, botão para imprimir a página.

**Suporte ao cliente:**
Link para a página de suporte ou formulário de contato, número de telefone (se disponível), ajuda com dúvidas sobre pedidos.

**Layout dos botões:**
Ação principal em destaque (botão preenchido), ações secundárias menos destacadas (contorno ou link), espaçamento adequado (16–24 px), largura total em dispositivos móveis.

## Considerações para dispositivos móveis

**Apenas coluna única:**
Seções em largura total, espaçamento generoso (16-20px), texto maior para informações importantes, botões otimizados para toque.

**Número do pedido:**
Extragrande (28-36px), altamente visível, fácil de ler e consultar, toque para copiar (se implementado).

**Botões:**
Largura total ou quase total (mínimo de 90%), altura de 48 a 56 px (otimizados para toque), espaçamento de 16 px entre os botões.

**Ações rápidas:**

- Toque no número de telefone para ligar para o suporte
- Toque para copiar o número do pedido
- Adicione a data de entrega ao calendário
- Compartilhe os detalhes do pedido

## Lista de verificação

**Elementos essenciais:**

- [ ] Mensagem de sucesso em destaque (título de 32 a 48 px)
- [ ] Marca de seleção verde ou ícone de sucesso
- [ ] Número do pedido em destaque (24 a 32 px, selecionável)
- [ ] Notificação de confirmação por e-mail
- [ ] Lista de itens do pedido com imagens
- [ ] Detalhes dos itens (título, variante, quantidade, preço)
- [ ] Resumo do pedido (subtotal, frete, impostos, total)
- [ ] Endereço de entrega exibido
- [ ] Endereço de cobrança (ou “igual ao de entrega”)
- [ ] Forma de pagamento (apenas os últimos 4 dígitos)
- [ ] Data estimada de entrega
- [ ] Nome da forma de envio
- [ ] Seção “Próximos passos” (cronograma)
- [ ] Botão “Continuar comprando” (CTA principal)
- [ ] Botão “Imprimir recibo”
- [ ] Link para entrar em contato com o suporte
- [ ] Pedidos como convidado: CTA “Criar conta” (opcional)
- [ ] Integração com o backend (busca de pedidos pela API)
- [ ] Responsivo para dispositivos móveis (coluna única, botões em largura total)
- [ ] HTML semântico (main, section, h1, h2)
- [ ] Rótulos ARIA nas seções
- [ ] Área interativa que indica sucesso
- [ ] Navegação por teclado suportada
- [ ] Texto de alto contraste (mínimo de 4,5:1)
