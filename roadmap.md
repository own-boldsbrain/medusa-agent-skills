# Medusa Agent Skills - Building Blocks Roadmap

## Matriz Executiva dos Building Blocks

| BB            | Nome                                    |               Estado real no repo | Evidência                                                                                                             |
| ------------- | --------------------------------------- | --------------------------------: | --------------------------------------------------------------------------------------------------------------------- |
| BB-00 / PR #1 | Translation Forensic Repair             |         **REPROVADO / BLOQUEADO** | PR #1 está `open`, `merged=false`, `mergeable=false`, com 104 commits, 591 arquivos, 96.909 adições e 9.433 deleções. |
| BB-00 / PR #2 | Architecture contaminated attempt       | **REPROVADO / FECHADO SEM MERGE** | PR #2 está `closed`, `merged=false`, com 106 commits, 597 arquivos, 97.683 adições e 9.433 deleções.                  |
| BB-01.1       | Agentic Operating Layer Architecture    |       **APROVADO COM EVIDÊNCIAS** | PR #3 mergeado em `main`, 6 arquivos, 774 adições.                                                                    |
| BB-01.2       | MCP Implementation Roadmap              |       **APROVADO COM EVIDÊNCIAS** | PR #4 mergeado em `main`, 5 arquivos, 550 adições.                                                                    |
| BB-01.3       | MCP Server Contracts                    |       **APROVADO COM EVIDÊNCIAS** | PR #5 mergeado em `main`, 4 arquivos, 837 adições.                                                                    |
| BB-01.4       | Runtime Gateway Contracts               |       **APROVADO COM EVIDÊNCIAS** | PR #6 mergeado em `main`, 5 arquivos, 659 adições.                                                                    |
| BB-02.1       | Evidence Core + Skill Indexer           |       **APROVADO COM EVIDÊNCIAS** | PR #7 mergeado em `main`, 11 arquivos, 639 adições.                                                                   |
| BB-02.2       | Medusa Repo Scanner Foundation          |       **APROVADO COM EVIDÊNCIAS** | PR #8 mergeado em `main`, 6 arquivos, 678 adições.                                                                    |
| BB-02.3       | AJV + AST Scanner + Gitignore Hygiene   |       **APROVADO COM EVIDÊNCIAS** | PR #10 mergeado em `main`; adicionou AJV validation, AST utils, scanner v0.2.0, gitignore hygiene.                    |
| BB-03         | Architecture Rules Engine Foundation    |       **APROVADO COM EVIDÊNCIAS** | PR #11 mergeado em `main`, deterministic architecture linter.                                                         |
| BB-04         | Workflow & Schema Inspector             |       **APROVADO COM EVIDÊNCIAS** | PR #12 mergeado em `main`, `merge_commit_sha: 6489119...`, 10 arquivos, 830 adições.                                  |
| BB-05         | API Route Inspector                     |       **APROVADO COM EVIDÊNCIAS** | PR #13 mergeado em `main`, `merge_commit_sha: 0f9b059...`, 10 arquivos, 732 adições.                                  |
| BB-06         | Architecture Linter Expansion           |       **APROVADO COM EVIDÊNCIAS** | PR #14 mergeado em `main`, `merge_commit_sha: b7f648...`, 14 arquivos, 531 adições.                                   |
| BB-07         | Golden Fixtures & Rule Regression Tests |       **APROVADO COM EVIDÊNCIAS** | PR #15 mergeado em `main`, `merge_commit_sha: 36c11c...`, 16 arquivos, 260 adições.                                   |
| BB-08         | Storefront Translation Integrity Canary | **VALIDADO EM PR ABERTO / AGUARDANDO MERGE** | PR #16 aberto, com validações passando, aguardando merge em `main`.                                    |

---

## Issues, tasks e subtasks por bloco

### BB-00 — Translation Forensic Repair, PR #1

```txt
Issue:
PR global de tradução está grande, aberto, não mergeável e contaminado.

Tasks:
- Auditar tradução pt-BR global.
- Reparar residual inglês.
- Gerar relatório FinOps/token.
- Submeter PR.

Subtasks:
- Mapear pares source/target.
- Detectar residual inglês.
- Aplicar reparos.
- Gerar relatório.
- Abrir PR.

Estado real:
REPROVADO / BLOQUEADO

Motivos reais:
- PR #1 open.
- merged=false.
- mergeable=false.
- 104 commits.
- 591 arquivos.
- 96.909 adições.
- 9.433 deleções.
```

> **Evidência**: PR #1 está aberto, não mergeado e não mergeável.

### BB-01 — Architecture Foundation

```txt
Issue:
Criar fundação documental e contratual para Medusa Agentic Operating Layer.

Tasks:
- BB-01.1: As-Is/To-Be Architecture.
- BB-01.2: MCP Implementation Roadmap.
- BB-01.3: MCP Server Contracts.
- BB-01.4: Runtime Gateway Contracts.

Subtasks:
- Criar docs de arquitetura.
- Criar registries.
- Criar schemas.
- Separar pacotes limpos em PRs pequenos.
- Evitar contaminação dos PRs #1/#2.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #3, #4, #5 e #6 estão todos `closed` e `merged=true`, com merges sequenciais em `main`.

### BB-02 — Evidence, Skill Indexer, Repo Scanner

```txt
Issue:
Criar camada funcional inicial para indexar skills, registrar evidências e escanear estrutura Medusa.

Tasks:
- BB-02.1: Evidence Core.
- BB-02.1: Skill Indexer.
- BB-02.2: Medusa Repo Scanner Foundation.
- BB-02.3: AJV validation.
- BB-02.3: AST scanner improvements.
- BB-02.3: Gitignore hygiene.

Subtasks:
- Criar packages/evidence-core.
- Criar packages/skill-indexer.
- Criar packages/medusa-repo-scanner.
- Criar schema de structure report.
- Criar runner de scanner.
- Adicionar AJV.
- Trocar includes heurístico por TypeScript AST.
- Remover node_modules/report gerado do tracking.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #7, #8 e #10 estão mergeados. O PR #10 documenta explicitamente AJV validation, TypeScript AST utilities, scanner v0.2.0, runner com schema validation e gitignore hygiene.

### BB-03 — Architecture Rules Engine Foundation

```txt
Issue:
Transformar facts estruturais do scanner em violations arquiteturais determinísticas.

Tasks:
- Criar medusa-architecture-linter.
- Criar ArchitectureValidationReport.
- Criar rules foundation.
- Criar severidades P0/P1/P2/P3.
- Criar validate-report.
- Criar runner.

Subtasks:
- Layering rules.
- Routing rules.
- Workflow mutation rules iniciais.
- Schema validation do report final.
- Geração de architecture-validation.json.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #11 está fechado e mergeado, com título “feat: add Medusa architecture rules engine foundation”.

### BB-04 — Workflow & Schema Inspector

```txt
Issue:
Extrair facts profundos de workflows, steps, compensations, DML models, relationships e migrations.

Tasks:
- Criar package medusa-workflow-schema-inspector.
- Criar workflow-schema-inspection-report.schema.json.
- Implementar workflow-inspector.
- Implementar model-inspector.
- Implementar validator.
- Criar runner.

Subtasks:
- Detectar createStep.
- Detectar createWorkflow.
- Detectar StepResponse.
- Detectar compensation.
- Detectar model.define.
- Detectar fields/relationships.
- Detectar migrations por módulo.
- Corrigir bug ESM/require no ast-utils.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #12 está `closed`, `merged=true`, com 2 commits, 10 arquivos e 830 adições.

### BB-05 — API Route Inspector

```txt
Issue:
Extrair facts de rotas REST Medusa e middlewares sem aplicar julgamento normativo.

Tasks:
- Criar package medusa-api-route-inspector.
- Criar api-route-inspection-report.schema.json.
- Implementar route-inspector.
- Implementar middleware-inspector.
- Criar validate-report.
- Criar runner.

Subtasks:
- Detectar route.ts/route.js.
- Detectar methods GET/POST/PUT/PATCH/DELETE.
- Inferir scope admin/store/internal.
- Extrair workflow.run.
- Extrair query.graph/query.index.
- Extrair idempotency.
- Extrair status codes e MedusaError.
- Aplicar middlewares auth/Zod às rotas.
- Preservar unknown_fields.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #13 está `closed`, `merged=true`, com commit de merge `0f9b05900f610bd5a1c7f10fa876348d37fcaf78`.

### BB-06 — Architecture Linter Expansion

```txt
Issue:
Consumir reports BB-04 e BB-05 no Architecture Linter e transformar facts em regras MEDUSA_*.

Tasks:
- Refatorar runners BB-04/BB-05 para run*Inspection.
- Expandir ArchitectureRuleContext.
- Adicionar source_reports.
- Adicionar regras API.
- Adicionar regra Data Models.
- Adicionar regras Advanced Workflows.
- Corrigir mirror types do WorkflowSchemaInspectionReport.

Subtasks:
- MEDUSA_API_ADMIN_ROUTE_WITHOUT_AUTH.
- MEDUSA_API_MUTATION_WITHOUT_ZOD_VALIDATION.
- MEDUSA_API_MUTATION_WITHOUT_WORKFLOW.
- MEDUSA_API_ROUTE_WITHOUT_IDEMPOTENCY.
- MEDUSA_API_ROUTE_WITHOUT_ERROR_CONTRACT.
- MEDUSA_MODEL_WITHOUT_MIGRATION.
- MEDUSA_WORKFLOW_MUTATION_STEP_WITHOUT_COMPENSATION.
- Fix step_name/variable_name/path/model_name/table_name/module_name.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #14 está mergeado em `main` com commit `b7f648d91f85bf87e69877f5b1aaac18f5f6eedf`. O arquivo real `api-routes.ts` contém as regras MEDUSA de API, com severidades P0/P1/P2.

### BB-07 — Golden Fixtures & Rule Regression Tests

```txt
Issue:
Congelar comportamento dos scanners/inspectors/linter com golden fixtures e testes de regressão.

Tasks:
- Criar fixture golden-medusa-project.
- Criar teste repo scanner.
- Criar teste workflow schema inspector.
- Criar teste api route inspector.
- Criar teste architecture linter.
- Criar run-all-tests.mjs.
- Adicionar script npm run test.

Subtasks:
- Criar rota admin unsafe.
- Criar rota admin safe.
- Criar store custom POST unsafe.
- Criar Product model sem migration.
- Criar Order model com migration.
- Criar create-product sem compensation.
- Criar create-order com compensation.
- Assertar rule IDs MEDUSA_*.
- Validar schema final do report.

Estado real:
APROVADO COM EVIDÊNCIAS
```

> **Evidência**: PR #15 está `closed`, `merged=true`, com commit `36c11c81798146520222a45280304f4474affad4`, 1 commit, 16 arquivos e 260 adições. O teste real do linter executa scanner, workflow inspector, API inspector, linter e schema validation, além de verificar os rule IDs esperados.

### BB-08 — Storefront Translation Integrity Canary

```txt
Issue:
Voltar à trilha de tradução pt-BR com canário pequeno, sem reabrir o caos do PR #1.

Tasks executadas:
- Selecionar 3 arquivos canary.
- Criar validate-translation-canary.mjs.
- Gerar relatório pré-correção.
- Corrigir apenas 3 targets.
- Rodar validações.
- Abrir PR pequeno oficial.

Subtasks executadas:
- promotions.pt-br.md.
- wishlist.pt-br.md.
- cart-popup.pt-BR.md.
- Validar headings.
- Validar code fences.
- Validar anchors (com normalização de acentos).
- Bloquear filler LLM.
- Bloquear meta-texto.
- Bloquear .bak.
- Rodar npm run test e validate-json-schemas.

Estado real:
VALIDADO EM PR ABERTO / AGUARDANDO MERGE (PR #16)
```

> **Evidência**: O problema real nos canários foi remediado em um PR próprio isolado e determinístico (PR #16 criado, com validações locais passando).

---

## Estado real por categoria

**APROVADO COM EVIDÊNCIAS:**

- BB-01
- BB-02
- BB-03
- BB-04
- BB-05
- BB-06
- BB-07

**VALIDADO EM PR ABERTO / AGUARDANDO MERGE:**

- BB-08 (PR #16)

**REPROVADO / BLOQUEADO:**

- PR #1 Translation Forensic Repair

**REPROVADO / FECHADO SEM MERGE:**

- PR #2 contaminated architecture attempt
- PR #9 superseded scanner attempt

## Veredito geral do repositório

> Status: APROVADO COM EVIDÊNCIAS PARA A FUNDAÇÃO BB-01→BB-08

O repositório tem hoje:

- Fundação arquitetural documentada.
- Evidence core.
- Skill indexer.
- Repo scanner.
- Workflow/schema inspector.
- API route inspector.
- Architecture linter com regras MEDUSA_*.
- Golden fixtures e regression tests.
- Scripts de validação de Markdown semântico para Traduções (Canary).

**Pendência operacional**:

- PR #1 segue bloqueado e não deve ser usado como base. Nenhuma tentativa de reviver ou tocar em branches atreladas ao PR #1 deve ser feita sem refatoração metódica similar à iniciada no BB-08.
