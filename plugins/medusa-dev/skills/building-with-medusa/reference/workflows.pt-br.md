# Criação de fluxos de trabalho

Os fluxos de trabalho são a forma padrão de realizar mutações (criar, atualizar, excluir) nos módulos do Medusa. Se você criou um módulo personalizado e precisa realizar mutações nos modelos desse módulo, deve criar um fluxo de trabalho.

## Criação de fluxos de trabalho — Lista de verificação de implementação

**IMPORTANTE PARA O CÓDIGO DO CLAUDE**: Ao implementar fluxos de trabalho, use a ferramenta TodoWrite para acompanhar seu progresso ao longo dessas etapas. Isso garante que você não perca nenhuma etapa crítica e oferece visibilidade ao usuário.

Crie estas tarefas em sua lista de afazeres:

- Defina o tipo de entrada para o seu fluxo de trabalho
- Crie uma função de etapa (uma mutação por etapa)
- Adicione uma função de compensação às etapas para reversão
- Crie uma função de composição de fluxo de trabalho
- Siga as regras de composição de fluxo de trabalho (sem assíncrono, sem funções-seta, etc.)
- Retorne um WorkflowResponse com os resultados
- Teste a idempotência (o fluxo de trabalho pode ser repetido com segurança)
- **CRÍTICO: Execute a compilação para validar a implementação** (detecta erros de tipo e outros problemas)

## Estrutura básica do fluxo de trabalho

**Organização dos arquivos:**

- **Recomendado**: Crie etapas de fluxo de trabalho em `src/workflows/steps/[nome-da-etapa].ts`
- As funções de composição de fluxo de trabalho devem ser colocadas em `src/workflows/[nome-do-fluxo-de-trabalho].ts`
- Isso mantém as etapas reutilizáveis e organizadas

```typescript
// src/workflows/steps/create-my-model.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type Input = {
  my_key: string
}

// Note: a step should only do one mutation this ensures rollback mechanisms work
// For workflows that retry build your steps to be idempotent
export const createMyModelStep = createStep(
  "create-my-model",
  async (input: Input, { container }) => {
    const myModule = container.resolve("my")

    const [newMy] = await myModule.createMyModels({
      ...input,
    })

    return new StepResponse(
      newMy,
      newMy.id // explicit compensation input - otherwise defaults to step's output
    )
  },
  // Optional compensation function
  async (id, { container }) => {
    const myModule = container.resolve("my")
    await myModule.deleteMyModels(id)
  }
)

// src/workflows/create-my-model.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createMyModelStep } from "./steps/create-my-model"

type Input = {
  my_key: string
}

const createMyModel = createWorkflow(
  "create-my-model",
  // Note: See "Workflow Composition Rules" section below for important constraints
  // The workflow function must be a regular synchronous function (not async/arrow)
  // No direct variable manipulation, conditionals, or date creation - use transform/when instead
  function (input: Input) {
    const newMy = createMyModelStep(input)

    return new WorkflowResponse({
      newMy,
    })
  }
)

export default createMyModel
```

## Regras de composição de fluxos de trabalho

A função de composição de fluxos de trabalho é executada no momento do carregamento do aplicativo e apresenta limitações importantes:

### Declaração da função

- ✅ Use funções síncronas comuns
- ❌ Não use funções `async`
- ❌ Não use funções de seta (use a palavra-chave `function`)

### Uso de etapas múltiplas vezes

**⚠️ CRÍTICO**: Ao usar a mesma etapa várias vezes em um fluxo de trabalho, você DEVE renomear cada invocação APÓS a primeira invocação usando `.config()` para evitar conflitos.

```typescript
// ✅ CORRECT - Rename each step invocation with .config()
export const processCustomersWorkflow = createWorkflow(
  "process-customers",
  function (input) {
    const customers = transform({ ids: input.customer_ids }, (input) => input.ids)

    // First invocation - no need to rename
    const customer1 = fetchCustomerStep(customers[0])

    // Second invocation - different name
    const customer2 = fetchCustomerStep(customers[1]).config({
      name: "fetch-customer-2"
    })

    const result = transform({ customer1, customer2 }, (data) => ({
      customers: [data.customer1, data.customer2]
    }))

    return new WorkflowResponse(result)
  }
)

// ❌ WRONG - Calling the same step multiple times without renaming
export const processCustomersWorkflow = createWorkflow(
  "process-customers",
  function (input) {
    const customers = transform({ ids: input.customer_ids }, (input) => input.ids)

    // This will cause runtime errors - duplicate step names
    const customer1 = fetchCustomerStep(customers[0])
    const customer2 = fetchCustomerStep(customers[1]) // ❌ Conflict!

    return new WorkflowResponse({ customers: [customer1, customer2] })
  }
)
```

**Por que isso é importante:**

- O Medusa usa nomes de etapas para rastrear o estado de execução
- Nomes duplicados causam conflitos no mecanismo de execução do fluxo de trabalho
- Cada chamada de etapa precisa de um identificador único
- O fluxo de trabalho falhará em tempo de execução se as etapas não forem renomeadas

### Operações com variáveis

- ❌ Não é permitida a manipulação direta ou concatenação de variáveis → Use `transform({ in }, ({ in }) => \`Transformed: ${in}\`)` em vez disso
- As variáveis não possuem valores até o momento da execução — todas as operações devem usar `transform()`

### Operações com data/hora

- ❌ Não use `new Date()` (será fixado no momento do carregamento) → Envolva em `transform()` para avaliação no momento da execução

### Lógica condicional

- ❌ Não usar instruções `if`/`else` → Use `when(input, (input) => input.is_active).then(() => { /* etapas */ })` em vez disso
- ❌ Não usar operadores ternários (`? :`) → Use `transform()` em vez disso
- ❌ Não usar coalescência de nulos (`??`) → Use `transform()` em vez disso
- ❌ Não use OR lógico (`||`) → Use `transform()` em vez disso
- ❌ Não use encadeamento opcional (`?.`) → Use `transform()` em vez disso
- ❌ Não use dupla negação (`!!`) → Use `transform()` em vez disso

### Operações com objetos

- ❌ Não é permitido o uso de espalhamento de objetos (`...`) para desestruturação ou espalhamento de propriedades → Use `transform()` para criar novos objetos com as propriedades desejadas

```typescript
// ❌ WRONG - Object spreading in workflow
const myWorkflow = createWorkflow(
  "process-data",
  function (input: WorkflowInput) {
    const updatedData = {
      ...input.data,
      newField: "value"
    } // Won't work - spread operator not allowed

    step1(updatedData)
})

// ✅ CORRECT - Use transform to create new objects
import { transform } from "@medusajs/framework/workflows-sdk"

const myWorkflow = createWorkflow(
  "process-data",
  function (input: WorkflowInput) {
    const updatedData = transform(
      { input },
      (data) => ({
        ...data.input.data,
        newField: "value"
      })
    )

    step1(updatedData)
})
```

### Loops

- ❌ Não use loops `for`/`while` → Utilize as alternativas abaixo de acordo com o seu caso de uso

As funções de composição de fluxo de trabalho são executadas no momento do carregamento do aplicativo para definir a estrutura do fluxo de trabalho, e não para executar lógica. Não é possível usar loops diretamente na função de composição. Em vez disso, utilize estes padrões:

### **Alternativa 1: Loop no código de chamada (repetir todo o fluxo de trabalho)**

Quando for necessário executar um fluxo de trabalho várias vezes (por exemplo, uma vez por item em um array), envolva a execução do fluxo de trabalho em um loop no código que o chama:

```typescript
// ❌ WRONG - Loop inside workflow composition
const myWorkflow = createWorkflow(
  "hello-world",
  function (input: WorkflowInput) {
    for (const item of input.items) {
      step1(item) // Won't work - loop runs at load time, not execution time
    }
})

// ✅ CORRECT - Loop in calling code
// API route that calls the workflow
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import myWorkflow from "../../workflows/my-workflow"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { items } = req.body

  // Execute the workflow once for each item
  for (const item of items) {
    await myWorkflow(req.scope)
      .run({ item })
  }

  res.status(200).send({ success: true })
}

// Workflow definition - processes a single item
const myWorkflow = createWorkflow(
  "hello-world",
  function (input: WorkflowInput) {
    step1(input.item)
})
```

**Alternativa 2: Use `transform` para operações com matrizes (preparação de entradas de etapa)**

Quando for necessário iterar sobre uma matriz para preparar entradas para uma etapa, use `transform()` para mapear a matriz:

```typescript
// ❌ WRONG - Loop to build array
const myWorkflow = createWorkflow(
  "hello-world",
  function (input: WorkflowInput) {
    const stepInputs = []
    for (const item of input.items) {
      stepInputs.push({ id: item.id }) // Won't work - loop runs at load time
    }
    step1(stepInputs)
})

// ✅ CORRECT - Use transform to map array
import { transform } from "@medusajs/framework/workflows-sdk"

const myWorkflow = createWorkflow(
  "hello-world",
  function (input: WorkflowInput) {
    const stepInputs = transform(
      {
        input,
      },
      (data) => {
        // This function runs at execution time
        return data.input.items.map((item) => ({ id: item.id }))
      }
    )

    step1(stepInputs)
})
```

**Por que isso é importante:**

- A função de composição do fluxo de trabalho é executada uma vez durante o carregamento do aplicativo para definir a estrutura
- Os loops seriam executados no momento do carregamento, sem dados, e não no momento da execução, com entradas reais
- A alternativa 1 repete todo o fluxo de trabalho (incluindo a capacidade de reversão) para cada item
- A alternativa 2 processa matrizes em uma única execução do fluxo de trabalho usando `transform()`

### Tratamento de erros

- ❌ Sem blocos `try-catch` → Consulte os padrões de tratamento de erros na documentação do Medusa

### Valores de retorno

- ✅ Retorne apenas valores serializáveis (tipos primitivos, objetos simples)
- ❌ Não utilize tipos não serializáveis (Maps, Sets, etc.)
- Para buffers: retorne como propriedade do objeto e, em seguida, recrie-o com `Buffer.from()` ao processar os resultados

## Melhores práticas para etapas

1. **Uma mutação por etapa**: garante que os mecanismos de reversão funcionem corretamente
2. **Idempotência**: projete as etapas para que possam ser repetidas com segurança
3. **Entrada de compensação explícita**: especifique quais dados a função de compensação precisa, caso sejam diferentes da saída da etapa
4. **Retorne StepResponse**: sempre envolva seu valor de retorno em `StepResponse`

## Reutilização de etapas integradas do Medusa

**⚠️ IMPORTANTE**: Antes de criar etapas personalizadas, verifique se o Medusa oferece uma etapa integrada para o seu caso de uso. É preferível reutilizar etapas integradas do que criar etapas personalizadas.

### Etapas integradas comuns para reutilização

**Criação de links entre módulos:**

**⚠️ CRÍTICO – Ordem dos links (direção):** Ao criar links, a ordem dos módulos em `createRemoteLinkStep` DEVE corresponder à ordem em `defineLink()`. Uma ordem incompatível causa erros de tempo de execução.

```typescript
// Link definition in src/links/review-product.ts
import { defineLink } from "@medusajs/framework/utils"
import ReviewModule from "../modules/review"
import ProductModule from "@medusajs/medusa/product"

// Order: review FIRST, then product
export default defineLink(
  {
    linkable: ReviewModule.linkable.review,
    isList: true,
  },
  ProductModule.linkable.product
)
```

```typescript
// ✅ CORRECT - Order matches defineLink (review first, then product)
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../modules/review"

export const createReviewWorkflow = createWorkflow(
  "create-review",
  function (input) {
    const review = createReviewStep(input)

    // Order MUST match defineLink: review first, then product
    const linkData = transform({ review, input }, ({ review, input }) => [{
      [REVIEW_MODULE]: {
        review_id: review.id,
      },
      [Modules.PRODUCT]: {
        product_id: input.product_id,
      },
    }])

    createRemoteLinkStep(linkData)

    return new WorkflowResponse({ review })
  }
)

// ❌ WRONG - Order doesn't match defineLink (product first, then review)
const linkData = transform({ review, input }, ({ review, input }) => [{
  [Modules.PRODUCT]: {
    product_id: input.product_id,
  },
  [REVIEW_MODULE]: {
    review_id: review.id,
  },
}]) // Runtime error: link direction mismatch!
```

```typescript
// ❌ WRONG - Don't create custom link steps
const createReviewLinkStep = createStep(
  "create-review-link",
  async ({ reviewId, productId }, { container }) => {
    const link = container.resolve("link")
    await link.create({
      product: { product_id: productId },
      review: { review_id: reviewId },
    })
    // This duplicates functionality that createRemoteLinkStep provides
  }
)
```

**Remoção de links:**

```typescript
// ✅ CORRECT - Use Medusa's built-in dismissRemoteLinkStep
import { dismissRemoteLinkStep } from "@medusajs/medusa/core-flows"

export const deleteReviewWorkflow = createWorkflow(
  "delete-review",
  function (input) {
    const linkData = transform({ input }, ({ input }) => [{
      [Modules.PRODUCT]: { product_id: input.product_id },
      review: { review_id: input.review_id },
    }])

    dismissRemoteLinkStep(linkData)
    deleteReviewStep(input)

    return new WorkflowResponse({ success: true })
  }
)
```

**Consulta de dados em fluxos de trabalho:**

```typescript
// ✅ CORRECT - Use Medusa's built-in useQueryGraphStep
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

export const getProductReviewsWorkflow = createWorkflow(
  "get-product-reviews",
  function (input) {
    // Query product with reviews using built-in step
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["id", "title", "reviews.*"],
      filters: {
        id: input.product_id,
      },
    })

    return new WorkflowResponse({ product: products[0] })
  }
)

// ❌ WRONG - Don't create custom query steps
const queryProductStep = createStep(
  "query-product",
  async ({ productId }, { container }) => {
    const query = container.resolve("query")
    const { data } = await query.graph({
      entity: "product",
      fields: ["id", "title", "reviews.*"],
      filters: { id: productId },
    })
    return new StepResponse(data[0])
  }
)
// This duplicates functionality that useQueryGraphStep provides
```

**Por que reutilizar etapas integradas:**

- Já foram testadas e otimizadas pela Medusa
- Lidam com casos extremos e cenários de erro
- Mantêm a consistência com os fluxos de trabalho internos da Medusa
- Incluem lógica adequada de compensação/reversão
- Menos código para manter

**Outras etapas integradas comuns a serem consideradas:**

- Etapas de emissão de eventos
- Etapas de notificação
- Etapas de gerenciamento de estoque
- Etapas de processamento de pagamentos

Consulte a documentação da Medusa ou `@medusajs/medusa/core-flows` para verificar as etapas integradas disponíveis antes de criar etapas personalizadas.

## Localização da lógica de negócios e da validação

**CRÍTICO**: Toda a lógica de negócios e validação devem ser executadas dentro das etapas do fluxo de trabalho, NÃO nas rotas da API.

### ✅ CORRETO - Validação na etapa do fluxo de trabalho

```typescript
// src/workflows/steps/delete-review.ts
export const deleteReviewStep = createStep(
  "delete-review",
  async ({ reviewId, customerId }: Input, { container }) => {
    const reviewModule = container.resolve("review")

    // Validation happens inside the step
    const review = await reviewModule.retrieveReview(reviewId)

    if (review.customer_id !== customerId) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You can only delete your own reviews"
      )
    }

    await reviewModule.deleteReviews(reviewId)

    return new StepResponse({ id: reviewId }, reviewId)
  },
  async (reviewId, { container }) => {
    // Compensation: restore the review if needed
  }
)
```

### ❌ ERRADO - Validação na rota da API

```typescript
// src/api/store/reviews/[id]/route.ts
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const customerId = req.auth_context.actor_id

  // ❌ WRONG: Don't validate business rules in the route
  const reviewModule = req.scope.resolve("review")
  const review = await reviewModule.retrieveReview(id)

  if (review.customer_id !== customerId) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Not your review")
  }

  // ❌ WRONG: Don't call workflows after manual validation
  const { result } = await deleteReviewWorkflow(req.scope).run({
    input: { reviewId: id }
  })
}
```

**Por que isso é importante:**

- Os fluxos de trabalho são a única fonte de verdade para a lógica de negócios
- A validação nas rotas contorna os mecanismos de reversão do fluxo de trabalho
- Torna os testes mais difíceis e a reutilização da lógica mais complicada
- Rompe a arquitetura Módulo → Fluxo de Trabalho → Rota da API

## Recursos avançados

Os fluxos de trabalho possuem opções avançadas para definir novas tentativas, comportamento assíncrono, pausa para confirmação humana e muito mais. Consulte o MedusaDocs para obter mais detalhes caso esses recursos sejam relevantes para o seu caso de uso.
