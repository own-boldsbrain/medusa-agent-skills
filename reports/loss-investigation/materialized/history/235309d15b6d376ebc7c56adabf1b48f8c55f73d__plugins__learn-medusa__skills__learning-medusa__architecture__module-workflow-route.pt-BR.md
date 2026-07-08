# Architecture Deep Dive: Module → Workflow → API Route Pattern

## O Padrão de Três Camadas

Toda feature madura em Medusa deve seguir o fluxo `Module -> Workflow -> API Route`. Cada camada tem uma responsabilidade distinta:

- `Module`: modelagem e operações de dados.
- `Workflow`: orquestração de negócio, mutações e rollback.
- `API Route`: interface HTTP, validação e resposta.

## Por Que Esse Padrão Existe

- separa responsabilidade técnica de responsabilidade de negócio;
- aumenta reutilização;
- facilita testes;
- reduz lógica duplicada em rotas;
- preserva consistência ao escalar o projeto.

## Reuso e Consistência

Quando uma mutação precisa ser exposta em mais de um ponto, o workflow pode ser reutilizado por múltiplas rotas, jobs ou integrações.

## Desacoplamento

Rotas não devem conhecer detalhes internos do módulo. Elas validam, chamam o workflow e retornam resultado.

## Casos de Uso Yello Solar Hub

- criar um fabricante solar no módulo `manufacturer`;
- aprovar um distribuidor via workflow;
- expor rota admin para cadastro de kits ou condições comerciais.
