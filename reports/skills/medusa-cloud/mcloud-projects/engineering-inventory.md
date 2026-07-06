# mcloud-projects

Inventory for `medusa-cloud.mcloud-projects`.

**Coverage**: 42.9% (12/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - name: PROJECT_HANDLE, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - name: Constraints, status: inferred
  - name: Commands, status: inferred
  - name: Project Fields (JSON), status: inferred
  - name: Examples, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-projects, i_want: Execute mcloud projects commands to list, get, or delete Cloud projects. Use when discovering projects, resolving project handles by name, or retrieving project details including linked environments., so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - use_case_id: UC-001, name: projects list, scenario: List all projects in an organization.

```bash
mcloud projects list --organization <org-id> --json
```

**Options:**
- `-o/--organization <id>` — Organization ID (falls back to active context; **requi
  - use_case_id: UC-002, name: projects get, scenario: Retrieve a single project by its ID or handle.

```bash
mcloud projects get <project-id-or-handle> --organization <org-id> --json
```

**Arguments:**
- `project` — Project ID or handle (required)

**O
  - use_case_id: UC-003, name: projects delete, scenario: Delete a project by its ID or handle. **Irreversible.**

```bash
mcloud projects delete <project-id-or-handle> \
  --organization <org-id> \
  --yes
```

**Arguments:**
- `project` — Project ID or han

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - rule: `projects delete` is **irreversible** — removes all associated environments, deployments, and resources. Always confirm the project ID/handle before deleting., status: direct
  - rule: Use `--yes` with `delete` in non-interactive contexts (scripts, pipelines, agents)., status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - input_name: --json, type: flag, origin: CLI
  - input_name: --organization, type: flag, origin: CLI
  - input_name: --project, type: flag, origin: CLI
  - input_name: --yes, type: flag, origin: CLI
  - input_name: PROJECT_HANDLE, type: env_var, origin: environment

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
- **Items**: 4
  - operation: APPROVE, status: direct
  - operation: READ, status: direct
  - operation: DELETE, status: direct
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
