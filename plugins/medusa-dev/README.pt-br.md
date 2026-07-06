# Plugin Claude Code para Medusa

Conjunto abrangente de skills para construir aplicações Medusa com padrões arquiteturais sólidos em backend, Admin UI e storefront.

## O que cobre

- Backend: módulos, workflows, rotas de API, links e queries.
- Admin: widgets, páginas, formulários, tabelas e carregamento de dados.
- Storefront: SDK, React Query e integração com rotas customizadas.

## Comandos Incluídos

- `/medusa-dev:db-migrate`
- `/medusa-dev:db-generate <module-name>`
- `/medusa-dev:new-user <email> <password>`

## Tradução local com Ollama

Para retraduzir páginas Markdown do plugin com o modelo local `gemma4:e4b`, preservando a densidade original e adicionando ou expandindo a seção `Casos de Uso Yello Solar Hub`, use:

```bash
pnpm ollama:translate:medusa-pages -- medusa-agent-skills/plugins/medusa-dev/skills/building-admin-dashboard-customizations --overwrite
```

Para processar toda a árvore do plugin:

```bash
pnpm ollama:translate:medusa-pages -- medusa-agent-skills/plugins/medusa-dev --overwrite
```

## Casos de Uso Yello Solar Hub

- Fabricantes, distribuidores, kits solares, aprovações e cotações B2B.
- Admin customizado para operação comercial e técnica.
- Storefront conectado ao catálogo solar e aos fluxos financeiros.

## Privacidade

O conteúdo é local e o MCP consulta somente documentação pública da Medusa.
