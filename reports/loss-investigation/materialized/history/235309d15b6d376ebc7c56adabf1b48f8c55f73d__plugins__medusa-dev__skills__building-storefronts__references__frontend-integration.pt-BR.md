# Frontend SDK Integration

## Padrão de SDK no Frontend

- localize a instância existente do SDK antes de criar outra;
- use `sdk.client.fetch()` para rotas customizadas;
- use métodos nativos para endpoints nativos.

## React Query

- `useQuery` para GET;
- `useMutation` para POST e DELETE;
- invalide queries em `onSuccess`.

## Tratamento de Erros

- exponha mensagens úteis;
- faça rollback de updates otimistas quando necessário.

## Casos de Uso Yello Solar Hub

- mostrar reviews técnicas, fabricante e disponibilidade em PDP;
- integrar APIs customizadas de orçamento e kits solares;
- manter carrinho B2B sincronizado.
