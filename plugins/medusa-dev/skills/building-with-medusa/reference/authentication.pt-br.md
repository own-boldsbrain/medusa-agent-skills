# Autenticação no Medusa

A autenticação no Medusa protege as rotas da API e garante que apenas usuários autorizados possam acessar recursos protegidos.

## Índice

- [Rotas protegidas por padrão](#rotas-protegidas-por-padrao)
- [Métodos de autenticação](#metodos-de-autenticacao)
- [Rotas protegidas personalizadas](#rotas-protegidas-personalizadas)
- [Acesso ao usuário autenticado](#acessando-o-usuario-autenticado)
- [Padrões de autenticação](#padroes-de-autenticacao)

## Rotas protegidas por padrão

O Medusa protege automaticamente determinados prefixos de rota:

### Rotas de administração (`/admin/*`)

- **Quem pode acessar**: Somente usuários administradores autenticados
- **Métodos de autenticação**: Sessão, token Bearer, chave de API
- **Exemplo**: `/admin/products`, `/admin/custom-reports`

### Rotas de clientes (`/store/customers/me/*`)

- **Quem pode acessar**: Somente clientes autenticados
- **Métodos de autenticação**: Sessão, token Bearer
- **Exemplo**: `/store/customers/me/orders`, `/store/customers/me/addresses`

**Essas rotas não requerem configuração adicional** — a autenticação é gerenciada automaticamente pelo Medusa.

## Métodos de autenticação

### Autenticação por sessão

- Utilizada após o login por e-mail/senha
- Gerenciamento de sessão baseado em cookies
- Gerenciada automaticamente pelo SDK do Medusa

### Token Bearer (JWT)

- Autenticação baseada em token
- Enviada no cabeçalho `Authorization: Bearer <token>`
- Utilizada por aplicativos front-end

### Chave de API

- Método de autenticação exclusivo para administradores
- Usado para comunicação entre servidores
- Passado no cabeçalho `x-medusa-access-token`

## Rotas protegidas personalizadas

**⚠️ CRÍTICO: Adicione o middleware `authenticate` apenas a rotas FORA dos prefixos padrão.**

As rotas com esses prefixos são autenticadas automaticamente — **NÃO adicione middleware:**

- `/admin/*` — Já exige um usuário administrador autenticado
- `/store/customers/me/*` — Já exige um cliente autenticado

```typescript
// ✅ CORRECT - Custom route needs authenticate middleware
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/reviews*",  // Not a default protected prefix
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
})

// ❌ WRONG - /admin routes are automatically authenticated
export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/reports*",  // Already protected!
      middlewares: [authenticate("user", ["session", "bearer"])], // Redundant!
    },
  ],
})
```

Para proteger rotas personalizadas fora dos prefixos padrão, use o middleware `authenticate`.

### Protegendo rotas personalizadas de administração

```typescript
// api/middlewares.ts
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom/admin*",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
  ],
})
```

**Parâmetros:**

- Primeiro parâmetro: `"user"` para usuários administradores, `"customer"` para clientes
- Segundo parâmetro: matriz dos métodos de autenticação permitidos

### Protegendo rotas personalizadas do cliente

```typescript
// api/middlewares.ts
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/reviews*",
      middlewares: [
        authenticate("customer", ["session", "bearer"])
      ],
    },
  ],
})
```

### Várias rotas protegidas

```typescript
// api/middlewares.ts
export default defineMiddlewares({
  routes: [
    // Protect custom admin routes
    {
      matcher: "/custom/admin*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
    // Protect custom customer routes
    {
      matcher: "/store/reviews*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    // Protect wishlist routes
    {
      matcher: "/store/wishlists*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
})
```

## Acessando o usuário autenticado

Quando uma rota é protegida pelo middleware `authenticate`, você pode acessar as informações do usuário autenticado por meio de `req.auth_context`.

**⚠️ CRÍTICO – Segurança de tipos**: Para rotas protegidas, você DEVE usar `AuthenticatedMedusaRequest` em vez de `MedusaRequest` para evitar erros de tipo ao acessar `req.auth_context.actor_id`.

**⚠️ CRÍTICO - Validação manual**: NÃO valide manualmente a autenticação em seus manipuladores de rota ao usar o middleware `authenticate`. O middleware já garante que o usuário esteja autenticado — verificações manuais são redundantes e indicam um mal-entendido sobre como o middleware funciona.

### ✅ CORRETO - Usando AuthenticatedMedusaRequest

```typescript
// api/store/reviews/[id]/route.ts
// Middleware already applied: authenticate("customer", ["session", "bearer"])
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { deleteReviewWorkflow } from "../../../../workflows/delete-review"

export async function DELETE(
  req: AuthenticatedMedusaRequest, // ✅ Use AuthenticatedMedusaRequest for protected routes
  res: MedusaResponse
) {
  const { id } = req.params
  // ✅ CORRECT: Just use req.auth_context.actor_id directly
  // The authenticate middleware guarantees this exists
  const customerId = req.auth_context.actor_id // No type error!

  // Pass to workflow - let the workflow handle business logic validation
  const { result } = await deleteReviewWorkflow(req.scope).run({
    input: {
      reviewId: id,
      customerId, // Workflow will validate if review belongs to customer
    },
  })

  return res.json({ success: true })
}
```

### ❌ ERRADO - Uso do MedusaRequest em rotas protegidas

```typescript
// api/store/reviews/[id]/route.ts
// Middleware already applied: authenticate("customer", ["session", "bearer"])
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function DELETE(
  req: MedusaRequest, // ❌ WRONG: Should use AuthenticatedMedusaRequest
  res: MedusaResponse
) {
  const { id } = req.params
  const customerId = req.auth_context.actor_id // ❌ Type error: auth_context might be undefined

  return res.json({ success: true })
}
```

### ❌ ERRADO - Verificação de autenticação manual

```typescript
// api/store/reviews/[id]/route.ts
// Middleware already applied: authenticate("customer", ["session", "bearer"])
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  // ❌ WRONG: Don't manually check if user is authenticated
  // The authenticate middleware already did this!
  if (!req.auth_context?.actor_id) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You must be authenticated"
    )
  }

  const customerId = req.auth_context.actor_id

  // Also wrong: don't validate business logic in routes
  // (see workflows.md for why this should be in the workflow)

  return res.json({ success: true })
}
```

**Por que as verificações manuais são inadequadas:**

- O middleware `authenticate` já valida a autenticação
- Se a autenticação falhar, a solicitação nunca chega ao seu handler
- As verificações manuais sugerem que você não confia ou não compreende o middleware
- Acrescenta código desnecessário e possíveis bugs

### Nas rotas de administração

```typescript
// api/admin/custom/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  // Get authenticated admin user ID
  const userId = req.auth_context.actor_id

  const logger = req.scope.resolve("logger")
  logger.info(`Request from admin user: ${userId}`)

  // Use userId to filter data or track actions
  // ...

  return res.json({ success: true })
}
```

### Nas rotas dos clientes

```typescript
// api/store/reviews/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  // Get authenticated customer ID
  const customerId = req.auth_context.actor_id

  const { product_id, rating, comment } = req.validatedBody

  // Create review associated with the authenticated customer
  const { result } = await createReviewWorkflow(req.scope).run({
    input: {
      customer_id: customerId, // From authenticated context
      product_id,
      rating,
      comment,
    },
  })

  return res.json({ review: result })
}
```

## Padrões de autenticação

### Padrão: Dados específicos do usuário

```typescript
// api/admin/my-reports/route.ts
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const userId = req.auth_context.actor_id
  const query = req.scope.resolve("query")

  // Get reports created by this admin user
  const { data: reports } = await query.graph({
    entity: "report",
    fields: ["id", "title", "created_at"],
    filters: {
      created_by: userId,
    },
  })

  return res.json({ reports })
}
```

### Padrão: Validação de propriedade

**⚠️ IMPORTANTE**: A validação de propriedade é uma lógica de negócios e deve ser realizada nas etapas do fluxo de trabalho, e não nas rotas da API. A rota deve apenas passar o ID do usuário autenticado para o fluxo de trabalho, e é o fluxo de trabalho que valida a propriedade.

```typescript
// api/store/reviews/[id]/route.ts
// ✅ CORRECT - Pass user ID to workflow, let workflow validate ownership
export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const { id } = req.params

  // Pass to workflow - workflow will validate ownership
  const { result } = await deleteReviewWorkflow(req.scope).run({
    input: {
      reviewId: id,
      customerId, // Workflow validates this review belongs to this customer
    },
  })

  return res.json({ success: true })
}

// ❌ WRONG - Don't validate ownership in the route
export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const { id } = req.params
  const query = req.scope.resolve("query")

  // ❌ WRONG: Don't check ownership in the route
  const { data: reviews } = await query.graph({
    entity: "review",
    fields: ["id", "customer_id"],
    filters: { id },
  })

  if (!reviews || reviews.length === 0) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Review not found")
  }

  if (reviews[0].customer_id !== customerId) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Not your review")
  }

  // This bypasses workflow validation
  await deleteReviewWorkflow(req.scope).run({
    input: { id },
  })

  return res.status(204).send()
}
```

**Consulte [workflows.md](workflows.md#business-logic-and-validation-placement) para conhecer o padrão completo de validação de propriedade nas etapas do fluxo de trabalho.**

### Padrão: Rotas do perfil do cliente

```typescript
// api/store/customers/me/wishlist/route.ts
// Automatically protected because it's under /store/customers/me/*

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const query = req.scope.resolve("query")

  // Get customer's wishlist
  const { data: wishlists } = await query.graph({
    entity: "wishlist",
    fields: ["id", "products.*"],
    filters: {
      customer_id: customerId,
    },
  })

  return res.json({ wishlist: wishlists[0] || null })
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const { product_id } = req.validatedBody

  // Add product to customer's wishlist
  const { result } = await addToWishlistWorkflow(req.scope).run({
    input: {
      customer_id: customerId,
      product_id,
    },
  })

  return res.json({ wishlist: result })
}
```

### Padrão: Acompanhamento de ações administrativas

```typescript
// api/admin/products/[id]/archive/route.ts
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const adminUserId = req.auth_context.actor_id
  const { id } = req.params

  // Archive product and track who did it
  const { result } = await archiveProductWorkflow(req.scope).run({
    input: {
      product_id: id,
      archived_by: adminUserId,
      archived_at: new Date(),
    },
  })

  const logger = req.scope.resolve("logger")
  logger.info(`Product ${id} archived by admin user ${adminUserId}`)

  return res.json({ product: result })
}
```

### Padrão: Autenticação opcional

Algumas rotas podem se beneficiar da autenticação, mas não a exigem. Use o middleware `authenticate` com `allowUnauthenticated: true`:

```typescript
// api/middlewares.ts
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products/*/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"], {
          allowUnauthenticated: true, // Allows access without authentication
        })
      ],
    },
  ],
})
```

```typescript
// api/store/products/[id]/reviews/route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id // May be undefined
  const { id } = req.params
  const query = req.scope.resolve("query")

  // Get all reviews
  const { data: reviews } = await query.graph({
    entity: "review",
    fields: ["id", "rating", "comment", "customer_id"],
    filters: {
      product_id: id,
    },
  })

  // If authenticated, mark customer's own reviews
  if (customerId) {
    reviews.forEach(review => {
      review.is_own = review.customer_id === customerId
    })
  }

  return res.json({ reviews })
}
```

## Integração com o front-end

### Autenticação na loja (cliente)

Ao usar o SDK do Medusa JS em lojas virtuais:

```typescript
// Frontend code
import { sdk } from "./lib/sdk"

// Login
await sdk.auth.login("customer", "emailpass", {
  email: "customer@example.com",
  password: "password",
})

// SDK automatically includes auth headers in subsequent requests
const { customer } = await sdk.store.customer.retrieve()

// Access protected routes
const { orders } = await sdk.store.customer.listOrders()
```

### Autenticação de administrador

Ao usar o SDK do Medusa JS em aplicativos de administração:

```typescript
// Admin frontend code
import { sdk } from "./lib/sdk"

// Login
await sdk.auth.login("user", "emailpass", {
  email: "admin@example.com",
  password: "password",
})

// SDK automatically includes JWT in Authorization header
const { products } = await sdk.admin.product.list()
```

## Melhores práticas de segurança

### 1. Use o ID do ator do contexto

```typescript
// ✅ GOOD: Uses authenticated context
const customerId = req.auth_context.actor_id

// ❌ BAD: Takes user ID from request
const { customer_id } = req.validatedBody // ❌ Can be spoofed
```

### 2. Métodos de autenticação adequados

```typescript
// ✅ GOOD: Admin routes support all methods
authenticate("user", ["session", "bearer", "api-key"])

// ✅ GOOD: Customer routes use session/bearer only
authenticate("customer", ["session", "bearer"])

// ❌ BAD: Customer routes with API key
authenticate("customer", ["api-key"]) // API keys are for admin only
```

### 3. Não exponha dados confidenciais

```typescript
// ✅ GOOD: Filters sensitive fields
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id

  const customer = await getCustomer(customerId)

  // Remove sensitive data before sending
  delete customer.password_hash
  delete customer.metadata?.internal_notes

  return res.json({ customer })
}
```
