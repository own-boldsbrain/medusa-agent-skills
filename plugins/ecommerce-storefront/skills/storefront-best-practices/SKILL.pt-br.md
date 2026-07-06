---
nome: storefront-best-practices
descrição: SEMPRE utilize esta habilidade ao trabalhar com vitrines de comércio eletrônico, lojas online e sites de compras. Utilize-a para QUALQUER componente de vitrine, incluindo páginas de finalização de compra, carrinho, fluxos de pagamento, páginas de produtos, listagens de produtos, navegação, página inicial ou QUALQUER página/componente em uma vitrine. ESSENCIAL para adicionar o checkout, implementar o carrinho, integrar o backend do Medusa ou desenvolver qualquer funcionalidade de comércio eletrônico. Independente de framework (Next.js, SvelteKit, TanStack Start, React, Vue). Oferece padrões, estruturas de decisão e orientações para integração com o backend.
---

# Melhores práticas para lojas virtuais

Orientação abrangente para a criação de lojas virtuais modernas e com alta taxa de conversão, abrangendo padrões de UI/UX, design de componentes, estruturas de layout, otimização de SEO e responsividade para dispositivos móveis.

## Quando aplicar

**SEMPRE utilize esta competência ao trabalhar em QUALQUER tarefa relacionada a lojas virtuais:**

- **Adicionar página/fluxo de finalização de compra** – Pagamento, frete, realização do pedido
- **Implementar carrinho** – Página do carrinho, janela pop-up do carrinho, funcionalidade “adicionar ao carrinho”
- **Criação de páginas de produtos** – Detalhes do produto, listagens de produtos, grades de produtos
- **Criação de navegação**

- Barra de navegação, megamenu, rodapé, menu para dispositivos móveis
- **Integração com o backend do Medusa**

- Configuração do SDK, carrinho, produtos, pagamento
- **Qualquer componente da vitrine**

- Página inicial, pesquisa, filtros, páginas de conta
- Criação de novas vitrines de comércio eletrônico do zero
- Aprimoramento de experiências de compra e taxas de conversão existentes
- Otimização de usabilidade, acessibilidade e SEO
- Criação de experiências de comércio eletrônico responsivas para dispositivos móveis

**Exemplos de comandos que devem acionar esta habilidade:**

- “Adicionar uma página de finalização de compra”
- “Implementar carrinho de compras”
- “Criar página de listagem de produtos”
- “Conectar ao backend do Medusa”
- “Adicionar menu de navegação”
- “Criar página inicial da loja”

## IMPORTANTE: Carregue os arquivos de referência quando necessário

**⚠️ SEMPRE carregue `reference/design.md` ANTES de criar QUALQUER componente da interface do usuário**

- Identifica tokens de design existentes (cores, fontes, espaçamento, padrões)
- Evita a introdução de estilos inconsistentes
- Fornece diretrizes para manter a consistência da marca
- **Obrigatório para todos os componentes, não apenas para novas lojas**

**Carregue essas referências de acordo com o que você estiver implementando:**

- **Está criando uma nova loja virtual?** → É OBRIGATÓRIO carregar primeiro o arquivo `reference/design.md` para identificar as preferências do usuário
- **Está se conectando à API de back-end?** → É OBRIGATÓRIO carregar primeiro o arquivo `reference/connecting-to-backend.md`
- **Está se conectando ao back-end do Medusa?** → É OBRIGATÓRIO carregar o arquivo `reference/medusa.md` para configuração do SDK, preços, regiões e padrões do Medusa
- **Implementando a página inicial?** → É OBRIGATÓRIO carregar `reference/components/navbar.md`, `reference/components/hero.md`, `reference/components/footer.md` e `reference/layouts/home-page.md`
- **Implementando a navegação?** → É OBRIGATÓRIO carregar `reference/components/navbar.md` e, opcionalmente, `reference/components/megamenu.md`
- **Criando uma lista de produtos?** → É OBRIGATÓRIO carregar `reference/layouts/product-listing.md` primeiro
- **Criando detalhes do produto?** → É OBRIGATÓRIO carregar `reference/layouts/product-details.md` primeiro
- **Implementando o checkout?** → É OBRIGATÓRIO carregar `reference/layouts/checkout.md` primeiro
- **Otimizando para SEO?** → É OBRIGATÓRIO carregar `reference/seo.md` primeiro
- **Otimizando para dispositivos móveis?** → É OBRIGATÓRIO carregar primeiro o arquivo `reference/mobile-responsiveness.md`

**Requisito mínimo:** Carregue pelo menos 1 ou 2 arquivos de referência relevantes para sua tarefa específica antes de implementar.

## Fluxo de trabalho de planejamento e implementação

**IMPORTANTE: Se você criar um plano para implementar recursos da loja virtual, inclua o seguinte no seu plano:**

Ao implementar cada componente, página, layout ou recurso do plano:

1. **Consulte este guia** antes de iniciar a implementação
2. **Carregue os arquivos de referência relevantes** listados acima para o componente/página específico que você está criando
3. **Siga os padrões e orientações** contidos nos arquivos de referência
4. **Verifique as seções sobre erros comuns** para evitar armadilhas conhecidas

**Exemplo de estrutura do plano:**

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

- Os planos fornecem uma estratégia de alto nível
- Os arquivos de referência fornecem padrões detalhados de implementação
- O arquivo de habilidades contém erros críticos a serem evitados
- Seguir esse fluxo de trabalho garante consistência e melhores práticas

## Padrões críticos específicos do comércio eletrônico

### Acessibilidade

- **CRÍTICO: As atualizações da contagem do carrinho exigem `aria-live="polite"`**

- Os leitores de tela não farão a leitura sem isso
- Garanta a navegação por teclado para todas as interações com o carrinho e o checkout

### Dispositivos móveis

- **Elementos fixos na parte inferior DEVEM usar `env(safe-area-inset-bottom)`**

- Caso contrário, o indicador de tela inicial do iOS cortará os botões de compra
- Áreas de toque com tamanho mínimo de 44px para ações no carrinho, seletores de variantes e botões de quantidade

### Desempenho

- **SEMPRE adicione `loading="lazy"` às imagens de produtos abaixo da dobra**

- Não confie nas configurações padrão do navegador
- Otimize as imagens de produtos para dispositivos móveis (<500 KB) - A maior parte do tráfego de comércio eletrônico vem de dispositivos móveis

### Otimização de conversão

- CTAs claras ao longo de todo o fluxo de compra
- Atrito mínimo no checkout (checkout como convidado, se disponível)
- Sinais de confiança (avaliações, selos de segurança, política de devolução) próximos aos botões de compra
- Informações claras sobre preços e frete apresentadas logo no início

### SEO

- **Esquema de produto (JSON-LD) obrigatório**

- Essencial para o Google Shopping e rich snippets
- Use o [PageSpeed Insights](https://pagespeed.web.dev/) para medir os Core Web Vitals

### Design visual

- **NUNCA use emojis** na interface do usuário da loja - Use ícones ou imagens em vez disso (falta de profissionalismo, problemas de acessibilidade)

### Integração com o backend

- **Detecção do backend**: Se estiver em um monorepo, verifique o diretório do backend. Em caso de dúvida, pergunte ao usuário qual backend é utilizado.
- **NUNCA codifique conteúdo dinâmico de forma rígida**: Sempre busque categorias, regiões, produtos, opções de entrega etc. no backend — eles mudam com frequência
- Nunca presuma a estrutura da API — verifique os endpoints e os formatos de dados

### ⚠️ CRÍTICO: Fluxo de trabalho para verificação de métodos do SDK de backend

**VOCÊ DEVE SEGUIR EXATAMENTE ESTE FLUXO DE TRABALHO ANTES DE ESCREVER CÓDIGO QUE SE CONECTE AO BACKEND:**

**Passo 1: PAUSA — NÃO escreva código ainda**

- Você está prestes a escrever código que chama uma API de backend ou um método do SDK (por exemplo, SDK Medusa, API REST, GraphQL)
- **PARE** — Não prossiga com a codificação sem antes verificar

**Etapa 2: CONSULTE a documentação ou o servidor MCP**

- **Se o servidor MCP estiver disponível**: consulte-o para obter o método exato (por exemplo, MCP Medusa)
- **Se não houver servidor MCP**: Pesquise na documentação oficial
- **Encontre**: Nome exato do método, parâmetros, tipo de retorno

**Passo 3: VERIFIQUE o que você encontrou**

- Diga em voz alta ao usuário: “Preciso verificar o método correto para [operação]. Deixe-me conferir no [servidor MCP/documentação].”
- Mostre ao usuário o que você encontrou: “De acordo com [fonte], o método é `sdk.store.cart.methodName(params)`”
- Confirme a assinatura do método e os parâmetros

**Passo 4: SÓ ENTÃO escreva o código**

- Agora você pode escrever o código usando o método verificado
- Use exatamente a assinatura que você encontrou

**Passo 5: VERIFIQUE se há erros de TypeScript**

- Após escrever o código, verifique se há erros de TypeScript ou de tipo relacionados ao SDK
- Se você encontrar erros de tipo nos métodos do SDK, isso significa que você usou um nome de método incorreto ou parâmetros errados
- **Erros de tipo são um sinal de que você não verificou corretamente**

- Volte para a Etapa 2

**ISSO NÃO É OPCIONAL — É UMA MEDIDA OBRIGATÓRIA DE PREVENÇÃO DE ERROS**

**É um ERRO CRÍTICO:**

- ❌ Escrever código que chame APIs/SDKs de back-end sem consultar explicitamente a documentação/MCP primeiro
- ❌ Adivinhar nomes de métodos ou parâmetros
- ❌ Ignorar erros do TypeScript nos métodos do SDK (os erros indicam uso incorreto do método)
- ❌ Copiar exemplos desta skill sem verificação (os exemplos podem estar desatualizados)
- ❌ Presumir que os métodos do SDK correspondem aos endpoints da API REST

**Especificamente para o Medusa:**

- **Preços do Medusa**: Exiba os preços como estão — NÃO divida por 100 (ao contrário do Stripe, a Medusa armazena os preços no formato de exibição)
- **Servidor MCP da Medusa**: <https://docs.medusajs.com/mcp> — Recomenda-se a configuração caso ainda não esteja instalado
- Carregue `reference/medusa.md` para padrões específicos da Medusa (regiões, preços etc.)

### Padrões de roteamento

- **SEMPRE use rotas dinâmicas** para produtos e categorias - NUNCA crie páginas estáticas para itens individuais
- Páginas de produtos: use rotas dinâmicas como `/products/[handle]` ou `/products/$handle`, NÃO `/products/shirt.tsx`
- Páginas de categorias: use rotas dinâmicas como `/categories/[handle]` ou `/categories/$handle`, NÃO `/categories/women.tsx`
- Padrões específicos da estrutura:
  - **Next.js App Router**: `app/products/[handle]/page.tsx` ou `app/products/[id]/page.tsx`
  - **Next.js Pages Router**: `pages/products/[handle].tsx`
  - **SvelteKit**: `routes/products/[handle]/+page.svelte`
  - **TanStack Start**: `routes/products/$handle.tsx`
  - **Remix**: `routes/products.$handle.tsx`
- Por quê: as rotas dinâmicas se adaptam a qualquer número de produtos/categorias sem a necessidade de criar arquivos individuais
- Rotas estáticas são difíceis de manter e não se adaptam (imagine criar 1.000 arquivos de produtos)

## Guias de seleção de padrões

Quando precisar escolher entre padrões de implementação, carregue o arquivo de referência relevante:

- **Estratégia de checkout** (página única vs. várias etapas) → Carregue `reference/layouts/checkout.md`
- **Estratégia de navegação** (menu suspenso x megamenu) → Carregar `reference/components/navbar.md` e `reference/components/megamenu.md`
- **Estratégia de listagem de produtos** (paginação x rolagem infinita x carregar mais) → Carregar `reference/layouts/product-listing.md`
- **Estratégia de pesquisa** (autocompletar x filtros x linguagem natural) → Carregue `reference/components/search.md`
- **Prioridades para dispositivos móveis x desktop** → Carregue `reference/mobile-responsiveness.md`
- **Seleção de variantes** (texto x amostras x configurador) → Carregue `reference/layouts/product-details.md`
- **Padrão do carrinho** (pop-up x gaveta x navegação por página) → Carregue `reference/components/cart-popup.md` e `reference/layouts/cart.md`
- **Estratégia de sinais de confiança** → Carregue `reference/layouts/product-details.md` e `reference/layouts/checkout.md`

Cada arquivo de referência contém estruturas de decisão com critérios específicos para ajudá-lo a escolher o padrão certo para o seu contexto.

## Referência rápida

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

### Recursos

```
reference/features/wishlist.md         - Add to wishlist, wishlist page, move to cart
reference/features/promotions.md       - Promotional banners, discount codes, sale badges
```

## Padrões comuns de implementação

### Iniciando uma nova loja virtual

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

Mesmo que você crie um plano de implementação, consulte a seção de habilidades e carregue os arquivos de referência relevantes ao implementar cada etapa.

### Padrão de fluxo de compras

```
Browse → View → Cart → Checkout

Browse:   home-page.md → product-listing.md
View:     product-details.md + product-reviews.md
Cart:     cart-popup.md → cart.md
Checkout: checkout.md → order-confirmation.md
```

### Guia de seleção de componentes

**Para grades de produtos e filtragem** → `product-listing.md` e `product-card.md`
**Para cartões de produtos** → `product-card.md`
**Para navegação** → `navbar.md` e `megamenu.md`
**Para a funcionalidade de busca** → `search.md`
**Para o fluxo de finalização de compra** → `checkout.md`
**Para promoções e liquidações** → `promotions.md`

## Considerações de design

Antes de implementar, considere:

1. **Preferências do usuário** — Leia `design.md` para conhecer as preferências de estilo de design
2. **Identidade da marca** — Cores, tipografia e tom de voz que combinem com a marca
3. **Público-alvo** — B2C x B2B, dados demográficos, uso de dispositivos
4. **Tipo de produto** — Moda x eletrônicos x mantimentos influenciam as escolhas de layout
5. **Requisitos de negócios**

- Multimoeda, multilíngue, específico para cada região
6. **Sistema de back-end**

- A estrutura da API afeta a implementação dos componentes

## Integração com o Medusa

O [Medusa](https://medusajs.com) é um back-end de comércio eletrônico moderno e flexível. Considere o Medusa quando:

- Estiver criando uma nova loja virtual
- Precisar de uma solução de comércio headless
- Desejar suporte integrado para várias regiões e moedas
- Precisar de um mecanismo robusto de promoções e descontos
- Exigir modelagem flexível de produtos

Para orientações detalhadas sobre a integração com o Medusa, consulte `reference/medusa.md`. Para padrões gerais de backend, consulte `reference/connecting-to-backend.md`.

### Independente de framework

Todas as orientações são independentes de framework. Os exemplos utilizam React/TypeScript quando as demonstrações de código são úteis, mas os padrões se aplicam a:

- Next.js
- SvelteKit
- Tanstack Start
- Qualquer framework front-end moderno

## Recursos mínimos viáveis

**Obrigatórios para o lançamento (fluxo básico de compras):**

- Barra de navegação com carrinho, categorias e pesquisa
- Lista de produtos com filtragem e paginação
- Detalhes do produto com seleção de variantes
- Funcionalidade “Adicionar ao carrinho”
- Página do carrinho com gerenciamento de itens
- Fluxo de finalização da compra (frete, pagamento, revisão)
- Página de confirmação do pedido

**Recursos opcionais (adicionar se o tempo permitir):**

- Recomendações de produtos relacionados
- Avaliações e classificações de produtos
- Funcionalidade de lista de desejos
- Zoom nas imagens nas páginas de produtos
- Navegação na parte inferior da tela em dispositivos móveis
- Megamenu para navegação
- Inscrição na newsletter
- Comparação de produtos
- Janelas modais de visualização rápida

**Dependente do usuário (pergunte antes de implementar):**

- Finalização de compra como convidado vs. login obrigatório
- Recursos do painel de controle da conta
- Suporte a vários idiomas
- Suporte a várias moedas
- Suporte por chat ao vivo

## Principais erros de comércio eletrônico a evitar

Antes de implementar, fique atento a essas armadilhas comuns específicas do comércio eletrônico:

**1. Erros no carrinho e na navegação**

- ❌ Ocultar o indicador do carrinho no menu “hambúrguer” da versão móvel (mantenha-o sempre visível)
- ❌ Não exibir atualizações em tempo real da contagem do carrinho
- ❌ **CRÍTICO: Falta o atributo `aria-live="polite"` na contagem do carrinho** — os leitores de tela não anunciarão as atualizações do carrinho sem ele
- ❌ Não exibir detalhes das variantes (tamanho, cor etc.) no pop-up do carrinho — mostrar apenas o título do produto
- ❌ O megamenu fecha ao passar o mouse sobre o conteúdo do menu suspenso (deve permanecer aberto ao passar o mouse sobre o gatilho OU sobre o menu suspenso)
- ❌ **CRÍTICO: Erros de posicionamento do megamenu**

- Três erros comuns:
  - ❌ A barra de navegação não tem `position: relative` (o megamenu não se posiciona corretamente)
  - ❌ O megamenu está posicionado em relação ao botão de acionamento, em vez de em relação à barra de navegação (use `absolute left-0` no megamenu)
  - ❌ O megamenu não ocupa toda a largura (é preciso usar `right-0` ou `w-full`, não apenas `w-auto`)
- ❌ Codificação estática de categorias, produtos em destaque ou qualquer conteúdo dinâmico, em vez de buscá-los do backend
- ❌ Ausência de indicação clara da página atual na navegação por categorias

**2. Erros na navegação por produtos**

- ❌ Criação de rotas estáticas para produtos/categorias (use rotas dinâmicas como `/products/[handle]` em vez de `/products/shirt.tsx`)
- ❌ Falta de um estado vazio do tipo “nenhum produto encontrado” com sugestões úteis
- ❌ Ausência de indicadores de carregamento durante a busca por produtos
- ❌ Paginação sem URLs otimizadas para SEO (para mecanismos de busca)
- ❌ Seleções de filtro que não são mantidas ao recarregar a página

**3. Erros nos detalhes do produto**

- ❌ Habilitar o botão “Adicionar ao carrinho” antes da seleção de variantes (tamanho, cor etc.)
- ❌ Falta de otimização das imagens dos produtos (imagens grandes e não compactadas)
- ❌ Saída da página do produto após adicioná-lo ao carrinho (deve permanecer na página)
- ❌ Uso de emojis na interface do usuário em vez de ícones ou imagens (falta de profissionalismo, problemas de acessibilidade)

**4. Erros de design e consistência**

- ❌ **CRÍTICO: Não carregar o arquivo `reference/design.md` antes de criar QUALQUER componente da interface do usuário** — leva a inconsistências nas cores, fontes e estilos
- ❌ Introduzir novas cores sem verificar primeiro o tema existente
- ❌ Adicionar novas fontes sem verificar quais já estão em uso
- ❌ Usar valores arbitrários do Tailwind quando existem tokens do tema
- ❌ Não detectar a versão do Tailwind (v3 vs v4) — causa erros de sintaxe

**5. Erros no checkout e na conversão**

- ❌ Exigir a criação de uma conta para finalizar a compra (ofereça a opção de checkout como convidado, se o backend permitir)
- ❌ Não buscar as formas de pagamento do backend — presumir que as opções de pagamento estão disponíveis ou pular a seleção da forma de pagamento
- ❌ Processo de checkout excessivamente complexo com várias etapas (mais de 4 etapas prejudicam a conversão) — o ideal são 3 etapas: Informações de envio, Forma de entrega + Pagamento, Revisão
- ❌ Falta de sinais de confiança (selo de checkout seguro, link para a política de devolução)
- ❌ Não lida adequadamente com erros de falta de estoque durante o checkout

**6. Erros na experiência móvel**

- ❌ Áreas de toque menores que 44x44px (botões, links, campos de formulário)
- ❌ Menus de hover no estilo desktop em dispositivos móveis (use toque/clique em vez disso)
- ❌ Imagens não otimizadas para dispositivos móveis (carregamento de imagens enormes do desktop)
- ❌ Ausência de padrões específicos para dispositivos móveis (navegação inferior, filtros em gaveta)

**7. Erros de desempenho e SEO**

- ❌ Ausência de dados estruturados (esquema de produto) para SEO
- ❌ Ausência de carregamento diferido explícito de imagens (não presuma que o navegador use as configurações padrão) — Sempre adicione `loading="lazy"` às imagens abaixo da dobra
- ❌ Falta de metatags e Open Graph para compartilhamento nas redes sociais
- ❌ Não otimizar os Core Web Vitals (LCP, FID, CLS) — use o [PageSpeed Insights](https://pagespeed.web.dev/) ou o Lighthouse para medir

**8. Erros de integração com o backend**

- ❌ **ERRO: Escrever código que chama APIs/SDKs de backend sem seguir o fluxo de trabalho de verificação em 5 etapas**

- Você DEVE: 1) PARAR, 2) CONSULTAR a documentação/MCP, 3) VERIFICAR com o usuário, 4) Escrever o código, 5) VERIFICAR se há erros de tipo
- ❌ **ERRO: Ignorando erros do TypeScript nos métodos do SDK**

- Erros de tipo indicam que você usou nomes de métodos ou parâmetros incorretos. Volte e verifique na documentação do MCP
- ❌ **ERRO: Adivinhando nomes de métodos da API, métodos do SDK ou parâmetros**

- Sempre verifique as assinaturas exatas dos métodos antes de usá-los
- ❌ **ERRO: Não está usando o servidor MCP do Medusa quando disponível**

- Se estiver usando o backend do Medusa, sempre consulte o servidor MCP para obter os métodos
- ❌ **ERRO: Copiando exemplos de código sem verificar se estão atualizados**

- Os exemplos podem estar desatualizados; sempre verifique primeiro
- ❌ Não detectar qual backend está sendo usado (verificar o monorepo, perguntar ao usuário em caso de dúvida)
- ❌ Presumir a estrutura da API sem verificar a documentação do backend ou o servidor MCP
- ❌ Codificar conteúdo dinâmico (categorias, regiões, produtos etc.) em vez de buscá-lo no backend
- ❌ Definir tipos personalizados para entidades do Medusa em vez de usar o pacote `@medusajs/types`
- ❌ Inicializar o SDK do Medusa sem uma chave de API publicável (necessária para lojas multirregionais e preços de produtos)
- ❌ Obter produtos do Medusa sem passar o parâmetro de consulta `region_id` (causa preços ausentes ou incorretos)
- ❌ Exibição de todos os países no checkout do Medusa — deveria exibir apenas os países da região do carrinho
- ❌ Divisão dos preços do Medusa por 100 (o Medusa armazena os preços como estão, não em centavos como o Stripe)
- ❌ Falta a configuração SSR do Vite para o SDK do Medusa (adicione `ssr.noExternal: ['@medusajs/js-sdk']` ao arquivo vite.config.ts)
- ❌ Execução da loja virtual do Medusa em uma porta diferente da 8000 (causa erros de CORS — o backend do Medusa espera a porta 8000 por padrão)
- ❌ Não há tratamento para os estados de carregamento, erro e página vazia nas chamadas de API
- ❌ Realização de chamadas de API no lado do cliente que deveriam ser feitas no lado do servidor (SEO, segurança)
- ❌ Não há implementação de mensagens de erro adequadas (“Ocorreu um erro” em vez de “Produto fora de estoque”)
- ❌ Falta a invalidação do cache (dados desatualizados de produtos, preços e estoque)
- ❌ **Não há limpeza do estado do carrinho após a realização do pedido** — A janela pop-up do carrinho exibe itens antigos porque o carrinho não foi reinicializado a partir do Context/localStorage/cache
