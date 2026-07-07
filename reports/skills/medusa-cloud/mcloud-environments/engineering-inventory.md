# mcloud-environments

Inventory for `medusa-cloud.mcloud-environments`.

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
  - name: Redeploy vs Trigger-Build Decision, status: inferred
  - name: Examples, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-environments, i_want: Execute mcloud environments commands to list, get, create, delete, redeploy, or trigger builds for Cloud environments. Use when managing environment lifecycle, redeploying after variable changes, or s, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - use_case_id: UC-001, name: environments list, scenario: List all environments in a project.

```bash
mcloud environments list --organization <org-id> --project <project-id-or-handle> --json
```

**Options:**

- `-o/--organization <id>` — Organization ID (fa
  - use_case_id: UC-002, name: environments get, scenario: Retrieve a single environment by handle.

```bash
mcloud environments get <environment-handle> --organization <org-id> --project <project-id-or-handle> --json
```

**Arguments:**

- `environment` — Env
  - use_case_id: UC-003, name: environments create, scenario: Create a new long-lived environment.

```bash
mcloud environments create \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --name "Staging" \
  --branch develop \
  --json
```

**Op

- use_case_id: UC-004, name: environments delete, scenario: Delete an environment. **Cannot delete production environments.**

```bash
mcloud environments delete <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --yes
``
  - use_case_id: UC-005, name: environments redeploy, scenario: Re-run an existing build for the active deployment. Use when the fix is environment-side (variable change, infra issue) — does NOT start a new build.

```bash
mcloud environments redeploy <environment

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - rule: **Production environments cannot be deleted.** Always check `type` via `environments get --json` before attempting delete in automation., status: direct
  - rule: Use `--yes` for destructive operations (`delete`) in non-interactive contexts., status: direct
  - rule: `redeploy` vs `trigger-build` are not interchangeable — choose the right one based on where the fix is., status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 8
  - input_name: --branch, type: flag, origin: CLI
  - input_name: --environment, type: flag, origin: CLI
  - input_name: --json, type: flag, origin: CLI
  - input_name: --limit, type: flag, origin: CLI
  - input_name: --name, type: flag, origin: CLI
  - ... e mais 3

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
  - operation: DELETE, status: direct
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
