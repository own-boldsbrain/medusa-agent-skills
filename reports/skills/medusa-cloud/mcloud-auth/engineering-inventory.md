# mcloud-auth

Inventory for `medusa-cloud.mcloud-auth`.

**Coverage**: 46.4% (13/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - name: ENVIRONMENT_HANDLE, type: env_var, status: inferred
  - name: MCLOUD_TOKEN, type: env_var, status: inferred
  - name: ORGANIZATION_ID, type: env_var, status: inferred
  - name: PROJECT_HANDLE, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - name: Constraints, status: inferred
  - name: Commands, status: inferred
  - name: Auth Methods, status: inferred
  - name: Examples, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-auth, i_want: Execute mcloud authentication and context commands: login, logout, whoami, use, version, and signup. Use when setting up the CLI, switching accounts, verifying auth state, setting the active org/proje, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - use_case_id: UC-001, name: whoami, scenario: Show authenticated user, auth method, and active context (organization, project, environment).

```bash
mcloud whoami --json
```

**Options:**

- `--json` — Output as JSON

**Use to verify auth and sc

- use_case_id: UC-002, name: use, scenario: Set the active organization, project, and/or environment so subsequent commands skip those flags.

```bash
mcloud use \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment
  - use_case_id: UC-003, name: version, scenario: Print CLI version and platform metadata.

```bash
mcloud version --json
```

**Options:**

- `--json` — Output as JSON
  - use_case_id: UC-004, name: login, scenario: Authenticate with Medusa Cloud. Opens a browser to complete auth.

> **TTY required.** Cannot be run in CI, Docker, or non-interactive environments. Use `MCLOUD_TOKEN` instead for non-interactive auth

- use_case_id: UC-005, name: logout, scenario: Remove stored credentials.

```bash
mcloud logout --json
```

**Options:**

- `--json` — Output as JSON

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - rule: `mcloud login`, `mcloud signup`, and `mcloud use` (without flags) require a **TTY** — they fail in CI, Docker, or piped input. Use `MCLOUD_TOKEN` or pass flags explicitly instead., status: direct
  - rule: When `MCLOUD_TOKEN` is set, file-based credentials are ignored and `mcloud login` is rejected. Unset it to switch accounts., status: direct
  - rule: Always verify auth before any state-changing command: `mcloud whoami --json | jq -e '.auth.kind != "none"'`, status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 10
  - input_name: --clear, type: flag, origin: CLI
  - input_name: --environment, type: flag, origin: CLI
  - input_name: --json, type: flag, origin: CLI
  - input_name: --organization, type: flag, origin: CLI
  - input_name: --project, type: flag, origin: CLI
  - ... e mais 5

### System Outputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - output_name: JSON response, type: json, format: stdout
  - output_name: Exit code, type: integer, format: process

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
  - operation: DELETE, status: direct
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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### REJECT

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: REJECT, status: inferred

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
