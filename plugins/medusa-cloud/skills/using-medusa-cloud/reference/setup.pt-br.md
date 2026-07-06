# Configuração e autenticação da CLI

Configuração única para a CLI do Medusa Cloud. Pule as etapas cujas verificações já foram aprovadas.

## 1. Verifique se a CLI está instalada

```bash
mcloud --version
```

Se o comando retornar `0` e exibir uma versão, pule para [Confirmar autenticação](#4-confirm-authentication).

## 2. Verifique a versão do Node.js

A CLI requer o Node.js v22 ou superior:

```bash
node --version
```

Se for inferior a `v22`, peça ao usuário para atualizar (por meio do nvm ou do instalador oficial). Não atualize sem autorização.

## 3. Instale a CLI

```bash
npm install -g @medusajs/mcloud
```

Verificar:

```bash
mcloud --version
```

Se não for encontrado, peça ao usuário para verificar se o diretório bin global do npm está no `PATH`.

## 4. Confirmar a autenticação

Pergunte ao usuário se ele possui uma conta no Medusa Cloud.

**Possui conta:**

```bash
mcloud login
```

Abre um navegador para concluir a autenticação.

**Sem conta:**

```bash
mcloud signup
mcloud login
```

**Ambientes não interativos (CI, Docker, headless):**

```bash
export MCLOUD_TOKEN=<access-key>
```

Quando `MCLOUD_TOKEN` está definido, a CLI o utiliza em todos os comandos e o comando `mcloud login` é rejeitado.

## 5. Verificar a configuração

```bash
mcloud whoami --json
```

Verifique a autenticação e o escopo:

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

## Definindo o contexto ativo

Salve a organização, o projeto e o ambiente para que os comandos subsequentes ignorem os parâmetros `--organization`, `--project` e `--environment`:

```bash
mcloud use \
  --organization org_123 \
  --project proj_123 \
  --environment production
```

### Resolução de nomes em IDs

Se você tiver apenas nomes:

```bash
# Resolve organization ID by name
ORGANIZATION_ID=$(
  mcloud organizations list --json \
    | jq -r '.[] | select(.name == "My Organization") | .id'
)

# Resolve project handle by name
PROJECT_HANDLE=$(
  mcloud projects list --organization "$ORGANIZATION_ID" --json \
    | jq -r '.[] | select(.name == "My Store") | .handle'
)

# Resolve environment handle by name
ENVIRONMENT_HANDLE=$(
  mcloud environments list --organization "$ORGANIZATION_ID" --project "$PROJECT_HANDLE" --json \
    | jq -r '.[] | select(.name == "Production") | .handle'
)

mcloud use \
  --organization "$ORGANIZATION_ID" \
  --project "$PROJECT_HANDLE" \
  --environment "$ENVIRONMENT_HANDLE"
```

### Limpar contexto

```bash
mcloud use --clear
```
