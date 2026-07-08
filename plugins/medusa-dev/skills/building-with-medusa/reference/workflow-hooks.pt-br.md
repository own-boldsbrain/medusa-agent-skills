# Ganchos de fluxo de trabalho (Avançado)

Os ganchos de fluxo de trabalho permitem inserir lógica personalizada em fluxos de trabalho existentes do Medusa sem precisar recriá-los. Use-os para ampliar os fluxos básicos de comércio.

**Observação:** Os ganchos são executados em banda (sincronicamente dentro do fluxo de trabalho). Se sua tarefa puder ser executada em segundo plano, use um assinante para obter melhor desempenho.

## Padrão básico de gancho

```typescript
// src/workflows/hooks/product-created.ts
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"

createProductsWorkflow.hooks.productsCreated(
  // Hook handler
  async ({ products, additional_data }, { container }) => {
    if (!additional_data?.brand_id) {
      return new StepResponse([], [])
    }

    const link = container.resolve("link")

    // Link products to brand
    const linkData = products.map((product) => ({
      product: { product_id: product.id },
      brand: { brand_id: additional_data.brand_id },
    }))

    await link.create(linkData)
    return new StepResponse(linkData, linkData)
  },
  // Compensation (runs if workflow fails after this point)
  async (linkData, { container }) => {
    const link = container.resolve("link")
    await link.dismiss(linkData)
  }
)
```

## Ganchos comuns de fluxo de trabalho

- `createProductsWorkflow.hooks.productsCreated` - Após a criação dos produtos
- `createOrderWorkflow.hooks.orderCreated` - Após a criação de um pedido
- Consulte o MedusaDocs para obter informações sobre ganchos específicos de fluxo de trabalho e seus parâmetros de entrada

## Quando usar ganchos em vez de assinantes

**Use ganchos de fluxo de trabalho quando:**

- A lógica precisar ser concluída antes que o fluxo de trabalho termine
- Você precisar de recursos de reversão/compensação
- A operação for crítica para o sucesso do fluxo de trabalho

**Use assinantes quando:**

- A lógica puder ser executada de forma assíncrona em segundo plano
- Não é necessário bloquear o fluxo de trabalho principal
- É necessário um melhor desempenho (os hooks são síncronos)

## Melhores práticas para hooks

1. **Retorne StepResponse**: Sempre envolva seu valor de retorno
2. **Implemente compensação**: Forneça uma lógica de reversão para a função de compensação
3. **Lide com dados ausentes de maneira adequada**: Verifique se há dados opcionais e retorne antecipadamente caso eles não estejam presentes
4. **Mantenha os hooks leves**: Para operações pesadas, considere usar assinantes em vez disso
