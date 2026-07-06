# Layout das páginas da conta

## Índice

- [Visão geral](#visao-geral)
- [Painel da conta](#painel-da-conta)
- [Gerenciamento de pedidos](#gerenciamento-de-pedidos)
- [Endereços salvos](#enderecos-salvos)
- [Formas de pagamento](#formas-de-pagamento)
- [Perfil e segurança](#perfil-e-seguranca)
- [Preferências de e-mail](#preferencias-de-e-mail)
- [Navegação e layout](#navegacao-e-layout)
- [Considerações sobre dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

As páginas de conta permitem que os clientes gerenciem pedidos, salvem endereços, atualizem preferências e visualizem o histórico de pedidos. Páginas de conta bem projetadas aumentam as taxas de compras repetidas e reduzem o número de solicitações de suporte.

**Integração com o backend (CRÍTICO):**

Todos os dados do cliente (pedidos, endereços, perfil, formas de pagamento) devem ser obtidos do backend do e-commerce. Adapte isso de acordo com o backend integrado. Nunca codifique diretamente nem simule dados de conta. Consulte a documentação do backend para:

- Endpoints de dados do cliente (perfil, preferências)
- Endpoints de histórico e detalhes de pedidos
- Operações CRUD de endereços
- Armazenamento de formas de pagamento (se compatível)
- Requisitos de autenticação

### Requisitos-chave do comércio eletrônico

- Histórico de pedidos com acompanhamento do status (gera confiança)
- Endereços salvos (otimização do checkout — reduz o atrito)
- Funcionalidade de reabastecimento (aumenta as compras repetidas)
- Integração com o rastreamento de pedidos
- Controles de preferências de e-mail (conformidade e controle do usuário)
- Autenticação segura e gerenciamento de sessões

### Objetivo

**Principais funções de comércio eletrônico:**

- Reduzir atritos no checkout (endereços salvos, formas de pagamento)
- Aumentar as compras repetidas (histórico de pedidos, botão de repetição de pedido)
- Reduzir a carga de atendimento (rastreamento de pedidos, devoluções por conta própria)
- Gerar confiança (transparência nos pedidos, atualizações de entrega)
- Fidelizar clientes (gerenciamento fácil da conta)

## Painel da conta

Página inicial após o login. Objetivo: acesso rápido às atividades recentes e às ações mais comuns.

**Exibição (priorizar pedidos recentes):**

- Mensagem de boas-vindas com o nome do cliente
- Pedidos recentes (os 3 a 5 mais recentes com status)
- Ações rápidas: Rastrear pedido, Repetir pedido, Gerenciar endereços
- Resumo da conta (número de endereços salvos, pontos de fidelidade)

**Funcionalidade de repetição de pedido (FUNDAMENTAL para compras recorrentes):**

- Verifique primeiro se o recurso está disponível no painel de administração.
- Botão “Reordenar” em cada ficha de pedido
- Adiciona os mesmos itens ao carrinho (verifique primeiro a disponibilidade em estoque)
- Mensagem de sucesso (carrinho atualizado com X itens)
- Não saia da página (permaneça no painel)

**Exemplo de painel:**

```
Welcome back, Sarah!

Recent Orders
- Order #12345 - Delivered (Jan 28) - $89.99  [Reorder]
- Order #12344 - In Transit (Jan 27) - $124.50  [Track Order]
- Order #12343 - Processing (Jan 26) - $45.00

[View All Orders →]

Quick Actions
[Track Order] [Manage Addresses] [Contact Support]
```

## Gerenciamento de pedidos

### Histórico de pedidos

Exibe todos os pedidos anteriores com filtros e pesquisa.

**Informações essenciais do cartão do pedido:**

- Número do pedido (clicável para acessar a página de detalhes)
- Data do pedido e indicador de status (Em processamento, Enviado, Entregue)
- Valor total
- As primeiras 2 ou 3 miniaturas dos produtos
- Ações rápidas: Rastrear, Ver detalhes, Reencomendar, Fatura

**Indicadores de status (codificados por cores):**

- Em processamento: Amarelo/Laranja
- Enviado: Azul
- Entregue: Verde
- Cancelado: Cinza/Vermelho

**Filtragem e pesquisa:**

- Intervalo de datas (Últimos 30 dias, Últimos 6 meses, Todos os tempos)
- Filtro de status (Todos, Em processamento, Enviados, Entregues)
- Pesquisa por número do pedido ou nome do produto

**Classificação:**

- Mais recentes primeiro (padrão)
- Mais antigos primeiro
- Preço mais alto/mais baixo

**Paginação:**
Mostrar de 10 a 20 pedidos por página com controles de paginação. Alternativa: botão “Carregar mais” (melhor experiência do usuário em dispositivos móveis).

### Visualização dos detalhes do pedido

Página com informações completas do pedido.

**Exibição:**

- Número do pedido, data, status com linha do tempo de andamento
- Número de rastreamento com link da transportadora (se enviado)
- Data estimada de entrega

**Linha do tempo do status (gera confiança):**

```
✓ Order Placed (Jan 27, 9:45 AM)
✓ Processing (Jan 27, 10:30 AM)
✓ Shipped (Jan 28, 2:15 PM)
○ Out for Delivery
○ Delivered
```

**Informações do pedido:**

- Itens pedidos (imagem, nome, variante, quantidade, preço)
- Detalhamento do preço (subtotal, frete, impostos, descontos, total)
- Endereço e forma de entrega
- Endereço de cobrança
- Forma de pagamento (últimos 4 dígitos)

**Ações relacionadas ao pedido:**

- Rastrear remessa (link para a página de rastreamento da transportadora)
- Baixar fatura/recibo (PDF)
- Solicitar devolução (se elegível e se o backend for compatível)
- Reabastecer itens
- Entrar em contato com o suporte sobre o pedido

### Funcionalidade de reabastecimento (específica para comércio eletrônico)

**Objetivo**: Aumentar as compras recorrentes, facilitando o reabastecimento de compras anteriores.

**Implementação:**

- Botão “Reencomendar” nos cartões de pedido e nos detalhes do pedido
- Verificar a disponibilidade em estoque antes de adicionar ao carrinho
- Lidar adequadamente com produtos descontinuados (ignorar ou notificar)
- Adicionar todos os itens disponíveis ao carrinho
- Mensagem de sucesso: “5 itens adicionados ao carrinho” (ou “3 de 5 itens adicionados – 2 indisponíveis”)
- Permanecer na página atual (não sair da página)

**Compromisso**: Adicionar automaticamente ao carrinho (sem atritos) x redirecionar para a página do carrinho (permitir que o usuário revise primeiro). Recomenda-se a adição automática com um feedback claro de sucesso.

## Endereços salvos

**Objetivo (CRÍTICO)**: Reduzir os atritos no checkout e aumentar a conversão. Os endereços salvos tornam as compras repetidas mais rápidas e fáceis.

### Por que os endereços são importantes

**Otimização da conversão:**

- Endereços salvos reduzem o tempo de finalização da compra em mais de 50% (sem necessidade de digitar novamente)
- A seleção do endereço padrão agiliza o fluxo de finalização da compra
- Reduz o abandono do formulário (menos campos para preencher)
- Aumenta a taxa de compras repetidas (finalização de compra mais fácil)

**Integração com o backend:**
Recupere, crie, atualize e exclua endereços por meio da API do backend. Faça isso de acordo com a integração do backend.

### Exibição da agenda de endereços

**Lista de endereços salvos:**

- Todos os endereços salvos
- Indicador de endereço padrão (emblema: “Envio padrão” ou ícone de estrela)
- Visualização do endereço: nome, rua, cidade, estado, CEP
- Ações rápidas: Editar, Excluir, Definir como padrão

**Comportamento do endereço padrão:**

- Um endereço de entrega padrão
- Um endereço de cobrança padrão (separado ou igual)
- Aplicado automaticamente no checkout (o usuário pode alterar)
- Ao definir um novo padrão, o padrão anterior é substituído

### Formulário para adicionar/editar endereço

Colete informações padrão de envio. Principais considerações:

**Campos obrigatórios:**

- Nome completo (ou nome + sobrenome)
- Endereço, linha 1
- Cidade, Estado/Província, CEP
- País
- Número de telefone (recomendado para coordenação da entrega)

**Recursos opcionais:**

- Rótulo de endereço (Residência, Trabalho) para facilitar a identificação
- API de preenchimento automático de endereço (Google Places) para maior precisão
- Caixa de seleção “Definir como padrão”

**Validação:**
Validação em tempo real, especialmente para o formato do CEP/código postal de acordo com o país.

## Formas de pagamento

**Observação**: O armazenamento das formas de pagamento é opcional. Implemente apenas se:

- O backend processar com segurança os dados de pagamento tokenizados
- Os requisitos de conformidade com o PCI DSS forem atendidos
- O gateway de pagamento suportar tokenização (Stripe, Braintree)

**Segurança (CRÍTICA):**

- Nunca armazene números completos de cartão (tokenize com o gateway de pagamento)
- Exiba apenas os últimos 4 dígitos
- Não armazene o CVV
- Use formulários hospedados pelo gateway de pagamento (Stripe Elements, etc.)
- Exibir o selo “Armazenado com segurança” para transmitir confiança

**Exibição de pagamentos salvos:**

- Logotipo do tipo de cartão (Visa, Mastercard)
- Últimos 4 dígitos
- Data de validade
- Indicador de padrão
- Ações: Editar (atualizar data de validade/endereço de cobrança), Excluir, Definir como padrão

**Prós e contras**: Os métodos de pagamento salvos aumentam a conveniência, mas exigem conformidade com o PCI. Se não forem implementados, os usuários precisam inserir os dados de pagamento a cada finalização de compra (mais atrito, mas back-end mais simples).

## Perfil e segurança

### Informações do perfil

Exibir e editar informações do cliente.

**Campos padrão:**

- Nome completo
- E-mail (com status de verificação)
- Número de telefone
- Opcional: Data de nascimento, sexo

**Funcionalidade de edição:**
Edição direta no campo ou em formulário separado, validação em tempo real, confirmação de sucesso.

**Verificação de e-mail:**
Se não estiver verificado, exibir aviso com o botão “Reenviar e-mail de verificação”. Se estiver verificado, exibir um ícone de marca de seleção.

### Configurações de segurança

**Alteração de senha:**

- Exigir senha atual (opcional)
- Nova senha com indicador de segurança
- Confirmar nova senha
- Exibição dos requisitos de senha (8 ou mais caracteres, letra maiúscula, número)

**Autenticação de dois fatores (opcional):**
Ativar/desativar a autenticação de dois fatores (2FA), instruções de configuração, códigos de backup. Implementar somente se o backend for compatível.

## Preferências de e-mail

Controles de e-mail específicos para comércio eletrônico.

**Categorias de preferências:**

1. **E-mails transacionais** (atualizações de pedidos, envio) — Recomenda-se mantê-los sempre ativados; podem ser exigidos por lei
2. **E-mails de marketing** (vendas, promoções, novos produtos) — Escolha do usuário
3. **Boletim informativo** (resumo semanal, conteúdo) — Escolha do usuário

**Exibição:**
Lista de caixas de seleção ou botões de alternância com descrições claras. Botão “Salvar” na parte inferior.

**Exemplo:**

```
Email Preferences

[✓] Order and shipping updates
    Receive confirmations and tracking info

[ ] Marketing emails
    Sales, promotions, and new products

[ ] Newsletter
    Weekly roundup and articles

[Save Preferences]
```

**Cancelar inscrição:**
Opções individuais de cancelamento por tipo, botão “Cancelar inscrição em todas as comunicações de marketing”. Mantenha os e-mails transacionais ativados (necessários para o atendimento de pedidos).

## Navegação e layout

### Decisão sobre o padrão de layout

Escolha com base na complexidade da conta:

**Navegação na barra lateral (recomendado):**

- **Quando usar**: 6 ou mais seções na conta, recursos complexos da conta
- Computador: Barra lateral vertical (20-25% da largura) com links para as seções
- Celular: Reduzir para menu “hambúrguer” ou menu suspenso
- Vantagens: Navegação persistente, aparência profissional, acomoda muitas seções

**Navegação por abas:**

- **Quando usar**: 4 a 6 seções na conta, estrutura mais simples
- Abas horizontais na parte superior, com a aba ativa destacada
- Celular: rolagem horizontal ou menu suspenso
- Benefícios: moderno, organizado, troca rápida

**Central da conta (Mobile-First):**

- **Quando usar**: Tráfego predominantemente móvel, conta simples
- Página de destino com cartões de seção (grade de 2 colunas)
- Toque no cartão para acessar a seção; o botão Voltar retorna ao painel central
- Benefícios: Fácil de usar em dispositivos touch, intuitivo, hierarquia minimalista

### Organização das seções

**Ordem recomendada (da mais usada à menos usada):**

1. Painel (página de destino)
2. Pedidos (mais acessados)
3. Endereços (importante para finalizar a compra)
4. Formas de pagamento (se implementadas)
5. Perfil
6. Segurança
7. Preferências de e-mail
8. Sair

## Considerações para dispositivos móveis

**Padrões específicos para dispositivos móveis:**

**Navegação:**
Central de conta com cartões de seções (2 colunas) ou barra de navegação inferior com 4 a 5 seções principais (Pedidos, Endereços, Perfil, Mais).

**Formulários:**
Um campo por linha, campos de entrada maiores (48 px de altura), tipos de teclado adequados (e-mail, telefone, numérico), preenchimento automático ativado.

**Histórico de pedidos:**
Cartões de pedidos simplificados, botões em largura total, paginação com “Carregar mais” (melhor do que páginas numeradas em dispositivos móveis).

**Endereços salvos:**
Cartões de endereço empilhados, em largura total, alvos de toque de 48px para editar/excluir.

## Lista de verificação

**Recursos essenciais:**

- [ ] Painel da conta com pedidos recentes (3 a 5)
- [ ] Botão “Refazer pedido” (adiciona itens ao carrinho, permanece na página)
- [ ] Histórico de pedidos com indicadores de status
- [ ] Filtrar pedidos por intervalo de datas e status
- [ ] Pesquisar pedidos por número ou nome do produto
- [ ] Página de detalhes do pedido com informações de rastreamento
- [ ] Linha do tempo de status (Pedido feito → Em processamento → Enviado → Entregue)
- [ ] Botão para rastrear a remessa (link para a transportadora)
- [ ] Opção para baixar fatura/recibo
- [ ] Lista de endereços salvos com indicador de padrão
- [ ] Adicionar/editar/excluir endereços com validação
- [ ] Definir endereço padrão
- [ ] Edição das informações do perfil
- [ ] Exibição do status da verificação de e-mail
- [ ] Alteração de senha com indicador de segurança
- [ ] Senha atual necessária para alterar a senha
- [ ] Preferências de e-mail (transacionais x de marketing)
- [ ] Opção de exclusão da conta
- [ ] Botão de logout claramente visível
- [ ] Navegação clara entre as seções
- [ ] Responsivo para dispositivos móveis (coluna única, alvos de toque de 48px)
- [ ] Integração com o backend (todos os dados obtidos da API)
- [ ] Confirmações de sucesso após o salvamento
- [ ] Tratamento de erros com mensagens claras
- [ ] Acessível por teclado
- [ ] Rótulos ARIA nas seções de navegação
- [ ] Anúncios sobre o status do pedido para leitores de tela

**Recursos opcionais:**

- [ ] Formas de pagamento salvas (se o backend for compatível com PCI)
- [ ] Autenticação de dois fatores
- [ ] Integração com lista de desejos
- [ ] Exibição de pontos de fidelidade/recompensas
- [ ] Seção de gerenciamento de devoluções
- [ ] API de preenchimento automático de endereços
