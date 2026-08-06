# Tarefas agendadas

As tarefas agendadas são funções assíncronas que são executadas automaticamente em intervalos especificados durante o tempo de execução do aplicativo Medusa. Utilize-as para tarefas como sincronizar produtos com serviços de terceiros, enviar relatórios periódicos ou limpar dados obsoletos.

## Índice

- [Quando usar tarefas agendadas](#quando-usar-tarefas-agendadas)
- [Criação de uma tarefa agendada](#criando-uma-tarefa-agendada)
- [Opções de configuração](#opcoes-de-configuracao)
- [Execução de fluxos de trabalho em tarefas agendadas](#executando-fluxos-de-trabalho-em-tarefas-agendadas)
- [Exemplos de expressões Cron](#exemplos-de-expressoes-cron)
- [Melhores práticas](#melhores-praticas)

## Quando usar tarefas agendadas

Use tarefas agendadas quando precisar realizar ações **periodicamente**:

- ✅ Sincronizar dados com serviços de terceiros de acordo com uma programação
- ✅ Enviar relatórios periódicos (diários, semanais)
- ✅ Limpar dados obsoletos (carrinhos expirados, sessões antigas)
- ✅ Gerar exportações em lote
- ✅ Recalcular dados agregados

**Não use tarefas agendadas para:**

- ❌ Reagir a eventos (use [assinantes](subscribers-and-events.md) em vez disso)
- ❌ Tarefas pontuais (use fluxos de trabalho diretamente)
- ❌ Processamento em tempo real (use rotas de API + fluxos de trabalho)

**Tarefas agendadas x Assinantes:**

- **Tarefa agendada**: Identifica carrinhos atualizados há mais de 24 horas e envia e-mails (padrão de polling)
- **Assinante**: reage ao evento `order.created` e envia um e-mail (orientado a eventos)

Na maioria dos casos de uso, os assinantes são preferíveis quando é necessário reagir a eventos específicos.

## Criando uma tarefa agendada

Crie um arquivo TypeScript no diretório `src/jobs/`:

```typescript
// src/jobs/sync-products.ts
import { MedusaContainer } from "@medusajs/framework/types"

export default async function syncProductsJob(container: MedusaContainer) {
  const logger = container.resolve("logger")

  logger.info("Starting product sync...")

  // Resolve services from container
  const productService = container.resolve("product")
  const myService = container.resolve("my-custom-service")

  try {
    // Your job logic here
    const products = await productService.listProducts({ active: true })

    for (const product of products) {
      // Process each product
      await myService.syncToExternalSystem(product)
    }

    logger.info("Product sync completed successfully")
  } catch (error) {
    logger.error(`Product sync failed: ${error.message}`)
    // Don't throw - let the job complete and retry on next schedule
  }
}

export const config = {
  name: "sync-products-daily", // Unique name for the job
  schedule: "0 0 * * *", // Cron expression: midnight daily
}
```

## Opções de configuração

```typescript
export const config = {
  name: "my-job", // Required: unique identifier
  schedule: "* * * * *", // Required: cron expression
  numberOfExecutions: 3, // Optional: limit total scheduled executions
}
```

### Propriedades de configuração

- **name** (obrigatório): Identificador exclusivo para a tarefa em toda a sua aplicação
- **schedule** (obrigatório): Expressão Cron que define quando a tarefa deve ser executada
- **numberOfExecutions** (opcional): Número máximo de vezes que a tarefa pode ser executada **de acordo com sua programação**

**⚠️ IMPORTANTE - Entendendo o `numberOfExecutions`:**

O `numberOfExecutions` limita quantas vezes a tarefa é executada **conforme sua programação**, NÃO imediatamente após a inicialização do servidor.

```typescript
// ❌ WRONG UNDERSTANDING: This will NOT run immediately on server start
export const config = {
  name: "test-job",
  schedule: "0 0 * * *", // Daily at midnight
  numberOfExecutions: 1, // Will run ONCE at the next midnight, not now!
}

// ✅ CORRECT: To test a job immediately, use a frequent schedule
export const config = {
  name: "test-job",
  schedule: "* * * * *", // Every minute
  numberOfExecutions: 1, // Will run once at the next minute
}

// ✅ CORRECT: Testing with multiple runs
export const config = {
  name: "test-job",
  schedule: "*/5 * * * *", // Every 5 minutes
  numberOfExecutions: 3, // Will run 3 times (at 0, 5, 10 minutes), then stop
}
```

**Pontos-chave:**

- O trabalho aguarda o primeiro horário programado antes de ser executado
- `numberOfExecutions: 1` com uma programação diária significa que ele será executado uma vez no dia seguinte
- Para testar imediatamente, use uma programação frequente como `"* * * * *"` (a cada minuto)
- Após atingir `numberOfExecutions`, a tarefa para de ser executada permanentemente

## Executando fluxos de trabalho em tarefas agendadas

**⚠️ MELHOR PRÁTICA**: Use fluxos de trabalho para mutações em tarefas agendadas. Isso garante o tratamento adequado de erros e recursos de reversão.

```typescript
// src/jobs/send-weekly-newsletter.ts
import { MedusaContainer } from "@medusajs/framework/types"
import { sendNewsletterWorkflow } from "../workflows/send-newsletter"

export default async function sendNewsletterJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  logger.info("Sending weekly newsletter...")

  try {
    // Query for data
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: {
        newsletter_subscribed: true,
      },
    })

    logger.info(`Found ${customers.length} subscribers`)

    // Execute workflow
    await sendNewsletterWorkflow(container).run({
      input: {
        customer_ids: customers.map((c) => c.id),
      },
    })

    logger.info("Newsletter sent successfully")
  } catch (error) {
    logger.error(`Newsletter job failed: ${error.message}`)
  }
}

export const config = {
  name: "send-weekly-newsletter",
  schedule: "0 0 * * 0", // Every Sunday at midnight
}
```

## Exemplos de expressões Cron

Formato Cron: `minuto hora dia do mês mês dia da semana`

```typescript
// Every minute
schedule: "* * * * *"

// Every 5 minutes
schedule: "*/5 * * * *"

// Every hour at minute 0
schedule: "0 * * * *"

// Every day at midnight (00:00)
schedule: "0 0 * * *"

// Every day at 2:30 AM
schedule: "30 2 * * *"

// Every Sunday at midnight
schedule: "0 0 * * 0"

// Every Monday at 9 AM
schedule: "0 9 * * 1"

// First day of every month at midnight
schedule: "0 0 1 * *"

// Every weekday (Mon-Fri) at 6 PM
schedule: "0 18 * * 1-5"

// Every 6 hours
schedule: "0 */6 * * *"
```

**Dica**: Use o [crontab.guru](https://crontab.guru) para criar e validar expressões cron.

## Melhores práticas

### 1. Sempre use registro em log

```typescript
export default async function myJob(container: MedusaContainer) {
  const logger = container.resolve("logger")

  logger.info("Job started")

  try {
    // Job logic
    logger.info("Job completed successfully")
  } catch (error) {
    logger.error(`Job failed: ${error.message}`, { error })
  }
}
```

### 2. Trate os erros com elegância

Não gere erros no nível superior — registre-os em log e deixe a tarefa ser concluída:

```typescript
// ❌ BAD: Throws and stops execution
export default async function myJob(container: MedusaContainer) {
  const service = container.resolve("my-service")
  const items = await service.getItems() // Might throw
  // Job stops if this throws
}

// ✅ GOOD: Catches errors and logs
export default async function myJob(container: MedusaContainer) {
  const logger = container.resolve("logger")

  try {
    const service = container.resolve("my-service")
    const items = await service.getItems()
    // Process items
  } catch (error) {
    logger.error(`Job failed: ${error.message}`)
    // Job completes, will retry on next schedule
  }
}
```

### 3. Tornar as tarefas idempotentes

Projete as tarefas de forma que possam ser executadas novamente com segurança:

```typescript
// ✅ GOOD: Idempotent job
export default async function syncProducts(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const myService = container.resolve("my-service")

  // Check what's already synced
  const lastSyncTime = await myService.getLastSyncTime()

  // Only sync products updated since last sync
  const { data: products } = await query.graph({
    entity: "product",
    filters: {
      updated_at: { $gte: lastSyncTime },
    },
  })

  // Sync products (upsert, don't insert)
  for (const product of products) {
    await myService.upsertToExternalSystem(product)
  }

  // Update last sync time
  await myService.setLastSyncTime(new Date())
}
```

### 4. Use fluxos de trabalho para mutações

```typescript
// ✅ GOOD: Uses workflow for mutations
import { deleteCartsWorkflow } from "../workflows/delete-carts"

export default async function cleanupExpiredCarts(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  // Find expired carts
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: ["id"],
    filters: {
      updated_at: {
        $lte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      },
    },
  })

  logger.info(`Found ${carts.length} expired carts`)

  // Use workflow for deletion (import at top of file)
  await deleteCartsWorkflow(container).run({
    input: {
      cart_ids: carts.map((c) => c.id),
    },
  })

  logger.info("Expired carts cleaned up")
}
```

### 5. Adicionar métricas/monitoramento

```typescript
export default async function myJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const startTime = Date.now()

  try {
    // Job logic
    const processed = 100 // Track what you processed

    const duration = Date.now() - startTime
    logger.info(`Job completed: ${processed} items in ${duration}ms`)
  } catch (error) {
    logger.error(`Job failed after ${Date.now() - startTime}ms`)
  }
}
```

### 6. Testar com execuções limitadas

Ao realizar testes, utilize uma programação frequente com um número limitado de execuções:

```typescript
// ✅ CORRECT: Frequent schedule for immediate testing
export const config = {
  name: "test-job",
  schedule: "* * * * *", // Every minute
  numberOfExecutions: 3, // Run 3 times (next 3 minutes), then stop
}

// ❌ WRONG: This won't help with testing
export const config = {
  name: "test-job",
  schedule: "0 0 * * *", // Daily at midnight
  numberOfExecutions: 1, // Will only run ONCE at next midnight, not useful for testing
}
```

**Lembre-se**: `numberOfExecutions` não faz com que a tarefa seja executada imediatamente — ele limita o número de vezes que ela será executada de acordo com sua programação.

## Exemplo completo: Tarefa de e-mail para carrinhos abandonados

```typescript
// src/jobs/send-abandoned-cart-emails.ts
import { MedusaContainer } from "@medusajs/framework/types"
import { sendAbandonedCartEmailWorkflow } from "../workflows/send-abandoned-cart-email"

export default async function abandonedCartEmailJob(
  container: MedusaContainer
) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  logger.info("Starting abandoned cart email job...")

  try {
    // Find carts updated more than 24 hours ago that haven't completed
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["id", "email", "customer_id"],
      filters: {
        updated_at: {
          $lte: twentyFourHoursAgo,
        },
        completed_at: null,
        email: { $ne: null }, // Must have email
      },
    })

    logger.info(`Found ${carts.length} abandoned carts`)

    // Process in batches
    for (const cart of carts) {
      try {
        await sendAbandonedCartEmailWorkflow(container).run({
          input: {
            cart_id: cart.id,
            email: cart.email,
          },
        })
        logger.info(`Sent email for cart ${cart.id}`)
      } catch (error) {
        logger.error(`Failed to send email for cart ${cart.id}: ${error.message}`)
        // Continue with other carts
      }
    }

    logger.info("Abandoned cart email job completed")
  } catch (error) {
    logger.error(`Abandoned cart job failed: ${error.message}`)
  }
}

export const config = {
  name: "send-abandoned-cart-emails",
  schedule: "0 */6 * * *", // Every 6 hours
}
```
