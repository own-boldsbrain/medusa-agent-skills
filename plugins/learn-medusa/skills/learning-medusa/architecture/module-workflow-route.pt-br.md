# Análise aprofundada da arquitetura: Módulo → Fluxo de trabalho → Padrão de rota de API

Este é o padrão fundamental de três camadas do Medusa para a criação de recursos. Compreender esse padrão é fundamental para desenvolver aplicativos sustentáveis e escaláveis com o Medusa.

## O Padrão de Três Camadas

```
┌─────────────────────────────────────────────────┐
│  API Route (HTTP Interface Layer)              │
│  - Accepts HTTP requests                       │
│  - Validates input                             │
│  - Executes workflow                           │
│  - Returns HTTP response                       │
│  - No business logic                           │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Workflow (Business Logic Orchestration Layer) │
│  - Coordinates multiple steps                  │
│  - Handles rollback via compensation           │
│  - Manages transactions                        │
│  - No HTTP concerns                            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Module (Data Layer)                           │
│  - Defines data models                         │
│  - Provides CRUD operations                    │
│  - Isolated from other modules                 │
│  - No business logic                           │
└─────────────────────────────────────────────────┘
```

## Por que esse padrão?

### 1. Separação de interesses

Cada camada tem UMA responsabilidade:

- **Rota da API**: Processar HTTP (análise de solicitações, formatação de respostas)
- **Fluxo de trabalho**: Orquestrar a lógica de negócios (coordenação, reversão)
- **Módulo**: Gerenciar dados (persistência, recuperação)

**Por que isso é importante**: Quando você precisa alterar a forma como os dados são armazenados (módulo), você não mexe na lógica HTTP (rota). Quando você altera as regras de negócios (fluxo de trabalho), você não mexe no acesso aos dados (módulo).

### 2. Reutilização

Os fluxos de trabalho podem ser acionados de vários lugares:

```typescript
import { createBrandWorkflow } from "../../workflows/create-brand"

// From HTTP API route
export const POST = async (req, res) => {
  const { result } = await createBrandWorkflow(req.scope)
    .run({ input: req.validatedBody })
  res.json({ brand: result })
}

// From another workflow or subscriber
async function mySubscriber(data, { container }) {
  const { result } = await createBrandWorkflow(container)
    .run({ input: { name: data.brandName } })
  return result
}

// From scheduled job
export const importBrands = async (container, brands) => {
  for (const brand of brands) {
    await createBrandWorkflow(container)
      .run({ input: brand })
  }
}
```

**Por que isso é importante**: Você escreve a lógica de negócios uma vez e a utiliza em todos os lugares. Sem duplicação de código.

### 3. Testabilidade

Cada camada pode ser testada de forma independente:

```typescript
// Test module in isolation
test("creates brand", async () => {
  const brandService = container.resolve("brand")
  const [brand] = await brandService.createBrands([{ name: "Nike" }])
  expect(brand.name).toBe("Nike")
})

// Test workflow in isolation
test("workflow creates brand and sends notification", async () => {
  const { result } = await createBrandWorkflow(container)
    .run({ input: { name: "Nike" } })
  expect(result.brand.name).toBe("Nike")
  expect(mockNotificationService.send).toHaveBeenCalled()
})
```

**Por que isso é importante**: É possível testar cada camada sem precisar iniciar toda a aplicação. Os testes são executados mais rapidamente e são mais confiáveis.

### 4. Revertimento e transações

Os fluxos de trabalho oferecem revertimento automático por meio de funções de compensação:

```typescript
// If any step fails, all previous steps are rolled back
createWorkflow("create-brand-with-s3-upload", function (input) {
  const brand = createBrandStep(input)          // Step 1
  const logo = uploadLogoToS3Step(input.logo)   // Step 2
  const notification = sendSlackNotificationStep(brand) // Step 3
  return new WorkflowResponse({ brand, logo })
})
```

**O que acontece se a etapa 3 falhar?**

1. A etapa 3 falha (API do Slack fora do ar)
2. O Medusa aciona a compensação da etapa 2: excluir o logotipo do S3
3. O Medusa aciona a compensação da etapa 1: excluir a marca do banco de dados
4. Toda a operação é revertida — o banco de dados fica limpo

**Por que isso é importante**: sem dados órfãos. Sem limpeza manual. Sem inconsistências.

## Antipadrão: chamadas diretas a serviços a partir de rotas

### ❌ ERRADO

```typescript
// API route that directly calls services (BAD!)
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const brandService = req.scope.resolve("brand")
  const s3Service = req.scope.resolve("s3")
  const slackService = req.scope.resolve("slack")

  let brand
  let logoUrl

  try {
    // Create brand
    brand = await brandService.createBrands([req.validatedBody])

    // Upload logo
    logoUrl = await s3Service.upload(req.file)

    // Send notification
    await slackService.notify(`Brand ${brand.name} created!`)

    res.json({ brand })
  } catch (error) {
    // Manual rollback - error-prone!
    if (brand) {
      await brandService.deleteBrands([brand.id])
    }
    if (logoUrl) {
      await s3Service.delete(logoUrl)
    }
    throw error
  }
}
```

**Problemas**:

1. ❌ Lógica de negócios na camada HTTP — não reutilizável
2. ❌ Reversão manual — propensa a erros e difícil de manter
3. ❌ Não é possível testar a lógica de negócios sem HTTP
4. ❌ Múltiplas preocupações misturadas (HTTP, lógica de negócios, tratamento de erros)
5. ❌ Falhas parciais deixam os dados em estado inconsistente se o rollback falhar

### ✅ CORRETO

```typescript
// Step 1: Define workflow steps with compensation
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
  "upload-logo-to-s3",
  async (input, { container }) => {
    const s3Service = container.resolve("s3")
    const logoUrl = await s3Service.upload(input.logo)
    return new StepResponse(logoUrl, logoUrl)
  },
  async (logoUrl, { container }) => {
    if (!logoUrl) return
    const s3Service = container.resolve("s3")
    await s3Service.delete(logoUrl)
  }
)

const sendSlackNotificationStep = createStep(
  "send-slack-notification",
  async (brand, { container }) => {
    const slackService = container.resolve("slack")
    await slackService.notify(`Brand ${brand.name} created!`)
    return new StepResponse("sent")
  }
)

// Step 2: Compose workflow
export const createBrandWorkflow = createWorkflow(
  "create-brand-with-s3-upload",
  function (input) {
    const brand = createBrandStep(input)
    const logoUrl = uploadLogoStep({ logo: input.logo })
    sendSlackNotificationStep(brand)

    return new WorkflowResponse({
      brand: transform({ brand }, ({ brand }) => brand),
    })
  }
)

// Step 3: Simple API route
import { createBrandWorkflow } from "../../workflows/create-brand"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await createBrandWorkflow(req.scope)
    .run({ input: req.validatedBody })

  res.json({ brand: result.brand })
}
```

**Benefícios**:

1. ✅ Lógica de negócios no fluxo de trabalho — reutilizável em HTTP, GraphQL, CLI e tarefas
2. ✅ Revertimento automático — o Medusa cuida da compensação
3. ✅ Cada camada pode ser testada de forma independente
4. ✅ Separação clara de responsabilidades
5. ✅ Garantia “tudo ou nada” — ou tudo é bem-sucedido ou tudo é revertido

## Exemplo prático: fluxo de trabalho complexo

Veja um cenário prático: criação de um produto com estoque, preço e alocação em depósito.

```typescript
export const createProductWithInventoryWorkflow = createWorkflow(
  "create-product-with-inventory",
  function (input) {
    // Step 1: Create product in Product Module
    const product = createProductStep(input.product)

    // Step 2: Create pricing in Pricing Module
    const pricing = createPricingStep({
      productId: product.id,
      prices: input.prices,
    })

    // Step 3: Allocate inventory in Inventory Module
    const inventory = allocateInventoryStep({
      productId: product.id,
      quantity: input.quantity,
      warehouseId: input.warehouseId,
    })

    // Step 4: Link to collections in Product Module
    const collections = linkCollectionsStep({
      productId: product.id,
      collectionIds: input.collectionIds,
    })

    // Step 5: Send notification to warehouse
    sendWarehouseNotificationStep({
      productId: product.id,
      warehouseId: input.warehouseId,
    })

    return new WorkflowResponse({ product, pricing, inventory, collections })
  }
)
```

**O que acontece se a etapa 5 falhar (serviço de notificação indisponível)?**

O Medusa executa automaticamente as compensações na ordem inversa:

1. Compensação da etapa 4: Desvincular coleções
2. Compensação da etapa 3: Desalocar estoque
3. Compensação da etapa 2: Excluir preços
4. Compensação da etapa 1: Excluir produto

**Resultado**: O banco de dados está limpo. Sem dados órfãos. Não é necessária limpeza manual.

## Quando usar cada camada

### Camada de Módulos — Use quando for necessário

- Definir modelos de dados
- Armazenar/recuperar dados
- Realizar operações CRUD
- Encapsule a lógica de domínio em torno de uma única entidade

**NÃO** coloque lógica de negócios aqui (por exemplo, “quando o produto for criado, enviar e-mail”).

### Camada de fluxo de trabalho — Use quando for necessário

- Coordenar várias etapas
- Lidar com cenários de reversão
- Orquestrar operações entre módulos
- Implementar processos de negócios

**NÃO** lide com questões relacionadas a HTTP aqui (por exemplo, analisar o corpo da solicitação, definir códigos de status).

### Camada de rotas da API — use quando for necessário

- Aceitar solicitações HTTP
- Validar entradas
- Executar fluxos de trabalho
- Formatar respostas HTTP

**NÃO** coloque lógica de negócios aqui (por exemplo, chamadas diretas de serviço, reversão manual).

## Princípios-chave

1. **As rotas são simples**: elas apenas analisam as solicitações e retornam respostas
2. **Os fluxos de trabalho orquestram**: eles coordenam as etapas, mas não as implementam
3. **Os módulos encapsulam**: eles são responsáveis por seus próprios dados e fornecem operações CRUD
4. **A compensação é obrigatória**: toda etapa que cria ou modifica dados DEVE ter compensação
5. **As etapas são atômicas**: cada etapa faz UMA coisa e a faz bem

## Antipadrões a serem evitados

### ❌ Antipadrão 1: Lógica de negócios nas rotas

```typescript
// BAD - route contains business logic
export const POST = async (req, res) => {
  const brand = await createBrand(req.body)

  // Business rule in route layer
  if (brand.name.startsWith("Nike")) {
    await sendPremiumNotification(brand)
  } else {
    await sendStandardNotification(brand)
  }
}
```

**Correção**: Mover a lógica de negócios para o fluxo de trabalho.

### ❌ Antipadrão 2: Fluxos de trabalho acessando diretamente o banco de dados

```typescript
// BAD - workflow directly queries database
createWorkflow("create-brand", function (input) {
  const result = someStepThatQueriesDatabase(input)
  // Database access should be in modules, not workflows
})
```

**Correção**: Use os serviços dos módulos para todo o acesso aos dados.

### ❌ Anti-padrão 3: Módulos com lógica de negócios

```typescript
// BAD - module contains orchestration logic
class BrandService extends MedusaService(Brand) {
  async createBrand(data) {
    const brand = await this.createBrands([data])
    await this.uploadLogoToS3(data.logo)  // Orchestration!
    await this.sendNotification(brand)     // Orchestration!
    return brand
  }
}
```

**Correção**: Os módulos fornecem apenas operações CRUD. A orquestração fica a cargo dos fluxos de trabalho.

### ❌ Antipadrão 4: Falta de funções de compensação

```typescript
// BAD - step with no compensation
const createBrandStep = createStep(
  "create-brand",
  async (input, { container }) => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([input])
    return new StepResponse(brand)
  }
  // Missing compensation! If later steps fail, brand remains in database
)
```

**Correção**: Sempre forneça compensação para etapas que criem ou modifiquem dados.

## Resumo

O padrão Módulo → Fluxo de Trabalho → Rota de API é fundamental para a criação de aplicativos Medusa sustentáveis e escaláveis:

- **Módulos**: Camada de dados (operações CRUD)
- **Fluxos de Trabalho**: Orquestração da lógica de negócios (coordenação + reversão)
- **Rotas de API**: Interface HTTP (tratamento de solicitações/respostas)

**Benefícios**:

- Separação de responsabilidades
- Reutilização (fluxos de trabalho chamáveis de qualquer lugar)
- Testabilidade (teste de cada camada de forma independente)
- Revertimento automático (funções de compensação)
- Manutenção (alterações isoladas na camada apropriada)

**Regra fundamental**: Cada camada tem UMA única função. Não misture assuntos. Mantenha as rotas simples, os fluxos de trabalho orquestrados e os módulos focados nos dados.