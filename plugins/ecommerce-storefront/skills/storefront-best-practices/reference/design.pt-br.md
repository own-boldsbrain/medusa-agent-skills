# Diretrizes de Design

## Índice

- [Visão geral](#visao-geral)
- [Análise da identidade de marca existente](#identificando-a-identidade-visual-existente)
- [Regras essenciais de consistência](#regras-essenciais-de-consistencia)
- [Quando solicitar a aprovação do usuário](#quando-pedir-aprovacao-do-usuario)
- [Configuração de um novo projeto](#configuracao-de-um-novo-projeto)
- [Árvore de decisão](#arvore-de-decisao)
- [Erros comuns](#erros-comuns)

## Visão geral

**Objetivo:** Fornecer diretrizes para manter a consistência da marca ao criar componentes da interface do usuário. Isso evita que os agentes introduzam acidentalmente cores, fontes ou padrões de design inconsistentes.

**Princípio fundamental:** SEMPRE identifique e utilize os tokens de design existentes antes de criar novos componentes. NUNCA introduza novas cores ou fontes sem a aprovação do usuário.

**Quando aplicar:** Antes de criar qualquer componente de interface do usuário ou fazer qualquer alteração relacionada ao design.

## Identificando a identidade visual existente

Antes de implementar qualquer componente, identifique as cores, a tipografia e os padrões de design existentes da marca. Agentes de IA podem fazer isso — concentre-se no O QUE procurar, não no COMO detalhado.

### O que procurar

**Cores:**

1. **Configuração do Tailwind** (`tailwind.config.ts/js`) — Verifique `theme.extend.colors` ou `theme.colors`
2. **Variáveis CSS** (globals.css, app.css) — Procure por `:root { --color-primary: ... }`
3. **Componentes existentes** — Analise 2 a 3 componentes para identificar padrões de uso de cores

**Tipografia:**

1. **Configuração do Tailwind** — Verifique `theme.extend.fontFamily`
2. **Importações de fontes** — Verifique nos arquivos de layout ou no CSS (Next.js `next/font`, Google Fonts, fontes locais)
3. **Variáveis CSS** - Verifique se há `--font-sans`, `--font-heading`
4. **Componentes existentes** - Identifique os padrões de uso de fontes

**Outros padrões:**

- Escala de espaçamento (p-4, mb-6, etc.)
- Raio da borda (rounded-lg, rounded-xl)
- Sombras (shadow-md, shadow-lg)
- Estados interativos (cores de hover e foco)

### Detecção da versão do Tailwind (CRÍTICO)

**SEMPRE verifique a versão do Tailwind CSS antes de escrever classes utilitárias.**

O Tailwind v3 e o v4 têm sintaxes diferentes, e misturá-las causa erros.

**Como detectar a versão:**

1. **Verifique o `package.json`**: procure por `"tailwindcss": "^3.x.x"` ou `"tailwindcss": "^4.x.x"`
2. **Verifique o arquivo de configuração**:
   - v3: usa `tailwind.config.js/ts` com `module.exports` ou `export default`
   - v4: Pode usar configuração baseada em CSS com `@import "tailwindcss"`
3. **Verifique os componentes existentes**: observe os padrões de uso das classes

**Principais diferenças:**

**Tailwind v3:**

```tsx
// v3 syntax
<div className="bg-primary text-white">Content</div>
```

**Tailwind v4:**

```tsx
// v4 may use CSS variables differently
// Check the project's existing patterns
<div className="bg-primary text-white">Content</div>
```

**Erro comum:** Usar a sintaxe da v3 em projetos da v4 ou vice-versa. Sempre verifique a versão primeiro.

### Análise de Documentos

Faça um inventário mental de:

- **Cor(es) principal(is)** e seu uso
- **Famílias de fontes** (sans, serif, título, mono)
- **Padrões comuns** (estilos de botões, designs de cartões, espaçamento)
- **Nomes semânticos** (primário, secundário, destaque vs. azul-500, vermelho-600)

## Regras essenciais de consistência

### SEMPRE siga estas regras

✅ **NUNCA use emojis na interface do usuário da loja virtual** — use sempre ícones ou imagens em vez disso

```tsx
// ✅ CORRECT - Using icon component or image
<button className="flex items-center gap-2">
  <ShoppingCartIcon className="w-5 h-5" />
  Add to Cart
</button>

// ❌ WRONG - Using emoji
<button>
  🛒 Add to Cart
</button>
```

**Por que:** Os emojis são exibidos de maneira diferente em cada plataforma, não têm aparência profissional e podem causar problemas de acessibilidade. Use bibliotecas de ícones (Heroicons, Lucide, Font Awesome) ou imagens SVG em vez disso.

✅ **USE os tokens de design existentes** (cores, fontes e espaçamento do tema)

```tsx
// ✅ CORRECT - Using theme colors
<button className="bg-primary text-white hover:bg-primary-dark">
  Click Me
</button>

// ❌ WRONG - Arbitrary colors when theme exists
<button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]">
  Click Me
</button>
```

✅ **USE as definições de fonte existentes**, e não novas famílias de fontes

```tsx
// ✅ CORRECT - Using theme font
<h1 className="font-heading text-4xl font-bold">
  Welcome
</h1>

// ❌ WRONG - Introducing new font
<h1 className="font-['Montserrat'] text-4xl font-bold">
  Welcome
</h1>
```

✅ **SIGA os padrões dos componentes existentes**

```tsx
// If existing buttons use: bg-primary px-6 py-3 rounded-lg
// New buttons should use the same pattern
<button className="bg-primary px-6 py-3 rounded-lg">
  New Button
</button>
```

### NUNCA faça estas coisas

❌ **NÃO introduza novas cores sem a aprovação do usuário**

- Se precisar de uma cor que não esteja no tema, PERGUNTE primeiro
- Não use valores arbitrários como `bg-[#FF6B6B]` quando o tema já tiver cores

❌ **NÃO adicione novas fontes sem a aprovação do usuário**

- Se o design atual usa a Inter, não adicione a Montserrat sem perguntar
- Não use a sintaxe `font-['NewFont']` quando já houver fontes no tema

❌ **NÃO use valores codificados diretamente quando houver tokens do tema**

- Use `bg-primary` em vez de `bg-[#3B82F6]`
- Use `p-6` em vez de `p-[24px]`
- Use `font-heading` em vez de `font-['Poppins']`

❌ **NÃO crie padrões inconsistentes**

- Se os botões usarem `rounded-lg`, todos os botões devem usar
- Se os cartões usarem `shadow-md`, todos os cartões devem usar
- Se os efeitos de hover usarem `hover:bg-primary-dark`, seja consistente

## Quando pedir aprovação do usuário

**SEMPRE peça antes de:**

### 1. Adicionar uma nova cor

```
"I notice the current palette doesn't include an orange accent color.
Should I add one, or would you prefer to use the existing accent color?"
```

**Cenário:** Você está criando um banner promocional que precisa da cor laranja, mas o tema só tem azul/roxo.

### 2. Adicionando uma nova fonte

```
"The current design uses Inter for all text. Do you want me to add
a different font for headings, or keep using Inter throughout?"
```

**Cenário:** Ao criar uma seção de destaque, você se pergunta se os títulos deveriam usar uma fonte diferente.

### 3. Alterando definições existentes

```
"Should I update the primary color to #3B82F6, or create a
new color variant?"
```

**Cenário:** A cor primária atual é #2563EB, mas a nova maquete do design mostra #3B82F6.

### 4. Criação de um novo padrão

```
"The current components don't have a ghost button style (transparent with border).
Should I create one, or use an existing button variant?"
```

**Cenário:** Precisa de um estilo de botão sutil que ainda não existe.

### NÃO pergunte sobre

❌ Decisões padrão de desenvolvimento web (pontos de quebra responsivos, efeitos ao passar o mouse)
❌ Estrutura de componentes ou escolhas de layout
❌ Padrões de acessibilidade (os agentes de IA conhecem as diretrizes WCAG)
❌ Uso de cores/fontes de temas existentes de novas maneiras

## Configuração de um novo projeto

Ao iniciar um novo projeto SEM um tema existente:

### Faça estas perguntas ao usuário

**1. Cores da marca:**

```
"What are your brand colors? Please provide:
- Primary color (main brand color)
- Secondary color (optional)
- Any specific hex codes or color preferences?"
```

**2. Preferências de fonte:**

```
"Do you have font preferences?
- Modern and clean (Inter, Poppins)
- Classic and professional (Merriweather, Lora)
- Specific fonts?
- Or should I choose appropriate fonts?"
```

**3. Estilo de design:**

```
"What design style do you prefer?
- Minimal (lots of whitespace, clean lines)
- Bold (vibrant colors, large typography)
- Professional (conservative, trust-focused)
- Modern (rounded corners, gradients, shadows)"
```

**4. Sites de referência (opcional):**

```
"Do you have 2-3 example websites you like the look of?
This helps me understand your aesthetic preferences."
```

### Configuração do tema

Após definir as preferências, configure o tema Tailwind:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',     // User's primary color
        secondary: '#8B5CF6',    // User's secondary
        accent: '#F59E0B',       // Accent if needed
        // Full scales if sophisticated design
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
}
```

**Use o Tailwind CSS em todos os novos projetos** — padrão do setor para comércio eletrônico, altamente personalizável, excelente experiência de desenvolvimento (DX).

## Árvore de decisão

**Ao criar qualquer componente:**

```
1. Does a theme configuration exist?
   ├─ Yes → Extract colors/fonts from theme
   │         Use existing tokens for new component
   └─ No → Ask user for brand preferences
           Create theme configuration

2. Are there similar existing components?
   ├─ Yes → Follow their patterns exactly
   │         (spacing, colors, hover states)
   └─ No → Check ANY existing components
           Extract general patterns (spacing scale, hover effects)

3. Do you need a color/font not in theme?
   ├─ Yes → ASK user for approval before adding
   │         Explain why you need it
   └─ No → Proceed with existing tokens

4. Are you unsure about a design pattern?
   ├─ Yes → Check 2-3 existing components for guidance
   │         Follow majority pattern
   └─ No → Implement using theme tokens
           Maintain consistency with existing components
```

## Erros comuns

### ❌ Usar valores arbitrários quando já existe um tema

**Problema:** Usar `bg-[#3B82F6]` quando já existe `bg-primary`.

**Por que isso está errado:** Ignora o tema, cria inconsistências e dificulta a manutenção.

**Solução:** Sempre use nomes semânticos do tema.

### ❌ Introduzir novas cores sem permissão

**Problema:** Adicionar `text-orange-500` quando o tema não possui a cor laranja.

**Por que isso está errado:** O usuário pode não querer a cor laranja em sua marca, o que cria um caos de cores.

**Solução:** Pergunte primeiro ao usuário: “Devo adicionar uma cor laranja ou usar o destaque já existente?”

### ❌ Não verificar os padrões existentes

**Problema:** Criar botões com `rounded-full` quando todos os outros botões usam `rounded-lg`.

**Por que isso está errado:** A inconsistência visual confunde os usuários.

**Solução:** Verifique 2 ou 3 botões existentes e use o mesmo tipo de arredondamento.

### ❌ Adicionar fontes sem permissão

**Problema:** Usar `font-['Montserrat']` quando o tema usa a fonte Inter em todos os lugares.

**Por que está errado:** As fontes fazem parte da identidade da marca — não podem ser alteradas arbitrariamente.

**Solução:** Use as fontes existentes `font-heading` ou `font-sans`, ou peça para adicionar a Montserrat.

### ❌ Usar estilos inline em vez do tema

**Problema:** `style={{ backgroundColor: '#3B82F6', padding: '24px' }}`

**Por que está errado:** Ignora o tema do Tailwind, não é responsivo e é mais difícil de manter.

**Solução:** Use classes do Tailwind: `bg-primary p-6`

### ❌ Misturar a sintaxe do Tailwind v3 e v4

**Problema:** Usar a sintaxe do Tailwind v3 em um projeto v4, ou vice-versa.

**Por que isso está errado:** Versões diferentes têm padrões de configuração e sintaxe distintos. Misturá-las causa erros de compilação e comportamentos inesperados no estilo.

**Solução:** Verifique primeiro a versão do Tailwind no `package.json`. Analise os componentes existentes para entender os padrões de sintaxe usados no projeto. Adote os padrões específicos de cada versão de maneira consistente.

### ❌ Estados interativos inconsistentes

**Problema:** Alguns botões usam `hover:bg-primary-600`, outros usam `hover:brightness-110`.

**Por que isso está errado:** Experiência do usuário inconsistente.

**Solução:** Verifique os botões existentes e use o mesmo padrão de hover em todos os lugares.

### ❌ Criação de alterações no tema sem aprovação

**Problema:** Adicionar uma nova cor ao `tailwind.config.ts` sem pedir permissão.

**Por que está errado:** Mudanças no tema afetam todo o projeto; é necessário o consentimento do usuário.

**Solução:** Pergunte primeiro, explique o motivo e obtenha aprovação.

## Lista de verificação resumida

**Antes de criar qualquer componente:**

- [ ] **Detectei a versão do Tailwind CSS (v3 ou v4) no arquivo package.json**
- [ ] Verifiquei se há configuração de tema existente (configuração do Tailwind ou variáveis CSS)
- [ ] Extraí as cores existentes e as documentei
- [ ] Extraí as fontes existentes e as documentei
- [ ] Analisei 2 a 3 componentes existentes para identificar padrões
- [ ] Identifiquei padrões de espaçamento, raio de borda e sombra
- [ ] Confirmei que estou usando tokens do tema, e não valores arbitrários
- [ ] Alinhei os estados de hover/foco com os dos componentes existentes
- [ ] Verifiquei se o contraste de cores atende às diretrizes WCAG 2.1 AA (4,5:1 para texto) — use o [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Consultei o usuário antes de adicionar novas cores ou fontes
- [ ] Mantive a consistência visual em todos os componentes

**Trata-se de CONSISTÊNCIA, não de criar novos designs.** Alinhe-se ao que já existe, pergunte antes de alterar.
