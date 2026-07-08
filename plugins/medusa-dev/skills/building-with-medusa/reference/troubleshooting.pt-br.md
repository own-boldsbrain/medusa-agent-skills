# Resolução de problemas comuns no backend do Medusa

Este guia aborda erros comuns e suas soluções ao compilar com o Medusa.

## Índice

- [Erros de registro de módulos](#erros-de-registro-de-modulos)
- [Erros de rota da API](#erros-de-rota-da-api)
- [Erros de autenticação](#erros-de-autenticacao)
- [Dicas gerais de depuração](#dicas-gerais-de-depuracao)

## Erros de registro de módulos

### Erro: Módulo “X” não registrado

```
Error: Module "my-module" is not registered in the container
```

**Causa**: O módulo não foi adicionado ao `medusa-config.ts` ou o servidor não foi reiniciado.

**Solução**:

1. Adicione o módulo ao arquivo `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  modules: [
    { resolve: "./src/modules/my-module" }
  ],
})
```

1. Reinicie o servidor Medusa

### Erro: Não foi possível encontrar o módulo './modules/X'

```
Error: Cannot find module './modules/my-module'
```

**Causa**: O caminho do módulo está incorreto ou a estrutura do módulo está incompleta.

**Solução**:

1. Verifique a estrutura do módulo:

```
src/modules/my-module/
├── models/
│   └── my-model.ts
├── service.ts
└── index.ts
```

1. Verifique se o arquivo `index.ts` exporta o módulo corretamente
2. Verifique se o caminho no arquivo `medusa-config.ts` corresponde ao diretório real

## Erros de rota da API

### Erro: validatedBody está indefinido

```
TypeError: Cannot read property 'email' of undefined
```

**Causa**: Esqueceu de adicionar o middleware de validação ou está acessando `req.validatedBody` em vez de `req.body`.

**Solução**:

1. Adicione o middleware de validação:

```typescript
// middlewares.ts
export const myMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/my-route",
    method: "POST",
    middlewares: [validateAndTransformBody(MySchema)],
  },
]
```

1. Acesse `req.validatedBody`, e não `req.body`

### Erro: queryConfig não está definido

```
TypeError: Cannot spread undefined
```

**Causa**: Uso de `...req.queryConfig` sem configurar o middleware de configuração de consulta.

**Solução**:
Adicione o middleware `validateAndTransformQuery`:

```typescript
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetMyItemsSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/my-items",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetMyItemsSchema, {
          defaults: ["id", "name"],
          isList: true,
        }),
      ],
    },
  ],
})
```

### Erro: MedusaError não está sendo formatado

```
Error: [object Object]
```

**Causa**: Lançamento de um `Error` comum em vez de um `MedusaError`.

**Solução**:

```typescript
// ❌ WRONG
throw new Error("Not found")

// ✅ CORRECT
import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
```

### Erro: Middleware não está sendo aplicado

```
Error: Route is not being validated
```

**Causa**: O comparador de middleware não corresponde ao caminho da rota ou o middleware não está registrado.

**Solução**:

1. Verifique se o padrão do matcher corresponde à sua rota:

```typescript
// For route: /store/my-route
matcher: "/store/my-route" // Exact match

// For multiple routes: /store/my-route, /store/my-route/123
matcher: "/store/my-route*" // Wildcard
```

1. Certifique-se de que o middleware esteja exportado e registrado em `api/middlewares.ts`

## Erros de autenticação

### Erro: auth_context não está definido

```
TypeError: Cannot read property 'actor_id' of undefined
```

**Causa**: A rota não está protegida ou o usuário não está autenticado.

**Solução**:

1. Verifique se a rota está sob um prefixo protegido (`/admin/*` ou `/store/customers/me/*`)
2. Se for um prefixo personalizado, adicione o middleware de autenticação:

```typescript
export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom/admin*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
  ],
})
```

1. Para autenticação opcional, verifique se `auth_context` existe:

```typescript
const userId = req.auth_context?.actor_id
if (!userId) {
  // Handle unauthenticated case
}
```

## Dicas gerais de depuração

### Ativar o registro de depuração

```bash
# Set log level to debug
LOG_LEVEL=debug npx medusa develop
```

### Registrar valores em fluxos de trabalho com a função Transform

```typescript
import { 
  createStep, 
  createWorkflow, 
  StepResponse, 
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async () => {
    const message = "Hello from step 1!"

    return new StepResponse(
      message
    )
  }
)

export const myWorkflow = createWorkflow(
  "my-workflow",
  () => {
    const response = step1()

    const transformedMessage = transform(
      { response },
      (data) => {
        const upperCase = data.response.toUpperCase()
        console.log("Transformed Data:", upperCase)
        return upperCase
      }
    )

    return new WorkflowResponse({
      response: transformedMessage,
    })
  }
)
```
