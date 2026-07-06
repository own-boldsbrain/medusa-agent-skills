---
name: new-user
description: Criar um usuário administrador no Medusa
argument-hint: <email> <senha>
allowed-tools: Bash(npx medusa user:*)
---

# Criar Usuário Administrador

Cria um novo usuário administrador no Medusa com o e-mail e a senha especificados.

O usuário deverá fornecer dois argumentos:

- Primeiro argumento: endereço de e-mail
- Segundo argumento: senha

Exemplo: `/medusa-dev:user admin@exemplo.com supersecreto`

Use a ferramenta Bash para executar o comando `npx medusa user -e <email> -p <senha>`, substituindo `<email>` e `<senha>` pelos argumentos recebidos.

Reporte os resultados ao usuário, incluindo:

- Confirmação de que o usuário administrador foi criado com sucesso
- O endereço de e-mail do usuário criado
- Quaisquer erros que ocorreram
- Próximos passos (por exemplo, efetuar login no dashboard admin)
