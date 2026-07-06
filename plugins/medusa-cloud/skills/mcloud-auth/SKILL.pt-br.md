---
name: mcloud-auth
description: Execute mcloud authentication and context commands: login, logout, whoami, use, version, and signup. Use when setting up the CLI, switching accounts, verifying auth state, setting the active org/project/environment context, or checking the CLI version.
allowed-tools: Bash(mcloud whoami*), Bash(mcloud use*), Bash(mcloud version*), Bash(mcloud logout*), Bash(jq*)
---

# CLI do Medusa Cloud: Comandos de autenticação e contexto

Execute comandos de autenticação e contexto para a CLI do Medusa Cloud.

## Restrições

- `mcloud login`, `mcloud signup` e `mcloud use` (sem opções) exigem um **TTY** — eles falham em CI, Docker ou com entrada canalizada. Use `MCLOUD_TOKEN` ou passe as opções explicitamente.
- Quando `MCLOUD_TOKEN` está definido, as credenciais baseadas em arquivo são ignoradas e `mcloud login` é rejeitado. Desative-a para alternar entre contas.
- Sempre verifique a autenticação antes de qualquer comando que altere o estado: `mcloud whoami --json | jq -e '.auth.kind != "none"'`

## Comandos

### whoami

Exibe o usuário autenticado, o método de autenticação e o contexto ativo (organização, projeto, ambiente).

```bash
mcloud whoami --json
```

**Opções:**

- `--json` — Exibe o resultado em JSON

**Use para verificar a autenticação e o escopo:**

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

Código de saída `0` = autenticado e com escopo definido. Diferente de zero = interrompe e solicita confirmação ao usuário.

### uso

Defina a organização, o projeto e/ou o ambiente ativos para que os comandos subsequentes ignorem esses parâmetros.

```bash
mcloud use \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle>
```

**CRÍTICO:** O comando `mcloud use` sem opções é interativo e apresenta falha em CI/Docker/entrada canalizada. Sempre forneça as opções explicitamente.

**Opções:**

- `-o/--organization <id>` — Define a organização ativa
- `-p/--project <id-or-handle>` — Define o projeto ativo
- `-e/--environment <handle>` — Define o ambiente ativo
- `--clear` — Limpa todo o contexto ativo
- `--json` — Exibe a saída como JSON

**Limpar contexto:**

```bash
mcloud use --clear
```

### versão

Exibe a versão da CLI e os metadados da plataforma.

```bash
mcloud version --json
```

**Opções:**

- `--json` — Exibe o resultado em JSON

### login

Autentica com o Medusa Cloud. Abre um navegador para concluir a autenticação.

> **Requer TTY.** Não pode ser executado em CI, Docker ou ambientes não interativos. Use `MCLOUD_TOKEN` para autenticação não interativa.

```bash
mcloud login
```

**Alternativa não interativa:**

```bash
export MCLOUD_TOKEN=<access-key>
```

**Opções:**

- `-t/--token <token>` — Autentica usando uma chave de acesso sem navegador (não interativo)
- `--json` — Exibe como JSON

### logout

Remover credenciais armazenadas.

```bash
mcloud logout --json
```

**Opções:**

- `--json` — Exibe o resultado em formato JSON

### signup

Cria uma nova conta no Medusa Cloud. Abre um navegador.

> **Requer TTY.** Não pode ser executado em ambientes não interativos.

```bash
mcloud signup
```

## Métodos de autenticação

| Método | Quando usar |
|--------|-------------|
| `mcloud login` (navegador) | Configuração interativa; requer TTY |
| `mcloud login --token <chave>` | Login não interativo com chave de acesso |
| Variável de ambiente `MCLOUD_TOKEN=<chave>` | CI/CD, Docker, ambientes com scripts |

## Exemplos

```bash
# Check authentication and active context
mcloud whoami --json

# Verify auth before running commands
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'

# Set full context (org + project + environment)
mcloud use \
  --organization org_123 \
  --project my-store \
  --environment production

# Set context by resolving names
ORGANIZATION_ID=$(mcloud organizations list --json | jq -r '.[] | select(.name == "My Org") | .id')
PROJECT_HANDLE=$(mcloud projects list --organization "$ORGANIZATION_ID" --json | jq -r '.[] | select(.name == "My Store") | .handle')
ENVIRONMENT_HANDLE=$(mcloud environments list --organization "$ORGANIZATION_ID" --project "$PROJECT_HANDLE" --json | jq -r '.[] | select(.name == "Production") | .handle')

mcloud use \
  --organization "$ORGANIZATION_ID" \
  --project "$PROJECT_HANDLE" \
  --environment "$ENVIRONMENT_HANDLE"

# Clear context
mcloud use --clear

# Check CLI version
mcloud version --json

# Non-interactive login with token
mcloud login --token <access-key>

# Logout
mcloud logout
```
