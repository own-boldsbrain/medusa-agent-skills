# Template de Entrada Design-Log

Copie este template ao criar uma nova entrada de design-log. Salve como `design-log/DL-NNN-slug.md`.

---

```markdown
---
id: DL-NNN
title: "Título descritivo curto da decisão"
status: draft
date: AAAA-MM-DD
domain: plataforma
impact: médio
context: |
  Descreva o contexto de fundo aqui.
  Qual é a situação atual? Por que esta decisão é necessária agora?
  Inclua detalhes suficientes para um agente ou desenvolvedor que nunca viu este código.
problem: |
  Qual problema específico ou lacuna está sendo abordado?
  Seja concreto — evite declarações vagas.
decision: |
  O que foi decidido? Seja explícito e preciso.
  Declare exatamente o que será feito, não apenas o objetivo.
affected_files:
  - "caminho/para/arquivo1.ts"
  - "caminho/para/arquivo2.tsx"
supersedes: null
related: []
approach: |
  Como esta decisão será implementada?
  Liste os arquivos a alterar, a ordem das operações e quaisquer padrões a seguir.
alternatives_considered:
  - option: "Descrição da opção alternativa"
    reason_rejected: "Por que esta opção não foi escolhida"
success_criteria:
  - "Critério 1 — mensurável e verificável"
  - "Critério 2 — mensurável e verificável"
consequences:
  positive:
    - "Resultado positivo 1"
    - "Resultado positivo 2"
  negative:
    - "Tradeoff ou risco 1"
evidence: null
agents_rule_derived: null
---

## Contexto

[Versão em prosa do campo context acima. Escreva em frases completas.]

## Problema

[Versão em prosa do campo problem acima.]

## Decisão

[Versão em prosa do campo decision acima.]

## Abordagem

[Opcional — versão em prosa do campo approach. Inclua trechos de código se útil.]

## Alternativas Consideradas

[Opcional — descrição em prosa de alternativas que foram avaliadas mas não escolhidas.]

## Critérios de Sucesso

[Opcional — lista de critérios mensuráveis que provam que esta decisão foi implementada corretamente.]

## Consequências

[Opcional — quais são os resultados positivos e os tradeoffs desta decisão?]

## Evidência

[Obrigatório quando status = done. Preencha após a conclusão:]

- PR: [link]
- Commit: [sha]
- Resultado dos testes: [cole ou descreva]
- Notas: [qualquer contexto adicional sobre a implementação]
```

---

## Guia de remoção de campos

Ao criar uma entrada real, remova os campos opcionais que não se aplicam:

- Remova `supersedes` se isso não substitui uma entrada existente
- Remova `related` se não há entradas relacionadas
- Remova `alternatives_considered` se nenhuma alternativa foi avaliada
- Remova `consequences` se os tradeoffs ainda não são conhecidos
- Deixe `evidence: null` até que o status se torne `done`
- Deixe `agents_rule_derived: null` a menos que uma nova regra do AGENTS.md tenha sido criada

## Lembrete de convenção de nomenclatura

- Formato: `DL-NNN-slug-curto.md`
- NNN: número de 3 dígitos com zeros à esquerda (001, 042, 100)
- Slug: kebab-case em minúsculas, focado no tópico
- Exemplos: `DL-001-platform-foundation.md`, `DL-015-catalog-families.md`
