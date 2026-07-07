# Componente Pop-ups

## Índice

- [Visão geral](#visao-geral)
- [Quando usar pop-ups](#quando-usar-pop-ups)
- [Tipos de pop-ups para comércio eletrônico](#tipos-de-pop-ups-para-comercio-eletronico)
- [Tempo e gatilhos](#momento-e-gatilhos)
- [Gerenciamento de frequência](#gerenciamento-de-frequencia)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

Os pop-ups (modais/sobreposições) aparecem sobre o conteúdo principal para chamar a atenção para ações específicas: inscrições em boletins informativos, ofertas promocionais, ofertas de intenção de saída.

**Conhecimento prévio**: os agentes de IA sabem como criar modais com botões de fechar e sobreposições de fundo. Este conteúdo se concentra em padrões de pop-ups para comércio eletrônico.

**Equilíbrio crítico**: eficaz para conversões quando usado com moderação, mas intrusivo e irritante quando usado em excesso. O momento certo e a frequência são fundamentais para o comércio eletrônico.

## Quando usar pop-ups

**Use pop-ups quando:**

- Oferecer valor significativo (desconto de 10 a 20% na primeira compra, frete grátis)
- Promoções com prazo limitado (promoção relâmpago que termina em breve)
- Detecção de intenção de saída para recuperar visitantes que estão abandonando o site (oferta de última chance)
- Boas-vindas a visitantes de primeira visita (apenas uma vez)
- Anúncios importantes (atrasos na entrega, mudanças nas políticas)

**Não use pop-ups para:**

- Cada visita à página (extremamente irritante)
- Vários pop-ups por sessão
- Carregamento imediato da página (os usuários ainda não viram o site)
- Usuários de dispositivos móveis (especialmente janelas pop-up em tela cheia — muito perturbadoras)
- Usuários que já se cadastraram ou fecharam a janela

**Considere alternativas:**

- Banner superior: menos intrusivo, sempre visível, bom para promoções em andamento
- Formulários embutidos: cadastro para boletim informativo na página inicial ou no rodapé, sem bloquear a visualização
- Janela deslizante (no canto): a partir do canto inferior direito, menos perturbadora do que uma janela pop-up central
- Pós-compra: solicite o e-mail após o pedido ser concluído com sucesso (alta conversão)

**Os pop-ups são mais eficazes quando:** é necessária atenção imediata, uma oferta de alto valor justifica a interrupção ou há intenção de saída (última chance).

## Tipos de pop-ups para comércio eletrônico

### 1. Desconto na primeira compra

**Objetivo**: converter visitantes de primeira visita com o incentivo de um desconto.

**Conteúdo:**

- Título: “Bem-vindo! Ganhe 10% de desconto no seu primeiro pedido”
- Campo para inserção de e-mail
- Código de desconto ou aplicação automática
- Botão de inscrição: “Receba meu desconto”

**Momento**: Após 30 a 60 segundos no site OU após visualizar 2 a 3 produtos (sinal de engajamento).

**Frequência**: Uma vez por usuário (cookie/localStorage). Não exibir para clientes recorrentes.

### 2. Inscrição na newsletter

**Objetivo**: Aumentar a lista de e-mails para fins de marketing.

**Conteúdo:**

- Proposta de valor: “Receba ofertas exclusivas e acesso antecipado”
- Campo para e-mail
- Botão “Inscrever-se”
- Opcional: incentivo de desconto na primeira compra (10 a 15% de desconto)

**Momento**: Após rolagem de 50% OU 60 segundos no site.

**Frequência**: Uma vez por sessão. Se for fechado, não exibir por 30 dias.

### 3. Pop-up de intenção de saída

**Objetivo**: Recuperar visitantes que estão saindo do site com uma oferta de última chance.

**Gatilho**: O mouse se move em direção ao botão de fechar ou voltar do navegador (somente no desktop).

**Conteúdo:**

- Urgência: “Espere! Não perca essa oportunidade”
- Oferta: “Ganhe 10% de desconto no seu pedido” ou “Frete grátis somente hoje”
- Captura de e-mail (opcional): “Envie-me o código”
- CTA: “Resgate a oferta” ou “Continue comprando”

**Ideal para**: Usuários que abandonam o carrinho, saídas da página do produto, visitantes de primeira visita.

**Frequência**: Uma vez por sessão. Não exiba se o usuário já tiver adicionado itens ao carrinho ou estiver no checkout.

### 4. Lembrete de abandono do carrinho

**Objetivo**: Lembrar o usuário dos itens no carrinho antes de sair.

**Gatilho**: Intenção de saída quando o carrinho contém itens, mas o usuário está saindo da página.

**Conteúdo:**

- “Seu carrinho está esperando”
- Mostrar resumo do carrinho (itens, total)
- CTA: “Conclua seu pedido” ou “Ver carrinho”
- Incentivo opcional: “Conclua em 10 minutos para frete grátis”

**Frequência**: Uma vez por sessão com itens no carrinho.

### 5. Anúncio promocional

**Objetivo**: Anunciar promoções, novidades ou eventos em todo o site.

**Conteúdo:**

- Título: “Promoção relâmpago: 40% de desconto em tudo”
- Subtítulo: “Termina em 3 horas”
- CTA: “Compre agora”

**Momento**: Imediatamente após o carregamento da página (se for um evento importante) OU após 30 segundos.

**Frequência**: Uma vez por dia durante o período da promoção.

## Momento e Gatilhos

**Baseado no tempo:**

- 30 a 60 segundos após o carregamento da página (tempo suficiente para navegar)
- Nunca imediatamente (0 segundos) — os usuários precisam ver o site primeiro

**Baseado no engajamento:**

- Após rolagem de 50% (demonstra interesse)
- Após visualizar 2 a 3 produtos (visitante qualificado)
- Após adicionar ao carrinho (somente intenção de saída)

**Intenção de saída:**

- O mouse se move em direção ao botão Fechar/Voltar (desktop)
- Role a tela para cima em direção à barra de endereço (dispositivos móveis – menos confiável)
- Acione apenas uma vez por sessão
- Não acione em páginas de finalização de compra (interrompe a compra)

**Específico por página:**

- Página inicial: Pop-up de boas-vindas/desconto
- Páginas de produtos: Pop-up de intenção de saída com oferta específica para o produto
- Página do carrinho: Não use pop-ups (o usuário já está engajado)
- Finalização da compra: nunca use pop-ups (fluxo crítico)

## Gerenciamento de frequência

**Fundamental para a experiência do usuário (UX)**: não exiba o mesmo pop-up repetidamente para o mesmo usuário.

**Implementação:**

1. **Rastreamento por cookies/localStorage**: armazene o fechamento/cadastro com registro de data e hora
2. **Respeitar o fechamento**: Se o usuário fechar a janela pop-up, não exibi-la por 30 dias
3. **Usuários cadastrados**: nunca mais exiba a janela pop-up da newsletter
4. **Limites de sessão**: no máximo 1 janela pop-up por sessão
5. **Tempo de espera**: se fechada, aguarde 30 dias antes de exibi-la novamente

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

- Sessão 1: Pop-up de desconto de boas-vindas
- Sessão 2 e seguintes: Apenas com intenção de saída (se aplicável)
- Nunca acumule vários pop-ups

## Considerações para dispositivos móveis

**Os pop-ups em dispositivos móveis são MAIS intrusivos:**

- Tela menor = o pop-up ocupa mais espaço
- Mais difícil de fechar (botão X pequeno)
- Interrompe o fluxo de navegação no celular
- Pode prejudicar o SEO para dispositivos móveis (penalidade do Google por intersticiais intrusivos)

**Melhores práticas para dispositivos móveis:**

1. **Use com moderação**: considere usar banners na parte superior ou formulários embutidos
2. **Facilite o fechamento**: botão de fechamento grande (44x44px), toque fora da janela para fechar
3. **Atraso maior**: mais de 60 segundos em vez de 30 segundos
4. **Tamanho menor**: largura máxima de 90%, não em tela cheia
5. **Intenção de saída**: menos confiável em dispositivos móveis, evite
6. **Penalidade do Google**: evite pop-ups em tela cheia em dispositivos móveis (prejudica as classificações)

**Alternativa para dispositivos móveis**: Barra fixa na parte inferior (menos intrusiva)

- “Ganhe 10% de desconto – Cadastre-se” com campo para e-mail
- Sempre visível, mas não bloqueia o conteúdo
- Melhor experiência do usuário em dispositivos móveis do que um pop-up

## Lista de verificação

**Recursos essenciais:**

- [ ] Proposta de valor clara (desconto, benefício)
- [ ] CTA único e direcionado
- [ ] Fácil de fechar (botão X, clique no fundo, tecla Escape)
- [ ] Tempo de exibição retardado (30 a 60 s, não imediato)
- [ ] Gerenciamento de frequência (rastreamento por localStorage/cookies)
- [ ] Respeitar o fechamento (período de espera de 30 dias)
- [ ] Nunca exibir para usuários cadastrados
- [ ] No máximo 1 pop-up por sessão
- [ ] Detecção de intenção de saída para usuários que abandonam o carrinho (somente em desktop)
- [ ] Não exibir nas páginas de finalização de compra
- [ ] Celular: usar com moderação, considerar alternativas
- [ ] Celular: botão de fechar grande (44x44px)
- [ ] Celular: não ocupar a tela inteira (máximo de 90% da largura)
- [ ] Validação do e-mail antes do envio
- [ ] Indicador de carregamento ao enviar
- [ ] Mensagem de sucesso ou redirecionamento
- [ ] Acessível por teclado (Tab, Escape, Enter)
- [ ] `role="dialog"` e `aria-modal="true"`
- [ ] Retentor de foco (manter o foco dentro do pop-up)
- [ ] Rótulo ARIA no botão Fechar
- [ ] Anúncios do leitor de tela ao abrir
