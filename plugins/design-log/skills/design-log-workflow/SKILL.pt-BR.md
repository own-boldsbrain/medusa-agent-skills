---
name: design-log-workflow
description: Use esta skill sempre que for implementar, modificar, refatorar ou tomar qualquer decisão arquitetural no projeto YSH Store. Este é o protocolo obrigatório de consulta pré-ação — escanear entradas de design-log existentes para entender as decisões e restrições do projeto antes de escrever qualquer código.
---

# Workflow de Design-Log

**Esta skill é obrigatória. Não a ignore.**Antes de qualquer implementação, refatoração ou decisão arquitetural, você DEVE consultar o design-log. Isso está definido na Seção 2.1 do `AGENTS.md` e é inegociável.

---

## Fase 1 — Consulta Pré-Ação (SEMPRE execute antes de codificar)

### Passo 1: Escanear a pasta design-log

```bash
ls design-log/
```

Revise a lista de arquivos. As entradas seguem o formato de nomenclatura: `DL-NNN-slug.md`

### Passo 2: Identificar entradas relevantes

Relacione entradas à tarefa atual por:

-**Palavras-chave de domínio**no slug do nome de arquivo (ex.: `catalogo`, `agente`, `stack`, `plataforma`)
-**Entradas recentes**(números mais altos são os mais recentes)
- O `DL-000-bootstrap.md` é sempre relevante — contém a fundação da plataforma

### Passo 3: Ler as entradas relevantes

Para cada entrada relevante, leia:

1. `status` —**apenas entradas `approved` e `executing` têm autoridade vinculante**2. `domain` e `impact` — para entender o escopo
3. `context` — por que esta decisão existe
4. `decision` — o que foi decidido (é isso que você deve seguir)
5. `approach` — como implementar (se presente, siga-o)
6. `affected_files` — quais arquivos/módulos são governados por esta decisão

### Passo 4: Verificar contradições

Antes de escrever código, pergunte:

- Minha implementação planejada contradiz alguma decisão `approved` ou `executing`?
- Se sim:**PARE. Não continue.**Reporte a contradição ao usuário e proponha:
  - Uma implementação alinhada com a decisão existente, ou
  - Uma nova entrada `draft` de design-log que substitui a decisão contradita (use a skill `design-log-create`)

### Passo 5: Alinhar e prosseguir

Implemente de acordo com as decisões aprovadas. O design-log é a única fonte de verdade para direção arquitetural.

---

## Fase 2 — Durante a Implementação

### Se você ficar bloqueado por um problema não antecipado

1. Crie uma nova entrada de design-log com `status: draft` (use a skill `design-log-create`)
2. Documente o problema nos campos `context` e `problem`
3. Proponha uma solução no campo `decision`
4. Apresente ao usuário para revisão — não se auto-aprove
5. Só prossiga depois que a entrada for promovida para `approved`

### Se você descobrir uma decisão não documentada que já está sendo seguida

Documente retroativamente. Crie uma nova entrada capturando a decisão implícita para que ela se torne explícita e pesquisável.

---

## Fase 3 — Atualização Pós-Implementação

Após concluir um trabalho correspondente a uma entrada de design-log:

1. Encontre a entrada (ex.: `DL-007-catalog-strategy.md`)
2. Atualize `status` de `executing` → `done`
3. Adicione a seção `evidence`:

```yaml
evidence:
  pr_url: "https://github.com/boldsbrainai/ysh-store/pull/NNN"
  commit_sha: "abc1234"
  test_output: "Todos os testes Vitest passaram. TypeScript compilou sem erros."
  notes: "Notas opcionais sobre detalhes de execução."
```

1. Se o trabalho revelou uma nova regra recorrente, adicione-a ao `AGENTS.md` e documente no campo `agents_rule_derived`

---

## Referência Rápida de Domínios

Ao escanear logs, associe estes domínios à sua tarefa:

| Domínio | O que governa |
|---------|--------------|
| `plataforma` | Stack principal, estrutura do repositório, ferramentas |
| `catálogo` | Catálogo de produtos, famílias, variantes |
| `agente` | Regras de agentes de IA, AGENTS.md, skills |
| `stack` | Escolhas de stack tecnológico (Medusa, Next.js, etc.) |
| `lifecycle` | Deploy, ambiente, CI/CD |
| `sistema` | Preocupações transversais do sistema |
| `segurança` | Auth, permissões, segurança |
| `observabilidade` | Logging, monitoramento, rastreamento |
| `ux` | Decisões de UI/UX, sistema de design |
| `integração` | APIs externas, webhooks, integrações |
| `testes` | Estratégia de testes, requisitos de cobertura |

---

## Regras de Autoridade por Status

| Status | Comportamento do agente |
|--------|------------------------|
| `draft` | Apenas informativo — sem autoridade vinculante |
| `review` | Apenas informativo — aguardando aprovação |
| `approved` |**VINCULANTE**— deve seguir esta decisão |
| `executing` |**VINCULANTE**— sendo implementado ativamente |
| `done` | Apenas referência — decisão foi executada |
| `rejected` | Ignorar — decisão não foi adotada |
| `superseded` | Ignorar — substituído por uma entrada mais nova |

---

## Regras de Ouro (do `design-log/README.md`)

1.**Contexto > Prompt**— Nunca substitua o contexto acumulado por um prompt inteligente
2.**Imutabilidade**— Logs aprovados não são editados; são substituídos por novas entradas
3.**Evidência é obrigatória**— "Feito" sem evidência significa que não está feito
4.**Erros viram regras**— Bugs recorrentes devem virar regras no `AGENTS.md`, referenciadas no DL
5.**O sistema aprende, não o modelo** — A memória fica em arquivos, não em sessões

---

## Referência

- Definição completa do schema: `skills/design-log-workflow/reference/schema.pt-BR.md`
- Criar uma nova entrada: use a skill `design-log-create`
- Entrada bootstrap (fundação arquitetural): `design-log/DL-000-bootstrap.md`
