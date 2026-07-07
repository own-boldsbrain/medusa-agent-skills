# Aprenda Medusa - Plugin de tutorial interativo

Um tutorial interativo e guiado para aprender a desenvolver com o Medusa do zero, criando um recurso de marcas. O Claude atua como seu instrutor de bootcamp de programação, ensinando você passo a passo com pontos de verificação e validação.

> Para instalação e uso com outros agentes, consulte o [README principal](../../README.md).

- [Instalação com o Claude Code](#instalacao-com-o-claude-code)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalar o plugin](#instalacao-com-o-claude-code)
- [Instalação para outros agentes de IA](#instalacao-para-outros-agentes-de-ia)
- [Como usar](#como-usar)
- [O que você vai aprender](#o-que-voce-aprendera)
  - [Aula 1: Criar recursos personalizados (45-60 min)](#recursos)
  - [Lição 2: Ampliar o Medusa (45-60 min)](#instalacao-com-o-claude-code)
  - [Lição 3: Personalizar o painel de administração (45-60 min)](#instalacao-com-o-claude-code)
- [Recursos](#recursos)
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

1. Adicione o Medusa Marketplace ao código do Claude:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

1. Instale o plugin:

```bash
/plugin install learn-medusa@medusa
```

1. Verifique se o plugin foi carregado:

```bash
/plugin
```

## Instalação para outros agentes de IA

Para outros agentes de IA, como o Cursor, você pode usar o comando [skills](https://skills.sh/) para instalar as habilidades do plugin de acordo com o seu agente de IA:

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skills:
# - building-with-medusa
# - building-admin-dashboard-customizations
# - building-storefronts
# - db-generate
# - db-migrate
# - new-user
```

## Como usar

Peça ao Claude para te ensinar:

- “Me ensine a desenvolver com o Medusa”
- “Me guie pelo desenvolvimento com o Medusa”
- “Quero aprender a usar o Medusa”

O Claude iniciará um tutorial interativo no qual você criará um recurso de marcas enquanto aprende a arquitetura do Medusa.

Você também pode acionar a habilidade manualmente com `/learn-medusa:learning-medusa`.

## O que você aprenderá

### Lição 1: Criar recursos personalizados (45-60 min)

- Criar um módulo de marcas (modelo de dados, serviço, migrações)
- Criar um fluxo de trabalho para a criação de marcas (com lógica de reversão)
- Expor uma rota de API para a criação de marcas (com validação)

### Lição 2: Ampliar o Medusa (45-60 min)

- Vincular marcas a produtos usando links de módulos
- Ampliar os fluxos de trabalho principais usando ganchos de fluxo de trabalho
- Consultar dados vinculados entre módulos

### Lição 3: Personalizar o painel de administração (45-60 min)

- Criar um widget para exibir a marca na página do produto
- Criar uma rota de interface do usuário para gerenciar marcas
- Usar o React Query e os componentes de interface do usuário do Medusa

## Recursos

- **Interativo**: o Claude orienta você passo a passo, verificando seu trabalho em pontos de verificação
- **Com foco na arquitetura**: Aprenda POR QUE, não apenas O QUÊ
- **Tolerante a erros**: Os erros são tratados como oportunidades de aprendizado
- **Prático**: desenvolva um recurso real (marcas) enquanto aprende
- **Progressivo**: comece de forma simples e aumente a complexidade gradualmente

## Privacidade

Este plugin não coleta, armazena nem transmite quaisquer dados do usuário ou informações de conversas. Todo o conteúdo instrucional é fornecido localmente por meio de arquivos de habilidades, e o servidor MCP consulta apenas a documentação pública do Medusa.
