---
name: mcloud-organizations
description: Execute comandos mcloud organizations para listar ou obter organizações do Cloud. Use ao descobrir organizações, resolver IDs de organização pelo nome ou recuperar detalhes da organização, incluindo membros e assinatura.
allowed-tools: Bash(mcloud organizations*), Bash(mcloud use*), Bash(jq*)
---

# Cloud CLI: Comandos de Organizações

Execute o comando `mcloud organizations` para listar e recuperar organizações na nuvem.

## **Restrições**

- `organizations list` requer**autenticação pessoal**(login no navegador ou chave de acesso pessoal). Chaves de acesso de organização retornam 401 neste comando

- Quando autenticado com `MCLOUD_TOKEN` usando uma chave de acesso da org, utilize `mcloud whoami --json` para obter o ID da organização em vez disso.

## Comandos

#### Lista de Organizações

Liste todas as organizações às quais sua conta tem acesso.

```bash
mcloud organizations list --json
```

-*Opções:**- ```json

`--json` — Saída como JSON

```

### Organizações obtêm

Recupere uma única organização pelo ID. Retorna metadados, detalhes da assinatura e membros.

```bash
mcloud organizations get <organization-id> --json
```

-*Argumentos:**- `organization` — ID da organização (obrigatório)

-*Opções:**- `-o/--organization <id>` — Substituir a organização no contexto ativo (deve corresponder ao argumento)

- `--json` — Saída em JSON

## Campos da Organização (JSON)

| Campo | Descrição |
|-------|-------------|
| `id` | Organização ID |
| `nome` | Nome de exibição da organização |
| `billing_email` | E-mail de contato para cobrança |
| `status` | `ativo` ou não |
| `membros` | Array de objetos de membro com `id`, `role`, `user.email` |
| `assinatura` | Plano atual, período e flag `is_active` |
| `conta_corrente` | Detalhes do titular da conta de faturamento |

## **Exemplos**

```bash
# List all organizations
mcloud organizations list --json

# Set context to first organization
ORGANIZATION_ID=$(
  mcloud organizations list --json \
    | jq -r '.[0].id'
)
mcloud use --organization "$ORGANIZATION_ID"

# Find organization ID by name
ORGANIZATION_ID=$(
  mcloud organizations list --json \
    | jq -r '.[] | select(.name == "My Organization") | .id'
)

# Get organization details (subscription, members)
mcloud organizations get org_123 --json

# List member emails
mcloud organizations get org_123 --json \
  | jq -r '.members[].user.email'

# Check subscription plan
mcloud organizations get org_123 --json \
  | jq '{plan: .subscription.plan.name, status: .subscription.is_active}'
```
