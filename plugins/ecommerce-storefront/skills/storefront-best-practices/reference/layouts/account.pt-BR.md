# Layout de Páginas de Conta

## Contents

- [Visão geral](#visão-geral)
- [Painel da Conta](#painel-da-conta)
- [Gestão de Pedidos](#order-management)
- [Endereços Salvos](#enderecos-salvos)
- [Formas de Pagamento](#formas-de-pagamento)
- [Perfil e Segurança](#perfil-e-segurança)
- [Preferências de Email](#email-preferences)
- [Navegação e Layout](#navegação-e-layout)
- [Considerações sobre Dispositivos Móveis](#consideracoes-sobre-dispositivos-moveis)
- [Checklist](#checklist)

## Overview

Account pages allow customers to manage orders, save addresses, update preferences, and view order history. Well-designed account pages improve repeat purchase rates and reduce support inquiries.

**Integração Backend (CRÍTICO):**

Todos os dados do cliente (pedidos, endereços, perfil, métodos de pagamento) devem ser obtidos do backend de ecommerce. Altere isso com base no backend integrado. Nunca codifique manualmente ou simule dados de conta. Consulte a documentação do backend para:

- Dados do cliente endpoints (perfil, preferências)
- Histórico de pedidos e endpoints de detalhes
- Address CRUD operations
- Método de pagamento armazenado (se compatível)
- Requisitos de autenticação

### Principais requisitos de comércio eletrônico

- Histórico de pedidos com rastreamento de status (constroi confiança)
- Endereços salvos (otimização de checkout - reduz fricção)
- Reorder functionality (aumenta as compras repetidas)
- Rastreamento de pedidos integração
- Email preference controls (compliance and user control)
- Secure authentication and session management

### Propósito

**Primary ecommerce functions:**

- Reduza o atrito no checkout (endereços salvos, métodos de pagamento)
- Increase repeat purchases (order history, reorder button)
- Reduzir a carga de suporte (rastreamento de pedidos, devoluções autoatendimento)
- Construa confiança (transparência do pedido, atualizações de entrega)
- Reter clientes (gestão de contas fácil)

## Account Dashboard

Landing page after login. Purpose: Quick access to recent activity and common actions.

**Exibir (priorizar pedidos recentes):**

- Welcome message with customer name
- Pedidos recentes (3-5 mais recentes com status)
- Ações rápidas: Acompanhar pedido, Reordenar, Gerenciar endereços
- Account summary (saved addresses count, loyalty points)

**Funcionalidade de reordenação (CRÍTICO para compras recorrentes):**

- Check first that feature is available in the admin.
- "Reorder" button on each order card
- Adiciona os mesmos itens ao carrinho (verifique a disponibilidade de estoque primeiro)
- Feedback de sucesso (carrinho atualizado com X itens)
- Don't navigate away (stay on dashboard)

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

## Gerenciamento de Pedidos

### Histórico de Pedidos

Display all past orders with filtering and search.

**Order card essentials:**

- Order number (clickable to details page)
- Data do pedido e emblema de status (Processando, Enviado, Entregue)
- Total amount
- Primeiras 2-3 miniaturas de produtos
- Ações rápidas: Rastrear, Ver Detalhes, Reordenar, Fatura

**Indicadores de status (codificados por cores):**

- Processing: Yellow/Orange
- Shipped: Blue
- Entregue: Verde
- Cancelled: Gray/Red

**Filtering and search:**

- Intervalo de datas (Últimos 30 dias, Últimos 6 meses, Todo o período)
- Status filter (All, Processing, Shipped, Delivered)
- Pesquisar por número do pedido ou nome do produto

**Ordenação:**

- Mais recente primeiro (padrão)
- Mais antigo primeiro
- Maior/menor preço

**Paginação:**  
Exiba 10-20 pedidos por página com controles de paginação. Alternativa: botão "Carregar mais" (melhor experiência para dispositivos móveis).

### Visualização de Detalhes do Pedido

Página completa de informações do pedido.

**Exibição:**

- Order number, date, status with progress timeline
- Número de rastreio com link da transportadora (se enviado)
- Data de entrega estimada

**Cronologia de status (constrói confiança):**

```
✓ Order Placed (Jan 27, 9:45 AM)
✓ Processing (Jan 27, 10:30 AM)
✓ Shipped (Jan 28, 2:15 PM)
○ Out for Delivery
○ Delivered
```

**Informações do pedido:**

- Itens pedidos (imagem, nome, variante, quantidade, preço)
- Quebra de preços (subtotal, frete, imposto, descontos, total)
- Endereço de envio e método
- Endereço de faturamento
- Método de pagamento (últimos 4 dígitos)

**Ações de ordem:**

- Rastrear envio (<a href="link para página de rastreio do transportador">link para página de rastreio do transportador</a>)
- Baixe fatura/nota fiscal (PDF)
- Solicitação de devolução (se elegível e o backend suportar)
- Reordenar itens

**Reordenar itens**

Para reordenar os itens, você pode usar o método `splice()` ou o método `push()` e `shift()`.

### Usando o método `splice()`

```javascript
const arr = [1, 2, 3, 4, 5];

// Reordenar os itens para começar pelo elemento 3
arr.splice(0, 0, arr[2]);
console.log(arr); // [3, 1, 2, 4, 5]

// Reordenar os itens para terminar pelo elemento 2
arr.splice(arr.length - 1, 1);
arr.splice(arr.length, 0, arr[1]);
console.log(arr); // [3, 1, 2]
```

### Usando o método `push()` e `shift()`

```javascript
const arr = [1, 2, 3, 4, 5];

// Reordenar os itens para começar pelo elemento 3
arr.shift();
arr.unshift(arr[2]);
console.log(arr); // [3, 1, 2, 4, 5]

// Reordenar os itens para terminar pelo elemento 2
arr.pop();
arr.push(arr[1]);
console.log(arr); // [3, 1, 2]
```

### Usando a função `sort()`

```javascript
const arr = [1, 2, 3, 4, 5];

// Reordenar os itens em ordem crescente
arr.sort((a, b) => a - b);
console.log(arr); // [1, 2, 3, 4, 5]

// Reordenar os itens em ordem decrescente
arr.sort((a, b) => b - a);
console.log(arr); // [5, 4, 3, 2, 1]
```

### Usando a função `splice()` com índice negativo

```javascript
const arr = [1, 2, 3, 4, 5];

// Reordenar os itens para começar pelo elemento 3
arr.splice(0, 0, arr[2]);
console.log(arr); // [3, 1, 2, 4, 5]

// Reordenar os itens para terminar pelo elemento 2
arr.splice(-1, 1);
arr.splice(arr.length, 0, arr[1]);
console.log(arr); // [3, 1, 2]
```

- Entrar em contato com o suporte sobre o pedido

### Função de Reordenação (Ecommerce-Específica)

**Propósito**: Aumentar as compras repetidas, facilitando a reordenação de compras anteriores.

**Implementação:**

- Botão "Reordenar" nas cartas de pedido e detalhes do pedido
- Verifique a disponibilidade de estoque antes de adicionar ao carrinho
- Trate produtos descontinuados com elegância (pule ou notifique).
- Adicione todos os itens disponíveis ao carrinho
- Mensagem de sucesso: "5 itens adicionados ao carrinho" (ou "3 de 5 itens adicionados - 2 indisponíveis")
- Permaneça na página atual (não navegue para longe)

**Tradeoff**: Adicionar automaticamente ao carrinho (sem atrito) vs redirecionar para a página de carrinho (permitir que o usuário revise primeiro). Recomendar adicionar automaticamente com feedback de sucesso claro.

## Endereços Salvos

**Propósito (CRÍTICO)**: Reduzir atrito no checkout e aumentar a conversão. Endereços salvos tornam as compras repetidas mais rápidas e fáceis.

### # Por que Endereços Importam

Endereços são uma parte fundamental do mundo digital. Eles são como mapas que nos guiam através da internet, permitindo que encontremos e acedamos a diferentes recursos e serviços online. Cada endereço é único e identifica um local específico na rede, seja um website, um servidor, um arquivo ou até mesmo um dispositivo conectado.

## A Importância dos Endereços

- **Facilidade de Acesso:**Endereços simplificam a navegação na web. Em vez de decorar URLs complexas, podemos usar endereços fáceis de lembrar, como "www.exemplo.com", para aceder a um site.
-**Identificação Única:**Cada endereço é exclusivo, garantindo que não haja confusão ou ambiguidade ao aceder a recursos online.
-**Organização:**Eles ajudam a organizar a internet, permitindo que os utilizadores e desenvolvedores estruturem e localizem facilmente conteúdo e serviços.
-**Personalização:**Endereços podem ser personalizados, refletindo a identidade ou propósito de um site, tornando-o mais memorável e atraente.

### Tipos de Endereços

-**Endereços IP:**São números únicos atribuídos a dispositivos conectados à internet. Eles são essenciais para a comunicação entre dispositivos e para a localização de recursos online.
-**URLs (Uniform Resource Locators):**Endereços web que identificam recursos específicos, como páginas, arquivos ou serviços. Eles são compostos por protocolos (como HTTP ou HTTPS), nomes de domínio e caminhos.
-**Endereços de Email:**Usados para identificar contas de email, permitindo a comunicação digital.
-**Endereços Físicos:** Embora não sejam digitais, endereços físicos são cruciais para a entrega de correspondência e para localizar fisicamente locais e empresas.

## Conclusão

Endereços são a espinha dorsal da internet, facilitando a navegação, organização e acesso a recursos online. Eles são uma parte essencial da nossa vida digital, garantindo que possamos encontrar e interagir com o mundo digital de forma eficiente e intuitiva.

**Otimização de conversão:**

- Endereços salvos reduzem o tempo de finalização em mais de 50% (sem necessidade de redigitação)
- Seleção de endereço padrão otimiza fluxo de checkout
- Reduz a abandono de formulários (menos campos a preencher)
- Aumenta a taxa de recompra (checkout mais fácil)

**Integração de Backend:**
Faça o fetch, create, update e delete de endereços via API de backend. Faça isso com base na integração de backend.

### Caderno de Endereços de Exibição

**Lista de endereços salvos:**

- Todos os endereços salvos
- Indicador de endereço padrão (badge: "Envio padrão" ou ícone de estrela)
- Endereço de visualização: Nome, rua, cidade, estado, CEP
- Ações rápidas: Editar, Excluir, Definir como padrão

**Comportamento padrão de endereço:**

- Um endereço de envio padrão
- Uma endereço de cobrança padrão (separado ou o mesmo)
- Used automatically at checkout (user can change)
- Configurando nova atualização padrão sobrepõe a atualização padrão anterior.

### Adicionar/Editar Formulário de Endereço

Coletar informações padrão de envio. Considerações principais:

**Campos obrigatórios:**

- Nome completo (ou primeiro + último)
- Endereço linha 1
- Cidade, Estado/Província, CEP
- País
- Número de telefone (recomendado para coordenação de entrega)

**Melhorias opcionais:**

- Etiqueta de endereço (Casa, Trabalho) para fácil identificação
- API de preenchimento automático de endereço (Google Places) para precisão
- Caixa de seleção "Definir como padrão"

**Validação:**  
Validação em tempo real, especialmente para o formato de CEP/código postal baseado no país.

## Payment Methods

**Nota**: O armazenamento do método de pagamento é opcional. Implemente apenas se:

### Exigências

- A aplicação possa armazenar informações de cartões de crédito.
- A aplicação tenha um controle de acesso seguro para armazenar essas informações.
- A aplicação tenha uma política de privacidade clara que explique como as informações de pagamento são armazenadas e protegidas.

### Exemplo de implementação

```php
// Armazenamento de cartões de crédito
class Cartao {
    private $numero;
    private $codigoSeguranca;
    private $validade;

    public function __construct($numero, $codigoSeguranca, $validade) {
        $this->numero = $numero;
        $this->codigoSeguranca = $codigoSeguranca;
        $this->validade = $validade;
    }

    // Getters e setters
}

// Exemplo de uso
$cartao = new Cartao("1234567890123456", "123", "12/2025");
```

### Links

- [PCI DSS](https://www.pcisecuritystandards.org/): Uma norma internacional para segurança de cartões de crédito.
- [OWASP](https://owasp.org/): Uma organização que fornece recursos e diretrizes para segurança da informação.

- O backend manipula de forma segura os dados de pagamento tokenizados
- Requisitos de conformidade PCI DSS estão atendidos
- Gateway de pagamento suporta tokenização (Stripe, Braintree)

**Segurança (CRÍTICO):**

- Nunca armazene números de cartão completos (tokenize com gateway de pagamento)
- Exibir apenas os últimos 4 dígitos
- Não armazene o CVV
- Use payment gateway hosted forms (Stripe Elements, etc.)
- Exiba o distintivo "Armazenado com segurança" para confiança

**Exibição de pagamento salvo:**

- Logomarca do tipo de cartão (Visa, Mastercard)
- Últimos 4 dígitos
- Data de validade
- Indicador padrão
- Ações: Editar (atualizar data de expiração/endereço de cobrança), Excluir, Definir como Padrão

**Compromisso**: Métodos de pagamento salvos aumentam a conveniência, mas exigem conformidade com PCI. Se não implementados, os usuários inserem o pagamento no checkout cada vez (mais fricção, mas backend mais simples).

## # Perfil e Segurança

[Link para a página de perfil](https://example.com/profile)

## Configurações de Perfil

- **Nome de Usuário:***username*- Email: <example@email.com>
- Data de Cadastro: 15/03/2023

## Configurações de Segurança

-**Autenticação de Dois Fatores:** Ativado

- Dispositivos Conectados:
  - Dispositivo 1: Nome do Dispositivo, Última Atividade: 1 hora atrás
  - Dispositivo 2: Outro Dispositivo, Última Atividade: 3 dias atrás
- Histórico de Login:
  - 19/03/2023: Login bem-sucedido
  - 18/03/2023: Tentativa de login falhada (IP desconhecido)

[Mais informações sobre segurança](https://example.com/security)

## Atualizar Informações

Para atualizar suas informações pessoais, clique [aqui](https://example.com/update-profile).

## Redefinir Senha

Se você esqueceu sua senha, [clique aqui](https://example.com/reset-password) para redefini-la.

### Profile Information

Exibir e editar informações do cliente.

**Campos padrão:**

- Nome completo
- Email (com status de verificação)
- Número de telefone
- Opcional: Data de nascimento, gênero.

**Funcionalidade de edição:**
Edição em linha ou formulário separado, validação em tempo real, confirmação de sucesso.

**Verificação de e-mail:**
Se não verificado, mostrar aviso com botão "Reenviar e-mail de verificação". Se verificado, mostrar selo de marcação.

### Configurações de Segurança

**Alteração de senha:**

- Exigir senha atual (opcional)
- Nova senha com indicador de força
- Confirme a nova senha
- Requisitos da senha (8+ caracteres, maiúscula, número)

**Two-factor authentication (optional):**
Enable/disable 2FA, setup instructions, backup codes. Only implement if backend supports.

## Preferências de E-mail

Controles de e-mail específicos para comércio eletrônico.

**Categorias de preferência:**

1. **E-mails transacionais** (atualizações de pedidos, envio) - Recomendado sempre ativado, pode ser exigido por lei
2. **E-mails de marketing** (vendas, promoções, novos produtos) - Escolha do usuário
3. **Boletim Informativo** (resumo semanal, conteúdo) - Escolha do usuário

**Exibir:**
Lista de caixas de seleção ou interruptores com descrições claras. Botão de salvar na parte inferior.

**Example:**

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
Opt-outs individuais por tipo, botão "Cancelar inscrição de todos os e-mails de marketing". Manter os e-mails transacionais ativados (obrigatório para o cumprimento de pedidos).

## Navegação e Layout

### Layout Pattern Decision

Escolha com base na complexidade da conta:

**Navegação na Barra Lateral (Recomendado):**

- **Use quando**: 6+ seções de conta, recursos de conta complexos
- Área de trabalho: Barra lateral vertical (20-25% da largura) com links de seção
- Celular: Recolher para menu hambúrguer ou lista suspensa
- Benefícios: navegação persistente, profissional, acomoda muitas seções

**Navegação por Abas:**

- **Usar quando**: 4-6 seções de conta, estrutura de conta mais simples
- Abas horizontais na parte superior, aba ativa destacada
- Mobile: Horizontal scroll or dropdown
- Benefícios: Moderno, limpo, troca rápida

**Hub de Contas (Mobile-First):**

- **Usar quando**: Tráfego predominantemente móvel, conta simples
- Landing page com cartões de seção (grade de 2 colunas)
- Toque no cartão para entrar na seção, o botão de voltar retorna ao hub
- Benefícios: Amigável ao toque, intuitivo, hierarquia mínima

### Seção Organização

**Ordem recomendada (do mais ao menos usado):**

1. Dashboard (página inicial)
2. Pedidos (mais acessados)
3. Endereços (importante para o checkout)
4. Métodos de Pagamento (se implementados)
5. Perfil
6. Segurança
7. Configurações de E-mail
8. Sair

## Considerações sobre Dispositivos Móveis

**Padrões específicos para dispositivos móveis:**

**Navegação:**
Hub de conta com cards de seção (2 colunas), ou navegação inferior com 4-5 seções principais (Pedidos, Endereços, Perfil, Mais).

**Formulários:**
Um campo por linha, entradas maiores (altura de 48px), tipos de teclado apropriados (email, telefone, numérico), preenchimento automático ativado.

**Histórico de pedidos:**
Cards de pedidos simplificados, botões em largura total, paginação "Carregar Mais" (melhor do que páginas numeradas no mobile).

**Endereços salvos:**
Cartões de endereço empilhados, largura total, alvos de toque de 48px para editar/excluir.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Painel da conta com pedidos recentes (3-5)
- [ ] Botão de reordenar (adiciona itens ao carrinho, permanece na página)
- [ ] Histórico de pedidos com indicadores de status
- [ ] Filtrar pedidos por intervalo de data e status
- [ ] Pesquisar pedidos por número ou nome do produto
- [ ] Página de detalhes do pedido com informações de rastreamento
- [ ] Linha do tempo do status (Pedido Realizado → Processando → Enviado → Entregue)
- [ ] Botão de rastrear envio (link para transportadora)
- [ ] Opção de download de nota fiscal/comprovante
- [ ] Lista de endereços salvos com indicador de padrão
- [ ] Adicionar/editar/excluir endereços com validação
- [ ] Definir opção de endereço padrão
- [ ] Editar informações do perfil
- [ ] Exibir status de verificação de e-mail
- [ ] Alteração de senha com indicador de força
- [ ] Current password required to change password
- [ ] Preferências de e-mail (transacional vs marketing)
- [ ] Opção de exclusão de conta
- [ ] Logout button clearly visible
- [ ] Navegação clara entre as seções
- [ ] Mobile-responsive (single column, 48px touch targets)
- [ ] Backend integration (all data fetched from API)
- [ ] Confirmações de sucesso após salvamentos
- [ ] Error handling with clear messages
- [ ] Keyboard accessible
- [ ] ARIA labels on navigation sections
- [ ] Anúncios de status de pedido para leitores de tela

**Optional features:**

- [ ] Saved payment methods (if PCI compliant backend)
- [ ] Autenticação em duas etapas
- [ ] Integração de lista de desejos
- [ ] Exibição de pontos/recompensas de fidelidade
- [ ] Seção de gerenciamento de devoluções
- [ ] API de autocompletar de endereço
