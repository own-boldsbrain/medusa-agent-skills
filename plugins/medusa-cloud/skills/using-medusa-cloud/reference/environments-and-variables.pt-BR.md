# Ambientes e Variáveis

## Gerenciando Ambientes

### Crie um Ambiente de Pré-visualização

```bash
mcloud environments create \
  --name "Staging" \
  --branch develop
```

### Inspecione um Ambiente

```bash
mcloud environments get staging --json | jq '{id, name, type, status, external_id}'
```

### Excluir um Ambiente

```bash
mcloud environments delete env_123 --yes
```

> **CRÍTICO:** Ambientes de produção estão protegidos — `delete` retorna um código de saída não-zero. Sempre verifique o campo `type` via `environments get --json` antes de tentar um delete em automação.

## Gerenciando Variáveis de Ambiente

Variáveis são escopadas a um único ambiente.

### Lista de Variáveis

```bash
mcloud variables list --json
```

### **Obter uma Variável**

```bash
# By key (requires active project and environment)
mcloud variables get DATABASE_URL --json

# By ID (works without project/environment context)
mcloud variables get var_01XYZ --json
```

### Revele Valores Secretos

> **CRÍTICO:** Passe `--reveal` apenas quando o usuário solicitar explicitamente. Valores em texto simples aparecem no histórico do terminal, agregadores de logs e listagens de processos.

```bash
mcloud variables get STRIPE_SECRET_KEY --reveal --json | jq -r '.value'
```

### Exportar para .env

Replicar as variáveis de um ambiente Cloud localmente:

```bash
mcloud variables list --reveal --json \
  | jq -r '.[] | "\(.key)=\(.value)"' \
  > .env
```