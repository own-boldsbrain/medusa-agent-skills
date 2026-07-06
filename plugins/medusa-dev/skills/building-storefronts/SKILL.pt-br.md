---
name: building-storefronts
description: Load automatically when planning, researching, or implementing Medusa storefront features (calling custom API routes, SDK integration, React Query patterns, data fetching). REQUIRED for all storefront development in ALL modes (planning, implementation, exploration). Contains SDK usage patterns, frontend integration, and critical rules for calling Medusa APIs.
---

# Desenvolvimento de lojas virtuais com o Medusa

Guia de integração front-end para a criação de lojas virtuais com o Medusa. Aborda o uso do SDK, padrões do React Query e a chamada de rotas de API personalizadas.

## Quando aplicar

**Utilize esta habilidade para QUALQUER tarefa de desenvolvimento do front-end, incluindo:**

- Chamar rotas personalizadas da API do Medusa a partir do front-end
- Integrar o SDK do Medusa em aplicativos front-end
- Usar o React Query para buscar dados
- Implementar mutações com atualizações otimistas
- Tratamento de erros e invalidação de cache

**Carregue também o `building-with-medusa` ao:** Criar as rotas da API de back-end que a interface do usuário chama

## IMPORTANTE: Carregue os arquivos de referência quando necessário

**A referência rápida abaixo NÃO é suficiente para a implementação.** Você DEVE carregar o arquivo de referência antes de escrever o código de integração da interface do usuário.

**Carregue esta referência ao implementar recursos da loja virtual:**

- **Está acessando rotas da API?** → É OBRIGATÓRIO carregar `references/frontend-integration.md` primeiro
- **Está usando o SDK?** → É OBRIGATÓRIO carregar `references/frontend-integration.md` primeiro
- **Está implementando o React Query?** → É OBRIGATÓRIO carregar `references/frontend-integration.md` primeiro

## Categorias de regras por prioridade

| Prioridade | Categoria | Impacto | Prefixo |
|----------|----------|--------|--------|
| 1 | Uso do SDK | CRÍTICO | `sdk-` |
| 2 | Padrões do React Query | ALTO | `query-` |
| 3 | Exibição de dados | ALTA (inclui regra de preço CRÍTICA) | `display-` |
| 4 | Tratamento de erros | MÉDIA | `error-` |

## Referência rápida

### 1. Uso do SDK (CRÍTICO)

- `sdk-always-use` - **SEMPRE use o SDK Medusa JS para TODAS as solicitações de API** - NUNCA use o fetch() comum
- `sdk-existing-methods` - Para endpoints integrados, use os métodos existentes do SDK (`sdk.store.product.list()`, `sdk.admin.order.retrieve()`)
- `sdk-client-fetch` - Para rotas de API personalizadas, use `sdk.client.fetch()`
- `sdk-required-headers` - O SDK adiciona automaticamente os cabeçalhos necessários (chave de API publicável para a loja, autenticação para o administrador) — o uso do `fetch()` padrão sem esses cabeçalhos causa erros
- `sdk-no-json-stringify` - **NUNCA use JSON.stringify() no corpo da solicitação** - O SDK lida com a serialização automaticamente
- `sdk-plain-objects` - Passe objetos JavaScript simples para o corpo da solicitação, não strings
- `sdk-locate-first` - Sempre localize onde o SDK está instanciado no projeto antes de usá-lo

### 2. Padrões de consulta do React (ALTO)

- `query-use-query` - Use `useQuery` para solicitações GET (busca de dados)
- `query-use-mutation` - Use `useMutation` para solicitações POST/DELETE (mutações)
- `query-invalidate` - Invalide as consultas em `onSuccess` para atualizar os dados após mutações
- `query-keys-hierarchical` - Estruture as chaves de consulta hierarquicamente para um gerenciamento eficaz do cache
- `query-loading-states` - Sempre trate os estados `isLoading`, `isPending` e `isError`

### 3. Exibição de dados (ALTA)

- `display-price-format` - **CRÍTICO**: Os preços do Medusa são armazenados tal como estão (US$ 49,99 = 49,99, NÃO em centavos). Exiba-os diretamente — NUNCA divida por 100

### 4. Tratamento de erros (MÉDIO)

- `error-on-error` - Implemente o callback `onError` nas mutações para lidar com falhas
- `error-display` - Exiba mensagens de erro aos usuários quando as mutações falharem
- `error-rollback` - Use atualizações otimistas com reversão em caso de erro para melhorar a experiência do usuário

## Padrão crítico do SDK

**SEMPRE passe objetos simples para o SDK — NUNCA use JSON.stringify():**

```typescript
// ✅ CORRECT - Plain object
await sdk.client.fetch("/store/reviews", {
  method: "POST",
  body: {
    product_id: "prod_123",
    rating: 5,
  }
})

// ❌ WRONG - JSON.stringify breaks the request
await sdk.client.fetch("/store/reviews", {
  method: "POST",
  body: JSON.stringify({  // ❌ DON'T DO THIS!
    product_id: "prod_123",
    rating: 5,
  })
})
```

**Por que isso é importante:**

- O SDK lida com a serialização JSON automaticamente
- Usar JSON.stringify() resultará em serialização dupla e prejudicará a solicitação
- O servidor não conseguirá analisar o corpo da solicitação

## Lista de verificação de erros comuns

Antes de implementar, verifique se você NÃO está fazendo o seguinte:

**Uso do SDK:**

- [ ] Usar o fetch() comum em vez do SDK do Medusa JS (causa erros de cabeçalho ausente)
- [ ] Não usar os métodos existentes do SDK para endpoints integrados (por exemplo, usar sdk.client.fetch("/store/products") em vez de sdk.store.product.list())
- [ ] Usar JSON.stringify() no parâmetro body
- [ ] Definir manualmente os cabeçalhos Content-Type (o SDK os adiciona)
- [ ] Codificar manualmente os caminhos de importação do SDK (localize-os primeiro no projeto)
- [ ] Não usar sdk.client.fetch() para rotas personalizadas

**React Query:**

- [ ] Não invalidar consultas após mutações
- [ ] Usar chaves de consulta planas em vez de hierárquicas
- [ ] Não lidar com estados de carregamento e erro
- [ ] Esquecer de desativar botões durante mutações (isPending)

**Exibição de dados:**

- [ ] **CRÍTICO**: Dividir os preços por 100 ao exibi-los (os preços são armazenados como estão: US$ 49,99 = 49,99, NÃO em centavos)

**Tratamento de erros:**

- [ ] Não implementar callbacks onError
- [ ] Não exibir mensagens de erro aos usuários
- [ ] Não lidar adequadamente com falhas de rede

## Como usar

**Para padrões e exemplos detalhados, carregue o arquivo de referência:**

```
references/frontend-integration.md - SDK usage, React Query patterns, API integration
```

O arquivo de referência contém:

- Padrões passo a passo de integração do SDK
- Exemplos completos do React Query
- Exemplos de código correto e incorreto
- Melhores práticas para chaves de consulta
- Padrões de atualização otimista
- Estratégias de tratamento de erros

## Quando usar o servidor MCP do MedusaDocs

**Use esta habilidade como (FONTE PRINCIPAL):**

- Como chamar rotas de API personalizadas a partir do storefront
- Padrões de uso do SDK (sdk.client.fetch)
- Padrões de integração com o React Query
- Erros comuns e antipadrões

**Use o servidor MCP do MedusaDocs para (FONTE SECUNDÁRIA):**

- Métodos integrados do SDK (sdk.admin.*, sdk.store.*)
- Referência oficial da API do SDK do Medusa
- Opções de configuração específicas do framework

**Por que as habilidades vêm em primeiro lugar:**

- As habilidades contêm padrões essenciais, como “não use JSON.stringify”, que o MCP não enfatiza
- As habilidades mostram padrões corretos versus incorretos; o MCP mostra o que é possível
- O planejamento requer compreensão dos padrões, não apenas a referência da API

## Integração com o backend

**⚠️ CRÍTICO: SEMPRE use o SDK do Medusa JS — NUNCA use o fetch() comum**

Ao desenvolver funcionalidades que abrangem o backend e o frontend:

1. **Back-end (habilidade “building-with-medusa”):** Módulo → Fluxo de trabalho → Rota da API
2. **Storefront (esta habilidade):** SDK → React Query → Componentes da interface do usuário
3. **Conexão:**
   - Endpoints integrados: use métodos existentes do SDK (`sdk.store.product.list()`)
   - Rotas de API personalizadas: Use `sdk.client.fetch("/store/my-route")`
   - **NUNCA use o método fetch() comum** — a falta da chave de API publicável causa erros

**Por que o SDK é necessário:**

- As rotas da loja precisam do cabeçalho `x-publishable-api-key`
- As rotas de administração precisam dos cabeçalhos `Authorization` e de sessão
- O SDK lida com todos os cabeçalhos necessários automaticamente
- Chamada `fetch()` comum sem cabeçalhos → erros de autenticação/autorização

Consulte `building-with-medusa` para conhecer os padrões de rotas da API de back-end.
