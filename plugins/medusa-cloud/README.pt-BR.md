# Plugin da Nuvem Medusa

Habilidades para gerenciar recursos do Medusa Cloud por meio da CLI do Cloud (`mcloud`). Aborda configuração, implantações, depuração, gerenciamento de ambiente, e variáveis.

> Para instalação e uso com outros agentes, consulte o [README principal](../../README.md).

## Instalação com Claude Code

### Requisitos prévios

- [Claude Code](https://github.com/anthropics/claude-code) instalado
- Uma conta na Medusa Cloud (ou planejando criar uma)

### Instalar Plugin

1. - *Começar Claude:**

```bash
claude
```

1. Adicione o marketplace Medusa ao Claude Code:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

1. Instale o plugin:

```bash
/plugin install medusa-cloud@medusa
```

1. Verifique se o plugin está carregado:

```bash
/plugin
```

## Habilidades Incluídas

1. - *using-medusa-cloud** - Guia de fluxo para operações CLI de nuvem (configuração, implantações, depuração, ambientes, variáveis)
2. - *cloud-cli-auth** - Execute `mcloud whoami`, `mcloud use`, `mcloud login`, `mcloud logout`, `mcloud version`
3. - *cloud-cli-deployments** - Execute `mcloud deployments list/get/build-logs`
4. - *cloud-cli-environments** - Execute `mcloud environments list/get/create/delete/redeploy/trigger-build`
5. - *cloud-cli-logs** - Execute `mcloud logs` com todas as opções de filtro
6. - *cloud-cli-variáveis** - Execute `mcloud variáveis list/get`
7. - *cloud-cli-organizations** - Execute `mcloud organizações listar/obter`
8. - *cloud-cli-projects** - Execute `mcloud projetos list/get/delete`

## Privacy

Este plugin não coleta, armazena ou transmite quaisquer dados do usuário ou informações de conversas. Todo o conteúdo instrucional é fornecido localmente por meio de arquivos de habilidades.
