# Subscribers and Events

## Quando Usar Subscribers

Subscribers servem para reações assíncronas a eventos de negócio sem poluir o fluxo principal.

## Padrões

- mantenha handlers pequenos;
- consuma payloads bem definidos;
- trate falhas com logs e observabilidade.

## Casos de Uso Yello Solar Hub

- notificar criação de pedido;
- disparar revisão comercial após cotação;
- atualizar indicadores após aprovação de fabricante ou distribuidor.
