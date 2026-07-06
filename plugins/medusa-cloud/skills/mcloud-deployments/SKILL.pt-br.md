---
name: mcloud-deployments
description: Execute mcloud deployments commands to list deployments, retrieve deployment details, and fetch build logs. Use when listing deployments, checking deployment status, or reading build output for debugging build failures.
allowed-tools: Bash(mcloud deployments*), Bash(jq*)
---

# CLI do Cloud: Comandos de implantação

Execute os comandos `mcloud deployments` para verificar as implantações e seus logs de compilação.

## Restrições

- Sempre utilize a opção `--json` ao analisar a saída — o formato de texto simples pode sofrer alterações.
- Sempre confirme o contexto (`mcloud whoami --json`) antes de executar comandos, caso a organização ou o projeto ainda não sejam conhecidos.
- Use IDs de `--deployment` no formato `depl_*` ou IDs de compilação; os IDs de compilação são automaticamente mapeados para a implantação mais recente.

## Comandos

### lista de implantações

Lista as implantações recentes de um projeto (padrão: as 20 mais recentes em todos os ambientes).

```bash
mcloud deployments list --organization <org-id> --project <project-id-or-handle> --json
```

**Opções:**

- `-o/--organization <id>` — ID da organização (usa o contexto ativo como padrão)
- `-p/--project <id-ou-identificador>` — ID ou identificador do projeto (usa o contexto ativo como padrão)
- `-e/--environment <identificador>` — Filtrar por identificador do ambiente
- `--environment-type <production|long-lived|preview>` — Filtrar por tipo de ambiente
- `--commit <sha>` — Filtrar por SHA do commit do Git (completo ou prefixo)
- `--limit <1-200>` — Número máximo de resultados (padrão: `20`)
- `--offset <número>` — Deslocamento de paginação (padrão: `0`)
- `--json` — Exibe como JSON

### recuperação de implantações

Recupera os detalhes de uma única implantação por ID.

```bash
mcloud deployments get <deployment-id> --organization <org-id> --project <project-id-or-handle> --json
```

**Argumentos:**

- `deployment` — ID da implantação (obrigatório)

**Opções:**

- `-o/--organization <id>`, `-p/--project <id-or-handle>`, `--json`

### logs-de-compilação-de-implantações

Busca os logs de compilação de uma implantação. Use isso para depurar o status `build-failed`.

```bash
mcloud deployments build-logs <deployment-id> --organization <org-id> --project <project-id-or-handle>
```

**Argumentos:**

- `deployment` — ID da implantação (obrigatório)

**Opções:**

- `-o/--organization <id>`, `-p/--project <id-or-handle>`
- `--type <backend|storefront>` — Qual fluxo de log de compilação deve ser lido (padrão: `backend`)
- `--json` — Exibir como JSON

## Status de implantação

| Status | Significado |
|--------|---------|
| `created` | Compilação ainda não iniciada |
| `building` | Compilação em andamento |
| `built` | Compilação bem-sucedida, aguardando implantação |
| `deploying` | Implantação no ambiente |
| `deployed` | Em produção e atendendo ao tráfego |
| `build-failed` | Etapa de compilação falhou — consulte `build-logs` |
| `deployment-failed` | Compilação bem-sucedida, falha no tempo de execução — consulte `mcloud logs` |
| `timed-out` | Tempo limite excedido (somente backend) |
| `canceled` | Substituída por uma implantação mais recente |
| `idle` | Não é mais a implantação ativa |

## Exemplos

```bash
# List all deployments (with active context set)
mcloud deployments list --json

# Find most recent build-failed deployment
mcloud deployments list --json \
  | jq -r '[.[] | select(.backend_status == "build-failed")][0].id'

# Get deployment details
mcloud deployments get bld_01ABC123 --json

# Read backend build logs
mcloud deployments build-logs bld_01ABC123

# Read storefront build logs
mcloud deployments build-logs bld_01ABC123 --type storefront

# Filter deployments by commit SHA
mcloud deployments list --commit a1b2c3d --json | jq '.'

# Get deployments for a specific environment
mcloud deployments list --environment production --json
```
