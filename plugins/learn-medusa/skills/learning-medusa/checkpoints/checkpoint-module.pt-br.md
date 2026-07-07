# Ponto de verificação 1.1: Módulo Brand

Este ponto de verificação confirma se você criou com sucesso o Módulo Brand, incluindo seu modelo de dados, serviço e migrações.

## Questões de verificação

Antes de prosseguir, teste seu entendimento:

1. **O que o `MedusaService()` faz?**
   <details>
   <summary>Resposta</summary>

   O `MedusaService()` é uma fábrica de serviços fornecida pelo Medusa que gera um serviço com métodos CRUD (criar, atualizar, recuperar, listar, excluir) para o seu modelo de dados. Isso evita que você precise escrever código repetitivo.
   </details>

2. **Por que o nome do módulo é “brand” e não “brand-module”?**
   <details>
   <summary>Resposta</summary>

   O Medusa usa a convenção de nomenclatura camelCase para módulos e adiciona automaticamente “Module” como sufixo ao resolver dependências. Portanto, “brand” se torna “brandModule” internamente. Usar “brand-module” resultaria em “brandModuleModule”.
   </details>

3. **O que aconteceria se você se esquecesse de executar as migrações?**
   <details>
   <summary>Resposta</summary>

   A tabela `brand` não existiria no seu banco de dados, e qualquer tentativa de criar ou recuperar marcas falharia com erros de banco de dados como “a relação 'brand' não existe”.
   </details>

4. **Por que precisamos exportar tanto o serviço quanto o módulo do arquivo index.ts?**
   <details>
   <summary>Resposta</summary>

   Exportar o serviço torna-o disponível para injeção de dependências em fluxos de trabalho e rotas de API.
   </details>

## Verificação da implementação

Deixe-me verificar sua implementação. Por favor, compartilhe o seguinte:

### 1. Estrutura de diretórios

Execute este comando e compartilhe o resultado:

```bash
ls -R src/modules/brand
```

**Estrutura esperada**:

```
src/modules/brand:
index.ts  models  service.ts

src/modules/brand/models:
brand.ts
```

### 2. Modelo de dados

Mostre-me seu arquivo `src/modules/brand/models/brand.ts`.

**Pontos importantes a verificar**:

- [ ] Usa `model.define()` com “brand” como primeiro argumento (letras minúsculas, snake-case)
- [ ] Possui `id: model.id().primaryKey()`
- [ ] Possui `name: model.text()`
- [ ] O arquivo é exportado como padrão

### 3. Serviço

Mostre-me seu arquivo `src/modules/brand/service.ts`.

**Pontos importantes a verificar**:

- [ ] Usa `MedusaService(Brand)` (B maiúsculo para a importação do modelo)
- [ ] O arquivo é exportado como padrão

### 4. Definição do módulo

Mostre-me o seu arquivo `src/modules/brand/index.ts`.

**Pontos importantes a verificar**:

- [ ] Exporta `BrandService` de service.ts
- [ ] Usa `Module()` com o nome “brand” (em letras minúsculas)
- [ ] Exporta o módulo como padrão

### 5. Configuração

Mostre-me a seção `modules` do seu arquivo `medusa-config.ts`.

**Pontos importantes a verificar**:

- [ ] Inclui `resolve: "./modules/brand"`
- [ ] Possui `options: {}` vazio

### 6. Migrações

Execute este comando e compartilhe a saída:

```bash
npx medusa db:migrate
```

**Saída esperada**: Deve mostrar que a migração foi bem-sucedida, sem erros.

### 7. Compilação

Execute este comando e compartilhe quaisquer erros:

```bash
npm run build
```

**Resultado esperado**: A compilação deve ser bem-sucedida. Se houver erros de TypeScript, compartilhe-os comigo para que possamos depurar juntos.

## Problemas comuns

### “Não é possível encontrar o módulo 'brand'”

**Sintoma**: Erro ao executar a compilação ou ao iniciar o servidor

**Causa**: Módulo não registrado em `medusa-config.ts`

**Solução**:

1. Abra `medusa-config.ts`
2. Adicione ao array `modules`:

   ```typescript
   {
     resolve: "./modules/brand",
     options: {},
   }
   ```

3. Reinicie o servidor de desenvolvimento

### “O nome do módulo deve estar em camelCase”

**Sintoma**: Erro relacionado à convenção de nomenclatura de módulos

**Causa**: Utilizou “brand-module” ou “brandModule” como nome do módulo

**Solução**:
Altere o nome do módulo para apenas “brand” no `index.ts`:

```typescript
export default Module("brand", {
  service: BrandService,
})
```

## Lista de verificação de testes

Verifique cada uma destas etapas:

- [ ] A migração foi bem-sucedida, sem erros
- [ ] A compilação foi bem-sucedida, sem erros do TypeScript
- [ ] O módulo aparece na matriz de módulos do `medusa-config.ts`
- [ ] A estrutura do arquivo corresponde ao padrão esperado
- [ ] O modelo de dados utiliza a sintaxe DML correta
- [ ] O serviço utiliza a fábrica MedusaService
- [ ] O módulo exporta o serviço

## Próximos passos

Assim que este ponto de verificação for aprovado:

1. O **Módulo de Marca** está criado e funcionando
2. **Próximo**: Criar o fluxo de trabalho da marca (Parte 2 da Lição 1)

O módulo fornece a camada de dados. Agora, vamos construir o fluxo de trabalho para orquestrar a criação da marca com recursos de reversão automática.

**Pronto para continuar?** Avise-me quando todas as verificações forem aprovadas, e passaremos à criação do fluxo de trabalho.
