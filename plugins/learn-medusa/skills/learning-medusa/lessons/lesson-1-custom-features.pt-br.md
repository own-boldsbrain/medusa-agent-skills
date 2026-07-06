# Lição 1: Criar recursos personalizados com o Medusa

## Objetivos de aprendizagem

Ao final desta lição, você será capaz de:

- **Compreender** a arquitetura Módulo → Fluxo de trabalho → Rota de API
- **Criar** um Módulo de Marca com modelo de dados e serviço
- **Implementar** o createBrandWorkflow com lógica de reversão
- **Expor** a rota de API POST /admin/brands com validação
- **Testar** seu recurso personalizado usando o cURL

**Tempo**: 45 a 60 minutos

## Visão geral da arquitetura: o padrão de três camadas

Antes de começarmos a programar, vamos entender **por que** o Medusa usa essa arquitetura em camadas.

### O Padrão

Cada recurso personalizado no Medusa segue este fluxo:

```bash
┌─────────────────────────────────────────────────┐
│  API Route (HTTP Interface)                     │
│  - Accepts requests                             │
│  - Validates input                              │
│  - Executes workflow                            │
│  - Returns response                             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Workflow (Business Logic Orchestration)        │
│  - Coordinates steps                            │
│  - Handles rollback                             │
│  - Manages transactions                         │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Module (Data Layer)                            │
│  - Defines data models                          │
│  - Provides CRUD operations                     │
│  - Isolated from other modules                  │
└─────────────────────────────────────────────────┘
```

### Por que esse padrão?

**Separação de interesses**: Cada camada tem uma única responsabilidade

- As rotas da API lidam com questões relacionadas a HTTP (validação, serialização)
- Os fluxos de trabalho lidam com a lógica de negócios (orquestração, reversão)
- Os módulos lidam com os dados (CRUD, banco de dados)

**Reutilização**: Os fluxos de trabalho podem ser chamados a partir de:

- Várias rotas de API
- Outros fluxos de trabalho
- Tarefas agendadas
- Assinantes de eventos

**Testabilidade**: Cada camada pode ser testada de forma independente

**Consistência**: Todos os recursos seguem o mesmo padrão

**Documentação**: [Saiba mais sobre a Arquitetura Medusa](https://docs.medusajs.com/learn/introduction/architecture)

---

## O que estamos desenvolvendo

Nesta lição, vamos desenvolver um recurso de marcas que permita aos usuários administradores criar marcas por meio de um endpoint de API.

**Recursos**:

- Criar uma tabela `brand` no banco de dados
- Fornecer métodos para gerenciar marcas (criar, recuperar, atualizar, excluir)
- Expor o endpoint POST /admin/brands para criar marcas
- Incluir validação e tratamento de erros
- Adicionar lógica de reversão caso ocorram erros

**Ao final**, você será capaz de:

```bash
curl -X POST 'http://localhost:9000/admin/brands' \
  -H 'Authorization: Bearer {token}' \
  --data '{ "name": "Acme" }'
```

E você receberá:

```json
{
  "brand": {
    "id": "brand_123",
    "name": "Acme",
    "created_at": "2024-01-16T...",
    "updated_at": "2024-01-16T..."
  }
}
```

Vamos começar!

---

## Parte 1: Criar o Módulo de Marca

### O que é um Módulo?

Um **módulo** é um pacote reutilizável de funcionalidades para um único domínio. Pense nele como um miniaplicativo dentro do Medusa que:

- Define modelos de dados (tabelas no banco de dados)
- Oferece um serviço com métodos CRUD
- Está isolado de outros módulos (sem dependências diretas)

O Medusa vem com módulos integrados, como:

- **Módulo de Produtos**: gerencia produtos, variantes e opções
- **Módulo de Carrinho**: gerencia carrinhos de compras
- **Módulo de Clientes**: gerencia clientes

Estamos criando um **Módulo de Marcas** para gerenciar marcas.

**Documentação**: [Guia de Módulos](https://docs.medusajs.com/learn/fundamentals/modules)

### Etapa 1.1: Criar o diretório do módulo

Crie a estrutura de diretórios para o Módulo de Marca:

```bash
mkdir -p src/modules/brand/models
```

**Por que essa estrutura?**

- Os módulos DEVEM estar em `src/modules/`
- Os modelos de dados DEVEM estar no subdiretório `models/`
- O Medusa detecta automaticamente os módulos nessa estrutura

### Etapa 1.2: Criar o modelo de dados “Brand”

Um **modelo de dados** representa uma tabela no banco de dados. Usamos a Linguagem de Modelagem de Dados (DML) do Medusa para defini-lo.

Crie `src/modules/brand/models/brand.ts`:

```typescript
import { model } from "@medusajs/framework/utils"

export const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
})
```

**Vamos analisar isso**:

1. **`model.define("brand", { ... })`**:
   - Primeiro argumento: nome da tabela no banco de dados (use snake-case)
   - Segundo argumento: definição do esquema (colunas)

2. **`id: model.id().primaryKey()`**:
   - Cria uma coluna de chave primária
   - Gera automaticamente IDs exclusivos

3. **`name: model.text()`**:
   - Cria uma coluna de texto para o nome da marca

**E quanto aos carimbos de data/hora?**
O Medusa adiciona automaticamente as colunas `created_at`, `updated_at` e `deleted_at`!

**E quanto ao `linkable()`?**
Não adicione `.linkable()` manualmente — o Medusa já o adiciona automaticamente. Esse é um erro comum!

**Documentação**: [Guia de Modelos de Dados](https://docs.medusajs.com/learn/fundamentals/data-models)

### Etapa 1.3: Criar o serviço do módulo

O **serviço** é a interface para a funcionalidade do seu módulo. Ele fornece métodos para gerenciar seus modelos de dados.

Crie o arquivo `src/modules/brand/service.ts`:

```typescript
import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"

class BrandModuleService extends MedusaService({
  Brand,
}) {
  // Methods are auto-generated! No code needed here.
}

export default BrandModuleService
```

**O que está acontecendo aqui?**

`MedusaService({ Brand })` **gera** esses métodos automaticamente:

- `createBrands(data)` - Cria uma ou mais marcas
- `retrieveBrand(id, config)` - Recupera uma marca pelo ID
- `listBrands(filters, config)` - Lista marcas com filtros
- `updateBrands(id, data)` - Atualiza uma marca
- `deleteBrands(id)` - Exclui uma marca
- `softDeleteBrands(id)` - Exclusão temporária (define o campo `deleted_at`)
- `restoreBrands(id)` - Restaura uma marca excluída temporariamente
- `listAndCountBrands(filters, config)` - Lista as marcas com a contagem total

Você tem acesso a tudo isso de graça!

**É possível adicionar métodos personalizados?**
Sim! Adicione-os dentro do corpo da classe. Mas, para operações CRUD básicas, os métodos gerados são suficientes.

**Documentação**: [Referência da Service Factory](https://docs.medusajs.com/resources/service-factory-reference)

### Etapa 1.4: Exportar a definição do módulo

Cada módulo deve exportar uma definição que informe ao Medusa:

- O nome do módulo
- O serviço principal do módulo

Crie o arquivo `src/modules/brand/index.ts`:

```typescript
import { Module } from "@medusajs/framework/utils"
import BrandModuleService from "./service"

export const BRAND_MODULE = "brand"

export default Module(BRAND_MODULE, {
  service: BrandModuleService,
})
```

**Pontos-chave**:

1. **O nome do módulo DEVE estar em camelCase**: "brand" ✓, "brand-module" ✗
   - O uso de traços causará erros de tempo de execução!

2. **Exporte a constante `BRAND_MODULE`**: facilita a referência confiável em outros locais

3. **`Module()` cria a definição**: registra o serviço no Medusa

### Etapa 1.5: Registrar o módulo na configuração

O Medusa precisa saber sobre o seu módulo personalizado. Adicione-o ao `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  // ... existing config
  modules: [
    {
      resolve: "./src/modules/brand",
    },
  ],
})
```

**E se eu já tiver uma matriz de módulos?**
Adicione seu módulo à matriz existente:

```typescript
modules: [
  {
    resolve: "./src/modules/existing",
  },
  {
    resolve: "./src/modules/brand", // Add this
  },
],
```

### Etapa 1.6: Gerar e executar migrações

Uma **migração** é um arquivo que define alterações no banco de dados. Ela garante que seu módulo seja reutilizável e facilita a colaboração em equipe.

Execute estes comandos:

```bash
npx medusa db:generate brand
npx medusa db:migrate
```

**O que esses comandos fazem?**

1. **`db:generate brand`**: Cria um arquivo de migração para o Módulo Brand
   - Analisa seus modelos de dados
   - Gera o código SQL para criar a tabela `brand`
   - Salva-o em `src/migrations/`

2. **`db:migrate`**: Executa todas as migrações pendentes
   - Executa o SQL no seu banco de dados
   - Cria a tabela `brand` com as colunas: `id`, `name`, `created_at`, `updated_at`, `deleted_at`

**Documentação**: [Guia de Migrações](https://docs.medusajs.com/learn/fundamentals/data-models/write-migration)

---

## Ponto de verificação 1.1: Verificar a criação do módulo

Antes de prosseguir, vamos verificar se o módulo está funcionando.

### Perguntas de verificação

Responda a estas perguntas para testar sua compreensão:

1. **O que o `MedusaService()` faz?**
   > Ele gera métodos CRUD para seus modelos de dados automaticamente.

2. **Por que o nome do módulo é “brand” e não “brand-module”?**
   > Os nomes dos módulos devem estar em camelCase. Traços causam erros de resolução em tempo de execução.

3. **O que acontece se você esquecer de executar as migrações?**
   > A tabela `brand` não existirá no banco de dados, portanto, os métodos de serviço falharão.

### Verificação da implementação

Execute estes comandos e compartilhe o resultado:

1. **Verifique se as migrações foram bem-sucedidas**:

   ```bash
   npx medusa db:migrate
   ```

   Esperado: “Nenhuma migração pendente” ou “Migrações concluídas”

2. **Verifique se a compilação foi bem-sucedida**:

   ```bash
   npm run build
   ```

   Resultado esperado: Sem erros de TypeScript

3. **Mostre-me seus arquivos**:
   - `src/modules/brand/models/brand.ts`
   - `src/modules/brand/service.ts`
   - `src/modules/brand/index.ts`

### Problemas comuns

#### “Não é possível encontrar o módulo 'brand'”

- **Causa**: Módulo não registrado em `medusa-config.ts`
- **Solução**: Adicione `{ resolve: "./src/modules/brand" }` à matriz de módulos

#### “O nome do módulo deve estar em camelCase”

- **Causa**: Uso de traços no nome do módulo
- **Solução**: Use “brand” em vez de “brand-module” em `BRAND_MODULE`

#### “A tabela brand já existe”

- **Causa**: A migração já foi executada ou a tabela foi criada manualmente
- **Solução**: Exclua a tabela ou use um nome diferente

#### Erros de compilação

- Verifique se todas as importações estão corretas
- Certifique-se de que o TypeScript não encontre erros no seu código
- Compartilhe a mensagem de erro para obter ajuda na depuração

### Lista de verificação de testes

- [ ] A migração foi bem-sucedida, sem erros
- [ ] A compilação foi bem-sucedida (`npm run build`)
- [ ] O módulo foi registrado em `medusa-config.ts`
- [ ] O serviço é exportado corretamente

---

## Parte 2: Criar o fluxo de trabalho da marca

### O que é um fluxo de trabalho?

Um **fluxo de trabalho** coordena várias operações que precisam ser concluídas juntas. Se alguma operação falhar, o fluxo de trabalho reverte automaticamente todas as operações anteriores.

**Por que usar fluxos de trabalho?**

Imagine que você está criando uma marca E enviando seu logotipo para o S3:

**Sem fluxo de trabalho** (frágil):

```typescript
// Create brand
const brand = await brandService.createBrands({ name: "Acme" })

// Upload logo
await s3.upload(brand.id, logo) // What if this fails?
// Now you have a brand in DB but no logo!
// Manual cleanup required...
```

**Com fluxo de trabalho** (robusto):

```typescript
const workflow = createWorkflow("create-brand-with-logo", function (input) {
  const brand = createBrandStep(input)
  const upload = uploadLogoStep({ brandId: brand.id, logo: input.logo })
  return new WorkflowResponse(brand)
})

// If upload fails, workflow automatically:
// 1. Calls uploadLogoStep compensation (cleanup S3)
// 2. Calls createBrandStep compensation (delete brand)
// 3. Returns error
// No orphaned data!
```

**Principais benefícios**:

- **Reverta automática**: as funções de compensação revertem as alterações
- **Segurança da transação**: tudo ou nada
- **Lógica de repetição**: é possível repetir etapas que falharam
- **Componibilidade**: os fluxos de trabalho podem chamar outros fluxos de trabalho

**Documentação**: [Guia de fluxos de trabalho](https://docs.medusajs.com/learn/fundamentals/workflows)

### Etapa 2.1: Criar uma etapa de marca

Uma **etapa** é a unidade atômica de trabalho em um fluxo de trabalho. Cada etapa possui:

- Uma função de etapa (executa a ação)
- Uma função de compensação (desfaz a ação em caso de erro)

Crie o arquivo `src/workflows/steps/create-brand.ts`:

```typescript
import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type CreateBrandStepInput = {
  name: string
}

export const createBrandStep = createStep(
  "create-brand-step",
  async (input: CreateBrandStepInput, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    const brand = await brandModuleService.createBrands(input)

    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) {
      return
    }
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    await brandModuleService.deleteBrands(brandId)
  }
)
```

**Vamos analisar isso**:

**1. Função Step (2º parâmetro)**:

```typescript
async (input: CreateBrandStepInput, { container }) => {
  // Resolve the Brand Module service from Medusa container
  const brandModuleService = container.resolve(BRAND_MODULE)

  // Create the brand using the service
  const brand = await brandModuleService.createBrands(input)

  // Return StepResponse(data, compensationData)
  return new StepResponse(brand, brand.id)
}
```

- **`input`**: Dados passados para a função step
- **`container`**: Contêiner Medusa — registro de todos os serviços, módulos e ferramentas
- **`container.resolve()`**: Obtém um serviço registrado pelo nome
- **`StepResponse(data, compensationData)`**:
  - `data`: Devolvido ao fluxo de trabalho (o objeto da marca)
  - `compensationData`: Passado para a função de compensação (ID da marca)

**2. Função de compensação (3º parâmetro)**:

```typescript
async (brandId, { container }) => {
  if (!brandId) {
    return
  }
  const brandModuleService: BrandModuleService = container.resolve(
    BRAND_MODULE
  )

  await brandModuleService.deleteBrands(brandId)
}
```

- Recebe o `compensationData` do StepResponse (ID da marca)
- Desfaz o que a etapa realizou (exclui a marca)
- É chamado automaticamente caso ocorra um erro posteriormente no fluxo de trabalho

**Conceito-chave: O Contêiner Medusa**

O **contêiner Medusa** é um contêiner de injeção de dependências que contém:

- Módulos principais (Produto, Carrinho, Cliente, etc.)
- Módulos personalizados (Marca)
- Serviços (logger, banco de dados, etc.)
- Ferramentas da estrutura (Link, Query, etc.)

Você acessa esses elementos por meio de `container.resolve()`:

```typescript
const brandService = container.resolve("brand")
const logger = container.resolve("logger")
const link = container.resolve("link")
```

**Documentação**: [Etapas do fluxo de trabalho](https://docs.medusajs.com/learn/fundamentals/workflows#1-create-the-steps) | [Contêiner Medusa](https://docs.medusajs.com/learn/fundamentals/medusa-container)

### Etapa 2.2: Criar o fluxo de trabalho da marca

Agora, vamos integrar a etapa a um fluxo de trabalho:

Crie o fluxo de trabalho em `src/workflows/create-brand.ts`:

```typescript
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createBrandStep } from "./steps/create-brand.ts"

type CreateBrandWorkflowInput = {
  name: string
}

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  function (input: CreateBrandWorkflowInput) {
    const brand = createBrandStep(input)
    return new WorkflowResponse(brand)
  }
)
```

**IMPORTANTE: Regras do Construtor de Fluxo de Trabalho**

A função do construtor de fluxo de trabalho possui restrições rigorosas:

```typescript
// ✅ CORRECT
createWorkflow("name", function (input) {
  const result = myStep(input)  // No await!
  return new WorkflowResponse(result)
})

// ❌ WRONG - Will break!
createWorkflow("name", async function (input) {  // No async!
  const result = await myStep(input)       // No await!
  if (input.condition) { ... }             // No conditionals!
  return new WorkflowResponse(result)
})
```

**Por que essas regras?**

Os fluxos de trabalho são **declarativos**, não imperativos. A função construtora:

- É executada no **momento do carregamento**, não no momento da execução
- Define o **gráfico de etapas**, não a execução
- Não pode conter lógica de tempo de execução (condicionais, loops)

**Para lógica de tempo de execução, use**:

- `when()` - Execução condicional de etapas
- `transform()` - Transformação de dados
- `parallelize()` - Execução paralela

**Erro comum**: Usar `async` ou `await`

```typescript
// ❌ WRONG
const brand = await createBrandStep(input)  // No await!

// ✅ CORRECT
const brand = createBrandStep(input)  // Step returns immediately
```

**Documentação**: [Fluxos de trabalho](https://docs.medusajs.com/learn/fundamentals/workflows)

---

## Ponto de verificação 1.2: Verificar o fluxo de trabalho

### Questões de verificação

1. **Por que não é possível usar `await` no construtor do fluxo de trabalho?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   O construtor do fluxo de trabalho é executado no momento do carregamento para definir o gráfico de etapas, e não no momento da execução. As etapas são executadas posteriormente pelo mecanismo de fluxo de trabalho.
   </details>

2. **O que a função de compensação faz?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   Isso reverte o que a etapa realizou caso ocorra um erro posteriormente no fluxo de trabalho, mantendo a consistência dos dados.
   </details>

3. **Por que passar `brand.id` como segundo parâmetro para `StepResponse`?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   Esses dados são passados para a função de compensação para que ela saiba qual marca excluir caso seja necessário reverter a ação.
   </details>

### Verificação da implementação

1. **Verifique se a compilação foi bem-sucedida**:

   ```bash
   npm run build
   ```

   Esperado: Sem erros de TypeScript

2. **Mostre-me seu arquivo**:
   - `src/workflows/create-brand.ts`

### Problemas comuns

**"Função assíncrona não permitida"**

- **Causa**: Utilização da palavra-chave `async` no construtor do fluxo de trabalho
- **Solução**: Remova `async`:

  ```typescript
  // ❌ Wrong
  createWorkflow("name", async (input) => { ... })

  // ✅ Correct
  createWorkflow("name", function (input) { ... })
  ```

**"Não é possível usar `await`"**

- **Causa**: Uso de `await` para chamar uma etapa
- **Solução**: Remova `await`:

  ```typescript
  // ❌ Wrong
  const brand = await createBrandStep(input)

  // ✅ Correct
  const brand = createBrandStep(input)
  ```

**"Funções-seta não permitidas"**

- **Causa**: Utilizou-se função-seta no construtor do fluxo de trabalho
- **Solução**: Use a palavra-chave `function`:

  ```typescript
  // ❌ Wrong
  createWorkflow("name", (input) => { ... })

  // ✅ Correct
  createWorkflow("name", function (input) { ... })
  ```

### Lista de verificação de testes

- [ ] A compilação é bem-sucedida (`npm run build`)
- [ ] Sem erros de TypeScript
- [ ] O fluxo de trabalho usa `function`, e não função-seta
- [ ] Sem a palavra-chave `async` no construtor do fluxo de trabalho
- [ ] Sem `await` ao chamar etapas

---

## Parte 3: Criar a rota da API

### O que é uma rota da API?

Uma **rota da API** é um endpoint REST que expõe seus recursos aos clientes:

- Painel de administração
- Loja virtual
- Aplicativos móveis
- Integrações de terceiros

**Princípio fundamental**: as rotas são SIMPLES

- Validar a entrada
- Executar o fluxo de trabalho
- Retornar a resposta

**Toda a lógica de negócios deve estar nos fluxos de trabalho!**

**Documentação**: [Guia de rotas de API](https://docs.medusajs.com/learn/fundamentals/api-routes)

### Etapa 3.1: Criar o esquema de validação

Usamos o **Zod** para validar os corpos das solicitações. Crie o arquivo `src/api/admin/brands/validators.ts`:

```typescript
import { z } from "zod"

export const PostAdminCreateBrand = z.object({
  name: z.string(),
})

export type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateBrand>
```

**O que está acontecendo?**

- **Esquema Zod**: Define a estrutura esperada do corpo da solicitação
- **`z.string()`**: O nome deve ser uma string
- **`z.infer`**: Extrai o tipo do TypeScript a partir do esquema

**Por que um arquivo separado?**

- Mantém o arquivo de rotas organizado
- Torna os esquemas reutilizáveis
- Segue as convenções do Medusa

**Documentação**: [Guia de Validação da API](https://docs.medusajs.com/learn/fundamentals/api-routes/validation)

### Etapa 3.2: Criar a rota da API

O caminho da rota é determinado pela localização do arquivo. Para `/admin/brands`, crie o arquivo `src/api/admin/brands/route.ts`:

```typescript
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createBrandWorkflow } from "../../../workflows/create-brand"
import { PostAdminCreateBrandType } from "./validators"

export const POST = async (
  req: MedusaRequest<PostAdminCreateBrandType>,
  res: MedusaResponse
) => {
  const { result } = await createBrandWorkflow(req.scope)
    .run({
      input: req.validatedBody,
    })

  res.json({ brand: result })
}
```

**Vamos analisar isso**:

**1. Exportação do manipulador de rota**:

```typescript
export const POST = async (req, res) => { ... }
```

- Função de exportação com o nome do método HTTP (POST, GET, DELETE)
- O Medusa registra isso automaticamente como `POST /admin/brands`

**2. Tipo de solicitação**:

```typescript
req: MedusaRequest<PostAdminCreateBrandType>
```

- `MedusaRequest<T>`: objeto de solicitação com segurança de tipos
- `T` é o tipo do corpo validado
- Acesse o corpo validado por meio de `req.validatedBody`

**3. Executar fluxo de trabalho**:

```typescript
const { result } = await createBrandWorkflow(req.scope).run({
  input: req.validatedBody,
})
```

- `req.scope`: O contêiner Medusa
- `.run()`: Executa o fluxo de trabalho
- `input`: Dados passados para o fluxo de trabalho
- `result`: Dados retornados pelo fluxo de trabalho

**4. Resposta de retorno**:

```typescript
res.json({ brand: result })
```

- Retorna uma resposta JSON ao cliente

**Convenção de caminho**:

```
File path: src/api/admin/brands/route.ts
Route path: POST /admin/brands

File path: src/api/admin/brands/[id]/route.ts
Route path: POST /admin/brands/:id

File path: src/api/store/products/route.ts
Route path: GET /store/products
```

**Documentação**: [Parâmetros de rota](https://docs.medusajs.com/learn/fundamentals/api-routes/parameters)

### Etapa 3.3: Adicionar middleware de validação

**Middlewares** são funções executadas antes do manipulador de rota. Eles são úteis para:

- Validação
- Autenticação
- Análise personalizada

O Medusa fornece `validateAndTransformBody` para validar corpos de solicitação usando esquemas Zod.

Crie ou atualize `src/api/middlewares.ts`:

```typescript
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PostAdminCreateBrand } from "./admin/brands/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateBrand),
      ],
    },
  ],
})
```

**O que está acontecendo?**

**1. Definir middlewares**:

```typescript
export default defineMiddlewares({ routes: [...] })
```

- É necessário exportar o `default` do arquivo `src/api/middlewares.ts`
- O Medusa carrega automaticamente esse arquivo

**2. Configuração de rota**:

```typescript
{
  matcher: "/admin/brands",   // Route path
  method: "POST",              // HTTP method
  middlewares: [...]           // Middlewares to apply
}
```

**3. Middleware de validação**:

```typescript
validateAndTransformBody(PostAdminCreateBrand)
```

- Valida o corpo da solicitação em relação ao esquema Zod
- Retorna o erro 400 se a validação falhar
- Preenche `req.validatedBody` se a validação for bem-sucedida

**Erro comum**: Erro de digitação no nome do arquivo

- DEVE ser `middlewares.ts` (plural)
- NÃO é `middleware.ts` (singular)
- O erro de digitação faz com que o middleware seja ignorado silenciosamente!

**Documentação**: [Guia de Middlewares](https://docs.medusajs.com/learn/fundamentals/api-routes/middlewares) | [Middleware de Validação](https://docs.medusajs.com/learn/fundamentals/api-routes/validation)

---

## Ponto de verificação 1.3: Testar a rota da API

### Perguntas de verificação

1. **Por que a lógica de negócios está nos fluxos de trabalho e não nas rotas?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   As rotas são pontos de entrada. Os fluxos de trabalho podem ser reutilizados a partir de várias rotas, tarefas agendadas e assinantes de eventos. Isso mantém a lógica centralizada e testável.
   </details>

2. **O que acontece se a validação falhar?**
   <details>
   <summary>Clique para revelar a resposta</summary>
   O middleware `validateAndTransformBody` retorna um erro 400 com detalhes sobre o que falhou. O manipulador da rota nunca é executado.
   </details>

3. **Por que passar `req.scope` para o fluxo de trabalho?**
   <details>
   <summary>Clique para ver a resposta</summary>
   `req.scope` é o contêiner do Medusa. O fluxo de trabalho precisa dele para resolver serviços e módulos.
   </details>

### Verificação da implementação

1. **Verifique se a compilação é bem-sucedida**:

   ```bash
   npm run build
   ```

2. **Mostre-me seus arquivos**:
   - `src/api/admin/brands/validators.ts`
   - `src/api/admin/brands/route.ts`
   - `src/api/middlewares.ts`

### Teste a API

Agora vamos testar o recurso completo!

**Passo 1: Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

**Passo 2: Obtenha o token de autenticação de administrador**

Como `/admin/brands` exige autenticação, obtenha primeiro um token:

```bash
curl -X POST 'http://localhost:9000/auth/user/emailpass' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@medusa-test.com",
    "password": "supersecret"
}'
```

Substitua pelo seu e-mail e senha de administrador.

**Não tem um usuário administrador?** Crie um:

```bash
npx medusa user -e admin@test.com -p supersecret
```

**Passo 3: Criar uma marca**

Usando o token do passo 2:

```bash
curl -X POST 'http://localhost:9000/admin/brands' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {token}' \
--data '{
    "name": "Acme"
}'
```

**Resposta esperada**:

```json
{
  "brand": {
    "id": "brand_01HQXYZ...",
    "name": "Acme",
    "created_at": "2024-01-16T10:30:00.000Z",
    "updated_at": "2024-01-16T10:30:00.000Z"
  }
}
```

### Problemas comuns

**401 Não autorizado**

- **Causa**: Token expirado ou credenciais inválidas
- **Correção**: Obter um token novo em `/auth/user/emailpass`

**Matriz vazia retornada `[]`**

- **Causa**: Erro de digitação no nome do arquivo de middleware — provavelmente chamado `middleware.ts` em vez de `middlewares.ts`
- **Correção**: Renomeie para `src/api/middlewares.ts` (plural)

**400 Erro de validação**

- **Causa**: O corpo da solicitação não corresponde ao esquema Zod
- **Correção**: Certifique-se de enviar `{ "name": "Acme" }` com o JSON correto

**500 Erro de servidor**

- Verifique os logs do servidor para obter detalhes
- Causas comuns:
  - Módulo não registrado na configuração
  - Migração não executada
  - Erro de sintaxe no fluxo de trabalho

### Lista de verificação de testes

- [ ] Servidor de desenvolvimento em execução
- [ ] Token de autenticação obtido
- [ ] Marca criada com sucesso via cURL
- [ ] A resposta contém a marca com ID, nome e carimbos de data/hora

---

## Lição 1 concluída! 🎉

### O que você criou

Parabéns! Você acabou de criar um recurso personalizado completo no Medusa:

- ✅ **Módulo de marca**: modelo de dados + serviço gerado automaticamente
- ✅ **createBrandWorkflow**: lógica de negócios com reversão
- ✅ **POST /admin/brands**: endpoint de API com validação
- ✅ **Testado**: Criei uma marca usando o cURL

### O que você aprendeu

**Arquitetura**:

- Padrão Módulo → Fluxo de Trabalho → Rota de API
- Por que cada camada existe e quais são suas responsabilidades
- Como elas se conectam entre si

**Módulos**:

- Modelos de dados definem tabelas de banco de dados
- Serviços fornecem operações CRUD
- Módulos são isolados e reutilizáveis

**Fluxos de trabalho**:

- Orquestrar operações com várias etapas
- Fornecer reversão automática por meio de funções de compensação
- Garantir a consistência dos dados

**Rotas de API**:

- Expor funcionalidades aos clientes
- Validar entradas por meio de middlewares
- Executar fluxos de trabalho (mantenha as rotas simples!)

### Reforço da arquitetura

Antes de passar para a Lição 2, reflita sobre estas perguntas:

**1. Por que não posso chamar `brandModuleService` diretamente da rota da API?**

Pense nisso e, em seguida, desenvolva sua resposta:
<details>
<summary>Resposta</summary>

Embora você *pudesse* fazer assim:

```typescript
export const POST = async (req, res) => {
  const brandService = req.scope.resolve("brand")
  const brand = await brandService.createBrands(req.body)
  res.json({ brand })
}
```

**Problemas**:

- Não há reversão caso as operações subsequentes falhem
- Não é possível reutilizar a lógica em outros lugares (tarefas agendadas, outras rotas)
- Difícil de testar
- Viola a separação de interesses

**Os fluxos de trabalho resolvem isso** ao:

- Oferecer reversão automática
- Serem reutilizáveis em qualquer lugar
- Possuírem interfaces claras
- Podarem ser testados de forma independente

</details>

**2. O que acontece se houver um erro ao criar a marca?**

<details>
<summary>Resposta</summary>

A função de compensação do fluxo de trabalho (o terceiro parâmetro de `createBrandStep`) é chamada automaticamente, o que exclui a marca. Isso garante que não haja dados órfãos.
</details>

**3. Onde eu adicionaria a validação de negócios (por exemplo, “o nome da marca deve ser único”)?**

<details>
<summary>Resposta</summary>

Em uma etapa do fluxo de trabalho, NÃO na rota da API!

```typescript
export const validateBrandNameStep = createStep(
  "validate-brand-name",
  async ({ name }, { container }) => {
    const brandService = container.resolve("brand")
    const existing = await brandService.listBrands({ name })

    if (existing.length > 0) {
      throw new Error("Brand name must be unique")
    }

    return new StepResponse({ validated: true })
  }
)

// Then in workflow:
export const createBrandWorkflow = createWorkflow(
  "create-brand",
  function (input) {
    validateBrandNameStep(input)
    const brand = createBrandStep(input)
    return new WorkflowResponse(brand)
  }
)
```

</details>

### Salve seu trabalho

Salve seu progresso:

```bash
git add .
git commit -m "Complete Lesson 1: Brand Module, Workflow, and API Route"
```

---

## Pronto para a Lição 2?

Na **Lição 2: Ampliar o Medusa**, você aprenderá a:

- **Vincular marcas a produtos** usando Module Links (mantendo o isolamento dos módulos)
- **Estender os fluxos de trabalho principais** usando ganchos de fluxo de trabalho (adicionar lógica personalizada aos fluxos de trabalho do Medusa)
- **Consultar dados vinculados** entre módulos usando o Query

Você será capaz de:

- Criar um produto com uma marca: `POST /admin/products` com `additional_data: { brand_id: "..." }`
- Obter a marca de um produto: `GET /admin/products/:id?fields=+brand.*`
- Listar todas as marcas com seus produtos: `GET /admin/brands`, retornando os produtos associados

**Documentação**: [Links do módulo](https://docs.medusajs.com/learn/fundamentals/module-links) | [Ganchos de fluxo de trabalho](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks) | [Guia de consultas](https://docs.medusajs.com/learn/fundamentals/module-links/query)

Quando estiver pronto, me avise e vamos começar a Lição 2!
