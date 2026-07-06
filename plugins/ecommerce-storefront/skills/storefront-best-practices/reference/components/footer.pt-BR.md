# Component do Rodapé

## Conteúdo

- [Component do Rodapé](#componente-do-rodapé)
  - [Conteúdo](#conteúdo)
  - [Visão Geral](#visão-geral)
    - [Requisitos Chave](#requisitos-chave)
  - [Elementos Essenciais do Rodapé](#elementos-essenciais-do-rodapé)
    - [Conteúdo Obrigatório](#conteúdo-obrigatório)
    - [Layout em Colunas (Desktop)](#layout-em-colunas-desktop)
  - [Links de Categoria Dinâmicos (Específico para E-commerce)](#links-de-categoria-dinâmicos-específico-para-ecommerce)
  - [Inscrição na Newsletter](#inscricao-na-newsletter)
  - [Ícones de Pagamento e Confiança](#icones-de-pagamento-e-confianca)
  - [Rodapé para Mobile](#rodape-para-mobile)
  - [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

O rodapé fornece navegação complementar, informações da empresa e sinais de confiança. Aparece em todas as páginas.

**Conhecimentos assumidos:**Os agentes de IA sabem como criar layouts em colunas e listas de navegação. Este guia se concentra nos padrões de rodapé para e-commerce.

### Requisitos Chave

- Links de navegação (categorias, páginas)
- Recuperação dinâmica de categorias do backend
- Links legais (Privacidade, Termos)
- Inscrição na newsletter
- Ícones de métodos de pagamento
- Links de mídia social
- Responsivo (colunas em desktop, coluna única em mobile)

## Elementos Essenciais do Rodapé

### Conteúdo Obrigatório**Obrigatório:**- Links de navegação (categorias do backend)
- Informações de contato (e-mail, telefone)
- Links legais (Política de Privacidade, Termos de Uso)
- Aviso de direitos autorais com o ano atual**Fortemente recomendado:**- Formulário de inscrição na newsletter
- Ícones de métodos de pagamento
- Links de mídia social
- Sinais de confiança

### Layout em Colunas (Desktop)**Padrão: 4-5 colunas**- Coluna 1: Loja/Categorias (dinâmica do backend)
- Coluna 2: Atendimento ao Cliente (Contato, FAQ, Envio)
- Coluna 3: Empresa (Sobre, Carreiras)
- Coluna 4: Inscrição na newsletter
- Inferior: Links legais, ícones de pagamento, direitos autorais

## Links de Categoria Dinâmicos (Específico para E-commerce)**CRÍTICO: Recupere categorias do backend dinamicamente**- nunca codifique. Recupere da API do backend de e-commerce (para Medusa: `sdk.store.category.list()`).**Benefícios:**- Mantém-se sincronizado com a navegação principal
- Categorias adicionadas/removidas automaticamente
- Sem atualizações manuais no rodapé**Diretrizes:**- Mostrar apenas as categorias de nível superior (máximo 5-8)
- Correspondência das etiquetas com a navegação principal
- Cache dos dados de categoria (raramente muda)

## Inscrição na Newsletter**Elementos essenciais:**- Campo de e-mail + botão ("Assinar")
- Proposta de valor (CRÍTICO): Declare o benefício claramente ("Receba 10% de desconto no seu primeiro pedido", "Ofertas exclusivas + acesso antecipado"). Não apenas diga "Inscreva-se na newsletter".
- Nota sobre privacidade: "Respeitamos sua privacidade" + link para a política de privacidade**Layout:**Input + botão em linha (desktop), empilhados (mobile). Full width no mobile.

## Ícones de Pagamento e Confiança**Ícones de métodos de pagamento:**Exibir métodos de pagamento aceitos (Visa, Mastercard, PayPal, Apple Pay, Google Pay). Ícones de 40-50px, linha horizontal, inferior do rodapé.**Ícones de confiança (opcional):**Máximo 3-4 certificações legítimas (SSL, BBB, garantia de reembolso). Use apenas ícones reais com links de verificação.

## Rodapé para Mobile**Coluna única, empilhada:**Logo → Navegação → Newsletter → Social → Legal/direitos autorais.**Seções dobráveis (opcional):**Padrão acordeon para a navegação para reduzir a altura. Mantenha o newsletter/social sempre visível.**Para toque:**Links de 44px mínimo, espaçamento de 8-12px, texto de 14-16px, altura do campo de newsletter de 48px.

## Lista de Verificação**Recursos essenciais:**

- [ ] Links de navegação (categorias, páginas)
- [ ] Categorias recuperadas dinamicamente do backend
- [ ] Informações de contato (e-mail, telefone)
- [ ] Links legais (Política de Privacidade, Termos de Uso)
- [ ] Aviso de direitos autorais com o ano atual
- [ ] Formulário de inscrição na newsletter com proposta de valor
- [ ] Ícones de métodos de pagamento
- [ ] Links de mídia social
- [ ] Responsivo (colunas em desktop, coluna única em mobile)
- [ ] Mobile: Alvos de toque de 44px
- [ ] Mobile: Seções dobráveis (opcional)
- [ ] HTML semântico (`<footer>`, `<nav>` sections)
- [ ] Rótulos ARIA para a navegação ("Navegação do rodapé")
- [ ] Acessível por teclado
- [ ] Indicadores de foco visíveis
- [ ] Contraste de cor mínimo de 4.5:1
- [ ] Consistente em todas as páginas
