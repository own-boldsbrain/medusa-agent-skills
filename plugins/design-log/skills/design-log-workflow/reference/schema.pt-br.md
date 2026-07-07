# Referência do esquema do Design-Log

Referência completa dos campos para as entradas do Design-Log da YSH Store. Fonte oficial: `design-log/schema.json`.

---

## Campos obrigatórios

Todas as entradas **devem** incluir estes campos:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `id` | `string` | ID exclusivo. Formato: `DL-NNN` (por exemplo, `DL-001`, `DL-042`) |
| `title` | `string` | Título descritivo curto. Mínimo de 5, máximo de 120 caracteres |
| `status` | `enum` | Status do ciclo de vida (veja a tabela abaixo) |
| `date` | `string` | Data no formato ISO 8601 (por exemplo, `2026-04-09`) |
| `domínio` | `enum` | Domínio principal (veja a tabela abaixo) |
| `impacto` | `enum` | Nível de impacto: `baixo` \| `médio` \| `alto` \| `crítico` |
| `contexto` | `string` | Contexto: o que está acontecendo, por que essa decisão é necessária agora? Mínimo de 20 caracteres |
| `problema` | `string` | Problema específico ou lacuna que precisa ser resolvida. Mínimo de 10 caracteres |
| `decisão` | `string` | O que foi decidido — seja específico e preciso. Mínimo de 10 caracteres |

---

## Campos opcionais

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `affected_files` | `string[]` | Arquivos ou módulos diretamente afetados |
| `supersedes` | `string` | ID da entrada que esta substitui (por exemplo, `DL-002`) |
| `related` | `string[]` | IDs das entradas relacionadas (por exemplo, `["DL-001", "DL-003"]`) |
| `abordagem` | `string` | Orientação de implementação — quais arquivos, em que sequência |
| `alternativas_consideradas` | `object[]` | Cada uma: `{ opção, motivo_da_rejeição }` |
| `critérios_de_sucesso` | `string[]` | Prova mensurável de conclusão |
| `consequências` | `object` | `{ positivas: string[], negativas: string[] }` |
| `evidence` | `object` | `{ pr_url, commit_sha, test_output, notes }` — obrigatório para o status `done` |
| `agents_rule_derived` | `string` | Nova regra adicionada ao `AGENTS.md`, derivada desta entrada |

---

## Valores de status

| Status | Significado | Autoridade do agente |
|--------|---------|----------------|
| `draft` | Em fase de redação | Nenhuma |
| `review` | Aguardando aprovação humana | Nenhuma |
| `approved` | Aprovado, ainda não iniciado | **VINCULANTE** |
| `executing` | Em fase de implementação | **VINCULANTE** |
| `done` | Concluído com evidência | Referência |
| `rejeitado` | Não adotado | Ignorar |
| `substituído` | Substituído por uma entrada mais recente | Ignorar |

---

## Valores de domínio

| Domínio | Escopo |
|--------|-------|
| `plataforma` | Pilha principal, estrutura do repositório, monorepo, ferramentas |
| `catálogo` | Catálogo de produtos, famílias de painéis solares, variantes, preços |
| `agente` | Regras do agente de IA, AGENTS.md, habilidades, plug-ins |
| `stack` | Escolhas tecnológicas (Medusa v2, Next.js 15, pnpm, etc.) |
| `lifecycle` | Pipeline de implantação, ambientes, CI/CD, ramificações |
| `sistema` | Questões transversais, módulos compartilhados, padrões de arquitetura |
| `segurança` | Autenticação, autorização, segredos, permissões |
| `observabilidade` | Registro de logs, monitoramento, rastreamento, relatórios de erros |
| `ux` | Decisões de UI/UX, design de componentes, fluxos de usuários |
| `integração` | APIs externas, webhooks, serviços de terceiros |
| `testes` | Estratégia de testes, Vitest, limites de cobertura, E2E |

---

## Valores de impacto

| Valor | Significado |
|-------|---------|
| `baixo` | Impacto mínimo — alteração localizada |
| `médio` | Impacto moderado — afeta um módulo ou recurso |
| `alto` | Impacto alto — afeta vários módulos ou o comportamento visível ao usuário |
| `crítico` | Impacto crítico — afeta a arquitetura central ou a estabilidade da plataforma |

---

## Frontmatter x Corpo do Markdown

Uma entrada no design-log é um arquivo Markdown. O frontmatter em YAML contém os campos estruturados acima. O corpo do Markdown **reflete** o frontmatter com seções de texto legíveis para humanos:

```markdown
---
id: DL-NNN
title: ...
status: draft
date: YYYY-MM-DD
domain: plataforma
impact: médio
...
---

## Context
[prose version of context field]

## Problem
[prose version of problem field]

## Decision
[prose version of decision field]

## Approach
[optional — implementation guidance]

## Alternatives Considered
[optional]

## Success Criteria
[optional]

## Consequences
[optional]

## Evidence
[required when status = done]
```

Tanto as páginas preliminares quanto as seções em Markdown devem ser mantidas em sincronia.
