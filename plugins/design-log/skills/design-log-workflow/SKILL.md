---
name: design-log-workflow
description: Use this skill whenever you are about to implement, modify, refactor, or make any architectural decision in the YSH Store project. This is the mandatory pre-action consultation protocol — scan existing design-log entries to understand the project's decisions and constraints before writing any code.
---

# Design-Log Workflow

**This skill is mandatory. Do not skip it.** Before any implementation, refactor, or architectural decision, you MUST consult the design-log. This is defined in `AGENTS.md` Section 2.1 and is non-negotiable.

---

## Phase 1 — Pre-Action Consultation (ALWAYS run before coding)

### Step 1: Scan the design-log folder

```bash
ls design-log/
```

Review the file list. Entries follow the naming format: `DL-NNN-slug.md`

### Step 2: Identify relevant entries

Match entries to the current task by:

- **Domain keywords** in the filename slug (e.g., `catalogo`, `agente`, `stack`, `plataforma`)
- **Recent entries** (highest numbers are most recent)
- The `DL-000-bootstrap.md` is always relevant — it contains the platform foundation

### Step 3: Read the relevant entries

For each relevant entry, read:

1. `status` — **only `approved` and `executing` entries have binding authority**
2. `domain` and `impact` — to understand scope
3. `context` — why this decision exists
4. `decision` — what was decided (this is what you must align with)
5. `approach` — how to implement (if present, follow it)
6. `affected_files` — which files/modules are governed by this decision

### Step 4: Check for contradictions

Before writing code, ask:

- Does my planned implementation contradict any `approved` or `executing` decision?
- If yes: **STOP. Do not proceed.** Report the contradiction to the user and propose either:
  - An implementation aligned with the existing decision, or
  - A new `draft` design-log entry that supersedes the contradicting one (use `design-log-create` skill)

### Step 5: Align and proceed

Implement in accordance with the approved decisions. The design-log is the single source of truth for architectural direction.

---

## Phase 2 — During Implementation

### If you get blocked by an unanticipated problem

1. Create a new design-log entry with `status: draft` (use `design-log-create` skill)
2. Document the problem in `context` and `problem` fields
3. Propose a solution in the `decision` field
4. Present to the user for review — do not self-approve
5. Only proceed after the entry is promoted to `approved`

### If you discover an undocumented decision already being followed

Document it retroactively. Create a new entry capturing the implicit decision so it becomes explicit and searchable.

---

## Phase 3 — Post-Implementation Update

After completing work that corresponds to a design-log entry:

1. Find the entry (e.g., `DL-007-catalog-strategy.md`)
2. Update `status` from `executing` → `done`
3. Add the `evidence` section:

```yaml
evidence:
  pr_url: "https://github.com/boldsbrainai/ysh-store/pull/NNN"
  commit_sha: "abc1234"
  test_output: "All Vitest tests pass. TypeScript compile clean."
  notes: "Optional notes about execution details."
```

1. If this work revealed a new recurring rule, add it to `AGENTS.md` and document in `agents_rule_derived` field

---

## Domain Quick Reference

When scanning logs, match these domains to your task:

| Domain | What it governs |
|--------|----------------|
| `plataforma` | Core stack, repo structure, tooling |
| `catálogo` | Product catalog, families, variants |
| `agente` | AI agent rules, AGENTS.md, skills |
| `stack` | Tech stack choices (Medusa, Next.js, etc.) |
| `lifecycle` | Deployment, environment, CI/CD |
| `sistema` | Cross-cutting system concerns |
| `segurança` | Auth, permissions, security |
| `observabilidade` | Logging, monitoring, tracing |
| `ux` | UI/UX decisions, design system |
| `integração` | External APIs, webhooks, integrations |
| `testes` | Testing strategy, coverage requirements |

---

## Status Authority Rules

| Status | Agent behavior |
|--------|----------------|
| `draft` | Informational only — no binding authority |
| `review` | Informational only — pending approval |
| `approved` | **BINDING** — must follow this decision |
| `executing` | **BINDING** — actively being implemented |
| `done` | Reference only — decision was executed |
| `rejected` | Ignore — decision was not adopted |
| `superseded` | Ignore — replaced by a newer entry |

---

## Golden Rules (from `design-log/README.md`)

1. **Context > Prompt** — Never replace accumulated context with a clever prompt
2. **Immutability** — Approved logs are not edited; they are superseded by new entries
3. **Evidence is mandatory** — "Done" without evidence means it's not done
4. **Errors become rules** — Recurring bugs must become rules in `AGENTS.md`, referenced in the DL
5. **The system learns, not the model** — Memory lives in files, not in sessions

---

## Reference

- Full schema definition: `skills/design-log-workflow/reference/schema.md`
- Creating a new entry: use the `design-log-create` skill
- Bootstrap entry (architecture foundation): `design-log/DL-000-bootstrap.md`
