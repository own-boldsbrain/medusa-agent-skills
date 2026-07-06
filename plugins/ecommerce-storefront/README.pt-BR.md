# Plugin do Claude Code para Storefront de E-commerce

Habilidade (skill) abrangente para construir storefronts de e-commerce com alta taxa de conversão, utilizando as melhores práticas de UI/UX, otimização de conversões, SEO e responsividade para dispositivos móveis.

Use este plugin para construir recursos de frontend para lojas de e-commerce, incluindo componentes, layouts, fluxos de checkout e integração com o backend. Este plugin pode ser utilizado com qualquer backend de e-commerce, como o Medusa.

> Para instalação e uso com outros agentes, consulte o [README principal](../../README.md).

- [Instalação com o Claude Code](#instalação-com-o-claude-code)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalar o Plugin](#instalar-o-plugin)
- [Instalação para Outros Agentes de IA](#instalação-para-outros-agentes-de-ia)
- [Como Usar o Plugin](#como-usar-o-plugin)
  - [Exemplos de Casos de Uso](#exemplos-de-casos-de-uso)
- [Habilidades Incluídas](#habilidades-incluídas)
- [Privacidade](#privacidade)

## Instalação com o Claude Code

### Pré-requisitos

- [Claude Code](https://github.com/anthropics/claude-code) instalado
- Um projeto de storefront de e-commerce (ou planos para criar um)

### Instalar o Plugin

1. Inicie o Claude:

```bash
claude
```

2. Adicione o marketplace do Medusa ao Claude Code:

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

Você deve ver o plugin Ecommerce Storefront listado na aba "Installed" (Instalados).

## Instalação para Outros Agentes de IA

Para outros agentes de IA, como o Cursor, você pode usar o comando [skills](https://skills.sh/) para instalar a habilidade `storefront-best-practices` de acordo com o seu agente de IA:

```bash
npx skills add medusajs/medusa-agent-skills
# escolha a seguinte habilidade:
# - storefront-best-practices
```

## Como Usar o Plugin

Ao construir recursos para o storefront, o Claude carregará automaticamente as orientações adequadas a partir deste plugin. A habilidade é acionada por palavras-chave como "checkout", "carrinho" (cart), "página de produto" (product page), "navegação" (navigation), etc.

Você também pode chamar a habilidade manualmente com `/ecommerce-storefront:storefront-best-practices`.

### Exemplos de Casos de Uso

Aqui estão alguns exemplos do que você pode pedir para o Claude construir:

**Exemplo 1: Página de Listagem de Produtos**> Construa uma página de listagem de produtos no meu storefront com filtros por categoria, faixa de preço e tamanho. Inclua opções de ordenação e paginação.**Exemplo 2: Fluxo de Checkout**> Implemente uma página de checkout no meu storefront com endereço de entrega, seleção do método de entrega e pagamento. Use o backend do Medusa.**Exemplo 3: Componente de Navegação**> Crie uma barra de navegação (navbar) responsiva com indicador de carrinho, pesquisa e menu suspenso (dropdown) de categorias no meu storefront. O carrinho deve estar sempre visível na versão mobile.**Exemplo 4: Página de Detalhes do Produto**> Construa uma página de detalhes do produto com galeria de imagens, seleção de variações (tamanho/cor), botão de adicionar ao carrinho e produtos relacionados no meu storefront.**Exemplo 5: Layout da Página Inicial (Homepage)**> Crie o design de uma página inicial com seção hero, categorias em destaque, slider de produtos e formulário de inscrição na newsletter no meu storefront.

## Habilidades Incluídas

1.**storefront-best-practices** - Orientações completas para a construção de storefronts de e-commerce (componentes, layouts, funcionalidades, integração com backend)

## Privacidade

Este plugin não coleta, armazena ou transmite nenhum dado do usuário ou informações da conversa. Todo o conteúdo instrucional é fornecido localmente através dos arquivos da habilidade.
