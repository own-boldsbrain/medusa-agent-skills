---
name: mcloud-variables
description: Execute comandos `mcloud variables` para listar e obter variáveis de ambiente para um ambiente Cloud. Use ao inspecionar, ler ou exportar variáveis de ambiente. Nunca utilize `--reveal` a menos que o usuário solicite explicitamente valores secretos.
allowed-tools: Bash(mcloud variables*), Bash(jq*)
---

# Cloud CLI: Comandos de Variáveis

Execute o comando `mcloud variables` para inspecionar as variáveis de ambiente dos ambientes Cloud.

## Restrições

- **Nunca passe `--reveal` a menos que o usuário peça explicitamente.**Valores secretos aparecem no scrollback do terminal, agregadores de logs e listagens de processos.
- Procurar por chave requer `--project` e `--environment` (ou o equivalente no contexto ativo). Procurar por ID (`var_...`) funciona sem o contexto de projeto/ambiente.

##**Comandos**### lista de variáveis

Liste todas as variáveis de ambiente para um ambiente da Cloud.

```bash
mcloud variables list \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  --json
```**Opções:**
- `-o/--organização <id>` — ID da Organização (recuo para o contexto ativo)
- `-p/--project <id-or-handle>` — ID ou identificador do projeto (retorna ao contexto ativo)
- `-e/--environment <handle>` — Handle do ambiente (cadastra-se para o contexto ativo)
- `--reveal` — Exibir valores secretos em texto simples em vez de mascará-los (**use apenas quando explicitamente solicitado**)
- `--limit <1-500>` — Resultados máximos (padrão: `200`)
- `--offset <número>` — Deslocamento de paginação (padrão: `0`)
- `--json` — Saída em JSON

### Variáveis são

Recupere uma única variável pelo seu ID (`var_...`) ou chave.

```bash
# By key (requires project + environment context)
mcloud variables get ADMIN_CORS \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --environment <environment-handle> \
  --json

# By ID (works without project/environment context)
mcloud variables get var_01XYZ --json
```

**Argumentos:**- `variável` — ID da variável (`var_...`) ou chave (obrigatório)**Opções:**
- `-o/--organization <id>`, `-p/--project <id-ou-handle>`, `-e/--environment <handle>`
- `--reveal` — Imprima valor secreto em texto plano (**use apenas quando solicitado explicitamente**)
- ```json
`--json` — Saída como JSON
```

## Campos Variáveis (JSON)

| Campo | Descrição |
|-------|-------------|
| `id` | ID da Variável (`var_...`) |
| `chave` | Nome da variável (por exemplo, `ADMIN_CORS`) |
| `valor` | Valor da variável (mascarado se `is_secret` e `--reveal` não forem passados) |
| `é_secreto` | **Se a variável é tratada como um segredo**


Você pode definir o valor da variável como `true` ou `false` para determinar se a variável é tratada como um segredo:


```yaml
env:
  - name: MY_SECRET
    value: "minha_senha"
    isSecret: true
```

ou


```yaml
env:
  - name: MY_SECRET
    value: "minha_senha"
    isSecret: false
```

Além disso, você também pode usar a variável `env` para definir se a variável é tratada como um segredo:


```yaml
env:
  - name: MY_SECRET
    value: "minha_senha"
    env:
      - name: MY_SECRET
        value: "minha_senha"
        isSecret: true
``` |
| `is_build` | Disponível no momento da construção |
| `é_runtime` | Disponível em tempo de execução |
| `entity_id` | O ID do ambiente a que esta variável pertence |

## Exemplos

```bash
# List all variables for the active environment
mcloud variables list --json

# Get a variable by key (with active context)
mcloud variables get DATABASE_URL --json

# Get a variable by ID (no env context needed)
mcloud variables get var_01XYZ --json

# Only reveal secrets when user explicitly asks
mcloud variables get STRIPE_SECRET_KEY --reveal --json | jq -r '.value'

# Export all variables to a .env file (user must explicitly request --reveal)
mcloud variables list --reveal --json \
  | jq -r '.[] | "\(.key)=\(.value)"' \
  > .env

# List only runtime variables
mcloud variables list --json | jq '[.[] | select(.is_runtime == true)]'

# Check if a specific variable exists
mcloud variables list --json | jq '.[] | select(.key == "REDIS_URL")'
```