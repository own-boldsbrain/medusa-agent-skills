---
name: design-log-create
description: Use this skill when a new architectural decision, tech choice, or implementation strategy needs to be documented. Triggered when the user says "create a design-log", "log this decision", "DL for X", or when the workflow skill identifies an undocumented decision that must be recorded.
---

# Design-Log Create

Use this skill to draft a new design-log entry. Follow each step precisely.

---

## Step 1: Determine the next ID

```bash
ls design-log/ | sort
```

Find the highest `DL-NNN` number and increment by 1. The next entry gets `DL-{N+1}`.

Example: if the last file is `DL-007-something.md`, the new ID is `DL-008`.

---

## Step 2: Choose a slug

The slug is a short kebab-case description of the decision topic.

- Good: `catalog-product-families`, `agent-skill-format`, `stack-medusa-v2`
- Bad: `my-decision`, `update`, `fix`

The final filename: `DL-NNN-slug.md`

---

## Step 3: Fill the required fields

You **must** provide all required fields. Do not create an entry with missing required fields.

```yaml
id: DL-NNN
title: "Short descriptive title (5–120 chars)"
status: draft
date: YYYY-MM-DD   # today's date, ISO 8601
domain: plataforma  # see domain table in schema reference
impact: médio       # baixo | médio | alto | crítico
context: |
  What is happening. Why is this decision needed now.
  Provide enough background for an agent that has never seen this code.
problem: |
  The specific problem or gap being addressed.
decision: |
  What was decided. Be explicit and precise.
  Avoid vague language like "we will improve" — say exactly what will be done.
```

---

## Step 4: Add optional fields (recommended)

Add these when you have the information:

```yaml
affected_files:
  - "apps/storefront/src/components/ProductCard.tsx"
  - "packages/catalog/src/families.ts"

approach: |
  Implementation guidance: which files to change, in what order,
  and what patterns to follow.

alternatives_considered:
  - option: "Option A description"
    reason_rejected: "Why it was not chosen"
  - option: "Option B description"
    reason_rejected: "Why it was not chosen"

success_criteria:
  - "All Vitest unit tests pass"
  - "TypeScript compiles without errors"
  - "Feature is accessible from the storefront"

consequences:
  positive:
    - "Reduces complexity in the catalog module"
  negative:
    - "Requires migration of existing products"
```

---

## Step 5: Create the file

Create the file at: `design-log/DL-NNN-slug.md`

The file structure combines YAML frontmatter with Markdown prose sections. See the template in `reference/template.md` for the exact format.

---

## Step 6: Validate before saving

Check all required fields are present:

- [ ] `id` matches the filename
- [ ] `title` is concise and descriptive
- [ ] `status` is `draft` (never create with `approved` directly)
- [ ] `date` is today in ISO 8601 format
- [ ] `domain` is one of the valid enum values
- [ ] `impact` is one of: `baixo`, `médio`, `alto`, `crítico`
- [ ] `context` explains the background sufficiently
- [ ] `problem` is specific (not vague)
- [ ] `decision` is explicit (not vague)

---

## Step 7: Notify the user

After creating the draft:

1. Show the user the filename and a summary of the decision
2. Ask if they want to review and approve it now
3. Remind them: **only `approved` entries have binding authority over agents**

---

## Status Promotion Flow

An agent creates entries in `draft`. Status is promoted by humans (or explicitly by the agent with user confirmation):

```
draft → review → approved → executing → done
                          ↘ rejected
                 superseded (can happen from any terminal state)
```

Do not self-promote beyond `draft` without explicit user confirmation.

---

## Superseding an existing entry

If the new decision replaces an existing `approved` entry:

1. Add `supersedes: DL-NNN` to the new entry's frontmatter
2. Update the old entry's `status` to `superseded`
3. Add a note in the old entry pointing to the new one

**Do not edit the content of an approved entry** — only update its `status` field.

---

## Reference files

- **Template**: `skills/design-log-create/reference/template.md`
- **Schema**: `skills/design-log-workflow/reference/schema.md`
- **Example entry**: `design-log/DL-000-bootstrap.md`
