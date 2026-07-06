# Ponto de verificação 2.2: Ganchos de fluxo de trabalho

Este ponto de verificação confirma se você utilizou corretamente o gancho de fluxo de trabalho `productsCreated` para vincular marcas a produtos e configurou a validação de `additional_data`.

## Perguntas de verificação

Antes de prosseguir, teste seu entendimento:

1. **O que são ganchos de fluxo de trabalho e por que são úteis?**
   <details>
   <summary>Resposta</summary>

   Os ganchos de fluxo de trabalho são pontos de injeção nos fluxos de trabalho principais do Medusa, nos quais você pode adicionar lógica personalizada. Eles permitem que você amplie a funcionalidade principal (como a criação de produtos) sem precisar fazer um fork do código do Medusa. Quando um fluxo de trabalho principal chega a um ponto de gancho, ele executa todos os assinantes de ganchos registrados, permitindo que seu código personalizado seja executado como parte do fluxo padrão.
   </details>

2. **Por que precisamos tanto de uma função de etapa quanto de uma função de compensação no hook?**
   <details>
   <summary>Resposta</summary>

   Os assinantes do hook são tratados como etapas do fluxo de trabalho, o que significa que precisam de compensação em caso de reversão. Se a criação do produto for bem-sucedida e o link for criado, mas uma etapa posterior falhar (por exemplo, a alocação de estoque), a função de compensação remove o link para manter a consistência dos dados. Isso garante que os links só sejam mantidos quando toda a criação do produto for bem-sucedida.
   </details>

3. **O que é `additional_data` e por que o usamos?**
   <details>
   <summary>Resposta</summary>

   `additional_data` é um objeto flexível nos fluxos de trabalho principais do Medusa que permite passar dados personalizados sem modificar os tipos de fluxo de trabalho principais. Para a criação de produtos, nós o usamos para passar o `brand_id` da solicitação da API para nosso assinante de hook. Esse é o padrão para estender os fluxos de trabalho principais com parâmetros personalizados.
   </details>

4. **Por que precisamos configurar a validação de `additional_data` no middleware?**
   <details>
   <summary>Resposta</summary>

   Sem uma configuração de validação, o Medusa não permitirá o `brand_id` no corpo da solicitação — ele seria filtrado ou causaria erros de validação. O `additionalDataValidator` no middleware informa ao Medusa que “é permitido aceitar o brand_id em additional_data” e o valida de acordo com o seu esquema antes que a solicitação chegue ao fluxo de trabalho.
   </details>

## Verificação da implementação

Gostaria de verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Arquivo do assinante do hook

Mostre-me seu arquivo `src/workflows/hooks/product-brand-link.ts` (ou onde quer que você tenha definido o hook).

**Pontos importantes a verificar**:

- [ ] Importa `createProductsWorkflow` de "@medusajs/medusa/core-flows"
- [ ] Importa `StepResponse` de "@medusajs/framework/workflows-sdk"
- [ ] Importa `ContainerRegistrationKeys` de "@medusajs/framework/utils"
- [ ] Chama `createProductsWorkflow.hooks.productsCreated()`
- [ ] O hook possui uma função de etapa assíncrona: `async ({ products, additional_data }, { container }) => { ... }`
- [ ] O hook possui uma função de compensação assíncrona: `async (links, { container }) => { ... }`
- [ ] Função do passo:
  - Resolve o serviço de links: `container.resolve(ContainerRegistrationKeys.LINK)`
  - Extrai o brand_id de additional_data
  - Cria links usando `link.create()`
  - Retorna `new StepResponse(links, links)`
- [ ] Função de compensação:
  - Verifica se os links existem: `if (!links?.length) return`
  - Resolve o serviço de links
  - Desativa os links: `link.dismiss(links)`

### 2. Configuração do middleware

Mostre-me seu arquivo `src/api/middlewares.ts` (especificamente a configuração POST /admin/products).

**Pontos importantes a verificar**:

- [ ] Importa `createFindParams` e `createOperatorMap` de "@medusajs/medusa/api/utils/validators"
- [ ] Define `CreateProductSchema` ou algo semelhante com Zod
- [ ] O esquema inclui o campo `additional_data`:

  ```typescript
  additional_data: z.object({
    brand_id: z.string().optional(),
  }).optional()
  ```

- [ ] Configuração da rota:
  - Matcher: `"/admin/products"`
  - Método: `"POST"`
  - Utiliza `validateAndTransformBody()` com esquema e `additionalDataValidator`
  - Exemplo:

  ```typescript
  validateAndTransformBody(CreateProductSchema, {
    additionalDataValidator: {
      brand_id: z.string(),
    },
  })
  ```

### 3. Teste: Criar produto com marca

Com o servidor de desenvolvimento em execução, teste a criação de um produto com brand_id:

```bash
curl -X POST http://localhost:9000/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Air Max 90",
    "additional_data": {
      "brand_id": "brand_..."
    }
  }'
```

**Substitua `brand_...` pelo ID real da marca** do seu banco de dados (use a marca Nike que você criou na Lição 1).

**Resultado esperado**: O produto deve ser criado com sucesso, com um ID de produto.

## Problemas comuns

### “Hook não está sendo executado” / Link não criado

**Sintoma**: O produto é criado, mas o link não existe

**Causas e soluções**:

**Causa 1**: O arquivo do hook não está no local correto

- **Solução**: Verifique se o arquivo está no diretório `src/workflows/` (o Medusa detecta automaticamente os hooks neste local)
- **Solução**: Reinicie o servidor de desenvolvimento após criar o arquivo do hook

**Causa 2**: brand_id não foi passado na solicitação

- **Solução**: Inclua `additional_data: { brand_id: "..." }` no corpo da solicitação POST

**Causa 3**: Validação de additional_data não configurada

- **Solução**: Verifique a configuração do middleware (veja abaixo)

**Causa 4**: O hook apresenta erros de sintaxe

- **Solução**: Verifique se há erros nos logs do servidor

### “Erro de validação: additional_data não permitido”

**Sintoma**: Erro 400 ao enviar uma solicitação POST com additional_data

**Causa**: O middleware não está configurado para aceitar additional_data

**Solução**:
Em `src/api/middlewares.ts`, adicione a configuração para a solicitação POST /admin/products:

```typescript
{
  matcher: "/admin/products",
  method: "POST",
  middlewares: [
    validateAndTransformBody(
      CreateProductSchema,
      {
        additionalDataValidator: {
          brand_id: z.string(),
        },
      }
    ),
  ],
}
```

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] Arquivo de hook criado no diretório `src/workflows/`
- [ ] O servidor inicia sem erros relacionados ao hook
- [ ] Middleware configurado para POST /admin/products com additionalDataValidator
- [ ] A compilação é bem-sucedida: `npm run build`

## Compreensão da arquitetura

Neste ponto, você já deve ter compreendido:

**Como os hooks ampliam os fluxos de trabalho do núcleo**:

```
Core Workflow: createProductsWorkflow
┌─────────────────────────────────────┐
│ 1. Validate input                   │
│ 2. Create products                  │
│ 3. → HOOK: productsCreated ←        │ ← Your custom logic runs here
│    ↳ Your hook: Link to brand       │
│ 4. Handle inventory                 │
│ 5. Publish events                   │
└─────────────────────────────────────┘
```

**Por que isso é importante**:

- **Sem bifurcação**: você não modifica o código do Medusa
- **Seguro para atualizações**: seus hooks continuam funcionando quando o Medusa é atualizado
- **Componível**: vários hooks podem se inscrever no mesmo ponto
- **Reversão incluída**: Seu hook recebe compensação automática

**Exemplo**: Se a alocação de estoque (etapa 4) falhar:

1. O Medusa chama a função de compensação do seu hook
2. Seu hook remove a ligação entre marca e produto
3. O Medusa chama a compensação de criação do produto
4. O produto é excluído do banco de dados
5. Tudo é revertido — tudo ou nada

## Próximos passos

Assim que este ponto de verificação for concluído:

1. **Link do módulo** definido
2. **Hook de fluxo de trabalho** consumindo o evento `productsCreated`
3. **Próximo**: Consultar registros vinculados (Parte 3 da Lição 2)

Agora, a ligação é criada automaticamente quando os produtos são criados. A seguir, aprenderemos como consultar dados vinculados para recuperar marcas com seus produtos e vice-versa.

**Pronto para continuar?** Avise-me quando todas as verificações forem aprovadas, e passaremos à consulta de registros vinculados.
