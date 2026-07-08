# Querying Data in Medusa

## Quando Usar Query em Vez de Service

Use query para leitura estruturada, especialmente quando há composição entre módulos.

## Regras

- `query.graph()` para leitura cross-module sem filtragem por módulo linkado;
- `query.index()` quando o filtro depende da entidade linkada;
- não use `.filter()` em JavaScript para compensar query mal estruturada.

## Paginação e Campos

- selecione apenas campos necessários;
- aplique paginação de forma consistente;
- mantenha filtros no banco.

## Casos de Uso Yello Solar Hub

- listar produtos por fabricante;
- consultar ofertas por distribuidor;
- cruzar empresa, cotação e status de aprovação.
