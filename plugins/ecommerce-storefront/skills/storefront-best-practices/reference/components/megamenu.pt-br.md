# Componente Megamenu

## Índice

- [Visão geral](#visão-geral)
- [Quando Usar o Megamenu](#quando-usar-o-megamenu)
- [Organização de Conteúdo](#organização-de-conteúdo)
- [Padrões de Layout](#padrões-de-layout)
- [Comportamento do Acionador](#comportamento-do-acionador)
- [Alternativa para Dispositivos Móveis](#alternativa-para-dispositivos-móveis)
- [Lista de Verificação](#lista-de-verificação)

## Visão geral

O Megamenu é uma navegação suspensa grande e de largura total, exibindo várias colunas de categorias, links e conteúdo promocional. Ele se abre a partir de itens acionadores na barra de navegação (por exemplo, "Comprar", "Masculino", "Feminino").

**Conhecimento presumido**: Os agentes de IA sabem como construir menus suspensos com acionadores de foco/clique (hover/click). Este documento concentra-se em padrões de megamenu para e-commerce.

**Principais requisitos:**

- Exibição de largura total (abrange toda a janela de visualização)
- Várias colunas para categorias
- Posicionado diretamente abaixo da barra de navegação
- Imagens promocionais opcionais
- Alternativa para dispositivos móveis (menu hambúrguer, não megamenu)

## Quando Usar o Megamenu

**Use o megamenu quando:**

- Grande catálogo de produtos (10+ categorias de nível superior)
- Hierarquia profunda (níveis pai → filho → neto)
- Desejar destacar produtos/campanhas em destaque
- Vários segmentos (Masculino, Feminino, Infantil, etc.)
- Narrativa visual (storytelling) necessária

**Use um menu suspenso simples quando:**

- Pequeno catálogo (<10 categorias)
- Estrutura de categorias plana (1-2 níveis)
- Navegação apenas de texto for suficiente
- Preferência de design minimalista

**Acionadores comuns de megamenu:**

- "Comprar" (todas as categorias)
- "Masculino", "Feminino", "Infantil" (segmentado)
- "Novidades" (curadoria)
- "Promoção" (promocional)

## Organização de Conteúdo

**Integração com o Backend (CRÍTICO):**

Busque as categorias dinamicamente no backend de e-commerce - nunca fixe (hardcode) categorias. As categorias mudam frequentemente (novos produtos, atualizações sazonais, mudanças de estoque). Busque na API durante a montagem do componente ou via SSR.

**Estrutura de colunas (3-5 colunas recomendadas):**

**Colunas 1-3: Colunas de categoria**

- Cabeçalho da categoria pai (negrito, não clicável ou clicável para "Ver Tudo")
- Categorias filhas abaixo (links clicáveis)
- Máximo de 5-10 links por coluna
- Agrupe subcategorias relacionadas

**Exemplo:**

```plaintext
Eletrônicos (cabeçalho)
  Laptops
  Desktops
  Monitores
  Acessórios
  Ver Todos os Eletrônicos
```

**Colunas 4-5: Promocional/Destaque**

- Cartão de imagem do produto (1-2 produtos em destaque)
- Banner da campanha ("Promoção de Verão", "Novidades")
- Conjuntos com curadoria "Compre o Look"
- Promoções sazonais

**Limites de conteúdo:**

- Máximo de 5 colunas (evite superlotação)
- Máximo de 10 links por coluna
- Máximo de 1-2 imagens promocionais
- Mantenha a altura razoável (<600px)

## Padrões de Layout

### ⚠️ CRÍTICO: Posicionamento do Megamenu (Erro Comum)

**Erros de posicionamento comuns que DEVEM ser evitados:**

❌ **Erro 1: A barra de navegação não tem `position: relative`**

- Sem contexto de posicionamento na barra de navegação, o megamenu não se posicionará corretamente
- O megamenu será posicionado em relação ao corpo do documento (body) em vez da barra de navegação

❌ **Erro 2: Megamenu posicionado em relação ao botão acionador**

- Faz com que o megamenu apareça deslocado, não alinhado à borda esquerda
- O megamenu não abrangerá toda a largura da barra de navegação
- Diferentes posições de acionamento causam posicionamento inconsistente do megamenu

❌ **Erro 3: O megamenu não abrange a largura total**

- Usar `width: auto` ou nenhuma restrição de largura
- Falta das propriedades `left: 0` e `right: 0`
- Resulta em um menu suspenso estreito em vez de um painel de largura total

---

**Padrão de posicionamento OBRIGATÓRIO:**

**Estrutura visual:**

```
┌─────────────────────────────────────────────────┐
│ BARRA DE NAVEGAÇÃO (position: relative)         │
│  [Logo]  [Comprar ▼]  [Homem]  [Mulher] [Carr] │
└─────────────────────────────────────────────────┘
  ┌───────────────────────────────────────────────┐
  │ MEGAMENU (absolute, left: 0, full width)      │
  │ ┌─────────────────────────────────────────┐   │
  │ │ Container (conteúdo centralizado)       │   │
  │ │ [Col1]  [Col2]  [Col3]  [Promo]         │   │
  │ └─────────────────────────────────────────┘   │
  └───────────────────────────────────────────────┘
```

**Estrutura obrigatória:**

1. **Contêiner da barra de navegação (Navbar)**
   - DEVE ter `position: relative`
   - Cria o contexto de posicionamento para o megamenu
   - Contém tanto o botão acionador quanto o menu suspenso do megamenu

2. **Menu suspenso do Megamenu**
   - DEVE ter `position: absolute`
   - DEVE ter `left: 0` (alinha à borda esquerda da barra de navegação)
   - DEVE ter `right: 0` OU `width: 100%` (abrange toda a largura da barra de navegação)
   - DEVE ter `top: 100%` (posicionado diretamente abaixo da barra de navegação)
   - Deve ter um `z-index` apropriado (acima do conteúdo, abaixo dos modais)

3. **Invólucro do conteúdo (dentro do megamenu)**
   - Use um contêiner com largura restrita (por exemplo, `max-width`, `container`)
   - Centralize o conteúdo com `margin: 0 auto`
   - Contém grade/colunas para o conteúdo do megamenu

**Por que esse padrão é obrigatório:**

- `position: relative` na barra de navegação cria o contexto de posicionamento
- Megamenu com `absolute` + `left: 0` + largura total garante um layout consistente e de largura total
- O posicionamento relativo à barra de navegação (não ao acionador) evita problemas de deslocamento
- O contêiner interno centraliza o conteúdo enquanto mantém o fundo de largura total

---

### Outras Considerações de Layout

- Posicionado abaixo da barra de navegação (sem espaço/gap)
- Fundo branco/claro, preenchimento em caixa (boxed padding)
- Sombra ou borda para profundidade
- Alto z-index (acima do conteúdo da página, abaixo dos modais)

**Layout de colunas:**

- Colunas de largura igual ou grade flexível
- Espaçamento adequado (24-32px entre colunas)
- Texto alinhado à esquerda nas colunas de categoria
- Coluna(s) direita(s) para conteúdo promocional
- Responsivo: Empilhe as colunas em tablets, se necessário

**Imagens promocionais:**

- Alinhadas à direita (1-2 colunas)
- Proporção da tela: 2:3 ou quadrada
- Imagens de produtos ou fotografia de estilo de vida (lifestyle)
- Clicável para a página do produto/categoria
- Inclua legenda ou CTA ("Compre Agora")

## Comportamento do Acionador

**Foco (hover) em Desktop (recomendado):**

- O megamenu abre ao focar (hover) no acionador
- **CRÍTICO: O megamenu DEVE permanecer aberto ao focar (passar o mouse) sobre o conteúdo suspenso**
- Permanece aberto enquanto o mouse estiver sobre a área do acionador OU do menu suspenso
- Fecha apenas quando o mouse sai das áreas do acionador e do menu suspenso
- Atraso de fechamento (debounce de 200-300ms) para evitar fechamentos acidentais
- Transição suave de fade-in/out (200-300ms)

**Por que isso é crítico:**

- Se o menu suspenso fechar ao mover do acionador para o conteúdo, os usuários não poderão acessar os links
- Experiência do usuário (UX) frustrante - os usuários não conseguem interagir com os itens do megamenu
- Erro comum: Ouvir apenas o evento hover no acionador, não no menu suspenso

**Clique em Desktop (alternativa):**

- Clique no acionador para alternar entre abrir/fechar
- Clique fora para fechar
- Melhor para laptops habilitados para toque (touch)
- Menos aberturas acidentais

**Prevenção de cintilação (flickering) no hover:**

- Nenhum espaço (gap) entre a barra de navegação e o menu suspenso
- O menu suspenso deve sobrepor levemente a barra de navegação
- Atraso no fechamento (debounce) evita a cintilação

## Alternativa para Dispositivos Móveis

**NÃO use megamenu em dispositivos móveis:**

- Muito grande para telas móveis
- Difícil de navegar em um layout de várias colunas
- Má experiência de toque (touch)

**Alternativa para dispositivos móveis (menu hambúrguer):**

- O ícone de hambúrguer abre uma gaveta deslizante (slide-in)
- Acordeão vertical para categorias
- A categoria pai se expande para mostrar as filhas
- Lista simples e rolável
- Consulte navbar.md para padrões de navegação móvel

**Ponto de interrupção (Breakpoint):**

- Megamenu: Apenas desktop (>1024px)
- Hambúrguer: Tablet e celular (<1024px)

## Lista de Verificação

**Recursos essenciais:**

- [ ] Acionado a partir de itens da barra de navegação ("Comprar", segmentos)
- [ ] **CRÍTICO: O contêiner da barra de navegação tem `position: relative` (cria o contexto de posicionamento)**
- [ ] **CRÍTICO: O Megamenu tem `position: absolute` com `left: 0` (NÃO posicionado em relação ao botão acionador)**
- [ ] **CRÍTICO: O Megamenu abrange toda a largura (`right: 0` ou `w-full`, NÃO apenas `w-auto`)**
- [ ] **CRÍTICO: Megamenu posicionado em `top: 100%` ou `top-full` (diretamente abaixo da barra de navegação)**
- [ ] Menu suspenso de largura total abaixo da barra de navegação, abrange toda a largura da barra
- [ ] 3-5 colunas para organização
- [ ] Hierarquia de categorias (pai → links filhos)
- [ ] Imagens promocionais opcionais (1-2)
- [ ] **CRÍTICO: O Megamenu permanece aberto ao focar (passar o mouse) sobre o conteúdo suspenso (não apenas o acionador)**
- [ ] Acionador por hover com atraso no fechamento (debounce de 200-300ms)
- [ ] Transição suave de fade-in/out
- [ ] Sem cintilação (sem espaço/gap entre a barra de navegação e o menu suspenso)
- [ ] Dispositivos Móveis: Use o menu hambúrguer, NÃO o megamenu
- [ ] Acessível por teclado (Navegar com Tab pelos links, Esc para fechar)
- [ ] `role="navigation"` no painel suspenso
- [ ] Rótulos ARIA nos botões acionadores
- [ ] Amigável para leitores de tela (anuncia expandir/recolher)
- [ ] Máximo de 10 links por coluna
- [ ] Máximo de 5 colunas no total
- [ ] Buscado dinamicamente no backend (não codifique/hardcode categorias)
