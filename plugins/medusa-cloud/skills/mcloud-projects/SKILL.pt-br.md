---
name: mcloud-projects
description: Execute mcloud projects commands to list, get, or delete Cloud projects. Use when discovering projects, resolving project handles by name, or retrieving project details including linked environments.
allowed-tools: Bash(mcloud projects*), Bash(mcloud use*), Bash(jq*)
---

# CLI do Cloud: Comandos de projetos

Execute os comandos `mcloud projects` para gerenciar projetos do Cloud.

## Restrições

- O comando `projects delete` é **irreversível** — remove todos os ambientes, implantações e recursos associados. Sempre confirme o ID/identificador do projeto antes de excluí-lo.
- Use `--yes` com `delete` em contextos não interativos (scripts, pipelines, agentes).

## Comandos

### lista de projetos

Lista todos os projetos de uma organização.

```bash
mcloud projects list --organization <org-id> --json
```

**Opções:**
- `-o/--organization <id>` — ID da organização (usa o contexto ativo como padrão; **obrigatório**)
- `--json` — Exibe o resultado em JSON

### projects get

Recupera um único projeto por seu ID ou identificador.

```bash
mcloud projects get <project-id-or-handle> --organization <org-id> --json
```

**Argumentos:**
- `project` — ID ou identificador do projeto (obrigatório)

**Opções:**
- `-o/--organization <id>` — ID da organização (usa o contexto ativo como padrão; **obrigatório**)
- `--json` — Saída em formato JSON

### projects delete

Exclui um projeto por seu ID ou identificador. **Irreversível.**

```bash
mcloud projects delete <project-id-or-handle> \
  --organization <org-id> \
  --yes
```

**Argumentos:**
- `project` — ID ou identificador do projeto (obrigatório)

**Opções:**
- `-o/--organization <id>` — ID da organização (usa o contexto ativo como padrão; **obrigatório**)
- `-y/--yes` — Ignora a solicitação de confirmação (obrigatório no modo não interativo)
- `--json` — Exibe o resultado em JSON

## Campos do projeto (JSON)

| Campo | Descrição |
|-------|-------------|
| `id` | ID do projeto |
| `handle` | Identificador do projeto compatível com URL (usado na maioria dos comandos) |
| `name` | Nome de exibição |
| `status` | `ready` quando em bom estado |
| `region` | Região de implantação (por exemplo, `us-east-1`) |
| `repository` | Repositório do GitHub vinculado (`owner/repo`) |
| `root_path` | Caminho raiz dentro do repositório |
| `environments` | Matriz de ambientes associados |

## Exemplos

```bash
# List all projects in an organization
mcloud projects list --organization org_123 --json

# Set context to a project by name
PROJECT_HANDLE=$(
  mcloud projects list --organization org_123 --json \
    | jq -r '.[] | select(.name == "My Store") | .handle'
)
mcloud use --project "$PROJECT_HANDLE"

# Get project details including environments
mcloud projects get my-store --organization org_123 --json

# List all environment handles for a project
mcloud projects get my-store --organization org_123 --json \
  | jq -r '.environments[].handle'

# Find project handle by name
mcloud projects list --organization org_123 --json \
  | jq -r '.[] | select(.name == "My Store") | .handle'

# Delete a project (irreversible — confirm before running)
mcloud projects delete old-project --organization org_123 --yes
```
