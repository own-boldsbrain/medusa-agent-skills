# Assinantes e Eventos

Os assinantes são funções assíncronas que são executadas quando eventos específicos são emitidos. Use-os para realizar ações após operações comerciais, como enviar e-mails de confirmação quando um pedido é feito.

## Índice

- [Quando usar assinantes](#quando-usar-assinantes)
- [Criação de um assinante](#criando-um-assinante)
- [Eventos comuns de comércio](#eventos-comuns-de-comercio)
- [Acesso aos dados de eventos](#acesso-aos-dados-do-evento)
- [Acionamento de eventos personalizados](#acionamento-de-eventos-personalizados)
- [Melhores práticas](#melhores-praticas)

## Quando usar assinantes

Use assinantes quando precisar **reagir a eventos** que ocorram em seu aplicativo:

- ✅ Enviar e-mails de confirmação quando pedidos forem feitos
- ✅ Sincronizar dados com sistemas externos quando produtos forem atualizados
- ✅ Acionar webhooks quando entidades forem alteradas
- ✅ Atualizar análises quando clientes forem criados
- ✅ Executar efeitos colaterais não bloqueantes

**Não use assinantes para:**

- ❌ Tarefas periódicas (use [tarefas agendadas](scheduled-jobs.md) em vez disso)
- ❌ Operações que precisam bloquear o fluxo principal (use fluxos de trabalho em vez disso)
- ❌ Agendamento de tarefas futuras (os assinantes são executados imediatamente)

**Assinantes x Tarefas Agendadas:**

- **Assinante**: Reage ao evento `order.placed` e envia um e-mail de confirmação (orientado por eventos)
- **Tarefa agendada**: Identifica carrinhos abandonados a cada 6 horas e envia e-mails (padrão de polling)

## Criando um assinante

Crie um arquivo TypeScript no diretório `src/subscribers/`:

```typescript
// src/subscribers/order-placed.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function orderPlacedHandler({
  event: { eventName, data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  logger.info(`Order ${data.id} was placed`)

  // Resolve services
  const orderService = container.resolve("order")
  const notificationService = container.resolve("notification")

  // Retrieve full order data
  const order = await orderService.retrieveOrder(data.id, {
    relations: ["customer", "items"],
  })

  // Send confirmation email
  await notificationService.createNotifications({
    to: order.customer.email,
    template: "order-confirmation",
    channel: "email",
    data: { order },
  })

  logger.info(`Confirmation email sent for order ${data.id}`)
}

export const config: SubscriberConfig = {
  event: "order.placed", // Single event
}
```

### Monitorando vários eventos

```typescript
// src/subscribers/product-changes.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function productChangesHandler({
  event: { eventName, data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  logger.info(`Product event: ${eventName} for product ${data.id}`)

  // Handle different events
  switch (eventName) {
    case "product.created":
      // Handle product creation
      break
    case "product.updated":
      // Handle product update
      break
    case "product.deleted":
      // Handle product deletion
      break
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
}
```

## Eventos comuns de comércio

**⚠️ IMPORTANTE**: Os dados dos eventos geralmente contêm apenas o ID da entidade afetada. Você deve recuperar os dados completos, se necessário.

### Eventos de pedidos

```typescript
"order.placed" // Order was placed
"order.updated" // Order was updated
"order.canceled" // Order was canceled
"order.completed" // Order was completed
"order.shipment_created" // Shipment was created for order
```

### Eventos de produtos

```typescript
"product.created" // Product was created
"product.updated" // Product was updated
"product.deleted" // Product was deleted
```

### Eventos do cliente

```typescript
"customer.created" // Customer was created
"customer.updated" // Customer was updated
```

### Eventos do carrinho

```typescript
"cart.created" // Cart was created
"cart.updated" // Cart was updated
```

### Eventos de autenticação

```typescript
"auth.password_reset" // Password reset was requested
```

### Eventos de convite

```typescript
"invite.created" // Invite was created (for admin users)
```

**Para obter uma lista completa de eventos**, consulte o MedusaDocs sobre os eventos específicos do módulo.

## Acesso aos dados do evento

### Estrutura dos dados do evento

```typescript
interface SubscriberArgs<T> {
  event: {
    eventName: string // e.g., "order.placed"
    data: T // Event payload (usually contains { id: string })
  }
  container: MedusaContainer // DI container
}
```

### Recuperação dos dados completos da entidade

**⚠️ IMPORTANTE**: O objeto `data` normalmente contém apenas o ID da entidade. Recupere os dados completos da entidade usando serviços ou consultas:

```typescript
// src/subscribers/order-placed.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  // data.id contains the order ID
  logger.info(`Handling order.placed event for order: ${data.id}`)

  // Retrieve full order data with relations
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "email",
      "total",
      "customer.*",
      "items.*",
      "items.product.*",
    ],
    filters: {
      id: data.id,
    },
  })

  const order = orders[0]

  // Now you have the full order data
  logger.info(`Order total: ${order.total}`)
  logger.info(`Customer email: ${order.customer.email}`)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

### Utilização dos serviços do módulo

```typescript
export default async function productUpdatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productService = container.resolve("product")

  // Retrieve product using service
  const product = await productService.retrieveProduct(data.id, {
    select: ["id", "title", "status"],
    relations: ["variants"],
  })

  // Process product
}
```

## Acionamento de eventos personalizados

Emita eventos personalizados a partir de fluxos de trabalho usando o `emitEventStep`:

```typescript
// src/workflows/create-review.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "@medusajs/medusa/core-flows"

const createReviewWorkflow = createWorkflow(
  "create-review",
  function (input: { product_id: string; rating: number }) {
    // Create review step
    const review = createReviewStep(input)

    // Emit custom event
    emitEventStep({
      eventName: "review.created",
      data: {
        id: review.id,
        product_id: input.product_id,
        rating: input.rating,
      },
    })

    return new WorkflowResponse({ review })
  }
)

export default createReviewWorkflow
```

Em seguida, crie um assinante para o evento personalizado:

```typescript
// src/subscribers/review-created.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function reviewCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; product_id: string; rating: number }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  logger.info(`Review ${data.id} created for product ${data.product_id}`)

  // If rating is low, notify support
  if (data.rating <= 2) {
    const notificationService = container.resolve("notification")
    await notificationService.createNotifications({
      to: "support@example.com",
      template: "low-rating-alert",
      channel: "email",
      data: {
        review_id: data.id,
        product_id: data.product_id,
        rating: data.rating,
      },
    })
  }
}

export const config: SubscriberConfig = {
  event: "review.created",
}
```

## Melhores práticas

### 1. Sempre utilize o registro de logs

```typescript
export default async function mySubscriber({
  event: { eventName, data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  logger.info(`Handling ${eventName} for ${data.id}`)

  try {
    // Subscriber logic
    logger.info(`Successfully handled ${eventName}`)
  } catch (error) {
    logger.error(`Failed to handle ${eventName}: ${error.message}`)
  }
}
```

### 2. Trate os erros de maneira adequada

Os assinantes são executados de forma assíncrona e não bloqueiam o fluxo principal. Registre erros, mas não gere exceções:

```typescript
// ✅ GOOD: Catches errors and logs
export default async function mySubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  try {
    // Subscriber logic that might fail
    await sendEmail(data.id)
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`)
    // Don't throw - subscriber completes gracefully
  }
}
```

### 3. Mantenha os assinantes rápidos e sem bloqueios

Os assinantes devem realizar operações rápidas. Para tarefas demoradas, considere:

- Colocar a tarefa na fila para processamento em segundo plano
- Usar tarefas agendadas em vez disso
- Dividir o trabalho em etapas menores

```typescript
// ✅ GOOD: Quick operation
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve("notification")

  // Quick: Queue email for sending
  await notificationService.createNotifications({
    to: "customer@example.com",
    template: "order-confirmation",
      channel: "email",
    data: { order_id: data.id },
  })
}
```

### 4. Use fluxos de trabalho para mutações

Se o seu assinante precisar realizar mutações, use fluxos de trabalho:

```typescript
// ✅ GOOD: Uses workflow for mutations
import { syncProductWorkflow } from "../workflows/sync-product"

export default async function productCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  // Execute workflow to sync to external system
  try {
    await syncProductWorkflow(container).run({
      input: { product_id: data.id },
    })
    logger.info(`Product ${data.id} synced successfully`)
  } catch (error) {
    logger.error(`Failed to sync product ${data.id}: ${error.message}`)
  }
}
```

### 5. Evite loops infinitos de eventos

Tenha cuidado ao se inscrever em eventos que acionam outros eventos:

```typescript
// ❌ BAD: Can cause infinite loop
export default async function productUpdatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productService = container.resolve("product")

  // This triggers another product.updated event!
  await productService.updateProducts({
    id: data.id,
    metadata: { last_updated: new Date() },
  })
}

// ✅ GOOD: Add guard condition
export default async function productUpdatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  // Retrieve product to check if we should update
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
    filters: { id: data.id },
  })

  const product = products[0]

  // Guard: Only update if not already processed
  if (!product.metadata?.processed) {
    const productService = container.resolve("product")
    await productService.updateProducts({
      id: data.id,
      metadata: { processed: true },
    })
  }
}
```

### 6. Torne os assinantes idempotentes

Os assinantes podem ser chamados várias vezes para o mesmo evento. Projete-os para lidar com essa situação:

```typescript
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const myService = container.resolve("my-service")

  // Check if we've already processed this order
  const processed = await myService.isOrderProcessed(data.id)

  if (processed) {
    logger.info(`Order ${data.id} already processed, skipping`)
    return
  }

  // Process order
  await myService.processOrder(data.id)

  // Mark as processed
  await myService.markOrderAsProcessed(data.id)
}
```

## Exemplo completo: E-mail de confirmação de pedido

```typescript
// src/subscribers/order-placed.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function sendOrderConfirmationEmail({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  logger.info(`Sending order confirmation for order: ${data.id}`)

  try {
    const query = container.resolve("query")

    // Retrieve full order data
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "currency_code",
        "customer.first_name",
        "customer.last_name",
        "items.*",
        "items.product.title",
        "shipping_address.*",
      ],
      filters: {
        id: data.id,
      },
    })

    if (!orders || orders.length === 0) {
      logger.error(`Order ${data.id} not found`)
      return
    }

    const order = orders[0]

    // Send confirmation email
    const notificationService = container.resolve("notification")
    await notificationService.createNotifications({
      to: order.email,
      template: "order-confirmation",
      channel: "email",
      data: {
        order_id: order.display_id,
        customer_name: `${order.customer.first_name} ${order.customer.last_name}`,
        items: order.items,
        total: order.total,
        currency: order.currency_code,
        shipping_address: order.shipping_address,
      },
    })

    logger.info(`Order confirmation email sent to ${order.email}`)
  } catch (error) {
    logger.error(
      `Failed to send order confirmation for ${data.id}: ${error.message}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```
