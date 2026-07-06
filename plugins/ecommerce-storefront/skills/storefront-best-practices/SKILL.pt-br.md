---
name: storefront-best-practices
description: SEMPRE use esta habilidade ao trabalhar em vitrines de ecommerce, lojas online, sites de compras. Use para QUALQUER componente da vitrine, incluindo páginas de checkout, carrinho, fluxos de pagamento, páginas de produtos, listagens de produtos, navegação, homepage ou QUALQUER página/componente em uma vitrine. CRUCIAL para adicionar checkout, implementar carrinho, integrar backend Medusa ou criar qualquer funcionalidade de ecommerce. Independente de framework (Next.js, SvelteKit, TanStack Start, React, Vue). Oferece padrões, estruturas de decisão, orientação de integração backend.
---

# Práticas recomendadas para vitrines de comércio eletrônico

Orientação abrangente para construir vitrines de comércio eletrônico modernas e de alta conversão, abarcando padrões de UI/UX, design de componentes, estruturas de layout, otimização de SEO e responsividade móvel.

## # **Quando Aplicar**##**Aplicação**

Você pode aplicar este produto em qualquer momento durante o dia.

**SEMPRE carregue esta habilidade ao trabalhar em QUALQUER tarefa de vitrine:**

- **Adicionando página de checkout/fluxo** - Pagamento, envio, colocação da ordem
- **Implementando carrinho** - Página do carrinho, popup do carrinho, funcionalidade de adicionar ao carrinho
- **Criando páginas de produtos** - Detalhes do produto, listagens de produtos, grades de produtos
- **Criando navegação** - Barra de navegação, megamenu, rodapé, menu móvel
- **Integrando backend Medusa** - configuração do SDK, carrinho, produtos, pagamento

# Integrando backend Medusa

## SDK setup

### Instalando o SDK

```bash
npm install @medusajs/medusa
```

### Configurando o SDK

```javascript
const medusa = new Medusa({
  // URL do servidor Medusa
  url: 'https://example.com/medusa',
  // Chave de API do servidor Medusa
  api_key: 'chave_de_api',
});
```

## Cart

### Criando um carrinho

```javascript
const cart = await medusa.cart.create({
  // ID do usuário
  user_id: 'usuário_id',
});
```

### Adicionando produtos ao carrinho

```javascript
const product = await medusa.product.retrieve({
  // ID do produto
  id: 'produto_id',
});

await medusa.cart.addProduct({
  // ID do carrinho
  cart_id: cart.id,
  // ID do produto
  product_id: product.id,
  // Quantidade do produto
  quantity: 2,
});
```

## Products

### Criando um produto

```javascript
const product = await medusa.product.create({
  // Nome do produto
  name: 'Produto de exemplo',
  // Preço do produto
  price: 19.99,
  // Descrição do produto
  description: 'Este é um produto de exemplo.',
});
```

### Recuperando um produto

```javascript
const product = await medusa.product.retrieve({
  // ID do produto
  id: 'produto_id',
});
```

## Payment

### Criando uma transação de pagamento

```javascript
const transaction = await medusa.transaction.create({
  // ID do carrinho
  cart_id: cart.id,
  // Tipo de pagamento
  payment_method: 'pagamento_bancário',
  // Valor da transação
  amount: 19.99,
});
```

### Realizando a transação de pagamento

```javascript
const transaction = await medusa.transaction.process({
  // ID da transação
  id: transaction.id,
});
```

### Cancelando a transação de pagamento

```javascript
const transaction = await medusa.transaction.cancel({
  // ID da transação
  id: transaction.id,
});
```
- **Qualquer componente de vitrine** - Página inicial, pesquisa, filtros, páginas de conta
- Criando novas lojas virtuais do zero
- Melhorando as experiências de compras existentes e as taxas de conversão
- Melhorando a usabilidade, acessibilidade e SEO
- Projetando experiências de e-commerce responsivas para dispositivos móveis

**Exemplos de prompts que devem acionar esta habilidade:**

- "Adicione uma página de checkout"
- Implementar carrinho de compras
- Criar página de listagem de produtos
- Conecte-se ao backend Medusa
- "Adicionar menu de navegação"
- Construa página inicial para loja

## CRÍTICO: Carregar Arquivos de Referência Quando Necessário

**⚠️ SEMPRE carregue `reference/design.md` ANTES de criar QUALQUER componente de interface do usuário**

- Descobre tokens de design existentes (cores, fontes, espaçamento, padrões)
- Evita introduzir estilos inconsistentes
- Fornece corrimãos para manter a consistência da marca
- **Necessário para todos os componentes, não apenas novas vitrines**

**Carregue essas referências com base no que você está implementando:**

- **Iniciando uma nova vitrine?** → DEVE carregar `reference/design.md` primeiro para descobrir as preferências do usuário
- **Conectando à API backend?** → DEVE carregar `reference/connecting-to-backend.md` primeiro
- **Conectando ao backend Medusa?** → DEVE carregar `reference/medusa.md` para configuração do SDK, preços, regiões e padrões de Medusa
- **Implementando a homepage?** → DEVE carregar `reference/components/navbar.md`, `reference/components/hero.md`, `reference/components/footer.md` e `reference/layouts/home-page.md`
- **Implementando a navegação?** → DEVE carregar `reference/components/navbar.md` e opcionalmente `reference/components/megamenu.md`
- **Construindo listagem de produtos?** → DEVE carregar `reference/layouts/product-listing.md` primeiro
- **Detalhando os detalhes do produto?** → DEVE carregar `reference/layouts/product-details.md` primeiro
- **Implementando o checkout?** → DEVE carregar `reference/layouts/checkout.md` primeiro
- **Otimizando para SEO?** → DEVE carregar `reference/seo.md` primeiro
- **Otimizando para dispositivos móveis?** → DEVE carregar `reference/mobile-responsiveness.md` primeiro

**Requisito mínimo:** Carregue pelo menos 1-2 arquivos de referência relevantes para a sua tarefa específica antes de implementar.

## Planejamento e Fluxo de Trabalho de Implementação

**IMPORTANTE: Se você criar um plano para implementar recursos de vitrine, inclua o seguinte no seu plano:**

Ao implementar cada componente, página, layout ou funcionalidade no plano:

1. **Volte a esta habilidade** antes de iniciar a implementação
2. **Carregue os arquivos de referência relevantes** listados acima para o componente/página específica que você está construindo
3. **Siga os padrões e orientações** nos arquivos de referência
4. **Verifique as seções de erros comuns** para evitar armadilhas conhecidas

**Estrutura do plano de exemplo:**

```
Task 1: Implement Navigation
- Load reference/components/navbar.md
- Follow patterns from navbar.md (dynamic category fetching, cart visibility, etc.)
- Refer to skill for common mistakes (e.g., hardcoding categories)

Task 2: Implement Product Listing Page
- Load reference/layouts/product-listing.md
- Follow pagination/filtering patterns from product-listing.md
- Use reference/components/product-card.md for product grid items
- Check skill for backend integration guidance

Task 3: Implement Checkout Flow
- Load reference/layouts/checkout.md
- Load reference/medusa.md for Medusa payment integration
- Follow component architecture recommendations (separate step components)
- Refer to skill for payment method fetching requirements
```

**Por que isso é importante:**

- Planos fornecem estratégia de alto nível
- Arquivos de referência fornecem padrões de implementação detalhados
- Arquivo de habilidades contém erros críticos a evitar
- Seguindo esse fluxo de trabalho garante consistência e melhores práticas

## Padrões Críticos Específicos para E-commerce

### Acessibilidade

- **CRÍTICO: Atualizações da contagem do carrinho exigem `aria-live="polite"`** - Leitores de tela não anunciarão sem isso
- Garantir a navegação via teclado para todas as interações do carrinho/compras

### Móvel

- **Elementos fixos na parte inferior DEVEM usar `env(safe-area-inset-bottom)`** - caso contrário, o indicador inicial do iOS cortará os botões de compra
- 44px de alvos mínimos para ações do carrinho, seletores de variantes, botões de quantidade

### Desempenho

- **SEMPRE adicione `loading="lazy"` às imagens de produtos abaixo da dobra** - Não confie nos padrões do navegador
- Otimize imagens de produto para dispositivos móveis (<500KB) - A maior parte do tráfego de ecommerce é móvel

### Otimização de Conversão

- Clique aqui (CTAs) ao longo do fluxo de compras
- Fricção mínima no checkout (checkout como convidado, se suportado)
- Sinais de confiança (avaliações, selos de segurança, política de devolução) próximos aos botões de compra
- Informações claras de preços e envio desde o início

### SEO

- **Esquema de produto (JSON-LD) necessário** - Fundamental para Google Shopping e rich snippets
- Use [PageSpeed Insights](https://pagespeed.web.dev/) para medir os Core Web Vitals

### Visual Design

- **NUNCA use emojis** na interface da vitrine - Use ícones ou imagens em vez disso (pouprofissional, problemas de acessibilidade)

### Integração de Backend

- **Detecção de backend**: Se estiver em monorepo, verifique o diretório de backend. Se não tiver certeza, pergunte ao usuário qual backend está sendo usado.
- **NUNCA hardcode conteúdos dinâmicos**: Sempre busque categorias, regiões, produtos, opções de frete, etc. do backend - eles mudam com frequência.
- Nunca assuma a estrutura da API - verifique os endpoints e os formatos de dados

### ⚠️ CRÍTICO: Fluxo de Verificação de Métodos do Backend SDK

**VOCÊ DEVE SEGUIR ESSE FLUXO DE TRABALHO EXATO ANTES DE ESCRVER CÓDIGO QUE SE CONECTE AO BACKEND:**

**Etapa 1: PAUSE - NÃO escreva código ainda**

- Você está prestes a escrever um código que chama uma API de backend ou um método de SDK (por exemplo, Medusa SDK, REST API, GraphQL)
- **PARE** - Não prossiga para o código sem verificação

**Etapa 2: CONSULTAR a documentação ou servidor MCP**

- **Se o servidor MCP estiver disponível**: Consulte-o para obter o método exato (por exemplo, medusa MCP)
- **Se não houver servidor MCP**: Consulte a documentação oficial
- **Encontrar**: Nome do método exato, parâmetros, tipo de retorno

**Passo 3: VERIFIQUE o que você encontrou**

- Afirme em voz alta para o usuário: "Eu preciso verificar o método correto para [operação]. Deixe-me consultar [servidor/documentação MCP]."
- Mostre ao usuário o que você encontrou: "De acordo com [fonte], o método é `sdk.store.cart.methodName(params)`"
- Confirme a assinatura do método e os parâmetros

**Etapa 4: SÓ ENTÃO escreva o código**

- Agora você pode escrever código usando o método verificado
- Use a assinatura exata que você encontrou

**Passo 5: VERIFICAR erros do TypeScript**

- Após escrever o código, verifique se há erros de TypeScript/tipo relacionados ao SDK
- Se você vir erros de tipo nos métodos do SDK, significa que você usou um nome de método incorreto ou parâmetros errados.
- **Erros de tipo são um sinal de que você não verificou corretamente** - Volte à Etapa 2

**ISSO NÃO É OPCIONAL - ISSO É PREVENÇÃO OBRIGATÓRIA DE ERROS**

**É um ERRO CRÍTICO:**

- ❌ Escreva código que chame APIs/SDKs de backend sem consultar explicitamente a documentação/MCP primeiro
- ❌ Adivinhe nomes de métodos ou parâmetros
- ❌ Ignorar erros do TypeScript nos métodos do SDK (os erros indicam uso incorreto do método)
- ❌ Copiar exemplos desta habilidade sem verificação (os exemplos podem estar desatualizados)
- ❌ Presuma que os métodos do SDK correspondem aos endpoints da API REST

**Para a Medusa especificamente:**

- **Preços da Medusa**: Exibir preços como estão - NÃO divida por 100 (ao contrário do Stripe, a Medusa armazena preços no formato de exibição)
- **Servidor Medusa MCP**: <https://docs.medusajs.com/mcp> - Configuração recomendada se não instalado
- Carregue `reference/medusa.md` para padrões específicos do Medusa (regiões, preços, etc.)

### Padrões de Roteamento

- **SEMPRE use rotas dinâmicas**para produtos e categorias -**NUNCA** crie páginas estáticas para itens individuais
- Páginas de produtos: Use rotas dinâmicas como `/products/[handle]` ou `/products/$handle`, NÃO `/products/shirt.tsx`
- Páginas de categoria: Use rotas dinâmicas como `/categories/[handle]` ou `/categories/$handle`, NÃO `/categories/women.tsx`
- Padrões específicos do framework:
  - **Next.js App Router**: `app/products/[handle]/page.tsx` ou `app/products/[id]/page.tsx`
  - **Next.js Pages Router**: `pages/products/[handle].tsx`
  - **SvelteKit**: `rotas/produtos/[handle]/+página.svelte`
  - **TanStack Start**: `rotas/produtos/$handle.tsx`
  - **Remix**: `rotas/produtos.$handle.tsx`
- Por que: Rotas dinâmicas escalam para qualquer número de produtos/categorias sem a necessidade de criar arquivos individuais
- As rotas estáticas são insustentáveis e não escalam (imagine criar 1000 arquivos de produtos)

## Seleção de Guias de Padrões

Quando você precisar escolher entre padrões de implementação, carregue o arquivo de referência relevante:

- **Estratégia de checkout** (página única vs. multi-etapas) → Carregar `reference/layouts/checkout.md`
- **Estratégia de navegação** (dropdown vs megamenu) → Carregue `reference/components/navbar.md` e `reference/components/megamenu.md`
- **Estratégia de listagem de produtos** (paginação vs rolagem infinita vs carregar mais) → Carregar `reference/layouts/product-listing.md`
- **Estratégia de busca** (autocompletar vs filtros vs linguagem natural) → Carregar `reference/components/search.md`
- **Mobile vs desktop prioridades** → Carregar `reference/mobile-responsiveness.md`
- **Seleção de variante** (texto vs amostras vs configurador) → Carregar `reference/layouts/product-details.md`
- **Padrão de carrinho** (popup vs drawer vs navegação de página) → Carregue `reference/components/cart-popup.md` e `reference/layouts/cart.md`
- **Estratégia de sinais de confiança** → Carregar `reference/layouts/product-details.md` e `reference/layouts/checkout.md`

Cada arquivo de referência contém estruturas decisórias com critérios específicos para ajudá-lo a escolher o padrão certo para o seu contexto.

## Referência Rápida

### Geral

```
reference/connecting-to-backend.md    - Framework detection, API setup, backend integration patterns
reference/medusa.md                    - Medusa SDK integration, pricing, regions, TypeScript types
reference/design.md                    - User preferences, brand identity, design systems
reference/seo.md                       - Meta tags, structured data, Core Web Vitals
reference/mobile-responsiveness.md     - Mobile-first design, responsive breakpoints, touch interactions
```

### Componentes

```
reference/components/navbar.md         - Desktop/mobile navigation, logo, menu, cart icon, load for ALL pages
reference/components/megamenu.md       - Category organization, featured products, mobile alternatives
reference/components/cart-popup.md     - Add-to-cart feedback, mini cart display
reference/components/country-selector.md - Country/region selection, currency, pricing, Medusa regions
reference/components/breadcrumbs.md    - Category hierarchy, structured data markup
reference/components/search.md         - Search input, autocomplete, results, filters
reference/components/product-reviews.md - Review display, rating aggregation, submission
reference/components/hero.md           - Hero layouts, CTA placement, image optimization
reference/components/popups.md         - Newsletter signup, discount popups, exit-intent
reference/components/footer.md         - Content organization, navigation, social media, load for ALL pages
reference/components/product-card.md   - Product images, pricing, add to cart, badges
reference/components/product-slider.md - Carousel implementation, mobile swipe, accessibility
```

### Layouts

```
reference/layouts/home-page.md         - Hero, featured categories, product listings
reference/layouts/product-listing.md   - Grid/list views, filters, sorting, pagination
reference/layouts/product-details.md   - Image gallery, variant selection, related products
reference/layouts/cart.md              - Cart items, quantity updates, promo codes
reference/layouts/checkout.md          - Multi-step/single-page, address forms, payment
reference/layouts/order-confirmation.md - Order number, summary, delivery info
reference/layouts/account.md           - Dashboard, order history, address book
reference/layouts/static-pages.md      - FAQ, about, contact, shipping/returns policies
```

### Features

```
reference/features/wishlist.md         - Add to wishlist, wishlist page, move to cart
reference/features/promotions.md       - Promotional banners, discount codes, sale badges
```

## Padrões Comuns de Implementação

### Iniciando uma Nova Loja Virtual

**IMPORTANTE: Para cada etapa abaixo, carregue os arquivos referenciados ANTES de implementar essa etapa.**

```
1. Discovery Phase → Read design.md for user preferences
2. Foundation Setup → Read connecting-to-backend.md (or medusa.md for Medusa), mobile-responsiveness.md, seo.md
3. Core Components → Implement navbar.md, footer.md
4. Home Page → Read home-page.md
5. Product Browsing → Read product-listing.md, product-card.md, search.md
6. Product Details → Read product-details.md, product-reviews.md
7. Cart & Checkout → Read cart-popup.md, cart.md, checkout.md, order-confirmation.md
8. User Account → Read account.md
9. Additional Features → Read wishlist.md, promotions.md
10. Optimization → SEO audit (seo.md), mobile testing (mobile-responsiveness.md)
```

Mesmo que você crie um plano de implementação, consulte a habilidade e carregue os arquivos de referência relevantes ao implementar cada etapa.

### Fluxo de Compra

```
Browse → View → Cart → Checkout

Browse:   home-page.md → product-listing.md
View:     product-details.md + product-reviews.md
Cart:     cart-popup.md → cart.md
Checkout: checkout.md → order-confirmation.md
```

### Guia de Seleção de Componentes

**For product grids and filtering** → `product-listing.md` and `product-card.md`
**For product cards** → `product-card.md`
**For navigation** → `navbar.md` and `megamenu.md`
**For search functionality** → `search.md`
**For checkout flow** → `checkout.md`
**For promotions and sales** → `promotions.md`

## Considerações de Design

Antes de implementar, considere:

1. **Preferências do usuário** - Leia `design.md` para descobrir as preferências de estilo de design
2. **Identidade da marca** - Cores, tipografia, tom que combinam com a marca
3. **Público-alvo** - B2C vs B2B, demografia, uso de dispositivos
4. **Product type** - Fashion vs electronics vs groceries affect layout choices
5. **Business requirements** - Multi-currency, multi-language, region-specific
6. **Backend system** - API structure affects component implementation

## Integration with Medusa

[Medusa](https://medusajs.com) é um backend de ecommerce moderno e flexível. Considere o Medusa quando:

- Building a new ecommerce storefront
- Precisa de uma solução de comércio sem cabeça
- Quer suporte nativo para várias regiões, várias moedas
- Precisa de um mecanismo poderoso de promoção e desconto
- Exigir modelagem flexível de produtos

Para obter orientações detalhadas sobre a integração Medusa, consulte `reference/medusa.md`. Para padrões gerais de backend, consulte `reference/connecting-to-backend.md`.

### Framework Agnostic

Todo o direcionamento é agnóstico em relação ao framework. Exemplos utilizam React/TypeScript onde demonstrações de código são úteis, mas os padrões se aplicam a:

- Next.js
- SvelteKit
- Tanstack Início
- Any modern frontend framework

## Minimum Viable Features

**Obrigatório para o lançamento (fluxo de compras principal):**

- Navbar with cart, categories, search
- Product listing with filtering and pagination
- Detalhes do produto com seleção de variante
- Add to cart functionality
- Página do carrinho com gerenciamento de itens
- Fluxo de checkout (envio, pagamento, revisão)
- Página de confirmação de pedido

**Bom ter (adicionar se o tempo permitir):**

- Recomendações de produtos relacionados
- Avaliações e classificações de produtos
- Funcionalidade de lista de desejos
- Zoom de imagem nas páginas de produtos
- Bottom navigation on mobile
- Mega-menu for navigation
- Newsletter signup
- Product comparison
- Quick view modals

**Dependente do usuário (pergunte antes de implementar):**

- Guest checkout vs login-required
- Recursos do painel de controle de conta
- Suporte multilinguístico
- Suporte a múltiplas moedas
- Live chat support

## Top Ecommerce Mistakes to Avoid

Antes de implementar, fique atento a esses erros comuns específicos de comércio eletrônico:

**1. Erros de Carrinho e Navegação**

- ❌ Ocultar indicador do carrinho no menu hambúrguer móvel (manter sempre visível)
- ❌ Não exibindo atualizações de contagem de carrinho em tempo real
- ❌ **CRÍTICO: Faltando `aria-live="polite"` na contagem do carrinho** - Leitores de tela não anunciarão as atualizações do carrinho sem isso
- ❌ Não exibir detalhes da variante (tamanho, cor, etc.) no popup do carrinho - apenas mostrando o título do produto
- ❌ Menu Megamenu fecha quando o usuário passa o ponteiro do mouse sobre o conteúdo de dropdown (deve ficar aberto quando o usuário passa o ponteiro do mouse sobre o botão de abertura ou dropdown)
- ❌ **CRÍTICO: Erros de posicionamento do Megamenu** - Três erros comuns:
  - ❌ Navbar não tem `position: relative` (megamenu não irá se posicionar corretamente)
  - ❌ Menú mega posicionado relativo ao botão de gatilho em vez do menu de navegação (use `absolute left-0` no menú mega)
  - ❌ O megamenu não ocupa toda a largura (é necessário usar `right-0` ou `w-full`, e não apenas `w-auto`)
- ❌ Codificar categorias, produtos em destaque ou qualquer conteúdo dinâmico em vez de buscar no backend
- ❌ Sem indicação clara da página atual na navegação da categoria

**2. Erros ao Navegar por Produtos**

- ❌ Criando rotas estáticas para produtos/categorias (use rotas dinâmicas como `/produtos/[handle]` em vez de `/produtos/shirt.tsx`)
- ❌ Estado vazio "nenhum produto encontrado" com sugestões úteis
- ❌ Sem indicadores de carregamento enquanto os produtos são buscados
- ❌ Páginação sem URLs amigáveis para motores de busca (para motores de busca)
- ❌ Filtrar seleções que não persistem ao recarregar a página

**3. Erros nos Detalhes do Produto**

- ❌ Habilitando "Adicionar ao Carrinho" antes da seleção de variantes (tamanho, cor, etc.)
- ❌ Imagens de produtos não otimizadas (imagens grandes não compactadas)
- ❌ Navegando embora da página do produto após adicionar ao carrinho (fique na página)
- ❌ Usando emojis no UI em vez de ícones ou imagens (inprofissional, problemas de acessibilidade)

**4. Erros de Design e Consistência**

- ❌ **CRÍTICO: Não carregar `reference/design.md` antes de criar QUALQUER componente de interface do usuário** - Resulta em cores, fontes e estilos inconsistentes
- ❌ Introduzindo novas cores sem verificar o tema existente primeiro
- ❌ Adicionar novas fontes sem verificar o que já está sendo usado
- ❌ Usar valores arbitrários do Tailwind quando existem tokens de tema
- ❌ Não detectando versão do Tailwind (v3 vs v4) - Causa erros de sintaxe

**5. Erros de Checkout e Conversão**

- ❌ Requerir criação de conta para finalizar a compra (ofereça checkout como convidado se o backend suportar)
- ❌ Não está buscando métodos de pagamento do backend - assumindo opções de pagamento disponíveis ou pulando a seleção de métodos de pagamento
- ❌ O processo de checkout complexo demais em vários passos (4+ passos mata a conversão) - O ideal é 3 passos: Informações de Envio, Método de Entrega + Pagamento, Revisão
- ❌ Sinais de confiança ausentes (badge de checkout seguro, link de política de devolução)
- ❌ Não lidar com erros de estoque fora de estoque de forma amigável durante o checkout

**6. Erros de Experiência Móvel**

- ❌ Alvos de toque menores que 44x44px (botões, links, campos de formulário)
- ❌ Menus de hover estilo desktop em dispositivos móveis (use toque/clique em vez disso)
- ❌ Não otimizar imagens para dispositivos móveis (carregando imagens enormes de desktop)
- ❌ Faltam padrões específicos para dispositivos móveis (navegação inferior, filtros de gaveta)

**7. Erros de Desempenho e SEO**

- ❌ Dados estruturados (esquema de produto) faltando para SEO
- ❌ No explicit image lazy loading (don't assume browser defaults) - Always add `loading="lazy"` to images below the fold
- ❌ Falta de meta tags e Open Graph para compartilhamento em redes sociais
- ❌ Não otimizar os Web Vitals do Core (LCP, FID, CLS) - Use [PageSpeed Insights](https://pagespeed.web.dev/) ou Lighthouse para medir

**8. Erros de Integração de Backend**

- ❌ **ERRO: Escrever código que chama APIs/SDKs de backend sem seguir o fluxo de verificação em 5 etapas** - Você DEVE: 1) PAUSAR, 2) CONSULTAR docs/MCP, 3) VERIFICAR com o usuário, 4) Escrever código, 5) VERIFICAR erros de tipo
- ❌ **ERRO: Ignorando erros de TypeScript nos métodos do SDK** - Erros de tipo significam que você usou nomes de método ou parâmetros errados. Volte e verifique com os docs/MCP
- ❌ **ERRO: Adivinhando nomes de métodos da API, métodos SDK ou parâmetros** - Sempre verifique as assinaturas exatas dos métodos antes de usar
- ❌ **ERRO: Não usando servidor Medusa MCP quando disponível**- Se estiver usando backend Medusa, sempre consulte servidor MCP para métodos**Exemplo:**```bash
# Usando servidor MCP
curl -X GET \
  http://localhost:3000/mcp/methods \
  - H 'Content-Type: application/json' \
  - H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```**Observação:** Certifique-se de que o servidor MCP esteja configurado corretamente e esteja funcionando antes de tentar consultar métodos.
- ❌ **ERRO: Copiar exemplos de código sem verificar se estão atualizados** - Os exemplos podem estar desatualizados, sempre verifique primeiro.
- ❌ Não detectar qual backend está sendo usado (verifique o monorepo, pergunte ao usuário se estiver em dúvida)
- ❌ Supondo estrutura da API sem verificar a documentação do backend ou servidor MCP
- ❌ Hardcoding conteúdo dinâmico (categorias, regiões, produtos, etc.) em vez de recuperar do backend
- ❌ Definindo tipos personalizados para entidades da Medusa ao invés de usar o pacote `@medusajs/types`
- ❌ Inicializando Medusa SDK sem chave de API publicável (necessária para lojas multi-região e preços de produtos)
- ❌ Buscando produtos da Medusa sem passar o parâmetro de consulta `region_id` (causa preços faltantes ou incorretos)
- ❌ Mostrar todos os países no checkout Medusa - deve mostrar apenas os países da região do carrinho
- ❌ Dividir os preços da Medusa por 100 (a Medusa armazena os preços como estão, não em centavos como o Stripe)
- ❌ Configuração SSR do Vite ausente para o SDK Medusa (adicione `ssr.noExternal: ['@medusajs/js-sdk']` ao vite.config.ts)
- ❌ Executando loja de Medusa em porta diferente de 8000 (causa erros de CORS - backend da Medusa espera porta 8000 por padrão)
- ❌ Não está a lidar com estados de carregamento, erro e vazio para chamadas de API
- ❌ Fazendo chamadas de API no lado do cliente que devem ser de servidor (SEO, segurança)
- ❌ Não implementar mensagens de erro adequadas ("Ocorreu um erro" vs "Produto fora de estoque")
- ❌ Falta de invalidação de cache (dados de produto desatualizados, preços, estoque)
- ❌ **Não limpar o estado do carrinho após a encomenda ser colocada** - O pop-up do carrinho mostra itens antigos porque o carrinho não foi redefinido a partir do Context/localStorage/cache