# design-log-workflow

Inventory for `design-log.design-log-workflow`.

**Coverage**: 39.3% (11/28 blocks with items)
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
- **Items**: 7
  - name: Phase 1 — Pre-Action Consultation (ALWAYS run before coding), status: inferred
  - name: Phase 2 — During Implementation, status: inferred
  - name: Phase 3 — Post-Implementation Update, status: inferred
  - name: Domain Quick Reference, status: inferred
  - name: Status Authority Rules, status: inferred
  - ... e mais 2

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with design-log-workflow, i_want: Use this skill whenever you are about to implement, modify, refactor, or make any architectural decision in the YSH Store project. This is the mandatory pre-action consultation protocol — scan existin, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - use_case_id: UC-001, name: If you get blocked by an unanticipated problem, scenario: 1. Create a new design-log entry with `status: draft` (use `design-log-create` skill)
2. Document the problem in `context` and `problem` fields
3. Propose a solution in the `decision` field
4. Present
  - use_case_id: UC-002, name: If you discover an undocumented decision already being followed, scenario: Document it retroactively. Create a new entry capturing the implicit decision so it becomes explicit and searchable.

---

### Faz / Não Faz

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

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

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - url: https://github.com/boldsbrainai/ysh-store/pull/NNN", type: reference, status: direct

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
