---
name: design-log-create
description: Use esta skill quando uma nova decisão arquitetural, escolha tecnológica ou estratégia de implementação precisa ser documentada. Ativada quando o usuário diz "criar um design-log", "registrar esta decisão", "DL para X", ou quando a skill de workflow identifica uma decisão não documentada que deve ser registrada.
---

# Criar Design-Log

Use esta skill para redigir uma nova entrada de design-log. Siga cada passo com precisão.

---

## Passo 1: Determinar o próximo ID

```bash
ls design-log/ | sort
```

Encontre o número `DL-NNN` mais alto e incremente em 1. A próxima entrada recebe `DL-{N+1}`.

Exemplo: se o último arquivo é `DL-007-algo.md`, o novo ID é `DL-008`.

---

## Passo 2: Escolher um slug

O slug é uma descrição curta em kebab-case do tópico da decisão.

- Bom: `catalog-product-families`, `agent-skill-format`, `stack-medusa-v2`
- Ruim: `minha-decisao`, `update`, `fix`

O nome do arquivo final: `DL-NNN-slug.md`

---

## Passo 3: Preencher os campos obrigatórios

Você **deve**fornecer todos os campos obrigatórios. Não crie uma entrada com campos obrigatórios faltando.

```yaml
id: DL-NNN
title: "Título descritivo curto (5–120 caracteres)"
status: draft
date: AAAA-MM-DD   # data de hoje, ISO 8601
domain: plataforma  # veja a tabela de domínios na referência de schema
impact: médio       # baixo | médio | alto | crítico
context: |
  O que está acontecendo. Por que esta decisão é necessária agora.
  Forneça contexto suficiente para um agente que nunca viu este código.
problem: |
  O problema específico ou lacuna sendo abordado.
decision: |
  O que foi decidido. Seja explícito e preciso.
  Evite linguagem vaga como "vamos melhorar" — diga exatamente o que será feito.
```

---

## Passo 4: Adicionar campos opcionais (recomendado)

Adicione estes quando você tiver a informação:

```yaml
affected_files:
  - "apps/storefront/src/components/ProductCard.tsx"
  - "packages/catalog/src/families.ts"

approach: |
  Orientação de implementação: quais arquivos alterar, em que ordem,
  e quais padrões seguir.

alternatives_considered:
  - option: "Descrição da Opção A"
    reason_rejected: "Por que não foi escolhida"
  - option: "Descrição da Opção B"
    reason_rejected: "Por que não foi escolhida"

success_criteria:
  - "Todos os testes unitários Vitest passam"
  - "TypeScript compila sem erros"
  - "Funcionalidade está acessível no storefront"

consequences:
  positive:
    - "Reduz a complexidade no módulo de catálogo"
  negative:
    - "Requer migração de produtos existentes"
```

---

## Passo 5: Criar o arquivo

Crie o arquivo em: `design-log/DL-NNN-slug.md`

A estrutura do arquivo combina frontmatter YAML com seções em prosa Markdown. Veja o template em `reference/template.pt-BR.md` para o formato exato.

---

## Passo 6: Validar antes de salvar

Verifique se todos os campos obrigatórios estão presentes:

- [ ] `id` corresponde ao nome do arquivo
- [ ] `title` é conciso e descritivo
- [ ] `status` é `draft` (nunca crie com `approved` diretamente)
- [ ] `date` é hoje no formato ISO 8601
- [ ] `domain` é um dos valores válidos do enum
- [ ] `impact` é um de: `baixo`, `médio`, `alto`, `crítico`
- [ ] `context` explica o contexto de forma suficiente
- [ ] `problem` é específico (não vago)
- [ ] `decision` é explícito (não vago)

---

## Passo 7: Notificar o usuário

Após criar o rascunho:

1. Mostre ao usuário o nome do arquivo e um resumo da decisão
2. Pergunte se desejam revisar e aprovar agora
3. Lembre-os:**apenas entradas `approved` têm autoridade vinculante sobre agentes**---

## Fluxo de Promoção de Status

Um agente cria entradas em `draft`. O status é promovido por humanos (ou explicitamente pelo agente com confirmação do usuário):

```
draft → review → approved → executing → done
                          ↘ rejected
                 superseded (pode acontecer de qualquer estado terminal)
```

Não se auto-promova além de `draft` sem confirmação explícita do usuário.

---

## Substituindo uma entrada existente

Se a nova decisão substitui uma entrada `approved` existente:

1. Adicione `supersedes: DL-NNN` ao frontmatter da nova entrada
2. Atualize o `status` da entrada antiga para `superseded`
3. Adicione uma nota na entrada antiga apontando para a nova**Não edite o conteúdo de uma entrada aprovada**— atualize apenas o campo `status`.

---

## Arquivos de referência

-**Template**: `skills/design-log-create/reference/template.pt-BR.md`
- **Schema**: `skills/design-log-workflow/reference/schema.pt-BR.md`
- **Exemplo de entrada**: `design-log/DL-000-bootstrap.md`
