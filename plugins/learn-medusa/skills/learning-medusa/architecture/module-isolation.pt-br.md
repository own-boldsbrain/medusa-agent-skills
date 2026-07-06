# Análise aprofundada da arquitetura: Isolamento de módulos

O isolamento de módulos é um princípio fundamental da arquitetura do Medusa. Compreender por que os módulos devem ser isolados e como trabalhar dentro dessa restrição é essencial para a criação de aplicativos escaláveis.

## O que é isolamento de módulos?

**Isolamento de módulos** significa que os módulos NÃO dependem diretamente do código uns dos outros. Eles não podem importar tipos, serviços ou entidades de outros módulos.

```
❌ WRONG - Direct dependency between modules
┌──────────────┐
│Brand Module  │
│              │───imports───▶ ┌──────────────┐
│import Product│              │Product Module│
│from "../product"            │              │
└──────────────┘              └──────────────┘

✅ CORRECT - Modules are isolated
┌──────────────┐              ┌──────────────┐
│Brand Module  │              │Product Module│
│              │              │              │
│   Isolated   │              │   Isolated   │
└──────┬───────┘              └──────┬───────┘
       │                             │
       └──────────┬──────────────────┘
                  ▼
           ┌─────────────┐
           │ Link Layer  │
           │  (Medusa)   │
           └─────────────┘
```

## Por que o isolamento de módulos é importante

### 1. Ausência de dependências circulares

Sem isolamento, os módulos podem criar cadeias de dependências circulares:

```
❌ Without isolation - Circular dependencies possible
Brand Module ──imports──▶ Product Module
      ▲                        │
      │                        │
      └────────imports─────────┘

Result: Build fails, runtime errors, maintenance nightmare
```

Com isolamento, as dependências circulares são impossíveis:

```
✅ With isolation - No circular dependencies
Brand Module ←─────Link Layer─────▶ Product Module
  (Isolated)                         (Isolated)

Result: Clean architecture, predictable builds
```

### 2. Desenvolvimento e testes independentes

Módulos isolados podem ser desenvolvidos e testados de forma independente:

```typescript
// Test Brand Module WITHOUT needing Product Module
describe("Brand Module", () => {
  it("creates brand", async () => {
    const brandService = container.resolve("brand")
    const [brand] = await brandService.createBrands([{ name: "Nike" }])
    expect(brand.name).toBe("Nike")
  })
})

// Test Product Module WITHOUT needing Brand Module
describe("Product Module", () => {
  it("creates product", async () => {
    const productService = container.resolve("product")
    const [product] = await productService.createProducts([{ title: "Shoe" }])
    expect(product.title).toBe("Shoe")
  })
})
```

**Por que isso é importante**: É possível testar o Módulo de Marca mesmo que o Módulo de Produto esteja com falha. Os testes são mais rápidos e confiáveis.

### 3. Extração e reutilização de módulos

Módulos isolados podem ser extraídos para pacotes separados e reutilizados:

```
Project A: E-commerce Platform
├── @mycompany/brand-module     ◀─┐
├── @mycompany/product-module     │ Can be extracted
├── @mycompany/review-module      │ into npm packages
└── ...                           │
                                  │
Project B: Marketplace Platform   │
├── @mycompany/brand-module     ◀─┘ Reused!
├── different-product-module
└── ...
```

**Por que isso é importante**: Escreva uma vez, use em vários projetos. Crie uma biblioteca de módulos reutilizáveis.

### 4. Controle de versões e atualizações independentes

Módulos isolados podem ter versões e ser atualizados de forma independente:

```
Brand Module v1.0.0 ──────▶ Brand Module v2.0.0
      │                           │
      │                           │ Breaking changes allowed
      │                           │ because no direct dependencies
      ▼                           ▼
Link Layer ──────────────▶ Link Layer
(Interface stays stable)  (Interface stays stable)
```

**Por que isso é importante**: Atualizar o Módulo de Marca sem afetar o Módulo de Produto. Implantar os módulos de forma independente.

## Como funcionam os links entre módulos

Como os módulos não podem importar dados uns dos outros, o Medusa oferece uma **camada de links** para gerenciar essas relações:

```typescript
// ❌ WRONG - Cannot do this!
// In Product Module
import { Brand } from "../brand/models/brand"

interface Product {
  brand: Brand  // Direct reference to Brand entity
}
```

```typescript
// ✅ CORRECT - Use Module Links
// Define link (separate from both modules)
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  BrandModule.linkable.brand
)
```

### Fluxo de dados na camada de enlace

```
1. Application defines link
   defineLink(Product, Brand)
                │
                ▼
2. Medusa creates link table in database
   ┌──────────────────┐
   │ link_brand_product│
   ├──────────────────┤
   │ product_id       │
   │ brand_id         │
   └──────────────────┘
                │
                ▼
3. Query layer handles joins
   query.graph({
     entity: "brand",
     fields: ["id", "name", "products.*"]
   })
   ↓
   SELECT brand.*, product.*
   FROM brand
   LEFT JOIN link_brand_product ON brand.id = link.brand_id
   LEFT JOIN product ON link.product_id = product.id
```

**Conclusão principal**: Os links são gerenciados pela infraestrutura do Medusa, e não pelos seus módulos. Os módulos permanecem isolados.

## Trabalhando com o isolamento de módulos

### Padrão 1: Consulta de dados vinculados

Quando você precisar de dados de vários módulos, use a camada de consulta:

```typescript
// In API route (not in module!)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["id", "name", "products.*"],
  })

  res.json({ brands })
}
```

**Por que isso funciona**: A camada de consulta tem acesso a todos os módulos e links. Ela coordena consultas entre módulos.

### Padrão 2: Ganchos de fluxo de trabalho para lógica entre módulos

Quando você precisar reagir a eventos em outros módulos, use ganchos de fluxo de trabalho:

```typescript
// In your application (not in Brand Module!)
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    const link = container.resolve("link")

    const links = products
      .filter((p) => additional_data?.brand_id)
      .map((product) => ({
        [Modules.BRAND]: { brand_id: additional_data.brand_id },
        [Modules.PRODUCT]: { product_id: product.id },
      }))

    await link.create(links)
    return new StepResponse(links, links)
  },
  async (links, { container }) => {
    if (!links?.length) return
    const link = container.resolve("link")
    await link.dismiss(links)
  }
)
```

**Por que isso funciona**: O Hook está na camada de aplicação (e não em nenhum dos módulos). Ele coordena a interação entre os módulos sem criar dependências.

### Padrão 3: Tipos compartilhados por meio de interfaces

Se você precisar compartilhar tipos, use interfaces (e não tipos concretos):

```typescript
// shared/interfaces.ts (not in any module)
export interface IBrand {
  id: string
  name: string
}

export interface IProduct {
  id: string
  title: string
  brand_id?: string  // Reference by ID, not by entity
}

// In Brand Module - implements interface
export const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
})
// Brand entity implements IBrand structurally

// In workflow - uses interface
async function processBrandProducts(brand: IBrand, products: IProduct[]) {
  // Works with both modules without importing from them
}
```

**Por que isso funciona**: As interfaces não criam dependências em tempo de execução. Os módulos as implementam estruturalmente, sem importações.

## Antipadrões a serem evitados

### ❌ Antipadrão 1: Importações diretas de módulos

```typescript
// In Product Module service
import { BrandService } from "../brand/service"  // ❌ WRONG!

class ProductService extends MedusaService(Product) {
  async createProductWithBrand(data) {
    const brandService = new BrandService()  // ❌ Direct dependency!
    const brand = await brandService.getBrand(data.brand_id)
    // ...
  }
}
```

**Solução**: Use injeção de dependência e a camada de ligação:

```typescript
// In workflow (application layer)
createWorkflow("create-product-with-brand", function (input) {
  const product = createProductStep(input.product)
  const link = linkProductToBrandStep({
    productId: product.id,
    brandId: input.brand_id,
  })
  return new WorkflowResponse({ product, link })
})
```

### ❌ Antipadrão 2: Tipos de entidade compartilhados

```typescript
// brand/models/brand.ts
export const Brand = model.define("brand", { ... })

// product/models/product.ts
import { Brand } from "../brand/models/brand"  // ❌ WRONG!

export const Product = model.define("product", {
  id: model.id(),
  title: model.text(),
  brand: Brand,  // ❌ Direct entity reference!
})
```

**Correção**: Use links de módulo:

```typescript
// product/models/product.ts - NO brand reference
export const Product = model.define("product", {
  id: model.id(),
  title: model.text(),
  // No brand field! Relationship is in link layer
})

// links/brand-product.ts - Relationship defined separately
export default defineLink(
  { linkable: ProductModule.linkable.product, isList: true },
  BrandModule.linkable.brand
)
```

### ❌ Anti-padrão 3: Transações entre módulos

```typescript
// In Brand Module service
class BrandService extends MedusaService(Brand) {
  async createBrandWithProducts(brandData, productData) {
    const brand = await this.createBrands([brandData])

    // ❌ WRONG! Brand Module shouldn't know about Product Module
    const productService = this.container.resolve("product")
    const products = await productService.createProducts(productData)

    return { brand, products }
  }
}
```

**Correção**: Use o fluxo de trabalho para orquestrar:

```typescript
// In workflow (application layer)
export const createBrandWithProductsWorkflow = createWorkflow(
  "create-brand-with-products",
  function (input) {
    const brand = createBrandStep(input.brand)
    const products = createProductsStep(input.products)
    const links = linkProductsToBrandStep({
      brandId: brand.id,
      productIds: products.map((p) => p.id),
    })

    return new WorkflowResponse({ brand, products, links })
  }
)
```

## Exemplo prático: Pedido com requisitos de marca personalizados

Cenário: Ao ser feito um pedido, é necessário verificar se todos os produtos são de marcas aprovadas.

### ❌ Abordagem INCORRETA — Violação do isolamento do módulo

```typescript
// In Order Module (❌ WRONG!)
import { BrandService } from "../brand/service"

class OrderService extends MedusaService(Order) {
  async createOrder(data) {
    const brandService = new BrandService()  // ❌ Direct dependency!

    for (const item of data.items) {
      const product = await this.getProduct(item.product_id)
      const brand = await brandService.getBrand(product.brand_id)

      if (!brand.is_approved) {
        throw new Error("Brand not approved")
      }
    }

    return this.createOrders([data])
  }
}
```

**Problemas**:

- ❌ O Módulo de Pedidos depende do Módulo de Marcas
- ❌ O Módulo de Pedidos depende do Módulo de Produtos
- ❌ Não é possível testar o Módulo de Pedidos sem o Módulo de Marcas
- ❌ Não é possível extrair o Módulo de Pedidos para um pacote separado

### ✅ Abordagem CORRETA — Mantendo o isolamento dos módulos

```typescript
// In workflow (application layer)
const validateBrandApprovalStep = createStep(
  "validate-brand-approval",
  async (input, { container }) => {
    const query = container.resolve("query")

    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "brand.*"],
      filters: { id: input.productIds },
    })

    for (const product of products) {
      if (product.brand && !product.brand.is_approved) {
        throw new Error(`Brand ${product.brand.name} is not approved`)
      }
    }

    return new StepResponse(true)
  }
)

export const createOrderWorkflow = createWorkflow(
  "create-order",
  function (input) {
    const productIds = input.items.map((item) => item.product_id)

    // Step 1: Validate brand approval
    validateBrandApprovalStep({ productIds })

    // Step 2: Create order (Order Module isolated)
    const order = createOrderStep(input)

    return new WorkflowResponse(order)
  }
)
```

**Benefícios**:

- ✅ O Módulo de Pedidos permanece isolado
- ✅ A validação da marca ocorre no fluxo de trabalho (camada de aplicação)
- ✅ Cada módulo pode ser testado de forma independente
- ✅ Os módulos podem ser extraídos para pacotes separados

## Resumo

O isolamento dos módulos é fundamental para a construção de aplicações Medusa escaláveis e fáceis de manter:

**Princípios-chave**:

- ✅ Os módulos NUNCA importam de outros módulos
- ✅ Use a camada de links para relações
- ✅ Use a camada de consultas para leituras entre módulos
- ✅ Use ganchos de fluxo de trabalho para gravações entre módulos
- ✅ Mantenha a lógica de negócios nos fluxos de trabalho, não nos módulos

**Benefícios**:

- ✅ Ausência de dependências circulares
- ✅ Desenvolvimento e testes independentes
- ✅ Extração e reutilização de módulos
- ✅ Controle de versões e atualizações independentes

**Lembre-se**: o isolamento é um recurso, não uma limitação. Ele permite escalabilidade, testabilidade e facilidade de manutenção, em troca de um pouco mais de indireção.
