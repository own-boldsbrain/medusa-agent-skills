# Análise aprofundada da arquitetura: orquestração de fluxos de trabalho

Os fluxos de trabalho constituem a camada de orquestração do Medusa — eles coordenam etapas, gerenciam transações e oferecem reversão automática. Compreender a orquestração de fluxos de trabalho é essencial para a criação de aplicativos robustos e confiáveis.

## O que é orquestração de fluxo de trabalho?

**Orquestração de fluxo de trabalho** significa coordenar várias operações em um processo de negócios coeso, com recursos de reversão automática.

```
Simple Operation (No Orchestration)
┌─────────────┐
│   Action    │ ← Single operation, no coordination
└─────────────┘

Orchestrated Workflow
┌─────────────────────────────────────────────────┐
│  Workflow (Orchestrator)                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│  │  Step 1  │→→→│  Step 2  │→→→│  Step 3  │   │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   │
│       │              │              │          │
│       ▼              ▼              ▼          │
│  ┌────────┐     ┌────────┐     ┌────────┐     │
│  │Rollback│     │Rollback│     │Rollback│     │
│  │Step 1  │◀◀◀◀◀│Step 2  │◀◀◀◀◀│Step 3  │     │
│  └────────┘     └────────┘     └────────┘     │
└─────────────────────────────────────────────────┘
```

## Por que usar fluxos de trabalho em vez de chamadas diretas de atendimento?

### ❌ Problema: Chamadas de atendimento direto

```typescript
// Without workflows - Manual coordination and rollback
async function createBrandWithLogo(brandData, logoFile) {
  let brand
  let logoUrl

  try {
    // Step 1: Create brand
    const brandService = container.resolve("brand")
    brand = await brandService.createBrands([brandData])

    // Step 2: Upload logo
    const s3Service = container.resolve("s3Service")
    logoUrl = await s3Service.upload(logoFile)

    // Step 3: Update brand with logo URL
    await brandService.updateBrands([{
      id: brand.id,
      logo_url: logoUrl,
    }])

    return { brand, logoUrl }
  } catch (error) {
    // Manual rollback - Error-prone!
    if (brand) {
      try {
        await brandService.deleteBrands([brand.id])
      } catch (rollbackError) {
        // What if rollback fails? Data is now inconsistent!
        console.error("Rollback failed:", rollbackError)
      }
    }

    if (logoUrl) {
      try {
        await s3Service.delete(logoUrl)
      } catch (rollbackError) {
        // Orphaned file in S3!
        console.error("S3 cleanup failed:", rollbackError)
      }
    }

    throw error
  }
}
```

**Problemas**:

1. ❌ Lógica de reversão manual — é fácil cometer erros
2. ❌ Não há garantia de limpeza — a reversão pode falhar
3. ❌ Duplicação de código — o mesmo padrão se repete em todos os lugares
4. ❌ Difícil de testar — é preciso testar o sucesso e todos os cenários de falha
5. ❌ Hard to extend - adding new steps requires updating rollback logic

### ✅ Solution: Workflow Orchestration

```typescript
// With workflows - Automatic coordination and rollback
const createBrandStep = createStep(
  "create-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([input])
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) return
    const brandService = container.resolve("brand")
    await brandService.deleteBrands([brandId])
  }
)

const uploadLogoStep = createStep(
  "upload-logo",
  async (input, { container }) => {
    const s3Service = container.resolve("s3Service")
    const logoUrl = await s3Service.upload(input.logo)
    return new StepResponse(logoUrl, logoUrl)
  },
  async (logoUrl, { container }) => {
    if (!logoUrl) return
    const s3Service = container.resolve("s3Service")
    await s3Service.delete(logoUrl)
  }
)

const updateBrandLogoStep = createStep(
  "update-brand-logo",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    await brandService.updateBrands([{
      id: input.brandId,
      logo_url: input.logoUrl,
    }])
    return new StepResponse("updated", { brandId: input.brandId, previousLogoUrl: null })
  },
  async (compensationData, { container }) => {
    const brandService = container.resolve("brand")
    await brandService.updateBrands([{
      id: compensationData.brandId,
      logo_url: compensationData.previousLogoUrl,
    }])
  }
)

export const createBrandWithLogoWorkflow = createWorkflow(
  "create-brand-with-logo",
  function (input) {
    const brand = createBrandStep(input)
    const logoUrl = uploadLogoStep({ logo: input.logo })
    updateBrandLogoStep({
      brandId: brand.id,
      logoUrl: logoUrl,
    })

    return new WorkflowResponse({ brand, logoUrl })
  }
)

// Use it
const { result } = await createBrandWithLogoWorkflow(container)
  .run({ input: { name: "Nike", logo: file } })
```

**Benefícios**:

1. ✅ Revertimento automático — o Medusa cuida da compensação
2. ✅ Limpeza garantida — tudo ou nada
3. ✅ Sem duplicação de código — a compensação é definida uma única vez por etapa
4. ✅ Fácil de testar — teste as etapas independentemente
5. ✅ Fácil de ampliar — adicione novas etapas; a compensação ocorre automaticamente

## Arquitetura do fluxo de trabalho

### Declarativo x Imperativo

**Conclusão principal**: Os fluxos de trabalho são DECLARATIVOS, não IMPERATIVOS.

```typescript
// ❌ WRONG - Imperative (trying to execute)
createWorkflow("wrong", async function (input) {
  const result = await someStep(input)  // ❌ Using await!
  return result
})

// ✅ CORRECT - Declarative (defining flow)
createWorkflow("correct", function (input) {
  const result = someStep(input)  // ✅ No await! Just defining flow
  return new WorkflowResponse(result)
})
```

**Por quê?**

Os fluxos de trabalho definem o que acontece, não como isso acontece:

```
Workflow Definition (What)      Workflow Execution (How)
┌────────────────────┐           ┌──────────────────────┐
│ function (input) { │           │  Engine executes:    │
│   step1(input)     │──────▶    │  1. Calls step1      │
│   step2(step1)     │           │  2. Waits for result │
│   step3(step2)     │           │  3. Calls step2      │
│   return response  │           │  4. Waits for result │
│ }                  │           │  5. Calls step3      │
└────────────────────┘           │  6. Returns response │
                                 └──────────────────────┘
```

Você define o fluxo de forma síncrona. O mecanismo o executa de forma assíncrona.

## Padrões de composição de etapas

### Padrão 1: Etapas sequenciais

Cada etapa depende do resultado da etapa anterior:

```typescript
createWorkflow("sequential", function (input) {
  const brand = createBrandStep(input.brand)
  const product = createProductStep({
    title: input.productTitle,
    brand_id: brand.id,  // Uses output from previous step
  })
  const inventory = allocateInventoryStep({
    product_id: product.id,  // Uses output from previous step
    quantity: input.quantity,
  })

  return new WorkflowResponse({ brand, product, inventory })
})
```

**Ordem de execução**: etapa1 → etapa2 → etapa3 (sequencial)

**Ordem de reversão** (caso a etapa3 falhe): compensar(etapa2) → compensar(etapa1)

### Padrão 2: Etapas condicionais

Use `when()` para execução condicional:

```typescript
import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"

createWorkflow("conditional", function (input) {
  const brand = createBrandStep(input.brand)

  // Only send notification if brand is premium
  when({ brand }, ({ brand }) => {
    return brand.is_premium
  }).then(() => {
    sendPremiumNotificationStep(brand)
  })

  return new WorkflowResponse(brand)
})
```

### Padrão 3: Transformar dados

Use `transform()` para moldar os dados entre as etapas:

```typescript
import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"

createWorkflow("transform-example", function (input) {
  const brands = createMultipleBrandsStep(input.brands)

  // Transform array of brands to just their IDs
  const brandIds = transform({ brands }, ({ brands }) => {
    return brands.map(b => b.id)
  })

  const products = createProductsStep({
    products: input.products,
    brand_ids: brandIds,  // Use transformed data
  })

  return new WorkflowResponse({ brands, products })
})
```

## Padrões de funções de compensação

### Padrão 1: Exclusão simples

Padrão mais comum — excluir o que foi criado:

```typescript
const createBrandStep = createStep(
  "create-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([input])
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) return
    const brandService = container.resolve("brand")
    await brandService.deleteBrands([brandId])
  }
)
```

### Padrão 2: Restaurar o estado anterior

Para atualizações, restaure o valor anterior:

```typescript
const updateBrandStep = createStep(
  "update-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")

    // Get current brand to save its state
    const [currentBrand] = await brandService.retrieveBrands([input.id])

    // Update brand
    const [updatedBrand] = await brandService.updateBrands([{
      id: input.id,
      name: input.name,
    }])

    // Return updated brand as result, current brand for compensation
    return new StepResponse(updatedBrand, {
      id: currentBrand.id,
      previousName: currentBrand.name,
    })
  },
  async (compensationData, { container }) => {
    if (!compensationData) return

    const brandService = container.resolve("brand")

    // Restore previous name
    await brandService.updateBrands([{
      id: compensationData.id,
      name: compensationData.previousName,
    }])
  }
)
```

### Padrão 3: Não é necessária compensação

Operações somente de leitura não precisam de compensação:

```typescript
const getBrandStep = createStep(
  "get-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.retrieveBrands([input.id])
    return new StepResponse(brand)
  }
  // No compensation function - read-only operation
)
```

### Padrão 4: Compensação de serviço externo

Limpe os recursos externos:

```typescript
const uploadToS3Step = createStep(
  "upload-to-s3",
  async (input, { container }) => {
    const s3Service = container.resolve("s3Service")
    const result = await s3Service.upload(input.file)

    return new StepResponse(result.url, {
      url: result.url,
      bucket: result.bucket,
      key: result.key,
    })
  },
  async (compensationData, { container }) => {
    if (!compensationData) return

    const s3Service = container.resolve("s3Service")

    // Delete file from S3
    await s3Service.deleteObject({
      bucket: compensationData.bucket,
      key: compensationData.key,
    })
  }
)
```

## Exemplo prático: fluxo de trabalho complexo de pedidos

Aqui está um cenário prático que ilustra a orquestração do fluxo de trabalho:

```typescript
export const createOrderWorkflow = createWorkflow(
  "create-order",
  function (input) {
    // Step 1: Validate inventory (read-only, no compensation)
    const inventoryCheck = validateInventoryStep(input.items)

    // Step 2: Create order
    const order = createOrderStep({
      customer_id: input.customer_id,
      items: input.items,
    })

    // Step 3: Reserve inventory (parallel with payment)
    const reservation = reserveInventoryStep({
      order_id: order.id,
      items: input.items,
    })

    // Step 4: Process payment (parallel with inventory)
    const payment = processPaymentStep({
      order_id: order.id,
      amount: input.amount,
      payment_method: input.payment_method,
    })

    // Step 5: Send confirmation (only after payment succeeds)
    when({ payment }, ({ payment }) => payment.status === "succeeded")
      .then(() => {
        sendOrderConfirmationStep({
          order_id: order.id,
          customer_email: input.customer_email,
        })
      })

    // Step 6: Allocate to warehouse
    const allocation = allocateToWarehouseStep({
      order_id: order.id,
      items: input.items,
      warehouse_id: input.warehouse_id,
    })

    return new WorkflowResponse({ order, payment, reservation, allocation })
  }
)
```

**O que acontece se o pagamento falhar (etapa 4)?**

O Medusa executa automaticamente as compensações na ordem inversa:

1. Compensação da etapa **allocateToWarehouseStep**: Desalocar (se tiver sido executada)
2. Compensação da etapa **sendOrderConfirmationStep**: N/A (não foi executada devido a `when()`)
3. Compensação **processPaymentStep**: Reembolsar (se o pagamento tiver sido capturado) ou anular a autorização
4. Compensação **reserveInventoryStep**: Liberar a reserva de estoque
5. Compensação **createOrderStep**: Excluir o pedido ou marcá-lo como cancelado
6. Compensação **validateInventoryStep**: N/A (somente leitura)

**Resultado**: Banco de dados limpo. Sem dados órfãos. Cliente não cobrado. Estoque não reservado.

## Hooks de fluxo de trabalho

Os hooks permitem que você insira lógica personalizada em fluxos de trabalho existentes:

### Por que usar hooks?

Você deseja ampliar os fluxos de trabalho principais do Medusa sem criar um fork do código.

```typescript
// Core Medusa workflow
export const createProductsWorkflow = createWorkflow(
  "create-products",
  function (input) {
    const products = createProductsStep(input)

    // Hook point: productsCreated
    // Your custom code runs here

    return new WorkflowResponse(products)
  }
)

// Your application - Subscribe to hook
createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    // Your custom logic
    const link = container.resolve("link")

    if (additional_data?.brand_id) {
      await link.create({
        [Modules.BRAND]: { brand_id: additional_data.brand_id },
        [Modules.PRODUCT]: { product_id: products[0].id },
      })
    }

    return new StepResponse("done")
  },
  async (compensationData, { container }) => {
    // Your custom compensation
    if (compensationData?.linkId) {
      const link = container.resolve("link")
      await link.dismiss([compensationData.linkId])
    }
  }
)
```

**Benefícios**:

- ✅ Amplia a funcionalidade principal sem modificar o código do Medusa
- ✅ Sua lógica participa da reversão automática
- ✅ Seguro para atualizações — os hooks continuam funcionando em todas as versões do Medusa
- ✅ Vários assinantes — vários hooks podem ser executados simultaneamente

## Antipadrões a serem evitados

### ❌ Antipadrão 1: Usar Async/Await na função de fluxo de trabalho

```typescript
// ❌ WRONG
createWorkflow("wrong", async function (input) {
  const result = await someStep(input)  // ❌ Async/await not allowed!
  return result
})

// ✅ CORRECT
createWorkflow("correct", function (input) {
  const result = someStep(input)  // ✅ Synchronous definition
  return new WorkflowResponse(result)
})
```

**Por que**: Os fluxos de trabalho são modelos declarativos. Usar async/await significa executar durante a definição, o que rompe o modelo de orquestração.

### ❌ Antipadrão 2: Falta de compensação por mudanças de estado

```typescript
// ❌ WRONG - No compensation for state change
const createBrandStep = createStep(
  "create-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([input])
    return new StepResponse(brand)
  }
  // Missing compensation! Brand remains if workflow fails
)

// ✅ CORRECT
const createBrandStep = createStep(
  "create-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([input])
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) return
    const brandService = container.resolve("brand")
    await brandService.deleteBrands([brandId])
  }
)
```

### ❌ Antipadrão 3: Lógica de negócios na função de fluxo de trabalho

```typescript
// ❌ WRONG - Logic in workflow function
createWorkflow("wrong", function (input) {
  const brand = createBrandStep(input)

  // ❌ Business logic in workflow function
  if (brand.name.startsWith("Nike")) {
    const premiumBrand = { ...brand, is_premium: true }
    return new WorkflowResponse(premiumBrand)
  }

  return new WorkflowResponse(brand)
})

// ✅ CORRECT - Logic in steps
createWorkflow("correct", function (input) {
  const brand = createBrandStep(input)

  // Conditional step based on brand data
  when({ brand }, ({ brand }) => brand.name.startsWith("Nike"))
    .then(() => {
      markAsPremiumStep(brand.id)
    })

  return new WorkflowResponse(brand)
})
```

### ❌ Antipadrão 4: Acesso direto ao banco de dados em fluxos de trabalho

```typescript
// ❌ WRONG - Direct database access
createWorkflow("wrong", function (input) {
  const brand = someStepThatDirectlyQueriesDB(input)  // ❌ DB access outside module
  return new WorkflowResponse(brand)
})

// ✅ CORRECT - Database access in steps, steps use modules
const createBrandStep = createStep(
  "create-brand",
  async (input, { container }) => {
    // ✅ Use module service
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([input])
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    const brandService = container.resolve("brand")
    await brandService.deleteBrands([brandId])
  }
)
```

## Resumo

A orquestração de fluxos de trabalho é essencial para a criação de aplicativos Medusa robustos:

**Conceitos-chave**:

- **Os fluxos de trabalho coordenam** — Eles organizam etapas em processos de negócios
- **As etapas são executadas** — Elas realizam operações atômicas
- **A compensação reverte** — Reversão automática em caso de falha
- **Definição declarativa** — Define o fluxo, não executa
- **Hooks ampliam** — Adicionam lógica personalizada aos fluxos de trabalho principais

**Benefícios**:

- Revertimento automático (tudo ou nada)
- Limpeza garantida (sem dados órfãos)
- Reutilização de código (fluxos de trabalho que podem ser chamados de qualquer lugar)
- Facilidade de teste (teste de etapas de forma independente)
- Facilidade de extensão (adicione etapas sem precisar reescrever)

**Padrões**:

- Sequencial: a etapa 2 usa a saída da etapa 1
- Paralelo: etapas independentes são executadas simultaneamente
- Condicional: `when()` para lógica de ramificação
- Transformação: modelagem de dados entre etapas

**Lembre-se**: os fluxos de trabalho são a camada de orquestração. Eles coordenam (não executam), compõem (não implementam) e garantem a limpeza (reversão automática).
