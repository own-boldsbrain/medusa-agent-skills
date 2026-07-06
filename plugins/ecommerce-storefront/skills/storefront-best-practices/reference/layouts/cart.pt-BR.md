# Página do carrinho

## Índice

- [Visão geral](#visao-geral)
- [Padrões de layout](#padroes-de-layout)
- [Exibição dos itens do carrinho](#exibicao-dos-itens-do-carrinho)
- [Atualizações de quantidade](#atualizacoes-de-quantidade)
- [Resumo do pedido](#resumo-do-pedido)
- [Inserção de código promocional](#insercao-do-codigo-promocional)
- [Botão de finalização da compra](#botao-de-finalizacao-da-compra)
- [Estado do carrinho vazio](#estado-do-carrinho-vazio)
- [Integração com o backend](#integracao-com-o-backend)
- [Carrinho para dispositivos móveis](#carrinho-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

A página do carrinho exibe todos os itens que um cliente adicionou ao seu carrinho de compras. Objetivo: revisar os itens, modificar o carrinho, aplicar promoções e prosseguir para o checkout. Ponto crítico de conversão.

**⚠️ IMPORTANTE: Sempre exiba os detalhes das variantes (tamanho, cor, material etc.) de cada item do carrinho, e não apenas os títulos dos produtos.**

### Principais funções do comércio eletrônico

- Revisar os itens antes da compra (reduz o remorso do comprador)
- Atualizar quantidades ou remover itens (gerenciamento do carrinho)
- Aplicar códigos promocionais (aumentar o valor do pedido)
- Visualizar a composição do preço (a transparência gera confiança)
- Prosseguir para o checkout (caminho de conversão)
- Continuar comprando, se necessário (reduzir o abandono)

## Padrões de layout

### Padrão de duas colunas (desktop)

**Mais comum:**

- Coluna esquerda (60-70%): Lista de itens do carrinho
- Coluna direita (30-40%): Resumo do pedido (fixo)
- Abaixo dos itens: Campo para código promocional, continuar comprando
- O resumo do pedido permanece visível durante a rolagem

### Layout para celular

Coluna única (empilhada):

- Itens do carrinho
- Resumo do pedido
- Campo para inserção do código promocional
- Botão de finalização da compra (fixo na parte inferior)
- Continuar comprando

## Exibição dos itens do carrinho

### Cartão do item do carrinho

**CRÍTICO: Sempre exiba os detalhes das variantes para cada item do carrinho.**

Produtos com variantes (tamanho, cor, material, estilo etc.) devem mostrar as opções de variantes selecionadas. Sem isso, os clientes não podem confirmar se têm os itens corretos em seus carrinhos.

**Informações essenciais por item:**

- Imagem do produto (miniatura, 80-120 px no desktop, 60-80 px no celular)
- Título do produto (com link para a página do produto)
- **Detalhes da variante (OBRIGATÓRIO)**: Tamanho, cor, material ou outras opções de variante selecionadas
  - Formato: “Tamanho: Grande, Cor: Preto” ou “Grande / Preto”
  - Exibir abaixo do título, em texto cinza menor
  - Mostrar TODAS as opções de variante selecionadas
- Preço unitário
- Seletor de quantidade
- Total da linha (preço unitário × quantidade)
- Botão “Remover” (ícone X)

**Layout:**
Cartão horizontal (imagem à esquerda, detalhes à direita), separação visual clara entre os itens, espaçamento adequado (16-24px).

**Por que os detalhes da variante são essenciais:**

- Confirmação do cliente antes da finalização da compra
- Evita devoluções decorrentes da compra da variante errada
- Permite a correção fácil caso haja uma variante errada no carrinho
- Essencial para roupas, calçados e produtos configuráveis

### Exibição de preços

**Preços no Medusa (CRÍTICO):**
O Medusa armazena os preços como estão (não em centavos). Exiba os preços diretamente, sem dividir por 100. Exemplo: se o Medusa retornar 49,99, exiba $49,99 (não $0,4999). Diferente do Stripe, que armazena os preços em centavos.

**Preços promocionais:**
Mostre o preço original (riscado) e o preço promocional de forma destacada, caso o produto esteja em promoção.

**Total da linha:**
Total do item (preço × quantidade), em negrito ou fonte maior, atualizado dinamicamente quando a quantidade for alterada.

## Atualizações de quantidade

### Seletor de quantidade

Botões padrão +/- com exibição numérica:

```
[-]  [2]  [+]
```

**Comportamento:**

- Mínimo: 1 (não pode ficar abaixo disso; caso contrário, o item será removido)
- Máximo: estoque disponível ou limite do carrinho
- Entrada manual permitida (digite o número)
- Atualização ao alterar (ao perder o foco ou clicar no botão)
- Exiba brevemente o estado de carregamento
- Atualizar o total da linha imediatamente

### Atualização automática (recomendado)

As alterações são aplicadas imediatamente, sem a necessidade do botão “Atualizar carrinho”. Melhor experiência do usuário, menos atrito. Exibir um breve indicador de carregamento. Atualizar o resumo do pedido automaticamente.

**Tratamento de erros:**
“Apenas X disponível” se exceder o estoque; reajuste para a quantidade máxima disponível; exiba uma mensagem de erro próxima ao item.

## Resumo do pedido

### Cartão de resumo

Posição: coluna direita no desktop (fixo), abaixo dos itens do carrinho no celular; largura fixa (300–400 px no desktop).

### Detalhamento do preço

**Itens da cesta:**

```
Subtotal (3 items):     $149.97
Shipping:               $9.99
Tax:                    $12.00
─────────────────────
Total:                  $171.96
```

**Subtotal:**
Soma de todos os itens da cesta com a quantidade de cada item.

**Frete:**
Custo estimado do frete, ou “Calculado na finalização da compra” (se for necessário informar o endereço), ou “Frete grátis” (se aplicável). Mostrar o progresso em relação ao valor mínimo para frete grátis (consulte promotions.md).

**Imposto:**
Imposto estimado ou “Calculado na finalização da compra” (se for necessário fornecer endereço).

**Total:**
Total geral (em negrito, fonte maior), o número mais destacado.

### Exibição da economia

Se houver descontos aplicados:

- Mostrar a economia total: “Você economizou $20,00” (texto em verde)
- Ou: Item de desconto na discriminação
- Reforço positivo

## Inserção do código promocional

### Design do campo de inserção

**Layout:**
Rótulo (“Código promocional” ou “Código de desconto”), campo de texto (200–280 px no desktop, largura total no celular), botão “Aplicar” alinhado ou empilhado (celular). Posicionado abaixo dos itens do carrinho ou no resumo do pedido.

**Maiúsculas automáticas:**
Ao enviar (os códigos geralmente estão em maiúsculas).

**Padrão expansível (opcional):**
Link “Tem um código promocional?” que se expande para mostrar o campo de entrada. Economiza espaço vertical.

### Estados de sucesso e erro

**Sucesso:**

- Marca de seleção verde ou mensagem de sucesso: “Código aplicado: WELCOME10”
- Desconto exibido no resumo do pedido: “Desconto (WELCOME10) -$10,00”
- Opção para remover: ícone X ou link “Remover”
- Atualizar o total do carrinho imediatamente

**Erro:**

- Mensagem de erro em vermelho abaixo do campo de entrada: “Código inválido”, “Código expirado” ou “Valor mínimo de compra não atingido”
- O campo de entrada permanece visível para nova tentativa
- Não limpar o campo de entrada

**Veja também:** [promotions.md](../features/promotions.md) para padrões detalhados de códigos promocionais.

## Botão de Finalização da Compra

### Design do botão

**Destaque:**
Botão grande, ocupando toda a largura, na cor principal da marca (alto contraste), com altura de 48 a 56 px (fácil de tocar). Texto: “Prosseguir para a finalização da compra” ou “Finalizar compra”. Ícone opcional (cadeado ou seta).

**Posição:**
Na parte inferior do resumo do pedido (computador), fixo na parte inferior da tela (celular, opcional), sempre visível durante a rolagem.

**Estados:**
Padrão ativado, ao passar o mouse ocorre uma leve mudança de cor, carregando com indicador giratório, desativado se o carrinho estiver vazio ou houver erro.

**Indicadores de segurança (opcional):**
Ícone de cadeado com “Finalização segura”, selos de pagamento (Visa, Mastercard, PayPal) e a mensagem “Criptografado por SSL” próxima ao botão.

## Estado do carrinho vazio

### Exibição

Quando o carrinho estiver vazio:

- Conteúdo centralizado
- Ícone ou ilustração (saco de compras vazio)
- Título: “Seu carrinho está vazio”
- Subtexto: “Comece a adicionar itens ao seu carrinho”
- Botão de CTA: “Continuar comprando” ou “Navegar pelos produtos”

**Elementos adicionais:**

- Link para categorias populares
- Produtos visualizados recentemente (se disponíveis)
- Mais vendidos ou produtos em destaque

## Integração com o backend

### Fonte de dados (CRÍTICO)

**Busca no backend do e-commerce:**
Carrinho armazenado no backend (persistente); buscar ao carregar a página; sincronizar com o backend em caso de alterações.

**Quando buscar:**

- Ao carregar a página (dados iniciais do carrinho)
- Após adicionar/atualizar/remover itens
- Após aplicar códigos promocionais

### Gerenciamento de estado

**Estado do carrinho no lado do cliente:**
Armazenar os dados do carrinho no estado global (React Context), manter o ID do carrinho no localStorage, atualizar o estado após respostas da API, compartilhar o estado do carrinho entre componentes (página, pop-up, ícone no cabeçalho).

**Persistência do ID do carrinho:**

```javascript
localStorage.setItem('cart_id', cartId)
```

Envie o ID do carrinho em todas as solicitações à API do carrinho, crie um novo carrinho se o ID não existir e limpe o ID do carrinho ao concluir a finalização da compra.

### Consulta do TanStack para dados do carrinho

**Recomendado** para armazenamento em cache e revalidação eficientes:

**Benefícios:**
Armazenamento em cache integrado com revalidação automática, suporte a atualizações otimistas, recarga automática ao receber foco ou ao se reconectar, tratamento de estados de carregamento e erro, invalidação de consultas para atualizações do carrinho.

**Configuração:**
Use `useQuery` para buscar os dados do carrinho, defina `staleTime` entre 30 e 60 segundos e use `queryClient.invalidateQueries(['cart'])` após as atualizações.

**Veja também:** [connecting-to-backend.md](../connecting-to-backend.md) para padrões detalhados de integração com o backend.

### Integração com o Medusa

Use o SDK `@medusajs/medusa-js`:

- Endpoints do carrinho: `/store/carts`, `/store/carts/{id}`
- Adicionar ao carrinho: POST `/store/carts/{id}/line-items`
- Atualizar quantidade: POST `/store/carts/{id}/line-items/{lineId}`
- Remover item: DELETE `/store/carts/{id}/line-items/{lineId}`
- Aplicar desconto: POST `/store/carts/{id}/promotions`

**Dados da resposta:**
ID do carrinho, itens (detalhes do produto, variantes, quantidades), subtotal, impostos, frete, total, descontos aplicados, status de disponibilidade dos itens.

**Tratamento de erros:**
Erros de rede (mostrar opção de repetição), ID do carrinho inválido (criar novo carrinho), fora de estoque (mostrar erro, impedir adição), erros de API (mensagem de fácil compreensão).

## Carrinho para dispositivos móveis

### Layout para dispositivos móveis

**Estrutura:**
Itens do carrinho em largura total (empilhados), cartões de item simplificados, resumo do pedido abaixo dos itens, botão de finalização de compra fixo na parte inferior.

**Cartões dos itens no carrinho:**
Imagens menores dos produtos (60-80px), títulos dos produtos abreviados (1-2 linhas), apenas informações essenciais, seletor de quantidade (menor, 36-40px), botão “Remover” visível.

### Barra de checkout fixa

**Barra fixa na parte inferior:**
Fixada na parte inferior da tela, valor total visível, botão “Finalizar compra” (largura total), aparece após a rolagem (opcional), sempre acessível.

**Design:**

```
[Total: $171.96]  [Checkout]
```

**Otimizado para toque:**
Áreas de toque com no mínimo 44px, espaçamento adequado entre os botões, botões “Remover” grandes (40px).

## Lista de verificação

**Elementos essenciais:**

- [ ] **CRÍTICO: Os itens do carrinho exibem detalhes das variantes (tamanho, cor etc.) — não apenas o título do produto**
- [ ] Itens do carrinho com imagens, títulos, opções de variantes e preços
- [ ] Seletor de quantidade (botões +/-, mínimo de 40-44px)
- [ ] Botão “Remover” para cada item (ícone X, claramente visível)
- [ ] Resumo do pedido (subtotal, frete, impostos, total)
- [ ] Campo para inserção de código promocional com botão “Aplicar”
- [ ] Desconto aplicado exibido no resumo
- [ ] Opção “Remover” para o código aplicado
- [ ] Botão “Finalizar compra” em destaque (48-56px de altura)
- [ ] Link “Continuar comprando”
- [ ] Estado do carrinho vazio (ícone, mensagem, CTA)
- [ ] Sinais de confiança (finalização segura da compra, selos de pagamento)
- [ ] Atualização automática de quantidades (sem botão “Atualizar carrinho”)
- [ ] Opção de desfazer após remover item (notificação pop-up)
- [ ] Celular: botão de finalização da compra fixo na parte inferior
- [ ] Celular: cartões simplificados dos itens do carrinho
- [ ] Integração com o backend (busca do carrinho pela API)
- [ ] Persistência do ID do carrinho (localStorage)
- [ ] Atualizações de preço em tempo real
- [ ] Estados de carregamento (esqueleto ou indicador giratório)
- [ ] Atualizações otimistas para alterações de quantidade
- [ ] Avisos sobre disponibilidade de estoque (se o estoque estiver baixo)
- [ ] Progresso do valor mínimo para frete grátis (se aplicável)
- [ ] Acessibilidade por teclado (Tab, Enter, setas)
- [ ] Rótulos ARIA nos controles de quantidade e botões
- [ ] Anúncios do leitor de tela (aria-live)
- [ ] Texto de alto contraste (mínimo de 4,5:1)
- [ ] Tratamento de erros em caso de falhas nas atualizações
