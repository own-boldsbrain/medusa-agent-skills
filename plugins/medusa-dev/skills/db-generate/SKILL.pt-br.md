---
name: db-generate
description: Gerar migrações de banco de dados para um módulo Medusa
argument-hint: <nome-do-modulo>
allowed-tools: Bash(npx medusa db:generate:*)
---

# Gerar Migrações de Banco de Dados

Gera migrações de banco de dados para o módulo Medusa especificado.

O usuário deve fornecer o nome do módulo como argumento (ex.: `brand`, `product`, `custom-module`).

Exemplo: `/medusa-dev:db-generate brand`

Use a ferramenta Bash para executar o comando `npx medusa db:generate <nome-do-modulo>`, substituindo `<nome-do-modulo>` pelo argumento fornecido.

Reporte os resultados ao usuário, incluindo:

- O nome do módulo para o qual as migrações foram geradas
- Nome ou localização do arquivo de migração
- Quaisquer erros ou avisos
- Próximos passos (executar `npx medusa db:migrate` para aplicar)
