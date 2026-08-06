# Erros comuns e soluções

Este é um catálogo abrangente dos erros que você pode encontrar ao aprender a desenvolver com o Medusa. Os erros estão organizados por categoria, com sintomas, causas e soluções passo a passo.

## Erros de módulo

### “Não é possível encontrar o módulo 'brand'”

**Sintoma**: A compilação falha ou o servidor trava com um erro de módulo não encontrado

**Causa**: Módulo não registrado no `medusa-config.ts`

**Solução**:

1. Abra o `medusa-config.ts`
2. Adicione o módulo à matriz `modules`:

   ```typescript
   modules: [
     {
       resolve: "./modules/brand",
       options: {},
     },
   ]
   ```

3. Reinicie o servidor de desenvolvimento: `npm run dev`

---

### “O nome do módulo deve estar em camelCase”

**Sintoma**: Erro relacionado à convenção de nomenclatura de módulos

**Causa**: Utilização de kebab-case ou PascalCase no nome do módulo

**Solução**:
Use camelCase na definição do módulo:

```typescript
// ❌ WRONG
export default Module("brand-module", { ... })
export default Module("BrandModule", { ... })

// ✅ CORRECT
export default Module("brand", { ... })
```

---

### “A propriedade 'brand' não existe no tipo...”

**Sintoma**: Erros do TypeScript relacionados a propriedades ausentes

**Causa**: O Medusa não regenerou os tipos para o novo módulo

**Solução**:

1. Verifique se as migrações foram executadas com sucesso: `npx medusa db:migrate`
2. Reinicie o servidor de desenvolvimento (isso regenera os tipos): `npm run dev`
3. Se o problema persistir, recompile: `npm run build`

---

## Erros no fluxo de trabalho

### “Função assíncrona não permitida no fluxo de trabalho”

**Sintoma**: Erro do TypeScript ou aviso de tempo de execução

**Causa**: Função do fluxo de trabalho declarada como `async function`

**Solução**:
Remova a palavra-chave `async` da função do fluxo de trabalho:

```typescript
// ❌ WRONG
createWorkflow("name", async function (input) {
  // ...
})

// ✅ CORRECT
createWorkflow("name", function (input) {
  // ...
})
```

---

### “Não é possível usar `await` no fluxo de trabalho”

**Sintoma**: Erro relacionado ao uso de `await`

**Causa**: Uso de `await` ao chamar etapas

**Solução**:
Remova `await` — as etapas são chamadas de forma síncrona na definição do fluxo de trabalho:

```typescript
// ❌ WRONG
const result = await createBrandStep(input)

// ✅ CORRECT
const result = createBrandStep(input)
```

---

## Erros de rota da API

### “Middleware não está em execução / validação não está funcionando”

**Sintoma**: Dados inválidos são aceitos sem erros

**Causa**: Middleware não configurado corretamente

**Solução**:

1. Verifique se `matcher` corresponde exatamente à rota: `"/admin/brands"`
2. Verifique se `method` está em maiúsculas: `"POST"`
3. Certifique-se de que o arquivo esteja em `src/api/middlewares.ts`
4. Reinicie o servidor de desenvolvimento após alterações no middleware

---

### “Rota não encontrada” / erro 404

**Sintoma**: o cURL ou o navegador retorna 404

**Causa**: O arquivo não está no local correto ou não está nomeado corretamente

**Solução**:

1. Certifique-se de que o arquivo esteja em `src/api/admin/brands/route.ts`
2. Certifique-se de que a função seja exportada com o nome correto: `export const POST`
3. Reinicie o servidor de desenvolvimento
4. Verifique se a URL está correta: `http://localhost:9000/admin/brands`

---

## Erros de link do módulo

### “Falha na sincronização do link”

**Sintoma**: `npx medusa db:sync-links` falha

**Causa**: Módulo não registrado ou servidor não reconhecendo o módulo

**Solução**:

1. Verifique se o módulo está no `medusa-config.ts`
2. Reinicie o servidor de desenvolvimento: `npm run dev`
3. Tente a sincronização novamente: `npx medusa db:sync-links`

---

## Erros de consulta

### “metadata is undefined”

**Sintoma**: Erro ao acessar count, take, skip

**Causa**: Desestruturação incorreta (não deveria ocorrer, mas trate com cautela)

**Solução**:
Use valores padrão:

```typescript
const {
  data: brands,
  metadata: { count, take, skip } = {},
} = await query.graph({ ... })

res.json({
  brands,
  count: count || 0,
  limit: take || 15,
  offset: skip || 0,
})
```

---

### “Campo ‘products’ não incluído”

**Sintoma**: Os objetos de marca não possuem a matriz de produtos

**Causa**: As configurações padrão do middleware não incluem a relação de produtos

**Solução**:
Adicione às configurações padrão do middleware:

```typescript
validateAndTransformQuery(GetBrandsSchema, {
  defaults: ["id", "name", "products.*"],
  isList: true,
})
```

---

## Erros na interface de administração

### “Não é possível encontrar o módulo '@tanstack/react-query'” (usuários do pnpm)

**Sintoma**: Erro de compilação ou de execução

**Causa**: Resolução rigorosa de dependências do pnpm

**Solução**:
Encontre a versão exata e instale:

```bash
pnpm list @tanstack/react-query --depth=10 | grep @medusajs/dashboard
pnpm add @tanstack/react-query@5.x.x
```

---

### “Widget não está sendo exibido”

**Sintoma**: O widget não aparece na página

**Causas e soluções**:

**Causa 1**: Nome de zona incorreto

- **Solução**: Use a zona exata: `"product.details.before"`

**Causa 2**: Configuração não exportada

- **Solução**: Exportar a configuração:

  ```typescript
  export const config = defineWidgetConfig({ zone: "..." })
  ```

**Causa 3**: Arquivo não está no local correto

- **Solução**: Verifique se o arquivo está em `src/admin/widgets/[nome].tsx`

**Causa 4**: Servidor de desenvolvimento não reiniciado

- **Solução**: Reinicie: `npm run dev`

**Causa 5**: Componente não exportado por padrão

- **Solução**: Adicione exportação padrão:

  ```typescript
  export default WidgetComponent
  ```

---

### “Rota não aparece na barra lateral”

**Sintoma**: Não é possível visualizar a rota na navegação

**Causas e soluções**:

**Causa 1**: Configuração não exportada

- **Solução**: Exportar a configuração:

  ```typescript
  export const config = defineRouteConfig({
    label: "Brands",
    icon: TagSolid,
  })
  ```

**Causa 2**: Nome de arquivo incorreto

- **Solução**: Deve ser `page.tsx` (não `route.tsx` ou `index.tsx`)

**Causa 3**: Arquivo não está no local correto

- **Solução**: Deve estar em `src/admin/routes/brands/page.tsx`

**Causa 4**: Servidor de desenvolvimento não reiniciado

- **Solução**: Reinicie o servidor de desenvolvimento

---

### “sdk não está definido”

**Sintoma**: Erro de tempo de execução relacionado ao sdk

**Causa**: O SDK não foi importado ou inicializado

**Solução**:

1. Crie o arquivo `src/admin/lib/sdk.ts`:

   ```typescript
   import Medusa from "@medusajs/js-sdk"

   export const sdk = new Medusa({
     baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
     debug: import.meta.env.DEV,
     auth: { type: "session" },
   })
   ```

2. Importe no widget/route:

   ```typescript
   import { sdk } from "../../lib/sdk"
   ```

---

## Erros de banco de dados

### “Conexão recusada” / “Não é possível conectar-se ao banco de dados”

**Sintoma**: O servidor não consegue se conectar ao PostgreSQL

**Causa**: Banco de dados não está em execução ou credenciais incorretas

**Solução**:

1. Verifique se o banco de dados está em execução:

   ```bash
   # macOS with Homebrew
   brew services list
   brew services start postgresql

   # Linux with systemd
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. Verifique as credenciais no arquivo `.env`:

   ```
   DATABASE_URL=postgres://user:password@localhost:5432/medusa-db
   ```

3. Testar conexão:

   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

---

### “Permissão negada para a relação”

**Sintoma**: Erro de permissão SQL

**Causa**: O usuário do banco de dados não possui as permissões necessárias

**Solução**:
Conceda permissões ao usuário:

```bash
psql postgres -c "ALTER USER your_user CREATEDB;"
psql your_database -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;"
```

---

## Erros de compilação

---

## Convenções de dados e erros comuns

### Valores de preço incorretos

**Sintoma**: Preços exibidos incorretamente (por exemplo, aparecendo como $1999 em vez de $19,99)

**Causa**: Uso de centavos/menor unidade monetária em vez do valor real do preço

**Solução**:
O Medusa armazena os preços exatamente como estão, NÃO em centavos ou na menor unidade monetária:

```typescript
// ❌ WRONG - Using cents
{
  "amount": 1999,  // This will display as $1999, not $19.99
  "currency_code": "usd"
}

// ✅ CORRECT - Using actual price
{
  "amount": 19.99,  // This displays correctly as $19.99
  "currency_code": "usd"
}
```

**Exemplos**:

- $10,00 → `"amount": 10` (não `1000`)
- €25,50 → `"amount": 25,50` (não `2550`)
- ¥1.000 → `"amount": 1.000` (não `100.000`)

**Por que isso é importante**: Sistemas de pagamento como o Stripe usam centavos, mas o Medusa faz a conversão internamente. Sempre use o valor real do preço em suas solicitações e modelos de dados.

---

## Dicas gerais de depuração

1. **Verifique os logs**: Sempre leia as mensagens de erro com atenção
2. **Reinicie o servidor**: Muitos problemas são resolvidos com uma reinicialização
3. **Isole o problema**: Teste os componentes independentemente
4. **Use TypeScript**: erros de tipo geralmente revelam problemas logo no início

## Obtenha mais ajuda

Se você encontrar um erro que não esteja listado aqui:

1. **Consulte a documentação oficial**: [docs.medusajs.com](https://docs.medusajs.com)
2. **Pesquise nas issues do GitHub**: [github.com/medusajs/medusa](https://github.com/medusajs/medusa)
3. **Pergunte no Discord**: [discord.gg/medusajs](https://discord.gg/medusajs)
4. **Use o servidor MCP**: consulte o MedusaDocs para obter as informações mais recentes

Ao pedir ajuda, inclua:

- Mensagem de erro (trace completo da pilha)
- Passos para reproduzir o problema
- Seu código (arquivos relevantes)
- Versão do Medusa: `npx medusa --version`
- Versão do Node: `node --version`
