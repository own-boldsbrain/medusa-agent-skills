# Componente Megamenu

## Contents

- [Visão Geral](#visao-geral)
- [When to Use Megamenu](#when-to-use-megamenu)
- [Organização de Conteúdo](#organizacao-de-conteudo)
- [Padrões de Layout](#layout-patterns)
- [Trigger Behavior](#trigger-behavior)
- [Mobile Alternative](#mobile-alternative)
- [Checklist](#checklist)

## Visão geral

Megamenu é um menu suspenso grande e de largura completa que exibe várias colunas de categorias, links e conteúdo promocional. Abre a partir de itens de gatilho na barra de navegação (ex.: "Loja", "Masculino", "Feminino").

**Assumed knowledge**: AI agents know how to build dropdown menus with hover/click triggers. This focuses on ecommerce megamenu patterns.

**Requisitos-chave:**

- Exibição em largura total (abrange a janela de visualização)
- Múltiplas colunas para categorias
- Posicionado diretamente abaixo da navbar
- Optional promotional images
- Alternativa mobile (menu hambúrguer, não megamenu)

## Quando Usar Megamenu

**Use megamenu quando:**

- Grande catálogo de produtos (10+ categorias de nível superior)
- Estrutura de profundidade (pai → filho → neto nível)
- Quer mostrar produtos/campanhas em destaque
- Múltiplos segmentos (Homens, Mulheres, Crianças, etc.)
- Contar histórias visualmente é necessário.

**Use o menu suspenso simples quando:**

- Pequeno catálogo (<10 categorias)
- Estrutura de categoria plana (1-2 níveis)
- Navegação apenas com texto suficiente
- Preferência por design minimalista

**Menus comuns de megamenu:**

- Loja (tudo as categorias)
- "Men", "Mulheres", "Crianças" (segmentado)
- "Chegadas Recentes" (curada)
- "Venda" (promocional)

## Organização de Conteúdo

**Integração de Back-end (CRÍTICO):**

Recupere categorias dinamicamente do backend de ecommerce - nunca hardcode categorias. Categorias mudam frequentemente (novos produtos, atualizações sazonais, alterações de estoque). Recupere da API ao montar o componente ou durante a SSR.

**Estrutura da coluna (recomenda-se 3 a 5 colunas):**

**Coluna 1-3: Colunas de Categoria**

- Cabeçalho da categoria pai (negrito, não cliqueável ou cliqueável para "Ver Todos")
- Categorias infantis abaixo (links clicáveis)
- 5-10 links por coluna no máximo
- Categorize subcategorias relacionadas

**Exemplo:**

```plaintext
Electronics (header)
  Laptops
  Desktops
  Monitors
  Accessories
  View All Electronics
```

**Coluna 4-5: Promocional/Destaque**

- Cartão de imagem do produto (1-2 produtos em destaque)
- Banner da campanha ("Promoção de Verão", "Novidades")
- "Compre o Look" conjuntos curados
- Promoções sazonais

**Limites de conteúdo:**

- Máx. 5 colunas (evite sobrecarregar)
- Máx. 10 links por coluna
- 1-2 imagens promocionais máximas
- Mantenha a altura razoável (<600px)

## Padrões de Layout

### ⚠️ CRÍTICO: Posicionamento do Megamenu (Erro Comum)

**Erros comuns de posicionamento que DEVEM ser evitados:**

❌ **Erro 1: Navbar não tem `position: relative`**

- Sem o contexto de posicionamento no navbar, o megamenu não se posicionará corretamente.
- O Megamenu se posicionará relativo ao corpo do documento em vez do navbar

❌ **Erro 2: Megamenu posicionado relativamente ao botão de ativação**

- Causa o megamenu a aparecer deslocado, não alinhado à borda esquerda
- Megamenu não vai se estender por toda a largura da navbar
- Posições de gatilho diferentes causam posicionamento inconsistente do megamenu

❌ **Erro 3: Megamenu não abrange toda a largura**

- Usando `largura: auto` ou sem restrição de largura
- Faltam as propriedades `left: 0` e `right: 0`
- Resultados em um menu suspenso estreito em vez de um painel de largura total

- --

**Padrão de posicionamento OBRIGATÓRIO:**

**Estrutura visual:**

```
┌─────────────────────────────────────────────────┐
│ NAVBAR (position: relative)                     │
│  [Logo]  [Shop ▼]  [Men]  [Women]  [Cart]      │
└─────────────────────────────────────────────────┘
  ┌───────────────────────────────────────────────┐
  │ MEGAMENU (absolute, left: 0, full width)      │
  │ ┌─────────────────────────────────────────┐   │
  │ │ Container (centered content)            │   │
  │ │ [Col1]  [Col2]  [Col3]  [Promo]        │   │
  │ └─────────────────────────────────────────┘   │
  └───────────────────────────────────────────────┘
```

**Estrutura obrigatória:**

1. **Container da barra de navegação**
   - DEVE ter `position: relative`
   - Cria um contexto de posicionamento para o megamenu
   - Contém ambos o botão de gatilho e o dropdown de megamenu

2. **Megamenu suspenso**
   - DEVE ter `position: absolute`
   - DEVE ter `left: 0` (alinha-se à borda esquerda do navbar)
   - DEVE ter `right: 0` OU `width: 100%` (abrange a largura completa do navbar)
   - DEVE ter `top: 100%` (posicionado diretamente abaixo da barra de navegação)
   - Deveria ter um `z-index` apropriado (acima do conteúdo, abaixo de modais)

3. **Conteúdo embutido (dentro do megamenu)**
   - Use constrained width container (e.g., `max-width`, `container`)
   - Centralize o conteúdo com `margin: 0 auto`
   - Contém grade/colunas para conteúdo do megamenu

**Por que esse padrão é obrigatório:**

- Navbar `position: relative` creates positioning context
- Megamenu `absolute` + `left: 0` + full width ensures consistent, full-width layout
- Posicionamento relativo à navbar (não acionar) previne problemas de offset
- O contêiner interno centraliza o conteúdo enquanto mantém o plano de fundo em toda a largura

# **Título Principal**Este é um exemplo de texto em português

## Subtítulo

- Lista de itens:
  - Item 1
  - Item 2 com*ênfase*-**Item 3**com**destaque**

[Link de exemplo](https://example.com)

```python
def hello_world():
    print("Olá, Mundo!")
```

> Citação em português:
> "A vida é uma aventura maravilhosa."

[Imagem](image.jpg)

<html>
  <body>
    <h1>Título em HTML</h1>
    <p>Parágrafo com <strong>texto forte</strong> e <em>ênfase</em>.</p>
  </body>
</html>

### Outras Considerações de Layout

- Positioned below navbar (no gap)
- Fundo branco/claro, preenchimento em caixa
- Shadow or border for depth
- Alto z-index (acima do conteúdo da página, abaixo dos modais)

**Layout de Colunas:**

- Colunas de largura igual ou grade flexível
- Espaçamento adequado (24-32px entre colunas)
- Texto alinhado à esquerda em colunas de categoria
- Coluna(s) direita(s) para conteúdo promocional
- Responsivo: Empilhe as colunas na tablet, se necessário

**Imagens promocionais:**

- Alinhado à direita (1-2 colunas)
- Proporção: 2:3 ou quadrado
- Imagens de produtos ou fotografia de estilo de vida
- Clicável para a página do produto/categoria
- Incluir legenda ou CTA ("Compre Agora")

## Comportamento de Disparo

**Hover na área de trabalho (recomendado):**

- O megamenu abre ao passar o mouse sobre o gatilho
- **CRÍTICO: O Megamenu DEVE permanecer aberto enquanto paira sobre o conteúdo suspenso**
- Mantém-se aberto enquanto paira sobre o gatilho OU área de dropdown
- Fecha apenas quando o mouse sair de ambas as áreas do gatilho e do menu suspenso
- Desativar o botão de fechar (atraso de 200-300ms) para evitar fechamento acidental
- Transição suave de entrada/saída (200-300ms)

**Por que isso é crítico:**

- Se o menu suspenso fechar ao mover do acionador para o conteúdo, os usuários não podem acessar os links
- Experiência de usuário frustrante - os usuários não conseguem interagir com os itens do megamenu
- Erro comum: Ouvir apenas o evento de hover no gatilho, e não no dropdown

**Clique no desktop (alternativa):**

- Clique no gatilho para alternar abrir/fechar
- Clique fora para fechar
- Melhor para laptops com tela sensível ao toque
- Menos aberturas acidentais

**Prevenção de tremulação ao pairar:**

- Não há espaço entre a barra de navegação e o menu suspenso
- Dropdown deve sobrepor levemente a navbar
- Debounce close delay previne flickering

## Alternativa Móvel

**Do NOT use megamenu on mobile:**

- Muito grande para telas de celular
- Difícil de navegar em layout de múltiplas colunas
- Experiência de toque ruim

**Alternativa móvel (menu hambúrguer):**

- Ícone de hambúrguer abre gaveta deslizante
- Vertical accordion para categorias
- Categoria principal expande para mostrar os filhos
- Lista simples e rolável
- See navbar.md for mobile navigation patterns

**Ponto de interrupção:**

- Megamenu: Apenas para desktop (>1024px)
- Hambúrguer: Tablet e celular (<1024px)

## Checklist

**Recursos essenciais:**

- [ ] Acionado a partir de itens da barra de navegação ("Loja", segmentos)
- [ ] **CRÍTICO: O contêiner da Navbar tem `position: relative` (cria contexto de posicionamento)**
- [ ] **CRÍTICO: O Megamenu tem `position: absolute` com `left: 0` (NÃO posicionado relativamente ao botão de ativação)**
- [ ] **CRÍTICO: Megamenu ocupa toda a largura (`right: 0` ou `w-full`, NÃO apenas `w-auto`)**
- [ ] **CRÍTICO: Megamenu posicionado em `top: 100%` ou `top-full` (diretamente abaixo da navbar)**
- [ ] Dropdown de largura total abaixo da navbar, abrange toda a largura da navbar
- [ ] 3-5 colunas para organização
- [ ] Hierarquia de categorias (pai → links para filhos)
- [ ] Imagens promocionais opcionais (1-2)
- [ ] **CRÍTICO: O megamenu permanece aberto ao passar o mouse sobre o conteúdo do dropdown (não apenas no acionador)**
- [ ] Acionador de *hover* com fechamento com debounce (200-300ms)
- [ ] Transição suave de fade-in/fade-out
- [ ] Sem tremulação (sem espaço entre a barra de navegação e o menu suspenso)
- [ ] Mobile: Use hamburger menu, NÃO megamenu
- [ ] Acessível por teclado (Tab para navegar pelos links, Esc para fechar)
- [ ] `role="navigation"` no painel suspenso
- [ ] Rótulos ARIA em botões de acionamento
- [ ] Compatível com leitor de tela (anunciar expandir/recolher)
- [ ] Máximo de 10 links por coluna
- [ ] Máximo de 5 colunas no total
- [ ] Obtido dinamicamente do backend (não hardcode categorias)
