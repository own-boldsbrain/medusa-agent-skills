# Plugin Medusa Claude Code

Um conjunto abrangente de habilidades para o Claude Code, destinado a ajudar desenvolvedores a criar aplicativos Medusa seguindo as melhores práticas e padrões arquitetônicos.

Use este plugin para desenvolver funcionalidades de back-end e front-end relacionadas ao Medusa.

> Para instalação e uso com outros agentes, consulte o [README principal](../../README.md).

- [Plugin Medusa Claude Code](#instalacao-com-o-claude-code)
  - [Instalação com o Claude Code](#instalacao-com-o-claude-code)
    - [Pré-requisitos](#prerequisites)
    - [Instalar o plugin](#usar-o-plugin)
  - [Instalação para outros agentes de IA](#instalacao-para-outros-agentes-de-ia)
  - [Usar o plugin](#usar-o-plugin)
    - [Exemplos de casos de uso](#instalacao-para-outros-agentes-de-ia)
  - [Habilidades incluídas](#habilidades-incluidas)
  - [Comandos incluídos](#comandos-incluidos)
  - [Privacidade](#privacidade)

## Instalação com o Claude Code

### Pré-requisitos

- [Claude Code](https://github.com/anthropics/claude-code) instalado
- Um projeto Medusa (ou a intenção de criar um)

### Instalar o plugin

1. Inicie o Claude:

```bash
claude
```

1. Adicione o marketplace Medusa ao Claude Code:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

1. Instale o plug-in:

```bash
/plugin install medusa-dev@medusa
```

1. Verifique se o plug-in foi carregado:

```bash
/plugin
```

Você deverá ver o plug-in Medusa listado na aba “Instalados”.

## Instalação para outros agentes de IA

Para outros agentes de IA, como o Cursor, você pode usar o comando [skills](https://skills.sh/) para instalar as habilidades do plug-in de acordo com o seu agente de IA:

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skill:
# - learning-medusa
```

## Usar o plugin

Em seu aplicativo Medusa, peça ao Claude para criar recursos. O Claude saberá o que carregar do plugin do Medusa para criar seu recurso.

## Tradução local com o Ollama

Para regenerar páginas detalhadas em português do Brasil com o modelo local `gemma4:e4b`, preservando a estrutura do Markdown e adicionando ou expandindo casos de uso do `Yello Solar Hub`, execute:

```bash
pnpm ollama:translate:medusa-pages -- medusa-agent-skills/plugins/medusa-dev/skills/building-admin-dashboard-customizations --overwrite
```

Para processar toda a árvore de plug-ins:

```bash
pnpm ollama:translate:medusa-pages -- medusa-agent-skills/plugins/medusa-dev --overwrite
```

### Exemplos de casos de uso

Aqui estão alguns exemplos do que você pode pedir ao Claude para criar:

**Exemplo 1: Recurso full-stack com interface de usuário administrativa**

> Implemente um recurso de avaliações de produtos. Clientes autenticados podem adicionar avaliações. Usuários administrativos podem visualizar e aprovar ou rejeitar avaliações a partir do painel de controle

**Exemplo 2: Desenvolvimento de API de back-end**

> Crie um recurso de lista de desejos onde os clientes possam salvar produtos. Preciso de rotas de API para adicionar/remover itens e recuperar a lista de desejos.

**Exemplo 3: Widget do Painel de Administração**

> Adicione um widget à página de detalhes do produto no painel de administração que permita gerenciar produtos relacionados. Os usuários administradores devem poder selecionar quais produtos são relacionados por meio de uma tabela com função de pesquisa.

**Exemplo 5: Integração com a loja virtual**

> Ajude-me a integrar a API de avaliações personalizadas à minha loja virtual Next.js. Exiba as avaliações dos produtos na página de detalhes do produto com paginação.

## Habilidades incluídas

1. **building-with-medusa** - Desenvolvimento de back-end (módulos, fluxos de trabalho, rotas de API)
2. **building-admin-dashboard-customizations** - Desenvolvimento da interface de usuário administrativa (widgets, páginas, formulários)
3. **building-storefronts** - Integração com a loja virtual (uso do SDK, padrões do React Query)
4. **creating-internal-agents** - Criação de agentes

## Comandos incluídos

1. `/medusa-dev:db-migrate`: Executa migrações no seu projeto Medusa.
2. `/medusa-dev:db-generate <nome-do-módulo>`: Gera migrações para um módulo.
3. `/medusa-dev:new-user <e-mail> <senha>`: Cria um usuário administrador.

## Privacidade

Este plug-in não coleta, armazena nem transmite quaisquer dados de usuários ou informações de conversas. Todo o conteúdo instrucional é fornecido localmente por meio de arquivos de skill, e o servidor MCP apenas consulta a documentação pública do Medusa.
