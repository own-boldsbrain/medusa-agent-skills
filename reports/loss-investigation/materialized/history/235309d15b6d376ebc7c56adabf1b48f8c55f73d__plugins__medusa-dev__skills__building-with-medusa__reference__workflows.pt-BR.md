# Creating Workflows

## Checklist

- defina o objetivo da mutação;
- quebre em steps claros;
- adicione compensation quando necessário;
- retorne `WorkflowResponse` com resultado útil.

## Estrutura Básica

Workflow compõe steps e centraliza a lógica de negócio. Não use a rota como substituto do workflow.

## Padrões Comuns

- criação com rollback;
- atualização de status;
- vínculo entre entidades;
- composição de sub-workflows.

## Casos de Uso Yello Solar Hub

- aprovação de fabricante;
- cadastro de distribuidor;
- criação de cotação B2B;
- associação de kits a componentes.
