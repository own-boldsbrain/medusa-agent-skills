# Typography Guidelines

## Conteúdo

- [Padrão Central de Tipografia](#padrão-central-de-tipografia)
- [Regras Tipográficas](#regras-tipográficas)
- [Exemplos Completos](#exemplos-completos)
- [Classes de Cor de Texto](#classes-de-cor-de-texto)
- [Padrões Comuns](#padrões-comuns)
- [Referência Rápida](#referência-rápida)
- [Casos de Uso Yello Solar Hub](#casos-de-uso-yello-solar-hub)

## Padrão Central de Tipografia

Use `Text` de `@medusajs/ui` para textos de widget e seções internas.

### Labels e títulos pequenos

```tsx
<Text size="small" leading="compact" weight="plus">
  {label}
</Text>
```

### Descrições e apoio

```tsx
<Text size="small" leading="compact" className="text-ui-fg-subtle">
  {description}
</Text>
```

## Regras Tipográficas

- Não use `<Heading>` para microseções dentro de widgets.
- Padronize com `size="small"` e `leading="compact"`.
- Use `weight="plus"` para labels e informação primária.
- Use `text-ui-fg-subtle` para informação secundária.
- Para títulos de container/página, aí sim use `<Heading>`.

## Exemplos Completos

### Seção com título e descrição

```tsx
<div className="flex flex-col gap-y-2">
  <Text size="small" leading="compact" weight="plus">Configurações do Produto</Text>
  <Text size="small" leading="compact" className="text-ui-fg-subtle">Defina como o item aparece no fluxo comercial</Text>
</div>
```

### Estado vazio

```tsx
<Text size="small" leading="compact" className="text-ui-fg-subtle">
  Nenhum item selecionado
</Text>
```

### Mensagem de erro

```tsx
<Text size="small" className="text-ui-fg-error">Campo obrigatório</Text>
```

## Classes de Cor de Texto

- `text-ui-fg-base`
- `text-ui-fg-subtle`
- `text-ui-fg-muted`
- `text-ui-fg-disabled`
- `text-ui-fg-error`
- `text-ui-fg-success`
- `text-ui-fg-warning`

## Padrões Comuns

- pares label-valor em linha;
- metadados com contraste reduzido;
- títulos de item com peso maior e detalhes discretos.

## Referência Rápida

- Label: `weight="plus"`
- Descrição: `text-ui-fg-subtle`
- Erro: `text-ui-fg-error`
- Cabeçalho de seção grande: `<Heading>`

## Casos de Uso Yello Solar Hub

- destacar status de homologação de fabricante;
- sinalizar estados de aprovação comercial;
- manter leitura clara de dados técnicos em tabelas admin.
