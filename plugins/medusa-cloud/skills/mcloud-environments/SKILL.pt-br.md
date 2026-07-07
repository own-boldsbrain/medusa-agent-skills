---
name: mcloud-environments
description: Execute mcloud environments commands to list, get, create, delete, redeploy, or trigger builds for Cloud environments. Use when managing environment lifecycle, redeploying after variable changes, or starting new builds from source.
allowed-tools: Bash(mcloud environments*), Bash(mcloud use*), Bash(jq*)
---

# CLI do Cloud: Comandos de ambientes

Execute os comandos `mcloud environments` para gerenciar o ciclo de vida e as implantações dos ambientes.

## Restrições

- **Os ambientes de produção não podem ser excluídos.** Sempre verifique o `type` por meio do comando `environments get --json` antes de tentar excluir em um processo automatizado.
- Use `--yes` para operações destrutivas (`delete`) em contextos não interativos.
- `redeploy` e `trigger-build` não são intercambiáveis — escolha o comando correto de acordo com onde a correção está localizada.

## Comandos

### Lista de ambientes

Lista todos os ambientes de um projeto.

```bash
mcloud environments list --organization <org-id> --project <project-id-or-handle> --json
```

**Opções:**
- `-o/--organization <id>` — ID da organização (usa o contexto ativo como padrão)
- `-p/--project <id-or-handle>` — ID ou identificador do projeto (usa o contexto ativo como padrão)
- `--json` — Exibe o resultado em formato JSON

### ambientes get

Recupera um único ambiente pelo identificador.

```bash
mcloud environments get <environment-handle> --organization <org-id> --project <project-id-or-handle> --json
```

**Argumentos:**
- `environment` — Identificador do ambiente (obrigatório)

**Opções:**
- `-o/--organization <id>`, `-p/--project <id-or-handle>`, `--json`

### environments create

Cria um novo ambiente de longa duração.

```bash
mcloud environments create \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --name "Staging" \
  --branch develop \
  --json
```

**Opções:**
- `-o/--organization <id>`, `-p/--project <id-ou-handle>`
- `-n/--name <nome>` — Nome do ambiente (obrigatório)
- `-b/--branch <ramo>` — Ramo do Git a ser acompanhado (obrigatório)
- `--custom-subdomain <subdomínio>` — Subdomínio personalizado opcional
- `--json` — Saída em formato JSON

### exclusão de ambientes

Exclua um ambiente. **Não é possível excluir ambientes de produção.**

```bash
mcloud environments delete <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --yes
```

**Argumentos:**
- `environment` — Identificador do ambiente (obrigatório)

**Opções:**
- `-o/--organization <id>`, `-p/--project <id-or-handle>`
- `-y/--yes` — Ignora a solicitação de confirmação (obrigatório no modo não interativo)
- `--json` — Gera a saída como JSON

### Reimplantação de ambientes

Reexecuta uma compilação existente para a implantação ativa. Use quando a correção for do lado do ambiente (alteração de variável, problema de infraestrutura) — NÃO inicia uma nova compilação.

```bash
mcloud environments redeploy <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --json
```

**Argumentos:**
- `environment` — Identificador do ambiente (obrigatório)

**Opções:**
- `-o/--organization <id>`, `-p/--project <id-or-handle>`, `--json`

> Requer que o ambiente tenha uma implantação ativa. Caso contrário, use `trigger-build` primeiro.

### ambientes trigger-build

Inicia uma nova compilação a partir do branch rastreado. Use quando a correção já tiver sido confirmada no código — cria uma nova implantação.

```bash
mcloud environments trigger-build <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --json
```

**Argumentos:**
- `environment` — Identificador do ambiente (obrigatório)

**Opções:**
- `-o/--organization <id>`, `-p/--project <id-ou-identificador>`, `--json`

## Decisão entre reimplantação e acionamento de compilação

| Comando | Quando usar |
|---------|-------------|
| `redeploy` | A correção é no ambiente (alteração de variável, configuração de infraestrutura) — reexecuta a compilação existente |
| `trigger-build` | A correção está no código-fonte do branch rastreado — inicia uma nova compilação |

## Exemplos

```bash
# List all environments
mcloud environments list --json

# Get environment details and check type before deleting
mcloud environments get staging --json | jq '{id, name, type, status}'

# Create a new environment tracking the develop branch
mcloud environments create --name "Staging" --branch develop --json

# Delete a non-production environment
mcloud environments delete staging --yes

# Redeploy after a variable change
mcloud environments redeploy production --json

# Trigger a fresh build from source
mcloud environments trigger-build production --json

# Find environment handles by name
mcloud environments list --json \
  | jq -r '.[] | select(.name == "Production") | .handle'

# Verify new build started
mcloud deployments list --environment production --limit 5 --json \
  | jq '.[] | {id, backend_status, updated_at}'
```
