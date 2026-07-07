# mcloud-logs

Inventory for `medusa-cloud.mcloud-logs`.

**Coverage**: 35.7% (10/28 blocks with items)
**Evidence Level**: inferred
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - name: Constraints, status: inferred
  - name: Command, status: inferred
  - name: Options, status: inferred
  - name: Examples, status: inferred
  - name: Time Range Notes, status: inferred

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with mcloud-logs, i_want: Execute mcloud logs to fetch and stream runtime logs for Cloud environments. Use when reading backend or storefront logs, filtering by time range, searching for errors, or scoping logs to a specific d, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - use_case_id: UC-002, name: Constraints, scenario: See SKILL.md
  - use_case_id: UC-003, name: Command, scenario: See SKILL.md
  - use_case_id: UC-004, name: Options, scenario: See SKILL.md
  - use_case_id: UC-005, name: Examples, scenario: See SKILL.md

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - rule: `--follow` and `--json` are incompatible. For programmatic log analysis, use bounded time windows with `--from`/`--to` and `--json`., status: direct
  - rule: `--follow` streams until interrupted with `Ctrl+C` — do not use in scripts or pipelines., status: direct
  - rule: Default retrieves the last 500 log lines from the past 15 minutes., status: direct

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 10
  - input_name: --deployment, type: flag, origin: CLI
  - input_name: --environment, type: flag, origin: CLI
  - input_name: --follow, type: flag, origin: CLI
  - input_name: --from, type: flag, origin: CLI
  - input_name: --json, type: flag, origin: CLI
  - ... e mais 5

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
- **Items**: 3
  - operation: APPROVE, status: direct
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

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: APPROVE, status: inferred

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
