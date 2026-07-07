---
name: using-medusa-cloud
description: Manages Medusa Cloud resources through the Cloud CLI (mcloud). Use when deploying, debugging deployments, managing environments, environment variables, or any Medusa Cloud operation. CRITICAL for mcloud commands, deployment failures, build logs, Cloud setup, and CI/CD workflows.
---

# Gerenciamento de recursos do Medusa Cloud

Guia operacional para agentes de IA que gerenciam a infraestrutura do Medusa Cloud por meio da CLI `mcloud`. Aborda configuração, implantações, depuração, ambientes e variáveis.

## Restrições

- **Sempre passe `--json`** ao analisar a saída da CLI. A saída em texto simples é destinada a humanos e pode sofrer alterações sem aviso prévio.
- **Confirme o contexto antes de realizar alterações.** Execute `mcloud whoami --json` antes de qualquer alteração de estado.
- **Leia antes de gravar.** Execute um `get` ou `list` antes de qualquer `delete`, `redeploy` ou `trigger-build`.
- **Use `--yes` para operações destrutivas.** Os comandos `delete` exigem `--yes` no modo não interativo.
- **Ambientes de produção não podem ser excluídos.** O comando `mcloud environments delete` gera erro em ambientes de produção por padrão.
- **Nunca passe o parâmetro `--reveal`, a menos que o usuário solicite explicitamente.** Valores confidenciais aparecem no histórico do terminal e nos logs.
- **`--json` e `--follow` são incompatíveis.** Use intervalos de tempo delimitados (`--from`/`--to`) com `--json` para a ingestão programática de logs.

## CRÍTICO: Carregue os arquivos de referência quando necessário

**Carregue essas referências de acordo com o que você estiver fazendo:**

- **Configurando a CLI?** → É OBRIGATÓRIO carregar `setup.md` primeiro
- **Depurando uma implantação com falha?** → É OBRIGATÓRIO carregar `debugging-deployments.md` primeiro
- **Gerenciando ambientes ou variáveis?** → É OBRIGATÓRIO carregar `environments-and-variables.md` primeiro

**Requisito mínimo:** Carregue pelo menos um arquivo de referência antes de executar fluxos de trabalho com várias etapas.

## Referência rápida

### Verificação de autenticação

Sempre verifique a autenticação e o escopo antes de alterar o estado:

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

Código de saída `0` = autenticado e com escopo definido. Diferente de zero = interrompa e solicite confirmação ao usuário.

### Defina o contexto uma vez

```bash
mcloud use \
  --organization org_123 \
  --project proj_123 \
  --environment production
```

> **CRÍTICO:** O comando `mcloud use` sem sinalizadores é interativo e falha em CI/Docker/entrada canalizada. Sempre passe os sinalizadores.

### Roteamento por status de implantação

Roteamento com base em `backend_status` (ou `storefront_status`):

| Status | Significado | Logs a serem verificados |
|--------|---------|---------------|
| `build-failed` | Etapa de compilação falhou | `mcloud deployments build-logs <id>` |
| `deployment-failed` | Falha no tempo de execução após a compilação | `mcloud logs --deployment <id>` |
| `timed-out` | Tempo limite excedido | Ambos: primeiro os logs de compilação, depois os de tempo de execução |

### Decisão de reimplantação

| Comando | Quando usar |
|---------|-------------|
| `mcloud environments redeploy <env>` | A correção é no ambiente (alteração de variável, infraestrutura) — reexecuta a compilação existente |
| `mcloud environments trigger-build <env>` | A correção está no código-fonte do branch rastreado — inicia uma nova compilação |

## Armadilhas comuns

- **Comandos exclusivos para TTY.** `mcloud login`, `mcloud use` (sem opções) e `delete` sem `--yes` exigem um TTY. Eles falham em CI, Docker ou com entrada por pipeline.
- **Prioridade de `MCLOUD_TOKEN`.** Quando definido, as credenciais baseadas em arquivo são ignoradas e o `mcloud login` é rejeitado. Desative-o para alternar entre contas.
- **Chaves de acesso pessoais vs. da organização.** Chaves pessoais exigem `--organization`; as chaves da organização já têm escopo definido.
- **`organizations list` requer autenticação pessoal.** As chaves de acesso da organização retornam um erro 401 neste comando.
- **IDs de compilação x IDs de implantação.** `depl_*` = ID de implantação; qualquer outra coisa = ID de compilação (resolvida para a implantação mais recente). O comando `mcloud logs --deployment` aceita ambos; outros comandos aceitam apenas IDs de compilação.

## Arquivos de referência

```
setup.md                       - CLI installation, authentication, context setup
debugging-deployments.md       - Build/deployment failure recipes and log analysis
environments-and-variables.md  - Environment lifecycle and variable management
```
