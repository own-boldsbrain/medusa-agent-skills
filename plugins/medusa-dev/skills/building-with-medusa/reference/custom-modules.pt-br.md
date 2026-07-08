# Módulos personalizados

## Índice

- [Quando criar um módulo personalizado](#quando-criar-um-modulo-personalizado)
- [Estrutura do módulo](#estrutura-do-modulo)
- [Criação de um módulo personalizado — Lista de verificação da implementação](#criacao-de-um-modulo-personalizado-lista-de-verificacao-para-implementacao)
- [Etapa 1: Criar o modelo de dados](#etapa-1-criar-o-modelo-de-dados)
- [Etapa 2: Criar o serviço](#etapa-2-criar-o-servico)
- [Etapa 3: Exportar a definição do módulo](#etapa-3-exportar-a-definicao-do-modulo)
- [Etapa 4: Registrar na configuração](#etapa-4-registrar-na-configuracao)
- [Etapas 5-6: Gerar e executar migrações](#etapas-5-6-gerar-e-executar-migracoes)
- [Resolução de serviços a partir do contêiner](#resolucao-de-servicos-a-partir-do-conteiner)
- [Métodos CRUD gerados automaticamente](#metodos-crud-gerados-automaticamente)
- [Carregadores](#carregadores)

Um módulo é um pacote reutilizável de funcionalidades relacionadas a um único domínio ou integração. Os módulos contêm modelos de dados (tabelas de banco de dados) e uma classe de serviço que fornece métodos para gerenciá-los.

## Quando criar um módulo personalizado

- **Novos conceitos de domínio**: marcas, listas de desejos, avaliações, pontos de fidelidade
- **Integrações com terceiros**: ERPs, CMSs, serviços personalizados
- **Lógica de negócios isolada**: Recursos que não se encaixam nos módulos de comércio existentes

## Estrutura do módulo

```
src/modules/blog/
├── models/
│   └── post.ts          # Data model definitions
├── service.ts           # Main service class
└── index.ts             # Module definition export
```

## Criação de um módulo personalizado – Lista de verificação para implementação

**IMPORTANTE PARA O CLAUDE CODE**: Ao implementar módulos personalizados, use a ferramenta TodoWrite para acompanhar seu progresso ao longo dessas etapas. Isso garante que você não perca nenhuma etapa crítica (especialmente as migrações!) e oferece visibilidade ao usuário.

Crie estas tarefas na sua lista de afazeres:

- Criar modelo de dados em src/modules/[nome]/models/
- Criar serviço que estenda MedusaService
- Exportar a definição do módulo em index.ts
- **CRÍTICO: Registrar o módulo em medusa-config.ts** (faça isso antes de usar o módulo)
- **CRÍTICO: Gere migrações: npx medusa db:generate [nome-do-módulo]** (Nunca pule essa etapa!)
- **CRÍTICO: Execute as migrações: npx medusa db:migrate** (Nunca pule essa etapa!)
- Use o serviço do módulo nas rotas/fluxos de trabalho da API
- **CRÍTICO: Execute a compilação para validar a implementação** (detecta erros de tipo e outros problemas)

## Etapa 1: Criar o modelo de dados

```typescript
// src/modules/blog/models/post.ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text().nullable(),
  published: model.boolean().default(false),
})

// note models automatically get created_at, updated_at and deleted_at added - don't add these explicitly

export default Post
```

**Referência do modelo de dados**: Consulte [data-models.md](data-models.md)

## Etapa 2: Criar o serviço

```typescript
// src/modules/blog/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({
  Post,
}) {}

export default BlogModuleService
```

O serviço estende `MedusaService`, que gera automaticamente métodos CRUD para cada modelo de dados.

## Etapa 3: Exportar a definição do módulo

```typescript
// src/modules/blog/index.ts
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
```

**⚠️ CRÍTICO - Formato do nome do módulo:**

- Os nomes dos módulos DEVEM estar em camelCase
- **NUNCA use traços (kebab-case)** nos nomes dos módulos
- ✅ CORRETO: `"blog"`, `"productReview"`, `"orderTracking"`
- ❌ INCORRETO: `"product-review"`, `"order-tracking"` (causará erros de execução)

**Exemplo de erro comum:**

```typescript
// ❌ WRONG - dashes will break the module
export const PRODUCT_REVIEW_MODULE = "product-review" // Don't do this!
export default Module("product-review", { service: ProductReviewService })

// ✅ CORRECT - use camelCase
export const PRODUCT_REVIEW_MODULE = "productReview"
export default Module("productReview", { service: ProductReviewService })
```

**Por que isso é importante:** A resolução interna de módulos do Medusa utiliza a sintaxe de acesso a propriedades (por exemplo, `container.resolve("productReview")`), e os traços interromperiam esse funcionamento.

## Etapa 4: Registrar na configuração

**IMPORTANTE**: É OBRIGATÓRIO registrar o módulo nas configurações ANTES de usá-lo em qualquer lugar ou gerar migrações.

```typescript
// medusa-config.ts
module.exports = defineConfig({
  // ...
  modules: [{ resolve: "./src/modules/blog" }],
})
```

## Etapas 5-6: Gerar e executar migrações

**⚠️ CRÍTICO – NÃO PULE**: Após criar um módulo e registrá-lo no medusa-config.ts, você DEVE executar DOIS comandos SEPARADOS. Sem essa etapa, as tabelas do banco de dados do módulo não existirão e você receberá erros de tempo de execução.

```bash
# Step 5: Generate migrations (creates migration files)
# Command format: npx medusa db:generate <module-name>
npx medusa db:generate blog

# Step 6: Run migrations (applies changes to database)
# This command takes NO arguments
npx medusa db:migrate
```

**⚠️ IMPORTANTE: São DOIS comandos distintos:**

- ✅ CORRETO: Execute `npx medusa db:generate blog` e, em seguida, `npx medusa db:migrate`
- ❌ INCORRETO: `npx medusa db:generate blog "create blog module"` (sem o parâmetro de descrição!)
- ❌ ERRADO: Combinar em um único comando

**Por que isso é importante:**

- As migrações criam as tabelas do banco de dados para os modelos de dados do seu módulo
- Sem as migrações, os métodos de serviço do módulo (createPosts, listPosts, etc.) falharão
- Você deve gerar as migrações ANTES de executá-las
- Essa etapa é OBRIGATÓRIA antes de usar o módulo em qualquer parte do seu código

**Erro comum:** Criar um módulo e tentar usá-lo imediatamente em um fluxo de trabalho ou rota de API sem executar as migrações primeiro. Sempre execute as migrações imediatamente após registrar o módulo.

## Resolução de serviços a partir do contêiner

Acesse o serviço do seu módulo em diferentes contextos:

```typescript
// In API routes
const blogService = req.scope.resolve("blog")
const post = await blogService.createPosts({ title: "Hello World" })

// In workflow steps
const blogService = container.resolve("blog")
const posts = await blogService.listPosts({ published: true })
```

O nome do módulo usado em `Module("blog", ...)` passa a ser a chave de resolução do contêiner.

## Métodos CRUD gerados automaticamente

O serviço gera automaticamente métodos para cada modelo de dados:

```typescript
// Create - pass object or array of objects
const post = await blogService.createPosts({ title: "Hello" })
const posts = await blogService.createPosts([
  { title: "One" },
  { title: "Two" },
])

// Retrieve - by ID, with optional select/relations
const post = await blogService.retrievePost("post_123")
const post = await blogService.retrievePost("post_123", {
  select: ["id", "title"],
})

// List - with filters and options
const posts = await blogService.listPosts()
const posts = await blogService.listPosts({ published: true })
const posts = await blogService.listPosts(
  { published: true }, // filters
  { take: 20, skip: 0, order: { created_at: "DESC" } } // options
)

// List with count - returns [records, totalCount]
const [posts, count] = await blogService.listAndCountPosts({ published: true })

// Update - by ID or with selector/data pattern
const post = await blogService.updatePosts({ id: "post_123", title: "Updated" })
const posts = await blogService.updatePosts({
  selector: { published: false },
  data: { published: true },
})

// Delete - by ID, array of IDs, or filter object
await blogService.deletePosts("post_123")
await blogService.deletePosts(["post_123", "post_456"])
await blogService.deletePosts({ published: false })

// Soft delete / restore
await blogService.softDeletePosts("post_123")
await blogService.restorePosts("post_123")
```

## Carregadores

Os carregadores são executados quando o aplicativo Medusa é iniciado. Use-os para inicializar conexões, preencher dados iniciais (relevantes para o módulo) ou registrar recursos.

```typescript
// src/modules/blog/loaders/hello-world.ts
import { LoaderOptions } from "@medusajs/framework/types"

export default async function helloWorldLoader({ container }: LoaderOptions) {
  const logger = container.resolve("logger")
  logger.info("[BLOG MODULE] Started!")
}

// Export in module definition (src/modules/blog/index.ts)
import helloWorldLoader from "./loaders/hello-world"

export default Module("blog", {
  service: BlogModuleService,
  loaders: [helloWorldLoader],
})
```
