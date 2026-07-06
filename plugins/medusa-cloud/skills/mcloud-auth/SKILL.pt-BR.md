---
name: mcloud-auth
description: Execute os comandos de autenticação e contexto do mcloud: login, logout, whoami, use, version e signup. Use ao configurar o CLI, alternar contas, verificar o estado de autenticação, definir o contexto ativo de organização/projeto/ambiente ou verificar a versão do CLI.
allowed-tools: Bash(mcloud whoami*), Bash(mcloud use*), Bash(mcloud version*), Bash(mcloud logout*), Bash(jq*)
---

# Cloud CLI: Comandos de Autenticação e Contexto

Execute comandos de autenticação e contexto para o Medusa Cloud CLI.

## **Restrições**

- `mcloud login`, `mcloud signup` e `mcloud use` (sem flags) exigem um **TTY** — eles falham em CI, Docker ou entrada por pipe. Use `MCLOUD_TOKEN` ou passe flags explicitamente em vez disso.
- Quando o `MCLOUD_TOKEN` estiver definido, as credenciais baseadas em arquivos são ignoradas e o comando `mcloud login` é rejeitado. Desdefina-o para mudar de conta.
- Sempre verifique a autenticação antes de qualquer comando que altere o estado: `mcloud whoami --json | jq -e '.auth.kind != "none"'`

## **Comandos**

### **Quem sou eu**

Mostre o usuário autenticado, o método de autenticação e o contexto ativo (organização, projeto, ambiente).

```bash
mcloud whoami --json
```

- *Opções:**

- `--json` — Saída como JSON

- *Use para verificar autenticação e escopo:**

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

Código de saída `0` = autenticado e com escopo. Não zero = pare e solicite ao usuário.

### use

Configurar a organização, projeto e/ou ambiente ativo para que os comandos subsequentes ignorem essas flags.

```bash
mcloud use \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle>
```

- *CRÍTICO:** `mcloud use` sem flags é interativo e falha no CI/Docker/entrada direcionada. Sempre passe as flags explicitamente.

- *Opções:**

- `-o/--organização <id>` — Definir organização ativa
- `-p/--project <id-or-handle>` — Definir projeto ativo
- `-e/--environment <handle>` — Defina o ambiente ativo
- `--clear` — Limpar todo o contexto ativo
- `--json` — Saída em JSON

- *Contexto claro:**

```bash
mcloud use --clear
```

### versão

Exibir a versão da CLI e metadados da plataforma.

```bash
mcloud version --json
```

- *Opções:**

- `--json` — Produzir como JSON

### **login**

Autentique-se com o Medusa Cloud. Abre um navegador para concluir a autenticação.

> **TTY obrigatório.** Não pode ser executado em CI, Docker ou ambientes não interativos. Use `MCLOUD_TOKEN` em vez disso para autenticação não interativa.

```bash
mcloud login
```

- *Alternativa não interativa:**

```bash
export MCLOUD_TOKEN=<access-key>
```

- *Opções:**

- - `-t/--token <token>` — Autenticar usando uma chave de acesso sem navegador (não interativo)
- `--json` — Saída como JSON

### sair

Remova as credenciais armazenadas.

```bash
mcloud logout --json
```

- *Opções:**

- `--json` — Saída como JSON

### inscreva-se

Crie uma nova conta no Medusa Cloud. Abre o navegador.

> **TTY necessário.** Não pode ser executado em ambientes não interativos.

```bash
mcloud signup
```

## Métodos de Autenticação

| Método | Quando usar |
|--------|-------------|
| `mcloud login` (navegador) | Configuração interativa; requer TTY |
| `mcloud login --token <chave>` | Login sem interação com chave de acesso |
| `MCLOUD_TOKEN=<chave>` env var | CI/CD, Docker, ambientes scriptados |

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
