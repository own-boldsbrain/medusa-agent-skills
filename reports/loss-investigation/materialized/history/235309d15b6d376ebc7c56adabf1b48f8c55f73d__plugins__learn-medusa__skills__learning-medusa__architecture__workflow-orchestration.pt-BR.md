# Architecture Deep Dive: Workflow Orchestration

## O Que É Orquestração por Workflow

Workflow é a camada que coordena passos, valida regras de negócio e executa compensações quando algo falha.

## Por Que Usar Workflows em Vez de Chamar Serviços Diretamente

- mantém mutações previsíveis;
- permite rollback;
- reduz lógica espalhada nas rotas;
- favorece reaproveitamento e testes.

## Regras de Workflow

- mutações devem passar por workflow;
- use steps com responsabilidade clara;
- implemente compensation quando necessário;
- mantenha a composição simples e declarativa.

## Casos de Uso Yello Solar Hub

- aprovação de fabricante com atualização de status e auditoria;
- criação de proposta comercial com múltiplos registros dependentes;
- vínculo entre distribuidor, produto e condição de financiamento.
