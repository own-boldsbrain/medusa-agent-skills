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
- Escrevendo lógica de negócios ou validação
- Consultando dados entre módulos
- Implementando autenticação/autorização

**Também carregue essas habilidades quando:**

- **building-admin-dashboard-customizations:** Construindo interface de administração UI (widgets, páginas, formulários)
- **building-storefronts:** Chamando rotas de backend da API a partir de vitrines (integração de SDK)

## CRÍTICO: Carregar Arquivos de Referência Quando Necessário

**A referência rápida abaixo NÃO é suficiente para a implementação.** Você DEVE carregar os arquivos de referência relevantes antes de escrever o código para esse componente.

**Carregue essas referências com base no que você está implementando:**

- **Criando um módulo?** → DEVE carregar `reference/custom-modules.md` primeiro
- **Criando fluxos de trabalho?** → DEVE carregar `reference/workflows.md` primeiro
- **Criando rotas de API?** → DEVE carregar `reference/api-routes.md` primeiro
- **Criando links de módulo?** → DEVE carregar `reference/module-links.md` primeiro
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
- A lógica de negócios pertence às etapas do fluxo de trabalho, NÃO às rotas
- Faça a consulta com `query.graph()` para recuperação de dados entre módulos
- Consulta com `query.index()` (Módulo de Índice) para filtrar entre módulos separados com links
- Links de módulo mantêm isolamento entre módulos

## Regras por Categoria de Prioridade

| Prioridade | Categoria | Impacto | Prefixo |
|----------|----------|--------|--------|
| 1 | Violações de Arquitetura | CRÍTICO | `arch-` |
| 2 | Segurança de Tipos | CRÍTICO | `type-` |
| 3 | Colocação da Lógica de Negócios | ALTO | `logic-` |
| 4 | Importação e Organização de Código | ALTO | `import-` |
| 5 | Padrões de Acesso a Dados | MÉDIO (inclui a regra de preço CRÍTICA) | `data-` |
| 6 | Organização de Arquivos | MÉDIO | `file-` |

## Referência Rápida

### 1. Violações de Arquitetura (CRÍTICO)

- `arch-workflow-required` - Utilize fluxos de trabalho para TODAS as mutações, nunca chame serviços de módulos a partir de rotas
- `arch-layer-bypass` - Nunca contorne as camadas (rota → serviço sem fluxo de trabalho)
- `arch-http-methods` - Use apenas GET, POST, DELETE (nunca PUT/PATCH)
- `arch-module-isolation` - Use links de módulo, não chamadas diretas de serviço entre módulos
- `arch-query-config-fields` - Não defina campos explícitos `fields` ao usar `req.queryConfig`

### 2. Segurança de Tipos (CRÍTICO)

- `type-request-schema` - Passe o tipo inferido pelo Zod para `MedusaRequest<T>` ao usar `req.validatedBody`
- `type-authenticated-request` - Use `AuthenticatedMedusaRequest` para rotas protegidas (não `MedusaRequest`)
- `type-export-schema` - Exporte tanto o esquema Zod QUANTO o tipo inferido dos middlewares
- `type-linkable-auto` - Nunca adicione `.linkable()` aos modelos de dados (adicionado automaticamente)
- `type-module-name-camelcase` - Os nomes dos módulos DEVEM estar em camelCase, nunca use traços (causa erros de execução)

### 3. Colocação da Lógica de Negócios (ALTO)

- `logic-workflow-validation` - Coloque validações de negócio nos passos do fluxo de trabalho, não nas rotas da API
- `logic-ownership-checks` - Valide propriedade/permissões em fluxos de trabalho, não em rotas
- `logic-module-service` - Mantenha os módulos simples (apenas CRUD), coloque a lógica nos fluxos de trabalho

### 4. Importação e Organização de Código (ALTO)

- `import-top-level` - Importe fluxos de trabalho/módulos no topo do arquivo, nunca use `await import()` no corpo da rota
- `import-static-only` - Use importações estáticas para todas as dependências
- `import-no-dynamic-routes` - Importações dinâmicas adicionam sobrecarga e quebram a verificação de tipos

### 5. Padrões de Acesso a Dados (MÉDIO)

- `data-price-format` - **CRÍTICO**: Os preços são armazenados como estão no Medusa (49.99 armazenado como 49.99, NÃO em centavos). Nunca multiplique por 100 ao salvar ou divida por 100 ao exibir
- `data-query-method` - Use `query.graph()` para recuperar dados; use `query.index()` (Módulo de Índice) para filtrar entre módulos vinculados
- `data-query-graph` - Utilize `query.graph()` para consultas transmodulares com notação ponto (sem filtragem transmodular)
- `data-query-index` - Use `query.index()` quando filtrar por propriedades de modelos de dados vinculados em módulos separados
- `data-list-and-count` - Use `listAndCount` para consultas paginadas de módulo único
- `data-linked-filtering` - `query.graph()` não pode filtrar por campos de módulos vinculados - use `query.index()` ou consulte a entidade diretamente
- `data-no-js-filter` - Não use JavaScript `.filter()` em dados vinculados - utilize filtros de banco de dados (`query.index()` ou consulte a entidade)
- `data-same-module-ok` - Pode filtrar por relações do mesmo módulo com `query.graph()` (por exemplo, product.variants)
- `data-auth-middleware` - Confie no middleware `authenticate`, não verifique manualmente `req.auth_context`

### 6. Organização de Arquivos (MÉDIO)

- `file-workflow-steps` - Recomendado: Crie os passos em `src/workflows/steps/[name].ts`
- `file-workflow-composition` - Funções de composição em `src/workflows/[name].ts`
- `file-middleware-exports` - Exporte esquemas e tipos de arquivos de middleware
- `file-links-directory` - Defina os links do módulo em `src/links/[name].ts`

## Regras de Composição de Fluxo de Trabalho

**A função de fluxo de trabalho tem restrições críticas:**

```typescript
// ✅ CORRETO
const myWorkflow = createWorkflow(
  "name",
  function (input) { // Função regular, sem async, sem arrow functions
    const result = myStep(input) // Sem await
    return new WorkflowResponse(result)
  }
)

// ❌ INCORRETO
const myWorkflow = createWorkflow(
  "name",
  async (input) => { // ❌ Sem async, sem arrow functions
    const result = await myStep(input) // ❌ Sem await
    if (input.condition) { /* ... */ } // ❌ Sem condicionais
    return new WorkflowResponse(result)
  }
)
```

**Restrições:**

- Sem async/await (é executado no momento do carregamento)
- Sem arrow functions (use `function`)
- Sem condicionais/ternários (use `when()`)
- Sem manipulação de variáveis (use `transform()`)
- Sem criação de data (use `transform()`)
- Múltiplas chamadas de passos precisam de `.config({ name: "unique-name" })` para evitar conflitos

## Lista de Verificação de Erros Comuns

Antes de implementar, verifique se você NÃO está fazendo o seguinte:

**Arquitetura:**

- [ ] Chamando serviços de módulos diretamente das rotas da API
- [ ] Usando métodos PUT ou PATCH
- [ ] Ignorando fluxos de trabalho para mutações
- [ ] Definindo `fields` explicitamente com `req.queryConfig`
- [ ] Ignorando migrações após criar links do módulo

**Segurança de Tipos:**

- [ ] Esquecendo o argumento de tipo `MedusaRequest<SchemaType>`
- [ ] Usando `MedusaRequest` em vez de `AuthenticatedMedusaRequest` para rotas protegidas
- [ ] Não exportando o tipo inferido do Zod a partir dos middlewares
- [ ] Adicionando `.linkable()` aos modelos de dados
- [ ] Usando traços em nomes de módulos (devem estar em camelCase)

**Lógica de Negócios:**

- [ ] Validando regras de negócio em rotas de API
- [ ] Verificando propriedade nas rotas em vez de fluxos de trabalho
- [ ] Verificando manualmente `req.auth_context?.actor_id` quando o middleware já foi aplicado

**Importações:**

- [ ] Usando `await import()` no corpo do handler da rota
- [ ] Importações dinâmicas para fluxos de trabalho ou módulos

**Acesso a Dados:**

- [ ] **CRÍTICO**: Multiplicar os preços por 100 ao salvar ou dividir por 100 ao exibir (os preços são armazenados como estão: $49.99 = 49.99)
- [ ] Filtrando por campos de módulo vinculado com `query.graph()` (use `query.index()` ou consulte o outro lado em vez disso)
- [ ] Usando JavaScript `.filter()` em dados vinculados (use `query.index()` ou consulte a entidade vinculada diretamente)
- [ ] Não usar `query.graph()` para recuperação de dados entre módulos
- [ ] Usar `query.graph()` quando precisar filtrar entre módulos separados (use `query.index()` em vez disso)

## Validando Implementação

**CRÍTICO: Sempre execute o comando de build após concluir a implementação para detectar erros de tipo e problemas em tempo de execução.**

### Quando Validar

- Após implementar qualquer nova funcionalidade
- Após fazer alterações em módulos, fluxos de trabalho ou rotas da API
- Antes de marcar tarefas como concluídas
- Proativamente, sem esperar que o usuário peça

### Como Executar o Build

Detecte o gerenciador de pacotes e execute o comando apropriado:

```bash
npm run build      # ou pnpm build / yarn build
```

### Lidando com Erros de Build

Se o build falhar:

1. Leia as mensagens de erro com atenção
2. Corrija erros de tipo, problemas de importação e erros de sintaxe
3. Execute o build novamente para verificar a correção
4. NÃO marque a implementação como concluída até que o build seja bem-sucedido

**Erros comuns de build:**

- Importações ou exportações ausentes
- Incompatibilidades de tipo (por exemplo, argumento de tipo `MedusaRequest<T>` ausente)
- Composição incorreta do fluxo de trabalho (funções assíncronas, condicionais)

## Próximos Passos - Testando Sua Implementação

**Após implementar um recurso com sucesso, sempre forneça estes próximos passos para o usuário:**

### 1. Inicie o Servidor de Desenvolvimento

Se o servidor não estiver rodando, inicie-o:

```bash
npm run dev      # ou pnpm dev / yarn dev
```

### 2. Acesse o Admin Dashboard

Abra seu navegador e navegue para:

- **Admin Dashboard:** <http://localhost:9000/app>

Faça o login com suas credenciais de administrador para testar quaisquer recursos relacionados ao painel de controle.

### 3. Testar Rotas da API

Se você implementou rotas da API personalizadas, liste-as para o usuário testar:

**Rotas de Admin (exigem autenticação):**

- `POST http://localhost:9000/admin/[your-route]` - Descrição do que a rota faz
- `GET http://localhost:9000/admin/[your-route]` - Descrição do que a rota faz

**Rotas da Loja (públicas ou autenticadas pelo cliente):**

- `POST http://localhost:9000/store/[your-route]` - Descrição do que a rota faz
- `GET http://localhost:9000/store/[your-route]` - Descrição do que a rota faz

**Exemplo de teste com cURL:**

```bash
# Rota de admin (exige autenticação)
curl -X POST http://localhost:9000/admin/reviews/123/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"

# Rota da loja
curl -X POST http://localhost:9000/store/reviews \
  -H "Content-Type: application/json" \
  -d '{"product_id": "prod_123", "rating": 5, "comment": "Great product!"}'
```

### 4. Passos Adicionais de Teste

Dependendo do que foi implementado, mencione:

- **Fluxos de Trabalho:** Teste as operações de mutação e verifique o rollback em erros
- **Subscribers:** Acione eventos e verifique os logs para a execução do assinante
- **Jobs Agendados:** Aguarde a execução da tarefa ou verifique os logs para a saída do cron

### Formato para Apresentar os Próximos Passos

Sempre apresente os próximos passos em um formato claro e acionável após a implementação:

```markdown
## Implementação Concluída

O [nome do recurso] foi implementado com sucesso. Veja como testar:

### Inicie o Servidor de Desenvolvimento
[comando de start do servidor baseado no gerenciador de pacotes]

### Acesse o Admin Dashboard
Abra http://localhost:9000/app em seu navegador

### Teste as Rotas da API
Adicionei as seguintes rotas:

**Rotas de Admin:**
- POST /admin/[route] - [descrição]
- GET /admin/[route] - [descrição]

**Rotas da Loja:**
- POST /store/[route] - [descrição]

### O Que Testar
1. [Caso de teste específico 1]
2. [Caso de teste específico 2]
3. [Caso de teste específico 3]
```

## Como Usar

**Para padrões e exemplos detalhados, carregue os arquivos de referência:**

```
reference/custom-modules.md    - Criando módulos com data models
reference/workflows.md          - Criação de fluxo de trabalho e padrões de passos
reference/api-routes.md         - Estrutura e validação de rotas da API
reference/module-links.md       - Vinculando entidades através de módulos
reference/querying-data.md      - Padrões de consulta e regras de filtragem
reference/authentication.md     - Protegendo rotas e acessando usuários
reference/error-handling.md     - Tipos e padrões de MedusaError
reference/scheduled-jobs.md     - Trabalhos cron e tarefas periódicas
reference/subscribers-and-events.md - Manipulação de eventos
reference/troubleshooting.md    - Erros comuns e soluções
```

Cada arquivo de referência contém:

- Checklists de implementação passo-a-passo
- Exemplos de código corretos vs incorretos
- Padrões TypeScript e segurança de tipos
- Armadilhas comuns e soluções

## Quando Usar Esta Habilidade vs Servidor MedusaDocs MCP

**⚠️ CRÍTICO: Esta habilidade deve ser consultada PRIMEIRO para planejamento e implementação.**

**Use esta habilidade para (FONTE PRIMÁRIA):**

- **Planejamento** - Entendendo como estruturar os recursos de backend do Medusa
- **Arquitetura** - Padrões de Módulo → Fluxo de Trabalho → Rota da API
- **Melhores práticas** - Padrões de código corretos vs incorretos
- **Regras críticas** - O que NÃO fazer (erros comuns e anti-padrões)
- **Padrões de implementação** - Guias passo a passo com listas de verificação

**Use o servidor MedusaDocs MCP para (FONTE SECUNDÁRIA):**

- Assinaturas de métodos específicos após você saber qual método usar
- Opções de configuração de módulos integrados
- Definições de tipo oficiais
- Detalhes de configuração no nível do framework

**Por que as habilidades vêm em primeiro lugar:**

- As habilidades contêm orientações opinativas e anti-padrões que o MCP não tem
- As habilidades mostram padrões arquiteturais necessários para o planejamento
- MCP é material de referência; habilidades são orientação prescritiva

## Integração com Aplicações Frontend

**⚠️ CRÍTICO: Aplicativos frontend DEVEM utilizar o Medusa JS SDK para TODAS as solicitações de API**

Quando construir recursos que abrangem backend e frontend:

**Para o Painel de Administração:**

1. **Backend (esta habilidade):** Módulo → Fluxo de Trabalho → Rota da API
2. **Frontend:** Carregar a habilidade `building-admin-dashboard-customizations`
3. **Conexão:**
   - Endpoints embutidos: Use os métodos SDK existentes (`sdk.admin.product.list()`)
   - Rotas da API personalizadas: Use `sdk.client.fetch("/admin/minha-rota")`
   - **NUNCA use o fetch() regular** - cabeçalhos de autenticação ausentes causarão erros

**Para vitrines:**

1. **Backend (esta habilidade):** Módulo → Fluxo de Trabalho → Rota de API
2. **Frontend:** Carregar a habilidade `building-storefronts`
3. **Conexão:**
   - Endpoints embutidos: Utilize os métodos do SDK existentes (`sdk.store.product.list()`)
   - Rotas da API personalizadas: Use `sdk.client.fetch("/store/my-route")`
   - **NUNCA use o fetch() regular** - uma chave API publicável ausente causará erros

**Por que o SDK é obrigatório:**

- As rotas da loja precisam do cabeçalho `x-publishable-api-key`
- As rotas de administração precisam de `Authorization` e cabeçalhos de sessão
- O SDK gerencia todos os cabeçalhos necessários automaticamente
- Chamadas fetch() regulares sem cabeçalhos → erros de autenticação/autorização

Veja as respectivas habilidades de frontend para padrões de integração completos.