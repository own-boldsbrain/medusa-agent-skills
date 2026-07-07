---
name: design-log-create
description: Use this skill when a new architectural decision, tech choice, or implementation strategy needs to be documented. Triggered when the user says "create a design-log", "log this decision", "DL for X", or when the workflow skill identifies an undocumented decision that must be recorded.
---

# Criar registro de projeto

Use esta habilidade para redigir uma nova entrada no registro de projeto. Siga cada etapa com precisão.

---

## Etapa 1: Determinar o próximo ID

```bash
ls design-log/ | sort
```

Encontre o maior número `DL-NNN` e acrescente 1 a ele. A próxima entrada recebe `DL-{N+1}`.

Exemplo: se o último arquivo for `DL-007-something.md`, o novo ID será `DL-008`.

---

## Etapa 2: Escolha um slug

O slug é uma descrição curta, em kebab-case, do tópico de decisão.

- Bom: `catalog-product-families`, `agent-skill-format`, `stack-medusa-v2`
- Ruim: `my-decision`, `update`, `fix`

O nome de arquivo final: `DL-NNN-slug.md`

---

## Etapa 3: Preencha os campos obrigatórios

Você **deve** preencher todos os campos obrigatórios. Não crie uma entrada com campos obrigatórios em branco.

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

## Etapa 4: Adicionar campos opcionais (recomendado)

Adicione-os quando tiver as informações:

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

## Etapa 5: Criar o arquivo

Crie o arquivo em: `design-log/DL-NNN-slug.md`

A estrutura do arquivo combina o frontmatter YAML com seções de texto em Markdown. Consulte o modelo em `reference/template.md` para ver o formato exato.

---

## Etapa 6: Validar antes de salvar

Verifique se todos os campos obrigatórios estão preenchidos:

- [ ] `id` corresponde ao nome do arquivo
- [ ] `title` é conciso e descritivo
- [ ] `status` é `draft` (nunca crie diretamente com `approved`)
- [ ] `date` é a data de hoje no formato ISO 8601
- [ ] `domain` é um dos valores válidos da enumeração
- [ ] `impacto` é um dos seguintes: `baixo`, `médio`, `alto`, `crítico`
- [ ] `contexto` explica o pano de fundo de forma satisfatória
- [ ] `problema` é específico (não vago)
- [ ] `decisão` é explícita (não vaga)

---

## Etapa 7: Notificar o usuário

Após criar o rascunho:

1. Mostre ao usuário o nome do arquivo e um resumo da decisão
2. Pergunte se ele deseja revisar e aprová-lo agora
3. Lembre-o: **somente entradas `aprovadas` têm autoridade vinculativa sobre os agentes**

---

## Fluxo de promoção de status

Um agente cria entradas no status `rascunho`. O status é promovido por pessoas (ou explicitamente pelo agente com a confirmação do usuário):

```
draft → review → approved → executing → done
                          ↘ rejected
                 superseded (can happen from any terminal state)
```

Não promova uma entrada para um status superior a `rascunho` sem a confirmação explícita do usuário.

---

## Substituir uma entrada existente

Se a nova decisão substituir uma entrada existente com status `aprovado`:

1. Adicione `supersedes: DL-NNN` ao cabeçalho da nova entrada
2. Atualize o `status` da entrada antiga para `superseded`
3. Adicione uma nota na entrada antiga indicando a nova

**Não edite o conteúdo de uma entrada aprovada** — atualize apenas o campo `status`.

---

## Arquivos de referência

- **Modelo**: `skills/design-log-create/reference/template.md`
- **Esquema**: `skills/design-log-workflow/reference/schema.md`
- **Exemplo de entrada**: `design-log/DL-000-bootstrap.md`
