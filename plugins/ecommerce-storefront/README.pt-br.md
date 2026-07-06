# Plugin Claude Code para lojas virtuais

Ferramenta completa para a criação de lojas virtuais com alta taxa de conversão, seguindo as melhores práticas de UI/UX, otimização de conversão, SEO e responsividade para dispositivos móveis.

Use este plugin para criar recursos de front-end para lojas virtuais, incluindo componentes, layouts, fluxos de checkout e integração com o back-end. Este plugin pode ser usado com qualquer back-end de comércio eletrônico, como o Medusa.

> Para instalação e uso com outros agentes, consulte o [README principal](../../README.md).

- [Instalação com o Claude Code](#instalacao-com-o-claude-code)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalar o plug-in](#instalacao-com-o-claude-code)
- [Instalação para outros agentes de IA](#instalacao-para-outros-agentes-de-ia)
- [Usar o plug-in](#como-usar-o-plugin)
  - [Exemplos de casos de uso](#instalacao-para-outros-agentes-de-ia)
- [Habilidades incluídas](#habilidades-incluidas)
- [Privacidade](#privacidade)

## Instalação com o Claude Code

### Pré-requisitos

- [Claude Code](https://github.com/anthropics/claude-code) instalado
- Um projeto de loja virtual (ou planos para criar um)

### Instalar o plugin

1. Inicie o Claude:

```bash
claude
```

2. Adicione o Medusa Marketplace ao código do Claude:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

3. Instale o plugin:

```bash
/plugin install ecommerce-storefront@medusa
```

4. Verifique se o plugin foi carregado:

```bash
/plugin
```

Você deverá ver o plugin Ecommerce Storefront listado na aba “Instalados”.

## Instalação para outros agentes de IA

Para outros agentes de IA, como o Cursor, você pode usar o comando [skills](https://skills.sh/) para instalar a skill `storefront-best-practices` de acordo com o seu agente de IA:

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skill:
# - storefront-best-practices
```

## Como usar o plugin

Ao desenvolver recursos para a vitrine da loja, o Claude carregará automaticamente as orientações apropriadas deste plugin. A skill é acionada por palavras-chave como “finalizar compra”, “carrinho”, “página do produto”, “navegação”, etc.

Você também pode chamar a skill manualmente com `/ecommerce-storefront:storefront-best-practices`.

### Exemplos de casos de uso

Aqui estão alguns exemplos do que você pode pedir ao Claude para criar:

**Exemplo 1: Página de listagem de produtos**

> Criar uma página de listagem de produtos na minha loja virtual com filtros por categoria, faixa de preço e tamanho. Incluir opções de ordenação e paginação.

**Exemplo 2: Fluxo de finalização de compra**

> Implemente uma página de finalização de compra na minha loja virtual com endereço de entrega, seleção do método de entrega e pagamento. Use o backend Medusa.

**Exemplo 3: Componente de navegação**

> Crie uma barra de navegação responsiva com indicador de carrinho, pesquisa e menu suspenso de categorias na minha loja virtual. O carrinho deve estar sempre visível em dispositivos móveis.

**Exemplo 4: Página de detalhes do produto**

> Criar uma página de detalhes do produto com galeria de imagens, seleção de variantes (tamanho/cor), opção “Adicionar ao carrinho” e produtos relacionados na minha loja virtual.

**Exemplo 5: Layout da página inicial**

> Criar uma página inicial com seção de destaque, categorias em destaque, slider de produtos e formulário de inscrição na newsletter na minha loja virtual.

## Habilidades incluídas

1. **storefront-best-practices** – Orientação abrangente para a criação de lojas virtuais (componentes, layouts, recursos, integração com o backend)

## Privacidade

Este plug-in não coleta, armazena nem transmite quaisquer dados do usuário ou informações sobre conversas. Todo o conteúdo instrucional é fornecido localmente por meio de arquivos de skill.
