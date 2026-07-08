# Authentication in Medusa

## Visão Geral

Rotas protegidas exigem middleware e tipagem corretos. A autenticação deve ser tratada como parte do contrato da rota.

## Padrões

- use os middlewares padrão do Medusa;
- use `AuthenticatedMedusaRequest` quando aplicável;
- não replique checagens já garantidas pelo middleware.

## Casos de Uso Yello Solar Hub

- rotas administrativas de aprovação;
- gestão de distribuidores;
- dados sensíveis de cotação e empresa compradora.
