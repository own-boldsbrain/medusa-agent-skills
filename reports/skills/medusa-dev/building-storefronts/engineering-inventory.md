# building-storefronts

Inventory for `medusa-dev.building-storefronts`.

**Coverage**: 42.9% (12/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 9
  - name: When to Apply, status: inferred
  - name: CRITICAL: Load Reference Files When Needed, status: inferred
  - name: Rule Categories by Priority, status: inferred
  - name: Quick Reference, status: inferred
  - name: Critical SDK Pattern, status: inferred
  - ... e mais 4

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - when: Working with building-storefronts, i_want: Load automatically when planning, researching, or implementing Medusa storefront features (calling custom API routes, SDK integration, React Query patterns, data fetching). REQUIRED for all storefront, so_that: I can implement the feature correctly
  - when: - Calling custom Medusa API routes from the storefront, i_want: implement this correctly, so_that: the feature works as expected
  - when: Integrating Medusa SDK in frontend applications, i_want: implement this correctly, so_that: the feature works as expected
  - when: Using React Query for data fetching, i_want: implement this correctly, so_that: the feature works as expected
  - when: Implementing mutations with optimistic updates, i_want: implement this correctly, so_that: the feature works as expected
  - ... e mais 1

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - use_case_id: UC-002, name: When to Apply, scenario: See SKILL.md
  - use_case_id: UC-003, name: CRITICAL: Load Reference Files When Needed, scenario: See SKILL.md
  - use_case_id: UC-004, name: Rule Categories by Priority, scenario: See SKILL.md
  - use_case_id: UC-005, name: Quick Reference, scenario: See SKILL.md

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 14
  - rule: - [ ] Using regular fetch() instead of the Medusa JS SDK (causes missing header errors), status: direct
  - rule: [ ] Not using existing SDK methods for built-in endpoints (e.g., using sdk.client.fetch("/store/products") instead of sdk.store.product.list()), status: direct
  - rule: [ ] Using JSON.stringify() on the body parameter, status: direct
  - rule: [ ] Manually setting Content-Type headers (SDK adds them), status: direct
  - rule: [ ] Hardcoding SDK import paths (locate in project first), status: direct
  - ... e mais 9

### User Inputs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Conectores

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - connector_name: sdk.client.fetch, type: sdk_call, status: inferred
  - connector_name: sdk.admin.order, type: sdk_call, status: inferred
  - connector_name: sdk.store.product, type: sdk_call, status: inferred

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

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - schema: // ✅ CORRECT - Plain object
await sdk.client.fetch("/store/reviews", {
  method: "POST",
  body: {
    product_id: "prod_123",
    rating: 5,
  }
})

// ❌ WRONG - JSON.stringify breaks the request
awa, lang: typescript, status: inferred

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
