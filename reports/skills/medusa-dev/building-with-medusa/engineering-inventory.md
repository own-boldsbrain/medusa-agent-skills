# building-with-medusa

Inventory for `medusa-dev.building-with-medusa`.

**Coverage**: 67.9% (19/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: low

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - name: YOUR_SESSION_COOKIE, type: env_var, status: inferred
  - name: YOUR_TOKEN, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 10
  - name: When to Apply, status: inferred
  - name: CRITICAL: Load Reference Files When Needed, status: inferred
  - name: Critical Architecture Pattern, status: inferred
  - name: Rule Categories by Priority, status: inferred
  - name: Quick Reference, status: inferred
  - ... e mais 5

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - when: Working with building-with-medusa, i_want: Load automatically when planning, researching, or implementing ANY Medusa backend features (custom modules, API routes, workflows, data models, module links, business logic). REQUIRED for all Medusa b, so_that: I can implement the feature correctly
  - when: - Creating or modifying custom modules and data models, i_want: implement this correctly, so_that: the feature works as expected
  - when: Implementing workflows for mutations, i_want: implement this correctly, so_that: the feature works as expected
  - when: Building API routes (store or admin), i_want: implement this correctly, so_that: the feature works as expected
  - when: Defining module links between entities, i_want: implement this correctly, so_that: the feature works as expected
  - ... e mais 1

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - use_case_id: UC-001, name: When to Validate, scenario: - After implementing any new feature
- After making changes to modules, workflows, or API routes
- Before marking tasks as complete
- Proactively, without waiting for the user to ask
  - use_case_id: UC-002, name: How to Run Build, scenario: Detect the package manager and run the appropriate command:

```bash
npm run build      # or pnpm build / yarn build
```
  - use_case_id: UC-003, name: Handling Build Errors, scenario: If the build fails:

1. Read the error messages carefully
2. Fix type errors, import issues, and syntax errors
3. Run the build again to verify the fix
4. Do NOT mark implementation as complete until
  - use_case_id: UC-004, name: Format for Presenting Next Steps, scenario: Always present next steps in a clear, actionable format after implementation:

```markdown
  - use_case_id: UC-005, name: Start the Development Server, scenario: [server start command based on package manager]

### Faz / Não Faz

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - input_name: --cookie, type: flag, origin: CLI
  - input_name: YOUR_SESSION_COOKIE, type: env_var, origin: environment
  - input_name: YOUR_TOKEN, type: env_var, origin: environment

### System Outputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - output_name: Markdown file, type: file, format: .md

### Outcomes Esperados

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - outcome: Skill executes correctly, status: inferred

### APIs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - endpoint: admin/[route], method: POST, status: direct
  - endpoint: admin/[route], method: GET, status: direct
  - endpoint: store/[route], method: POST, status: direct

### Endpoints

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - method: POST, path: admin/[route], status: direct
  - method: GET, path: admin/[route], status: direct
  - method: POST, path: store/[route], status: direct

### URLs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - url: http://localhost:9000/store/reviews, type: reference, status: direct
  - url: http://localhost:9000/app, type: reference, status: direct
  - url: http://localhost:9000/admin/reviews/123/approve, type: reference, status: direct
  - url: http://localhost:9000/admin/[your-route, type: reference, status: direct
  - url: http://localhost:9000/store/[your-route, type: reference, status: direct

### Conectores

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - connector_name: sdk.store.product, type: sdk_call, status: inferred
  - connector_name: sdk.admin.product, type: sdk_call, status: inferred
  - connector_name: sdk.client.fetch, type: sdk_call, status: inferred

### CRUD

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - operation: READ, status: direct
  - operation: UPDATE, status: direct
  - operation: APPROVE, status: direct
  - operation: DELETE, status: direct
  - operation: CREATE, status: direct

### GETs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - method: GET, path: admin/[route], status: direct

### POSTs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - method: POST, path: admin/[route], status: direct
  - method: POST, path: store/[route], status: direct

### CREATE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: CREATE, status: inferred

### UPDATE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: UPDATE, status: inferred

### APPROVE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: APPROVE, status: inferred

### REJECT

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### DELETE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: DELETE, status: inferred

### Bancos de dados

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Schemas

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - schema: // ✅ CORRECT
const myWorkflow = createWorkflow(
  "name",
  function (input) { // Regular function, not async, not arrow
    const result = myStep(input) // No await
    return new WorkflowResponse(re, lang: typescript, status: inferred

### Relacionamentos

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Datasets

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### JSON files

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Tabelas

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Lógicas

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Cálculos

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0
