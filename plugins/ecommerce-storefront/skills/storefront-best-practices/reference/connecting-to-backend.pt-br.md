# Conexão com o backend

## Índice

- [Visão geral](#visao-geral)
- [Detecção do backend](#deteccao-do-back-end-critico)
- [Detecção de framework](#deteccao-do-framework)
- [Configuração do ambiente](#configuracao-do-ambiente)
- [Integração específica ao backend](#integracao-especifica-do-backend)
- [Padrões de autenticação](#padroes-de-autenticacao)
- [Gerenciamento do estado do carrinho](#gerenciamento-do-estado-do-carrinho)
- [Tratamento de erros para comércio eletrônico](#tratamento-de-erros-no-comercio-eletronico)
- [Padrões de desempenho](#padroes-de-desempenho)
  - [Recuperação de dados com o TanStack Query](#padroes-de-autenticacao)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

Melhores práticas para conectar a loja virtual às APIs de back-end de comércio eletrônico. Padrões independentes de framework para autenticação, gerenciamento do estado do carrinho, tratamento de erros e otimização de desempenho.

**Para integração específica com o Medusa**, consulte `reference/medusa.md` para configuração do SDK, preços, regiões e padrões do Medusa.

## Detecção do back-end (CRÍTICO)

**Antes de implementar qualquer integração com o back-end, identifique qual back-end de comércio eletrônico está sendo usado.**

### Estratégia de detecção

**1. Verificar se há estrutura de monorepo:**

```bash
# Look for backend directory
ls -la ../backend
ls -la ./backend
ls -la ../../apps/backend
```

Padrões comuns de monorepo:

- `/apps/storefront` + `/apps/backend`
- `/frontend` + `/backend`
- `/packages/web` + `/packages/api`

**2. Verifique as dependências do `package.json`:**

```json
{
  "dependencies": {
    "@medusajs/js-sdk": "...",  // Medusa
    // check other ecommerce frameworks...
  }
}
```

**3. Verifique as variáveis de ambiente:**

```bash
# Look in .env, .env.local, .env.example
grep -i "api\|backend\|medusa\|shopify\|commerce" .env*
```

Padrões comuns:

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` → Medusa
- `API_URL` ou `BACKEND_URL` personalizados → Outro backend

**4. Em caso de dúvida, PERGUNTE AO USUÁRIO:**

```markdown
I need to connect to the ecommerce backend. Which backend are you using?

Options:
- Medusa (open-source headless commerce)
- Custom backend
- Other
```

### Documentação do backend e servidores MCP

**SEMPRE consulte a documentação oficial do backend ou o servidor MCP para:**

- Pontos de extremidade da API e estruturas de dados
- Requisitos de autenticação
- Uso e instalação do SDK
- Configuração do ambiente
- Limites de taxa e práticas recomendadas

**Para o Medusa:**

- Documentação: <https://docs.medusajs.com>
- Servidor MCP: se disponível, use o servidor MCP do Medusa para obter informações da API em tempo real
- Documentação do SDK JS: <https://docs.medusajs.com/resources/js-sdk>
- Consulte `reference/medusa.md` para obter um guia detalhado de integração

**Para outros back-ends:**

- Verifique o portal de documentação do back-end
- Procure o servidor MCP, se disponível
- Verifique os endpoints da API e os métodos de autenticação
- Nunca presuma a estrutura da API sem verificar

**Importante:** Não tente adivinhar os endpoints da API ou os formatos de dados. Sempre verifique na documentação ou peça ao usuário para confirmar a estrutura da API do backend.

## Detecção do framework

Identifique o framework do front-end para determinar os padrões adequados de obtenção de dados:

**Next.js:**

- Roteador de aplicativos: Componentes de servidor (async/await), Componentes de cliente (useEffect/TanStack Query)
- Roteador de páginas: getServerSideProps/getStaticProps (servidor), useEffect (cliente)

**SvelteKit:**

- Funções de carregamento para dados do lado do servidor
- Lado do cliente: recuperação no ciclo de vida do componente

**TanStack Start:**

- Funções do servidor para dados do lado do servidor
- Lado do cliente: recuperação com hooks do React

**Regra geral:**

- **Lado do servidor para o carregamento inicial**: SEO, desempenho, segurança (páginas de produtos, listagens)
- **Lado do cliente para interações**: carrinho, filtros, pesquisa, dados específicos do usuário

## Configuração do ambiente

**Armazene URLs e chaves da API da loja em variáveis de ambiente:**

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_PUBLISHABLE_KEY=pk_...
```

**Prefixos específicos de framework:**

- Next.js: `NEXT_PUBLIC_` para o lado do cliente
- SvelteKit: `PUBLIC_` para o lado do cliente
- Baseado em Vite (TanStack Start): `VITE_` para o lado do cliente

**Segurança:**

- ❌ NUNCA exponha chaves secretas/de administração no código do lado do cliente
- ✅ Chaves publicáveis são seguras para o lado do cliente (Medusa, Stripe)
- ✅ Chaves secretas devem estar apenas no código ou ambiente do lado do servidor

## Integração específica do backend

### Backend Medusa

**Para o guia completo de integração com o Medusa**, consulte `reference/medusa.md`, que aborda:

- Instalação e configuração do SDK
- Configuração do Vite (para TanStack Start, etc.)
- Tipos do TypeScript do `@medusajs/types`
- Exibição de preços (nunca dividir por 100)
- Operações comuns (produtos, carrinho, categorias, clientes)
- Endpoints personalizados
- Gerenciamento do estado da região
- Tratamento de erros com o SDK

### Outros back-ends

Para back-ends que não sejam do Medusa (APIs personalizadas, plataformas de terceiros):

**1. Consulte a documentação da API do back-end** para:

- Requisitos de autenticação
- Endpoints disponíveis
- Formatos de solicitação/resposta
- Disponibilidade do SDK (verifique se existe um SDK oficial)

**2. Use o SDK oficial do backend, se disponível** — oferece segurança de tipos, tratamento de erros e melhores práticas

**3. Se não houver SDK, crie um wrapper para o cliente da API:**

- Centralize as chamadas à API em um único módulo
- Agrupe por recurso (produtos, carrinho, clientes, pedidos)
- Gerencie a autenticação (inclua tokens/cookies)
- Trate os erros de maneira consistente
- Use o fetch nativo ou o axios

## Padrões de autenticação

### Autenticação de clientes

**Baseada em sessão (cookies):**

- O backend gerencia a sessão por meio de cookies
- Não é necessário gerenciamento manual de tokens
- Funciona mesmo após a atualização da página
- Comum em back-ends tradicionais de comércio eletrônico
- Chamar o endpoint de login do back-end, verificar o estado de autenticação e métodos de logout

**Baseado em token (JWT, OAuth):**

- Armazene o token no localStorage ou em um cookie seguro após o login
- Inclua o token no cabeçalho Authorization para todas as solicitações autenticadas
- Comum em back-ends headless/API-first
- Formato: `Authorization: Bearer {token}`

### Protegendo as rotas do cliente

**Verifique a autenticação antes de renderizar páginas específicas do cliente** (conta, pedidos, endereços):

- **Lado do servidor**: Verifique a autenticação nas funções do servidor (getServerSideProps, funções de carregamento, etc.). Redirecione para a página de login se o usuário não estiver autenticado.
- **Lado do cliente**: Verifique o estado de autenticação ao carregar a página. Redirecione para a página de login se o usuário não estiver autenticado.

Utilize padrões de autenticação específicos do framework para os redirecionamentos.

### Padrão de acesso ao carrinho

**Carrinhos de visitantes:**

- Armazene o ID do carrinho no localStorage ou em um cookie
- Verifique se há um ID de carrinho existente ao carregar o aplicativo
- Crie um novo carrinho se não houver nenhum
- Permite fazer compras sem conta
- Persiste entre sessões

**Carrinhos de usuários conectados:**

- Associar o carrinho à conta do cliente
- Sincronização entre dispositivos
- **CRÍTICO: Unificar o carrinho de visitante com o carrinho do cliente no momento do login** - Transferir os itens do carrinho de visitante para o carrinho da conta do cliente e, em seguida, limpar o ID do carrinho de visitante do localStorage

## Gerenciamento do estado do carrinho

**Padrão crítico de comércio eletrônico**: O carrinho deve estar acessível em todo o aplicativo.

### Estado global do carrinho

**React Context (para casos simples):**

- Criar CartContext e CartProvider
- Armazenar o estado do carrinho e o cartId (do localStorage)
- Carregar o carrinho na montagem, caso o cartId exista
- Forneça métodos: addItem, removeItem, updateQuantity, clearCart
- Atualize o estado do carrinho após cada operação

**Bibliotecas de gerenciamento de estado (Zustand, Redux):**

- Utilize-as para requisitos complexos de estado
- Mais adequadas para aplicativos de grande porte
- Mais fáceis de depurar com o DevTools
- Mesmo padrão: armazenar o carrinho, fornecer ações, sincronizar com o backend

**Requisitos principais:**

- Carrinho acessível a partir de qualquer componente
- Atualizações em tempo real da contagem do carrinho
- Atualizações otimistas da interface do usuário (atualizar a interface imediatamente, sincronizar com o backend)

### Limpeza do carrinho após a realização do pedido (CRÍTICO)

**IMPORTANTE: Após a conclusão bem-sucedida do pedido, você DEVE redefinir o estado do carrinho.**

**Problema comum:** A janela pop-up do carrinho e o estado global do carrinho ainda exibem itens antigos após a conclusão do pedido. Isso ocorre quando o estado do carrinho não é limpo após a finalização da compra.

**Ações de limpeza necessárias:**

1. **Limpar o carrinho do estado global** - Redefina o estado do carrinho para nulo/vazio em Context/Zustand/Redux
2. **Limpe o ID do carrinho no localStorage** - Remova o ID do carrinho: `localStorage.removeItem('cart_id')`
3. **Invalide as consultas do carrinho** - Se estiver usando o TanStack Query: `queryClient.invalidateQueries({ queryKey: ['cart'] })`
4. **Atualizar a contagem do carrinho para 0** — A barra de navegação e a interface do usuário devem refletir que o carrinho está vazio

**Quando limpar:**

- Após a realização bem-sucedida do pedido (pedido confirmado)
- Ao navegar para a página de confirmação do pedido
- Antes de redirecionar para a página de agradecimento

**Por que isso é fundamental:**

- Evita que o “carrinho fantasma” apareça no pop-up do carrinho após o pedido
- Garante um estado limpo para a próxima sessão de compras
- Melhora a experiência do usuário ao não exibir itens antigos do carrinho

## Tratamento de erros no comércio eletrônico

### Erros específicos do comércio eletrônico

**Esgotado:**

- Detecte erros ao adicionar ao carrinho
- Verificar se há “fora de estoque” ou “estoque” na mensagem de erro
- Exibir uma mensagem amigável: “Infelizmente, este item está fora de estoque no momento”
- Atualizar a interface de disponibilidade do produto para indicar que está fora de estoque

**Preço alterado durante a finalização da compra:**

- Comparar o total do carrinho com o total esperado
- Se houver diferença, exibir um aviso: “Os preços foram atualizados. Por favor, verifique seu carrinho.”
- Destaque os preços alterados no carrinho

**Falha no pagamento:**

- Detecte erros durante a conclusão do pedido
- Verifique se há erros específicos de pagamento: pagamento_recusado, saldo_insuficiente, etc.
- Exibir mensagens específicas:
  - Pagamento recusado → “Pagamento recusado. Tente um método de pagamento diferente.”
  - Saldo insuficiente → “Saldo insuficiente. Use outro cartão.”
  - Genérico → “Falha no pagamento. Tente novamente ou entre em contato com o suporte.”

**Sessão expirada:**

- Detectar erros 401/Não autorizado
- Limpar o estado de autenticação
- Redirecionar para o login com a mensagem: “Sua sessão expirou. Faça login novamente.”

### Mensagens de erro fáceis de entender

**Transforme erros técnicos em mensagens claras:**

- Erros de rede/busca → “Não foi possível conectar. Verifique sua conexão com a internet.”
- Erros de tempo limite → “O tempo limite da solicitação expirou. Tente novamente.”
- Erros de estoque → “Este item não está mais disponível na quantidade solicitada.”
- Mensagem genérica de fallback → “Ocorreu um erro. Tente novamente ou entre em contato com o suporte.”

**Padrão**: Verifique a mensagem de erro ou o código de status, mapeie para uma mensagem de fácil compreensão e exiba na interface do usuário (notificação, banner, mensagem embutida).

## Padrões de desempenho

### Busca de dados com o TanStack Query (RECOMENDADO)

**Use o TanStack Query para todas as chamadas de API do backend** — ele oferece cache automático, deduplicação de solicitações, estados de carregamento/erro e atualizações otimistas.

**Instalação:** `npm install @tanstack/react-query`

**Configuração:**

- Crie um `QueryClient` com as opções padrão (staleTime: 5 min, retry: 1)
- Envolva o aplicativo com `QueryClientProvider`

**Padrão de consulta (para buscar dados):**

- Use `useQuery` com queryKey e queryFn
- queryKey: array com recurso e identificador `['products', categoryId]`
- queryFn: função de chamada de API
- Retorna: `data`, `isLoading`, `error`
- Utilização: produtos, carrinho, dados de clientes, categorias

**Padrão de mutação (para modificar dados):**

- Use `useMutation` com mutationFn
- mutationFn: operação da API (adicionar ao carrinho, atualizar, excluir)
- onSuccess: atualizar o cache ou invalidar consultas
- Retorna: função `mutate`, estado `isPending`
- Utilização: adicionar ao carrinho, remover do carrinho, atualizar quantidades, finalizar compra

**Benefícios:**

- Armazenamento em cache automático (sem gerenciamento manual do cache)
- Estados de carregamento/erro integrados
- Desduplicação de solicitações
- Atualizações otimistas (atualizar a interface do usuário antes que o servidor responda)
- Estratégias de invalidação do cache

**Uso específico para comércio eletrônico:**

- Produtos: Tempo de validade longo (5 a 10 min) — os produtos não mudam com frequência
- Carrinho: Tempo de validade curto ou nenhum — preços/estoque podem mudar
- Categorias: Tempo de validade longo — raramente mudam

### Estratégia de armazenamento em cache

**Armazenamento em cache no lado do cliente:**

- O TanStack Query lida automaticamente com `staleTime` e `cacheTime`
- Configure globalmente ou por consulta
- Dados de produtos: tempo de validade de 5 a 10 minutos
- Dados do carrinho: atualizados a cada recuperação
- Categorias: tempo de validade longo

**Armazenamento em cache no lado do servidor (específico da estrutura):**

- Next.js: use a exportação `revalidate` ou a configuração de cache
- Definir o período de revalidação (por exemplo, 300 segundos para páginas de produtos)
- Geração estática com ISR para páginas de produtos

### Desduplicação de solicitações

O TanStack Query e os frameworks modernos lidam com isso automaticamente — múltiplos componentes solicitando os mesmos dados resultam em uma única solicitação.

### Padrão de paginação

**Baseado em offset:** Passe os parâmetros de limite e offset para a API `limit: 24, offset: page * 24`

**Baseado em cursor (melhor desempenho):** Passe o limite e o cursor (ID do último item) `limit: 24, cursor: lastProductId`

Verifique a documentação do backend para saber o tipo de paginação suportado.

## Lista de verificação

**Integração essencial com o backend:**

- [ ] Backend detectado (Medusa, Shopify, personalizado, etc.)
- [ ] Variáveis de ambiente configuradas (URL da API, chaves)
- [ ] Padrões de obtenção de dados específicos do framework identificados
- [ ] **RECOMENDADO: TanStack Query instalado e configurado para chamadas de API**
- [ ] Busca do lado do servidor para páginas de produtos (SEO)
- [ ] Busca do lado do cliente para o carrinho e interações do usuário (use o TanStack Query)
- [ ] Fluxo de autenticação implementado (login/logout)
- [ ] ID do carrinho armazenado no localStorage ou em cookies
- [ ] Gerenciamento global do estado do carrinho (contexto ou loja)
- [ ] Contagem do carrinho sincronizada em todo o aplicativo
- [ ] Atualizações otimistas da interface do usuário para operações do carrinho
- [ ] Tratamento de erros em casos de falta de estoque
- [ ] Tratamento de erros em falhas de pagamento
- [ ] Tratamento de expiração de sessão (redirecionamento para login)
- [ ] Mensagens de erro fáceis de entender (não técnicas)
- [ ] Estratégia de armazenamento em cache para dados de produtos
- [ ] Verificação de disponibilidade de estoque antes da finalização da compra
- [ ] Detecção de alterações de preço e avisos

**Para back-ends Medusa, verifique também:**

- [ ] SDK do Medusa instalado (`@medusajs/js-sdk` + `@medusajs/types`)
- [ ] SDK inicializado com baseUrl e publishableKey
- [ ] Configuração do Vite SSR adicionada (se estiver usando o TanStack Start/Vite)
- [ ] Usando tipos oficiais de `@medusajs/types`
- [ ] Não dividindo os preços por 100 (exibição tal como está)
- [ ] Contexto de região implementado para lojas multirregionais
- [ ] Região passada para consultas de carrinho e produtos

Consulte `reference/medusa.md` para obter o guia completo de integração com o Medusa.
