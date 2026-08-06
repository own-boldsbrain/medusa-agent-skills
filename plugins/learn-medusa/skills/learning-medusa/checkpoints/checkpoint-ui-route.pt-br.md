# Ponto de verificação 3.2: Rota da interface do usuário (UI) de marcas

Este ponto de verificação confirma se você criou com sucesso uma página de gerenciamento de marcas com uma tabela de dados e paginação.

## Questões de verificação

Antes de prosseguir, teste seu entendimento:

1. **Como o caminho do arquivo determina a URL de uma rota da interface do usuário (UI)?**
   <details>
   <summary>Resposta</summary>

   A estrutura de arquivos em `src/admin/routes/` corresponde às URLs em `/app/`. Por exemplo:
   - `src/admin/routes/brands/page.tsx` → `/app/brands`
   - `src/admin/routes/settings/team/page.tsx` → `/app/settings/team`

   O arquivo DEVE ser nomeado como `page.tsx` (não `route.tsx` ou `index.tsx`). Pastas aninhadas criam rotas aninhadas.
   </details>

2. **Por que usamos `sdk.client.fetch()` em vez de `sdk.admin.brand.list()`?**
   <details>
   <summary>Resposta</summary>

   `sdk.admin.brand.list()` não existe porque a rota da API `/admin/brands` é personalizada, e o SDK JS possui apenas métodos para rotas da API principal. Para rotas personalizadas da API, use `sdk.client.fetch()`, que faz uma solicitação HTTP bruta para qualquer endpoint.
   </details>

3. **Qual é a finalidade de `defineRouteConfig()` e o que acontece sem ela?**
   <details>
   <summary>Resposta</summary>

   `defineRouteConfig()` adiciona a rota à barra lateral de navegação do painel de administração e personaliza sua aparência (rótulo, ícone). Sem ela, a rota ainda existe e pode ser acessada pela URL, mas os usuários não veriam um link de navegação. Eles teriam que digitar a URL manualmente ou ter um link de outro lugar.
   </details>

## Verificação da implementação

Deixe-me verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Rota da API de backend (com manipulador GET)

Mostre-me seu arquivo `src/api/admin/brands/route.ts` atualizado com o manipulador GET.

**Pontos-chave a serem verificados**:

- [ ] Define a função `GET`
- [ ] Resolve o serviço de consulta
- [ ] Chama `query.graph()` com:
  - `entity: "brand"`
  - Expande `req.queryConfig`
- [ ] Retorna JSON com marcas, contagem, limite e deslocamento

**Observação**: Você já deve ter criado isso no Ponto de Verificação 2.3. Caso contrário, crie agora.

### 2. Configuração do middleware do backend

Mostre-me a configuração GET /admin/brands no arquivo `src/api/middlewares.ts`.

**Pontos importantes a verificar**:

- [ ] Comparador de rota: `"/admin/brands"`
- [ ] Método: `"GET"`
- [ ] Utiliza `validateAndTransformQuery()` com:
  - `GetBrandsSchema` (de `createFindParams()`)
  - Opções com `defaults` e `isList: true`

**Observação**: Você já deve ter criado isso no Ponto de Verificação 2.3. Caso contrário, crie agora.

### 3. Arquivo de rota da interface do usuário

Mostre-me seu arquivo `src/admin/routes/brands/page.tsx`.

**Pontos importantes a verificar**:

- [ ] Importa `defineRouteConfig` de "@medusajs/admin-sdk"
- [ ] Importa ícones (por exemplo, `TagSolid`) de "@medusajs/icons"
- [ ] Importa componentes de interface do usuário: `Container`, `Heading`, `DataTable`, etc., de "@medusajs/ui"
- [ ] Importa `useQuery` de "@tanstack/react-query"
- [ ] Importa `sdk` de "../../lib/sdk"
- [ ] Importa hooks do React: `useState`, `useMemo`
- [ ] Define o tipo `Brand` com id, nome e produtos
- [ ] Define o tipo `BrandsResponse` com marcas, contagem, limite e deslocamento
- [ ] Cria colunas usando `createDataTableColumnHelper<Brand>()`
- [ ] Define pelo menos 3 colunas: id, nome e produtos (exibindo a contagem)
- [ ] O componente possui estado de paginação: `useState({ pageSize, pageIndex })`
- [ ] Calcula o deslocamento a partir do estado da paginação
- [ ] useQuery:
  - Chama `sdk.client.fetch()` com `/admin/brands` e os parâmetros da consulta
  - A chave da consulta inclui o limite e o deslocamento
  - Declara a resposta como `BrandsResponse`
- [ ] Utiliza o hook `useDataTable()` com colunas, dados, contagem de linhas e paginação
- [ ] Renderiza a DataTable com barra de ferramentas, tabela e paginação
- [ ] Exporta a configuração com rótulo e ícone
- [ ] Exporta o componente por padrão

### 4. Teste: Acessar a rota da interface do usuário

1. Verifique se o servidor de desenvolvimento está em execução: `npm run dev`
2. Abra o painel de administração: <http://localhost:9000/app>
3. Procure por “Marcas” na barra de navegação lateral

**Esperado**: Você deve ver um item de menu “Marcas” com o ícone que escolheu.

### 5. Teste: Visualizar a página de marcas

1. Clique no item de menu “Marcas”
2. Visualize a tabela de marcas

**Esperado**:

- A página é exibida com o título “Marcas”
- A tabela mostra as colunas: ID, Nome, Produtos (contagem)
- A tabela mostra todas as marcas que você criou
- A coluna “Produtos” mostra o número de produtos vinculados a cada marca

### 6. Teste: precisão da contagem de produtos

1. Observe a coluna “Produtos” para cada marca
2. Verifique se a contagem corresponde ao número real de produtos vinculados

**Esperado**: A contagem deve estar correta (0 para marcas sem produtos, 1 ou mais para marcas com produtos).

## Problemas comuns

### Rota não aparece na barra lateral

**Sintoma**: Não é possível encontrar “Marcas” na navegação

**Causas e soluções**:

**Causa 1**: Configuração não exportada

- **Solução**: Certifique-se de exportar a configuração:

  ```typescript
  export const config = defineRouteConfig({
    label: "Brands",
    icon: TagSolid,
  })
  ```

**Causa 2**: Arquivo com nome incorreto

- **Solução**: Deve ser nomeado como `page.tsx` (não `route.tsx`)

**Causa 3**: Arquivo não está no local correto

- **Solução**: Deve estar em `src/admin/routes/brands/page.tsx`

### “404 Not Found” ao acessar /app/brands

**Sintoma**: Clicar no link resulta em erro 404

**Causa**: Estrutura do arquivo incorreta

**Solução**:
Certifique-se de que a estrutura seja:

```
src/admin/routes/brands/page.tsx
```

NÃO:

```
src/admin/routes/brands.tsx  ❌
src/admin/routes/brands/index.tsx  ❌
```

### A tabela aparece vazia / sem dados

**Sintoma**: A tabela é renderizada, mas não exibe nenhuma marca

**Causas e soluções**:

**Causa 1**: API de back-end não está funcionando

- **Solução**: Teste a API diretamente: `curl http://localhost:9000/admin/brands`
- Se a API retornar dados, o problema está no front-end
- Se a API retornar um resultado vazio, o problema está no back-end (consulte o Ponto de Verificação 2.3)

**Causa 2**: A consulta não está recuperando dados

- **Solução**: Verifique se há erros no Console das Ferramentas de Desenvolvedor do navegador
- Verifique a aba Rede — a solicitação está sendo enviada?

**Causa 3**: Incompatibilidade na estrutura dos dados

- **Solução**: Verifique se a API retorna no formato `{ brands: [...] }`
- Certifique-se de que `useQuery` esteja declarado como `BrandsResponse`

### “Não é possível ler a propriedade 'length' de undefined”

**Sintoma**: Erro de tempo de execução ao acessar produtos

**Causa**: Tentativa de acessar products.length quando products pode estar indefinido

**Solução**:
Use encadeamento opcional na definição da coluna:

```typescript
columnHelper.accessor("products", {
  header: "Products",
  cell: ({ getValue }) => {
    const products = getValue()
    return products?.length || 0
  },
})
```

### A paginação não está funcionando / sempre exibe os mesmos dados

**Sintoma**: Clicar em “próxima página” não altera os dados

**Causas e soluções**:

**Causa 1**: o offset não foi calculado corretamente

- **Solução**: Certifique-se de que offset = pageIndex * pageSize

**Causa 2**: A chave de consulta não inclui a paginação

- **Solução**: Inclua o offset na queryKey:

  ```typescript
  queryKey: ["brands", limit, offset]
  ```

**Causa 3**: O backend não está usando o parâmetro offset

- **Solução**: Verifique se o middleware passa o offset para query.graph()

### “Não é possível usar sdk.client.fetch”

**Sintoma**: Erro de TypeScript ou erro de tempo de execução

**Causa**: SDK não inicializado

**Solução**:

1. Verifique se o arquivo `src/admin/lib/sdk.ts` existe e se exporta `sdk`
2. Importe corretamente: `import { sdk } from "../../lib/sdk"`
3. Verifique se o número de `../` corresponde à sua estrutura de arquivos

### O estilo da tabela parece estar incorreto

**Sintoma**: A tabela aparece sem estilo ou com layout incorreto

**Causa**: Não está usando os componentes DataTable corretamente

**Solução**:
Use a estrutura completa do componente DataTable:

```tsx
<DataTable instance={table}>
  <DataTable.Toolbar>
    <Heading>Brands</Heading>
  </DataTable.Toolbar>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable>
```

### “Não foi possível encontrar o módulo '@medusajs/icons'”

**Sintoma**: Erro de importação de ícones

**Causa**: Pacote não instalado

**Solução**:
Os ícones estão incluídos no Medusa Admin. Verifique a importação:

```typescript
import { TagSolid } from "@medusajs/icons"
```

Se ainda assim não funcionar, verifique se as dependências do painel de administração estão instaladas:

```bash
npm install
```

### A contagem de produtos mostra 0 para todas as marcas

**Sintoma**: A tabela mostra 0 produtos, mesmo que existam links

**Causas e soluções**:

**Causa 1**: O backend não está incluindo os produtos na resposta

- **Solução**: Verifique se as configurações padrão do middleware incluem `"products.*"`

**Causa 2**: Links não criados

- **Solução**: Verifique se os links existem (consulte o Ponto de Verificação 2.2)

**Causa 3**: Coluna acessando a propriedade errada

- **Solução**: Certifique-se de que o acessador da coluna corresponda à estrutura da resposta da API

### Rota acessível por URL, mas não na barra lateral

**Sintoma**: É possível acessar <http://localhost:9000/app/brands>, mas não há link na barra lateral

**Causa**: Configuração não exportada ou exportada incorretamente

**Solução**:
É necessário exportar a configuração como exportação nomeada:

```typescript
export const config = defineRouteConfig({ ... })
```

NOT:

```typescript
export default defineRouteConfig({ ... })  ❌
```

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] A API GET /admin/brands do backend está funcionando (teste com o cURL)
- [ ] A rota aparece na barra de navegação lateral com o ícone
- [ ] Ao clicar em “Marcas”, a navegação direciona para /app/brands
- [ ] A tabela é exibida com o estilo correto
- [ ] A tabela mostra todas as marcas com as colunas: ID, Nome, Produtos
- [ ] A coluna “Produtos” mostra a contagem correta
- [ ] Os controles de paginação aparecem (se houver mais de 15 marcas)
- [ ] A paginação funciona (é possível navegar pelas páginas)
- [ ] Não há erros no console das Ferramentas de Desenvolvedor do navegador

## Compreensão da arquitetura

Neste ponto, você deve compreender:

**Estrutura das rotas da interface do usuário**:

```
File System                      URL                  Sidebar
src/admin/routes/brands/page.tsx → /app/brands     → "Brands" link
                ↓
        defineRouteConfig()
          - label: "Brands"
          - icon: TagSolid
```

**Fluxo de dados para as rotas da interface do usuário**:

```
1. User clicks "Brands" in sidebar
                │
                ▼
2. React Router navigates to /app/brands
                │
                ▼
3. BrandsPage component renders
                │
                ▼
4. useQuery fetches data
   - sdk.client.fetch("/admin/brands")
   - With limit & offset params
                │
                ▼
5. Backend: GET /admin/brands
   - Middleware validates query
   - Route handler calls query.graph()
   - Returns { brands, count, limit, offset }
                │
                ▼
6. Frontend: DataTable renders
   - Shows brands in table
   - Pagination controls use count & limit
```

**Arquitetura completa do recurso** (todas as 3 aulas):

```
┌─────────────────────────────────────────────────┐
│  Admin UI (Lesson 3)                            │
│  - Widget: Shows brand on product page          │
│  - UI Route: Brands management page             │
└─────────────────┬───────────────────────────────┘
                  │ HTTP Requests
                  ▼
┌─────────────────────────────────────────────────┐
│  API Routes (Lesson 1 & 2)                      │
│  - POST /admin/brands (create)                  │
│  - GET /admin/brands (list with products)       │
└─────────────────┬───────────────────────────────┘
                  │ Executes
                  ▼
┌─────────────────────────────────────────────────┐
│  Workflows (Lesson 1 & 2)                       │
│  - createBrandWorkflow (with rollback)          │
│  - productsCreated hook (auto-link)             │
└─────────────────┬───────────────────────────────┘
                  │ Uses
                  ▼
┌─────────────────────────────────────────────────┐
│  Modules & Links (Lesson 1 & 2)                 │
│  - Brand Module (data & service)                │
│  - Module Link (brand ↔ product)                │
└─────────────────────────────────────────────────┘
```

## Próximos passos

Assim que passar por este ponto de verificação:

1. **Lição 3 concluída!** Você criou uma interface de usuário administrativa completa:
   - SDK inicializado para chamadas de API
   - Widget de marcas de produtos nas páginas de produtos
   - Rota da interface de usuário de marcas com tabela de dados e paginação

2. **TODAS AS LIÇÕES CONCLUÍDAS!** 🎉 Você criou um recurso completo:

   **Back-end**:
   - Módulo de marcas (modelo de dados, serviço)
   - createBrandWorkflow (com reversão)
   - POST /admin/brands (API para criação de marca)
   - Link do módulo (marca ↔ produto)
   - Hook de workflow (vinculação automática na criação do produto)
   - GET /admin/brands (listar marcas com produtos)

   **Front-end**:
   - Widget de marca do produto (mostrar a marca na página do produto)
   - Rota da interface de usuário de marcas (gerenciar marcas por meio de uma tabela)

3. **Envie suas alterações**:

   ```bash
   git add .
   git commit -m "Complete Lesson 3: Admin dashboard customization"
   ```

4. **E agora?**

   **Agora você entende a arquitetura do Medusa** e pode criar funcionalidades personalizadas de forma independente:
   - Padrão Módulo → Fluxo de Trabalho → Rota de API
   - Links entre módulos para relações entre módulos
   - Ganchos de fluxo de trabalho para ampliar a funcionalidade básica
   - Personalização administrativa com widgets e rotas de interface do usuário

   **Considere desenvolver**:
   - Módulo de categorias (semelhante ao de marcas)
   - Recurso de avaliações de produtos
   - Listas de desejos
   - Formas de envio personalizadas
   - Alertas de estoque

   **Saiba mais**:
   - Padrões avançados de fluxo de trabalho
   - Componentes complexos de administração
   - Integração com a loja virtual
   - Testando seus recursos

**Parabéns!** 🎊 Você concluiu o tutorial interativo de aprendizagem do Medusa. Agora você está pronto para criar recursos de produção com o Medusa.
