# Ponto de verificação 1.2: Fluxo de trabalho da marca

Este ponto de verificação confirma se você criou com sucesso a função `createBrandWorkflow`, incluindo uma etapa e uma função de compensação.

## Questões de verificação

Antes de prosseguir, teste seu entendimento:

1. **Por que não podemos usar `async` ou `await` na função do fluxo de trabalho?**
   <details>
   <summary>Resposta</summary>

   Os fluxos de trabalho são modelos declarativos que definem a sequência de etapas. Eles não executam as etapas diretamente — isso é feito pelo mecanismo de fluxo de trabalho. Usar `async`/`await` significaria executar etapas durante a definição, o que rompe o modelo de orquestração. As etapas são chamadas de forma síncrona na função de fluxo de trabalho, e o mecanismo lida com a execução assíncrona.
   </details>

2. **O que é uma função de compensação e por que precisamos dela?**
   <details>
   <summary>Resposta</summary>

   Uma função de compensação é a lógica de “desfazer” de uma etapa. Se uma etapa posterior no fluxo de trabalho falhar, o Medusa chama automaticamente as funções de compensação para todas as etapas concluídas, na ordem inversa. Isso proporciona um revertimento automático — por exemplo, se a criação da marca for bem-sucedida, mas um upload posterior para o S3 falhar, a função de compensação exclui a marca para manter a consistência dos dados.
   </details>

3. **O que o `StepResponse` faz?**
   <details>
   <summary>Resposta</summary>

   O `StepResponse` retorna duas coisas: (1) os dados a serem passados para a próxima etapa e (2) os dados a serem passados para a função de compensação, caso seja necessário um rollback. Isso permite que você retorne dados diferentes para cenários de sucesso e de rollback.
   </details>

4. **Por que usamos `transform()` em vez de retornar diretamente a entrada do fluxo de trabalho?**
   <details>
   <summary>Resposta</summary>

   `transform()` é um utilitário que extrai e molda os dados a partir dos resultados da etapa. Ele garante a segurança de tipos e deixa claro quais dados estão sendo retornados. Embora seja possível retornar os resultados da etapa diretamente, `transform()` oferece melhor legibilidade do código e inferência de tipos.
   </details>

## Verificação da implementação

Gostaria de verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Arquivo de etapa

Mostre-me seu arquivo `src/workflows/create-brand/steps/create-brand.ts`.

**Pontos importantes a serem verificados**:

- [ ] A função da etapa está definida com `createStep()`
- [ ] O nome da etapa é descritivo (por exemplo, “create-brand”)
- [ ] A entrada possui o tipo correto em TypeScript
- [ ] Utiliza `container.resolve("brand")` para obter o serviço
- [ ] Chama `brandService.createBrands()` (observe o plural — trata-se de um método em lote)
- [ ] Retorna `new StepResponse(brand, brand.id)` (marca para a próxima etapa, id para compensação)
- [ ] A função de compensação aceita o parâmetro `brandId`
- [ ] A compensação identifica o serviço e chama `deleteBrands([brandId])`
- [ ] Possui verificação de nulo: `if (!brandId) return`

### 2. Arquivo de fluxo de trabalho

Mostre-me seu arquivo `src/workflows/create-brand/index.ts`.

**Pontos-chave a serem verificados**:

- [ ] Usa `createWorkflow()` com um nome exclusivo
- [ ] A função de fluxo de trabalho NÃO é assíncrona
- [ ] A função de fluxo de trabalho NÃO usa `await`
- [ ] A função `Workflow` NÃO é uma função-seta (usa a palavra-chave `function`)
- [ ] Chama `createBrandStep(input)` sem `await`
- [ ] Usa `transform()` para extrair a marca do resultado da etapa
- [ ] Retorna `new WorkflowResponse(brand)`

### 3. Compilação do teste

Execute este comando e compartilhe quaisquer erros:

```bash
npm run build
```

**Saída esperada**: A compilação deve ser bem-sucedida. O TypeScript não deve apresentar erros relacionados ao fluxo de trabalho.

## Problemas comuns

### “Função assíncrona não permitida no fluxo de trabalho”

**Sintoma**: Erro do TypeScript ou aviso de tempo de execução sobre assíncrono

**Causa**: Função de fluxo de trabalho declarada como `async function`

**Solução**:
Remova a palavra-chave `async`:

```typescript
// ❌ WRONG
createWorkflow("create-brand", async function (input) {
  // ...
})

// ✅ CORRECT
createWorkflow("create-brand", function (input) {
  // ...
})
```

### “Não é possível usar `await` no fluxo de trabalho”

**Sintoma**: Erro relacionado ao uso de `await`

**Causa**: Uso de `await` ao chamar etapas

**Solução**:
Remova `await` — as etapas são chamadas de forma síncrona:

```typescript
// ❌ WRONG
const result = await createBrandStep(input)

// ✅ CORRECT
const result = createBrandStep(input)
```

### “Não é possível resolver a marca”

**Sintoma**: Erro de tempo de execução ao executar o fluxo de trabalho

**Causa**: O nome do serviço não corresponde ao registro do módulo

**Solução**:
Use o nome exato do serviço com o sufixo “ModuleService”:

```typescript
const brandService = container.resolve("brand")
```

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] A compilação é bem-sucedida, sem erros
- [ ] Não há avisos do TypeScript sobre async/await
- [ ] O arquivo de etapa contém tanto a função de etapa quanto a compensação
- [ ] O arquivo de fluxo de trabalho usa a sintaxe correta (função, sem async, sem await)
- [ ] A função de compensação possui verificação de nulo
- [ ] Os métodos de serviço utilizam nomes no plural (createBrands, deleteBrands)
- [ ] StepResponse retorna tanto o resultado quanto os dados de compensação

## Compreensão da arquitetura

Neste ponto, você deve compreender:

- **Os fluxos de trabalho são declarativos**: eles definem o fluxo, não o executam
- **As etapas são composíveis**: é possível reutilizar etapas em diferentes fluxos de trabalho
- **A compensação oferece segurança**: reversão automática em caso de falha
- **O mecanismo cuida da execução**: as etapas são executadas de forma assíncrona, mas você as define de forma síncrona

**Exemplo de por que isso é importante**:

Imagine este fluxo de trabalho:

1. Criar marca
2. Enviar logotipo para o S3
3. Enviar notificação no Slack

Se a etapa 3 falhar, as funções de compensação para as etapas 2 e 1 são executadas automaticamente:

- Excluir o logotipo do S3
- Excluir a marca do banco de dados

Isso garante que seu sistema nunca fique em um estado inconsistente — é tudo ou nada.

## Próximos passos

Assim que este ponto de verificação for aprovado:

1. **Módulo de marca** criado
2. **Fluxo de trabalho da marca** criado com reversão
3. **Próximo**: Criar a rota da API (Parte 3 da Lição 1)

O fluxo de trabalho é responsável pela orquestração da lógica de negócios. Agora, vamos expô-lo por meio de uma rota de API HTTP que valida as entradas e executa o fluxo de trabalho.

**Pronto para continuar?** Avise-me quando todas as verificações forem aprovadas, e passaremos à criação da rota de API.
