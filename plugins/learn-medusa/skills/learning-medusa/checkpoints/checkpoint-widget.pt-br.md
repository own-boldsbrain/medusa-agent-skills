# Ponto de verificação 3.1: Widget da marca do produto

Este ponto de verificação confirma se você criou com sucesso um widget que exibe a marca de um produto na página de detalhes do produto.

## Perguntas de verificação

Antes de prosseguir, teste seu entendimento:

1. **O que é um widget e em que ele difere de uma rota de interface do usuário?**

  **Resposta:**

  Um widget é um componente React inserido em uma página de administração existente em uma zona predefinida. Ele amplia as páginas existentes sem substituí-las. Uma rota de interface do usuário (UI) é uma página totalmente nova que você cria. Use widgets quando quiser adicionar informações a páginas existentes (como adicionar a marca aos detalhes do produto). Use rotas de interface do usuário quando precisar de uma nova página independente (como uma página de gerenciamento de marcas).

1. **Por que precisamos buscar novamente os dados do produto no widget se a página já carrega o produto?**

  **Resposta:**

  A página de detalhes do produto não inclui relações vinculadas por padrão (como a marca). Precisamos solicitar explicitamente os dados da marca usando o parâmetro `fields`. O widget busca o mesmo produto, mas com `fields: "+brand.*"` para incluir a relação de marca. O React Query armazena isso em cache, portanto, não é ineficiente.

1. **O que é o `queryKey` do React Query e por que ele é importante?**

  **Resposta:**

  `queryKey` é um identificador exclusivo para uma consulta. O React Query o utiliza para armazenamento em cache, recarga e invalidação. A chave deve incluir todas as dependências — no nosso caso, `["product", product.id, "brand"]`. Se o ID do produto mudar, o React Query saberá que deve buscar dados diferentes. Se você alterar uma marca, poderá invalidar essa chave para recarregar dados atualizados.

1. **Por que os widgets usam componentes da Medusa UI em vez de HTML/CSS comuns?**

  **Resposta:**

   Os componentes da Medusa UI mantêm a consistência de design com o restante do painel de administração (cores, espaçamento, tipografia, interações). Eles também são acessíveis e responsivos por padrão. Usar HTML/CSS padrão faria com que seu widget parecesse fora de lugar e exigiria trabalho extra de estilização.
   </details>

## Verificação da implementação

Gostaria de verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Configuração do SDK

Mostre-me seu arquivo `src/admin/lib/sdk.ts`.

**Pontos importantes a verificar**:

- [ ] Importa `Medusa` de "@medusajs/js-sdk"
- [ ] Cria uma instância do SDK com `new Medusa()`
- [ ] Configura `baseUrl` usando `import.meta.env.VITE_BACKEND_URL` ou "/"
- [ ] Define `debug: import.meta.env.DEV`
- [ ] Define `auth.type: "session"`
- [ ] Exporta como `export const sdk`

### 2. Arquivo do componente widget

Mostre-me o seu arquivo `src/admin/widgets/product-brand.tsx`.

**Pontos importantes a verificar**:

- [ ] Importa `defineWidgetConfig` de "@medusajs/admin-sdk"
- [ ] Importa tipos: `DetailWidgetProps`, `AdminProduct` de "@medusajs/framework/types"
- [ ] Importa componentes de interface do usuário: `Container`, `Heading`, `Text` de "@medusajs/ui"
- [ ] Importa `useQuery` de "@tanstack/react-query"
- [ ] Importa `sdk` de "../lib/sdk"
- [ ] Define o tipo `AdminProductBrand`, que estende `AdminProduct` com a propriedade “brand”
- [ ] Props do componente: `DetailWidgetProps<AdminProduct>`
- [ ] Desestrutura o produto: `{ data: product }`
- [ ] Configuração do useQuery:
  - `queryFn` chama `sdk.admin.product.retrieve()` com `fields: "+brand.*"`
  - `queryKey` inclui product.id
- [ ] Gerencia o estado de carregamento
- [ ] Exibe o nome da marca ou “-” se não houver marca
- [ ] Usa os componentes Container, Heading e Text
- [ ] Exporta a configuração: `defineWidgetConfig({ zone: "product.details.before" })`
- [ ] Exporta o componente por padrão

### 3. Servidor de desenvolvimento em execução

Verifique se o servidor de desenvolvimento está em execução com o usuário admin:

```bash
npm run dev
```

**Esperado**: O servidor inicia e o painel de administração fica acessível em <http://localhost:9000/app>

### 4. Teste manual no navegador

1. Abra o painel de administração: <http://localhost:9000/app>
2. Navegue até a página Produtos
3. Clique em um produto que tenha uma marca (criada na Lição 2)
4. Procure o widget “Marca” na PARTE SUPERIOR da página de detalhes do produto

**Esperado**:

- O widget aparece com o título “Marca”
- Exibe o nome da marca (por exemplo, “Nike”)
- O estilo do widget corresponde ao dos outros widgets do painel de administração

### 5. Teste com um produto sem marca

1. Navegue até um produto que não tenha uma marca
2. Verifique o widget

**Esperado**:

- O widget continua aparecendo
- Exibe “-” no lugar do nome da marca (indicando que não há marca)

## Problemas comuns

### “Não é possível encontrar o módulo '@tanstack/react-query'” (usuários do pnpm)

**Sintoma**: Erro de compilação ou erro de execução relacionado à ausência do react-query

**Causa**: Resolução rigorosa de dependências do pnpm

**Solução**:
Descubra a versão exata usada pelo Medusa:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
```

Instale essa versão específica:

```bash
pnpm add @tanstack/react-query@5.x.x
```

### Widget não aparece na página do produto

**Sintoma**: Ao acessar a página do produto, o widget não aparece

**Causas e soluções**:

**Causa 1**: Nome da zona incorreto

- **Solução**: Use a zona exata: `"product.details.before"`

**Causa 2**: Configuração não exportada

- **Solução**: Certifique-se de exportar a configuração:

  ```typescript
  export const config = defineWidgetConfig({ zone: "product.details.before" })
  ```

**Causa 3**: Arquivo não está no local correto

- **Solução**: Certifique-se de que o arquivo esteja em `src/admin/widgets/product-brand.tsx`

**Causa 4**: Falta a exportação padrão

- **Correção**: Certifique-se de que o componente seja exportado por padrão:

  ```typescript
  export default ProductBrandWidget
  ```

### “Não é possível ler a propriedade 'brand' de undefined”

**Sintoma**: Erro de tempo de execução ao acessar a marca

**Causa**: A estrutura do resultado da consulta não está devidamente tipada

**Solução**:
Tipifique o resultado da consulta corretamente:

```typescript
const { data: queryResult } = useQuery({ ... })
const brandName = (queryResult?.product as AdminProductBrand)?.brand?.name
```

Use encadeamento opcional em todo o código.

### A marca aparece como “-”, mesmo que o produto tenha uma marca

**Sintoma**: O widget exibe “-” em vez do nome da marca

**Causas e soluções**:

**Causa 1**: parâmetro “fields” incorreto

- **Solução**: Use `"+brand.*"` (com o sinal +)

**Causa 2**: Link não criado

- **Solução**: Verifique se o link existe (consulte o Ponto de Verificação 2.2)

**Causa 3**: Extração da marca do local errado

- **Solução**: Verifique a estrutura do `queryResult`

### “sdk não está definido”

**Sintoma**: Erro de tempo de execução relacionado ao SDK

**Causa**: SDK não importado ou inicializado

**Solução**:

1. Crie `src/admin/lib/sdk.ts` (consulte Verificação de Implementação nº 1)
2. Importação no widget: `import { sdk } from "../lib/sdk"`

### O estilo do widget parece errado / não combina com o painel

**Sintoma**: O widget apresenta cores, espaçamento ou fonte diferentes

**Causa**: Não está sendo utilizado os componentes da Medusa UI ou foi adicionado CSS personalizado

**Solução**:
Utilize apenas os componentes da Medusa UI:

```typescript
import { Container, Heading, Text } from "@medusajs/ui"

// Use Container for the widget wrapper
<Container className="divide-y p-0">
  // Use Heading for title
  <Heading level="h2">Brand</Heading>
  // Use Text for content
  <Text size="small">{brandName}</Text>
</Container>
```

### O widget aparece na parte inferior em vez de na parte superior

**Sintoma**: O widget é exibido depois de todas as outras seções

**Causa**: Zona incorreta utilizada

**Solução**:
Use a zona `"product.details.before"` (em vez de `.after`):

```typescript
export const config = defineWidgetConfig({
  zone: "product.details.before",
})
```

### Erros do TypeScript relacionados às propriedades do widget

**Sintoma**: A compilação falha com erros do TS relacionados às propriedades

**Causa**: Tipo de propriedade incorreto

**Solução**:
Use DetailWidgetProps genérico:

```typescript
const ProductBrandWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  // ...
}
```

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] SDK inicializado em src/admin/lib/sdk.ts
- [ ] Arquivo do widget criado em src/admin/widgets/
- [ ] O widget aparece na página de detalhes do produto (antes de outras seções)
- [ ] Exibe o nome da marca para produtos com marcas
- [ ] Exibe “-” para produtos sem marcas
- [ ] O estilo está alinhado com os outros widgets de administração
- [ ] Não há erros no console das Ferramentas de Desenvolvedor do navegador

## Compreensão da arquitetura

Neste momento, você deve compreender:

**Sistema de injeção de widgets**:

```bash
Admin Product Detail Page
┌────────────────────────────────────┐
│  Page Header                       │
│  (Medusa Core)                     │
├────────────────────────────────────┤
│  ← zone: product.details.before    │ ← Your widget injected here
│  ┌──────────────────────────────┐ │
│  │   Your Widget:               │ │
│  │   Brand: Nike                │ │
│  └──────────────────────────────┘ │
├────────────────────────────────────┤
│  Product Information               │
│  (Medusa Core)                     │
├────────────────────────────────────┤
│  Variants Section                  │
│  (Medusa Core)                     │
├────────────────────────────────────┤
│  ← zone: product.details.after     │
└────────────────────────────────────┘
```

**Por que os widgets são importantes**:

- **Não invasivos**: ampliam as páginas sem modificar o código principal
- **Componíveis**: vários widgets podem usar a mesma zona
- **Seguros em atualizações**: as atualizações do código principal das páginas não prejudicam seus widgets
- **Contextuais**: recebem dados da página como props

**Cache do React Query**:

- Primeira visita: busca o produto com a marca
- Navegar para outra página e voltar: usa dados em cache (instantâneo)
- Recarga em segundo plano: mantém os dados atualizados
- Mutação: invalida o cache para acionar a recarga

## Próximos passos

Assim que este ponto de verificação for aprovado:

1. **SDK** inicializado para chamadas de API
2. **Widget de marca do produto** exibindo a marca na página do produto
3. **Próximo**: Criar a rota de interface do usuário “Marcas” (Parte 3 da Lição 3)

O widget aprimora a página do produto existente. A seguir, criaremos uma página de administração totalmente nova para gerenciar todas as marcas em uma tabela com paginação.

**Pronto para continuar?** Avise-me quando todos os testes forem aprovados, e criaremos a página de gerenciamento de marcas.
