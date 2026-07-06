# using-medusa-cloud

Inventory for `medusa-cloud.using-medusa-cloud`.

**Coverage**: 50.0% (14/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - name: MCLOUD_TOKEN, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - name: Constraints, status: inferred
  - name: CRITICAL: Load Reference Files When Needed, status: inferred
  - name: Quick Reference, status: inferred
  - name: Common Pitfalls, status: inferred
  - name: Reference Files, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with using-medusa-cloud, i_want: Manages Medusa Cloud resources through the Cloud CLI (mcloud). Use when deploying, debugging deployments, managing environments, environment variables, or any Medusa Cloud operation. CRITICAL for mclo, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - use_case_id: UC-001, name: Authentication Check, scenario: Always verify auth and scope before mutating state:

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

Exit code `0` = authenticated and scoped. Non-zero = 
  - use_case_id: UC-002, name: Set Context Once, scenario: ```bash
mcloud use \
  --organization org_123 \
  --project proj_123 \
  --environment production
```

> **CRITICAL:** `mcloud use` without flags is interactive and fails in CI/Docker/piped input. Alw
  - use_case_id: UC-003, name: Deployment Status Routing, scenario: Route on `backend_status` (or `storefront_status`):

| Status | Meaning | Logs to check |
|--------|---------|---------------|
| `build-failed` | Build step failed | `mcloud deployments build-logs <id
  - use_case_id: UC-004, name: Redeployment Decision, scenario: | Command | When to use |
|---------|-------------|
| `mcloud environments redeploy <env>` | Fix is environment-side (variable change, infra) — reruns existing build |
| `mcloud environments trigger-b

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 7
  - rule: **Always pass `--json`** when parsing CLI output. Plaintext output is for humans and may change without warning., status: direct
  - rule: **Confirm context before mutating.** Run `mcloud whoami --json` before any state change., status: direct
  - rule: **Read before you write.** Run a `get` or `list` before any `delete`, `redeploy`, or `trigger-build`., status: direct
  - rule: **Use `--yes` for destructive operations.** `delete` commands require `--yes` in non-interactive mode., status: direct
  - rule: **Production environments cannot be deleted.** `mcloud environments delete` errors on production by design., status: direct
  - ... e mais 2

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - input_name: --environment, type: flag, origin: CLI
  - input_name: --json, type: flag, origin: CLI
  - input_name: --organization, type: flag, origin: CLI
  - input_name: --project, type: flag, origin: CLI
  - input_name: MCLOUD_TOKEN, type: env_var, origin: environment

### System Outputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - output_name: JSON response, type: json, format: stdout
  - output_name: Exit code, type: integer, format: process
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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### CRUD

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - operation: DELETE, status: direct
  - operation: REJECT, status: direct
  - operation: READ, status: direct
  - operation: UPDATE, status: direct
  - operation: CREATE, status: direct
  - ... e mais 1

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
