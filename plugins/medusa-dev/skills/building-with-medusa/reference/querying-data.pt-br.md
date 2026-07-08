# Consulta de dados no Medusa

A API de consulta do Medusa (`query.graph()`) é a principal forma de recuperar dados, especialmente entre módulos. Ela oferece uma maneira flexível e eficiente de consultar entidades por meio de relações e filtros.

## Índice

- [Quando usar a consulta em vez dos serviços de módulo](#quando-usar-os-servicos-de-consulta-query-em-vez-dos-servicos-de-modulo-module)
- [Estrutura básica da consulta](#estrutura-basica-da-consulta)
- [Dentro e fora de fluxos de trabalho](#dentro-dos-fluxos-de-trabalho-vs-fora-dos-fluxos-de-trabalho)
- [Seleção de campos](#selecao-de-campos)
- [Filtragem](#filtragem)
- [Limitação importante na filtragem](#limitacao-importante-na-filtragem)
- [Paginação](#paginacao)
- [Consulta de dados vinculados](#consulta-de-dados-vinculados)
  - [Opção 1: query.graph() - Recuperar dados vinculados sem filtros entre módulos](#consulta-de-dados-vinculados)
  - [Opção 2: query.index() - Filtrar entre módulos vinculados (Módulo de Índice)](#quando-usar-os-servicos-de-consulta-query-em-vez-dos-servicos-de-modulo-module)
- [Validação com throwIfKeyNotFound](#validacao-com-throwifkeynotfound)
- [Melhores práticas de desempenho](#melhores-praticas-de-desempenho)

## Quando usar os serviços de consulta (Query) em vez dos serviços de módulo (Module)

**⚠️ USE OS SERVIÇOS DE CONSULTA (QUERY) PARA**:

- ✅ Recuperar dados **entre módulos** (produtos com marcas vinculadas, pedidos com clientes)
- ✅ Ler dados com entidades vinculadas
- ✅ Consultas complexas com múltiplas relações
- ✅ Recuperação de dados da loja virtual e da área administrativa

**⚠️ USE OS SERVIÇOS DE MÓDULO PARA**:

- ✅ Recuperar dados **dentro de um único módulo** (produtos com variantes — mesmo módulo)
- ✅ Usar `listAndCount` para paginação dentro de um módulo
- ✅ Mutações (sempre use serviços de módulo ou fluxos de trabalho)

**Exemplos:**

```typescript
// ✅ GOOD: Query for cross-module data
const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title", "brand.*"], // brand is in different module
})

// ✅ GOOD: Module service for single module
const [products, count] = await productService.listAndCountProducts(
  { status: "active" },
  { take: 10, skip: 0 }
)
```

## Estrutura básica da consulta

```typescript
const query = req.scope.resolve("query")

const { data } = await query.graph({
  entity: "entity_name",     // The entity to query
  fields: ["id", "name"],    // Fields to retrieve
  filters: { status: "active" }, // Filter conditions
  pagination: {              // Optional pagination
    take: 10,
    skip: 0,
  },
})
```

## Dentro dos fluxos de trabalho vs. fora dos fluxos de trabalho

### Fora dos fluxos de trabalho (rotas de API, assinantes, tarefas agendadas)

```typescript
// In API routes
const query = req.scope.resolve("query")

const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title"],
})

// In subscribers/scheduled jobs
const query = container.resolve("query")

const { data: customers } = await query.graph({
  entity: "customer",
  fields: ["id", "email"],
})
```

### Dentro dos fluxos de trabalho

Use `useQueryGraphStep` dentro das funções de composição de fluxos de trabalho:

```typescript
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

const myWorkflow = createWorkflow(
  "my-workflow",
  function (input) {
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["id", "title"],
      filters: {
        id: input.product_id,
      },
    })

    return new WorkflowResponse({ products })
  }
)
```

## Seleção de campos

### Campos básicos

```typescript
const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title", "description"],
})
```

### Relações aninhadas

Use a notação de ponto para incluir entidades relacionadas:

```typescript
const { data } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "variants.*", // All fields from variants
    "variants.sku", // Specific variant field
    "category.id",
    "category.name",
  ],
})
```

### Dica de desempenho

**⚠️ IMPORTANTE**: Recupere apenas os campos e as relações que você realmente vai usar. Evite usar `*` para selecionar todos os campos ou recuperar todos os campos de uma relação desnecessariamente.

```typescript
// ❌ BAD: Retrieves all fields (inefficient)
fields: ["*"]

// ❌ BAD: Retrieves all product fields (might be many)
fields: ["product.*"]

// ✅ GOOD: Only retrieves needed fields
fields: ["id", "title", "product.id", "product.title"]
```

## Filtragem

### Correspondência exata

```typescript
filters: {
  email: "user@example.com"
}
```

### Vários valores (operador IN)

```typescript
filters: {
  id: ["id1", "id2", "id3"]
}
```

### Consultas de intervalo

```typescript
filters: {
  created_at: {
    $gte: startDate, // Greater than or equal
    $lte: endDate,   // Less than or equal
  }
}
```

### Pesquisa de texto (LIKE)

```typescript
filters: {
  name: {
    $like: "%search%" // Contains "search"
  }
}

// Starts with
filters: {
  name: {
    $like: "search%"
  }
}

// Ends with
filters: {
  name: {
    $like: "%search"
  }
}
```

### Diferente de

```typescript
filters: {
  status: {
    $ne: "deleted"
  }
}
```

### Várias condições

```typescript
filters: {
  status: "active",
  created_at: {
    $gte: new Date("2024-01-01"),
  },
  price: {
    $gte: 10,
    $lte: 100,
  },
}
```

### Filtragem de relações aninhadas (mesmo módulo)

Para filtrar por campos em relações aninhadas **dentro do mesmo módulo**, use a notação de objeto:

```typescript
// Product and ProductVariant are in the same module (Product Module)
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*"],
  filters: {
    variants: {
      sku: "ABC1234" // ✅ Works: variants are in same module as product
    }
  }
})
```

## Limitação importante na filtragem

**⚠️ CRÍTICO**: Com `query.graph()`, você **NÃO PODE** filtrar por campos de modelos de dados vinculados em módulos diferentes. O método `query.graph()` suporta apenas filtros em modelos de dados dentro do mesmo módulo.

### O que isso significa

- **Módulos iguais** (✅ É possível filtrar com `query.graph()`): Product e ProductVariant, Order e LineItem, Cart e CartItem
- **Módulos diferentes** (❌ Não é possível filtrar com `query.graph()`): Product e Brand (personalizado), Product e Customer, Review e Product
- **Módulos diferentes** (✅ É possível filtrar com `query.index()`): quaisquer módulos vinculados ao usar o Módulo de Índice

### Exemplo: não é possível filtrar produtos por marca vinculada com `query.graph()`

```typescript
// ❌ THIS DOES NOT WORK with query.graph()
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "brand.*"],
  filters: {
    "brand.name": "Nike" // ❌ Cannot filter by linked module field
  }
})

// ❌ THIS ALSO DOES NOT WORK with query.graph()
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "brand.*"],
  filters: {
    brand: {
      name: "Nike" // ❌ Still doesn't work - brand is in different module
    }
  }
})
```

### Solução 1: Use query.index() com o Módulo de Índice (Recomendado)

**✅ MELHOR ABORDAGEM**: Use o Módulo de Índice para filtrar de forma eficiente entre módulos vinculados no nível do banco de dados:

```typescript
// ✅ CORRECT: Use query.index() to filter products by linked brand
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

**Por que essa é a melhor opção:**

- Filtragem no nível do banco de dados (mais eficiente)
- Suporta paginação corretamente
- Recupera apenas os dados de que você precisa
- Projetado especificamente para filtragem entre módulos

**Requisitos:**

- O Módulo de Índice deve estar instalado e configurado
- O link deve ter propriedades `filterable` definidas
- Consulte a seção [Consultando dados vinculados](#querying-linked-data) para obter detalhes sobre a configuração

### Solução 2: Consulta pelo outro lado

**✅ BOA ALTERNATIVA**: Consulte o módulo vinculado e filtre diretamente nele usando `query.graph()`:

```typescript
// ✅ CORRECT: Query brands and get their products
const { data: brands } = await query.graph({
  entity: "brand",
  fields: ["id", "name", "products.*"],
  filters: {
    name: "Nike" // ✅ Filter on brand directly
  }
})

// Access Nike products
const nikeProducts = brands[0]?.products || []
```

**Use isso quando:**

- Você não tiver o Módulo de Índice configurado
- O “outro lado” do link fizer sentido como entidade principal
- Você precisar de uma solução rápida, sem configuração adicional

### Solução 3: Filtrar após a consulta (menos eficiente)

**⚠️ ÚLTIMO RECURSO**: Consulte todos os dados com `query.graph()` e, em seguida, filtre em JavaScript:

```typescript
// Get all products with brands
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "brand.*"],
})

// Filter in JavaScript after query
const nikeProducts = products.filter(p => p.brand?.name === "Nike")
```

**Utilize isso apenas quando:**

- O conjunto de dados for muito pequeno (< 100 registros)
- O Módulo de Índice não estiver disponível
- Realizar consultas pelo outro lado não fizer sentido
- Você precisar de uma solução temporária

**Evite porque:**

- Busca dados desnecessários do banco de dados
- É ineficiente para conjuntos de dados grandes
- Não há suporte à paginação no nível do banco de dados
- Consome mais memória e largura de banda da rede

### Mais exemplos

#### Exemplo: Avaliações aprovadas para um produto específico

Quando você precisa filtrar dados vinculados por suas próprias propriedades, há várias opções:

```typescript
// ❌ WRONG: Cannot filter linked reviews from product query with query.graph()
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "reviews.*"],
  filters: {
    id: productId,
    reviews: {
      status: "approved" // ❌ Doesn't work - reviews is linked module
    }
  }
})

// ❌ ALSO WRONG: Filtering in JavaScript is inefficient
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "reviews.*"],
  filters: { id: productId }
})
const approvedReviews = products[0].reviews.filter(r => r.status === "approved") // ❌ Client-side filter

// ✅ OPTION 1 (BEST): Use Index Module to filter cross-module
const { data: products } = await query.index({
  entity: "product",
  fields: ["*", "reviews.*"],
  filters: {
    id: productId,
    reviews: {
      status: "approved" // ✅ Works with Index Module!
    }
  }
})

// ✅ OPTION 2 (GOOD): Query reviews directly with filters
const { data: reviews } = await query.graph({
  entity: "review",
  fields: ["id", "rating", "comment", "product.*"],
  filters: {
    product_id: productId, // Filter by product
    status: "approved"     // Filter by review status - both in same query!
  }
})
```

**Por que a Opção 1 (Módulo de Índice) é a melhor:**

- Filtragem no nível do banco de dados entre módulos
- Retorna os dados na estrutura esperada (produto com avaliações)
- Suporta a paginação corretamente
- Recupera apenas os dados de que você precisa

**Por que a Opção 2 (consulta do outro lado) é boa:**

- Não requer configuração do Módulo de Índice
- Ainda utiliza filtragem no banco de dados
- Funciona bem quando o “outro lado” é a entidade primária lógica

#### Exemplo: Avaliações para produtos ativos (entre módulos)

```typescript
// ❌ WRONG: Cannot filter by linked module with query.graph()
const { data } = await query.graph({
  entity: "review",
  fields: ["id", "rating", "product.*"],
  filters: {
    product: {
      status: "active" // Doesn't work - product is linked module
    }
  }
})

// ✅ OPTION 1 (BEST): Use Index Module
const { data: reviews } = await query.index({
  entity: "review",
  fields: ["*", "product.*"],
  filters: {
    product: {
      status: "active" // ✅ Works with Index Module!
    }
  }
})

// ✅ OPTION 2 (GOOD): Query from the other side
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "reviews.*"],
  filters: { status: "active" }
})

// Flatten reviews if needed
const reviews = products.flatMap(p => p.reviews)
```

#### Exemplo: Produtos com variantes (mesmo módulo — funciona!)

```typescript
// ✅ CORRECT: Product and variants are in same module (Product Module)
// Use query.graph() - no need for Index Module
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*"],
  filters: {
    variants: {
      inventory_quantity: {
        $gte: 10 // ✅ Works: both in Product Module
      }
    }
  }
})
```

## Paginação

### Paginação básica

```typescript
const { data, metadata } = await query.graph({
  entity: "product",
  fields: ["id", "title"],
  pagination: {
    skip: 0,   // Offset
    take: 10,  // Limit
  },
})

// metadata.count contains total count
console.log(`Total: ${metadata.count}`)
```

### Com ordenação

```typescript
const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title", "created_at"],
  pagination: {
    skip: 0,
    take: 10,
    order: {
      created_at: "DESC", // Newest first
    },
  },
})
```

### Vários campos de ordenação

```typescript
pagination: {
  order: {
    status: "ASC",
    created_at: "DESC",
  }
}
```

## Consulta de dados vinculados

Quando as entidades estão vinculadas por meio de [links de módulo](module-links.md), você tem duas opções, dependendo das suas necessidades de filtragem:

### Opção 1: query.graph() - Recuperar dados vinculados sem filtros entre módulos

**Use `query.graph()` quando:**

- ✅ For recuperar dados vinculados sem filtrar pelas propriedades dos módulos vinculados
- ✅ For filtrar apenas pelas propriedades do módulo da entidade principal
- ✅ Você deseja incluir dados relacionados na resposta

**Limitações:**

- ❌ **NÃO É POSSÍVEL filtrar por propriedades de módulos vinculados** (modelos de dados em módulos separados)
- ✅ **É POSSÍVEL filtrar por propriedades de relações no mesmo módulo** (por exemplo, product.variants)

```typescript
// ✅ WORKS: Get products with their linked brands (no cross-module filtering)
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "brand.*", // All brand fields
  ],
  filters: {
    id: "prod_123", // ✅ Filter by product property (same module)
  },
})

// Access linked data
console.log(products[0].brand.name)

// ✅ WORKS: Filter by same-module relation (product and variants are in Product Module)
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*"],
  filters: {
    variants: {
      sku: "ABC1234" // ✅ Works: variants are in same module as product
    }
  }
})

// ❌ DOES NOT WORK: Cannot filter products by linked brand name
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

**Consulta reversa (do link ao original):**

```typescript
// Get brands with their linked products
const { data: brands } = await query.graph({
  entity: "brand",
  fields: [
    "id",
    "name",
    "products.*", // All linked products
  ],
})

// Access linked products
brands[0].products.forEach(product => {
  console.log(product.title)
})
```

### Opção 2: query.index() — Filtrar entre módulos vinculados (módulo de índice)

**Use `query.index()` quando:**

- ✅ Você precisar filtrar dados por propriedades de módulos vinculados (módulos separados por links de módulo)
- ✅ Filtragem por propriedades do modelo de dados personalizado vinculadas a entidades do Módulo de Comércio
- ✅ Consultas complexas entre módulos que exigem filtragem eficiente no nível do banco de dados

**Diferencial principal:**

- **Relações dentro do mesmo módulo** (por exemplo, Produto → Variante do Produto): Use `query.graph()` ✅
- **Vínculos entre módulos diferentes** (por exemplo, Produto → Marca, Produto → Avaliação): Use `query.index()` ✅

#### Quando usar `query.index()`

O Módulo de Índice resolve a limitação fundamental do `query.graph()`: **não é possível filtrar os dados de um módulo pelas propriedades vinculadas de outro módulo** usando `query.graph()`.

Exemplos de situações em que você precisa usar `query.index()`:

- Filtrar produtos por marca (Módulo de Produtos → Módulo de Marcas)
- Filtrar produtos por avaliações (Módulo de Produtos → Módulo de Avaliações)
- Filtrar clientes por nível de fidelidade personalizado (Módulo de Clientes → Módulo de Fidelidade)
- Qualquer cenário em que seja necessário filtrar por propriedades de um modelo de dados vinculado em um módulo diferente

#### Requisitos de configuração

Antes de usar `query.index()`, certifique-se de que o Módulo de Índice esteja configurado:

1. **Instale o Módulo de Índice:**

   ```bash
   npm install @medusajs/index
   ```

2. **Adicione ao `medusa-config.ts`:**

   ```typescript
   module.exports = defineConfig({
     modules: [
       {
         resolve: "@medusajs/index",
       },
     ],
   })
   ```

3. **Habilite o sinalizador de recurso no `.env`:**

   ```bash
   MEDUSA_FF_INDEX_ENGINE=true
   ```

4. **Execute as migrações:**

   ```bash
   npx medusa db:migrate
   ```

5. **Marque as propriedades vinculadas como filtráveis** na sua definição de link:

   ```typescript
   // src/links/product-brand.ts
   defineLink(
     { linkable: ProductModule.linkable.product, isList: true },
     { linkable: BrandModule.linkable.brand, filterable: ["id", "name"] }
   )
   ```

   A propriedade `filterable` indica quais campos podem ser consultados entre os módulos.

6. **Inicie o aplicativo** para acionar a ingestão de dados no Módulo de Índice.

#### Usando query.index()

```typescript
const query = req.scope.resolve("query")

// ✅ CORRECT: Filter products by linked brand name using Index Module
const { data: products } = await query.index({
  entity: "product",
  fields: ["*", "brand.*"],
  filters: {
    brand: {
      name: "Nike", // ✅ Works with Index Module!
    },
  },
})

// ✅ CORRECT: Filter products by review ratings
const { data: products } = await query.index({
  entity: "product",
  fields: ["id", "title", "reviews.*"],
  filters: {
    reviews: {
      rating: {
        $gte: 4, // Products with reviews rated 4 or higher
      },
    },
  },
})
```

#### Recursos do query.index()

**Paginação:**

```typescript
const { data: products } = await query.index({
  entity: "product",
  fields: ["*", "brand.*"],
  filters: {
    brand: { name: "Nike" },
  },
  pagination: {
    take: 20,
    skip: 0,
  },
})
```

**Filtros avançados:**

```typescript
const { data: products } = await query.index({
  entity: "product",
  fields: ["*", "brand.*"],
  filters: {
    brand: {
      name: {
        $like: "%Acme%", // LIKE operator
      },
    },
    status: {
      $ne: "deleted", // Not equal
    },
  },
})
```

#### Árvore de decisão: query.graph() vs query.index()

```
Need to filter by linked module properties?
├─ No → Use query.graph()
│   └─ Faster, simpler, works for most queries
│
└─ Yes → Are the entities in the same module or different modules?
    ├─ Same module (e.g., product.variants) → Use query.graph()
    │   └─ Example: Product and ProductVariant both in Product Module
    │
    └─ Different modules (e.g., product → brand) → Use query.index()
        └─ Example: Product (Product Module) → Brand (Custom Module)
        └─ Requires Index Module setup and filterable properties
```

#### Observações importantes

- **Desempenho:** O Módulo de Índice pré-carrega os dados na inicialização do aplicativo, permitindo uma filtragem eficiente entre módulos
- **Atualização dos dados:** Os dados são sincronizados automaticamente, mas pode haver um breve atraso após as alterações
- **Alternativa:** Se você não precisar de filtragem, `query.graph()` é suficiente e mais simples
- **Relações entre módulos:** Sempre use `query.graph()` para relações dentro do mesmo módulo (produto → variantes, pedido → itens de linha)

## Validação com throwIfKeyNotFound

Use `throwIfKeyNotFound` para validar se um registro existe antes de realizar operações:

```typescript
// Outside workflows
const query = req.scope.resolve("query")

const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title"],
  filters: {
    id: productId,
  },
}, {
  throwIfKeyNotFound: true, // Throws if product doesn't exist
})

// If we get here, product exists
const product = data[0]
```

```typescript
// In workflows
const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: ["id", "title"],
  filters: {
    id: input.product_id,
  },
  options: {
    throwIfKeyNotFound: true, // Throws if product doesn't exist
  },
})
```

**Quando usar:**

- ✅ Antes de atualizar ou excluir um registro
- ✅ Quando o registro DEVE existir para que a operação continue
- ✅ Para evitar verificações manuais de existência

```typescript
// ❌ BAD: Manual check
const { data } = await query.graph({ /* ... */ })
if (!data || data.length === 0) {
  throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
}

// ✅ GOOD: Let query handle it
const { data } = await query.graph(
  { /* ... */ },
  { throwIfKeyNotFound: true }
)
```

## Melhores práticas de desempenho

### 1. Consulte apenas o que for necessário

**⚠️ CRÍTICO**: Especifique sempre apenas os campos que você vai usar. Evite usar `*` ou consultar relações desnecessárias.

```typescript
// ❌ BAD: Retrieves everything (slow, wasteful)
fields: ["*"]

// ✅ GOOD: Only needed fields (fast)
fields: ["id", "title", "price"]
```

### 2. Limite a profundidade das relações

Não há um limite rígido para a profundidade das relações, mas consultas mais profundas são mais lentas. Inclua apenas as relações que você realmente vai usar.

```typescript
// ❌ BAD: Unnecessary depth
fields: [
  "id",
  "title",
  "variants.*",
  "variants.product.*", // Circular, unnecessary
  "variants.prices.*",
  "variants.prices.currency.*", // Probably don't need all currency fields
]

// ✅ GOOD: Appropriate depth
fields: [
  "id",
  "title",
  "variants.id",
  "variants.sku",
  "variants.prices.amount",
  "variants.prices.currency_code",
]
```

### 3. Use paginação para conjuntos de resultados grandes

```typescript
// ✅ GOOD: Paginated query
const { data, metadata } = await query.graph({
  entity: "product",
  fields: ["id", "title"],
  pagination: {
    take: 50, // Don't retrieve thousands of records at once
    skip: 0,
  },
})
```

### 4. Filtre logo no início

Aplique filtros para reduzir o conjunto de dados antes de recuperar campos e relações:

```typescript
// ✅ GOOD: Filters reduce result set first
const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*"],
  filters: {
    status: "published",
    created_at: {
      $gte: lastWeek,
    },
  },
})
```

### 5. Use consultas específicas para diferentes casos de uso

```typescript
// ✅ For listings (minimal fields)
const { data: listings } = await query.graph({
  entity: "product",
  fields: ["id", "title", "thumbnail", "price"],
})

// ✅ For detail pages (more fields)
const { data: details } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "description",
    "thumbnail",
    "images.*",
    "variants.*",
    "variants.prices.*",
  ],
  filters: { id: productId },
})
```

## Padrões comuns

### Padrão: Lista com pesquisa

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { q } = req.validatedQuery

  const filters: any = {}
  if (q) {
    filters.title = { $like: `%${q}%` }
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "thumbnail"],
    filters,
    ...req.queryConfig, // Uses request query config
  })

  return res.json({ products })
}
```

### Padrão: Recuperação com validação

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params

  // Throws 404 if product doesn't exist
  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "title", "description", "variants.*"],
    filters: { id },
  }, {
    throwIfKeyNotFound: true,
  })

  return res.json({ product: data[0] })
}
```

### Padrão: Consulta com relações e filtros

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { category_id } = req.validatedQuery

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "thumbnail",
      "variants.id",
      "variants.prices.amount",
      "category.name",
    ],
    filters: {
      category_id,
      status: "published",
    },
    pagination: {
      take: 20,
      skip: 0,
    },
  })

  return res.json({ products })
}
```

### Padrão: Contagem de registros

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data, metadata } = await query.graph({
    entity: "product",
    fields: ["id"], // Minimal fields for counting
    filters: {
      status: "published",
    },
  })

  return res.json({
    count: metadata.count,
  })
}
```

### Padrão: Itens recentes

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data: recentProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "created_at"],
    pagination: {
      take: 10,
      skip: 0,
      order: {
        created_at: "DESC", // Newest first
      },
    },
  })

  return res.json({ products: recentProducts })
}
```
