# Componente Footer

## Conteúdo

- [Componente Footer](#componente-footer)
  - [Conteúdo](#conteudo)
  - [Visão Geral](#visao-geral)
    - [Principais Requisitos](#principais-requisitos)
  - [Elementos Essenciais do Rodapé](#elementos-essenciais-do-rodape)
    - [Conteúdo Obrigatório](#conteudo-obrigatorio)
    - [Layout em Múltiplas Colunas (Desktop)](#layout-em-multiplas-colunas-desktop)
  - [Links de Categoria Dinâmicos (Específico para E-commerce)](#links-de-categoria-dinamicos-especifico-para-e-commerce)
  - [Inscrição na Newsletter](#inscricao-na-newsletter)
  - [Selos de Pagamento e Confiança](#selos-de-pagamento-e-confianca)
  - [Rodapé para Mobile](#rodape-para-mobile)
  - [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

O rodapé (footer) fornece navegação suplementar, informações da empresa e sinais de confiança. Aparece em todas as páginas.

**Conhecimento assumido**: Agentes de IA sabem como construir layouts de múltiplas colunas e listas de navegação. Este guia se concentra em padrões de rodapé para e-commerce.

### Principais Requisitos

- Links de navegação (categorias, páginas)
- Busca dinâmica de categorias no backend
- Links legais (Privacidade, Termos)
- Inscrição na newsletter
- Selos de métodos de pagamento
- Links para redes sociais
- Responsivo (múltiplas colunas no desktop, coluna única no mobile)

## Elementos Essenciais do Rodapé

### Conteúdo Obrigatório

**Obrigatório:**

- Links de navegação (categorias vindas do backend)
- Informações de contato (e-mail, telefone)
- Links legais (Política de Privacidade, Termos de Serviço)
- Aviso de direitos autorais (copyright) com o ano atual

**Fortemente recomendado:**

- Formulário de inscrição na newsletter
- Selos de métodos de pagamento
- Links de redes sociais
- Sinais de confiança

### Layout em Múltiplas Colunas (Desktop)

**Padrão standard: 4-5 colunas**

- Coluna 1: Loja/Categorias (dinâmico do backend)
- Coluna 2: Atendimento ao Cliente (Contato, FAQ, Frete)
- Coluna 3: Empresa (Sobre, Carreiras)
- Coluna 4: Inscrição na newsletter
- Fundo: Links legais, selos de pagamento, copyright

## Links de Categoria Dinâmicos (Específico para E-commerce)

**CRÍTICO: Busque as categorias dinamicamente do backend** - nunca faça hardcode. Busque na API do backend de e-commerce (para o Medusa: `sdk.store.category.list()`).

**Benefícios:**

- Permanece em sincronia com a navegação principal
- Categorias adicionadas/removidas automaticamente
- Sem necessidade de atualizações manuais no rodapé

**Diretrizes:**

- Mostrar apenas categorias de nível superior (máximo de 5-8)
- Corresponder aos rótulos da navegação principal
- Fazer cache dos dados da categoria (raramente muda)

## Inscrição na Newsletter

**Elementos essenciais:**

- Input de e-mail + botão de envio ("Inscrever-se")
- **Proposta de valor (CRÍTICO)**: Declare um benefício claro ("Ganhe 10% de desconto no seu primeiro pedido", "Ofertas exclusivas + acesso antecipado"). Não diga apenas "Inscreva-se na newsletter".
- Nota de privacidade: "Nós respeitamos sua privacidade" + link para a política de privacidade

**Layout:** Input + botão na mesma linha (desktop), empilhados (mobile). Largura total no mobile.

## Selos de Pagamento e Confiança

**Ícones de métodos de pagamento:**
Exiba os pagamentos aceitos (Visa, Mastercard, PayPal, Apple Pay, Google Pay). Ícones de 40-50px, linha horizontal, na parte inferior do rodapé.

**Selos de confiança (opcional):**
Máximo de 3-4 certificações legítimas (SSL, Reclame Aqui, garantia de devolução do dinheiro). Use apenas selos reais com links de verificação.

## Rodapé para Mobile

**Coluna única, empilhada:** Logo → Navegação → Newsletter → Redes Sociais → Legais/copyright.

**Seções colapsáveis (opcional):** Padrão de sanfona (accordion) para navegação para reduzir a altura. Mantenha a newsletter/redes sociais sempre visíveis.

**Adequado para toque:** Links com no mínimo 44px, espaçamento de 8-12px, texto de 14-16px, altura do input de newsletter de 48px.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Links de navegação (categorias, páginas)
- [ ] Categorias buscadas dinamicamente no backend
- [ ] Informações de contato (e-mail, telefone)
- [ ] Links legais (Política de Privacidade, Termos de Serviço)
- [ ] Aviso de direitos autorais com o ano atual
- [ ] Formulário de inscrição na newsletter com proposta de valor
- [ ] Ícones de métodos de pagamento
- [ ] Links de redes sociais
- [ ] Responsivo (4-5 colunas desktop, coluna única mobile)
- [ ] Mobile: Alvos de toque de 44px
- [ ] Mobile: Seções colapsáveis (opcional)
- [ ] HTML semântico (seções `<footer>`, `<nav>`)
- [ ] ARIA labels na navegação ("Navegação do rodapé")
- [ ] Acessível via teclado
- [ ] Indicadores de foco visíveis
- [ ] Contraste de cor mínimo de 4.5:1
- [ ] Consistente em todas as páginas
