# Custom API Routes

## Convenções de Caminho

Use rotas `admin` e `store` conforme o público-alvo. Siga padrões de nome consistentes e evite verbos desnecessários no path.

## Validação

- valide body com schema;
- valide query params quando aplicável;
- tipifique `MedusaRequest<T>` com o schema inferido.

## Estrutura

- rota valida e chama workflow;
- não implementa regra de negócio pesada;
- retorna payload claro e estável.

## Proteção

Use autenticação e tipos apropriados para rotas protegidas.

## Casos de Uso Yello Solar Hub

- `/admin/manufacturers`
- `/admin/distributors`
- `/store/quotes`
- `/admin/approvals`
