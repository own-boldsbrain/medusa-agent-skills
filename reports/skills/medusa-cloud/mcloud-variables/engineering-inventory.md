# mcloud-variables

Inventory for `medusa-cloud.mcloud-variables`.

**Coverage**: 35.7% (10/28 blocks with items)
**Evidence Level**: inferred
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - name: ADMIN_CORS, type: env_var, status: inferred
  - name: DATABASE_URL, type: env_var, status: inferred
  - name: REDIS_URL, type: env_var, status: inferred
  - name: STRIPE_SECRET_KEY, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - name: Constraints, status: inferred
  - name: Commands, status: inferred
  - name: Variable Fields (JSON), status: inferred
  - name: Examples, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-variables, i_want: Execute mcloud variables commands to list and get environment variables for a Cloud environment. Use when inspecting, reading, or exporting environment variables. Never pass --reveal unless the user e, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - use_case_id: UC-001, name: variables list, scenario: List all environment variables for a Cloud environment.

```bash
mcloud variables list \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  --jso
  - use_case_id: UC-002, name: variables get, scenario: Retrieve a single variable by its ID (`var_...`) or key.

```bash
# By key (requires project + environment context)
mcloud variables get ADMIN_CORS \
  --organization <org-id> \
  --project <project-i

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - rule: **Never pass `--reveal` unless the user explicitly asks.** Secret values appear in terminal scrollback, log aggregators, and process listings., status: direct
  - rule: Looking up by key requires `--project` and `--environment` (or the equivalent in active context). Looking up by ID (`var_...`) works without project/environment context., status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 9
  - input_name: --environment, type: flag, origin: CLI
  - input_name: --json, type: flag, origin: CLI
  - input_name: --organization, type: flag, origin: CLI
  - input_name: --project, type: flag, origin: CLI
  - input_name: --reveal, type: flag, origin: CLI
  - ... e mais 4

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
