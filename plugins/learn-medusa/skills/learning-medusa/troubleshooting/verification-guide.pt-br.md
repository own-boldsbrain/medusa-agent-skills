# Guia de verificação: como testar cada componente

Este guia fornece procedimentos de teste sistemáticos para cada tipo de componente no Medusa. Use esses métodos para verificar se suas implementações funcionam corretamente.

## Convenções importantes do Medusa

### Armazenamento de preços

**Os preços no Medusa são armazenados exatamente como estão, NÃO em centavos ou na menor unidade monetária.**

- Se um produto custa $10, armazene-o como `10` (não como `1000`)
- Se um produto custa €25,50, armazene-o como `25,50` (não como `2550`)
- Se um produto custa ¥1.000, armazene-o como `1.000` (não como `100.000`)

**Exemplo**:

```json
{
  "title": "T-Shirt",
  "variants": [
    {
      "prices": [
        {
          "amount": 19.99,  // $19.99, NOT 1999
          "currency_code": "usd"
        }
      ]
    }
  ]
}
```

**Por que isso é importante**: Muitos sistemas de pagamento (como o Stripe) usam centavos, mas o Medusa lida com a conversão internamente. Sempre use o valor real do preço em suas solicitações de API e modelos de dados.

---

## Verificação do módulo

### Etapa 1: Teste de compilação

Verifique se o módulo compila sem erros:

```bash
npm run build
```

**Esperado**: A compilação é bem-sucedida, sem erros do TypeScript.

**Se falhar**: Verifique a definição do módulo, as importações e as definições de tipos.

### Etapa 2: Teste de migração

Verifique se a tabela do banco de dados foi criada:

```bash
# Run migrations
npx medusa db:migrate

# Connect to database
psql your_database_name

# Check table exists
\dt brand

# Check table structure
\d brand

# Expected output:
# Columns: id, name, created_at, updated_at
```

### Etapa 3: Teste de resolução do serviço

Crie um script CLI personalizado para verificar se o serviço pode ser resolvido:

```typescript
// src/scripts/test-brand-service.ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function testServiceResolution({ container }: ExecArgs) {
  const brandService = container.resolve("brand")

  console.log("Service resolved:", !!brandService)
  console.log("Methods available:", typeof brandService.createBrands === "function")
}
```

Execute o script:

```bash
npx medusa exec ./src/scripts/test-brand-service.ts
```

**Esperado**: O serviço é resolvido e possui métodos CRUD.

### Etapa 4: Teste direto do serviço

Crie um script CLI personalizado para testar as operações CRUD:

```typescript
// src/scripts/test-brand-crud.ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function testCRUD({ container }: ExecArgs) {
  const brandService = container.resolve("brand")

  // Create
  const [brand] = await brandService.createBrands([{ name: "Test Brand" }])
  console.log("Created:", brand)

  // Retrieve
  const [retrieved] = await brandService.retrieveBrands([brand.id])
  console.log("Retrieved:", retrieved)

  // Update
  const [updated] = await brandService.updateBrands([{
    id: brand.id,
    name: "Updated Brand"
  }])
  console.log("Updated:", updated)

  // List
  const brands = await brandService.listBrands()
  console.log("Listed:", brands.length, "brands")

  // Delete
  await brandService.deleteBrands([brand.id])
  console.log("Deleted successfully")
}
```

Execute o script:

```bash
npx medusa exec ./src/scripts/test-brand-crud.ts
```

**Esperado**: Todas as operações são concluídas com sucesso, sem erros.

---

## Verificação do fluxo de trabalho

### Etapa 1: Teste de compilação

Verifique se o fluxo de trabalho compila:

```bash
npm run build
```

**Esperado**: Nenhum erro relacionado a async/await, funções-seta ou sintaxe do fluxo de trabalho.

### Etapa 2: Teste de execução do fluxo de trabalho

Crie um script CLI personalizado para testar a execução do fluxo de trabalho:

```typescript
// src/scripts/test-create-brand-workflow.ts
import { ExecArgs } from "@medusajs/framework/types"
import { createBrandWorkflow } from "../workflows/create-brand"

export default async function testWorkflowExecution({ container }: ExecArgs) {
  const { result } = await createBrandWorkflow(container)
    .run({ input: { name: "Nike" } })

  console.log("Workflow result:", result)
}
```

Execute o script:

```bash
npx medusa exec ./src/scripts/test-create-brand-workflow.ts
```

**Resultado esperado**: O fluxo de trabalho é concluído com sucesso, e a marca é criada.

### Etapa 3: Teste de reversão

Primeiro, crie um fluxo de trabalho de teste que falhe intencionalmente:

```typescript
// src/workflows/test-rollback.ts
import { createWorkflow, createStep, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createBrandStep } from "./create-brand"

// Create a step that will intentionally fail
const intentionalFailStep = createStep(
  "intentional-fail",
  async () => {
    throw new Error("Intentional failure for rollback test")
  }
)

// Create a workflow that intentionally fails after brand creation
export const testRollbackWorkflow = createWorkflow(
  "test-rollback",
  function (input) {
    const brand = createBrandStep(input)

    // This step will fail
    intentionalFailStep()

    return new WorkflowResponse(brand)
  }
)
```

Em seguida, crie um script CLI personalizado para testar a reversão:

```typescript
// src/scripts/test-rollback.ts
import { ExecArgs } from "@medusajs/framework/types"
import { testRollbackWorkflow } from "../workflows/test-rollback"

export default async function testRollback({ container }: ExecArgs) {
  const brandService = container.resolve("brand")

  const beforeCount = (await brandService.listBrands()).length

  try {
    await testRollbackWorkflow(container)
      .run({ input: { name: "Will Be Rolled Back" } })
  } catch (error) {
    console.log("Expected error:", error.message)
  }

  const afterCount = (await brandService.listBrands()).length

  console.log("Brand count before:", beforeCount)
  console.log("Brand count after:", afterCount)
  console.log("Rollback worked:", beforeCount === afterCount)
}
```

Execute o script:

```bash
npx medusa exec ./src/scripts/test-rollback.ts
```

**Esperado**: Número de marcas inalterado (reversão bem-sucedida).

---

## Verificação da rota da API

### Etapa 1: Teste de inicialização do servidor

Verifique se o servidor inicia sem erros:

```bash
npm run dev
```

**Esperado**:

- O servidor inicia com sucesso
- O console exibe “O servidor está pronto na porta 9000”
- Não há erros de registro de rota

### Etapa 2: Autenticação de administrador

Todas as rotas `/admin` exigem autenticação. Primeiro, crie um usuário administrador e faça login para obter um token de autenticação.

**Crie um usuário administrador** (caso ainda não tenha sido criado):

```bash
npx medusa user -e admin@test.com -p supersecret
```

**Faça login para obter o token de autenticação**:

```bash
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  --data-raw '{
    "email": "admin@test.com",
    "password": "supersecret"
  }'
```

**Resposta esperada**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Salve o token** — você precisará dele para todas as solicitações subsequentes em `/admin`:

```bash
# Set token as environment variable for convenience
export AUTH_TOKEN="your-token-here"
```

**Importante**: Todas as solicitações da rota `/admin` devem incluir o token de autenticação no cabeçalho `Authorization: Bearer`:

```bash
curl -X GET http://localhost:9000/admin/brands \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

### Etapa 3: Teste de acessibilidade da rota

A rota de teste responde a solicitações autenticadas:

```bash
# First, authenticate and get token (see Step 2)
export AUTH_TOKEN="your-token-here"

# Then test the route
curl -X POST http://localhost:9000/admin/brands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"name": "Nike"}'
```

**Esperado**:

- Código de status 200 ou 201
- Resposta JSON com o objeto “brand”
- O objeto “brand” contém id, nome e carimbos de data/hora

**Se for 404**: Rota não registrada — verifique o local do arquivo e o nome da função exportada.

**Se for 401**: Autenticação necessária — consulte a seção sobre autenticação abaixo.

### Etapa 3: Teste de validação

Teste se a validação do middleware funciona com solicitações autenticadas:

```bash
# Authentication required (see Step 2)
# Send invalid data (missing required field)
curl -X POST http://localhost:9000/admin/brands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{}'
```

**Esperado**:

- Código de status 400
- Mensagem de erro informando que o campo `name` está faltando

### Etapa 4: Verificação do banco de dados

Verifique se os dados foram gravados:

```bash
# After creating a brand via API
psql your_database -c "SELECT * FROM brand WHERE name = 'Nike';"
```

**Esperado**: A marca existe no banco de dados com os dados corretos.

### Etapa 5: Teste de tratamento de erros

Teste as respostas de erro com solicitações autenticadas:

```bash
# Authentication required (see Step 2)
# Send malformed JSON
curl -X POST http://localhost:9000/admin/brands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d 'invalid json'
```

**Esperado**: Erro 400 com mensagem apropriada.

---

## Verificação de links do módulo

### Etapa 1: Teste de sincronização de links

Verifique se a tabela de links foi criada:

```bash
# Sync links
npx medusa db:sync-links

# Run migrations
npx medusa db:migrate

# Check link table exists
psql your_database -c "\dt" | grep link
```

**Esperado**: A tabela de links existe (por exemplo, `link_brand_product`).

### Etapa 2: Teste da estrutura dos links

Verifique a estrutura da tabela de links:

```bash
psql your_database -c "\d link_brand_product"
```

**Colunas esperadas**:

- id (chave primária)
- brand_id (chave estrangeira)
- product_id (chave estrangeira)
- created_at
- updated_at
- deleted_at

### Etapa 3: Teste de criação de link

Teste a criação de um link:

```typescript
import { Modules } from "@medusajs/framework/utils"

async function testLinkCreation() {
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  await link.create({
    [Modules.BRAND]: { brand_id: "brand_123" },
    [Modules.PRODUCT]: { product_id: "prod_456" },
  })

  console.log("Link created successfully")
}
```

**Esperado**: Link criado sem erros.

### Etapa 4: Teste de consulta a dados vinculados

Teste a consulta de registros vinculados (requer autenticação):

```bash
# Authentication required (see API Route Verification Step 2)
curl "http://localhost:9000/admin/brands?fields=id,name,products.*" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Esperado**: As marcas incluem uma matriz de produtos com detalhes dos produtos.

---

## Verificação dos ganchos de fluxo de trabalho

### Etapa 1: Teste de registro de gancho

Verifique se o gancho não causa erros:

```bash
npm run dev
```

**Esperado**:

- O servidor inicia sem erros
- Não há avisos sobre assinantes de hook inválidos
- Os logs mostram que o arquivo do hook foi carregado

### Etapa 2: Teste de execução do hook

Teste a execução do hook quando o fluxo de trabalho principal for executado (requer autenticação):

```bash
# Authentication required (see API Route Verification Step 2)
# Create product with brand_id in additional_data
curl -X POST http://localhost:9000/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "title": "Air Max 90",
    "additional_data": {
      "brand_id": "brand_123"
    }
  }'
```

**Esperado**:

- Produto criado com sucesso
- Vínculo criado entre o produto e a marca

### Etapa 3: Teste de verificação do vínculo

Verifique se o vínculo foi criado pelo hook (requer autenticação):

```bash
# Authentication required (see API Route Verification Step 2)
# Query brand with products
curl "http://localhost:9000/admin/brands?fields=id,name,products.*" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Esperado**: A marca exibe o produto recém-criado na matriz de produtos.

### Etapa 4: Teste de reversão do hook

A compensação do gancho de teste funciona:

```typescript
// Temporarily modify the workflow to fail after products are created
// The hook should create the link, then roll it back when workflow fails

async function testHookRollback() {
  const linkService = container.resolve(ContainerRegistrationKeys.LINK)

  // Count links before
  const linksBefore = await linkService.list({})

  try {
    // This should fail and trigger rollback
    await createProductsWorkflow(container).run({
      input: {
        products: [{ title: "Test", additional_data: { brand_id: "brand_123" } }]
      }
    })
  } catch (error) {
    console.log("Expected error:", error.message)
  }

  // Count links after
  const linksAfter = await linkService.list({})

  console.log("Links before:", linksBefore.length)
  console.log("Links after:", linksAfter.length)
  console.log("Rollback worked:", linksBefore.length === linksAfter.length)
}
```

**Esperado**: Número de links inalterado (compensação de hook executada).

---

## Verificação da consulta

Todos os testes de consulta exigem autenticação (consulte a Etapa 2 da Verificação da Rota da API).

### Etapa 1: Teste básico de consulta

Teste se Query.graph() recupera dados:

```bash
# Authentication required
curl "http://localhost:9000/admin/brands" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Esperado**:

- Retorna uma matriz de marcas
- Inclui metadados de contagem, limite e deslocamento

### Etapa 2: Teste de parâmetros de campos

Teste a seleção de campos:

```bash
# Authentication required
curl "http://localhost:9000/admin/brands?fields=id,name" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Esperado**: As marcas incluem apenas os campos id e nome.

### Etapa 3: Teste de paginação

Teste se a paginação funciona corretamente:

```bash
# Authentication required
# Page 1
curl "http://localhost:9000/admin/brands?limit=2&offset=0" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Page 2
curl "http://localhost:9000/admin/brands?limit=2&offset=2" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Esperado**: Marcas diferentes em cada página, metadados corretos.

### Etapa 4: Teste de relações

Teste incluindo dados relacionados:

```bash
# Authentication required
curl "http://localhost:9000/admin/brands?fields=id,name,products.*" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Esperado**: Cada marca inclui uma gama completa de produtos com detalhes dos mesmos.

---

## Verificação do widget de administração

### Etapa 1: Teste de visibilidade do widget

**Teste manual no navegador**:

1. Abra o painel de administração: <http://localhost:9000/app>
2. Faça login com as credenciais de administrador
3. Navegue até Produtos
4. Clique em um produto com uma marca
5. Procure seu widget

**Esperado**: O widget aparece na zona especificada (por exemplo, no topo da página para `product.details.before`).

### Etapa 2: Teste dos dados do widget

**Nas Ferramentas do desenvolvedor do navegador**:

1. Abra a guia Rede
2. Acesse a página do produto
3. Procure a solicitação de API que busca os dados do produto

**Esperado**:

- A solicitação inclui o parâmetro `fields` com `+brand.*`
- A resposta inclui os dados da marca
- O widget exibe o nome da marca corretamente

### Etapa 3: Teste do estado de carregamento do widget

**No navegador com conexão limitada**:

1. Abra as Ferramentas de desenvolvedor → guia Rede
2. Limite a conexão para “3G lento”
3. Acesse a página do produto
4. Observe o widget

**Esperado**:

- O widget exibe o estado de carregamento inicialmente
- Em seguida, exibe os dados da marca
- Sem erros no console

### Etapa 4: Teste de tratamento de erros do widget

**Modifique temporariamente o widget para forçar um erro**:

```typescript
const { data, error } = useQuery({
  queryFn: () => { throw new Error("Test error") },
  queryKey: ["test-error"],
})

if (error) return <div>Error: {error.message}</div>
```

**Esperado**: O widget exibe o estado de erro de maneira adequada.

---

## Verificação de rotas da interface de usuário administrativa

### Etapa 1: Teste de acessibilidade das rotas

**Teste manual no navegador**:

1. Abra a interface administrativa: <http://localhost:9000/app>
2. Procure a rota na barra lateral de navegação

**Esperado**:

- A rota aparece na barra lateral com o ícone e o rótulo corretos
- Ao clicar, o usuário é direcionado para a rota

### Etapa 2: Teste de navegação

**Teste manual**:

1. Clique na rota na barra lateral
2. Verifique se a URL muda para `/app/brands`
3. Verifique se a página carrega sem erros

**Esperado**:

- A URL é atualizada corretamente
- A página é renderizada com sucesso
- Não há erros no console

### Etapa 3: Teste da DataTable

**Teste manual na página da rota**:

1. Navegue até a rota
2. Observe a tabela

**Esperado**:

- A tabela é exibida com as colunas corretas
- Os dados são carregados e preenchem as linhas
- O estilo está alinhado com o das outras páginas de administração
- Não há erros no console

### Etapa 4: Teste de paginação

**Teste manual (requer mais de 15 registros)**:

1. Acesse a rota
2. Observe os controles de paginação
3. Clique na página “Próxima”

**Esperado**:

- Os controles de paginação aparecem na parte inferior
- Clicar muda a página
- Dados diferentes são exibidos
- Indicador de página correto

### Etapa 5: Teste de rede

**Nas DevTools do navegador**:

1. Abra a aba “Rede”
2. Acesse a rota
3. Procure pela solicitação de API

**Esperado**:

- Solicitação para `/admin/brands` com parâmetros de consulta (limit, offset)
- A resposta inclui dados, contagem, limite e deslocamento
- Tabela preenchida com os dados da resposta

---

## Referência de autenticação

Todas as rotas `/admin` exigem autenticação. Consulte **Verificação de rotas da API → Etapa 2: Autenticação de administrador** para obter instruções completas sobre a configuração da autenticação.

**Referência rápida**:

1. Criar usuário administrador:

   ```bash
   npx medusa user -e admin@test.com -p supersecret
   ```

2. Obter token de autenticação:

   ```bash
   curl -X POST http://localhost:9000/auth/user/emailpass \
     -H "Content-Type: application/json" \
     --data-raw '{
       "email": "admin@test.com",
       "password": "supersecret"
     }'
   ```

3. Use o token nas solicitações:

   ```bash
   export AUTH_TOKEN="your-token-here"
   curl http://localhost:9000/admin/brands \
     -H "Authorization: Bearer $AUTH_TOKEN"
   ```

---

## Resumo

**Abordagem de verificação sistemática**:

1. **Teste de compilação**: Verifique se o código compila
2. **Teste de API**: Teste por meio de endpoints HTTP
3. **Teste de interface do usuário**: Teste no navegador
4. **Teste de banco de dados**: Verifique a persistência
5. **Teste de ponta a ponta**: Teste fluxos completos

**Ferramentas utilizadas**:

- `npm run build` - Verificação da compilação
- `npx medusa db:migrate` - Configuração do banco de dados
- `curl` - Testes de API
- Ferramentas de desenvolvimento do navegador - Testes de interface do usuário
- `psql` - Inspeção do banco de dados
- `jq` - Análise de JSON

**Princípio fundamental**: Teste cada camada de forma independente antes de testar a integração. Isso isola os problemas e facilita a depuração.

**Fluxo de trabalho comum de verificação**:

1. Escreva o código
2. Execute o teste de compilação
3. Teste na interface do usuário (teste manual)
4. Verifique no banco de dados
5. Teste casos extremos e erros

**Lembre-se**: Uma abordagem sistemática de testes detecta problemas antecipadamente e dá confiança de que sua implementação funciona corretamente.
