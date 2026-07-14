# Configuração do CLI e Autenticação

Configuração única para o CLI do Medusa Cloud. Pule etapas cujos testes já passaram.

## 1. Verifique se a CLI está instalada

```bash
mcloud --version
```

Se isso sair `0` e imprimir uma versão, pule para [Confirmar Autenticação](#4-confirmar-autenticacao).

## 2. Verifique a Versão do Node.js

### Requisitos

- Node.js 14.17.0 ou superior
- npm 6.14.13 ou superior

### Verifique a Versão do Node.js

Para verificar a versão do Node.js instalada em seu sistema, execute o comando abaixo no terminal:

```bash
node -v
```

O comando acima exibe a versão do Node.js instalada em seu sistema. Caso você não tenha o Node.js instalado, você precisará seguir as instruções abaixo para instalar.

### Instalar o Node.js

Para instalar o Node.js, você pode seguir as instruções abaixo:

- **Windows**:
  - Baixe o instalador do Node.js do site oficial: <https://nodejs.org/en/download/>
  - Execute o instalador e siga as instruções para instalar.

- **Linux e macOS**:
  - Instale o Node.js usando o gerenciador de pacotes do seu sistema operacional. Por exemplo, no Ubuntu, você pode usar o comando abaixo:

  ```bash
  sudo apt-get update
  sudo apt-get install nodejs
  ```

- **npm**:
  - O Node.js vem com o npm instalado. Caso você precise instalar o npm separadamente, você pode fazer isso usando o comando abaixo:

  ```bash
  npm install -g npm@latest
  ```

### Verifique a Instalação do npm

Para verificar se o npm foi instalado corretamente, execute o comando abaixo no terminal:

```bash
npm -v
```

O comando acima exibe a versão do npm instalada em seu sistema. Caso você não tenha o npm instalado, você precisará seguir as instruções acima para instalar.

O CLI requer Node.js v22+.

```bash
node --version
```

Se abaixo de `v22`, peça ao usuário para atualizar (via nvm ou o instalador oficial). Não atualize sem autorização.

## 3. Instale o CLI

```bash
npm install -g @medusajs/mcloud
```

**Verifique:**

```bash
mcloud --version
```

Se não encontrado, peça ao usuário para verificar se o diretório global do npm está no `PATH`.

## 4. Confirmar Autenticação

Pergunte ao usuário se ele possui uma conta na Medusa Cloud.

**Conta existente:**

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

Quando o `MCLOUD_TOKEN` estiver definido, a CLI o usa em cada comando e o `mcloud login` é rejeitado.

## 5. Verificar Configuração

```bash
mcloud whoami --json
```

Verificar autenticação e escopo:

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

## Definindo o Contexto Ativo

Considere org, projeto e ambiente para que comandos subsequentes pulem as flags `--organization`, `--project`, `--environment`:

```bash
mcloud use \
  --organization org_123 \
  --project proj_123 \
  --environment production
```

### Resolvendo Nomes para IDs

Se você só tiver nomes:

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

### Limpando o Contexto

```bash
mcloud use --clear
```
