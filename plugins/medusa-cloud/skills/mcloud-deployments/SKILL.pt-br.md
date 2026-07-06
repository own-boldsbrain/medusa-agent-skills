---
name: mcloud-deployments
description: Execute comandos do mcloud deployments para listar deploys, recuperar detalhes do deploy e buscar logs de build. Use ao listar deploys, verificar o status do deploy ou ler a saída de build para depurar falhas de build.
allowed-tools: Bash(mcloud deployments*), Bash(jq*)
---

# Cloud CLI: Comandos de Implantação

Execute os comandos `mcloud deployments` para inspecionar implantações e seus logs de compilação.

### Restrições

- Sempre passe `--json` ao analisar a saída — o formato de texto simples pode mudar.
- Sempre confirme o contexto (`mcloud whoami --json`) antes de executar comandos se org/project não estiverem conhecidos ainda.
- Use `--deployment` IDs no formato `depl_*` ou build IDs; os build IDs resolvem automaticamente para a implantação mais recente.

## **Comandos**### lista de deployments

Lista as implantações recentes para um projeto (padrão: 20 mais recentes em todos os ambientes).

```bash
mcloud deployments list --organization <org-id> --project <project-id-or-handle> --json
```

-*Opções:**- `-o/--organização <id>` — ID da Organização (recuo para o contexto ativo)

- `-p/--project <id-ou-identificador>` — ID ou identificador do projeto (assume o contexto ativo como padrão)
- `-e/--environment <handle>` — Filtre por handle do ambiente
- `--environment-type <production|long-lived|preview>` — Filtra por tipo de ambiente
- `--commit <sha>` — Filtrar por SHA de commit do Git (completo ou prefixo)
- `--limit <1-200>` — Máximo de resultados (padrão: `20`)
- `--offset <número>` — Offset de Paginação (padrão: `0` )

- ```json

`--json` — Saída em JSON

```

####**Implantações**O comando `get` permite-lhe obter informações detalhadas sobre as suas implantações. Você pode usar este comando para verificar o estado, os detalhes e as configurações das suas implantações.

## Opções:

- `deployments get [NAME]`: Obtém detalhes específicos de uma implantação com o nome fornecido.
- `deployments get --all`: Lista todas as implantações e fornece informações detalhadas sobre cada uma.
- `deployments get --last`: Mostra os detalhes da última implantação realizada.
- `deployments get --output [OUTPUT_FORMAT]`: Define o formato de saída, como JSON, YAML ou tabela.

## Exemplos:

Obter detalhes de uma implantação específica:

```

deployments get minha-implantacao

```

Listar todas as implantações:

```

deployments get --all

```

Mostrar detalhes da última implantação:

```

deployments get --last

```

Formatar a saída como JSON:

```

deployments get --output json

```

Recupere os detalhes de um único deployment pelo ID.

```bash
mcloud deployments get <deployment-id> --organization <org-id> --project <project-id-or-handle> --json
```

-*Argumentos:**- `deployment` — ID da implantação (obrigatório)

-*Opções:**- `-o/--organization <id>`, `-p/--project <id-ou-handle>`, `--json`

### **Deployments**build-logs

# Log de Construção de Implantações

## Etapas da Construção

1.**Verificar a configuração**: Certifique-se de que a configuração de ambiente esteja correta.
2. **Executar o comando de construção**: Execute o comando para gerar os logs de construção.

## Exemplo de Comando

```bash
kubectl logs deployment <nome-da-implantacao> -c <nome-do-container>
```

## Recursos

- [Documentação do Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Gerenciamento de Logs no Kubernetes](https://kubernetes.io/docs/concepts/cluster-administration/logging/)

Buscar registros de compilação para um *deployment*. Use isso para depurar status `build-failed`.

```bash
mcloud deployments build-logs <deployment-id> --organization <org-id> --project <project-id-or-handle>
```

- *Argumentos:**- `deployment` — ID de implantação (obrigatório)

-*Opções:**- `/--organization <id>`, `-p/--project <id-or-handle>`

- `--type <backend|storefront>` — Qual fluxo de registro de construção ler (padrão: `backend`)
- `--json` — Saída como JSON

## Status de Implantação

| Status | Significado |
|--------|---------|
| `criado` |**Não iniciado o build ainda** |
| `construção` | Construção em andamento |
| `construído` | Construção concluída, aguardando rollout |
| `implantação` | Implementando no ambiente |
| `implantado` | Em funcionamento e com tráfego |
| `build-failed` | Falha na etapa de construção — leia `build-logs` |
| `implantação-falhou` | Construção bem-sucedida, runtime parou — leia `mcloud logs` |
| `timed-out` | Ultrapassado o orçamento de tempo (apenas backend) |
| `cancelado` | Substituído por uma nova implantação |
| `ocioso` | # Não mais o deployment ativo |

## Exemplos

```bash
# List all deployments (with active context set)
mcloud deployments list --json

# Find most recent build-failed deployment
mcloud deployments list --json \
  | jq -r '[.[] | select(.backend_status == "build-failed")][0].id'

# Get deployment details
mcloud deployments get bld_01ABC123 --json

# Read backend build logs
mcloud deployments build-logs bld_01ABC123

# Read storefront build logs
mcloud deployments build-logs bld_01ABC123 --type storefront

# Filter deployments by commit SHA
mcloud deployments list --commit a1b2c3d --json | jq '.'

# Get deployments for a specific environment
mcloud deployments list --environment production --json
```
