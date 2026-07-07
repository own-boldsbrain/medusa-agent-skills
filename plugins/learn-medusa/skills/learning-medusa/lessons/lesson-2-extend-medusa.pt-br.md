# Lição 2: Ampliar os recursos principais do Medusa

## Objetivos de aprendizagem

Ao final desta lição, você será capaz de:

- **Vincular** marcas a produtos usando os links de módulos
- **Ampliar** os fluxos de trabalho principais usando os ganchos de fluxo de trabalho
- **Configurar** o `additional_data` para parâmetros personalizados
- **Consultar** registros vinculados entre módulos usando a consulta

**Tempo**: 45 a 60 minutos

**Pré-requisitos**: Ter concluído a Lição 1 (Módulo de Marcas, createBrandWorkflow, POST /admin/brands)

## O que estamos construindo

Na Lição 1, você criou um sistema de marcas. Agora, vamos integrá-lo ao Módulo de Produtos principal do Medusa:

**Novos recursos**:

- Associar uma marca a um produto ao criá-lo
- Recuperar um produto com os detalhes da marca
- Listar todas as marcas com seus produtos associados
- Manter o isolamento dos módulos (sem dependências diretas!)

**Ao final**, você será capaz de:

```bash
# Create product with brand
curl -X POST 'http://localhost:9000/admin/products' \
  --data '{
    "title": "Acme Widget",
    "additional_data": { "brand_id": "brand_123" }
  }'

# Get product with brand
curl 'http://localhost:9000/admin/products/prod_123?fields=+brand.*'

# Get brand with products
curl 'http://localhost:9000/admin/brands/brand_123'
```

---

## Visão geral da arquitetura: ampliar sem causar conflitos

### O desafio

Você deseja adicionar marcas aos produtos. Em outras plataformas, você poderia:

```typescript
// ❌ Anti-pattern: Modify core Product Module
// src/modules/product/models/product.ts (DON'T DO THIS!)
export const Product = model.define("product", {
  id: model.id().primaryKey(),
  title: model.text(),
  brand_id: model.text(), // Adding this breaks module isolation!
})
```

**Problemas**:

- Os módulos principais não devem ter conhecimento dos módulos personalizados
- Deixa de funcionar quando o Medusa é atualizado
- Não é possível reutilizar o Módulo de Marca em outros lugares
- Viola o princípio da responsabilidade única

### A solução do Medusa

O Medusa oferece três ferramentas para ampliar os recursos principais com segurança:

1. **Links de módulos**: conectam modelos de dados entre módulos, mantendo o isolamento
2. **Ganchos de fluxo de trabalho**: inserem lógica personalizada nos fluxos de trabalho principais
3. **Dados adicionais**: passam parâmetros personalizados pelas rotas da API principal

```
┌─────────────────────────────────────────────────┐
│  Product Module (Core)                          │
│  - Knows nothing about brands                   │
│  - Remains reusable and isolated                │
└─────────────────────────────────────────────────┘
                     ↕ (Module Link)
┌─────────────────────────────────────────────────┐
│  Brand Module (Custom)                          │
│  - Knows nothing about products                 │
│  - Remains reusable and isolated                │
└─────────────────────────────────────────────────┘

        Both connected, both isolated!
```

**Documentação**: [Links entre módulos](https://docs.medusajs.com/learn/fundamentals/module-links) | [Ganchos de fluxo de trabalho](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks) | [Dados adicionais](https://docs.medusajs.com/learn/fundamentals/api-routes/additional-data)

---

## Parte 1: Definir um link entre módulos

### O que é um link entre módulos?

Um **link de módulo** cria uma relação entre modelos de dados de módulos diferentes, mantendo o isolamento entre os módulos.

**Principais propriedades**:

- Nenhum dos módulos importa dados do outro
- O link é gerenciado separadamente em `src/links/`
- Ambos os módulos continuam reutilizáveis
- A relação é definida de forma declarativa

**Pense nisso como uma tabela de junção**:

- Em SQL: uma tabela `product_brand` com as colunas `product_id` e `brand_id`
- No Medusa: uma definição de link que cria isso automaticamente

**Documentação**: [Guia de Links de Módulos](https://docs.medusajs.com/learn/fundamentals/module-links)

### Etapa 2.1: Definir o link

Crie `src/links/product-brand.ts`:

```typescript
import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  BrandModule.linkable.brand
)
```

**Vamos explicar isso**:

**1. Importar definições de módulos**:

```typescript
import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
```

- Módulos personalizados: importam de `../modules/[nome]`
- Módulos principais: importam de `@medusajs/medusa/[nome-do-módulo]`

**2. Acessar a propriedade `linkable`**:

```typescript
ProductModule.linkable.product
BrandModule.linkable.brand
```

- Cada módulo exporta uma propriedade `linkable`
- Contém configurações de link para cada modelo de dados
- O nome da propriedade é o nome do modelo em snake-case

**3. Defina o link**:

```typescript
defineLink(
  { linkable: ProductModule.linkable.product, isList: true },
  BrandModule.linkable.brand
)
```

**Parâmetros**:

- Primeiro: Produto (com `isList: true` — vários produtos por marca)
- Segundo: Marca

**A propriedade `isList`**:

```
Brand ─── (1 to many) ─── Products

One brand can have many products: isList: true for Product
Each product has one brand: isList: false (default) for Brand
```

**A ordem é importante!** A ordem de configuração dos links afeta a forma como você criará links posteriormente.

### Etapa 2.2: Sincronizar o link com o banco de dados

Os links dos módulos são armazenados em uma tabela do banco de dados. Execute:

```bash
npx medusa db:migrate
```

Isso:

- Cria uma tabela `link_product_brand` (ou similar)
- Armazena as relações entre os IDs dos produtos e os IDs das marcas
- Permite consultas entre módulos

---

## Ponto de verificação 2.1: Verificar o link do módulo

### Perguntas de verificação

1. **Por que usar links de módulo em vez de adicionar `brand_id` ao modelo de produto?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   Os links de módulo mantêm o isolamento — o módulo de produto não tem conhecimento das marcas, e o módulo de marca não tem conhecimento dos produtos. Ambos permanecem reutilizáveis.
   </details>

2. **O que significa `isList: true`?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   Muitos registros desse modelo podem ser vinculados a outro modelo. Uma marca pode ter muitos produtos.
   </details>

3. **O que acontece se você esquecer de executar as migrações?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   A tabela de ligação não existirá, portanto, a criação de ligações falhará.
   </details>

### Verificação da implementação

1. **Verifique se as migrações foram bem-sucedidas**:

   ```bash
   npx medusa db:migrate
   ```

   Esperado: A migração é executada com sucesso

2. **Verifique se a compilação foi bem-sucedida**:

   ```bash
   npm run build
   ```

3. **Mostre-me seu arquivo**:
   - `src/links/product-brand.ts`

### Problemas comuns

**“Link não encontrado”**

- Verifique se o arquivo está no diretório `src/links/`
- Verifique se os caminhos de importação estão corretos

**“Falha na migração”**

- Verifique se o banco de dados está em execução
- Analise a saída da migração em busca de erros

### Lista de verificação de testes

- [ ] Arquivo de link criado em `src/links/`
- [ ] Migrações executadas com sucesso
- [ ] Compilação bem-sucedida

---

## Parte 2: Ampliar o fluxo de trabalho de criação de produto

### O que são ganchos de fluxo de trabalho?

**Ganchos de fluxo de trabalho** são pontos predefinidos nos fluxos de trabalho principais onde você pode inserir lógica personalizada.

**Exemplo**: O `createProductsWorkflow` do Medusa possui os seguintes ganchos:

- `productsCreated` — é executado após a criação dos produtos
- `productsUpdated` — é executado após a atualização dos produtos
- `productsDeleted` — é executado após a exclusão dos produtos

Você pode “consumir” (ouvir) esses hooks e realizar ações personalizadas.

**Por que usar hooks?**

- Amplie os fluxos de trabalho principais sem modificá-los
- Mantenha as personalizações separadas e fáceis de manter
- Os fluxos de trabalho continuam sendo atualizáveis

**Documentação**: [Guia de Hooks de Fluxo de Trabalho](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks)

### Etapa 2.2: Utilizar o gancho `productsCreated`

Quando um produto é criado, queremos vinculá-lo a uma marca (caso o `brand_id` tenha sido fornecido).

Crie `src/workflows/hooks/created-product.ts`:

```typescript
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { LinkDefinition } from "@medusajs/framework/types"
import { BRAND_MODULE } from "../../modules/brand"
import BrandModuleService from "../../modules/brand/service"

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    if (!additional_data?.brand_id) {
      return new StepResponse([], [])
    }

    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    // Verify brand exists (throws error if not)
    await brandModuleService.retrieveBrand(additional_data.brand_id as string)

    // Create links between products and brand
    const link = container.resolve("link")
    const links: LinkDefinition[] = []

    for (const product of products) {
      links.push({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [BRAND_MODULE]: {
          brand_id: additional_data.brand_id,
        },
      })
    }

    await link.create(links)

    return new StepResponse(links, links)
  },
  async (links, { container }) => {
    if (!links?.length) {
      return
    }

    const link = container.resolve("link")
    await link.dismiss(links)
  }
)
```

**Vamos analisar isso**:

**1. Consumo do hook**:

```typescript
createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => { ... },
  async (links, { container }) => { ... }
)
```

- Primeiro parâmetro: função step do hook
- Segundo parâmetro: função de compensação (para reversão)

**2. Entrada do hook**:

```typescript
{ products, additional_data }
```

- `products`: matriz de produtos criados (a partir do fluxo de trabalho)
- `additional_data`: Dados personalizados do corpo da solicitação da API

**3. Verificar se a marca existe**:

```typescript
await brandModuleService.retrieveBrand(additional_data.brand_id)
```

- Gera um erro se a marca não existir
- Impede a criação de links para marcas inexistentes

**4. Criar links**:

```typescript
const link = container.resolve("link")
const links = [{
  [Modules.PRODUCT]: { product_id: product.id },
  [BRAND_MODULE]: { brand_id: additional_data.brand_id },
}]
await link.create(links)
```

**Estrutura do objeto de link**:

- Chaves: nomes dos módulos (na ordem definida em `defineLink`)
- Valores: Objetos com propriedades `{model}_id`

**A ordem é importante!** Deve corresponder à ordem em `defineLink`:

```typescript
// In defineLink:
defineLink(ProductModule.linkable.product, BrandModule.linkable.brand)

// In link.create:
{
  [Modules.PRODUCT]: { product_id: "..." },  // First
  [BRAND_MODULE]: { brand_id: "..." },       // Second
}
```

**5. Função de compensação**:

```typescript
async (links, { container }) => {
  const link = container.resolve("link")
  await link.dismiss(links)
}
```

- Remove links caso ocorra um erro posteriormente
- Mantém a consistência dos dados

**Documentação**: [Consumo de Hooks](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks) | [Criação de Links](https://docs.medusajs.com/learn/fundamentals/module-links/link)

### Etapa 2.3: Configurar additional_data

Para passar o `brand_id` pela rota da API de criação de produto, configure a validação de `additional_data`.

Atualize ou crie o arquivo `src/api/middlewares.ts`:

```typescript
import {
  defineMiddlewares,
  validateAndTransformBody, // If already importing
} from "@medusajs/framework/http"
import { z } from "zod"

export default defineMiddlewares({
  routes: [
    // ... existing routes ...
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        brand_id: z.string().optional(),
      },
    },
  ],
})
```

**O que está acontecendo?**

**`additionalDataValidator`**:

- Configura a validação do parâmetro `additional_data` no corpo da solicitação
- Utiliza esquemas Zod para cada propriedade
- As propriedades são passadas para os ganchos do fluxo de trabalho

**Por que é opcional?**

- Nem todos os produtos precisam de uma marca
- Permite criar produtos sem marcas

**Documentação**: [Validação de dados adicionais](https://docs.medusajs.com/learn/fundamentals/api-routes/additional-data)

---

## Ponto de verificação 2.2: Teste a criação de um produto com marca

### Perguntas de verificação

1. **Por que verificar se a marca existe antes de criar o link?**
   <details>
   <summary>Clique para ver a resposta</summary>
   Evita a criação de links para marcas inexistentes. Se a marca não existir, o erro é detectado antecipadamente e o fluxo de trabalho reverte a criação do produto.
   </details>

2. **O que acontece se você não adicionar uma função de compensação ao hook?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   Se ocorrer um erro após a vinculação, os links não serão removidos — você terá links órfãos no banco de dados.
   </details>

3. **Por que `brand_id` é opcional no additionalDataValidator?**
   <details>
   <summary>Clique para ver a resposta</summary>
   Nem todos os produtos precisam de uma marca. Torná-lo opcional permite maior flexibilidade.
   </details>

### Verificação da implementação

1. **A compilação é bem-sucedida**:

   ```bash
   npm run build
   ```

2. **Mostre-me seus arquivos**:
   - `src/workflows/hooks/created-product.ts`
   - `src/api/middlewares.ts`

### Teste a criação de um produto com marca

**Passo 1: Crie uma marca** (caso ainda não tenha feito isso):

```bash
curl -X POST 'http://localhost:9000/admin/brands' \
  -H 'Authorization: Bearer {token}' \
  --data '{ "name": "Acme" }'
```

Salve o ID da marca a partir da resposta.

**Passo 2: Obter o ID do perfil de envio** (obrigatório para produtos):

```bash
curl 'http://localhost:9000/admin/shipping-profiles' \
  -H 'Authorization: Bearer {token}'
```

**Passo 3: Criar produto com a marca**:

```bash
curl -X POST 'http://localhost:9000/admin/products' \
  -H 'Authorization: Bearer {token}' \
  --data '{
    "title": "Acme Widget",
    "options": [
      { "title": "Default", "values": ["Default Value"] }
    ],
    "shipping_profile_id": "{shipping_profile_id}",
    "additional_data": {
      "brand_id": "{brand_id}"
    }
  }'
```

**Observação sobre preços**: Se você estiver adicionando preços às variantes do seu produto, lembre-se de que o Medusa armazena os preços exatamente como estão (não em centavos). Por exemplo, um produto de $19,99 deve ter `"amount": 19,99`, e não `1999`.

**Resultado esperado**: Produto criado com sucesso

**Verifique os logs**: Você deve ver “Marca vinculada aos produtos” ou algo semelhante

### Problemas comuns

**“Marca não encontrada”**

- O ID da marca está incorreto ou a marca não existe
- Crie a marca primeiro

**“Hook não está em execução”**

- Verifique se o arquivo está em `src/workflows/hooks/`
- Reinicie o servidor de desenvolvimento
- Verifique se há erros no TypeScript

**"additional_data inválido"**

- Verifique se `additionalDataValidator` está configurado corretamente
- Certifique-se de que `brand_id` seja uma string

### Lista de verificação de testes

- [ ] Produto criado com `brand_id` em `additional_data`
- [ ] Sem erros nos logs do servidor
- [ ] A criação do produto foi bem-sucedida

---

## Parte 3: Consultar registros vinculados

### Consulta com o parâmetro `fields`

As rotas da API principal do Medusa aceitam um parâmetro de consulta `fields` para recuperar dados vinculados.

**Obter produto com marca**:

```bash
curl 'http://localhost:9000/admin/products/{product_id}?fields=+brand.*' \
  -H 'Authorization: Bearer {token}'
```

**Resposta**:

```json
{
  "product": {
    "id": "prod_123",
    "title": "Acme Widget",
    "brand": {
      "id": "brand_123",
      "name": "Acme",
      "created_at": "...",
      "updated_at": "..."
    }
  }
}
```

**A sintaxe `+brand.*`**:

- `+` = Adicionar aos campos padrão (não substituir)
- `brand` = Nome do modelo vinculado (singular)
- `.*` = Todas as propriedades de brand

**Documentação**: [Guia de parâmetros de campos](https://docs.medusajs.com/api/store#select-fields-and-relations)

### Consultas com Query.graph()

Para rotas de API personalizadas, use **Query** para recuperar registros vinculados.

**Exemplo**: Crie um endpoint para obter marcas com seus produtos.

Atualize `src/api/admin/brands/route.ts`:

```typescript
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createBrandWorkflow } from "../../../workflows/create-brand"
import { PostAdminCreateBrandType } from "./validators"

// Keep existing POST handler...

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["*", "products.*"],
  })

  res.json({ brands })
}
```

**O que está acontecendo?**

**1. Resolver consulta**:

```typescript
const query = req.scope.resolve("query")
```

- A consulta é uma ferramenta do framework Medusa para consultas entre módulos
- Registrada no contêiner

**2. Consultar dados vinculados**:

```typescript
await query.graph({
  entity: "brand",
  fields: ["*", "products.*"],
})
```

**Parâmetros**:

- `entity`: Nome do modelo de dados (conforme definido em `model.define`)
- `fields`: Matriz de propriedades e relações a serem recuperadas
  - `"*"` = Todas as propriedades da marca
  - `"products.*"` = Todas as propriedades dos produtos vinculados (no plural!)

**Por que “produtos” (plural)?**
Porque as marcas estão vinculadas a uma lista de produtos (`isList: true` na definição do link).

**Documentação**: [Guia de Consultas](https://docs.medusajs.com/learn/fundamentals/module-links/query)

---

## Ponto de verificação 2.3: Teste de consultas

### Perguntas de verificação

1. **Por que usar `products.*` (plural) em vez de `product.*` (singular)?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   As marcas estão vinculadas a vários produtos (isList: true), portanto, o nome da propriedade está no plural.
   </details>

2. **Qual é a diferença entre o parâmetro `fields` e o Query.graph()?**
   <details>
   <summary>Clique para ver a resposta</summary>
   - Parâmetro `fields`: Use com rotas existentes da API Medusa
   - Query.graph(): Use em rotas personalizadas da API
   Ambos recuperam dados vinculados, mas em casos de uso diferentes.
   </details>

### Verificação da implementação

1. **A compilação foi bem-sucedida**:

   ```bash
   npm run build
   ```

2. **Mostre-me seu arquivo**:
   - `src/api/admin/brands/route.ts`

### Teste de consulta

**Teste 1: Obter produto com marca**:

```bash
curl 'http://localhost:9000/admin/products/{product_id}?fields=+brand.*' \
  -H 'Authorization: Bearer {token}'
```

**Esperado**: Produto com a propriedade `brand`

**Teste 2: Obter marcas com produtos**:

```bash
curl 'http://localhost:9000/admin/brands' \
  -H 'Authorization: Bearer {token}'
```

**Resposta esperada**:

```json
{
  "brands": [
    {
      "id": "brand_123",
      "name": "Acme",
      "products": [
        {
          "id": "prod_123",
          "title": "Acme Widget",
          ...
        }
      ]
    }
  ]
}
```

### Problemas comuns

**“Não é possível consultar produtos”**

- Verifique se o link está definido corretamente
- Certifique-se de que as migrações foram executadas
- Verifique se os produtos estão realmente vinculados à marca

**“Propriedade ‘marca’ ausente no produto”**

- Esqueceu de incluir `?fields=+brand.*` na consulta
- O link não foi criado quando o produto foi criado

### Lista de verificação de testes

- [ ] O produto foi recuperado com os detalhes da marca
- [ ] As marcas foram recuperadas com os produtos
- [ ] Ambas as consultas retornam os dados esperados

---

## Lição 2 concluída! 🎉

### O que você criou

Excelente trabalho! Você ampliou a funcionalidade principal do Medusa:

- ✅ **Link entre módulos**: Conectei marcas a produtos (mantendo o isolamento)
- ✅ **Ganchos de fluxo de trabalho**: Ampliei o createProductsWorkflow para vincular marcas
- ✅ **Dados adicionais**: Configurei a validação para parâmetros personalizados
- ✅ **Consulta**: Recuperação de dados vinculados entre módulos

### O que você aprendeu

**Vínculos entre módulos**:

- Crie relações sem comprometer o isolamento dos módulos
- Nenhum módulo depende do outro
- Os vínculos são gerenciados separadamente

**Ganchos de fluxo de trabalho**:

- Estenda os fluxos de trabalho principais sem modificá-los
- Inserir lógica personalizada em pontos predefinidos
- Incluir lógica de reversão para garantir a consistência dos dados

**Dados adicionais**:

- Passar parâmetros personalizados pelas rotas da API principal
- Validar com esquemas Zod
- Acessível em ganchos de fluxo de trabalho

**Consulta**:

- Recuperar dados entre módulos
- Usar o parâmetro `fields` nas rotas principais
- Usar Query.graph() em rotas personalizadas

### Reforço da arquitetura

**1. Por que não simplesmente adicionar a coluna `brand_id` à tabela de produtos?**

<details>
<summary>Resposta</summary>

**Problemas com a adição direta da coluna**:

```typescript
// ❌ This breaks module isolation
export const Product = model.define("product", {
  brand_id: model.text(),
})
```

- O Módulo de Produto agora tem conhecimento das marcas
- Não é possível reutilizar o Módulo de Marca em outros lugares
- Deixa de funcionar quando o Medusa atualiza o Módulo de Produto
- Viola o princípio da responsabilidade única

**Os links entre módulos resolvem isso**:

- Módulo de Produto: não tem conhecimento sobre marcas
- Módulo de Marca: não tem conhecimento sobre produtos
- Link: preocupação separada, fácil de manter
- Ambos os módulos permanecem reutilizáveis

</details>

**2. Como o `additional_data` chega ao gancho do fluxo de trabalho?**

<details>
<summary>Resposta</summary>

Fluxo:

1. O cliente envia a solicitação: `{ additional_data: { brand_id: "..." } }`
2. O middleware valida: `additionalDataValidator: { brand_id: z.string() }`
3. A rota da API executa o fluxo de trabalho
4. O fluxo de trabalho passa para os hooks: `{ products, additional_data }`
5. Seu hook processa: `if (additional_data?.brand_id) { ... }`

</details>

**3. O que acontece se a criação da marca falhar após a vinculação?**

<details>
<summary>Resposta</summary>

A função de compensação é executada:

```typescript
async (links, { container }) => {
  const link = container.resolve("link")
  await link.dismiss(links)  // Removes the links
}
```

Isso garante que não haja links órfãos.
</details>

### Envie seu trabalho

```bash
git add .
git commit -m "Complete Lesson 2: Module Links, Workflow Hooks, and Query"
```

---

## Pronto para a Lição 3?

Na **Lição 3: Personalizar o painel de administração**, você aprenderá a:

- **Criar widgets** para exibir a marca na página de detalhes do produto
- **Criar rotas da interface do usuário** para gerenciar marcas
- **Usar o React Query** para buscar dados
- **Integrar componentes do Medusa UI**

Você criará:

- Um widget que exibe o nome da marca nas páginas de produtos
- Uma página de gerenciamento de marcas com uma tabela de dados
- Operações CRUD completas no painel de administração

**Documentação**: [Widgets de administração](https://docs.medusajs.com/learn/fundamentals/admin/widgets) | [Rotas da interface de usuário de administração](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes) | [Componentes da interface de usuário do Medusa](https://docs.medusajs.com/ui)

Quando estiver pronto, me avise e vamos começar a Lição 3!
