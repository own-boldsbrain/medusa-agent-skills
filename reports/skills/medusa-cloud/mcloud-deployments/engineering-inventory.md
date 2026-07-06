# mcloud-deployments

Inventory for `medusa-cloud.mcloud-deployments`.

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
- **Items**: 4
  - name: Constraints, status: inferred
  - name: Commands, status: inferred
  - name: Deployment Statuses, status: inferred
  - name: Examples, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-deployments, i_want: Execute mcloud deployments commands to list deployments, retrieve deployment details, and fetch build logs. Use when listing deployments, checking deployment status, or reading build output for debugg, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - use_case_id: UC-001, name: deployments list, scenario: List recent deployments for a project (default: 20 most recent across all environments).

```bash
mcloud deployments list --organization <org-id> --project <project-id-or-handle> --json
```

**Options

- use_case_id: UC-002, name: deployments get, scenario: Retrieve a single deployment's details by ID.

```bash
mcloud deployments get <deployment-id> --organization <org-id> --project <project-id-or-handle> --json
```

**Arguments:**

- `deployment` — Depl

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - rule: Always pass `--json` when parsing output — plaintext format may change., status: direct
  - rule: Always confirm context (`mcloud whoami --json`) before running commands if org/project are not already known., status: direct
  - rule: Use `--deployment` IDs in the format `depl_*` or build IDs; build IDs resolve to their latest deployment automatically., status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - input_name: --commit, type: flag, origin: CLI
  - input_name: --environment, type: flag, origin: CLI
  - input_name: --json, type: flag, origin: CLI
  - input_name: --organization, type: flag, origin: CLI
  - input_name: --project, type: flag, origin: CLI
  - ... e mais 1

### System Outputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - output_name: JSON response, type: json, format: stdout

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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### CRUD

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - operation: READ, status: direct
  - operation: UPDATE, status: direct
  - operation: APPROVE, status: direct
  - operation: REJECT, status: direct
  - operation: CREATE, status: direct

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

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: APPROVE, status: inferred

### REJECT

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: REJECT, status: inferred

### DELETE

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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
