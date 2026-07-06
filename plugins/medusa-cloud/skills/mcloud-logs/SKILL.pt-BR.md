---
name: mcloud-logs
description: Execute mcloud logs para buscar e transmitir logs de execução para ambientes Cloud. Use ao ler logs do backend ou do storefront, filtrando por intervalo de tempo, buscando por erros ou limitando os logs a uma implantação específica.
allowed-tools: Bash(mcloud logs*), Bash(jq*)
---

# CLI do Cloud: Comando de Logs

Execute `mcloud logs` para buscar os logs de execução de um backend ou loja virtual de um ambiente Cloud.

## **Restrições**

- `--follow` e `--json` são incompatíveis. Para análise de logs programática, use janelas de tempo delimitadas com `--from`/`--to` e `--json`.
- `--siga` streams até ser interrompido com `Ctrl+C` — não use em scripts ou pipelines.
- Logs padrão recupera as últimas 500 linhas de log dos últimos 15 minutos.

## **Comando**

```bash
mcloud logs \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  [options]
```

## Opções

| **Opção** | Descrição | Padrão |
|--------|-------------|---------|
| `-o/--organization <id>` | ID da Organização | Contexto ativo |
| `-p/--project <id-ou-handle>` | ID do projeto ou identificador | Contexto ativo |
| - `-e/--environment <handle>` | Manipulador de ambiente | Contexto ativo |
| `-f/--follow` | Exibir logs continuamente (incompatível com `--json`) | `falso` |
| `--limit <1-5000>` | Linhas de log máximo (modo não de acompanhamento apenas) | `500` |
| `--de <ISO8601>` | Início do intervalo de tempo (por exemplo, `2026-04-22T10:00:00Z`) | 15 minutos atrás |
| `--to <ISO8601>` | Fim do intervalo de tempo; se >15 minutos atrás, também deve passar `--from` | agora |
| `--search <string>` | Filtrar por substring (igual à barra de pesquisa do painel) | — |
| `--deployment <id>` | Filtrar por ID de implantação ou construção | — |
| `--fonte <string>` | Filtrar por fonte (repetível) | — |
| - -metadata <chave=valor> | Filtrar por campo de metadados (repetível; mesmo chave mescla valores) | Por favor, forneça o texto que deseja traduzir. |
| `--tipo <backend\` | loja>` | Fluxo de registro para consulta | `backend` |
| `--json` | ```json
Saída como JSON (incompatível com `--follow`)
``` | `falso` |

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

## Intervalo de Tempo Observações

- Janela padrão é os últimos 15 minutos.
- Passe `--from` sem `--to` para buscar de um determinado momento até agora.
- Passe `--to` sem `--from` somente se `--to` estiver dentro dos últimos 15 minutos; caso contrário, passe também `--from`.
- Ambos `--from` e `--to` aceitam timestamps ISO 8601.
