# learning-medusa

Inventory for `learn-medusa.learning-medusa`.

**Coverage**: 46.4% (13/28 blocks with items)
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
- **Items**: 10
  - name: Overview, status: inferred
  - name: Tutoring Protocol, status: inferred
  - name: Three-Lesson Structure, status: inferred
  - name: Checkpoint Verification Pattern, status: inferred
  - name: Error Handling During Tutorial, status: inferred
  - ... e mais 5

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - when: Working with learning-medusa, i_want: Load automatically when user asks to learn Medusa development (e.g., "teach me how to build with medusa", "guide me through medusa", "I want to learn medusa"). Interactive guided tutorial where Claude, so_that: I can implement the feature correctly
  - when: User asks about specific method signatures beyond what's in the tutorial, i_want: implement this correctly, so_that: the feature works as expected
  - when: User wants to know about advanced configurations, i_want: implement this correctly, so_that: the feature works as expected
  - when: User asks about features not covered in the tutorial, i_want: implement this correctly, so_that: the feature works as expected
  - when: User encounters errors not in troubleshooting guide, i_want: implement this correctly, so_that: the feature works as expected
  - ... e mais 1

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - use_case_id: UC-001, name: When User Encounters Errors, scenario: **CRITICAL**: NEVER skip errors or say "we'll handle this later"

Follow this process:

1. **Acknowledge**: "Error messages are great teachers! Let's figure this out together."

2. **Gather Informatio

- use_case_id: UC-002, name: Common Error Categories, scenario: Load the appropriate troubleshooting section:

- **Module Errors**: "Cannot find module", "Module name must be camelCase"
- **Workflow Errors**: "Async function not allowed", "Cannot use await"
- **AP
  - use_case_id: UC-003, name: Saving Progress, scenario: After each lesson:

```
Great work completing Lesson [N]! Let's commit your progress:

git add .
git commit -m "Complete Lesson [N]: [description]"

This saves your work. Ready for Lesson [N+1]?
```

- use_case_id: UC-004, name: Resuming, scenario: If user says they're resuming:

```
Welcome back! Where did we leave off?

Looking at your code, I can see you've completed:
- [✓] Lesson 1
- [ ] Lesson 2
- [ ] Lesson 3

Let's pick up with Lesson 2.
  - use_case_id: UC-005, name: Skipping Ahead, scenario: If user wants to skip:

```

I understand you want to jump to Lesson [N]. However, each lesson builds on the previous one:

- Lesson 1 creates the Brand Module (needed for Lesson 2)
- Lesson 2 links br

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

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - endpoint: admin/brands, method: POST, status: direct
  - endpoint: admin/brands, method: POST, status: direct
  - endpoint: admin/products, method: POST, status: direct
  - endpoint: admin/brands, method: GET, status: direct
  - endpoint: admin/brands, method: GET, status: direct

### Endpoints

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - method: POST, path: admin/brands, status: direct
  - method: POST, path: admin/brands, status: direct
  - method: POST, path: admin/products, status: direct
  - method: GET, path: admin/brands, status: direct
  - method: GET, path: admin/brands, status: direct

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

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - method: GET, path: admin/brands, status: direct
  - method: GET, path: admin/brands, status: direct

### POSTs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - method: POST, path: admin/brands, status: direct
  - method: POST, path: admin/brands, status: direct
  - method: POST, path: admin/products, status: direct

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
