# Layout de Páginas de Conta

## Índice

- [Visão geral](#visão-geral)
- [Painel da Conta](#painel-da-conta)
- [Gerenciamento de Pedidos](#gerenciamento-de-pedidos)
- [Endereços Salvos](#endereços-salvos)
- [Métodos de Pagamento](#métodos-de-pagamento)
- [Perfil e Segurança](#perfil-e-segurança)
- [Preferências de E-mail](#preferências-de-e-mail)
- [Navegação e Layout](#navegação-e-layout)
- [Considerações sobre Dispositivos Móveis](#considerações-sobre-dispositivos-móveis)
- [Lista de Verificação](#lista-de-verificação)

## Visão geral

As páginas de conta permitem que os clientes gerenciem pedidos, salvem endereços, atualizem preferências e visualizem o histórico de pedidos. Páginas de conta bem projetadas melhoram as taxas de compras repetidas e reduzem as solicitações de suporte.

**Integração com o Backend (CRÍTICO):**

Todos os dados do cliente (pedidos, endereços, perfil, métodos de pagamento) devem ser buscados no backend de e-commerce. Altere isso com base no backend integrado. Nunca insira dados de conta fixos (hardcode) ou simulados (mock). Consulte a documentação do backend para:

- Endpoints de dados do cliente (perfil, preferências)
- Histórico de pedidos e endpoints de detalhes
- Operações CRUD de endereço
- Armazenamento de método de pagamento (se suportado)
- Requisitos de autenticação

### Principais Requisitos de E-commerce

- Histórico de pedidos com rastreamento de status (constrói confiança)
- Endereços salvos (otimização de finalização de compra - reduz atrito)
- Funcionalidade de reordenar (aumenta compras repetidas)
- Integração de rastreamento de pedidos
- Controles de preferência de e-mail (conformidade e controle do usuário)
- Autenticação segura e gerenciamento de sessão

### Propósito

**Funções primárias de e-commerce:**

- Reduzir atrito na finalização de compra (endereços salvos, métodos de pagamento)
- Aumentar compras repetidas (histórico de pedidos, botão de reordenar)
- Reduzir carga de suporte (rastreamento de pedidos, devoluções por autoatendimento)
- Construir confiança (transparência de pedidos, atualizações de entrega)
- Reter clientes (gerenciamento fácil de conta)

## Painel da Conta

Página de destino após o login. Propósito: Acesso rápido a atividades recentes e ações comuns.

**Exibição (priorize pedidos recentes):**

- Mensagem de boas-vindas com o nome do cliente
- Pedidos recentes (3-5 mais recentes com status)
- Ações rápidas: Rastrear pedido, Reordenar, Gerenciar endereços
- Resumo da conta (contagem de endereços salvos, pontos de fidelidade)

**Funcionalidade de reordenar (CRÍTICO para compras repetidas):**

- Verifique primeiro se o recurso está disponível no painel de administração.
- Botão "Reordenar" em cada cartão de pedido
- Adiciona os mesmos itens ao carrinho (verifique a disponibilidade de estoque primeiro)
- Feedback de sucesso (carrinho atualizado com X itens)
- Não saia da página (permaneça no painel)

**Exemplo de painel:**

```
Bem-vinda de volta, Sarah!

Pedidos Recentes
- Pedido #12345 - Entregue (28 de Jan) - R$ 89,99  [Reordenar]
- Pedido #12344 - Em Trânsito (27 de Jan) - R$ 124,50  [Rastrear Pedido]
- Pedido #12343 - Processando (26 de Jan) - R$ 45,00

[Ver Todos os Pedidos →]

Ações Rápidas
[Rastrear Pedido] [Gerenciar Endereços] [Contatar Suporte]
```

## Gerenciamento de Pedidos

### Histórico de Pedidos

Exiba todos os pedidos anteriores com filtragem e pesquisa.

**Itens essenciais do cartão de pedido:**

- Número do pedido (clicável para a página de detalhes)
- Data do pedido e selo de status (Processando, Enviado, Entregue)
- Valor total
- Primeiras 2-3 miniaturas de produtos
- Ações rápidas: Rastrear, Ver Detalhes, Reordenar, Fatura

**Indicadores de status (codificados por cor):**

- Processando: Amarelo/Laranja
- Enviado: Azul
- Entregue: Verde
- Cancelado: Cinza/Vermelho

**Filtragem e pesquisa:**

- Intervalo de datas (Últimos 30 dias, Últimos 6 meses, Todo o período)
- Filtro de status (Todos, Processando, Enviado, Entregue)
- Pesquisa por número do pedido ou nome do produto

**Ordenação:**

- Mais recentes primeiro (padrão)
- Mais antigos primeiro
- Maior/menor preço

**Paginação:**
Mostre 10-20 pedidos por página com controles de paginação. Alternativa: Botão "Carregar Mais" (melhor experiência em dispositivos móveis).

### Visualização de Detalhes do Pedido

Página completa de informações do pedido.

**Exibição:**

- Número do pedido, data, status com linha do tempo de progresso
- Número de rastreamento com link da transportadora (se enviado)
- Data de entrega estimada

**Linha do tempo de status (constrói confiança):**

```
✓ Pedido Realizado (27 de Jan, 09:45)
✓ Processando (27 de Jan, 10:30)
✓ Enviado (28 de Jan, 14:15)
○ Saiu para Entrega
○ Entregue
```

**Informações do pedido:**

- Itens pedidos (imagem, nome, variante, quantidade, preço)
- Detalhamento de preços (subtotal, frete, impostos, descontos, total)
- Endereço e método de envio
- Endereço de cobrança
- Método de pagamento (últimos 4 dígitos)

**Ações do pedido:**

- Rastrear remessa (link para a página de rastreamento da transportadora)
- Baixar fatura/recibo (PDF)
- Solicitar devolução (se elegível e o backend suportar)
- Reordenar itens
- Contatar o suporte sobre o pedido

### Funcionalidade de Reordenar (Específico para E-commerce)

**Propósito**: Aumentar as compras repetidas facilitando a reordenação de compras anteriores.

**Implementação:**

- Botão "Reordenar" nos cartões de pedido e detalhes do pedido
- Verificar disponibilidade de estoque antes de adicionar ao carrinho
- Lidar graciosamente com produtos descontinuados (pular ou notificar)
- Adicionar todos os itens disponíveis ao carrinho
- Mensagem de sucesso: "5 itens adicionados ao carrinho" (ou "3 de 5 itens adicionados - 2 indisponíveis")
- Permanecer na página atual (não sair da página)

**Compromisso**: Adição automática ao carrinho (sem atrito) vs redirecionar para a página do carrinho (permitir que o usuário revise primeiro). Recomenda-se adição automática com feedback claro de sucesso.

## Endereços Salvos

**Propósito (CRÍTICO)**: Reduzir o atrito na finalização da compra e aumentar a conversão. Endereços salvos tornam as compras repetidas mais rápidas e fáceis.

### Por que Endereços Importam

**Otimização de conversão:**

- Endereços salvos reduzem o tempo de finalização da compra em mais de 50% (sem redigitação)
- A seleção de endereço padrão agiliza o fluxo de finalização da compra
- Reduz o abandono de formulários (menos campos para preencher)
- Aumenta a taxa de compras repetidas (finalização de compra mais fácil)

**Integração com o backend:**
Busque, crie, atualize e exclua endereços via API do backend. Faça isso com base no backend integrado.

### Exibição do Catálogo de Endereços

**Lista de endereços salvos:**

- Todos os endereços salvos
- Indicador de endereço padrão (selo: "Envio Padrão" ou ícone de estrela)
- Pré-visualização do endereço: Nome, rua, cidade, estado, CEP
- Ações rápidas: Editar, Excluir, Definir como Padrão

**Comportamento do endereço padrão:**

- Um endereço de envio padrão
- Um endereço de cobrança padrão (separado ou o mesmo)
- Usado automaticamente na finalização da compra (o usuário pode alterar)
- Definir novo padrão atualiza o padrão anterior

### Formulário de Adicionar/Editar Endereço

Colete informações padrão de envio. Principais considerações:

**Campos obrigatórios:**

- Nome completo (ou nome + sobrenome)
- Endereço (linha 1)
- Cidade, Estado/Província, CEP/Código Postal
- País
- Número de telefone (recomendado para coordenação de entrega)

**Melhorias opcionais:**

- Rótulo de endereço (Casa, Trabalho) para fácil identificação
- API de preenchimento automático de endereço (Google Places) para precisão
- Caixa de seleção "Definir como padrão"

**Validação:**
Validação em tempo real, especialmente para o formato de CEP/código postal com base no país.

## Métodos de Pagamento

**Nota**: O armazenamento de métodos de pagamento é opcional. Implemente apenas se:

- O backend lida de forma segura com dados de pagamento tokenizados
- Os requisitos de conformidade PCI DSS são atendidos
- O gateway de pagamento suporta tokenização (Stripe, Braintree)

**Segurança (CRÍTICO):**

- Nunca armazene números de cartão completos (tokenize com o gateway de pagamento)
- Exiba apenas os últimos 4 dígitos
- Não armazene o CVV
- Use formulários hospedados pelo gateway de pagamento (Stripe Elements, etc.)
- Mostre o selo "Armazenado com segurança" para confiança

**Exibição de pagamento salvo:**

- Logotipo do tipo de cartão (Visa, Mastercard)
- Últimos 4 dígitos
- Data de validade
- Indicador padrão
- Ações: Editar (atualizar data de validade/endereço de cobrança), Excluir, Definir como Padrão

**Compromisso**: Métodos de pagamento salvos aumentam a conveniência, mas exigem conformidade com PCI. Se não implementado, os usuários inserem o pagamento na finalização da compra todas as vezes (mais atrito, mas backend mais simples).

## Perfil e Segurança

### Informações do Perfil

Exiba e edite as informações do cliente.

**Campos padrão:**

- Nome completo
- E-mail (com status de verificação)
- Número de telefone
- Opcional: Data de nascimento, gênero

**Funcionalidade de edição:**
Edição inline ou formulário separado, validação em tempo real, confirmação de sucesso.

**Verificação de e-mail:**
Se não verificado, mostre aviso com o botão "Reenviar e-mail de verificação". Se verificado, mostre selo de marca de seleção.

### Configurações de Segurança

**Alteração de senha:**

- Exigir senha atual (opcional)
- Nova senha com indicador de força
- Confirmar nova senha
- Exibição de requisitos de senha (mais de 8 caracteres, letra maiúscula, número)

**Autenticação de dois fatores (opcional):**
Ativar/desativar 2FA, instruções de configuração, códigos de backup. Implemente apenas se o backend suportar.

## Preferências de E-mail

Controles de e-mail específicos para e-commerce.

**Categorias de preferência:**

1. **E-mails transacionais** (atualizações de pedidos, envios) - Recomendado sempre ativado, pode ser legalmente exigido
2. **E-mails de marketing** (vendas, promoções, novos produtos) - Escolha do usuário
3. **Boletim informativo** (resumo semanal, conteúdo) - Escolha do usuário

**Exibição:**
Lista de caixas de seleção ou chaves de alternância (toggles) com descrições claras. Botão de salvar na parte inferior.

**Exemplo:**

```
Preferências de E-mail

[✓] Atualizações de pedidos e envios
    Receba confirmações e informações de rastreamento

[ ] E-mails de marketing
    Vendas, promoções e novos produtos

[ ] Boletim informativo
    Resumo semanal e artigos

[Salvar Preferências]
```

**Cancelar inscrição:**

Opções de cancelamento (opt-out) individuais por tipo, botão "Cancelar inscrição de todo marketing". Mantenha os e-mails transacionais ativados (necessário para o atendimento do pedido).

## Navegação e Layout

### Decisão de Padrão de Layout

Escolha com base na complexidade da conta:

**Navegação na Barra Lateral (Recomendado):**

- **Use quando**: Mais de 6 seções de conta, recursos complexos de conta
- Desktop: Barra lateral vertical (20-25% de largura) com links de seção
- Celular: Recolha para menu hambúrguer ou menu suspenso
- Benefícios: Navegação persistente, profissional, acomoda muitas seções

**Navegação por Abas:**

- **Use quando**: 4-6 seções de conta, estrutura de conta mais simples
- Abas horizontais na parte superior, aba ativa destacada
- Celular: Rolagem horizontal ou menu suspenso
- Benefícios: Moderno, limpo, troca rápida

**Hub da Conta (Foco em Celular):**

- **Use quando**: Tráfego majoritariamente móvel, conta simples
- Página de destino com cartões de seção (grade de 2 colunas)
- Toque no cartão para entrar na seção, botão de voltar retorna ao hub
- Benefícios: Amigável ao toque, intuitivo, hierarquia mínima

### Organização de Seções

**Ordem recomendada (do mais para o menos usado):**

1. Painel (página de destino)
2. Pedidos (mais acessado)
3. Endereços (importante para finalização de compra)
4. Métodos de Pagamento (se implementado)
5. Perfil
6. Segurança
7. Preferências de E-mail
8. Sair

## Considerações sobre Dispositivos Móveis

**Padrões específicos para dispositivos móveis:**

**Navegação:**
Hub da conta com cartões de seção (2 colunas) ou navegação inferior com 4-5 seções principais (Pedidos, Endereços, Perfil, Mais).

**Formulários:**
Um campo por linha, entradas maiores (altura de 48px), tipos de teclado apropriados (e-mail, telefone, numérico), preenchimento automático (autofill) ativado.

**Histórico de pedidos:**
Cartões de pedido simplificados, botões de largura total, paginação "Carregar Mais" (melhor do que páginas numeradas em dispositivos móveis).

**Endereços salvos:**
Cartões de endereço empilhados, largura total, áreas de toque de 48px para editar/excluir.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Painel da conta com pedidos recentes (3-5)
- [ ] Botão de reordenar (adiciona itens ao carrinho, permanece na página)
- [ ] Histórico de pedidos com indicadores de status
- [ ] Filtrar pedidos por intervalo de datas e status
- [ ] Pesquisar pedidos por número ou nome do produto
- [ ] Página de detalhes do pedido com informações de rastreamento
- [ ] Linha do tempo de status (Pedido Realizado → Processando → Enviado → Entregue)
- [ ] Botão de rastrear remessa (link para transportadora)
- [ ] Opção de baixar fatura/recibo
- [ ] Lista de endereços salvos com indicador de padrão
- [ ] Adicionar/editar/excluir endereços com validação
- [ ] Opção de definir endereço padrão
- [ ] Edição de informações de perfil
- [ ] Exibição do status de verificação de e-mail
- [ ] Alteração de senha com indicador de força
- [ ] Senha atual exigida para alterar a senha
- [ ] Preferências de e-mail (transacionais vs marketing)
- [ ] Opção de exclusão de conta
- [ ] Botão de sair claramente visível
- [ ] Navegação clara entre seções
- [ ] Responsivo para dispositivos móveis (coluna única, áreas de toque de 48px)
- [ ] Integração com o backend (todos os dados buscados na API)
- [ ] Confirmações de sucesso após salvamentos
- [ ] Tratamento de erros com mensagens claras
- [ ] Acessível por teclado
- [ ] Rótulos ARIA nas seções de navegação
- [ ] Anúncios de status de pedido para leitores de tela

**Recursos opcionais:**

- [ ] Métodos de pagamento salvos (se o backend for compatível com PCI)
- [ ] Autenticação de dois fatores
- [ ] Integração de lista de desejos
- [ ] Exibição de pontos de fidelidade/recompensas
- [ ] Seção de gerenciamento de devoluções
- [ ] API de preenchimento automático de endereço
