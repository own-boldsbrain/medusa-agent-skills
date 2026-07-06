---
name: mcloud-organizations
description: Execute mcloud organizations commands to list or get Cloud organizations. Use when discovering organizations, resolving organization IDs by name, or retrieving organization details including members and subscription.
allowed-tools: Bash(mcloud organizations*), Bash(mcloud use*), Bash(jq*)
---

# CLI do Cloud: Comandos de organizações

Execute os comandos `mcloud organizations` para listar e recuperar organizações do Cloud.

## Restrições

- O comando `organizations list` requer **autenticação pessoal** (login no navegador ou chave de acesso pessoal). As chaves de acesso da organização retornam o código de erro 401 neste comando.
- Ao se autenticar com `MCLOUD_TOKEN` usando uma chave de acesso da organização, use `mcloud whoami --json` para obter o ID da organização.

## Comandos

### listar organizações

Lista todas as organizações às quais sua conta tem acesso.

```bash
mcloud organizations list --json
```

**Opções:**
- `--json` — Exibe o resultado em formato JSON

### obter organizações

Recupera uma única organização pelo ID. Retorna metadados, detalhes da assinatura e membros.

```bash
mcloud organizations get <organization-id> --json
```

**Argumentos:**
- `organization` — ID da organização (obrigatório)

**Opções:**
- `-o/--organization <id>` — Substitui a organização no contexto ativo (deve corresponder ao argumento)
- `--json` — Exibe o resultado em JSON

## Campos da organização (JSON)

| Campo | Descrição |
|-------|------- ------|
| `id` | ID da organização |
| `name` | Nome de exibição da organização |
| `billing_email` | E-mail de contato para cobrança |
| `status` | `active` ou outro valor |
| `members` | Matriz de objetos de membros com `id`, `role`, `user.email` |
| `subscription` | Plano atual, período e sinalizador `is_active` |
| `account_holder` | Dados do titular da conta de cobrança |

## Exemplos

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
