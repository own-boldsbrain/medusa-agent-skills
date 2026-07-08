# Tratamento de erros no Medusa

O Medusa oferece a classe `MedusaError` para garantir respostas de erro consistentes em todas as suas rotas de API e em seu código personalizado.

## Índice

- [Como usar o MedusaError](#usando-o-medusaerror)
- [Tipos de erro](#tipos-de-erro)
- [Formato da resposta de erro](#formato-da-resposta-de-erro)
- [Melhores práticas](#melhores-praticas)

## Usando o MedusaError

Use `MedusaError` em rotas de API, fluxos de trabalho e módulos personalizados para gerar erros que o Medusa formatará automaticamente e retornará aos clientes:

```typescript
import { MedusaError } from "@medusajs/framework/utils"

// Throw an error
throw new MedusaError(
  MedusaError.Types.NOT_FOUND,
  "Product not found"
)
```

## Tipos de erro

### NOT_FOUND

Utilize quando um recurso solicitado não existir:

```typescript
throw new MedusaError(
  MedusaError.Types.NOT_FOUND,
  "Product with ID 'prod_123' not found"
)
```

**Status HTTP**: 404

### INVALID_DATA

Use quando os dados da solicitação não passarem na validação ou estiverem incorretos:

```typescript
throw new MedusaError(
  MedusaError.Types.INVALID_DATA,
  "Email address is invalid"
)
```

**Status HTTP**: 400

### UNAUTHORIZED

Use quando a autenticação for necessária, mas não tiver sido fornecida:

```typescript
throw new MedusaError(
  MedusaError.Types.UNAUTHORIZED,
  "Authentication required to access this resource"
)
```

**Status HTTP**: 401

### NOT_ALLOWED

Use quando o usuário estiver autenticado, mas não tiver permissão:

```typescript
throw new MedusaError(
  MedusaError.Types.NOT_ALLOWED,
  "You don't have permission to delete this product"
)
```

**Status HTTP**: 403

### CONFLICT

Use quando a operação entrar em conflito com dados existentes:

```typescript
throw new MedusaError(
  MedusaError.Types.CONFLICT,
  "A product with this handle already exists"
)
```

**Status HTTP**: 409

### DUPLICATE_ERROR

Use ao tentar criar um recurso duplicado:

```typescript
throw new MedusaError(
  MedusaError.Types.DUPLICATE_ERROR,
  "Email address is already registered"
)
```

**Status HTTP**: 422

### INVALID_STATE

Use quando o recurso estiver em um estado inválido para a operação:

```typescript
throw new MedusaError(
  MedusaError.Types.INVALID_STATE,
  "Cannot cancel an order that has already been fulfilled"
)
```

**Status HTTP**: 400

## Formato da resposta de erro

O Medusa formata automaticamente os erros em uma resposta JSON consistente:

```json
{
  "type": "not_found",
  "message": "Product with ID 'prod_123' not found"
}
```

## Melhores práticas

### 1. Use tipos de erro específicos

Escolha o tipo de erro mais adequado para a situação:

```typescript
// ✅ GOOD: Uses specific error types
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
    filters: { id },
  })

  if (!data || data.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with ID '${id}' not found`
    )
  }

  return res.json({ product: data[0] })
}

// ❌ BAD: Uses generic error
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
    filters: { id },
  })

  if (!data || data.length === 0) {
    throw new Error("Product not found") // Generic error
  }

  return res.json({ product: data[0] })
}
```

### 2. Forneça mensagens de erro claras

As mensagens de erro devem ser descritivas e ajudar os usuários a entender o que deu errado:

```typescript
// ✅ GOOD: Clear, specific message
throw new MedusaError(
  MedusaError.Types.INVALID_DATA,
  "Cannot create product: title must be at least 3 characters long"
)

// ❌ BAD: Vague message
throw new MedusaError(
  MedusaError.Types.INVALID_DATA,
  "Invalid input"
)
```

### 3. Inclua contexto nas mensagens de erro

```typescript
// ✅ GOOD: Includes relevant context
throw new MedusaError(
  MedusaError.Types.NOT_FOUND,
  `Product with ID '${productId}' not found`
)

// ✅ GOOD: Includes field name
throw new MedusaError(
  MedusaError.Types.INVALID_DATA,
  `Invalid email format: '${email}'`
)
```

### 4. Tratar erros de fluxo de trabalho

Ao chamar fluxos de trabalho a partir de rotas de API, capture e transforme os erros:

```typescript
// ✅ GOOD: Catches and transforms workflow errors
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { data } = req.validatedBody

  try {
    const { result } = await myWorkflow(req.scope).run({
      input: { data },
    })

    return res.json({ result })
  } catch (error) {
    // Transform workflow errors into API errors
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Failed to create resource: ${error.message}`
    )
  }
}
```

### 5. Use middleware de validação

Deixe que o middleware de validação lide com os erros de validação de entrada:

```typescript
// ✅ GOOD: Middleware handles validation
// middlewares.ts
const MySchema = z.object({
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
})

export const myMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/my-route",
    method: "POST",
    middlewares: [validateAndTransformBody(MySchema)],
  },
]

// route.ts - No need to validate again
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, age } = req.validatedBody // Already validated

  // Your logic here
}
```
