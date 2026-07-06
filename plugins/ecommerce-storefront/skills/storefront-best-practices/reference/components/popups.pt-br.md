# Componente de Popups

## Conteúdo

- [Visão Geral](#visão-geral)
- [Quando Usar Pop-ups](#quando-usar-pop-ups)
- [Tipos de Popup de Comércio Eletrônico](#tipos-de-popup-de-comercio-eletronico)
- [Tempo e Desencadeadores](#tempo-e-desencadeadores)
- [Gerenciamento de Frequência](#gerenciamento-de-frequência)
- [Considerações Móveis](#considerações-móveis)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

Popups (modais/sobreposições) aparecem sobre o conteúdo principal para captar atenção para ações específicas: inscrições em newsletters, ofertas promocionais, ofertas de saída.

**Conhecimento prévio**: Os agentes de inteligência artificial sabem como criar modais com botões de fechar e sobreposições de fundo. Este se concentra em padrões de popups de comércio eletrônico.

**Balanço crítico**: Efetivo para conversões quando usado com moderação, intrusivo e irritante quando usado em excesso. O tempo e a frequência são críticos para o comércio eletrônico.

## Quando Usar Popups

**Use popups quando:***Quando o usuário precisa de mais informações sobre um item específico.

- Quando você deseja criar uma experiência de usuário mais interativa.
- Quando o conteúdo é muito grande ou complexo para ser exibido em uma única tela.
- Quando você deseja fornecer uma forma de feedback ao usuário.

### Exemplo

```html
<!-- Crie um botão que, ao ser clicado, exibe uma popup com informações adicionais -->
<button id="myButton">Clique aqui</button>

<!-- Crie o popup com as informações adicionais -->
<div id="myPopup" style="display:none;">
  <h2>Informações adicionais</h2>
  <p>Este é um exemplo de popup com informações adicionais.</p>
  <button id="closeButton">Fechar</button>
</div>

<!-- Adicione um evento de clique ao botão para exibir o popup -->
<script>
  document.getElementById("myButton").addEventListener("click", function() {
    document.getElementById("myPopup").style.display = "block";
  });

  // Adicione um evento de clique ao botão de fechar para esconder o popup
  document.getElementById("closeButton").addEventListener("click", function() {
    document.getElementById("myPopup").style.display = "none";
  });
</script>
```

- Oferecendo um valor significativo (10-20% de desconto na primeira compra, envio grátis)
- Promoções com prazo limitado (venda relâmpago terminando em breve)
- Saída-intencional para recuperar visitantes que abandonam (última oferta de chance)
- Bem-vindo a primeira visita (apenas uma vez)
- Anúncios importantes (atrasos de envio, mudanças de política)

**Não use pop-ups para:**

- Cada visita de página (extremamente irritante)
- Múltiplos pop-ups por sessão
- Carregamento imediato da página (os utilizadores ainda não viram o site)
- Usuários móveis (especialmente os takeovers de tela cheia - muito disruptivos)
- Usuários que já se registraram ou recusaram o consentimento

**Considere alternativas:**

- Banner superior: Menos intrusivo, sempre visível, bom para promoções contínuas
- Formulários inline: Página inicial ou inscrição na newsletter do rodapé, não bloqueante.
- Slide-in (canto): Do canto inferior direito, menos intrusivo do que um popup central.
- Pós-venda: Peça o e-mail após a ordem bem-sucedida (alta conversão)

**Popups são melhores quando:** Precisam de atenção imediata, oferta de alta valor justifica a interrupção, intenção de saída (última chance).

## Tipos de Popup para Ecommerce

### 1. Desconto de Primeira Compra

**Propósito**: Converter visitantes pela primeira vez com incentivo de desconto.

**Conteúdo:**

- Título: "Bem-vindo! Desconto de 10% na sua primeira encomenda"
- Campo de e-mail
- Código de desconto ou aplicação automática
- Botão de inscrição: "Obter Meu Desconto"

**Tempo**: Após 30-60 segundos no site OU após visualizar 2-3 produtos (sinal de envolvimento).

**Frequência**: Uma vez por usuário (cookie/localStorage). Não mostrar para clientes retornantes.

### 2. Inscrição no Boletim

**Propósito**: Aumentar a lista de e-mails para marketing.

**Content:**

- Proposta de valor: "Consiga ofertas exclusivas e acesso antecipado"
- Campo de e-mail
- Botão de inscrever-se
- Opcional: Desconto de incentivo de primeira compra (10-15% de desconto)

**Timing**: After 50% scroll OR 60 seconds on site.

**Frequência**: Uma vez por sessão. Se desmarcado, não mostrar por 30 dias.

### 3. Popup de Intenção de Sair

**Propósito**: Recuperar visitantes que estão prestes a abandonar com uma oferta de última chance.

**Disparador**: O mouse se move em direção ao botão de fechar/voltar do navegador (apenas para desktop).

**Conteúdo:**

- Urgência: "Espere! Não perca!"
- Oferta: "Ganhe 10% de Desconto na sua Compra" ou "Frete Grátis Apenas Hoje"
- Captura de e-mail (opcional): "Envie-me o código"
- CTA: "Reclame Oferta" ou "Continue Comprando"

**Melhor para**: abandonadores de carrinho, saídas de página de produto, visitantes pela primeira vez.

**Frequência**: Uma vez por sessão. Não mostrar se o usuário já adicionou ao carrinho ou estiver no checkout.

### 4. Lembrete de Abandono de Carrinho

**Purpose**: Remind user of items in cart before leaving.

**Gatilho**: Intenção de saída quando o carrinho contém itens, mas o usuário está navegando para fora.

**Conteúdo:**

- O seu carrinho está esperando.
- Mostrar resumo do carrinho (itens, total)
- CTA: "Finalize Seu Pedido" ou "Ver Carrinho"
- Incentivo opcional: "Complete em 10 minutos e ganhe frete grátis"

**Frequência**: Uma vez por sessão com itens no carrinho.

### 5. Anúncio Promocional

**Propósito**: Anunciar vendas, novas chegadas ou eventos em todo o site.

**Conteúdo:**

- Título: "Promoção Relâmpago: 40% de Desconto em Tudo"
- Subtexto: "Termina em 3 horas"
- CTA: "Compre Agora"

**Timing**: Imediato no carregamento da página (se for um evento importante), OU após 30 segundos.

**Frequência**: Uma vez por dia durante o período promocional.

## Timming e Gatilhos

**Baseado em tempo:**

- 30-60 segundos após o carregamento da página (tempo suficiente para navegar)
- Nunca imediato (0 segundos) - os usuários precisam ver o site primeiro

**Baseado em engajamento:**

- Após 50% de rolagem (demonstra interesse)
- Após visualizar 2-3 produtos (visitante qualificado)
- Após adicionar ao carrinho (apenas intenção de saída)

**Exit-intent:**

- O mouse se move em direção ao botão de fechar/voltar (desktop)
- Role a página para cima em direção à barra de endereços (mobile - menos confiável)
- Disparar apenas uma vez por sessão
- Não acionar nas páginas de checkout (interrompe a compra)

**Página específica:**

- Página Inicial: Bem-vindo/popup de desconto
- Páginas de produtos: Exit-intent com oferta específica do produto
- Cart page: Don't use popups (already engaged)
- Checkout: Nunca use pop-ups (fluxo crítico)

## Gerenciamento de Frequência

**Crítico para UX**: Não mostre a mesma pop-up repetidamente ao mesmo usuário.

**Implementação:**

1. **Cookie/localStorage rastreamento**: Armazenar descarte/cadastro com carimbo de data/hora
2. **Respeite dispensas**: Se o usuário fechar o pop-up, não mostre por 30 dias
3. **Usuários cadastrados**: Nunca mais mostrar pop-up de newsletter novamente
4. **Limites de sessão**: Máx. 1 popup por sessão
5. **Tempo de espera**: Se dispensado, aguarde 30 dias antes de mostrar novamente

**Example tracking:**

```javascript
// On popup dismiss
localStorage.setItem('popup_dismissed', Date.now())
localStorage.setItem('popup_type', 'welcome_discount')

// Before showing popup
const dismissedTime = localStorage.getItem('popup_dismissed')
const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
if (daysSince < 30) {
  // Don't show popup
}
```

**Divulgação progressiva:**

- Sessão 1: Popup de desconto de boas-vindas
- Sessão 2+: Exit-intent apenas (se aplicável)
- Nunca empilhe vários popups

## Considerações Mobile

**Pop-ups em dispositivos móveis são MAIS intrusivos:**

- Tela menor = popup ocupa mais espaço
- Mais difícil de fechar (pequeno botão X)
- Interrompe o fluxo de navegação móvel
- Pode prejudicar o SEO mobile (penalização do Google para intersticiais intrusivos)

**Melhores práticas para mobile:**

1. **Use com moderação**: Considere um banner superior ou formulários inline em vez disso
2. **Facilmente dispensável**: Botão de fechar grande (44x44px), toque fora para fechar
3. **Atraso maior**: 60+ segundos em vez de 30 segundos
4. **Tamanho menor**: largura máxima de 90%, não tela cheia
5. **Exit-intent**: Less reliable on mobile, avoid
6. **Google penalty**: Evite popups em tela cheia em dispositivos móveis (prejudica as classificações)

**Alternativa móvel**: Barra inferior fixa (menos intrusiva)

- Obtenha 10% de Desconto - Cadastre-se com email
- Sempre visível, mas não bloqueia o conteúdo
- Melhor UX móvel do que popup

## Checklist

**Recursos essenciais:**

- [ ] Proposição de valor clara (desconto, benefício)
- [ ] Única CTA focada
- [ ] Fácil de fechar (botão X, clique no fundo, tecla Escape)
- [ ] Tempo atrasado (30-60s, não imediato)
- [ ] Gerenciamento de frequência (rastreamento por localStorage/cookie)
- [ ] Respeitar dispensas (cooldown de 30 dias)
- [ ] Nunca mostrar para usuários cadastrados
- [ ] Máx. 1 popup por sessão
- [ ] Exit-intent para carrinhos abandonados (apenas desktop)
- [ ] Não mostrar nas páginas de checkout
- [ ] Mobile: Use com moderação, considere alternativas
- [ ] Mobile: Botão de fechar grande (44x44px)
- [ ] Mobile: Não em tela cheia (90% de largura no máximo)
- [ ] Validação de e-mail antes de enviar
- [ ] Estado de carregamento ao enviar
- [ ] Mensagem de sucesso ou redirecionamento
- [ ] Acessível pelo teclado (Tab, Escape, Enter)
- [ ] `role="dialog"` and `aria-modal="true"`
- [ ] Armadilha de foco (manter o foco dentro do popup)
- [ ] Rótulo ARIA no botão de fechar
- [ ] Anúncios do leitor de tela ao abrir
