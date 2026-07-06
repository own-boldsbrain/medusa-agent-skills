# Diretrizes de tipografia

## Índice

- [Padrão básico de tipografia](#padrao-basico-de-tipografia)
- [Regras de tipografia](#regras-de-tipografia)
- [Exemplos completos](#exemplos-completos)
- [Classes de cor de texto](#classes-de-cor-de-texto)
- [Padrões comuns](#padroes-comuns)
- [Referência rápida](#referencia-rapida)

## Padrão básico de tipografia

Utilize o componente `Text` do pacote `@medusajs/ui` para todos os elementos de texto. Siga estes padrões específicos:

### Títulos/Rótulos

Utilize este padrão para títulos de seção, rótulos de campos ou qualquer texto principal:

```tsx
<Text size="small" leading="compact" weight="plus">
  {labelText}
</Text>
```

### Corpo/Descrições

Use este padrão para descrições, textos de ajuda ou informações secundárias:

```tsx
<Text size="small" leading="compact" className="text-ui-fg-subtle">
  {descriptionText}
</Text>
```

## Regras de tipografia

- **Nunca use** o componente `<Heading>` para seções pequenas dentro de widgets/contêineres
- **Sempre use** `size="small"` e `leading="compact"` para manter a consistência
- **Use** `weight="plus"` para rótulos e títulos
- **Use** `className="text-ui-fg-subtle"` para texto secundário/descritivo
- **Para títulos maiores** (títulos de página, cabeçalhos de contêineres), use o componente `<Heading>`

## Exemplos completos

### Seção de widget com rótulo e descrição

```tsx
import { Text } from "@medusajs/ui"

// In a container or widget:
<div className="flex flex-col gap-y-2">
  <Text size="small" leading="compact" weight="plus">
    Product Settings
  </Text>
  <Text size="small" leading="compact" className="text-ui-fg-subtle">
    Configure how this product appears in your store
  </Text>
</div>
```

### Item de lista com título e subtítulo

```tsx
<div className="flex flex-col gap-y-1">
  <Text size="small" leading="compact" weight="plus">
    Premium T-Shirt
  </Text>
  <Text size="small" leading="compact" className="text-ui-fg-subtle">
    Size: Large • Color: Blue
  </Text>
</div>
```

### Cabeçalho do contêiner (usar título)

```tsx
import { Container, Heading } from "@medusajs/ui"

<Container className="divide-y p-0">
  <div className="flex items-center justify-between px-6 py-4">
    <Heading level="h2">Related Products</Heading>
  </div>
  {/* ... */}
</Container>
```

### Mensagem de estado vazio

```tsx
<Text size="small" leading="compact" className="text-ui-fg-subtle">
  No related products selected
</Text>
```

### Rótulo do campo do formulário

```tsx
<div className="flex flex-col gap-y-2">
  <Text size="small" leading="compact" weight="plus">
    Display Name
  </Text>
  <Input {...props} />
</div>
```

### Mensagem de erro

```tsx
<Text size="small" className="text-ui-fg-error">
  This field is required
</Text>
```

### Emblema ou texto de status

```tsx
<div className="flex items-center gap-x-2">
  <Text size="small" leading="compact" weight="plus">
    Status:
  </Text>
  <Text size="small" leading="compact" className="text-ui-fg-subtle">
    Active
  </Text>
</div>
```

## Classes de cor de texto

A Medusa UI oferece classes de cor semânticas:

- `text-ui-fg-base` - Cor padrão do texto (raramente necessária, pois é a padrão)
- `text-ui-fg-subtle` - Texto secundário/suave
- `text-ui-fg-muted` - Ainda mais suave
- `text-ui-fg-disabled` - Estado desativado
- `text-ui-fg-error` - Mensagens de erro
- `text-ui-fg-success` - Mensagens de sucesso
- `text-ui-fg-warning` - Mensagens de aviso

## Padrões comuns

### Layout de duas colunas

```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col gap-y-1">
    <Text size="small" leading="compact" className="text-ui-fg-subtle">
      Category
    </Text>
    <Text size="small" leading="compact" weight="plus">
      Clothing
    </Text>
  </div>
  <div className="flex flex-col gap-y-1">
    <Text size="small" leading="compact" className="text-ui-fg-subtle">
      Status
    </Text>
    <Text size="small" leading="compact" weight="plus">
      Published
    </Text>
  </div>
</div>
```

### Par rótulo-valor embutido

```tsx
<div className="flex items-center gap-x-2">
  <Text size="small" leading="compact" className="text-ui-fg-subtle">
    SKU:
  </Text>
  <Text size="small" leading="compact" weight="plus">
    SHIRT-001
  </Text>
</div>
```

### Cartão com título e metadados

```tsx
<div className="flex flex-col gap-y-2">
  <Text size="small" leading="compact" weight="plus">
    Premium Cotton T-Shirt
  </Text>
  <div className="flex items-center gap-x-2 text-ui-fg-subtle">
    <Text size="small" leading="compact">
      $29.99
    </Text>
    <Text size="small" leading="compact">
      •
    </Text>
    <Text size="small" leading="compact">
      In stock
    </Text>
  </div>
</div>
```

## Referência rápida

| Caso de uso | Padrão |
|----------|---------|
| Títulos de seção | `weight="plus"` |
| Texto principal | `weight="plus"` |
| Rótulos | `weight="plus"` |
| Descrições | `className="text-ui-fg-subtle"` |
| Texto auxiliar | `className="text-ui-fg-subtle"` |
| Metadados | `className="text-ui-fg-subtle"` |
| Erros | `className="text-ui-fg-error"` |
| Estados vazios | `className="text-ui-fg-subtle"` |
| Títulos grandes | Componente `<Heading>` |
