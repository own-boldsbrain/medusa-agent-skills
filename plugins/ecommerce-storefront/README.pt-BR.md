# Plugin para Loja de E-commerce Claude Code

Habilidade abrangente para criar lojas de e-commerce com alto poder de conversão, utilizando as melhores práticas para UI/UX, otimização de conversões, SEO e responsividade mobile.

Use este plugin para construir recursos front-end para lojas de e-commerce, incluindo componentes, layouts, fluxos de checkout e integração no backend. Este plugin pode ser usado com qualquer backend de e-commerce, como Medusa.
> Para instalação e uso com outros agentes, consulte o README principal: [README](../../README.md).

- [Instalação com Claude Code](#instalacao-com-claude-code)
  - [Pré-requisitos](#pre-requisitos)
  - [Instalar Plugin](#instalar-plugin)
- [Instalação para Outros Agentes de IA](#instalacao-para-outros-agentes-de-ia)
- [Usar Plugin](#usar-plugin)
  - [Exemplos de Uso](#exemplos-de-uso)
- [Habilidades Incluídas](#habilidades-incluidas)
- [Privacidade](#privacidade)

## Instalação com Claude Code

### Pré-requisitos

- [Claude Code](https://github.com/anthropics/claude-code) instalado
- Um projeto de loja de e-commerce (ou em processo de criação)

### Instalar Plugin

1. Iniciar o Claude:
```bash
claude
```

2. Adicionar o marketplace Medusa ao Claude Code:
```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

3. Instalar o plugin:
```bash
/plugin install ecommerce-storefront@medusa
```

4. Verificar se o plugin foi carregado:
```bash
/plugin
```

Você deverá ver o plugin Ecommerce Storefront listado na aba "Instalados".

## Instalação para Outros Agentes de IA

Para outros agentes de IA, como Cursor, você pode usar o comando [skills](https://skills.sh/) para instalar a habilidade `storefront-best-practices` com base no seu agente de IA:
```bash
npx skills add medusajs/medusa-agent-skills
# escolher a seguinte habilidade:
# - storefront-best-practices
```

## Usar Plugin

Ao construir recursos da loja, o Claude carregará automaticamente as orientações apropriadas deste plugin. A habilidade é disparada por palavras-chave como "checkout", "carrinho", "página de produto", "navegação", etc.

Você também pode chamar a habilidade manualmente com `/ecommerce-storefront:storefront-best-practices`.

### Exemplos de Uso

Aqui estão alguns exemplos do que você pode pedir ao Claude para construir:

**Exemplo 1: Página de Listagem de Produtos**
> Crie uma página de listagem de produtos na minha loja, com filtros por categoria, faixa de preço e tamanho. Inclua opções de ordenação e paginação.

**Exemplo 2: Fluxo de Checkout**
> Implemente uma página de checkout na minha loja, com endereço de entrega, seleção do método de entrega e pagamento. Use o backend Medusa.

**Exemplo 3: Componente de Navegação**
> Crie uma barra de navegação responsiva com indicador de carrinho, busca e menu suspenso de categorias na minha loja. O carrinho deve ser sempre visível no mobile.

**Exemplo 4: Página de Detalhes do Produto**
> Crie uma página de detalhes do produto com galeria de imagens, seleção de variações (tamanho/cor), adicionar ao carrinho e produtos relacionados na minha loja.

**Exemplo 5: Layout da Página Inicial**
> Desenhe uma página inicial com seção principal, categorias em destaque, slider de produtos e inscrição na newsletter na minha loja.

## Habilidades Incluídas

1. **storefront-best-practices** - Orientação abrangente para criar lojas de e-commerce (componentes, layouts, recursos, integração no backend)

## Privacidade
Este plugin não coleta, armazena ou transmite nenhum dado ou informação da conversa do usuário. Todo o conteúdo instrutivo é fornecido localmente por meio de arquivos de habilidade.
