---
name: mcloud-variables
description: Execute mcloud variables commands to list and get environment variables for a Cloud environment. Use when inspecting, reading, or exporting environment variables. Never pass --reveal unless the user explicitly requests secret values.
allowed-tools: Bash(mcloud variables*), Bash(jq*)
---

# CLI do Cloud: Comandos de variáveis

Execute o comando `mcloud variables` para verificar as variáveis de ambiente dos ambientes do Cloud.

## Restrições

- **Nunca utilize a opção `--reveal`, a menos que o usuário solicite explicitamente.** Os valores confidenciais aparecem no histórico do terminal, em agregadores de logs e em listagens de processos.
- A pesquisa por chave requer `--project` e `--environment` (ou o equivalente no contexto ativo). A pesquisa por ID (`var_...`) funciona sem o contexto de projeto/ambiente.

## Comandos

### lista de variáveis

Lista todas as variáveis de ambiente para um ambiente do Cloud.

```bash
mcloud variables list \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  --json
```

**Opções:**

- `-o/--organization <id>` — ID da organização (usa o contexto ativo como padrão)
- `-p/--project <id-ou-identificador>` — ID ou identificador do projeto (usa o contexto ativo como padrão)
- `-e/--environment <identificador>` — Identificador do ambiente (usa o contexto ativo como padrão)
- `--reveal` — Exibe valores secretos em texto simples, em vez de mascará-los (**use apenas quando solicitado explicitamente**)
- `--limit <1-500>` — Número máximo de resultados (padrão: `200`)
- `--offset <número>` — Deslocamento da paginação (padrão: `0`)
- `--json` — Exibe como JSON

### obtenção de variáveis

Recupera uma única variável por seu ID (`var_...`) ou chave.

```bash
# By key (requires project + environment context)
mcloud variables get ADMIN_CORS \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  --json

# By ID (works without project/environment context)
mcloud variables get var_01XYZ --json
```

**Argumentos:**

- `variable` — ID da variável (`var_...`) ou chave (obrigatório)

**Opções:**

- `-o/--organization <id>`, `-p/--project <id-ou-identificador>`, `-e/--environment <identificador>`
- `--reveal` — Exibe o valor secreto em texto simples (**use apenas quando solicitado explicitamente**)
- `--json` — Exibe o resultado como JSON

## Campos da variável (JSON)

| Campo | Descrição |
|-------|-------------|
| `id` | ID da variável (`var_...`) |
| `key` | Nome da variável (por exemplo, `ADMIN_CORS`) |
| `value` | Valor da variável (ocultado se `is_secret` e `--reveal` não forem passados) |
| `is_secret` | Se a variável é tratada como um segredo |
| `is_build` | Disponível no momento da compilação |
| `is_runtime` | Disponível no momento da execução |
| `entity_id` | O ID do ambiente ao qual esta variável pertence |

## Exemplos

```bash
# List all variables for the active environment
mcloud variables list --json

# Get a variable by key (with active context)
mcloud variables get DATABASE_URL --json

# Get a variable by ID (no env context needed)
mcloud variables get var_01XYZ --json

# Only reveal secrets when user explicitly asks
mcloud variables get STRIPE_SECRET_KEY --reveal --json | jq -r '.value'

# Export all variables to a .env file (user must explicitly request --reveal)
mcloud variables list --reveal --json \
  | jq -r '.[] | "\(.key)=\(.value)"' \
  > .env

# List only runtime variables
mcloud variables list --json | jq '[.[] | select(.is_runtime == true)]'

# Check if a specific variable exists
mcloud variables list --json | jq '.[] | select(.key == "REDIS_URL")'
```
