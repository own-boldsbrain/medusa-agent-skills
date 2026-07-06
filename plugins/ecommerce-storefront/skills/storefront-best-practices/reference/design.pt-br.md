# Diretrizes de Design

## Sumário

- [Visão geral](#visão-geral)
- [Descobrindo a Identidade da Marca Existente](#descobrindo-a-identidade-da-marca-existente)
- [Regras Críticas de Consistência](#regras-críticas-de-consistência)
- [Quando Pedir Aprovação do Usuário](#quando-pedir-aprovação-do-usuário)
- [Configuração de Novo Projeto](#configuração-de-novo-projeto)
- [Árvore de Decisão](#arvore-de-decisao)
- [Erros Comuns](#erros-comuns)

## Visão geral

**Propósito:** Fornecer diretrizes para manter a consistência da marca ao criar componentes de UI. Isso evita que agentes introduzam acidentalmente cores, fontes ou padrões de design inconsistentes.

**Princípio crítico:** SEMPRE descubra e use tokens de design existentes antes de criar novos componentes. NUNCA introduza novas cores ou fontes sem a aprovação do usuário.

**When to apply:** Before creating any UI component or design-related change.

## Descobrindo a Identidade de Marca Existente

Antes de implementar qualquer componente, identifique as cores da marca, tipografia e padrões de design existentes. Agentes de IA podem fazer isso - concentre-se no **QUE**procurar, não no**COMO** em detalhes.

### O que Procurar

**Cores:**

1. **Configuração do Tailwind** (`tailwind.config.ts/js`) - Verifique `theme.extend.colors` ou `theme.colors`
2. **Variáveis CSS** (globals.css, app.css) - Procure por `:root { --color-primary: ... }`
3. **Componentes existentes** - Analisar 2-3 componentes para padrões de uso de cores

**Tipografia:**

1. **Configuração do Tailwind** - Verifique `theme.extend.fontFamily`
2. **Importações de fontes** - Procure nos arquivos de layout ou no CSS (Next.js `next/font`, Google Fonts, fontes locais)
3. **Variáveis CSS** - Verifique por `--font-sans`, `--font-heading`
4. **Componentes existentes** - Identificar padrões de uso de fontes

**Outras padronizações:**

- Spacing scale (p-4, mb-6, etc.)
- Border radius (rounded-lg, rounded-xl)
- Sombras (shadow-md, shadow-lg)
- Estados interativos (cores de *hover*, foco)

### Detectando Versão do Tailwind (CRÍTICO)

**SEMPRE verifique a versão do Tailwind CSS antes de escrever classes utilitárias.**

Tailwind v3 e v4 têm sintaxes diferentes, e misturá-las causa erros.

**Como detectar a versão:**

1. **Check `package.json`**: Look for `"tailwindcss": "^3.x.x"` or `"tailwindcss": "^4.x.x"`
2. **Verificar arquivo de configuração**
   - v3: Usa `tailwind.config.js/ts` com `module.exports` ou `export default`
   - v4: Pode usar configuração baseada em CSS com `@import "tailwindcss"`
3. **Check existing components**: Look at class usage patterns

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

**Erro comum:** Usar a sintaxe da v3 em projetos v4 ou vice-versa. Sempre verifique a versão primeiro.

### Document Discovery

Create mental inventory of:

- **Cor(es) primária(s)** e seu uso
- **Famílias de fontes** (sem serifa, com serifa, cabeçalho, mono)
- **Padrões comuns** (estilos de botão, designs de cartões, espaçamento)
- **Semantic names** (primary, secondary, accent vs blue-500, red-600)

## Critical Consistency Rules

### SEMPRE Siga Estas Regras

✅ **NEVER use emojis in storefront UI** - Always use icons or images instead

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

**Por quê:** Emojis aparecem de forma diferente entre plataformas, não têm uma aparência profissional e podem causar problemas de acessibilidade. Use bibliotecas de ícones (Heroicons, Lucide, Font Awesome) ou imagens SVG em vez disso.

✅ **USE os tokens de design existentes** (cores, fontes, espaçamento do tema)

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

✅ **USE existing font definitions**, not new font families

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

✅ **MATCH patterns from existing components**

```tsx
// If existing buttons use: bg-primary px-6 py-3 rounded-lg
// New buttons should use the same pattern
<button className="bg-primary px-6 py-3 rounded-lg">
  New Button
</button>
```

### NEVER Do These Things

❌ **NÃO introduza novas cores sem aprovação do usuário**

- If you need a color not in the theme, ASK first
- Não use valores arbitrários como `bg-[#FF6B6B]` quando o tema tiver cores

❌ **DON'T add new fonts without user approval**

- If current design uses Inter, don't add Montserrat without asking
- Não use `font-['NewFont']` quando existem fontes no tema

❌ **NÃO use valores fixos quando existirem tokens de tema**

- Use `bg-primary` não `bg-[#3B82F6]`
- Use `p-6` não `p-[24px]`
- Use `font-heading` em vez de `font-['Poppins']`

❌ **DON'T create inconsistent patterns**

- If buttons use `rounded-lg`, all buttons should
- Se os cartões usarem `shadow-md`, todos os cartões devem
- If hover effects use `hover:bg-primary-dark`, be consistent

## Quando Pedir Aprovação do Usuário

**ALWAYS ask before:**

### 1. Adicionando Nova Cor

```
"I notice the current palette doesn't include an orange accent color.
Should I add one, or would you prefer to use the existing accent color?"
```

**Cenário:** Você está criando um banner promocional que precisa de uma cor laranja, mas o tema só possui azul/roxo.

### 2. Adicionando Nova Fonte

```
"The current design uses Inter for all text. Do you want me to add
a different font for headings, or keep using Inter throughout?"
```

**Scenario:** Building a hero section and wondering if headings should use a different font.

### 3. Alterando Definições Existentes

```
"Should I update the primary color to #3B82F6, or create a
new color variant?"
```

**Scenario:** Current primary is #2563EB but new design mockup shows #3B82F6.

### 4. Creating New Pattern

```
"The current components don't have a ghost button style (transparent with border).
Should I create one, or use an existing button variant?"
```

**Cenário:** Necessidade de um estilo de botão sutil que ainda não existe.

### NÃO Pergunte Sobre

### Não Pergunte Sobre

#### O que é?

Este é um livro sobre como não perguntar sobre coisas que você não entende ou não precisa saber.

#### Capítulo 1: A Arte de Não Perguntar

**A importância de não perguntar**Às vezes, perguntar pode parecer uma boa ideia. Mas, na verdade, muitas vezes, perguntar pode ser um grande erro. Aqui estão algumas razões pelas quais você deve evitar perguntar:***Você não precisa saber**: Muitas vezes, não é necessário saber algo para viver uma vida feliz e plena. Se você não precisa saber, então não pergunte.
***Você pode se sentir idiota**: Se você perguntar algo que é óbvio, você pode se sentir idiota. E, pior ainda, as pessoas ao seu redor podem se sentir envergonhadas por você.
***Você pode criar problemas**: Perguntar pode criar problemas onde não há. Se você não perguntar, você pode evitar criar problemas desnecessários.

#### Exemplo de código

```python
def nao_perguntar():
    # Não pergunte sobre coisas que você não entende
    # Não pergunte sobre coisas que você não precisa saber
    # Não pergunte sobre coisas que podem criar problemas
    pass
```

#### Conclusão

Em resumo, não pergunte sobre coisas que você não entende ou não precisa saber. Isso pode evitar problemas e manter sua vida simples e feliz. Lembre-se: às vezes, não perguntar é a melhor resposta.

❌ Decisões padrão de desenvolvimento web (pontos de interrupção responsivos, efeitos de hover)  
❌ Estrutura do componente ou escolhas de layout  
❌ Padrões de acessibilidade (agentes de IA conhecem WCAG)  
❌ Uso de cores/tipografias do tema existente de novas maneiras

## Configuração de Novo Projeto

Quando iniciar um novo projeto SEM tema existente:

### Pergunte ao Usuário Estas Questões

**1. Cores da Marca:**

```
"What are your brand colors? Please provide:
- Primary color (main brand color)
- Secondary color (optional)
- Any specific hex codes or color preferences?"
```

**2. Preferências de Fonte:**

```
"Do you have font preferences?
- Modern and clean (Inter, Poppins)
- Classic and professional (Merriweather, Lora)
- Specific fonts?
- Or should I choose appropriate fonts?"
```

**3. Estilo de Design:**

```
"What design style do you prefer?
- Minimal (lots of whitespace, clean lines)
- Bold (vibrant colors, large typography)
- Professional (conservative, trust-focused)
- Modern (rounded corners, gradients, shadows)"
```

**4. Sites de Referência (Opcional):**

```
"Do you have 2-3 example websites you like the look of?
This helps me understand your aesthetic preferences."
```

### Configurar Configuração do Tema

Depois de coletar as preferências, configure o tema do Tailwind:

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

**Utilize o Tailwind CSS para todos os novos projetos** - padrão de indústria para ecommerce, altamente personalizável, excelente DX.

## Árvore de Decisão

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

## Erros Comuns

### ❌ Usando Valores Arbitrários Quando o Tema Existe

### Dangers of Arbitrary Values

When a theme is applied to an element, it can override any arbitrary value set on the element. This can lead to unexpected results and make it difficult to debug the layout.

#### Example

```html
<div style="color: blue; font-size: 24px;">
  <p style="color: red;">Hello, World!</p>
</div>
```

In this example, the `color` property is set to `blue` on the `div` element, but the `color` property is also set to `red` on the `p` element. When the theme is applied, the `color` property on the `p` element will override the theme's value, resulting in a `red` text color.

#### Best Practice

To avoid this issue, always use a theme's properties to style elements. If you need to set a specific value, use a class or an ID to override the theme's value.

```html
<div class="theme">
  <p class="theme-text">Hello, World!</p>
</div>

<style>
  .theme {
    color: blue;
    font-size: 24px;
  }

  .theme-text {
    color: red;
  }
</style>
```

In this example, the `theme` class is used to set the `color` and `font-size` properties, and the `theme-text` class is used to override the `color` property on the `p` element.

### Related Topics

* [Using a Theme's Properties](#using-a-theme's-properties)
* [Overriding a Theme's Value](#overriding-a-theme's-value)

**Problema:** Utilizando `bg-[#3B82F6]` quando `bg-primary` existe.

**Por que está errado:** Ignora o tema, cria inconsistência, mais difícil de manter.

**Correção:** Sempre use nomes semânticos do tema.

### ❌ Introduzindo Novas Cores Sem Permissão

**Problema:** Adicionar `text-orange-500` quando o tema não possui laranja.

**Por que está errado:** O usuário pode não querer laranja em sua marca, cria um caos de cores.

**Correção:** Pergunte ao usuário primeiro: "Devo adicionar uma cor laranja, ou usar o acerto existente?"

### ❌ Não Verificar Padrões Existentes

**Problema:** Criar botões com `rounded-full` quando todos os outros botões usam `rounded-lg`.

**Por que está errado:** Inconsistência visual confunde os usuários.

**Correção:** Verifique 2-3 botões existentes, utilize o mesmo arredondamento.

### ❌ Adicionar Fontes Sem Permissão

**Problema:** Usando `font-['Montserrat']` quando o tema usa Inter em todo lugar.

**Por que está errado:** Os fontes são identidade da marca - não podem ser alterados arbitrariamente.

**Correção:** Utilize o existente `font-heading` ou `font-sans`, ou peça para adicionar o Montserrat.

### ❌ Usando Estilos Inline em vez de Tema

**Por que evitar estilos inline?**Estilos inline são difíceis de manter e podem causar problemas de compatibilidade. Além disso, são uma fonte comum de bugs de layout.**Alternativas**-**Classes CSS**: Use classes CSS para aplicar estilos a elementos. Isso permite que você aplique estilos a vários elementos de uma vez e é mais fácil de manter.
- **Frameworks CSS**: Utilize frameworks CSS como Bootstrap ou Tailwind CSS para criar layouts e estilos consistentes.
- **Sass e Less**: Use preprocessadores de CSS como Sass ou Less para criar estilos mais complexos e reutilizáveis.

**Exemplo de código**

```css
/*Estilo inline*/
<div style="background-color: #f0f0f0; padding: 20px;">Conteúdo</div>

/*Estilo com classe CSS*/
<div class="container">
  <div class="container__content">Conteúdo</div>
</div>

<style>
  .container {
    background-color: #f0f0f0;
    padding: 20px;
  }
  .container__content {
    padding: 10px;
  }
</style>
```

**Links**

- [Documentação do CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [Bootstrap](https://getbootstrap.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sass](https://sass-lang.com/)
- [Less](http://lesscss.org/)

**Problema:** `estilo={{ fundoDeTela: '#3B82F6', padding: '24px' }}`

**Por que está errado:** Ignora o tema do Tailwind, não é responsivo, mais difícil de manter.

**Conserto:** Use classes Tailwind: `bg-primary p-6`

### ❌ Misturando a Sintaxe do Tailwind v3 e v4

**Problema:** Usar a sintaxe do Tailwind v3 em um projeto v4, ou vice-versa.

**Por que está errado:** Versões diferentes têm padrões de configuração e sintaxe diferentes. Misturá-las causa erros de build e comportamento de estilo inesperado.

**Correção:** Verifique o `package.json` para a versão do Tailwind primeiro. Observe os componentes existentes para entender os padrões de sintaxe usados no projeto. Combine os padrões específicos da versão de forma consistente.

### ❌ Estados Interativos Inconsistentes

**Problema:** Alguns botões usam `hover:bg-primary-600`, outros usam `hover:brightness-110`.

**Por que está errado:** Experiência de usuário inconsistente.

**Correção:** Verifique os botões existentes, utilize o mesmo padrão de hover em todos os lugares.

### ❌ Criando Mudanças de Tema Sem Aprovação

**Problema**As mudanças de tema podem afetar a aparência e a experiência do usuário de um aplicativo. Criar mudanças de tema sem aprovação pode levar a:* Problemas de consistência visual
* Falhas de usabilidade
* Dificuldade de manutenção e atualização do aplicativo

**Exemplo de Código**```python
# Exemplo de código para criar uma mudança de tema
def criar_mudanca_de_tema(tema):
    # Código para criar a mudança de tema
    pass

# Exemplo de uso
criar_mudanca_de_tema("tema1")
```**Como Resolver**Para evitar problemas, é importante criar mudanças de tema com aprovação. Aqui estão algumas dicas:* Crie um processo de aprovação claro e documentado
* Invista em design e usabilidade para garantir que as mudanças de tema sejam consistentes e fáceis de usar
* Teste as mudanças de tema antes de implementá-las
* Mantenha um registro das mudanças de tema para facilitar a manutenção e atualização do aplicativo

**Recursos Adicionais***[Documentação de design](https://www.example.com/design-documentation)
* [Guia de usabilidade](https://www.example.com/usability-guide)
* [Exemplo de código para criar uma mudança de tema](https://www.example.com/theme-change-example)

**Problema:** Adicionar nova cor ao `tailwind.config.ts` sem perguntar.

**Por que está errado:** Alterações de tema afetam todo o projeto, é necessário o consentimento do usuário.

**Conserto:** Pergunte primeiro, explique a razão, obtenha aprovação.

## Lista Resumida

**Antes de criar qualquer componente:**

- [ ] **Versão do Tailwind CSS detectada (v3 ou v4) a partir do package.json**
- [ ] Verificado a configuração de tema existente (configuração Tailwind ou variáveis CSS)
- [ ] Extraí as cores existentes e as documentei
- [ ] Extraiu as fontes existentes e as documentou
- [ ] Revisado 2-3 componentes existentes em busca de padrões
- [ ] Identificado escala de espaçamento, raio de borda, padrões de sombra
- [ ] Confirmei que estou usando tokens do tema, não valores arbitrários
- [ ] Estados de hover/foco correspondentes aos componentes existentes
- [ ] Verificado contraste de cores atende ao WCAG 2.1 AA (4.5:1 para texto) - Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Perguntou ao usuário antes de adicionar qualquer nova cor ou fonte
- [ ] Manutenção de consistência visual em todos os componentes

**Isso é sobre CONSISTÊNCIA, não criar novos designs.**  Coincidir com o que existe, perguntar antes de mudar.