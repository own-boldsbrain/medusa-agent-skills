# Conectando ao Backend

## Contents

- [Visão Geral](#visão-geral)
- [Detectando o Backend](#detecting-the-backend-critical)
- [Detecção de Framework](#detecção-de-framework)
- [Configuração do Ambiente](#configuracao-do-ambiente)
- [Integração Específica do Backend](#backend-specific-integration)
- [Padrões de Autenticação](#padrões-de-autenticação)
- [Gerenciamento de Estado do Carrinho](#gerenciamento-de-estado-do-carrinho)
- [Tratamento de Erros para Ecommerce](#tratamento-de-erros-para-ecommerce)
- [Padrões de Desempenho](#padrões-de-desempenho)
  - [Busca de Dados com TanStack Query](#busca-de-dados-com-tanstack-query-recomendado)
- [Checklist](#checklist)

## Visão geral

Melhores práticas para conectar a vitrine aos APIs de backend de e-commerce. Padrões independentes de framework para autenticação, gerenciamento de estado do carrinho, tratamento de erros e otimização de desempenho.

**Para integração específica da Medusa**, consulte `reference/medusa.md` para configuração do SDK, preços, regiões e padrões Medusa.

## Detectando o Backend (CRÍTICO)

**Antes de implementar qualquer integração de backend, identifique qual backend de comércio eletrônico está sendo utilizado.**

### Estratégia de Detecção

**1. Verificar a estrutura de monorepo:**

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

**2. Verifique as dependências no arquivo package.json:**

```json
{
  "dependencies": {
    "@medusajs/js-sdk": "...",  // Medusa
    // check other ecommerce frameworks...
  }
}
```

**3. Check environment variables:**

```bash
# Look in .env, .env.local, .env.example
grep -i "api\|backend\|medusa\|shopify\|commerce" .env*
```

Padrões comuns:

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` → Medusa
- Personalizado `API_URL` ou `BACKEND_URL` → Outro backend

**4. Se estiver em dúvida, PERGUNTE AO USUÁRIO:**

```markdown
I need to connect to the ecommerce backend. Which backend are you using?

Options:
- Medusa (open-source headless commerce)
- Custom backend
- Other
```

### Documentação do Backend e Servidores MCP

**SEMPRE consulte a documentação oficial do backend ou o servidor MCP para:**

- API endpoints and data structures
- Requisitos de autenticação
- SDK uso e instalação
- Configuração de ambiente
- Limites de taxa e melhores práticas

**Para Medusa:**

- Documentação: <https://docs.medusajs.com>
- MCP Server: Se disponível, utilize o servidor Medusa MCP para informações de API em tempo real.
- Docs do JS SDK: <https://docs.medusajs.com/resources/js-sdk>
- Veja `reference/medusa.md` para o guia de integração detalhado

**Para outros backends:**

- Verifique o portal de documentação do backend
- Procure pelo servidor MCP, se disponível
- Verifique os endpoints da API e os métodos de autenticação
- Nunca assuma a estrutura da API sem verificação

**Importante:** Não adivinhe pontos de extremidade (endpoints) ou formatos de dados da API. Sempre verifique com a documentação ou peça ao usuário para confirmar a estrutura da API do backend.

## Detecção de Framework

Identifique o framework de frontend para determinar os padrões adequados de busca de dados:

**Next.js:**

- App Router: Componentes do Servidor (async/await), Componentes do Cliente (useEffect/TanStack Query)
- Pages Router: getServerSideProps/getStaticProps (server), useEffect (client)

**SvelteKit:**

- Carregar funções para dados do lado do servidor
- Cliente-side: fetch no ciclo de vida do componente

**TanStack Start:**

- Funções do servidor para dados do lado do servidor
- Cliente-side: fetch com React hooks

**Regra Geral:**

- **Carregamento inicial do lado do servidor**: SEO, desempenho, segurança (páginas de produtos, listas)
- **Interações do lado do cliente**: Carrinho, filtros, busca, dados específicos do usuário

## Environment Configuration

**Armazene URLs e chaves da API em variáveis de ambiente:**

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_PUBLISHABLE_KEY=pk_...
```

**Prefixos específicos do framework:**

- Next.js: `NEXT_PUBLIC_` para o lado do cliente
- SvelteKit: `PUBLIC_` para o lado do cliente
- Vite-based (TanStack Start): `VITE_` para o lado do cliente

**Segurança:**

- ❌ NUNCA exponha chaves secretas/administrativas no código do lado do cliente
- ✅ Chaves publicáveis são seguras para o cliente (Medusa, Stripe)
- ✅ Secret keys only in server-side code or environment

## Integração Específica de Backend

### Backend Medusa

**Para o guia completo de integração com o Medusa**, consulte `reference/medusa.md` que aborda:

- Instalação e configuração do SDK
- Configuração do Vite (para TanStack Start, etc.)
- Tipos TypeScript do `@medusajs/types`
- Exibição de preço (nunca divida por 100)
- Operações comuns (produtos, carrinho, categorias, clientes)
- Pontos de extremidade personalizados
- Região gerenciamento de estado
- Error handling with SDK

### Outros Backends

Para backends não Medusa (APIs personalizadas, plataformas de terceiros):

**1. Consulte a documentação da API do backend** para:

- Requisitos de autenticação
- Endpoints disponíveis
- Formatos de solicitação/resposta
- Disponibilidade do SDK (verifique se existe um SDK oficial)

**2. Use o SDK oficial do backend, se disponível** - fornece segurança de tipos, tratamento de erros e melhores práticas

**3. Se não houver SDK, crie um wrapper de cliente de API:**

- Centralize API calls in one module
- Agrupar por recurso (produtos, carrinho, clientes, pedidos)
- Lidar com autenticação (incluir tokens/cookies)
- Lide com erros de forma consistente
- Use native fetch ou axios

## Padrões de Autenticação

### Autenticação do Cliente

**Sessão baseada (cookies):**

- Backend manages session via cookies
- Sem necessidade de gerenciamento manual de tokens
- Funciona entre atualizações de página
- Comum em backends tradicionais de ecommerce
- Chamar o endpoint de login do backend, verificar o estado de autenticação, métodos de logout

**Token-based (JWT, OAuth):**

- Armazene o token no localStorage ou em um cookie seguro após o login
- Include token in Authorization header for all authenticated requests
- Comum em backends headless/API-first
- Format: `Authorization: Bearer {token}`

### Protegendo Rotas do Cliente

**Check authentication before rendering customer-specific pages** (account, orders, addresses):

- **Servidor**: Verifique a autenticação nas funções do servidor (getServerSideProps, funções de carregamento, etc.). Redirecione para o login se não estiver autenticado.
- **Cliente**: Verifique o estado de autenticação ao montar. Redirecione para login se não estiver autenticado.

Use framework-specific auth patterns for redirects.

### Cart Access Pattern

**Carrinhos de hóspedes:**

- Armazene o ID do carrinho no localStorage ou cookie
- Check for existing cart ID on app load
- Create new cart if none exists
- Permite compras sem conta
- Persists across sessions

**Carrinhos logados:**

- Associar carrinho à conta do cliente
- Syncs across devices
- **CRÍTICO: Mesclar o carrinho de visitante com o carrinho do cliente ao fazer login** - Transferir os itens do carrinho de visitante para o carrinho da conta do cliente e, em seguida, limpar o ID do carrinho de visitante do localStorage

## Gerenciamento de Estado do Carrinho

**Critical ecommerce pattern**: Cart must be accessible throughout the app.

### Global Cart State

**Contexto do React (para casos simples):**

- Create CartContext and CartProvider
- Store cart state and cartId (from localStorage)
- Carregar o carrinho na montagem se cartId existir
- Forneça métodos: addItem, removeItem, updateQuantity, clearCart
- Atualize o estado do carrinho após cada operação

**Bibliotecas de gerenciamento de estado (Zustand, Redux):**

- Use for complex state requirements
- Melhor para aplicativos grandes
- Mais fácil de depurar com DevTools
- Same pattern: Store cart, provide actions, sync with backend

**Requisitos principais:**

- Carrinho acessível de qualquer componente
- Atualizações em tempo real da contagem do carrinho
- Atualizações otimistas da interface do usuário (atualize a IU imediatamente, sincronize com o backend)

### Limpeza do Carrinho Após a Colocação do Pedido (CRÍTICO)

**IMPORTANTE: Após a realização do pedido, DEVE ser feito o reset do estado do carrinho.**

**Problema comum:** O popup do carrinho e o estado do carrinho global ainda mostram itens antigos após a conclusão da ordem. Isso ocorre quando o estado do carrinho não é limpo após o checkout.

**Ações de limpeza necessárias:**

1. **Limpar carrinho do estado global** - Resetar estado do carrinho para null/empty em Context/Zustand/Redux
2. **Limpar localStorage cart ID** - Remover ID da cesta: `localStorage.removeItem('cart_id')`
3. **Invalide consultas de carrinho** - Se estiver usando TanStack Query: `queryClient.invalidateQueries({ queryKey: ['carrinho'] })`
4. **Atualizar contagem do carrinho para 0** - Navbar e interface devem refletir o carrinho vazio

**Quando limpar:**

- Após o **colocamento** bem-sucedido do pedido (pedido confirmado)
- Ao navegar para a página de confirmação do pedido
- Antes de redirecionar para a página de agradecimento

**Por que isso é crítico:**

- Impede que o "phantom cart" apareça no pop-up do carrinho após o pedido
- Garante estado limpo para a próxima sessão de compras
- Melhora a UX ao não mostrar itens antigos do carrinho

## Tratamento de Erros para Ecommerce

### Introdução

O tratamento de erros é uma parte crucial do desenvolvimento de software, especialmente em aplicações de e-commerce. Erros podem ocorrer por uma variedade de motivos, incluindo problemas de rede, falhas de servidor, ou mesmo erros de programação. Neste artigo, vamos explorar como lidar com erros de forma eficaz em aplicações de e-commerce.

### Tipos de Erros

Existem vários tipos de erros que podem ocorrer em aplicações de e-commerce:

***Erros de Conexão**: Erros que ocorrem quando há problemas de conexão com o servidor ou com a base de dados.
***Erros de Validção**: Erros que ocorrem quando os dados fornecidos pelo usuário não são válidos.
***Erros de Negócios**: Erros que ocorrem quando há problemas de negócios, como falta de estoque ou problemas de pagamento.

### Exemplo de Implementação

Abaixo, vamos apresentar um exemplo de implementação de tratamento de erros em Python:
```python
import logging

# Configuração de log
logging.basicConfig(level=logging.INFO)

class EcommerceApp:
    def __init__(self):
        self.conexao = None

    def conectar(self):
        try:
            self.conexao = sqlite3.connect('banco.db')
            logging.info('Conectado ao banco de dados')
        except sqlite3.Error as e:
            logging.error(f'Erro ao conectar ao banco de dados: {e}')

    def validar_dados(self, dados):
        try:
            # Validação dos dados
            if not dados['nome']:
                raise ValueError('Nome é obrigatório')
            if not dados['email']:
                raise ValueError('E-mail é obrigatório')
            logging.info('Dados válidos')
        except ValueError as e:
            logging.error(f'Erro de validação: {e}')

    def processar_pedido(self, pedido):
        try:
            # Processamento do pedido
            logging.info('Pedido processado com sucesso')
        except Exception as e:
            logging.error(f'Erro ao processar pedido: {e}')

# Exemplo de uso
app = EcommerceApp()
app.conectar()
app.validar_dados({'nome': 'João', 'email': 'joao@example.com'})
app.processar_pedido({'id': 1, 'valor': 100.00})
```
### Conclusão

O tratamento de erros é uma parte crucial do desenvolvimento de software de e-commerce. Ao entender os diferentes tipos de erros e implementar um sistema de tratamento de erros eficaz, podemos garantir que nossas aplicações sejam mais robustas e menos propensas a erros. Além disso, um bom sistema de tratamento de erros pode ajudar a melhorar a experiência do usuário e a reduzir o tempo de resolução de problemas.

### Recursos Adicionais

* [Tratamento de Erros em Python](https://docs.python.org/pt-br/3/library/logging.html)
* [Exemplo de Implementação de Tratamento de Erros em Python](https://github.com/example/tratamento-erros-python)

### Referências

* [Tratamento de Erros em Aplicações de E-commerce](https://www.example.com/tratamento-erros-e-commerce)
* [Exemplo de Implementação de Tratamento de Erros em Aplicações de E-commerce](https://github.com/example/tratamento-erros-e-commerce)

### Erros específicos de comércio eletrônico

**Sem estoque:**

- Pegue erros ao adicionar ao carrinho
- Verifique por "sem estoque" ou "estoque" no erro de mensagem
- Mostre mensagem amigável para o usuário: "Desculpe, esse item agora está fora de estoque"
- Atualize a interface de disponibilidade do produto para mostrar fora de estoque

**Preço alterado durante o checkout:**

- Compare o total do carrinho com o total esperado.
- Se diferente, exiba o aviso: "Os preços foram atualizados. Por favor, revise seu carrinho."
- Destaque os preços alterados no carrinho

**Falha no pagamento:**

- Pegue erros durante a conclusão do pedido
- Verifique erros de pagamento específicos: payment_declined, insufficient_funds, etc.
- Mostrar mensagens específicas:
  - Pagamento recusado → "O pagamento foi recusado. Por favor, tente um método de pagamento diferente."
  - Fundos insuficientes → "Fundos insuficientes. Por favor, utilize um cartão diferente."
  - Generic → "Pagamento falhou. Por favor, tente novamente ou entre em contato com o suporte."

**Sessão expirada:**

- Capturar erros 401/Unauthorized
- Limpar estado de autenticação
- Redirecione para login com mensagem: "Sua sessão expirou. Por favor, faça o login novamente."

### Mensagens de Erro Amigáveis ao Usuário

**Mensagens de Erro Amigáveis ao Usuário**A criação de mensagens de erro amigáveis ao usuário é uma prática comum em muitas aplicações. Elas ajudam a melhorar a experiência do usuário, tornando o processo de resolução de problemas mais fácil e menos estressante.

### Exemplos de Mensagens de Erro Amigáveis

#### Exemplo 1: Erro de Credenciais Inválidas

```python
import getpass

def autenticar():
    usuario = input("Digite seu usuário: ")
    senha = getpass.getpass("Digite sua senha: ")
    
    if usuario == "admin" and senha == "senha":
        print("Autenticação bem-sucedida!")
    else:
        print("Credenciais inválidas. Por favor, tente novamente.")

autenticar()
```**Mensagem de Erro Amigável:**"Ocorreu um erro ao tentar se conectar. Por favor, verifique suas credenciais e tente novamente."

#### Exemplo 2: Erro de Conexão com o Banco de Dados

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255)
);

- Tentando se conectar ao banco de dados
SELECT* FROM usuarios;
```

**Mensagem de Erro Amigável:**"Ocorreu um erro ao tentar se conectar ao banco de dados. Por favor, verifique se o servidor está online e tente novamente."

### Dicas para Criar Mensagens de Erro Amigáveis*   Seja claro e direto ao informar o erro.
*   Forneça informações úteis para ajudar o usuário a resolver o problema.
*   Mantenha a linguagem simples e fácil de entender.
*   Evite jargões técnicos ou termos que possam confundir o usuário.
*   Ofereça sugestões de ação para o usuário seguir.

Ao seguir essas dicas, você pode criar mensagens de erro amigáveis que ajudem a melhorar a experiência do usuário e tornar o processo de resolução de problemas mais fácil e menos estressante.

**Transformar erros técnicos em mensagens claras:**

- Erros de rede/busca → "Não foi possível conectar. Verifique sua conexão com a internet."
- Erros de tempo limite → "Pedido expirado. Por favor, tente novamente."
- Erros de inventário → "Este item não está mais disponível na quantidade solicitada."
- Fallback padrão → "Algo deu errado. Por favor, tente novamente ou entre em contato com o suporte."

**Padrão**: Verificar a mensagem de erro ou código de status, mapear para uma mensagem amigável ao usuário, exibir na IU (toast, banner, inline).

## Padrões de Desempenho

### Recuperação de Dados com TanStack Query (RECOMENDADO)

**Use TanStack Query para todas as chamadas de API do backend** - fornece cache automático, desduplicação de solicitações, estados de carregamento/erro e atualizações otimistas.

**Instalação:** `npm install @tanstack/react-query`

**Configuração:**

- Crie QueryClient com opções padrão (staleTime: 5 min, retry: 1)
- Envolva a aplicação com QueryClientProvider

**Padrão de consulta (para busca de dados):**

- Use `useQuery` com queryKey e queryFn
- queryKey: Array com recurso e identificador `['products', categoryId]`
- queryFn: função de chamada da API
- Retorna: `data`, `isLoading`, `error`
- Use para: Produtos, carrinho, dados do cliente, categorias

**Padrão de mutação (para modificar dados):**

- Use `useMutation` com `mutationFn`
- mutationFn: operação da API (adicionar ao carrinho, atualizar, excluir)
- onSuccess: Atualizar cache ou invalidar queries
- Returns: função `mutate`, estado `isPending`
- Use for: Add to cart, remove from cart, update quantities, place order

**Benefícios:**

- Cache automático (sem gestão de cache manual)
- Built-in loading/error states
- Solicitação de deduplicação
- Atualizações otimistas (atualizar a interface do usuário antes que o servidor responda)
- Estratégias de invalidação de cache

**Ecommerce-specific usage:**

- Produtos: Tempo de estagnação longo (5-10 min) - os produtos não mudam com frequência.
- Carrinho: Tempo de validade curto ou inexistente - preços/estoque podem mudar
- Categorias: Tempo de estagnação longo - raramente mudam

### Estratégia de Cache

**Cache do lado do cliente:**

- TanStack Query lida automaticamente com `staleTime` e `cacheTime`
- Configurar globalmente ou por consulta
- Dados do produto: 5-10 min de tempo de latência
- Dados do carrinho: Atualizados a cada busca
- Categorias: Tempo de estagnação longo

**Cache do lado do servidor (específico do framework):**

- Next.js: Use `revalidate` export ou configuração de cache
- Definir período de revalidação (por exemplo, 300 segundos para páginas de produtos)
- Geração estática com ISR para páginas de produtos

### Solicitação de Deduplicação

TanStack Query e frameworks modernos lidam com isso automaticamente - múltiplos componentes requisitando os mesmos dados resultam em uma única requisição.

### Padrão de Paginação

**Offset-based:**Passe os parâmetros de limite e deslocamento para a API `limit: 24, offset: page* 24`

**Cursor-base (melhor desempenho):** Passe o limite e o cursor (ID do último item) `limit: 24, cursor: lastProductId`

Verifique a documentação do backend para o tipo de paginação compatível.

## Checklist

**Integração essencial de backend:**

- [ ] Backend detectado (Medusa, Shopify, personalizado, etc.)
- [ ] Variáveis de ambiente configuradas (URL da API, chaves)
- [ ] Padrões de busca de dados específicos do framework identificados
- [ ] **RECOMENDADO: TanStack Query instalado e configurado para chamadas de API**
- [ ] Busca no servidor para páginas de produtos (SEO)
- [ ] Busca no lado do cliente para interações do carrinho e do usuário (usar TanStack Query)
- [ ] Fluxo de autenticação implementado (login/logout)
- [ ] ID do carrinho persistido no localStorage ou cookies
- [ ] Gerenciamento global de estado do carrinho (contexto ou armazenamento)
- [ ] Contagem do carrinho sincronizada em todo o aplicativo
- [ ] Atualizações otimistas de UI para operações de carrinho
- [ ] Tratamento de erros para cenários de falta de estoque
- [ ] Tratamento de erros para falhas no pagamento
- [ ] Tratamento de expiração de sessão (redirecionar para login)
- [ ] Mensagens de erro amigáveis ao usuário (não técnicas)
- [ ] Estratégia de cache para dados de produtos
- [ ] Verificações de disponibilidade de estoque antes do checkout
- [ ] Detecção de alteração de preço e avisos

**Para backends Medusa, verifique também:**

- [ ] SDK Medusa instalado (`@medusajs/js-sdk` + `@medusajs/types`)
- [ ] SDK inicializado com baseUrl e publishableKey
- [ ] Configuração SSR do Vite adicionada (se estiver usando TanStack Start/Vite)
- [ ] Usando tipos oficiais de `@medusajs/types`
- [ ] Não dividir os preços por 100 (exibir como estão)
- [ ] Contexto de região implementado para lojas multi-região
- [ ] Região passada para consultas de carrinho e produto

Veja `reference/medusa.md` para o guia completo de integração com o Medusa.