# Depurando Implantações

## **Inspecionando Deployments**### Inspecionando Deployments

#### Introdução

Deployments são um recurso fundamental do Kubernetes que permite gerenciar a implementação de aplicações em clusters de forma eficiente e escalável. Neste tópico, vamos explorar como inspecionar deployments para garantir que elas estejam funcionando corretamente.

#### Objetivos* Compreender a estrutura de um deployment

* Conhecer as ferramentas disponíveis para inspecionar deployments
* Aprender a usar as ferramentas para coletar dados de deploys

#### Ferramentas para Inspecionar Deployments

Existem várias ferramentas disponíveis para inspecionar deployments, incluindo:

* `kubectl`: o cliente de linha de comando oficial do Kubernetes
* `kubectl get`: comando para exibir informações sobre deployments
* `kubectl describe`: comando para exibir informações detalhadas sobre deployments
* `kubectl logs`: comando para exibir logs de containers

#### Exemplo de Uso

Aqui está um exemplo de como usar o `kubectl get` para exibir informações sobre um deployment:

```bash
kubectl get deployments
```

Isso exibirá uma lista de deployments no cluster atual. Você também pode usar o `--namespace` flag para especificar o namespace do deployment:

```bash
kubectl get deployments --namespace=my-namespace
```

#### Conclusão

Inspecionar deployments é uma etapa importante no processo de gerenciamento de aplicações em Kubernetes. Com as ferramentas certas e o conhecimento adequado, você pode garantir que seus deployments estejam funcionando corretamente e eficientemente.

#### Recursos Adicionais

* Documentação oficial do Kubernetes: <https://kubernetes.io/docs/>
* Guia do usuário do Kubernetes: <https://kubernetes.io/docs/user-guide/>
* Ferramentas de gerenciamento de Kubernetes: <https://kubernetes.io/docs/concepts/tools/>

Campos de status por implantação: `backend_status` e `storefront_status`.

Valores: `criado`, `construindo`, `construído`, `implantando`, `implantado`, `falha-na-construção`, `falha-no-implantação`, `tempo-esgotado` (somente backend), `cancelado`, `ocioso`.

```bash
# Most recent failed deployment
mcloud deployments list --json \
  | jq -r '[.[] | select(.backend_status == "build-failed" or .backend_status == "deployment-failed")][0].id'

# Deployments for a specific commit
mcloud deployments list --commit a1b2c3d --json | jq '.'

# Only preview deployments
mcloud deployments list --environment-type preview --json | jq '.'

# Single deployment details
mcloud deployments get bld_01ABC123 --json
```

## Receita de Falha na Construção

Usar quando `backend_status == "build-failed"`:

```bash
# Find the most recent build-failed deployment
DEPLOYMENT_ID=$(
  mcloud deployments list --json \
    | jq -r '[.[] | select(.backend_status == "build-failed")][0].id'
)

# Inspect deployment metadata
mcloud deployments get "$DEPLOYMENT_ID" --json

# Read the build output
mcloud deployments build-logs "$DEPLOYMENT_ID"

# For storefront build failures
mcloud deployments build-logs "$DEPLOYMENT_ID" --type storefront
```

`build-logs` retorna um campo `build_status`. Quando `failed`, verifique `metadata.failed_docker_layer` via `mcloud deployments get --json` para identificar a camada com falha.

## # Receita de Falha de Implantação

Use quando `backend_status == "deployment-failed"` (build bem-sucedido, runtime falhou):

```bash
# Find the most recent deployment-failed
DEPLOYMENT_ID=$(
  mcloud deployments list --json \
    | jq -r '[.[] | select(.backend_status == "deployment-failed")][0].id'
)

# Runtime logs for that deployment
mcloud logs --deployment "$DEPLOYMENT_ID" --limit 1000

# Error-level lines only
mcloud logs --deployment "$DEPLOYMENT_ID" --search error --limit 1000

# Filter by HTTP status
mcloud logs --deployment "$DEPLOYMENT_ID" --metadata status=500 --limit 1000

# Structured analysis
mcloud logs --deployment "$DEPLOYMENT_ID" --json | jq '.[] | {timestamp, source, message}'
```

> **Observação:** `--follow` não pode ser combinado com `--json`. Use janelas de tempo limitadas com `--from`/`--to` e `--json` para scripts.

## Reexecutando um *Deployment*

Duas opções — não são intercambiáveis:

**Redistribuir (correção do lado do ambiente):** Reexecuta a build existente da implantação ativa. Use quando a correção for uma alteração de variável ou um problema de infraestrutura.

```bash
mcloud environments redeploy env_123
```

Requer que o ambiente tenha uma implantação ativa. Se não for o caso, use `trigger-build` primeiro.

**Acionar build (correção de código):** Inicia um novo build a partir da branch rastreada. Use quando a correção estiver no código commitado.

```bash
mcloud environments trigger-build env_123
```

**Verifique a nova construção:**

```bash
mcloud deployments list --environment env_123 --limit 5 --json \
  | jq '.[] | {id, backend_status, commit_hash, updated_at}'
```
