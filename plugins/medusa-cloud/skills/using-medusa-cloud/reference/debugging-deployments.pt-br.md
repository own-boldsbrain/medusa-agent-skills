# Depuração de implantações

## Inspeção de implantações

Campos de status por implantação: `backend_status` e `storefront_status`.

Valores: `created`, `building`, `built`, `deploying`, `deployed`, `build-failed`, `deployment-failed`, `timed-out` (somente backend), `canceled`, `idle`.

```bash
# Most recent failed deployment
mcloud deployments list --json \
  | jq -r '[.[] | select(.backend_status == "build-failed" or .backend_status == "deployment-failed")][0].id'

# Deployments for a specific commit
mcloud deployments list --commit a1b2c3d --json | jq '.'

# Only preview deployments
mcloud deployments list --environment-type preview --json | jq '.'

# Single deployment details
mcloud deployments get bld_01ABC123 --json
```

## Receta de falha na compilação

Use quando `backend_status == "build-failed"`:

```bash
# Find the most recent build-failed deployment
DEPLOYMENT_ID=$(
  mcloud deployments list --json \
    | jq -r '[.[] | select(.backend_status == "build-failed")][0].id'
)

# Inspect deployment metadata
mcloud deployments get "$DEPLOYMENT_ID" --json

# Read the build output
mcloud deployments build-logs "$DEPLOYMENT_ID"

# For storefront build failures
mcloud deployments build-logs "$DEPLOYMENT_ID" --type storefront
```

`build-logs` retorna um campo `build_status`. Quando o valor for `failed`, verifique `metadata.failed_docker_layer` por meio do comando `mcloud deployments get --json` para identificar a camada que apresentou falha.

## Receita para falha na implantação

Use quando `backend_status == "deployment-failed"` (a compilação foi bem-sucedida, mas o ambiente de execução travou):

```bash
# Find the most recent deployment-failed
DEPLOYMENT_ID=$(
  mcloud deployments list --json \
    | jq -r '[.[] | select(.backend_status == "deployment-failed")][0].id'
)

# Runtime logs for that deployment
mcloud logs --deployment "$DEPLOYMENT_ID" --limit 1000

# Error-level lines only
mcloud logs --deployment "$DEPLOYMENT_ID" --search error --limit 1000

# Filter by HTTP status
mcloud logs --deployment "$DEPLOYMENT_ID" --metadata status=500 --limit 1000

# Structured analysis
mcloud logs --deployment "$DEPLOYMENT_ID" --json | jq '.[] | {timestamp, source, message}'
```

> **Observação:** `--follow` não pode ser combinado com `--json`. Use intervalos de tempo delimitados com `--from`/`--to` e `--json` para scripts.

## Reexecutando uma implantação

Duas opções — não intercambiáveis:

**Reimplantar (correção no ambiente):** Reexecuta a compilação existente da implantação ativa. Use quando a correção for uma alteração de variável ou um problema de infraestrutura.

```bash
mcloud environments redeploy env_123
```

Requer que o ambiente tenha uma implantação ativa. Caso contrário, use `trigger-build` primeiro.

**Acionar compilação (correção no código-fonte):** Inicia uma nova compilação a partir do branch rastreado. Use quando a correção estiver no código confirmado.

```bash
mcloud environments trigger-build env_123
```

**Verifique a nova compilação:**

```bash
mcloud deployments list --environment env_123 --limit 5 --json \
  | jq '.[] | {id, backend_status, commit_hash, updated_at}'
```
