---
name: building-with-medusa
description: Carregar automaticamente ao planejar, pesquisar ou implementar QUALQUER recurso de backend do Medusa (módulos personalizados, rotas de API, fluxos de trabalho, modelos de dados, links de módulos, lógica de negócios). OBRIGATÓRIO para todo trabalho de backend do Medusa em TODOS os modos (planejamento, implementação, exploração). Contém padrões arquiteturais, melhores práticas e regras críticas que os servidores MCP não fornecem.
---

# Desenvolvimento de Backend da Medusa

Guia completo de desenvolvimento backend para aplicações Medusa. Contém padrões em 6 categorias que abrangem arquitetura, segurança de tipos, posicionamento da lógica de negócios e armadilhas comuns.

## Quando Aplicar

**Carregue esta habilidade para QUALQUER tarefa de desenvolvimento backend, incluindo:**

- Criando ou modificando módulos personalizados e modelos de dados
- Implementando fluxos de trabalho para mutações
- Construindo rotas de API (loja ou admin)
- Definindo links de módulo entre entidades
- Escrivendo lógica de negócios ou validação
- Consultando dados entre módulos
- Implementando autenticação/autorização

**Também carregue essas habilidades quando:**

- **building-admin-dashboard-customizações:** Construindo interface de administração UI (widgets, páginas, formulários)
- **building-storefronts:** Chamando rotas de backend da API a partir de vitrines (integração de SDK)

## CRÍTICO: Carregar Arquivos de Referência Quando Necessário

**A referência rápida abaixo NÃO é suficiente para a implementação.** Você DEVE carregar os arquivos de referência relevantes antes de escrever o código para esse componente.

**Carregue essas referências com base no que você está implementando:**

- **Criando um módulo?** → DEVE carregar `reference/custom-modules.md` primeiro
- **Criando fluxos de trabalho?** → DEVE carregar `reference/workflows.md` primeiro
- **Criando rotas de API?** → DEVE carregar `reference/api-routes.md` primeiro
- **Criando links de módulo?** → É MANDATÓRIO carregar `reference/module-links.md` primeiro
- **Consultando dados?** → DEVE carregar `reference/querying-data.md` primeiro
- **Adicionando autenticação?** → DEVE carregar `reference/authentication.md` primeiro

**Requisito mínimo:** Carregue pelo menos 1-2 arquivos de referência relevantes para a sua tarefa específica antes de implementar.

## Padrão de Arquitetura Crítica

**SEMPRE siga este fluxo - nunca pule camadas:**

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

- Apenas métodos GET, POST, DELETE (nunca PUT/PATCH)
- Fluxos de trabalho são necessários para TODAS as mutações
- A lógica de negócios pertence às etapas do fluxo de trabalho, NÃO às rotas.
- Faça a consulta com `query.graph()` para recuperação de dados entre módulos.
- Consulta com `query.index()` (Módulo de Índice) para filtrar entre módulos separados com links
- Links de módulo mantêm isolamento entre módulos

## Regras por Categoria de Prioridade

| Prioridade | Categoria | **Impacto** | Prefixo |
|----------|----------|--------|--------|
| 1 | Violações de Arquitetura | CRÍTICO | `arch-` |
| 2 | Segurança de Tipos | CRÍTICO | `type-` |
| 3 | Colocação da Lógica de Negócio | ALTO | `lógica-` |
| 4 | Importação e Organização de Código | **ALTO** | `import-` |
| 5 | Padrões de Acesso a Dados | MEDIUM (inclui a regra de preço CRÍTICO) | `data-` |
| 6 | Organização de Arquivos | MÉDUM

**Nota:** Não consegui encontrar informações sobre a palavra "MEDIUM" em português. O resultado pode ser um termo mais comum ou uma tradução literal. | `file-` |

## Referência Rápida

### 1. Violações de Arquitetura (CRÍTICO)

- `arch-workflow-required` - Utilize fluxos de trabalho para TODAS as mutações, nunca chame serviços de módulos a partir de rotas
- `arch-layer-bypass` - Nunca contorne as camadas (rota → serviço sem fluxo de trabalho)
- `arch-http-métodos` - Use apenas GET, POST, DELETE (nunca PUT/PATCH)
- `arch-module-isolation` - Use links de módulo, não chamadas diretas de serviço entre módulos
- `arch-query-config-fields` - Não defina campos explícitos `fields` ao usar `req.queryConfig`

### 2. Segurança de Tipo (CRÍTICO)

- `type-request-schema` - Passe o tipo inferido pelo Zod para `MedusaRequest<T>` ao usar `req.validatedBody`
- `type-authenticated-request` - Use `SolicitaçãoAutenticadaMedusaRequest` para rotas protegidas (não `MedusaRequest`)
- `type-export-schema` - Exporta tanto o esquema Zod QUANTO o tipo inferido dos middlewares
- `type-linkable-auto` - Nunca adicione `.linkable()` aos modelos de dados (adicionado automaticamente)
- `type-module-name-camelcase` - Os nomes dos módulos DEVEM estar em camelCase, nunca use traços (causa erros de execução)

### 3. Localização da Lógica de Negócios (ALTA)

- `logic-workflow-validation` - Coloque validações de negócio nos passos do fluxo de trabalho, não nas rotas da API
- `logic-ownership-checks` - Validar propriedade/permissões em fluxos de trabalho, não em rotas
- `logic-module-service` - Mantenha os módulos simples (apenas CRUD), coloque a lógica nos fluxos de trabalho

### 4. Importação & Organização do Código (ALTA)

- `import-top-level` - Importe fluxos de trabalho/módulos no topo do arquivo, nunca use `await import()` no corpo da rota
- `import-static-only` - Use importações estáticas para todas as dependências
- `import-no-dynamic-routes` - Importações dinâmicas adicionam sobrecarga e quebram a verificação de tipos

### 5. Padrões de Acesso a Dados (MÉDIO)

- `data-price-format` - **CRÍTICO**: Os preços são armazenados como estão no Medusa (49.99 armazenado como 49.99, NÃO em centavos). Nunca multiplique por 100 ao salvar ou divida por 100 ao exibir.
- `data-query-method` - Use `query.graph()` para recuperar dados; use `query.index()` (Módulo de Índice) para filtrar entre módulos vinculados
- `data-query-graph` - Utilize `query.graph()` para consultas transmodulares com notação ponto (sem filtragem transmodular)
- `data-query-index` - Use `query.index()` quando filtrar por propriedades de modelos de dados vinculados em módulos separados
- `data-list-e-contagem` - Use `listAndCount` para consultas paginadas de módulo único
- `data-linked-filtering` - `query.graph()` não pode filtrar por campos de módulos vinculados - use `query.index()` ou faça a consulta diretamente daquela entidade
- `data-no-js-filter` - Não use JavaScript `.filter()` em dados vinculados - utilize filtros de banco de dados (`query.index()` ou consulte a entidade)
- `data-same-module-ok` - Pode filtrar por relações de mesmo módulo com `query.graph()` (por exemplo, product.variants)

- ```markdown

`data-auth-middleware` - Confie no middleware `authenticate`, não verifique manualmente `req.auth_context`

```

### 6. Organização de Arquivos (MÉDIO)

- `file-workflow-steps` - Recomendado: Crie os passos em `src/workflows/steps/[name].ts`
- `file-workflow-composition` - Funções de composição em `src/workflows/[name].ts`
- `file-middleware-exports` - Exporta esquemas e tipos de dados de arquivos de middleware
- `file-links-directory` - Defina os links do módulo em `src/links/[name].ts`

## Regras de Composição de Fluxo de Trabalho

**A função de fluxo de trabalho tem restrições críticas:**

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

- No async/await (runs at load time)
- Sem funções de seta (use `function`)
- Nenhum condicional/ternário (utilize `when()`)
- Não há manipulação de variáveis (use `transform()`)
- Nenhuma data de criação (use `transform()`)
- Múltiplas chamadas de etapas precisam de `.config({ name: "unique-name" })` para evitar conflitos

## Lista de Verificação de Erros Comuns

Antes de implementar, verifique se você NÃO está fazendo o seguinte:

**Arquitetura:**

- [ ] Chamando serviços de módulos diretamente das rotas da API
- [ ] Usando métodos PUT ou PATCH
- [ ] Ignorando fluxos de trabalho para mutações
- [ ] Definindo `fields` explicitamente com `req.queryConfig`
- [ ] Pular migrações após criar links do módulo

**Segurança de Tipos:**

- [ ] Esquecendo o argumento de tipo `MedusaRequest<SchemaType>`
- [ ] Usando `MedusaRequest` em vez de `AuthenticatedMedusaRequest` para rotas protegidas
- [ ] Não exportando o tipo inferido do Zod a partir dos middlewares
- [ ] Adicionando `.linkable()` aos modelos de dados
- [ ] Usando traços em nomes de módulos (devem estar em camelCase)

**Lógica de Negócios:**

- [ ] Validando regras de negócio em rotas de API
- [ ] Verificando propriedade em rotas em vez de fluxos de trabalho
- [ ] Verificar manualmente `req.auth_context?.actor_id` quando o middleware já foi aplicado

**Importações:**

- [ ] Using `await import()` in route handler bodies
- [ ] Importações dinâmicas para fluxos de trabalho ou módulos

**Acesso a Dados:**

- [ ] **CRÍTICO**: Multiplicar os preços por 100 ao salvar ou dividir por 100 ao exibir (os preços são armazenados como estão: $49.99 = 49.99)
- [ ] Filtrando por campos de módulo vinculado com `query.graph()` (use `query.index()` ou consulta do outro lado em vez disso)
- [ ] Usando JavaScript `.filter()` em dados vinculados (use `query.index()` ou consulte a entidade vinculada diretamente)
- [ ] Não usar `query.graph()` para recuperação de dados entre módulos
- [ ] Usar `query.graph()` quando precisar filtrar entre módulos separados (use `query.index()` em vez disso)

## Validando Implementação

**CRÍTICO: Sempre execute o comando de build após concluir a implementação para detectar erros de tipo e problemas de tempo de execução.**

### Quando validar

- Após implementar qualquer nova funcionalidade
- Após fazer alterações em módulos, fluxos de trabalho ou rotas da API
- Antes de marcar tarefas como concluídas
- Proativamente, sem esperar que o usuário peça

### Como Executar a Compilação

Detecte o gerenciador de pacotes e execute o comando apropriado:

```bash
npm run build      # or pnpm build / yarn build
```

### Handling Build Errors

If the build fails:

1. Leia as mensagens de erro com atenção
2. Fix type errors, import issues, and syntax errors
3. Run the build again to verify the fix
4. Do NOT mark implementation as complete until build succeeds

**Common build errors:**

- Missing imports or exports
- Incompatibilidades de tipo (por exemplo, argumento de tipo `MedusaRequest<T>` ausente)
- Incorrect workflow composition (async functions, conditionals)

## Próximos Passos - Testando Sua Implementação

**After successfully implementing a feature, always provide these next steps to the user:**

### 1. Inicie o Servidor de Desenvolvimento

Se o servidor não estiver sendo executado, inicie-o:

```bash
npm run dev      # or pnpm dev / yarn dev
```

### 2. Access the Admin Dashboard

Abra seu navegador e navegue para:

- **Admin Dashboard:** <http://localhost:9000/app>

Log in with your admin credentials to test any admin-related features.

### 3. Testar Rotas da API

If you implemented custom API routes, list them for the user to test:

**Admin Routes (require authentication):**

- `POST http://localhost:9000/admin/[your-route]` - Descrição do que isso faz
- `GET http://localhost:9000/admin/[your-route]` - Description of what it does

**Store Routes (public or customer-authenticated):**

- `POST http://localhost:9000/store/[your-route]` - Description of what it does
- `GET http://localhost:9000/store/[your-route]` - Description of what it does

**Testing with cURL example:**

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

### 4. Additional Testing Steps

Depending on what was implemented, mention:

- **Workflows:** Test mutation operations and verify rollback on errors
- **Assinantes:** Disparar eventos e verificar logs para a execução do assinante
- **Scheduled jobs:** Wait for job execution or check logs for cron output

### Formato para Apresentar os Próximos Passos

Always present next steps in a clear, actionable format after implementation:

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

## Como Usar

**For detailed patterns and examples, load reference files:**

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

- Step-by-step implementation checklists
- Correct vs incorrect code examples
- TypeScript patterns and type safety
- Common pitfalls and solutions

## Quando Usar Esta Habilidade vs Servidor MedusaDocs MCP

**⚠️ CRITICAL: This skill should be consulted FIRST for planning and implementation.**

**Use this skill for (PRIMARY SOURCE):**

- **Planning** - Understanding how to structure Medusa backend features
- **Architecture** - Module → Workflow → API Route patterns
- **Melhores práticas** - Padrões de código corretos vs incorretos
- **Regras críticas** - O que NÃO fazer (erros comuns e antipadrões)
- **Implementation patterns** - Step-by-step guides with checklists

**Use MedusaDocs MCP server for (SECONDARY SOURCE):**

- Specific method signatures after you know which method to use
- Opções de configuração de módulos integrados
- Official type definitions
- Detalhes de configuração no nível do framework

**Por que habilidades vêm em primeiro lugar:**

- Skills contain opinionated guidance and anti-patterns MCP doesn't have
- Habilidades mostram padrões arquiteturais necessários para o planejamento
- MCP é material de referência; habilidades são orientação prescritiva

## Integração com Aplicações Frontend

**⚠️ CRÍTICO: Aplicativos de interface do usuário DEVEM utilizar a SDK JS Medusa para TODAS as solicitações de API**

Quando construir recursos que abrangem backend e frontend:

**Para o Painel de Administração:**

1. **Backend (essa habilidade):** Módulo → Fluxo de Trabalho → Rotas da API
2. **Frontend:** Carregar a habilidade `building-admin-dashboard-customizations`
3. **Conexão:**
   - Pontos de extremidade incorporados: Use os métodos SDK existentes (`sdk.admin.product.list()`)
   - Rotas da API personalizadas: Use `sdk.client.fetch("/admin/minha-rota")`
   - **NUNCA use o fetch() regular** - cabeçalhos de autenticação ausentes causarão erros

**Para vitrines:**

1. **Backend (esta habilidade):** Módulo → Fluxo de Trabalho → Rota de API
2. **Frontend:** Carregar a habilidade `building-storefronts`
3. **Conexão:**
   - Pontos de extremidade embutidos: Utilize métodos de SDK existentes (`sdk.store.product.list()`)
   - Rotas de API personalizadas: Use `sdk.client.fetch("/store/my-route")`
   - **NUNCA use a fetch() regular** - uma chave API publicável ausente causará erros

**Why the SDK is required:**

- As rotas da loja precisam do cabeçalho `x-publishable-api-key`
- Rotas de administração precisam de `Autorização` e cabeçalhos de sessão
- SDK handles all required headers automatically
- Regular fetch() without headers → authentication/authorization errors

Veja as habilidades de frontend respectivas para padrões de integração completos.
