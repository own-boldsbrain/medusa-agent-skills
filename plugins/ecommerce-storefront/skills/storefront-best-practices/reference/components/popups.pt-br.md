# Componente Popups

## Conteúdo

- [Visão Geral](#visao-geral)
- [Quando Usar Popups](#quando-usar-popups)
- [Tipos de Popup de E-commerce](#tipos-de-popup-de-e-commerce)
- [Tempo e Gatilhos](#tempo-e-gatilhos)
- [Gerenciamento de Frequência](#gerenciamento-de-frequencia)
- [Considerações para Mobile](#consideracoes-para-mobile)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

Popups (modais/overlays) aparecem sobre o conteúdo principal para capturar a atenção para ações específicas: inscrições em newsletters, ofertas promocionais, ofertas de intenção de saída.

**Conhecimento assumido**: Agentes de IA sabem como construir modais com botões de fechar e sobreposições de fundo (backdrop). Isso foca nos padrões de popups de e-commerce.

**Equilíbrio crítico**: Eficaz para conversões quando usado com moderação, intrusivo e irritante quando usado em excesso. O tempo e a frequência são críticos para o e-commerce.

## Quando Usar Popups

**Use popups quando:**

- Oferecer valor significativo (desconto de 10-20% na primeira compra, frete grátis)
- Promoções sensíveis ao tempo (venda relâmpago terminando em breve)
- Intenção de saída para recuperar visitantes que estão abandonando (oferta de última chance)
- Boas-vindas ao visitante de primeira viagem (apenas uma vez)
- Anúncios importantes (atrasos no envio, mudanças na política)

**Não use popups para:**

- Toda visita à página (extremamente irritante)
- Múltiplos popups por sessão
- Carregamento imediato da página (os usuários ainda não viram o site)
- Usuários mobile (especialmente modais em tela cheia - muito disruptivos)
- Usuários que já se inscreveram ou dispensaram

**Considere alternativas:**

- Banner superior: Menos intrusivo, sempre visível, bom para promoções contínuas
- Formulários inline: Inscrição em newsletter na página inicial ou no rodapé, não bloqueia
- Slide-in (canto): Do canto inferior direito, menos disruptivo do que o popup central
- Pós-compra: Peça o e-mail após um pedido bem-sucedido (alta conversão)

**Popups são melhores quando:** É necessária atenção imediata, a oferta de alto valor justifica a interrupção, intenção de saída (última chance).

## Tipos de Popup de E-commerce

### 1. Desconto na Primeira Compra

**Propósito**: Converter visitantes de primeira viagem com um incentivo de desconto.

**Conteúdo:**

- Título: "Bem-vindo! Ganhe 10% de Desconto no Seu Primeiro Pedido"
- Input de e-mail
- Código de desconto ou aplicação automática
- Botão de inscrever: "Garantir Meu Desconto"

**Tempo**: Após 30-60 segundos no site OU após visualizar 2-3 produtos (sinal de engajamento).

**Frequência**: Uma vez por usuário (cookie/localStorage). Não mostre para clientes recorrentes.

### 2. Inscrição na Newsletter

**Propósito**: Aumentar a lista de e-mails para marketing.

**Conteúdo:**

- Proposta de valor: "Receba ofertas exclusivas e acesso antecipado"
- Input de e-mail
- Botão de inscrever
- Opcional: Incentivo de desconto na primeira compra (10-15% de desconto)

**Tempo**: Após 50% de rolagem OU 60 segundos no site.

**Frequência**: Uma vez por sessão. Se dispensado, não mostre por 30 dias.

### 3. Popup de Intenção de Saída

**Propósito**: Recuperar visitantes que estão abandonando com uma oferta de última chance.

**Gatilho**: O mouse se move em direção ao botão fechar/voltar do navegador (apenas desktop).

**Conteúdo:**

- Urgência: "Espere! Não Perca"
- Oferta: "Ganhe 10% de Desconto no Seu Pedido" ou "Frete Grátis Só Hoje"
- Captura de e-mail (opcional): "Envie-me o código"
- CTA: "Resgatar Oferta" ou "Continuar Comprando"

**Melhor para**: Abandonadores de carrinho, saídas da página do produto, visitantes de primeira viagem.

**Frequência**: Uma vez por sessão. Não mostre se o usuário já adicionou ao carrinho ou está no checkout.

### 4. Lembrete de Abandono de Carrinho

**Propósito**: Lembrar o usuário dos itens no carrinho antes de sair.

**Gatilho**: Intenção de saída quando o carrinho contém itens, mas o usuário está navegando para fora.

**Conteúdo:**

- "Seu Carrinho está Esperando"
- Mostrar o resumo do carrinho (itens, total)
- CTA: "Concluir Seu Pedido" ou "Ver Carrinho"
- Incentivo opcional: "Conclua em 10 minutos para frete grátis"

**Frequência**: Uma vez por sessão com itens no carrinho.

### 5. Anúncio Promocional

**Propósito**: Anunciar vendas, novidades ou eventos em todo o site.

**Conteúdo:**

- Título: "Venda Relâmpago: 40% de Desconto em Tudo"
- Subtexto: "Termina em 3 horas"
- CTA: "Compre Agora"

**Tempo**: Imediato no carregamento da página (se for um evento importante) OU após 30 segundos.

**Frequência**: Uma vez por dia durante o período da promoção.

## Tempo e Gatilhos

**Baseado no tempo:**

- 30-60 segundos após o carregamento da página (tempo suficiente para navegar)
- Nunca imediato (0 segundos) - os usuários precisam ver o site primeiro

**Baseado em engajamento:**

- Após 50% de rolagem (mostra interesse)
- Após visualizar 2-3 produtos (visitante qualificado)
- Após adicionar ao carrinho (apenas intenção de saída)

**Intenção de saída:**

- O mouse se move em direção ao botão fechar/voltar (desktop)
- Rolagem para cima em direção à barra de endereços (mobile - menos confiável)
- Acionar apenas uma vez por sessão
- Não acionar nas páginas de checkout (interrompe a compra)

**Específico da página:**

- Página inicial: Popup de boas-vindas/desconto
- Páginas de produto: Intenção de saída com oferta específica do produto
- Página do carrinho: Não use popups (já engajado)
- Checkout: Nunca use popups (fluxo crítico)

## Gerenciamento de Frequência

**Crítico para UX**: Não mostre o mesmo popup repetidamente para o mesmo usuário.

**Implementação:**

1. **Rastreamento por cookie/localStorage**: Armazene a dispensa/inscrição com data e hora
2. **Respeite as dispensas**: Se o usuário fechar o popup, não mostre por 30 dias
3. **Usuários inscritos**: Nunca mostre o popup da newsletter novamente
4. **Limites de sessão**: Máximo de 1 popup por sessão
5. **Tempo de espera (cooldown)**: Se dispensado, aguarde 30 dias antes de mostrar novamente

**Exemplo de rastreamento:**

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
- Sessão 2+: Apenas intenção de saída (se aplicável)
- Nunca empilhe múltiplos popups

## Considerações para Mobile

**Popups no mobile são MAIS intrusivos:**

- Tela menor = o popup ocupa mais espaço
- Mais difícil de fechar (botão X pequeno)
- Interrompe o fluxo de navegação mobile
- Pode prejudicar o SEO mobile (penalidade do Google por popups intrusivos)

**Melhores práticas para mobile:**

1. **Use com moderação**: Considere um banner superior ou formulários inline
2. **Torne fácil de dispensar**: Botão de fechar grande (44x44px), toque fora para fechar
3. **Atraso maior**: 60+ segundos em vez de 30 segundos
4. **Tamanho menor**: 90% da largura no máximo, não em tela cheia
5. **Intenção de saída**: Menos confiável em mobile, evite
6. **Penalidade do Google**: Evite popups em tela cheia no mobile (prejudica o ranqueamento)

**Alternativa no mobile**: Barra inferior fixa (menos intrusiva)

- "Ganhe 10% de Desconto - Inscreva-se" com input de e-mail
- Sempre visível, mas não bloqueia o conteúdo
- Melhor UX no mobile do que um popup

## Lista de Verificação

**Recursos essenciais:**

- [ ] Proposta de valor clara (desconto, benefício)
- [ ] CTA único e focado
- [ ] Fácil de fechar (botão X, clique no fundo/backdrop, tecla Esc)
- [ ] Tempo atrasado (30-60s, não imediato)
- [ ] Gerenciamento de frequência (rastreamento via localStorage/cookie)
- [ ] Respeite as dispensas (cooldown de 30 dias)
- [ ] Nunca mostrar para usuários já inscritos
- [ ] Máximo de 1 popup por sessão
- [ ] Intenção de saída para abandonadores de carrinho (apenas desktop)
- [ ] Não mostrar em páginas de checkout
- [ ] Mobile: Use com moderação, considere alternativas
- [ ] Mobile: Botão de fechar grande (44x44px)
- [ ] Mobile: Não em tela cheia (máx. de 90% da largura)
- [ ] Validação de e-mail antes do envio
- [ ] Estado de carregamento no envio
- [ ] Mensagem de sucesso ou redirecionamento
- [ ] Acessível via teclado (Tab, Esc, Enter)
- [ ] `role="dialog"` e `aria-modal="true"`
- [ ] Focus trap (manter o foco dentro do popup)
- [ ] ARIA label no botão de fechar
- [ ] Anúncios para leitores de tela ao abrir
