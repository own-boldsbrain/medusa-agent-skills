# Ponto de verificação 1.3: Rota da API de marcas

Este ponto de verificação confirma se você criou com sucesso a rota da API POST /admin/brands com validação e middleware.

## Perguntas de verificação

Antes de prosseguir, teste seu entendimento:

1. **Por que executamos fluxos de trabalho a partir de rotas de API em vez de chamar serviços diretamente?**
   <details>
   <summary>Resposta</summary>

   Os fluxos de trabalho oferecem orquestração, reversão e gerenciamento de transações. Se você chamar serviços diretamente das rotas, precisará lidar manualmente com a lógica de reversão quando ocorrerem erros. Os fluxos de trabalho lidam com isso automaticamente por meio de funções de compensação. Isso se torna crucial à medida que sua lógica de negócios se torna mais complexa, com várias etapas.
   </details>

2. **O que o middleware `validateAndTransformBody` faz?**
   <details>
   <summary>Resposta</summary>

   Ele valida o corpo da solicitação recebida em relação a um esquema Zod ANTES que o manipulador da rota seja executado. Se a validação falhar, ele retorna automaticamente um erro 400 com os detalhes da validação. Se a validação for bem-sucedida, ele transforma os dados de acordo com o esquema e passa os dados validados para o seu manipulador. Isso garante que o seu manipulador receba apenas dados válidos.
   </details>

3. **Por que usamos `MedusaRequest` e `MedusaResponse` em vez dos tipos do Express?**
   <details>
   <summary>Resposta</summary>

   Esses são tipos específicos do Medusa que estendem os tipos do Express com propriedades adicionais, como `scope` (para injeção de dependências) e `queryConfig` (para filtragem/paginação). O uso desses tipos proporciona acesso seguro em termos de tipos aos recursos específicos do Medusa.
   </details>

4. **O que é o objeto `scope` e como ele funciona?**
   <details>
   <summary>Resposta</summary>

   `scope` é o contêiner de injeção de dependências do Medusa, com escopo restrito à solicitação atual. Você o passa para os fluxos de trabalho ao executá-los (por exemplo, `workflow(req.scope).run()`) e o utiliza para resolver serviços (por exemplo, `scope.resolve("query")`). Cada solicitação recebe seu próprio escopo, garantindo o isolamento adequado e permitindo configurações específicas para cada solicitação.
   </details>

## Verificação da implementação

Gostaria de verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Arquivo de esquema

Mostre-me seu arquivo `src/api/admin/brands/validators.ts`.

**Pontos-chave a serem verificados**:

- [ ] Importa `z` de "zod"
- [ ] Define `CreateBrandSchema` com `z.object()`
- [ ] Possui o campo `name` com `z.string()`
- [ ] Exporta o esquema como exportação nomeada

### 2. Arquivo de rota

Mostre-me seu arquivo `src/api/admin/brands/route.ts`.

**Pontos importantes a verificar**:

- [ ] Importa os tipos: `MedusaRequest`, `MedusaResponse`
- [ ] Importa o fluxo de trabalho: `import { createBrandWorkflow } from "..."`
- [ ] Importa o tipo de entrada do fluxo de trabalho: `CreateBrandWorkflowInput`
- [ ] Define a função `POST` (deve ser nomeada exatamente como `POST`)
- [ ] Utiliza o tipo: `MedusaRequest<CreateBrandWorkflowInput>`
- [ ] Executa o fluxo de trabalho: `await createBrandWorkflow(req.scope).run({ input: ... })`
- [ ] Extrai a marca do resultado: `result.result` ou `result.brand`
- [ ] Retorna JSON: `res.json({ brand })`
- [ ] Lida com erros usando try/catch

### 3. Arquivo de middleware

Mostre-me seu arquivo `src/api/middlewares.ts`.

**Pontos importantes a verificar**:

- [ ] Importa `defineMiddlewares`, `validateAndTransformBody`
- [ ] Importa `CreateBrandSchema`
- [ ] Exporta `default defineMiddlewares()`
- [ ] Possui o array `routes`
- [ ] A configuração da rota contém `matcher: "/admin/brands"`
- [ ] A configuração da rota contém `method: "POST"`
- [ ] A configuração da rota contém o array `middlewares` com `validateAndTransformBody()`

### 4. Servidor em execução

Inicie seu servidor de desenvolvimento:

```bash
npm run dev
```

**Resultado esperado**: O servidor deve iniciar sem erros. Verifique se não há erros relacionados a rotas ou middlewares ausentes.

## Problemas comuns

### Middleware não está em execução / validação não está funcionando

**Sintoma**: Dados inválidos passam sem erros de validação

**Causa**: O middleware não está configurado corretamente

**Solução**:

1. Verifique se `matcher` corresponde exatamente à sua rota: `"/admin/brands"`
2. Verifique se `method` está em maiúsculas: `"POST"`
3. Certifique-se de que `middlewares.ts` esteja no caminho correto: `src/api/middlewares.ts`
4. Reinicie o servidor de desenvolvimento após alterações no middleware

### “Array vazio retornado” ou “marca indefinida”

**Sintoma**: A API retorna uma resposta vazia ou uma marca indefinida

**Causa**: A marca não está sendo extraída corretamente do resultado do fluxo de trabalho

**Solução**:
Os resultados do fluxo de trabalho estão aninhados:

```typescript
const { result } = await workflow.run({ input: req.validatedBody })
const brand = result.result // Note: double .result

res.json({ brand })
```

O primeiro `.result` é o resultado da execução do fluxo de trabalho; o segundo `.result` é proveniente de `WorkflowResponse(brand)`.

### Rota não encontrada / erro 404

**Sintoma**: O cURL retorna 404

**Causa**: O arquivo não está no local correto ou não está nomeado corretamente

**Solução**:

1. Verifique se o arquivo está em: `src/api/admin/brands/route.ts`
2. Verifique se a função está exportada como `POST` (não como exportação padrão)
3. Reinicie o servidor de desenvolvimento
4. Verifique se a URL está correta: `http://localhost:9000/admin/brands`

### “Falha no fluxo de trabalho” sem erro específico

**Sintoma**: Falha genérica no fluxo de trabalho

**Causa**: Erro na execução da etapa (provavelmente em `createBrandStep`)

**Solução**:

1. Verifique os logs do servidor para obter a mensagem de erro detalhada
2. Verifique se o serviço de marca está acessível na etapa
3. Verifique se a conexão com o banco de dados está funcionando
4. Verifique se as migrações foram executadas com sucesso

### Erro do TypeScript: “A propriedade 'validatedBody' não existe”

**Sintoma**: A compilação falha com um erro do TS

**Causa**: Falta o tipo para o corpo validado

**Solução**:
Use o parâmetro de tipo genérico:

```typescript
export const POST = async (
  req: MedusaRequest<CreateBrandWorkflowInput>,
  res: MedusaResponse
) => {
  const input = req.validatedBody // TypeScript knows this is CreateBrandWorkflowInput
}
```

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] O servidor inicia sem erros
- [ ] A solicitação POST para `/admin/brands` é bem-sucedida
- [ ] A resposta contém o objeto “brand” com id e nome
- [ ] Uma solicitação inválida (sem nome) retorna o erro 400
- [ ] A marca é efetivamente salva (verifique com uma solicitação GET ou consulta ao banco de dados)
- [ ] A compilação é bem-sucedida: `npm run build`

## Verificação manual do banco de dados (opcional)

Se você quiser verificar se a marca foi realmente salva:

```bash
# Connect to your database
psql your_database_name

# Query brands table
SELECT * FROM brand;
```

Você deve ver a marca Nike que criou.

## Compreensão da arquitetura

Neste ponto, você já deve ter compreendido o padrão completo de três camadas:

```
┌─────────────────────────────────────────────────┐
│  API Route (HTTP Interface)                     │
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
│  - Provides CRUD operations                     │
│  - Isolated from other modules                  │
└─────────────────────────────────────────────────┘
```

**Por que isso é importante**:

- **Separação de interesses**: cada camada tem uma única responsabilidade
- **Reutilização**: o fluxo de trabalho pode ser chamado por meio de várias rotas (HTTP, GraphQL, CLI)
- **Testabilidade**: cada camada pode ser testada de forma independente
- **Manutenção**: alterações em uma camada não afetam as outras

## Próximos passos

Após passar por este ponto de verificação:

1. **Lição 1 concluída!** Você criou um recurso completo do zero:
   - Módulo de Marca (camada de dados)
   - createBrandWorkflow (lógica de negócios com reversão)
   - POST /admin/brands (interface HTTP com validação)

2. **Salve seu trabalho**:

   ```bash
   git add .
   git commit -m "Complete Lesson 1: Build custom brand feature"
   ```

3. **Próximo: Lição 2** - Estender o Medusa
   - Vincular marcas a produtos usando Module Links
   - Estender os fluxos de trabalho principais usando Workflow Hooks
   - Consultar dados vinculados entre módulos

**Pronto para a Lição 2?** É aqui que as coisas ficam realmente interessantes — você aprenderá como estender a funcionalidade principal do Medusa sem criar um fork do código-fonte.
