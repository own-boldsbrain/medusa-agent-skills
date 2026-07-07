# mcloud-organizations

Inventory for `medusa-cloud.mcloud-organizations`.

**Coverage**: 35.7% (10/28 blocks with items)
**Evidence Level**: inferred
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - name: MCLOUD_TOKEN, type: env_var, status: inferred
  - name: ORGANIZATION_ID, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - name: Constraints, status: inferred
  - name: Commands, status: inferred
  - name: Organization Fields (JSON), status: inferred
  - name: Examples, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-organizations, i_want: Execute mcloud organizations commands to list or get Cloud organizations. Use when discovering organizations, resolving organization IDs by name, or retrieving organization details including members a, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - use_case_id: UC-001, name: organizations list, scenario: List all organizations your account has access to.

```bash
mcloud organizations list --json
```

**Options:**

- `--json` — Output as JSON
  - use_case_id: UC-002, name: organizations get, scenario: Retrieve a single organization by ID. Returns metadata, subscription details, and members.

```bash
mcloud organizations get <organization-id> --json
```

**Arguments:**

- `organization` — Organizatio

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - rule: `organizations list` requires **personal auth** (browser login or personal access key). Organization access keys return 401 on this command., status: direct
  - rule: When authenticated with `MCLOUD_TOKEN` using an org access key, use `mcloud whoami --json` to get the organization ID instead., status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - input_name: --json, type: flag, origin: CLI
  - input_name: --organization, type: flag, origin: CLI
  - input_name: MCLOUD_TOKEN, type: env_var, origin: environment
  - input_name: ORGANIZATION_ID, type: env_var, origin: environment

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
- **Items**: 2
  - operation: READ, status: direct
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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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
