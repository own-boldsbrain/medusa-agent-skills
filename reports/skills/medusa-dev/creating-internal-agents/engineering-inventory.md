# creating-internal-agents

Inventory for `medusa-dev.creating-internal-agents`.

**Coverage**: 42.9% (12/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - name: AGENT_MODULE, type: env_var, status: inferred

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 7
  - name: Constraints, status: inferred
  - name: CRITICAL: Load Reference Files When Needed, status: inferred
  - name: Related Skills, status: inferred
  - name: Architecture Overview, status: inferred
  - name: Common Mistakes, status: inferred
  - ... e mais 2

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - when: Working with creating-agents-in-medusa, i_want: Use when building an internal admin-facing AI agent in a Medusa project. These agents are operated by merchants and store operators — not customers. Covers data models, module service, agent runtime (, so_that: I can implement the feature correctly

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - use_case_id: UC-002, name: Constraints, scenario: See SKILL.md
  - use_case_id: UC-003, name: CRITICAL: Load Reference Files When Needed, scenario: See SKILL.md
  - use_case_id: UC-004, name: Related Skills, scenario: See SKILL.md
  - use_case_id: UC-005, name: Architecture Overview, scenario: See SKILL.md

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 8
  - rule: **Internal use only** — this architecture is for admin users (merchants, operators, support staff), not customers. Routes live under `src/api/admin/`, the UI lives in the Medusa admin dashboard, and access is gated by admin authentication throughout., status: direct
  - rule: **Authentication is non-negotiable** — MedusaExec runs arbitrary TypeScript with full database access. All agent routes must use `AuthenticatedMedusaRequest` and live under `src/api/admin/`. An unauthenticated endpoint is a remote code execution vulnerability., status: direct
  - rule: **Use MedusaExec, not custom tools** — for any data operation, the agent writes TypeScript and executes it via MedusaExec. Only build a custom tool for capabilities that cannot be expressed as executable TypeScript (e.g. calling an external API with a secret key)., status: direct
  - rule: **One shared module, multiple agents** — `AgentSession` and `AgentMessage` are shared infrastructure. Use `agent_type` to distinguish sessions per agent. Never create separate models per agent., status: direct
  - rule: **Pass `MedusaContainer` via `experimental_context`** — never import services directly in tool files; that causes circular dependencies., status: direct
  - ... e mais 3

### User Inputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - input_name: AGENT_MODULE, type: env_var, origin: environment

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

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### CRUD

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 4
  - operation: APPROVE, status: direct
  - operation: CREATE, status: direct
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
