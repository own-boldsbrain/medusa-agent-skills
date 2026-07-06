# Ponto de verificação 2.1: Ligações entre módulos

Este ponto de verificação confirma se você definiu corretamente uma ligação entre os módulos “Marca” e “Produto” e se a sincronizou com o banco de dados.

## Questões de verificação

Antes de prosseguir, teste seu entendimento:

1. **Por que usamos ligações entre módulos em vez de importar diretamente de outro módulo?**
   <details>
   <summary>Resposta</summary>

   As ligações entre módulos mantêm o isolamento entre eles — os módulos não dependem do código uns dos outros. O Módulo “Marca” não importa entidades do Módulo “Produto”, e o Módulo “Produto” não importa entidades do Módulo “Marca”. Isso evita dependências circulares e permite que os módulos sejam desenvolvidos, testados e implantados de forma independente. As ligações são gerenciadas pela camada de ligação do Medusa, e não por referências diretas de módulo para módulo.
   </details>

2. **O que significa `isList: true` na definição de um link?**
   <details>
   <summary>Resposta</summary>

   `isList: true` significa que “uma marca pode ter vários produtos”. Sem isso (ou com `isList: false`), a relação seria de um para um. No nosso caso, queremos que uma marca (por exemplo, “Nike”) esteja vinculada a vários produtos (tênis, camisetas etc.), por isso usamos `isList: true`.
   </details>

3. **Qual é a finalidade de `BrandModule.linkable.brand`?**
   <details>
   <summary>Resposta</summary>

   `linkable` é um objeto de configuração exportado por cada módulo que declara a quais entidades é possível vincular. `BrandModule.linkable.brand` informa ao Medusa que “a entidade Brand no Módulo Brand pode ser usada em links”.
   </details>

4. **Por que colocamos os links no diretório `src/links` e não dentro de um módulo?**
   <details>
   <summary>Resposta</summary>

   Os links são separados dos módulos para enfatizar a independência dos módulos. Um link é uma relação gerenciada pela camada de links do Medusa, e não por nenhum dos módulos. Manter os links em um diretório separado deixa claro que eles são questões de infraestrutura, e não de lógica de negócios. Isso também facilita a visualização de todas as relações em sua aplicação de uma só vez.
   </details>

## Verificação da implementação

Deixe-me verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Configuração do módulo Brand para vinculação

Mostre-me seu arquivo `src/modules/brand/index.ts`.

**Pontos-chave a serem verificados**:

- [ ] O módulo é exportado com `Module()`
- [ ] O módulo possui a propriedade `service` apontando para BrandService
- [ ] Usa a constante `Modules.BRAND` como nome do módulo (ou a string “brand”)

### 2. Constantes do módulo Brand

Mostre-me se você criou o arquivo `src/modules/brand/types/index.ts` para as constantes do módulo.

**Pontos importantes a verificar**:

- [ ] Exporta `MODULE_NAME = "brand"`
- [ ] Exporta a constante `Modules.BRAND` (se estiver usando a enumeração Modules)

**Observação**: Você também pode definir a constante diretamente no arquivo index.ts ou usar um literal de string.

### 3. Arquivo de definição de links

Mostre-me seu arquivo `src/links/brand-product.ts`.

**Pontos importantes a verificar**:

- [ ] Importa `defineLink` de "@medusajs/framework/utils"
- [ ] Importa `Modules` de "@medusajs/framework/utils" (para referência ao ProductModule)
- [ ] Importa `BrandModule` de "../modules/brand"
- [ ] Chama `defineLink()` com dois argumentos
- [ ] O primeiro argumento configura o lado do produto:

  ```typescript
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  }
  ```

- [ ] O segundo argumento é `BrandModule.linkable.brand`
- [ ] O arquivo possui uma exportação padrão: `export default defineLink(...)`

### 4. Sincronização do banco de dados

Execute o comando de sincronização do banco de dados:

```bash
npx medusa db:sync-links
```

**Resultado esperado**: Deve indicar que o link foi criado com sucesso, sem erros. Você deverá ver uma saída mencionando a relação entre marca e produto.

### 5. Compilação e teste

Execute a compilação para garantir que não haja erros de TypeScript:

```bash
npm run build
```

**Resultado esperado**: A compilação deve ser bem-sucedida, sem erros relacionados a links ou módulos.

## Problemas comuns

### “Falha na sincronização de links” ou “Não é possível resolver o módulo”

**Sintoma**: O comando `db:sync-links` falha

**Causa**: O módulo não está registrado no `medusa-config.ts` ou o servidor não está reconhecendo o módulo

**Solução**:

1. Verifique se o módulo da marca está na matriz de módulos do `medusa-config.ts`
2. Reinicie o servidor de desenvolvimento: `npm run dev`
3. Tente a sincronização novamente: `npx medusa db:sync-links`

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] Arquivo de link criado no diretório `src/links/`
- [ ] O comando `db:sync-links` foi executado com sucesso
- [ ] A compilação foi bem-sucedida, sem erros do TypeScript
- [ ] O servidor de desenvolvimento inicia sem erros relacionados a links

## Compreensão da arquitetura

Neste ponto, você deve compreender:

**Isolamento de módulos**:

```
┌─────────────┐           ┌──────────────┐
│   Brand     │           │   Product    │
│   Module    │           │   Module     │
│             │           │              │
│  - No direct imports between modules   │
│  - Each module is independent          │
└─────────────┘           └──────────────┘
       │                         │
       └────────┬────────────────┘
                │
         ┌──────▼────────┐
         │  Link Layer   │
         │  (Medusa)     │
         │               │
         │  Manages      │
         │  relationships│
         └───────────────┘
```

**Por que as ligações entre módulos são importantes**:

- **Flexibilidade**: os módulos podem ser adicionados ou removidos sem afetar os demais
- **Testabilidade**: é possível testar o Módulo Marca sem precisar do Módulo Produto
- **Escalabilidade**: os módulos podem ser extraídos para pacotes separados
- **Controle de versões**: os módulos podem evoluir de forma independente

## Próximos passos

Assim que este ponto de verificação for concluído:

1. **Vínculo entre módulos** definido entre Marca e Produto
2. **Banco de dados** sincronizado com a relação de vínculo
3. **Próximo**: Utilizar ganchos de fluxo de trabalho (Parte 2 da Lição 2)

O vínculo agora está definido no nível da infraestrutura. A seguir, vamos torná-lo funcional utilizando o gancho de fluxo de trabalho `productsCreated` para vincular automaticamente as marcas aos produtos quando estes forem criados.

**Pronto para continuar?** Avise-me quando todas as verificações forem aprovadas, e passaremos para os ganchos de fluxo de trabalho.
