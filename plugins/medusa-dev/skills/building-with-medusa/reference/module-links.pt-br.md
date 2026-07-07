# Links de módulos

## Índice

- [Quando usar links](#quando-usar-links)
- [Implementação de links de módulos — Lista de verificação do fluxo de trabalho](#implementacao-de-links-entre-modulos-lista-de-verificacao-do-fluxo-de-trabalho)
- [Etapa 1: Definição de um link](#etapa-1-definindo-um-link)
- [Etapa 2: Opções de configuração de links](#etapa-2-opcoes-de-configuracao-de-links)
  - [Links de lista (um para muitos)](#implementacao-de-links-entre-modulos-lista-de-verificacao-do-fluxo-de-trabalho)
  - [Exclusão em cascata](#exclusão-em-cascata)
- [Etapa 3: Sincronizar ligações (executar migrações)](#etapa-3-sincronizar-links-executar-migracoes)
- [Etapa 4: Gerenciar ligações](#etapa-4-gerenciamento-de-links)
- [Etapa 5: Consulta de dados vinculados](#etapa-5-consulta-de-dados-vinculados)
- [Avançado: Vinculação com colunas personalizadas](#avancado-vinculacao-com-colunas-personalizadas)

Os links entre módulos criam associações entre modelos de dados em diferentes módulos, mantendo o isolamento entre eles. Use links para conectar seus modelos personalizados aos modelos do Módulo de Comércio (produtos, clientes, pedidos etc.).

## Quando usar links

- **Estender entidades de comércio**: adicionar marcas a produtos, listas de desejos a clientes
- **Associações entre módulos**: conectar módulos personalizados entre si
- **Manter o isolamento**: Mantenha os módulos independentes e reutilizáveis

## Implementação de links entre módulos - Lista de verificação do fluxo de trabalho

**IMPORTANTE PARA O CÓDIGO DO CLAUDE**: Ao implementar links entre módulos, use a ferramenta TodoWrite para acompanhar seu progresso ao longo dessas etapas. Isso garante que você não deixe de realizar nenhuma etapa crítica e oferece visibilidade ao usuário.

Crie estas tarefas em sua lista de afazeres:

- Opcional: Adicione o ID vinculado no modelo de dados personalizado (se for um-para-um ou um-para-muitos)
- Defina o link em src/links/
- Configure as opções de lista ou exclusão em cascata, se necessário
- **CRÍTICO: Execute as migrações: npx medusa db:migrate** (Nunca pule esta etapa!)
- Crie links no código usando link.create() ou createRemoteLinkStep
- Consulte dados vinculados usando query.graph()
- **CRÍTICO: Execute a compilação para validar a implementação** (detecta erros de tipo e outros problemas)

## Opcional: Adicione o ID vinculado no modelo de dados personalizado

Adicione o ID de um modelo de dados vinculado ao modelo de dados personalizado se este pertencer a ele ou o estender. Caso contrário, pule esta etapa.

Por exemplo, adicione o ID do cliente e do produto ao modelo personalizado de avaliação de produtos:

```typescript
import { model } from "@medusajs/framework/utils"

const Review = model.define("review", {
  // other properties...
  // ID of linked customer
  customer_id: model.text(),
  // ID of linked product
  product_id: model.text()
})

export default Review
```

## Etapa 1: Definindo um link

**⚠️ REGRA FUNDAMENTAL: Crie UMA definição de link por arquivo.** NÃO exporte uma matriz de links a partir de um único arquivo.

Crie arquivos de link em `src/links/`:

```typescript
// ✅ CORRECT - src/links/product-brand.ts (one link per file)
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import BrandModule from "../modules/brand"

export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand
)
```

**Se um modelo estiver vinculado a vários outros, crie vários arquivos:**

```typescript
// ✅ CORRECT - src/links/review-product.ts
export default defineLink(
  ReviewModule.linkable.review,
  ProductModule.linkable.product
)

// ✅ CORRECT - src/links/review-customer.ts
export default defineLink(
  ReviewModule.linkable.review,
  CustomerModule.linkable.customer
)

// ❌ WRONG - Don't export array of links from one file
export default [
  defineLink(ReviewModule.linkable.review, ProductModule.linkable.product),
  defineLink(ReviewModule.linkable.review, CustomerModule.linkable.customer),
] // This doesn't work!
```

**IMPORTANTE:** A propriedade `.linkable` é **adicionada automaticamente** a todos os módulos pelo Medusa. Você NÃO precisa adicionar `.linkable()` nem qualquer definição de linkable aos seus modelos de dados. Basta usar `ModuleName.linkable.modelName` ao definir links.

Por exemplo, se você tiver um modelo de dados `Review` em um `ReviewModule`:

- ✅ CORRETO: `ReviewModule.linkable.review` (funciona automaticamente)
- ❌ INCORRETO: Adicionar o método `.linkable()` à definição do modelo Review (desnecessário, causa erros)

**⚠️ PRÓXIMA ETAPA**: Após definir um link, você DEVE prosseguir imediatamente para a Etapa 3 para executar as migrações (`npx medusa db:migrate`). Não pule esta etapa!

## Etapa 2: Opções de configuração de links

### Lista de links (um para muitos)

Permite que vários registros sejam vinculados a um único registro:

```typescript
// A brand can have many products
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  BrandModule.linkable.brand
)
```

### Exclusão em cascata

Exclui automaticamente os links quando um registro é excluído:

```typescript
export default defineLink(ProductModule.linkable.product, {
  linkable: BrandModule.linkable.brand,
  deleteCascade: true,
})
```

## Etapa 3: Sincronizar links (executar migrações)

**⚠️ CRÍTICO – NÃO PULE**: Após definir os links, você DEVE executar as migrações para sincronizar o link com o banco de dados. Sem essa etapa, o link não funcionará e você receberá erros de execução.

```bash
npx medusa db:migrate
```

**Por que isso é importante:**

- Os links criam tabelas no banco de dados que armazenam as relações entre os módulos
- Sem as migrações, essas tabelas não existem e as operações dos links falharão
- Esta etapa é OBRIGATÓRIA antes de criar quaisquer links no código ou consultar dados vinculados

**Erro comum:** Definir um link em `src/links/` e tentar usá-lo imediatamente em um fluxo de trabalho ou consulta sem executar as migrações primeiro. Sempre execute as migrações imediatamente após definir um link.

## Etapa 4: Gerenciamento de links

**⚠️ CRÍTICO – Ordem dos links (direção):** Ao criar ou descartar links, a ordem dos módulos DEVE corresponder à ordem em `defineLink()`. Uma ordem incorreta causa erros de tempo de execução.

```typescript
// Example link definition: product FIRST, then brand
export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand
)
```

### Nas funções de composição de fluxo de trabalho

Para criar um link entre registros nas funções de composição de fluxo de trabalho, use o `createRemoteLinkStep`:

```typescript
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

const BRAND_MODULE = "brand"

export const myWorkflow = createWorkflow(
  "my-workflow",
  function (input) {
    // ...
    // ✅ CORRECT - Order matches defineLink (product first, then brand)
    const linkData = transform({ input }, ({ input }) => {
      return [
        {
          [Modules.PRODUCT]: {
            product_id: input.product_id,
          },
          [BRAND_MODULE]: {
            brand_id: input.brand_id,
          },
        },
      ]
    })

    createRemoteLinkStep(linkData)
    // ...
  }
)

// ❌ WRONG - Order doesn't match defineLink
const linkData = transform({ input }, ({ input }) => {
  return [
    {
      [BRAND_MODULE]: {
        brand_id: input.brand_id,
      },
      [Modules.PRODUCT]: {
        product_id: input.product_id,
      },
    },
  ]
}) // Runtime error: link direction mismatch!
```

Para descartar (remover) uma ligação entre registros nas funções de composição de fluxo de trabalho, use o `dismissRemoteLinkStep`:

```typescript
import { Modules } from "@medusajs/framework/utils"
import { dismissRemoteLinkStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

const BRAND_MODULE = "brand"

export const myWorkflow = createWorkflow(
  "my-workflow",
  function (input) {
    // ...
    // Order MUST match defineLink (product first, then brand)
    const linkData = transform({ input }, ({ input }) => {
      return [
        {
          [Modules.PRODUCT]: {
            product_id: input.product_id,
          },
          [BRAND_MODULE]: {
            brand_id: input.brand_id,
          },
        },
      ]
    })

    dismissRemoteLinkStep(linkData)
    // ...
  }
)
```

### Fluxos de trabalho externos

Em fluxos de trabalho externos ou em etapas de fluxo de trabalho, use o utilitário `link` para criar e gerenciar links entre registros. **A ordem DEVE corresponder à função `defineLink()` também aqui:**

```typescript
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// In an API route or workflow step
const link = container.resolve(ContainerRegistrationKeys.LINK)

const BRAND_MODULE = "brand"

// ✅ CORRECT - Create a link (order matches defineLink: product first, then brand)
await link.create({
  [Modules.PRODUCT]: { product_id: "prod_123" },
  [BRAND_MODULE]: { brand_id: "brand_456" },
})

// ✅ CORRECT - Dismiss (remove) a link (same order: product first, then brand)
await link.dismiss({
  [Modules.PRODUCT]: { product_id: "prod_123" },
  [BRAND_MODULE]: { brand_id: "brand_456" },
})

// ❌ WRONG - Order doesn't match defineLink
await link.create({
  [BRAND_MODULE]: { brand_id: "brand_456" },
  [Modules.PRODUCT]: { product_id: "prod_123" },
}) // Runtime error: link direction mismatch!
```

## Etapa 5: Consulta de dados vinculados

### Usando query.graph() — Recuperação de dados vinculados

Use `query.graph()` para buscar dados em módulos vinculados. **Observação**: `query.graph()` pode recuperar dados vinculados, mas **não pode filtrar por propriedades de módulos vinculados** (modelos de dados em módulos separados).

```typescript
const query = container.resolve("query")

// ✅ Get products with their linked brands (no cross-module filtering)
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "brand.*"], // brand.* fetches linked brand data
  filters: {
    id: "prod_123", // ✅ Filter by product properties only
  },
})

// ✅ Get brands with their linked products
const { data: brands } = await query.graph({
  entity: "brand",
  fields: ["id", "name", "products.*"],
})

// ❌ DOES NOT WORK: Cannot filter products by linked brand properties
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "brand.*"],
  filters: {
    brand: {
      name: "Nike" // ❌ Fails: brand is in a different module
    }
  }
})
```

### Usando query.index() — Filtragem entre módulos vinculados

Para filtrar por propriedades de módulos vinculados (módulos separados por links de módulo), use `query.index()` do Módulo de Índice:

```typescript
const query = container.resolve("query")

// ✅ Filter products by linked brand name using Index Module
const { data: products } = await query.index({
  entity: "product",
  fields: ["*", "brand.*"],
  filters: {
    brand: {
      name: "Nike" // ✅ Works with Index Module!
    }
  }
})
```

**Diferencial importante:**

- **Relações entre módulos iguais** (por exemplo, Produto → Variante do Produto): Use `query.graph()` — a filtragem funciona ✅
- **Relações entre módulos diferentes** (por exemplo, Produto → Marca): Use `query.index()` para filtrar ✅

**Requisitos do módulo de indexação:**

1. Instale o pacote `@medusajs/index`
2. Adicione ao `medusa-config.ts`
3. Ative `MEDUSA_FF_INDEX_ENGINE=true` no `.env`
4. Execute `npx medusa db:migrate`
5. Marque as propriedades como `filterable` na definição do link:

```typescript
// src/links/product-brand.ts
defineLink(
  { linkable: ProductModule.linkable.product, isList: true },
  { linkable: BrandModule.linkable.brand, filterable: ["id", "name"] }
)
```

Consulte a [Referência sobre consulta de dados](querying-data.md#querying-linked-data) para obter detalhes completos sobre ambos os métodos.

## Avançado: Vinculação com colunas personalizadas

Adicione dados adicionais à tabela de vinculação:

```typescript
export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand,
  {
    database: {
      extraColumns: {
        featured: {
          type: "boolean",
          defaultValue: "false",
        },
      },
    },
  }
)
```

Defina valores de colunas personalizadas ao criar vinculações:

```typescript
await link.create({
  product: { product_id: "prod_123" },
  brand: { brand_id: "brand_456" },
  data: { featured: true },
})
```
