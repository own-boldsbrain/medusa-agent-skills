# building-admin-dashboard-customizations

Inventory for `medusa-dev.building-admin-dashboard-customizations`.

**Coverage**: 50.0% (14/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - name: VITE_BACKEND_URL, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 10
  - name: When to Apply, status: inferred
  - name: CRITICAL: Load Reference Files When Needed, status: inferred
  - name: When to Use This Skill vs MedusaDocs MCP Server, status: inferred
  - name: Critical Setup Rules, status: inferred
  - name: Rule Categories by Priority, status: inferred
  - ... e mais 5

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - when: Working with building-admin-dashboard-customizations, i_want: Load automatically when planning, researching, or implementing Medusa Admin dashboard UI (widgets, custom pages, forms, tables, data loading, navigation). REQUIRED for all admin UI work in ALL modes (, so_that: I can implement the feature correctly
  - when: - Creating widgets for product/order/customer pages, i_want: implement this correctly, so_that: the feature works as expected
  - when: Building custom admin pages, i_want: implement this correctly, so_that: the feature works as expected
  - when: Implementing forms and modals, i_want: implement this correctly, so_that: the feature works as expected
  - when: Displaying data with tables or lists, i_want: implement this correctly, so_that: the feature works as expected
  - ... e mais 1

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - use_case_id: UC-001, name: SDK Client Configuration, scenario: **CRITICAL:** Always use exact configuration - different values cause errors:

```tsx
// src/admin/lib/client.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: impor
  - use_case_id: UC-002, name: pnpm Users ONLY, scenario: **CRITICAL:** Install peer dependencies BEFORE writing any code:

```bash
# Find exact version from dashboard
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
# Install that exact
  - use_case_id: UC-003, name: Format for Presenting Next Steps, scenario: Always present next steps in a clear, actionable format after implementation:

```markdown
  - use_case_id: UC-004, name: Start the Development Server, scenario: [command based on package manager]
  - use_case_id: UC-005, name: Access the Admin Dashboard, scenario: Open http://localhost:9000/app in your browser and log in.

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - rule: Always use exact configuration - different values cause errors:, status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - input_name: --depth, type: flag, origin: CLI
  - input_name: VITE_BACKEND_URL, type: env_var, origin: environment

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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Endpoints

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### URLs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - url: http://localhost:9000/app/[route-path, type: reference, status: direct
  - url: http://localhost:9000/app/[your-route-path, type: reference, status: direct
  - url: http://localhost:9000/app, type: reference, status: direct
  - url: http://localhost:9000/admin/products/${product.id}/reviews`, type: reference, status: direct

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
- **Items**: 4
  - operation: READ, status: direct
  - operation: DELETE, status: direct
  - operation: CREATE, status: direct
  - operation: UPDATE, status: direct

### GETs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### POSTs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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
