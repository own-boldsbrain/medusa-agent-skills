# Referência de Schema do Design-Log

Referência completa de campos para entradas do Design-Log do YSH Store. Fonte da verdade: `design-log/schema.json`.

---

## Campos Obrigatórios

Todas as entradas **devem**incluir estes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | ID único. Formato: `DL-NNN` (ex.: `DL-001`, `DL-042`) |
| `title` | `string` | Título descritivo curto. Mín. 5, máx. 120 caracteres |
| `status` | `enum` | Status do ciclo de vida (veja tabela abaixo) |
| `date` | `string` | Data ISO 8601 (ex.: `2026-04-09`) |
| `domain` | `enum` | Domínio principal (veja tabela abaixo) |
| `impact` | `enum` | Nível de impacto: `baixo` \| `médio` \| `alto` \| `crítico` |
| `context` | `string` | Contexto: o que está acontecendo, por que esta decisão é necessária agora? Mín. 20 caracteres |
| `problem` | `string` | Problema ou lacuna específica que precisa ser resolvida. Mín. 10 caracteres |
| `decision` | `string` | O que foi decidido — seja específico e preciso. Mín. 10 caracteres |

---

## Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `affected_files` | `string[]` | Arquivos ou módulos diretamente impactados |
| `supersedes` | `string` | ID da entrada que esta substitui (ex.: `DL-002`) |
| `related` | `string[]` | IDs de entradas relacionadas (ex.: `["DL-001", "DL-003"]`) |
| `approach` | `string` | Orientação de implementação — quais arquivos, qual sequência |
| `alternatives_considered` | `object[]` | Cada um: `{ option, reason_rejected }` |
| `success_criteria` | `string[]` | Prova mensurável de conclusão |
| `consequences` | `object` | `{ positive: string[], negative: string[] }` |
| `evidence` | `object` | `{ pr_url, commit_sha, test_output, notes }` — obrigatório quando status = `done` |
| `agents_rule_derived` | `string` | Nova regra adicionada ao `AGENTS.md` derivada desta entrada |

---

## Valores de Status

| Status | Significado | Autoridade do agente |
|--------|------------|----------------------|
| `draft` | Sendo escrito | Nenhuma |
| `review` | Aguardando aprovação humana | Nenhuma |
| `approved` | Aprovado, ainda não iniciado |**VINCULANTE**|
| `executing` | Sendo implementado ativamente |**VINCULANTE**|
| `done` | Concluído com evidência | Referência |
| `rejected` | Não adotado | Ignorar |
| `superseded` | Substituído por entrada mais nova | Ignorar |

---

## Valores de Domínio

| Domínio | Escopo |
|---------|--------|
| `plataforma` | Stack principal, estrutura do repositório, monorepo, ferramentas |
| `catálogo` | Catálogo de produtos, famílias de painéis solares, variantes, preços |
| `agente` | Regras de agentes de IA, AGENTS.md, skills, plugins |
| `stack` | Escolhas tecnológicas (Medusa v2, Next.js 15, pnpm, etc.) |
| `lifecycle` | Pipeline de deploy, ambientes, CI/CD, branches |
| `sistema` | Preocupações transversais, módulos compartilhados, padrões de arquitetura |
| `segurança` | Autenticação, autorização, segredos, permissões |
| `observabilidade` | Logging, monitoramento, rastreamento, relatório de erros |
| `ux` | Decisões de UI/UX, design de componentes, fluxos do usuário |
| `integração` | APIs externas, webhooks, serviços de terceiros |
| `testes` | Estratégia de testes, Vitest, limites de cobertura, E2E |

---

## Valores de Impacto

| Valor | Significado |
|-------|-------------|
| `baixo` | Impacto mínimo — mudança localizada |
| `médio` | Impacto moderado — afeta um módulo ou funcionalidade |
| `alto` | Alto impacto — afeta múltiplos módulos ou comportamento visível ao usuário |
| `crítico` | Impacto crítico — afeta a arquitetura central ou a estabilidade da plataforma |

---

## Frontmatter vs Corpo Markdown

Uma entrada de design-log é um arquivo Markdown. O frontmatter YAML contém os campos estruturados acima. O corpo Markdown**espelha** o frontmatter com seções em prosa legíveis:

```markdown
---
id: DL-NNN
title: ...
status: draft
date: AAAA-MM-DD
domain: plataforma
impact: médio
...
---

## Contexto
[versão em prosa do campo context]

## Problema
[versão em prosa do campo problem]

## Decisão
[versão em prosa do campo decision]

## Abordagem
[opcional — orientação de implementação]

## Alternativas Consideradas
[opcional]

## Critérios de Sucesso
[opcional]

## Consequências
[opcional]

## Evidência
[obrigatório quando status = done]
```

Tanto o frontmatter quanto as seções Markdown devem ser mantidos sincronizados.
