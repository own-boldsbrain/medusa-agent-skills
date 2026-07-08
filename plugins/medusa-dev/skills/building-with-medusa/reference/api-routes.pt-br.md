# Rotas de API personalizadas

As rotas de API (também chamadas de “endpoints”) são a principal forma de disponibilizar funcionalidades personalizadas para lojas virtuais e painéis de administração.

## Índice

- [Convenções de caminho](#convencoes-de-caminho)
- [Validação por middleware](#validacao-por-middleware)
- [Validação de parâmetros de consulta](#validacao-de-parametros-de-consulta)
- [Configuração de consulta de solicitação para endpoints de lista](#configuracao-de-consulta-de-solicitacao-para-endpoints-de-lista)
- [Estrutura da rota da API](#estrutura-das-rotas-da-api)
- [Tratamento de erros](#tratamento-de-erros)
- [Rotas protegidas](#rotas-protegidas)
- [Como usar fluxos de trabalho em rotas de API](#uso-de-fluxos-de-trabalho-em-rotas-de-api)

## Convenções de caminho

### Rotas da API da loja (Storefront)

- **Prefixo do caminho**: `/store/<rest-of-path>`
- **Exemplos**: `/store/newsletter-signup`, `/store/custom-search`
- **Autenticação**: o SDK inclui automaticamente uma chave de API publicável

### Rotas da API de administração (Painel)

- **Prefixo do caminho**: `/admin/<rest-of-path>`
- **Exemplos**: `/admin/custom-reports`, `/admin/bulk-operations`
- **Autenticação**: o SDK inclui automaticamente cabeçalhos de autenticação (bearer/session)

**Padrões detalhados de autenticação**: Consulte [authentication.md](authentication.md)

## Validação por middleware

**⚠️ CRÍTICO**: Sempre valide os corpos das solicitações usando esquemas Zod e o middleware `validateAndTransformBody`.

### Combinação de vários middlewares

Quando você precisar tanto de autenticação quanto de validação, passe-as como um array. **NUNCA aninhe a validação dentro da autenticação:**

```typescript
// ✅ CORRECT - Multiple middlewares in array
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products/:id/reviews",
      method: "POST",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(CreateReviewSchema)
      ],
    },
  ],
})

// ❌ WRONG - Don't nest validator inside authenticate
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products/:id/reviews",
      method: "POST",
      middlewares: [authenticate("customer", ["session", "bearer"], {
        validator: CreateReviewSchema  // This doesn't work!
      })],
    },
  ],
})
```

**A ordem dos middlewares é importante:** Coloque `authenticate` antes de `validateAndTransformBody` para que a autenticação ocorra primeiro.

### Passo 1: Criar o arquivo de middleware

```typescript
// api/store/[feature]/middlewares.ts
import { MiddlewareRoute, validateAndTransformBody } from "@medusajs/framework"
import { z } from "zod"

export const CreateMySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  // other fields
})

// Export the inferred type for use in route handlers
export type CreateMySchema = z.infer<typeof CreateMySchema>

export const myMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/my-route",
    method: "POST",
    middlewares: [validateAndTransformBody(CreateMySchema)],
  },
]
```

### Passo 2: Registrar em api/middlewares.ts

```typescript
// api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework/http"
import { myMiddlewares } from "./store/[feature]/middlewares"

export default defineMiddlewares({
  routes: [...myMiddlewares],
})
```

**⚠️ IMPORTANTE – Padrão de exportação de middlewares:**

Os middlewares são exportados como **arrays nomeados**, NÃO como exportações padrão com objetos de configuração:

```typescript
// ✅ CORRECT - Named export of MiddlewareRoute array
// api/store/reviews/middlewares.ts
export const reviewMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/reviews",
    method: "POST",
    middlewares: [validateAndTransformBody(CreateReviewSchema)],
  },
]

// ✅ CORRECT - Import and spread the named array
// api/middlewares.ts
import { reviewMiddlewares } from "./store/reviews/middlewares"

export default defineMiddlewares({
  routes: [...reviewMiddlewares],
})
```

```typescript
// ❌ WRONG - Don't use default export with .config
// api/store/reviews/middlewares.ts
export default {
  config: {
    routes: [...], // This is NOT the middleware pattern!
  },
}

// ❌ WRONG - Don't access .config.routes
// api/middlewares.ts
import reviewMiddlewares from "./store/reviews/middlewares"
export default defineMiddlewares({
  routes: [...reviewMiddlewares.config.routes], // This doesn't work!
})
```

**Por que isso é importante:**

- Os arquivos de middleware exportam matrizes diretamente, e não objetos de configuração
- Arquivos de rota (como `route.ts`) usam `export const config = defineRouteConfig(...)`
- Não confunda os dois padrões — os middlewares são mais simples (apenas um array)

### Passo 3: Use `req.validatedBody` tipado na rota

**⚠️ CRÍTICO**: Ao usar `req.validatedBody`, você DEVE passar o tipo de esquema Zod inferido como um argumento de tipo para `MedusaRequest`. Caso contrário, você receberá erros do TypeScript ao acessar `req.validatedBody`.

```typescript
// api/store/my-route/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CreateMySchema } from "./middlewares"

// ✅ CORRECT: Pass the Zod schema type as type argument
export async function POST(
  req: MedusaRequest<CreateMySchema>,
  res: MedusaResponse
) {
  // Now req.validatedBody is properly typed
  const { email, name } = req.validatedBody

  // ... rest of implementation
}

// ❌ WRONG: Without type argument, req.validatedBody will have type errors
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, name } = req.validatedBody // Type error!
}
```

## Validação de parâmetros de consulta

Para rotas de API que aceitam parâmetros de consulta, use o middleware `validateAndTransformQuery` para validá-los.

**⚠️ IMPORTANTE**: Ao usar `validateAndTransformQuery`, acesse os parâmetros de consulta por meio de `req.validatedQuery` em vez de `req.query`.

### Etapa 1: Criar um esquema de validação

Crie um esquema Zod para os parâmetros de consulta. Como os parâmetros de consulta são originalmente strings ou matrizes de strings, use `z.preprocess` para transformá-los em outros tipos:

```typescript
// api/custom/validators.ts
import { z } from "zod"

export const GetMyRouteSchema = z.object({
  cart_id: z.string(), // String parameters don't need preprocessing
  limit: z.preprocess(
    (val) => {
      if (val && typeof val === "string") {
        return parseInt(val)
      }
      return val
    },
    z.number().optional()
  ),
  status: z.enum(["active", "pending", "completed"]).optional(),
})
```

### Etapa 2: Adicionar middleware

```typescript
// api/middlewares.ts
import {
  validateAndTransformQuery,
  defineMiddlewares,
} from "@medusajs/framework/http"
import { GetMyRouteSchema } from "./custom/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/my-route",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetMyRouteSchema, {}),
      ],
    },
  ],
})
```

### Etapa 3: Usar consulta validada na rota

```typescript
// api/store/my-route/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Access validated query parameters (not req.query!)
  const { cart_id, limit, status } = req.validatedQuery

  // cart_id is string, limit is number, status is enum
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "my_entity",
    fields: ["id", "name"],
    filters: { cart_id, status },
  })

  return res.json({ items: data })
}
```

## Configuração de consulta de solicitação para endpoints de lista

**⚠️ MELHOR PRÁTICA**: Para rotas de API que recuperam listas de recursos, use a configuração de consulta de solicitação para permitir que os clientes controlem os campos, a paginação e a ordenação.

Esse padrão:

- Permite que os clientes especifiquem quais campos/relações devem ser recuperados
- Possibilita a paginação controlada pelo cliente
- Oferece suporte à ordenação personalizada
- Fornece valores padrão adequados

### Etapa 1: Adicionar middleware com createFindParams

```typescript
// api/middlewares.ts
import {
  validateAndTransformQuery,
  defineMiddlewares,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

// createFindParams() generates a schema that accepts:
// - fields: Select specific fields/relations
// - offset: Skip N items
// - limit: Max items to return
// - order: Order by field(s) ASC/DESC
export const GetProductsSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetProductsSchema,
          {
            defaults: [
              "id",
              "title",
              "variants.*", // Include all variant fields by default
            ],
            isList: true, // Indicates this returns a list
            defaultLimit: 15, // Default pagination limit
          }
        ),
      ],
    },
  ],
})
```

**Opções de configuração:**

- `defaults`: Matriz de campos e relações padrão a serem recuperados
- `isList`: Booleano que indica se o resultado será uma lista (afeta a paginação)
- `allowed`: (Opcional) Matriz de campos/relações permitidos no parâmetro de consulta `fields`
- `defaultLimit`: (Opcional) Limite padrão caso não seja fornecido (padrão: 50)

### Etapa 2: Use a configuração de consulta na rota

**⚠️ CRÍTICO**: Ao usar `req.queryConfig`, NÃO defina explicitamente a propriedade `fields` em sua consulta. O `queryConfig` já contém a configuração dos campos, e defini-la explicitamente causará erros no TypeScript.

```typescript
// api/store/products/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  // ✅ CORRECT: Only use ...req.queryConfig (includes fields, pagination, etc.)
  const { data: products } = await query.graph({
    entity: "product",
    ...req.queryConfig, // Contains fields, select, limit, offset, order
  })

  return res.json({ products })
}

// ❌ WRONG: Don't set fields explicitly when using queryConfig
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"], // ❌ Type error! queryConfig already sets fields
    ...req.queryConfig,
  })

  return res.json({ products })
}
```

**Se você precisar de filtros adicionais**, adicione apenas esses — e não campos:

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params

  // ✅ CORRECT: Add filters while using queryConfig
  const { data: products } = await query.graph({
    entity: "product",
    filters: { id }, // Additional filters are OK
    ...req.queryConfig, // Fields come from here
  })

  return res.json({ products })
}
```

### Etapa 3: Exemplos de uso pelo cliente

Agora, os clientes podem controlar a resposta da API:

```typescript
// Default response (uses middleware defaults)
GET /store/products
// Returns: id, title, variants.*

// Custom fields selection
GET /store/products?fields=id,title,description
// Returns: only id, title, description

// Pagination
GET /store/products?limit=10&offset=20
// Returns: 10 items, skipping first 20

// Ordering
GET /store/products?order=title
// Returns: products ordered by title ascending

GET /store/products?order=-created_at
// Returns: products ordered by created_at descending (- prefix)

// Combined
GET /store/products?fields=id,title,brand.*&limit=5&order=-created_at
// Returns: 5 items with custom fields, newest first
```

### Avançado: Parâmetro de consulta personalizado + Configuração de consulta

É possível combinar parâmetros de consulta personalizados com a configuração de consulta:

```typescript
// validators.ts
import { z } from "zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetProductsSchema = createFindParams().merge(
  z.object({
    category_id: z.string().optional(),
    in_stock: z.preprocess(
      (val) => val === "true",
      z.boolean().optional()
    ),
  })
)
```

```typescript
// route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { category_id, in_stock } = req.validatedQuery

  const filters: any = {}
  if (category_id) filters.category_id = category_id
  if (in_stock !== undefined) filters.in_stock = in_stock

  const { data: products } = await query.graph({
    entity: "product",
    filters,
    ...req.queryConfig, // Still get fields, pagination, order
  })

  return res.json({ products })
}
```

## Importação de organização

**⚠️ CRÍTICO**: Sempre importe fluxos de trabalho, módulos e outras dependências no INÍCIO do arquivo, nunca dentro do corpo da função do manipulador de rota.

### ✅ CORRETO - Importações no início

```typescript
// api/store/reviews/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createReviewWorkflow } from "../../../workflows/create-review"
import { CreateReviewSchema } from "./middlewares"

export async function POST(
  req: MedusaRequest<CreateReviewSchema>,
  res: MedusaResponse
) {
  const { result } = await createReviewWorkflow(req.scope).run({
    input: req.validatedBody
  })

  return res.json({ review: result })
}
```

### ❌ ERRADO - Importações dinâmicas no corpo da rota

```typescript
// api/store/reviews/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // ❌ WRONG: Don't use dynamic imports in route handlers
  const { createReviewWorkflow } = await import("../../../workflows/create-review")

  const { result } = await createReviewWorkflow(req.scope).run({
    input: req.validatedBody
  })

  return res.json({ review: result })
}
```

**Por que isso é importante:**

- Importações dinâmicas adicionam sobrecarga desnecessária a cada solicitação
- Tornam o código mais difícil de ler e manter
- Prejudicam a análise estática e a verificação do TypeScript
- Podem causar problemas de resolução de módulos em produção

## Estrutura das rotas da API

**⚠️ IMPORTANTE**: Por convenção, o Medusa usa apenas GET, POST e DELETE.

- **GET** para leituras
- **POST** para mutações (criação/atualização)
- **DELETE** para exclusões

Não use PUT ou PATCH.

### Rota básica da API

```typescript
// api/store/my-route/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  // Query data
  const { data: items } = await query.graph({
    entity: "entity_name",
    fields: ["id", "name"],
  })

  return res.status(200).json({ items })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { field } = req.validatedBody

  // Execute workflow (mutations should always use workflows)
  const { result } = await myWorkflow(req.scope).run({
    input: { field },
  })

  return res.status(200).json({ result })
}
```

### Acesso aos dados da solicitação

```typescript
// Validated body (from middleware)
const { email, name } = req.validatedBody

// Query parameters
const { page, limit } = req.query

// Route parameters
const { id } = req.params

// Resolve services
const query = req.scope.resolve("query")
const myService = req.scope.resolve("my-module")
```

## Tratamento de erros

Use `MedusaError` para obter respostas de erro consistentes:

```typescript
import { MedusaError } from "@medusajs/framework/utils"

// Not found
throw new MedusaError(MedusaError.Types.NOT_FOUND, "Resource not found")

// Invalid data
throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid input provided")

// Unauthorized
throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Authentication required")

// Conflict
throw new MedusaError(MedusaError.Types.CONFLICT, "Resource already exists")

// Other types: INVALID_STATE, NOT_ALLOWED, DUPLICATE_ERROR
```

### Formato de resposta de erro

O Medusa formata os erros automaticamente:

```json
{
  "type": "not_found",
  "message": "Resource not found"
}
```

## Rotas protegidas

### Rotas protegidas por padrão

Todas as rotas sob esses prefixos são protegidas automaticamente:

- `/admin/*` - Requer usuário administrador autenticado
- `/store/customers/me/*` - Requer cliente autenticado

### Rotas protegidas personalizadas

Para proteger rotas sob prefixos diferentes, use o middleware `authenticate`:

```typescript
// api/middlewares.ts
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Only allow authenticated admin users
    {
      matcher: "/custom/admin*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
    // Only allow authenticated customers
    {
      matcher: "/store/reviews*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
})
```

### Acessando o usuário autenticado

**⚠️ CRÍTICO**: Para rotas protegidas pelo middleware `authenticate`, você DEVE usar `AuthenticatedMedusaRequest` em vez de `MedusaRequest` para evitar erros de tipo ao acessar `req.auth_context.actor_id`.

```typescript
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// ✅ CORRECT - Use AuthenticatedMedusaRequest for protected routes
export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  // For admin routes
  const userId = req.auth_context.actor_id // Admin user ID

  // For customer routes
  const customerId = req.auth_context.actor_id // Customer ID

  // Your logic here
}

// ❌ WRONG - Don't use MedusaRequest for protected routes
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const userId = req.auth_context.actor_id // Type error!
}
```

**Consulte [authentication.md](authentication.md) para conhecer todos os padrões de autenticação.**

## Uso de fluxos de trabalho em rotas de API

**⚠️ MELHOR PRÁTICA**: Os fluxos de trabalho são a forma padrão de realizar mutações (criar, atualizar, excluir) no Medusa. As rotas de API devem executar fluxos de trabalho e retornar suas respostas.

### Exemplo: Criar um fluxo de trabalho

```typescript
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.validatedBody

  const { result } = await createCustomersWorkflow(req.scope).run({
    input: {
      customersData: [
        {
          email,
          has_account: false,
        },
      ],
    },
  })

  return res.json({ customer: result[0] })
}
```

### Exemplo: Fluxo de trabalho personalizado

```typescript
import { myCustomWorkflow } from "../../workflows/my-workflow"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { data } = req.validatedBody

  try {
    const { result } = await myCustomWorkflow(req.scope).run({
      input: { data },
    })

    return res.json({ result })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error.message
    )
  }
}
```

## Fluxos de trabalho integrados comuns

Consulte o MedusaDocs para obter os nomes específicos dos fluxos de trabalho e seus parâmetros de entrada:

- Fluxos de trabalho de clientes: criar, atualizar e excluir clientes
- Fluxos de trabalho de produtos: criar, atualizar e excluir produtos
- Fluxos de trabalho de pedidos: criar, cancelar e atender pedidos
- Fluxos de trabalho de carrinhos: criar, atualizar e finalizar carrinhos
- E muitos outros...

## Organização das rotas da API

Organize as rotas por recurso ou domínio:

```bash
src/api/
├── admin/
│   ├── custom-reports/
│   │   ├── route.ts
│   │   └── middlewares.ts
│   └── bulk-operations/
│       ├── route.ts
│       └── middlewares.ts
└── store/
    ├── newsletter/
    │   ├── route.ts
    │   └── middlewares.ts
    └── reviews/
        ├── route.ts
        ├── [id]/
        │   └── route.ts
        └── middlewares.ts
```

## Padrões comuns

### Padrão: Lista com configuração de consulta (recomendado)

```typescript
// middlewares.ts
import { validateAndTransformQuery } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetMyEntitiesSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/my-entities",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetMyEntitiesSchema, {
          defaults: ["id", "name", "created_at"],
          isList: true,
          defaultLimit: 15,
        }),
      ],
    },
  ],
})

// route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data, metadata } = await query.graph({
    entity: "my_entity",
    ...req.queryConfig, // Handles fields, pagination automatically
  })

  return res.json({
    items: data,
    count: metadata.count,
    limit: req.queryConfig.pagination.take,
    offset: req.queryConfig.pagination.skip,
  })
}
```

### Padrão: Recuperação de um único recurso com relações

```typescript
// For single resource endpoints, you can still use query config
// middlewares.ts
export const GetMyEntitySchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/my-entities/:id",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetMyEntitySchema, {
          defaults: ["id", "name", "variants.*", "brand.*"],
          isList: false, // Single resource
        }),
      ],
    },
  ],
})

// route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params

  const { data } = await query.graph({
    entity: "my_entity",
    filters: { id },
    ...req.queryConfig,
  })

  if (!data || data.length === 0) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Resource not found")
  }

  return res.json({ item: data[0] })
}
```

### Padrão: Pesquisa com filtros personalizados + configuração de consulta

```typescript
// validators.ts
export const GetMyEntitiesSchema = createFindParams().merge(
  z.object({
    q: z.string().optional(), // Search query
    status: z.enum(["active", "pending", "completed"]).optional(),
  })
)

// middlewares.ts
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/my-entities",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetMyEntitiesSchema, {
          defaults: ["id", "name", "status"],
          isList: true,
        }),
      ],
    },
  ],
})

// route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { q, status } = req.validatedQuery

  const filters: any = {}

  if (q) {
    filters.name = { $like: `%${q}%` }
  }

  if (status) {
    filters.status = status
  }

  const { data } = await query.graph({
    entity: "my_entity",
    filters,
    ...req.queryConfig, // Client can still control fields, pagination
  })

  return res.json({ items: data })
}
```

### Padrão: Consulta manual (quando a configuração da consulta não é necessária)

Para consultas simples nas quais não são necessários campos ou paginação controlados pelo cliente:

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "my_entity",
    fields: ["id", "name"],
    filters: { status: "active" },
    pagination: {
      take: 10,
      skip: 0,
    },
  })

  return res.json({ items: data })
}
```
