---
name: mcloud-logs
description: Execute mcloud logs to fetch and stream runtime logs for Cloud environments. Use when reading backend or storefront logs, filtering by time range, searching for errors, or scoping logs to a specific deployment.
allowed-tools: Bash(mcloud logs*), Bash(jq*)
---

# CLI do Cloud: Comando Logs

Execute `mcloud logs` para obter os logs de execução do backend ou da storefront de um ambiente do Cloud.

## Restrições

- `--follow` e `--json` são incompatíveis. Para análise programática de logs, use intervalos de tempo delimitados com `--from`/`--to` e `--json`.
- `--follow` acompanha os fluxos até ser interrompido com `Ctrl+C` — não use em scripts ou pipelines.
- Por padrão, recupera as últimas 500 linhas de log dos últimos 15 minutos.

## Comando

```bash
mcloud logs \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  [options]
```

## Opções

| Opção | Descrição | Padrão |
|--------|-------------|---------|
| `-o/--organization <id>` | ID da organização | Contexto ativo |
| `-p/--project <id-or-handle>` | ID ou identificador do projeto | Contexto ativo |
| `-e/--environment <handle>` | Identificador do ambiente | Contexto ativo |
| `-f/--follow` | Transmite logs continuamente (incompatível com `--json`) | `false` |
| `--limit <1-5000>` | Número máximo de linhas de log (somente no modo sem acompanhamento) | `500` |
| `--from <ISO8601>` | Início do intervalo de tempo (por exemplo, `2026-04-22T10:00:00Z`) | 15 minutos atrás |
| `--to <ISO8601>` | Fim do intervalo de tempo; se for há mais de 15 minutos, também é necessário especificar `--from` | agora |
| `--search <string>` | Filtrar por substring (igual à barra de pesquisa do painel) | — |
| `--deployment <id>` | Filtrar por ID de implantação ou compilação | — |
| `--source <string>` | Filtrar por fonte (repetível) | — |
| `--metadata <chave=valor>` | Filtrar por campo de metadados (repetível; valores com a mesma chave são agrupados) | — |
| `--type <backend\|storefront>` | Fluxo de log a ser consultado | `backend` |
| `--json` | Saída como JSON (incompatível com `--follow`) | `false` |

## Exemplos

```bash
# Basic log fetch (last 500 lines, last 15 min)
mcloud logs --json

# Search for errors
mcloud logs --search error --limit 1000 --json

# Filter for HTTP 500 errors via metadata
mcloud logs --metadata status=500 --limit 1000 --json

# Logs for a specific deployment (build or deployment ID)
mcloud logs --deployment bld_01ABC123 --json

# Structured output for agent analysis
mcloud logs --search error --json | jq '.[] | {timestamp, source, message}'

# Storefront logs
mcloud logs --type storefront --json

# Stream live logs (human-readable, not for scripts)
mcloud logs --follow

# Logs within a specific time range
mcloud logs --from 2026-04-22T10:00:00Z --to 2026-04-22T11:00:00Z --limit 1000 --json

# Logs from a time until now
mcloud logs --from 2026-04-22T10:00:00Z --json

# Multiple source filters
mcloud logs --source api --source worker --json

# Multiple metadata filters (HTTP 4xx and 5xx)
mcloud logs --metadata status=400 --metadata status=500 --limit 500 --json
```

## Observações sobre o intervalo de tempo

- A janela padrão abrange os últimos 15 minutos.
- Passe `--from` sem `--to` para buscar dados desde um determinado momento até o presente.
- Passe `--to` sem `--from` somente se `--to` estiver dentro dos últimos 15 minutos; caso contrário, passe também `--from`.
- Tanto `--from` quanto `--to` aceitam carimbos de data e hora no formato ISO 8601.
