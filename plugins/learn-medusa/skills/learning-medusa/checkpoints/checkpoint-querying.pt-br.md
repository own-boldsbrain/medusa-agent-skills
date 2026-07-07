# Ponto de verificação 2.3: Consulta de registros vinculados

Este ponto de verificação confirma que você criou com sucesso uma rota de API GET /admin/brands que consulta marcas com seus produtos vinculados usando Query.graph().

## Questões de verificação

Antes de prosseguir, teste seu entendimento:

1. **Por que usamos `+brand.*` no parâmetro fields?**
   <details>
   <summary>Resposta</summary>

   O `+` significa “inclua esses campos ALÉM dos campos padrão”. Sem o `+`, você substituiria os campos padrão por completo. O `.*` significa “inclua todos os campos da relação da marca”. Portanto, `+brand.*` significa “mostre todos os campos padrão do produto MAIS todos os campos da marca”.
   </details>

2. **O que `req.queryConfig` contém?**
   <details>
   <summary>Resposta</summary>

   `req.queryConfig` contém parâmetros de consulta pré-processados, como `fields`, `limit`, `offset`, `order` e filtros. O middleware analisa a string de consulta e a transforma nesse formato estruturado. Você pode passá-la diretamente para `query.graph()` para aplicar a filtragem e a paginação solicitadas pelo usuário sem precisar analisar manualmente a string de consulta.
   </details>

3. **Por que retornar count, limit e offset na resposta da API?**
   <details>
   <summary>Resposta</summary>

   Isso segue as melhores práticas de paginação REST. O front-end precisa desses metadados para:
   - Mostrar a contagem total: “Mostrando 10 de 50 marcas”
   - Implementar “Carregar mais” ou navegação por páginas
   - Calcular o total de páginas: `Math.ceil(count / limit)`
   - Solicitar a próxima página: `offset + limit`

   Sem esses metadados, o front-end não consegue construir uma interface de usuário de paginação adequada.
   </details>

## Verificação da implementação

Gostaria de verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Arquivo de rota da API

Mostre-me o seu arquivo `src/api/admin/brands/route.ts` (a versão atualizada com o manipulador GET).

**Pontos importantes a verificar**:

- [ ] Define a função `GET` (deve se chamar exatamente `GET`)
- [ ] Utiliza os tipos: `MedusaRequest`, `MedusaResponse`
- [ ] Resolve o serviço de consulta: `req.scope.resolve("query")`
- [ ] Chama `query.graph()` com:
  - `entity: "brand"`
  - Expande `req.queryConfig`
- [ ] Desestrutura o resultado: `{ data: brands, metadata: { count, take, skip } = {} }`
- [ ] Retorna JSON com marcas, contagem, limite (take) e deslocamento (skip)

### 2. Configuração do middleware

Mostre-me a configuração do middleware GET /admin/brands em `src/api/middlewares.ts`.

**Pontos importantes a verificar**:

- [ ] Importa `createFindParams` de "@medusajs/medusa/api/utils/validators"
- [ ] Define `GetBrandsSchema = createFindParams()`
- [ ] Configuração da rota:
  - Matcher: `"/admin/brands"`
  - Método: `"GET"`
  - Utiliza `validateAndTransformQuery()` com:
    - Esquema: `GetBrandsSchema`
    - Opções: a matriz `defaults` inclui campos de marca e a relação com produtos
    - Opções: `isList: true`

Exemplo:

```typescript
validateAndTransformQuery(
  GetBrandsSchema,
  {
    defaults: ["id", "name", "products.*"],
    isList: true,
  }
)
```

## Problemas comuns

### “Matriz vazia retornada”, mesmo que existam marcas

**Sintoma**: A API retorna uma matriz vazia de marcas

**Causas e soluções**:

**Causa 1**: Nome da entidade incorreto

- **Solução**: Use `entity: "brand"` (letras minúsculas, singular)

**Causa 2**: Middleware não configurado com os padrões

- **Solução**: Adicione `defaults` à configuração do middleware

**Causa 3**: Módulo não registrado corretamente

- **Solução**: Verifique se o arquivo `medusa-config.ts` contém o módulo da marca

### “metadata is undefined”

**Sintoma**: Erro ao acessar count, take, skip

**Causa**: query.graph() não retorna metadata (deveria sempre retorná-lo)

**Solução**:
Use valores padrão na desestruturação:

```typescript
const {
  data: brands,
  metadata: { count, take, skip } = {}
} = await query.graph({ ... })

res.json({
  brands,
  count: count || 0,
  limit: take || 15,
  offset: skip || 0,
})
```

### “campo ‘products’ não incluído” na resposta

**Sintoma**: Os objetos de marca não possuem o array ‘products’

**Causa**: As configurações padrão do middleware não incluem os produtos

**Solução**:
Adicione às configurações padrão do middleware:

```typescript
validateAndTransformQuery(
  GetBrandsSchema,
  {
    defaults: ["id", "name", "products.*"],
    isList: true,
  }
)
```

### “Erro de validação: parâmetro de consulta inválido”

**Sintoma**: erro 400 ao usar parâmetros de consulta

**Causa**: o middleware não está configurado ou está usando um validador incorreto

**Solução**:
Certifique-se de estar usando `createFindParams()`:

```typescript
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetBrandsSchema = createFindParams()
```

E de estar usando `validateAndTransformQuery()` (e não `validateAndTransformBody()`):

```typescript
validateAndTransformQuery(GetBrandsSchema, { ... })
```

### Matriz de produtos vazia, mesmo com a existência de links

**Sintoma**: as marcas são retornadas, mas a matriz de produtos está vazia

**Causas e soluções**:

**Causa 1**: Link não criado corretamente

- **Correção**: Verifique o Ponto de Verificação 2.2 — verifique se os links existem no banco de dados

**Causa 2**: products.* não está na matriz defaults

- **Correção**: Adicione `"products.*"` à matriz defaults

**Causa 3**: A direção do link está invertida

- **Correção**: Revise a definição do link no Ponto de Verificação 2.1

### “Não é possível ler a propriedade 'result' de undefined”

**Sintoma**: Erro ao acessar o resultado da consulta

**Causa**: Desestruturação incorreta do resultado de query.graph()

**Solução**:
Use `data` para a matriz de resultados:

```typescript
const { data: brands } = await query.graph({ ... })
// NOT: const { result: brands }
```

## Compreensão da arquitetura

Neste ponto, você deve compreender:

**Duas maneiras de consultar dados vinculados**:

**Método 1: Parâmetro Fields** (Consultas simples)

```typescript
// In a service method
product = await productService.retrieve(id, {
  fields: "+brand.*"
})
```

**Método 2: query.graph()** (Consultas complexas)

```typescript
// In API routes
const { data } = await query.graph({
  entity: "brand",
  fields: ["id", "name", "products.*"],
  filters: { ... },
  pagination: { ... }
})
```

**Fluxo de dados do query.graph()**:

```
Request: GET /admin/brands?limit=10&offset=0
                 │
                 ▼
         ┌──────────────┐
         │  Middleware  │ ← Parses query string
         │  validates   │   Transforms to queryConfig
         └──────┬───────┘
                │ req.queryConfig = {
                │   fields: ["id", "name", "products.*"],
                │   take: 10,
                │   skip: 0
                │ }
                ▼
         ┌──────────────┐
         │ Route Handler│
         │ query.graph()│ ← Applies queryConfig
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │   Database   │
         │  + Link      │ ← Joins brand and product tables
         │    Layer     │
         └──────┬───────┘
                │
                ▼
Response: { brands: [...], count, limit, offset }
```

**Por que isso é importante**:

- **Flexibilidade**: os clientes controlam quais dados precisam
- **Desempenho**: apenas os campos solicitados são buscados
- **Paginação**: lida com grandes conjuntos de dados de forma eficiente
- **Consistência**: mesmos padrões de consulta em todas as entidades

## Próximos passos

Após passar por este ponto de verificação:

1. **Lição 2 concluída!** Você ampliou a funcionalidade principal do Medusa:
   - Módulo Link definido (relação marca ↔ produto)
   - Hook de workflow consumindo productsCreated
   - Capacidade de consulta para registros vinculados

2. **Confirme seu trabalho**:

   ```bash
   git add .
   git commit -m "Complete Lesson 2: Extend Medusa with links and hooks"
   ```

3. **Próximo: Lição 3** - Personalizar o painel de administração
   - Criar um widget para exibir a marca na página do produto
   - Criar uma rota de interface do usuário para a página de gerenciamento de marcas
   - Usar o React Query e os componentes da Medusa UI

**Pronto para a Lição 3?** Agora que o back-end está concluído, vamos construir a interface de usuário de administração para gerenciar as marcas visualmente.
