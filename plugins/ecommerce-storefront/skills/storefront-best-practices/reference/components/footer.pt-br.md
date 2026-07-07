# Componente de rodapé

## Índice

- [Componente de rodapé](#componente-de-rodapé)
  - [Índice](#índice)
  - [Visão geral](#visão-geral)
    - [Requisitos principais](#requisitos-principais)
  - [Elementos essenciais do rodapé](#elementos-essenciais-do-rodapé)
    - [Conteúdo obrigatório](#conteúdo-obrigatório)
    - [Layout com várias colunas (desktop)](#layout-com-várias-colunas-desktop)
  - [Links dinâmicos de categorias (específicos para comércio eletrônico)](#links-dinâmicos-de-categorias-específico-para-comércio-eletrônico)
  - [Inscrição na newsletter](#inscrição-na-newsletter)
  - [Símbolos de pagamento e confiança](#ícones-de-pagamento-e-selos-de-confiança)
  - [Rodapé para dispositivos móveis](#rodapé-para-dispositivos-móveis)
  - [Lista de verificação](#lista-de-verificação)

## Visão geral

O rodapé oferece navegação complementar, informações sobre a empresa e sinais de confiança. Aparece em todas as páginas.

**Conhecimentos prévios**: os agentes de IA sabem como criar layouts com várias colunas e listas de navegação. Este guia se concentra em padrões de rodapé para comércio eletrônico.

### Requisitos principais

- Links de navegação (categorias, páginas)
- Busca dinâmica de categorias no backend
- Links legais (Política de Privacidade, Termos de Uso)
- Inscrição na newsletter
- Emblemas de formas de pagamento
- Links para redes sociais
- Responsivo (várias colunas no desktop, coluna única no celular)

## Elementos essenciais do rodapé

### Conteúdo obrigatório

**Obrigatório:**

- Links de navegação (categorias do back-end)
- Informações de contato (e-mail, telefone)
- Links legais (Política de Privacidade, Termos de Serviço)
- Aviso de direitos autorais com o ano atual

**Altamente recomendado:**

- Formulário de inscrição na newsletter
- Emblemas de formas de pagamento
- Links para redes sociais
- Sinais de confiança

### Layout com várias colunas (desktop)

**Padrão padrão: 4-5 colunas**

- Coluna 1: Loja/Categorias (dinâmicas no back-end)
- Coluna 2: Atendimento ao cliente (Contato, Perguntas frequentes, Envio)
- Coluna 3: Empresa (Sobre nós, Carreiras)
- Coluna 4: Inscrição na newsletter
- Parte inferior: Links jurídicos, selos de pagamento, direitos autorais

## Links dinâmicos de categorias (específico para comércio eletrônico)

**IMPORTANTE: Busque as categorias dinamicamente no backend** — nunca use valores fixos. Busque-as pela API do backend de comércio eletrônico (para Medusa: `sdk.store.category.list()`).

**Benefícios:**

- Mantém-se sincronizado com a navegação principal
- Categorias adicionadas/removidas automaticamente
- Não há necessidade de atualizações manuais no rodapé

**Diretrizes:**

- Mostrar apenas as categorias de nível superior (máximo de 5 a 8)
- Alinhar os rótulos com a navegação principal
- Armazenar em cache os dados das categorias (raramente mudam)

## Inscrição na newsletter

**Elementos essenciais:**

- Campo para e-mail + botão de envio (“Inscrever-se”)
- **Proposta de valor (FUNDAMENTAL)**: Indique um benefício claro (“Ganhe 10% de desconto no seu primeiro pedido”, “Ofertas exclusivas + acesso antecipado”). Não se limite a dizer “Inscreva-se na newsletter”.
- Aviso de privacidade: “Respeitamos sua privacidade” + link para a política de privacidade

**Layout:** Campo de preenchimento + botão alinhados (computador), empilhados (celular). Largura total no celular.

## Ícones de pagamento e selos de confiança

**Ícones de formas de pagamento:**
Exiba as formas de pagamento aceitas (Visa, Mastercard, PayPal, Apple Pay, Google Pay). Ícones de 40 a 50 px, dispostos em linha horizontal, na parte inferior do rodapé.

**Selos de confiança (opcional):**
No máximo 3 a 4 certificações válidas (SSL, BBB, garantia de reembolso). Use apenas selos reais com links de verificação.

## Rodapé para dispositivos móveis

**Coluna única, empilhada:** Logotipo → Navegação → Boletim informativo → Redes sociais → Informações legais/direitos autorais.

**Seções recolhíveis (opcional):** Padrão de acordeão para a navegação, a fim de reduzir a altura. Mantenha o boletim informativo e as redes sociais sempre visíveis.

**Otimizado para telas sensíveis ao toque:** links com no mínimo 44px, espaçamento de 8 a 12px, texto de 14 a 16px, altura do campo de inscrição na newsletter de 48px.

## Lista de verificação

**Recursos essenciais:**

- [ ] Links de navegação (categorias, páginas)
- [ ] Categorias carregadas dinamicamente do backend
- [ ] Informações de contato (e-mail, telefone)
- [ ] Links legais (Política de Privacidade, Termos de Serviço)
- [ ] Aviso de direitos autorais com o ano atual
- [ ] Formulário de inscrição na newsletter com proposta de valor
- [ ] Ícones de formas de pagamento
- [ ] Links para redes sociais
- [ ] Responsivo (4 a 5 colunas no desktop, uma coluna no celular)
- [ ] Dispositivos móveis: áreas de toque de 44px
- [ ] Dispositivos móveis: seções recolhíveis (opcional)
- [ ] HTML semântico (seções `<footer>`, `<nav>`)
- [ ] Rótulos ARIA na navegação (“Navegação no rodapé”)
- [ ] Acessível por teclado
- [ ] Indicadores de foco visíveis
- [ ] Contraste de cores mínimo de 4,5:1
- [ ] Consistência em todas as páginas
