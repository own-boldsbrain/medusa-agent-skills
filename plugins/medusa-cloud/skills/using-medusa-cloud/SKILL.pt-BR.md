---
name: using-medusa-cloud
description: Gerencia os recursos do Medusa Cloud através do Cloud CLI (mcloud). Utilize ao implantar, depurar implantações, gerenciar ambientes, variáveis de ambiente ou qualquer operação do Medusa Cloud. CRÍTICO para comandos mcloud, falhas de implantação, logs de build, configuração do Cloud e fluxos de trabalho de CI/CD.
---

# Gerenciando Recursos do Medusa Cloud

Guia operacional para agentes de IA que gerenciam a infraestrutura Medusa Cloud por meio do CLI `mcloud`. Aborda configuração, implantações, depuração, ambientes e variáveis.

## # Restrições

- * *Sempre passe `--json`** ao analisar a saída do CLI. A saída em texto simples é destinada a humanos e pode mudar sem aviso prévio.
- * *Confirme o contexto antes de mutar.** Execute `mcloud whoami --json` antes de qualquer mudança de estado.
- * *Leia antes de escrever.** Execute um `get` ou `list` antes de qualquer `delete`, `redeploy` ou `trigger-build`.
- * *Use `--yes` para operações destrutivas.** Comandos de `delete` requerem `--yes` em modo não interativo.
- * *Ambientes de produção não podem ser deletados.** `mcloud environments delete` gera erros em produção por design.
- * *Nunca passe `--reveal` a menos que o usuário peça explicitamente.** Valores secretos aparecem no histórico do terminal e nos logs.
- * *`--json` e `--follow` são incompatíveis.** Use janelas de tempo limitadas (`--from`/`--to`) com `--json` para ingestão programática de logs.

## CRÍTICO: Carregar Arquivos de Referência Quando Necessário

* *Carregue essas referências com base no que você está fazendo:**

- * *Configurando a CLI?** → DEVE carregar `setup.md` primeiro
- * *Depurando um deployment falhado?** → DEVE carregar `debugging-deployments.md` primeiro
- * *Gerenciando ambientes ou variáveis?** → DEVE carregar `environments-and-variables.md` primeiro

* *Requisito mínimo:** Carregue pelo menos um arquivo de referência antes de executar fluxos de trabalho de múltiplos passos.

## Referência Rápida

### Verificação de Autenticação

Sempre verifique a autenticação e o escopo antes de modificar o estado:

```bash
mcloud whoami --json | jq -e '.auth.kind != "none" and .organization.id != null'
```

Código de saída `0` = autenticado e escopo. Não-zero = pare e pergunte ao usuário.

### Conjunto de Contexto Uma Vez

```bash
mcloud use \
  --organization org_123 \
  --project proj_123 \
  --environment production
```

> **CRÍTICO:** `mcloud use` sem flags é interativo e falha em CI/Docker/entrada canalizada. Sempre passe flags.

### Status de Implantação Roteamento

Rota em `backend_status` (ou `storefront_status`):

| # Status | Significado | Registros para verificar |
|--------|---------|---------------|
| `build-failed` | Etapa de construção falhou. | `mcloud deployments build-logs <id>` |
| `deployment-failed` | O tempo de execução falhou após a compilação | `mcloud logs --deployment *<id>*` |
| `tempo-esgotado` | Orçamento de tempo excedido | Ambos: logs de compilação primeiro, depois logs de runtime |

### * *Decisão de Redeslocamento**

| Comando | Quando usar |
|---------|-------------|
| `mcloud environments redeploy <env>` | Conserto é do lado do ambiente (mudança de variável, infra) — reexecuta build existente |
| `mcloud environments acionar-compilação <env>` | Correção está no código-fonte na branch rastreada — inicia novo build |

## Principais Armadilhas

- * *Comandos apenas para TTY.** `mcloud login`, `mcloud use` (sem bandeiras) e `delete` sem `--yes` requerem um TTY. Eles falham em CI, Docker ou entrada por pipe.
- * *`MCLOUD_TOKEN` precedência.** Quando definido, as credenciais baseadas em arquivo são ignoradas e o comando `mcloud login` é rejeitado. Desative-o para alternar contas.
- * *Acesso pessoal vs chaves de acesso da organização.** Chaves pessoais exigem `--organization`; chaves de acesso da organização estão pré-escopadas.
- * *`organizations list` requer autenticação pessoal.** As chaves de acesso da organização retornam 401 neste comando.
- * *IDs de construção vs IDs de implantação.** `depl_*` = ID de implantação; qualquer outra coisa = ID de construção (resolvido para a última implantação). `mcloud logs --deployment` aceita ambos; outros comandos aceitam apenas IDs de construção.

## Arquivos de Referência

```
setup.md                       - CLI installation, authentication, context setup
debugging-deployments.md       - Build/deployment failure recipes and log analysis
environments-and-variables.md  - Environment lifecycle and variable management
```