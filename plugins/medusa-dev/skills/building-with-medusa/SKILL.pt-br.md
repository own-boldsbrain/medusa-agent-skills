---
name: building-with-medusa
description: Load automatically when planning, researching, or implementing ANY Medusa backend features (custom modules, API routes, workflows, data models, module links, business logic). REQUIRED for all Medusa backend work in ALL modes (planning, implementation, exploration). Contains architectural patterns, best practices, and critical rules that MCP servers don't provide.
---

# Desenvolvimento de Back-end com Medusa

Guia abrangente de desenvolvimento de back-end para aplicativos Medusa. Contém padrões divididos em seis categorias que abrangem arquitetura, segurança de tipos, posicionamento da lógica de negócios e armadilhas comuns.

## Quando aplicar

**Utilize esta habilidade para QUALQUER tarefa de desenvolvimento de backend, incluindo:**

- Criação ou modificação de módulos personalizados e modelos de dados
- Implementação de fluxos de trabalho para mutações
- Criação de rotas de API (loja ou administração)
- Definição de ligações entre módulos e entidades
- Criação de lógica de negócios ou validação
- Consulta de dados entre módulos
- Implementação de autenticação/autorização

**Carregue também estas habilidades quando:**

- **building-admin-dashboard-customizations:** Criação da interface de usuário administrativa (widgets, páginas, formulários)
- **building-storefronts:** Chamada de rotas de API de back-end a partir de lojas virtuais (integração com SDK)

## IMPORTANTE: Carregue os arquivos de referência quando necessário

**A referência rápida abaixo NÃO é suficiente para a implementação.** Você DEVE carregar os arquivos de referência relevantes antes de escrever o código para esse componente.

**Carregue essas referências de acordo com o que você estiver implementando:**

- **Criando um módulo?** → É OBRIGATÓRIO carregar `reference/custom-modules.md` primeiro
- **Criando fluxos de trabalho?** → É OBRIGATÓRIO carregar `reference/workflows.md` primeiro
- **Criando rotas de API?** → É OBRIGATÓRIO carregar `reference/api-routes.md` primeiro
- **Criando links de módulo?** → É OBRIGATÓRIO carregar `reference/module-links.md` primeiro
- **Consultando dados?** → É OBRIGATÓRIO carregar `reference/querying-data.md` primeiro
- **Adicionando autenticação?** → É OBRIGATÓRIO carregar `reference/authentication.md` primeiro

**Requisito mínimo:** Carregue pelo menos 1 ou 2 arquivos de referência relevantes para sua tarefa específica antes de implementar.

## Padrão de arquitetura crítico

**SIGA SEMPRE este fluxo — nunca ignore camadas:**

```
Module (data models + CRUD operations)
  ↓ used by
Workflow (business logic + mutations with rollback)
  ↓ executed by
API Route (HTTP interface, validation middleware)
  ↓ called by
Frontend (admin dashboard/storefront via SDK)
```

**Convenções principais:**

- Apenas métodos GET, POST e DELETE (nunca PUT/PATCH)
- É obrigatório o uso de fluxos de trabalho para TODAS as mutações
- A lógica de negócios deve estar nas etapas do fluxo de trabalho, NÃO nas rotas
- Utilize `query.graph()` para recuperação de dados entre módulos
- Utilize `query.index()` (Módulo de Índice) para filtrar dados entre módulos separados por meio de links
- Os links entre módulos mantêm o isolamento entre eles

## Categorias de regras por prioridade

| Prioridade | Categoria | Impacto | Prefixo |
|----------|----------|--------|--------|
| 1 | Violações de arquitetura | CRÍTICA | `arch-` |
| 2 | Segurança de tipos | CRÍTICO | `type-` |
| 3 | Localização da lógica de negócios | ALTO | `logic-` |
| 4 | Importação e organização do código | ALTO | `import-` |
| 5 | Padrões de acesso a dados | MÉDIO (inclui regra de preço CRÍTICA) | `data-` |
| 6 | Organização de arquivos | MÉDIO | `file-` |

## Referência rápida

### 1. Violações de arquitetura (CRÍTICO)

- `arch-workflow-required` - Use fluxos de trabalho para TODAS as mutações; nunca chame serviços de módulos a partir de rotas
- `arch-layer-bypass` - Nunca ignore camadas (rota → serviço sem fluxo de trabalho)
- `arch-http-methods` - Use apenas GET, POST, DELETE (nunca PUT/PATCH)
- `arch-module-isolation` - Use ligações entre módulos, em vez de chamadas diretas de serviço entre módulos
- `arch-query-config-fields` - Não defina `fields` explicitamente ao usar `req.queryConfig`

### 2. Segurança de tipos (CRÍTICO)

- `type-request-schema` - Passe o tipo inferido pelo Zod para `MedusaRequest<T>` ao usar `req.validatedBody`
- `type-authenticated-request` - Use `AuthenticatedMedusaRequest` para rotas protegidas (não `MedusaRequest`)
- `type-export-schema` - Exporte tanto o esquema do Zod quanto o tipo inferido a partir dos middlewares
- `type-linkable-auto` - Nunca adicione `.linkable()` aos modelos de dados (é adicionado automaticamente)
- `type-module-name-camelcase` - Os nomes dos módulos DEVEM estar em camelCase; nunca use traços (isso causa erros em tempo de execução)

### 3. Localização da Lógica de Negócios (ALTA)

- `logic-workflow-validation` - Coloque a validação de negócios nas etapas do fluxo de trabalho, não nas rotas da API
- `logic-ownership-checks` - Valide propriedade/permissões nos fluxos de trabalho, não nas rotas
- `logic-module-service` - Mantenha os módulos simples (apenas CRUD), coloque a lógica nos fluxos de trabalho

### 4. Importação e organização do código (ALTA)

- `import-top-level` - Importe fluxos de trabalho/módulos no início do arquivo; nunca use `await import()` no corpo da rota
- `import-static-only` - Use importações estáticas para todas as dependências
- `import-no-dynamic-routes` - Importações dinâmicas aumentam a sobrecarga e prejudicam a verificação de tipos

### 5. Padrões de acesso a dados (MÉDIO)

- `data-price-format` - **CRÍTICO**: Os preços são armazenados exatamente como estão no Medusa (49,99 é armazenado como 49,99, NÃO em centavos). Nunca multiplique por 100 ao salvar nem divida por 100 ao exibir
- `data-query-method` - Use `query.graph()` para recuperar dados; use `query.index()` (Módulo de Índice) para filtrar entre módulos vinculados
- `data-query-graph` - Use `query.graph()` para consultas entre módulos com notação dot (sem filtragem entre módulos)
- `data-query-index` - Use `query.index()` ao filtrar por propriedades de modelos de dados vinculados em módulos separados
- `data-list-and-count` - Use `listAndCount` para consultas paginadas em um único módulo
- `data-linked-filtering` - `query.graph()` não pode filtrar por campos de módulos vinculados — use `query.index()` ou faça a consulta diretamente nessa entidade
- `data-no-js-filter` - Não use `.filter()` do JavaScript em dados vinculados — use filtros do banco de dados (`query.index()` ou consulte a entidade)
- `data-same-module-ok` - Permite filtrar por relações do mesmo módulo com `query.graph()` (por exemplo, product.variants)
- `data-auth-middleware` - Confie no middleware `authenticate`; não verifique manualmente `req.auth_context`

### 6. Organização de arquivos (MÉDIO)

- `file-workflow-steps` - Recomendado: crie etapas em `src/workflows/steps/[nome].ts`
- `file-workflow-composition` - Funções de composição em `src/workflows/[nome].ts`
- `file-middleware-exports` - Exporte esquemas e tipos dos arquivos de middleware
- `file-links-directory` - Defina links de módulos em `src/links/[nome].ts`

## Regras de composição do fluxo de trabalho

**A função de fluxo de trabalho possui restrições essenciais:**

```typescript
// ✅ CORRECT
const myWorkflow = createWorkflow(
  "name",
  function (input) { // Regular function, not async, not arrow
    const result = myStep(input) // No await
    return new WorkflowResponse(result)
  }
)

// ❌ WRONG
const myWorkflow = createWorkflow(
  "name",
  async (input) => { // ❌ No async, no arrow functions
    const result = await myStep(input) // ❌ No await
    if (input.condition) { /* ... */ } // ❌ No conditionals
    return new WorkflowResponse(result)
  }
)
```

**Restrições:**

- Sem async/await (é executado no momento do carregamento)
- Sem funções-seta (use `function`)
- Sem condicionais/ternários (use `when()`)
- Sem manipulação de variáveis (use `transform()`)
- Sem criação de datas (use `transform()`)
- Chamadas com várias etapas precisam de `.config({ name: "unique-name" })` para evitar conflitos

## Lista de verificação de erros comuns

Antes de implementar, verifique se você NÃO está fazendo o seguinte:

**Arquitetura:**

- [ ] Chamar serviços de módulos diretamente de rotas da API
- [ ] Usar métodos PUT ou PATCH
- [ ] Ignorar fluxos de trabalho para mutações
- [ ] Definir `fields` explicitamente com `req.queryConfig`
- [ ] Ignorar migrações após criar ligações entre módulos

**Segurança de tipos:**

- [ ] Esquecer o argumento de tipo `MedusaRequest<SchemaType>`
- [ ] Usar `MedusaRequest` em vez de `AuthenticatedMedusaRequest` para rotas protegidas
- [ ] Não exportar o tipo inferido pelo Zod dos middlewares
- [ ] Adicionar `.linkable()` aos modelos de dados
- [ ] Usar traços nos nomes dos módulos (devem estar em camelCase)

**Lógica de negócios:**

- [ ] Validar regras de negócios nas rotas da API
- [ ] Verificar a propriedade nas rotas em vez de nos fluxos de trabalho
- [ ] Verificar manualmente `req.auth_context?.actor_id` quando o middleware já foi aplicado

**Importações:**

- [ ] Usar `await import()` no corpo dos manipuladores de rota
- [ ] Importações dinâmicas para fluxos de trabalho ou módulos

**Acesso a dados:**

- [ ] **CRÍTICO**: Multiplicar preços por 100 ao salvar ou dividir por 100 ao exibir (os preços são armazenados como estão: $49,99 = 49,99)
- [ ] Filtragem por campos de módulos vinculados com `query.graph()` (use `query.index()` ou faça a consulta por outro caminho)
- [ ] Uso de `.filter()` do JavaScript em dados vinculados (use `query.index()` ou consulte a entidade vinculada diretamente)
- [ ] Não utilizar `query.graph()` para recuperação de dados entre módulos
- [ ] Utilizar `query.graph()` quando for necessário filtrar dados em módulos distintos (use `query.index()` em vez disso)

## Validação da implementação

**CRÍTICO: Sempre execute o comando de compilação após concluir a implementação para detectar erros de tipo e problemas de tempo de execução.**

### Quando validar

- Após implementar qualquer novo recurso
- Após fazer alterações em módulos, fluxos de trabalho ou rotas de API
- Antes de marcar tarefas como concluídas
- De forma proativa, sem esperar que o usuário solicite

### Como executar a compilação

Identifique o gerenciador de pacotes e execute o comando apropriado:

```bash
npm run build      # or pnpm build / yarn build
```

### Como lidar com erros de compilação

Se a compilação falhar:

1. Leia as mensagens de erro com atenção
2. Corrija erros de tipo, problemas de importação e erros de sintaxe
3. Execute a compilação novamente para verificar se a correção funcionou
4. NÃO marque a implementação como concluída até que a compilação seja bem-sucedida

**Erros comuns de compilação:**

- Importações ou exportações ausentes
- Incompatibilidades de tipo (por exemplo, ausência do argumento de tipo `MedusaRequest<T>`)
- Composição incorreta do fluxo de trabalho (funções assíncronas, condicionais)

## Próximos passos — Testando sua implementação

**Após implementar um recurso com sucesso, sempre forneça estes próximos passos ao usuário:**

### 1. Inicie o servidor de desenvolvimento

Se o servidor ainda não estiver em execução, inicie-o:

```bash
npm run dev      # or pnpm dev / yarn dev
```

### 2. Acesse o Painel de Administração

Abra seu navegador e acesse:

- **Painel de Administração:** <http://localhost:9000/app>

Faça login com suas credenciais de administrador para testar quaisquer recursos relacionados à administração.

### 3. Testar rotas da API

Se você implementou rotas personalizadas da API, liste-as para que o usuário possa testá-las:

**Rotas de administração (exigem autenticação):**

- `POST http://localhost:9000/admin/[sua-rota]` - Descrição do que ela faz
- `GET http://localhost:9000/admin/[sua-rota]` - Descrição do que ela faz

**Rotas da loja (públicas ou autenticadas pelo cliente):**

- `POST http://localhost:9000/store/[sua-rota]` - Descrição do que ela faz
- `GET http://localhost:9000/store/[sua-rota]` - Descrição do que ela faz

**Exemplo de teste com o cURL:**

```bash
# Admin route (requires authentication)
curl -X POST http://localhost:9000/admin/reviews/123/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"

# Store route
curl -X POST http://localhost:9000/store/reviews \
  -H "Content-Type: application/json" \
  -d '{"product_id": "prod_123", "rating": 5, "comment": "Great product!"}'
```

### 4. Etapas adicionais de teste

Dependendo do que foi implementado, mencione:

- **Fluxos de trabalho:** Teste as operações de mutação e verifique a reversão em caso de erros
- **Assinantes:** Acione eventos e verifique os logs para acompanhar a execução dos assinantes
- **Tarefas agendadas:** Aguarde a execução da tarefa ou verifique os logs para conferir a saída do cron

### Formato para apresentar os próximos passos

Sempre apresente os próximos passos de forma clara e prática após a implementação:

```markdown
## Implementation Complete

The [feature name] has been successfully implemented. Here's how to test it:

### Start the Development Server
[server start command based on package manager]

### Access the Admin Dashboard
Open http://localhost:9000/app in your browser

### Test the API Routes
I've added the following routes:

**Admin Routes:**
- POST /admin/[route] - [description]
- GET /admin/[route] - [description]

**Store Routes:**
- POST /store/[route] - [description]

### What to Test
1. [Specific test case 1]
2. [Specific test case 2]
3. [Specific test case 3]
```

## Como usar

**Para ver padrões e exemplos detalhados, carregue os arquivos de referência:**

```
reference/custom-modules.md    - Creating modules with data models
reference/workflows.md          - Workflow creation and step patterns
reference/api-routes.md         - API route structure and validation
reference/module-links.md       - Linking entities across modules
reference/querying-data.md      - Query patterns and filtering rules
reference/authentication.md     - Protecting routes and accessing users
reference/error-handling.md     - MedusaError types and patterns
reference/scheduled-jobs.md     - Cron jobs and periodic tasks
reference/subscribers-and-events.md - Event handling
reference/troubleshooting.md    - Common errors and solutions
```

Cada arquivo de referência contém:

- Listas de verificação passo a passo para implementação
- Exemplos de código correto e incorreto
- Padrões do TypeScript e segurança de tipos
- Armadilhas comuns e soluções

## Quando usar esta habilidade em comparação com o MedusaDocs MCP Server

**⚠️ IMPORTANTE: Esta habilidade deve ser consultada PRIMEIRO para planejamento e implementação.**

**Use esta habilidade como (FONTE PRINCIPAL):**

- **Planejamento** - Compreender como estruturar os recursos de backend do Medusa
- **Arquitetura** - Padrões de Módulo → Fluxo de Trabalho → Rota de API
- **Melhores práticas** - Padrões de código corretos versus incorretos
- **Regras essenciais** - O que NÃO fazer (erros comuns e antipadrões)
- **Padrões de implementação** - Guias passo a passo com listas de verificação

**Use o servidor MedusaDocs MCP como (FONTE SECUNDÁRIA):**

- Assinaturas específicas de métodos depois que você souber qual método usar
- Opções de configuração integradas aos módulos
- Definições oficiais de tipos
- Detalhes de configuração no nível do framework

**Por que o Skills vem em primeiro lugar:**

- O Skills contém orientações com pontos de vista específicos e antipadrões que o MCP não possui
- O Skills mostra os padrões arquitetônicos necessários para o planejamento
- O MCP é um material de referência; as habilidades são orientações prescritivas

## Integração com aplicativos front-end

**⚠️ CRÍTICO: Os aplicativos front-end DEVEM usar o SDK do Medusa JS para TODAS as solicitações de API**

Ao desenvolver recursos que abrangem o back-end e o front-end:

**Para o Painel de Administração:**

1. **Back-end (esta habilidade):** Módulo → Fluxo de trabalho → Rota da API
2. **Front-end:** Carregue a habilidade `building-admin-dashboard-customizations`
3. **Conexão:**
   - Endpoints integrados: use os métodos existentes do SDK (`sdk.admin.product.list()`)
   - Rotas de API personalizadas: Use `sdk.client.fetch("/admin/my-route")`
   - **NUNCA use o método fetch() padrão** — a falta de cabeçalhos de autenticação causará erros

**Para Storefronts:**

1. **Back-end (esta skill):** Módulo → Fluxo de trabalho → Rota de API
2. **Front-end:** Carregue a habilidade `building-storefronts`
3. **Conexão:**
   - Endpoints integrados: use os métodos existentes do SDK (`sdk.store.product.list()`)
   - Rotas de API personalizadas: use `sdk.client.fetch("/store/my-route")`
   - **NUNCA use o método fetch() comum** — a falta da chave de API publicável causará erros

**Por que o SDK é necessário:**

- As rotas da loja exigem o cabeçalho `x-publishable-api-key`
- As rotas de administração exigem os cabeçalhos `Authorization` e de sessão
- O SDK lida com todos os cabeçalhos necessários automaticamente
- Chamada `fetch()` comum sem cabeçalhos → erros de autenticação/autorização

Consulte as respectivas habilidades de front-end para conhecer os padrões completos de integração.
