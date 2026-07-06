# Componente da barra de navegação

## Índice

- [Visão geral](#visao-geral)
- [Decisão: menu suspenso simples x megamenu](#decisao-menu-suspenso-simples-x-megamenu)
- [Principais padrões de comércio eletrônico](#padroes-chave-de-comercio-eletronico)
- [Estrutura do layout](#estrutura-do-layout)
- [Fundamentos de acessibilidade](#fundamentos-de-acessibilidade)
- [Erros comuns no comércio eletrônico](#erros-comuns-no-comercio-eletronico)
- [Integração com o backend](#integracao-com-o-backend)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

Navegação principal para lojas virtuais. Computador: menu horizontal com links de categorias. Celular: menu tipo “hambúrguer” com subcategorias em formato de acordeão.

### ⚠️ CRÍTICO: NUNCA defina categorias estaticamente

**SEMPRE recupere as categorias dinamicamente do backend. NUNCA defina matrizes de categorias estáticas.**

❌ **ERRADO – NÃO FAÇA ISSO:**

```typescript
// WRONG - Static hardcoded categories
const categories = [
  { name: "Women", href: "/categories/women" },
  { name: "Men", href: "/categories/men" },
  { name: "Accessories", href: "/categories/accessories" }
]
```

✅ **CORRETO – Obter do backend:**

```typescript
// CORRECT - Fetch categories dynamically
const [categories, setCategories] = useState([])

useEffect(() => {
  fetch(`${apiUrl}/store/product-categories`)
    .then(res => res.json())
    .then(data => setCategories(data.product_categories))
}, [])
```

**Por que isso é importante:**

- As categorias mudam com frequência (novas categorias, renomeações, reordenações)
- Categorias codificadas manualmente ficam desatualizadas imediatamente
- Exige alterações no código sempre que as categorias mudam
- Não é possível escalar para lojas com catálogos dinâmicos
- Contraria o objetivo do comércio headless

### Requisitos principais

- Desktop: links de categorias horizontais, carrinho/conta/busca alinhados à direita
- Celular: menu tipo “hambúrguer”, o carrinho permanece visível no cabeçalho (não fica oculto no menu)
- **CRÍTICO: Buscar categorias do backend dinamicamente (NUNCA codificar matrizes estáticas)**
- Fixo: Recomendado para facilitar o acesso ao carrinho durante a navegação
- Atualizações em tempo real: número de itens no carrinho, status de login, mudanças de categoria

## Decisão: Menu suspenso simples x Megamenu

**Use o menu suspenso simples quando:**

- <10 categorias de nível superior
- Hierarquia plana ou superficial (1 a 2 níveis de profundidade)
- Número mínimo de subcategorias por categoria principal
- Catálogo de produtos focado/especializado

**Use o megamenu quando:**

- Mais de 10 categorias de nível superior
- Hierarquia profunda (3 ou mais níveis)
- Necessidade de destacar produtos em destaque na navegação
- Catálogo de produtos complexo
- Moda, eletrônicos ou estoque extenso

**Dispositivos móveis**: Sempre use a gaveta com padrão de acordeão; nunca use o megamenu em dispositivos móveis.

Consulte [megamenu.md](megamenu.md) para obter detalhes sobre a implementação do megamenu.

## Padrões-chave de comércio eletrônico

### Indicador do carrinho (CRÍTICO)

**Sempre visível tanto no desktop quanto no celular:**

- Desktop: canto superior direito, ícone do carrinho + emblema com a contagem
- Celular: canto superior direito no cabeçalho (NÃO oculto na gaveta tipo “hambúrguer”)
- Isso é imprescindível — os usuários esperam que o carrinho esteja sempre acessível

**Exibição do emblema:**

- Mostra a contagem de itens (NÃO o preço — isso gera confusão quando as variantes mudam)
- Visível apenas quando o carrinho contiver itens (contagem > 0)
- Mostrar a contagem real até 99; depois, “99+”
- Posição: canto superior direito do ícone do carrinho
- Rótulo ARIA: `aria-label="Carrinho de compras com 3 itens"`

**Atualizações em tempo real:**

- Atualizar a contagem imediatamente quando itens forem adicionados (IU otimista)
- Não é necessária atualização da página
- Sincronizar com o estado do carrinho no backend
- Lidar com erros de maneira adequada (restaurar a contagem se a adição falhar)

**Comportamento ao clicar:**

- Opção 1: Navegar para a página do carrinho
- Opção 2: Abrir o pop-up/menu deslizante do carrinho (consulte cart-popup.md)
- A escolha depende do tipo de loja (consulte cart-popup.md para critérios de decisão)

✅ **CORRETO:**

- Ícone do carrinho visível no cabeçalho da versão móvel
- O selo mostra a quantidade (não o preço)
- Atualizações em tempo real sem atualização da página
- Área de toque de 44x44px
- Links para o carrinho ou que abrem o pop-up do carrinho

❌ **INCORRETO:**

- Ocultar o carrinho no menu “hambúrguer” da versão móvel (os usuários não conseguem encontrá-lo)
- Exibição do preço no ícone (€25,99) em vez da quantidade
- A quantidade no carrinho não é atualizada até que a página seja recarregada
- Ausência de feedback visual quando itens são adicionados

### Navegação por categoria

**CRÍTICO: Buscar dinamicamente do backend (NUNCA codificar estaticamente):**

❌ **ERRADO – Todas essas são abordagens incorretas:**

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

✅ **CORRETO - Obter da API do backend:**

- Medusa: Use o método de lista de categorias do SDK (verifique o método exato na documentação/MCP)
- Outros backends: Chame o endpoint de categorias (consulte a documentação da API)
- Busca na montagem do componente ou durante a renderização do lado do servidor

**Por que a busca dinâmica é obrigatória:**

- Os proprietários das lojas adicionam, removem ou renomeiam categorias com frequência
- A ordem e a hierarquia das categorias mudam
- Lojas multilíngues precisam de nomes de categorias traduzidos
- As categorias em destaque mudam periodicamente (sazonais, promoções)
- Valores codificados exigem intervenção do desenvolvedor para alterações simples

**Estratégia de armazenamento em cache:**

- Armazenar categorias em cache (revalidar em intervalos ou por acionamento manual)
- Usar SWR, TanStack Query ou armazenamento em cache no nível do framework
- Revalidar a cada 5-10 minutos ou ao navegar entre páginas
- Atualizar imediatamente quando as categorias do backend forem alteradas

**Organização:**

- O ideal é ter de 4 a 7 categorias de nível superior (máximo de 10 no desktop)
- A ordem é definida pelo backend (respeita a ordem definida pelo administrador)
- Mantenha “Promoções” ou “Novidades” em destaque, se o back-end fornecer essas opções
- Máximo de 2 níveis no menu suspenso simples (categoria → subcategoria)
- Hierarquias mais profundas: use megamenu ou páginas de categorias separadas

**Comportamento no desktop:**

- Links horizontais com menus suspensos ao passar o mouse para as subcategorias
- Ligeiro atraso ao passar o cursor para evitar acionamentos acidentais
- Clique no item pai para navegar até a página da categoria
- Clique no item filho para navegar até a subcategoria

**Comportamento no celular:**

- Todas as categorias na barra de navegação tipo “hambúrguer”
- Padrão de acordeão para subcategorias (expandir/recolher)
- Fechar a barra de navegação ao clicar na categoria (exceto ao expandir o acordeão)
- Barra de navegação rolável se as categorias excederem a altura da janela de visualização

✅ **CORRETO:**

- Categorias buscadas da API de back-end ao carregar a página
- Cache com estratégia de revalidação
- Respeita a ordem e a hierarquia do back-end
- 4 a 7 itens de nível superior na versão para desktop (com base no que o backend retorna)
- Acordeão para subcategorias na versão móvel
- Ordenação consistente em todos os dispositivos

❌ **ERRADO:**

- Matriz de categorias codificada diretamente no componente (NUNCA FAÇA ISSO)
- Categorias estáticas importadas de um arquivo (NUNCA FAÇA ISSO)
- Ausência de invalidação do cache (categorias desatualizadas)
- Excesso de itens de nível superior (>10, excessivo)
- Ordem diferente das categorias no desktop e no celular
- As categorias não são atualizadas quando o backend é alterado

### Indicador de conta do usuário

**Dois estados com base na autenticação:**

**Fora da conta:**

- Computador: texto “Entrar” ou “Faça login” + ícone do usuário
- Celular: apenas o ícone do usuário
- Ao clicar, o usuário é direcionado para a página de login
- Chamada à ação clara

**Dentro da conta:**

- Computador: nome de usuário, iniciais ou e-mail + menu suspenso
- Celular: nome de usuário/iniciais ou ícone → página da conta
- Menu suspenso (computador): Minha conta, Pedidos, Lista de desejos, Sair
- Obter o usuário atual a partir do estado de autenticação do backend

**Gerenciamento do estado de autenticação:**

- Verificar o estado de autenticação no backend (não apenas no localStorage)
- Atualizar imediatamente nos eventos de login/logout
- Lidar com a expiração da sessão de maneira adequada
- Sincronizar entre abas, se possível

✅ **CORRETO:**

- Exibe “Entrar” quando o usuário está desconectado
- Exibe o identificador do usuário quando ele está conectado
- Menu suspenso com ações da conta
- Verifica o estado de autenticação no backend (não apenas no cliente)

❌ **INCORRETO:**

- Nenhuma indicação do estado de login
- Depende exclusivamente do localStorage (pode estar desatualizado)
- Não há menu suspenso para ações da conta quando o usuário está conectado
- Falta a opção de logout

### Padrão de navegação em dispositivos móveis

**Menu “hambúrguer”:**

- Acionador: ícone de hambúrguer (canto superior esquerdo)
- Gaveta: Desliza da esquerda, 80-85% da largura, altura total, com rolagem
- Fundo: Sobreposição semitransparente, clicar para fechar
- Conteúdo: Todas as categorias com subcategorias em formato de acordeão

**CRÍTICO: Manter o carrinho no cabeçalho:**

- O ícone do carrinho permanece no cabeçalho da versão móvel (canto superior direito)
- Não oculte o carrinho dentro da gaveta
- Os usuários esperam que o carrinho esteja sempre acessível
- O mesmo vale para o ícone de busca, caso seja utilizada a busca apenas por ícone

**Conta na gaveta:**

- Sem login: link “Entrar” no cabeçalho da gaveta ou na parte superior do menu
- Com login: nome de usuário/iniciais no cabeçalho da gaveta com link para a conta

**Comportamento ao fechar:**

- Botão Fechar (X) no cabeçalho da gaveta
- Clique na sobreposição de fundo
- Navegar para uma categoria (a gaveta fecha)
- Tecla Escape

✅ **CORRETO:**

- O carrinho permanece no cabeçalho da versão móvel (visível)
- O ícone de hambúrguer abre a gaveta pela esquerda
- A sobreposição de fundo escurece o plano de fundo
- Fechamento ao navegar ou ao clicar no fundo
- Gaveta rolável para menus longos

❌ **ERRADO:**

- Carrinho oculto dentro da gaveta do ícone de hambúrguer (erro grave)
- Gaveta em tela cheia (sem fundo)
- A gaveta não fecha ao navegar
- Não é rolável (categorias cortadas)

### Navegação inferior (alternativa para dispositivos móveis)

**Quando usar:**

- A loja possui de 3 a 5 seções principais (Página inicial, Navegar, Carrinho, Conta, Pesquisar)
- Deseja-se uma experiência semelhante à de um aplicativo
- Alternância frequente entre seções
- Não é adequado para hierarquias de categorias complexas

**Padrão:**

- Barra fixa na parte inferior da tela (somente em dispositivos móveis)
- Ícone + rótulo para cada seção
- Destaque a seção ativa
- Máximo de 5 itens
- Navegação direta, sem menus suspensos

## Estrutura do layout

**Desktop:**

- Esquerda: Logotipo → Página inicial
- Centro: Links de categorias (horizontais)
- Direita: Pesquisa, Conta, Carrinho

**Dispositivos móveis:**

- Esquerda: Ícone de hambúrguer
- Centro: Logotipo
- Direita: Carrinho (+ ícone de pesquisa opcional)

**Recomenda-se usar o efeito “sticky”:**

- Mantém o carrinho e a conta acessíveis durante a rolagem
- Use `position: sticky` ou `position: fixed`
- Cor de fundo sólida (oculta o conteúdo que rola)
- z-index adequado para permanecer acima do conteúdo

## Fundamentos de acessibilidade

**ARIA específico para comércio eletrônico:**

- Contagem do carrinho: `aria-live="polite"` para anunciar alterações (por exemplo, “3 itens no carrinho”)
- Menu deslizante no celular: `role="dialog"`, `aria-modal="true"`
- Botão de hambúrguer: `aria-label="Abrir menu de navegação"`, `aria-expanded="false"`
- Página ativa: `aria-current="page"` no link da categoria atual
- Indicadores de menu suspenso: `aria-expanded`, `aria-controls` para relações no megamenu

**Navegação por teclado:**

- Navegue com a tecla Tab por todos os links/botões
- Tecla Enter/Espaço para ativar
- Tecla Escape para fechar o menu móvel ou os menus suspensos
- Indicadores de foco visíveis (contorno/anel)

**Acessibilidade genérica aplicável:**

- HTML semântico (`<header>`, `<nav>`)
- Botões com ícones precisam de rótulos ARIA
- Contraste de cores mínimo de 4,5:1
- Áreas de toque de 44x44px em dispositivos móveis

## Erros comuns no comércio eletrônico

❌ **CRÍTICO: Categorias estáticas codificadas** - NUNCA crie matrizes de categorias estáticas como `const categories = ["Mulheres", "Homens"]` nem importe de arquivos estáticos. SEMPRE busque as categorias pela API do backend. As categorias mudam constantemente — novas categorias são adicionadas, nomes são alterados, a ordem é atualizada. Categorias codificadas exigem intervenção do desenvolvedor até mesmo para alterações simples e vão contra o propósito das plataformas de comércio dinâmicas. Esse é o erro mais comum.

❌ **Ocultar o carrinho no menu deslizante do celular** - Os usuários esperam que o carrinho esteja sempre visível. Mantenha o ícone do carrinho no cabeçalho (canto superior direito), e não oculto dentro do menu “hambúrguer”.

❌ **Ausência de atualizações em tempo real no carrinho** - Atualize a contagem imediatamente quando itens forem adicionados (interface de usuário otimista). Não exija a atualização da página.

❌ **Exibição do preço no ícone do carrinho** — Mostre a contagem de itens (número), não o preço total. A exibição do preço confunde quando as variantes têm quantidades diferentes.

❌ **Sem invalidação do cache** — As categorias ficam desatualizadas quando há alterações no backend. Revalide periodicamente (a cada 5–10 minutos) ou por acionamento manual.

❌ **Menus suspensos que só funcionam ao passar o mouse em dispositivos móveis** — Use interações por clique/toque. A função de passar o mouse não funciona em dispositivos sensíveis ao toque.

❌ **Navegação de desktop em dispositivos móveis** — Use o padrão de menu “hambúrguer”, e não um menu horizontal que não cabe na tela.

❌ **Ordem inconsistente das categorias** — Mantenha a mesma ordem no desktop e no celular para garantir a consistência. Respeite a ordem das categorias no backend.

## Integração com o backend

### Busca de categorias (CRÍTICO — NUNCA codifique diretamente)

**Padrões de implementação:**

**Busca no lado do cliente:**

- Busque as categorias no `useEffect` ao montar a página
- Armazenar no estado (use os tipos apropriados para o Medusa: StoreProductCategory)
- Lidar com os estados de carregamento e de erro
- Mapeie as categorias para links de navegação
- Use category.id como chave, category.handle para a URL e category.name para exibição

**Com cache (RECOMENDADO):**

- Use o TanStack Query com queryKey ['categories']
- Defina staleTime: 5 a 10 minutos (as categorias raramente mudam)
- Carregamento automático e estados de erro
- Solicite a deduplicação se vários componentes precisarem de categorias

**Busca no lado do servidor:**

- Faça a busca no componente do servidor ou na função de carregamento
- Não é necessário carregar o estado (renderizado no servidor)
- Melhor para SEO

**Padrão de sincronização do estado do carrinho:**

- Assinar o estado global do carrinho (Contexto)
- Atualizar a contagem do carrinho na barra de navegação quando o carrinho for alterado
- Lidar com atualizações otimistas (mostrar a nova contagem imediatamente ao adicionar ao carrinho)
- Sincronizar com o backend em eventos ou em intervalos

**Padrão de estado de autenticação:**

- Verificar o estado de autenticação no backend ao carregar a página
- Monitorar eventos de login/logout
- Atualizar o indicador de conta imediatamente
- Lidar com a expiração da sessão de maneira adequada

**Gatilhos de atualização de categoria:**

- Ao carregar a página/navegar
- Ao acionar a atualização manual
- No intervalo de revalidação (5 a 10 minutos)
- Após o administrador atualizar as categorias (webhook ou polling)

## Lista de verificação

**Recursos essenciais da barra de navegação:**

- [ ] **CRÍTICO: Categorias obtidas dinamicamente da API de back-end (NÃO matrizes codificadas)**
- [ ] **CRÍTICO: Sem importações estáticas de categorias ou listas de categorias codificadas**
- [ ] Desktop: Links horizontais de categorias
- [ ] Celular: Menu “hambúrguer” com acordeão
- [ ] Ícone do carrinho visível tanto no cabeçalho do desktop quanto no celular (NÃO oculto no menu)
- [ ] O ícone do carrinho mostra a quantidade de itens (não o preço)
- [ ] A contagem do carrinho é atualizada em tempo real
- [ ] As categorias utilizam ordenação no backend (não ordenação manual)
- [ ] O indicador de conta mostra o status de login
- [ ] O logotipo leva à página inicial
- [ ] 4 a 7 categorias de nível superior exibidas (máximo de 10)
- [ ] A gaveta do celular fecha ao navegar
- [ ] Navegação fixa (recomendado)
- [ ] Áreas de toque com tamanho mínimo de 44x44px
- [ ] Rótulos ARIA nos botões com ícones
- [ ] `aria-live` na contagem do carrinho para leitores de tela
- [ ] Acessível por teclado com estados de foco visíveis
- [ ] Categorias armazenadas em cache com estratégia de revalidação (5 a 10 min)
- [ ] Tratamento de erros na recuperação de categorias com falha
