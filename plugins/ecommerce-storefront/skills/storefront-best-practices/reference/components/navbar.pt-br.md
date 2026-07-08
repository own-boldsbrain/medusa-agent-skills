# Componente Navbar

## Conteúdo

- [Visão Geral](#visao-geral)
- [Decisão: Simple Dropdown vs Megamenu](#decisao-simple-dropdown-vs-megamenu)
- [Principais Padrões de E-commerce](#principais-padroes-de-e-commerce)
- [Estrutura de Layout](#estrutura-de-layout)
- [Essenciais de Acessibilidade](#essenciais-de-acessibilidade)
- [Erros Comuns em E-commerce](#erros-comuns-em-e-commerce)
- [Integração com o Backend](#integracao-com-o-backend)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

Navegação primária para lojas de e-commerce. Desktop: menu horizontal com links de categoria. Mobile: menu hambúrguer com subcategorias em formato de sanfona (accordion).

### ⚠️ CRÍTICO: NUNCA Chumbre (Hardcode) as Categorias

**SEMPRE busque as categorias dinamicamente do backend. NUNCA faça hardcode de arrays estáticos de categorias.**

❌ **ERRADO - NÃO FAÇA ISSO:**

```typescript
// WRONG - Static hardcoded categories
const categories = [
  { name: "Women", href: "/categories/women" },
  { name: "Men", href: "/categories/men" },
  { name: "Accessories", href: "/categories/accessories" }
]
```

✅ **CORRETO - Buscar do backend:**

```typescript
// CORRECT - Fetch categories dynamically
const [categories, setCategories] = useState([])

useEffect(() => {
  fetch(`${apiUrl}/store/product-categories`)
    .then(res => res.json())
    .then(data => setCategories(data.product_categories))
}, [])
```

**Por que isso importa:**

- As categorias mudam frequentemente (novas categorias, renomeadas, reordenadas)
- Categorias hardcoded ficam desatualizadas imediatamente
- Exige alterações no código toda vez que as categorias mudam
- Não escala para lojas com catálogos dinâmicos
- Derrota o propósito do commerce headless

### Principais Requisitos

- Desktop: Links de categorias horizontais, carrinho/conta/busca alinhados à direita
- Mobile: Menu hambúrguer lateral, o carrinho permanece visível no cabeçalho (não oculto no menu)
- **CRÍTICO: Buscar as categorias do backend dinamicamente (NUNCA faça hardcode de arrays estáticos)**
- Fixo (Sticky): Recomendado para fácil acesso ao carrinho enquanto navega
- Atualizações em tempo real: Contagem do carrinho, estado de login, alterações de categorias

## Decisão: Simple Dropdown vs Megamenu

**Use Simple Dropdown (Menu Suspenso Simples) quando:**

- <10 categorias de nível superior
- Hierarquia plana ou rasa (1-2 níveis de profundidade)
- Mínimo de subcategorias por pai
- Catálogo de produtos focado/especializado

**Use Megamenu quando:**

- 10+ categorias de nível superior
- Hierarquia profunda (3+ níveis)
- Necessidade de destacar produtos em destaque na navegação
- Catálogo de produtos complexo
- Moda, eletrônicos ou grande estoque

**Mobile**: Sempre use menu lateral (drawer) com padrão de sanfona (accordion), nunca use megamenu no mobile.

Veja [megamenu.md](megamenu.md) para detalhes de implementação do megamenu.

## Principais Padrões de E-commerce

### Indicador de Carrinho (CRÍTICO)

**Sempre visível tanto no desktop quanto no mobile:**

- Desktop: Canto superior direito, ícone do carrinho + selo de contagem
- Mobile: Canto superior direito no cabeçalho (NÃO oculto no menu hambúrguer)
- Isso é inegociável - os usuários esperam que o carrinho esteja sempre acessível

**Exibição do selo (badge):**

- Mostra a contagem de itens (NÃO o preço - confunde quando as variantes mudam)
- Apenas visível quando o carrinho tem itens (contagem > 0)
- Mostre a contagem real até 99, depois "99+"
- Posição: Canto superior direito do ícone do carrinho
- ARIA label: `aria-label="Shopping cart with 3 items"`

**Atualizações em tempo real:**

- Atualize a contagem imediatamente quando os itens forem adicionados (UI otimista)
- Nenhuma atualização de página necessária
- Sincronize com o estado do carrinho no backend
- Lide com erros de forma elegante (restaure a contagem se a adição falhar)

**Comportamento do clique:**

- Opção 1: Navegar para a página do carrinho
- Opção 2: Abrir popup/drawer do carrinho (veja cart-popup.md)
- A escolha depende do tipo de loja (veja cart-popup.md para critérios de decisão)

✅ **CORRETO:**

- Ícone do carrinho visível no cabeçalho mobile
- O selo mostra a contagem (não o preço)
- Atualiza em tempo real sem atualizar a página
- Alvo de toque de 44x44px
- Tem link para o carrinho ou abre o popup do carrinho

❌ **ERRADO:**

- Ocultar o carrinho no menu hambúrguer mobile (os usuários não conseguem encontrá-lo)
- Mostrar o preço no selo (€25.99) em vez da contagem
- A contagem do carrinho não atualiza até que a página seja recarregada
- Nenhum feedback visual quando itens são adicionados

### Navegação de Categorias

**CRÍTICO: Buscar dinamicamente do backend (NUNCA hardcode):**

❌ **ERRADO - Todas estas são abordagens incorretas:**

```typescript
// WRONG - Hardcoded array
const categories = ["Women", "Men", "Kids", "Accessories"]

// WRONG - Static object array
const categories = [
  { id: 1, name: "Women", slug: "women" },
  { id: 2, name: "Men", slug: "men" }
]

// WRONG - Importing static data
import { categories } from "./categories.ts"
```

✅ **CORRETO - Buscar via API do backend:**

- Medusa: Use o método de lista de categorias do SDK (verifique o método exato com os docs/MCP)
- Outros backends: Chame o endpoint de categorias (verifique a documentação da API)
- Busque na montagem do componente ou durante a renderização no lado do servidor

**Por que a busca dinâmica é obrigatória:**

- Proprietários de lojas adicionam/removem/renomeiam categorias frequentemente
- A ordem das categorias e a hierarquia mudam
- Lojas multilíngues precisam de nomes de categorias traduzidos
- Categorias em destaque rotacionam (sazonais, promoções)
- Valores hardcoded exigem intervenção do desenvolvedor para alterações simples

**Estratégia de cache:**

- Faça cache das categorias (revalide no intervalo ou por gatilho manual)
- Use SWR, TanStack Query ou cache de nível de framework
- Revalide a cada 5-10 minutos ou na navegação da página
- Atualize imediatamente quando as categorias do backend mudarem

**Organização:**

- 4-7 categorias de nível superior ideal (máx. 10 no desktop)
- A ordem vem do backend (respeita a ordenação do administrador)
- Mantenha "Ofertas" ou "Novidades" em destaque se o backend fornecer
- Máximo de 2 níveis em dropdown simples (categoria → subcategoria)
- Hierarquias mais profundas: Use megamenu ou páginas de categoria separadas

**Comportamento no Desktop:**

- Links horizontais com dropdowns ao passar o mouse para subcategorias
- Ligeiro atraso no hover para evitar ativações acidentais
- Clique no pai para navegar para a página da categoria
- Clique no filho para navegar para a subcategoria

**Comportamento no Mobile:**

- Todas as categorias no menu hambúrguer
- Padrão de sanfona (accordion) para subcategorias (expandir/recolher)
- Fechar o menu ao clicar na categoria (exceto ao expandir o accordion)
- Menu rolável se as categorias excederem a altura da viewport

✅ **CORRETO:**

- Categorias buscadas na API do backend ao montar
- Cache com estratégia de revalidação
- Respeita a ordenação e hierarquia do backend
- 4-7 itens de nível superior no desktop (com base no que o backend retorna)
- Sanfona para subcategorias no mobile
- Ordenação consistente em todos os dispositivos

❌ **ERRADO:**

- Array de categorias hardcoded no componente (NUNCA FAÇA ISSO)
- Categorias estáticas importadas de arquivo (NUNCA FAÇA ISSO)
- Sem invalidação de cache (categorias desatualizadas)
- Muitos itens de nível superior (>10, sobrecarregando)
- Ordem de categorias diferente no desktop e mobile
- Categorias não são atualizadas quando o backend muda

### Indicador de Conta de Usuário

**Dois estados com base na autenticação:**

**Deslogado:**

- Desktop: Texto "Entrar" ou "Login" + ícone de usuário
- Mobile: Apenas ícone de usuário
- Clique direciona para a página de login
- Chamada para ação (CTA) clara

**Logado:**

- Desktop: Nome de usuário, iniciais ou e-mail + dropdown
- Mobile: Nome/iniciais do usuário ou ícone → página da conta
- Menu dropdown (desktop): Minha Conta, Pedidos, Favoritos, Sair
- Buscar o usuário atual a partir do estado de autenticação do backend

**Gerenciamento de estado de autenticação:**

- Verifique o estado de autenticação no backend (não apenas no localStorage)
- Atualize imediatamente em eventos de login/logout
- Trate a expiração da sessão com elegância
- Sincronize em diferentes abas, se possível

✅ **CORRETO:**

- Mostra "Entrar" quando deslogado
- Mostra o identificador do usuário quando logado
- Dropdown com ações da conta
- Verifica o estado de autenticação do backend (não apenas o estado do cliente)

❌ **ERRADO:**

- Sem indicação de estado de login
- Depende exclusivamente de localStorage (pode estar desatualizado)
- Nenhum dropdown para ações da conta quando logado
- Faltando a opção de logout

### Padrão de Navegação Mobile

**Menu hambúrguer (Drawer):**

- Gatilho: Ícone de hambúrguer (canto superior esquerdo)
- Menu (Drawer): Desliza da esquerda, 80-85% da largura, altura total, rolável
- Fundo (Backdrop): Sobreposição semitransparente, clique para fechar
- Conteúdo: Todas as categorias com subcategorias em formato de sanfona (accordion)

**CRÍTICO: Mantenha o carrinho no cabeçalho:**

- O ícone do carrinho permanece no cabeçalho mobile (canto superior direito)
- Não esconda o carrinho dentro da gaveta do menu lateral
- Usuários esperam que o carrinho esteja sempre acessível
- O mesmo vale para o ícone de busca se usar busca apenas com ícone

**Conta no menu lateral:**

- Deslogado: Link "Entrar" no cabeçalho do menu lateral ou topo do menu
- Logado: Nome/iniciais do usuário no cabeçalho do menu lateral com link para a conta

**Comportamento ao fechar:**

- Botão fechar (X) no cabeçalho do menu lateral
- Clicar na sobreposição (backdrop)
- Navegar para uma categoria (fecha o menu)
- Tecla Esc

✅ **CORRETO:**

- Carrinho permanece no cabeçalho mobile (visível)
- Hambúrguer abre a gaveta (drawer) a partir da esquerda
- Sobreposição no fundo escurece o background
- Fecha na navegação ou clique no fundo
- Menu lateral rolável para menus longos

❌ **ERRADO:**

- Carrinho escondido dentro do menu hambúrguer (erro grave)
- Menu em tela cheia (sem fundo)
- O menu não fecha ao navegar
- Não rolável (categorias cortadas)

### Navegação Inferior (Alternativa para Mobile)

**Quando usar:**

- Loja possui 3-5 seções principais (Início, Navegar, Carrinho, Conta, Busca)
- Deseja-se uma experiência semelhante à de um app
- Mudança frequente entre as seções
- Não adequado para hierarquias complexas de categorias

**Padrão:**

- Barra fixa na parte inferior da tela (apenas mobile)
- Ícone + rótulo para cada seção
- Destacar a seção ativa
- Máximo de 5 itens
- Navegação direta, sem dropdowns

## Estrutura de Layout

**Desktop:**

- Esquerda: Logo → Início
- Centro: Links de categoria (horizontal)
- Direita: Busca, Conta, Carrinho

**Mobile:**

- Esquerda: Hambúrguer
- Centro: Logo
- Direita: Carrinho (+ ícone de Busca opcional)

**Fixo (Sticky) recomendado:**

- Mantém o carrinho/conta acessível durante a rolagem
- Use `position: sticky` ou `position: fixed`
- Cor de fundo sólida (esconde conteúdo rolável)
- Z-index adequado para ficar acima do conteúdo

## Essenciais de Acessibilidade

**ARIA específico de E-commerce:**

- Contagem do carrinho: `aria-live="polite"` para anunciar mudanças (ex: "3 itens no carrinho")
- Gaveta mobile: `role="dialog"`, `aria-modal="true"`
- Botão hambúrguer: `aria-label="Open navigation menu"`, `aria-expanded="false"`
- Página ativa: `aria-current="page"` no link da categoria atual
- Indicadores de dropdown: `aria-expanded`, `aria-controls` para relacionamentos do megamenu

**Navegação por teclado:**

- Tab passa por todos os links/botões
- Enter/Espaço para ativar
- Esc para fechar o menu mobile ou dropdowns
- Indicadores visíveis de foco (outline/ring)

**Acessibilidade genérica que se aplica:**

- HTML semântico (`<header>`, `<nav>`)
- Botões de ícone precisam de ARIA labels
- Contraste de cor mínimo de 4.5:1
- Alvos de toque de 44x44px em mobile

## Erros Comuns em E-commerce

❌ **CRÍTICO: Categorias estáticas hardcoded** - NUNCA crie arrays de categorias estáticos como `const categories = ["Women", "Men"]` ou importe de arquivos estáticos. SEMPRE busque via API do backend. As categorias mudam constantemente - novas categorias adicionadas, nomes alterados, ordenação atualizada. Categorias hardcoded exigem intervenção do desenvolvedor para mudanças simples e derrotam o propósito das plataformas de commerce dinâmicas. Este é o erro número #1 mais comum.

❌ **Ocultar o carrinho no menu lateral do mobile** - Usuários esperam que o carrinho esteja sempre visível. Mantenha o ícone do carrinho no cabeçalho (canto superior direito), não escondido dentro do menu hambúrguer.

❌ **Sem atualizações do carrinho em tempo real** - Atualize a contagem imediatamente quando itens forem adicionados (UI otimista). Não exija a atualização da página.

❌ **Mostrar preço no selo do carrinho** - Mostre a contagem de itens (número), não o preço total. A exibição do preço confunde quando as variantes têm quantidades diferentes.

❌ **Sem invalidação de cache** - Categorias ficam desatualizadas quando o backend muda. Revalide periodicamente (5-10 min) ou mediante gatilho manual.

❌ **Dropdowns que funcionam apenas via hover no mobile** - Use interações de clique/toque. O hover não funciona em dispositivos sensíveis ao toque.

❌ **Navegação de desktop em mobile** - Use o padrão de menu hambúrguer (drawer), não um menu horizontal que não se encaixa.

❌ **Ordem de categorias inconsistente** - Mesma ordem no desktop e mobile para consistência. Respeite a ordenação das categorias vinda do backend.

## Integração com o Backend

### Busca de Categorias (CRÍTICO - NUNCA Hardcode)

**Padrões de implementação:**

**Busca no lado do cliente (Client-side):**

- Busque as categorias no useEffect ao montar o componente
- Armazene no estado (use os tipos apropriados para o Medusa: StoreProductCategory)
- Trate os estados de carregamento e erro
- Mapeie as categorias para os links de navegação
- Use category.id como chave, category.handle para URL, category.name para exibição

**Com cache (RECOMENDADO):**

- Use TanStack Query com queryKey ['categories']
- Defina staleTime: 5-10 minutos (categorias mudam raramente)
- Estados automáticos de carregamento/erro
- Deduplicação de requisições se vários componentes precisarem de categorias

**Busca no lado do servidor (Server-side):**

- Busque em um componente de servidor ou função de carregamento
- Sem necessidade de estado de carregamento (renderizado no servidor)
- Melhor para SEO

**Padrão de sincronização do estado do carrinho:**

- Subscreva-se no estado global do carrinho (Context)
- Atualize a contagem do carrinho na navbar quando o carrinho mudar
- Trate atualizações otimistas (mostre a nova contagem imediatamente ao adicionar ao carrinho)
- Sincronize com o backend em eventos ou intervalos

**Padrão de estado de autenticação:**

- Verifique o estado de autenticação do backend na montagem
- Escute eventos de login/logout
- Atualize o indicador de conta imediatamente
- Lide com a expiração da sessão graciosamente

**Gatilhos de atualização de categoria:**

- No carregamento/navegação da página
- Em gatilho de refresh manual
- No intervalo de revalidação (5-10 minutos)
- Após o administrador atualizar as categorias (webhook ou polling)

## Lista de Verificação

**Recursos essenciais do Navbar:**

- [ ] **CRÍTICO: Categorias buscadas dinamicamente via API do backend (NÃO use arrays hardcoded)**
- [ ] **CRÍTICO: Sem imports de categorias estáticas ou listas de categorias hardcoded**
- [ ] Desktop: Links de categorias horizontais
- [ ] Mobile: Menu lateral (hambúrguer) com sanfona (accordion)
- [ ] Ícone do carrinho visível tanto no cabeçalho desktop quanto mobile (NÃO escondido no menu lateral)
- [ ] Selo do carrinho mostra a contagem de itens (não o preço)
- [ ] A contagem do carrinho é atualizada em tempo real
- [ ] Categorias utilizam a ordenação do backend (não a ordenação manual)
- [ ] Indicador de conta mostra o estado de login
- [ ] O logo aponta para a página inicial
- [ ] Exibição de 4 a 7 categorias principais (máx. 10)
- [ ] O menu lateral (drawer) fechar na navegação
- [ ] Navegação fixa/sticky (recomendado)
- [ ] Alvos de toque com 44x44px mínimos
- [ ] ARIA labels nos botões de ícone
- [ ] `aria-live` na contagem do carrinho para leitores de tela
- [ ] Acessível via teclado com estados de foco visíveis
- [ ] Categorias armazenadas em cache com estratégia de revalidação (5-10 min)
- [ ] Tratamento de erro para busca de categorias malsucedida
