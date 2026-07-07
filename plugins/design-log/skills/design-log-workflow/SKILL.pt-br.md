---
name: design-log-workflow
description: Use this skill whenever you are about to implement, modify, refactor, or make any architectural decision in the YSH Store project. This is the mandatory pre-action consultation protocol — scan existing design-log entries to understand the project's decisions and constraints before writing any code.
---

# Fluxo de Trabalho do Design-Log

**Esta prática é obrigatória. Não a ignore.** Antes de qualquer implementação, refatoração ou decisão arquitetônica, você DEVE consultar o design-log. Isso está definido no arquivo `AGENTS.md`, na Seção 2.1, e é inegociável.

---

## Fase 1 — Consulta pré-ação (SEMPRE execute antes da codificação)

### Etapa 1: Analise a pasta design-log

```bash
ls design-log/
```

Analise a lista de arquivos. As entradas seguem o formato de nomenclatura: `DL-NNN-slug.md`

### Etapa 2: Identifique as entradas relevantes

Correlacione as entradas com a tarefa atual por meio de:

- **Palavras-chave do domínio** no slug do nome do arquivo (por exemplo, `catalogo`, `agente`, `stack`, `plataforma`)
- **Entradas recentes** (os números mais altos são os mais recentes)
- O arquivo `DL-000-bootstrap.md` é sempre relevante — ele contém a base da plataforma

### Etapa 3: Leia as entradas relevantes

Para cada entrada relevante, leia:

1. `status` — **apenas as entradas com `approved` e `executing` têm validade vinculativa**
2. `domain` e `impact` — para entender o escopo
3. `context` — por que essa decisão existe
4. `decision` — o que foi decidido (é a isso que você deve se alinhar)
5. `approach` — como implementar (se houver, siga essa orientação)
6. `affected_files` — quais arquivos/módulos são regidos por essa decisão

### Etapa 4: Verifique se há contradições

Antes de escrever código, pergunte-se:

- A implementação que planejo realizar contradiz alguma decisão `aprovada` ou `em execução`?
- Se sim: **PARE. Não prossiga.** Informe a contradição ao usuário e proponha:
  - Uma implementação alinhada à decisão existente, ou
  - Uma nova entrada no `design-log` com status `rascunho` que substitua a que está em contradição (use a habilidade `design-log-create`)

### Etapa 5: Alinhar e prosseguir

Implemente de acordo com as decisões aprovadas. O design-log é a única fonte de verdade para a direção arquitetônica.

---

## Fase 2 — Durante a implementação

### Se você se deparar com um problema inesperado

1. Crie uma nova entrada no design-log com `status: draft` (use a habilidade `design-log-create`)
2. Documente o problema nos campos `context` e `problem`
3. Proponha uma solução no campo `decision`
4. Apresente ao usuário para revisão — não aprove por conta própria
5. Só prossiga depois que a entrada for promovida para `approved`

### Se você descobrir uma decisão não documentada que já está sendo seguida

Documente-a retroativamente. Crie uma nova entrada registrando a decisão implícita para que ela se torne explícita e pesquisável.

---

## Fase 3 — Atualização pós-implementação

Após concluir o trabalho correspondente a uma entrada do diário de projeto:

1. Localize a entrada (por exemplo, `DL-007-catalog-strategy.md`)
2. Atualize o `status` de `executing` para `done`
3. Adicione a seção `evidence`:

```yaml
evidence:
  pr_url: "https://github.com/boldsbrainai/ysh-store/pull/NNN"
  commit_sha: "abc1234"
  test_output: "All Vitest tests pass. TypeScript compile clean."
  notes: "Optional notes about execution details."
```

1. Se esse trabalho revelou uma nova regra recorrente, adicione-a ao `AGENTS.md` e documente-a no campo `agents_rule_derived`

---

## Referência rápida de domínios

Ao analisar os logs, relacione esses domínios à sua tarefa:

| Domínio | O que abrange |
|--------|----------------|
| `plataforma` | Pilha principal, estrutura de repositórios, ferramentas |
| `catálogo` | Catálogo de produtos, famílias, variantes |
| `agente` | Regras do agente de IA, AGENTS.md, habilidades |
| `stack` | Escolhas de pilha tecnológica (Medusa, Next.js, etc.) |
| `lifecycle` | Implantação, ambiente, CI/CD |
| `sistema` | Questões transversais do sistema |
| `segurança` | Autenticação, permissões, segurança |
| `observabilidade` | Registro de logs, monitoramento, rastreamento |
| `ux` | Decisões de UI/UX, sistema de design |
| `integração` | APIs externas, webhooks, integrações |
| `testes` | Estratégia de testes, requisitos de cobertura |

---

## Regras de autoridade de status

| Status | Comportamento do agente |
|--------|----------------|
| `rascunho` | Apenas informativo — sem caráter vinculativo |
| `revisão` | Apenas informativo — aguardando aprovação |
| `aprovado` | **VINCULATIVO** — esta decisão deve ser seguida |
| `em execução` | **VINCULATIVO** — sendo implementado ativamente |
| `concluído` | Apenas para referência — a decisão foi executada |
| `rejeitado` | Ignorar — a decisão não foi adotada |
| `substituído` | Ignorar — substituído por uma entrada mais recente |

---

## Regras de Ouro (de `design-log/README.md`)

1. **Contexto > Prompt** — Nunca substitua o contexto acumulado por um prompt engenhoso
2. **Imutabilidade** — Registros aprovados não são editados; eles são substituídos por novas entradas
3. **A evidência é obrigatória** — “Concluído” sem evidência significa que não está concluído
4. **Erros se tornam regras** — Bugs recorrentes devem se tornar regras no `AGENTS.md`, referenciadas no DL
5. **O sistema aprende, não o modelo** — A memória fica nos arquivos, não nas sessões

---

## Referência

- Definição completa do esquema: `skills/design-log-workflow/reference/schema.md`
- Criação de uma nova entrada: use a habilidade `design-log-create`
- Entrada inicial (base da arquitetura): `design-log/DL-000-bootstrap.md`
