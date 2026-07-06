# Plug-in do Medusa Cloud

Recursos para gerenciar os recursos do Medusa Cloud por meio da CLI do Cloud (`mcloud`). Abrange configuração, implantações, depuração, gerenciamento de ambiente e variáveis.

> Para instalação e uso com outros agentes, consulte o [README principal](../../README.md).

## Instalação com o Claude Code

### Pré-requisitos

- [Claude Code](https://github.com/anthropics/claude-code) instalado
- Uma conta no Medusa Cloud (ou a intenção de criar uma)

### Instalar o plugin

1. Inicie o Claude:

```bash
claude
```

2. Adicione o marketplace Medusa ao Claude Code:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

3. Instale o plug-in:

```bash
/plugin install medusa-cloud@medusa
```

4. Verifique se o plug-in foi carregado:

```bash
/plugin
```

## Habilidades incluídas

1. **using-medusa-cloud** - Guia de fluxo de trabalho para operações da CLI do Cloud (configuração, implantações, depuração, ambientes, variáveis)
2. **cloud-cli-auth** - Executar `mcloud whoami`, `mcloud use`, `mcloud login`, `mcloud logout`, `mcloud version`
3. **cloud-cli-deployments** - Executar `mcloud deployments list/get/build-logs`
4. **cloud-cli-environments** - Executar `mcloud environments list/get/create/delete/redeploy/trigger-build`
5. **cloud-cli-logs** - Executar `mcloud logs` com todas as opções de filtro
6. **cloud-cli-variables** - Executar `mcloud variables list/get`
7. **cloud-cli-organizations** - Executar `mcloud organizations list/get`
8. **cloud-cli-projects** - Executar `mcloud projects list/get/delete`

## Privacidade

Este plug-in não coleta, armazena nem transmite quaisquer dados do usuário ou informações de conversas. Todo o conteúdo instrucional é fornecido localmente por meio de arquivos de skill.
