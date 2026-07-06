---
nome: criação-de-agentes-no-medusa
descrição: Utilize ao desenvolver um agente de IA interno voltado para a administração em um projeto Medusa. Esses agentes são operados por comerciantes e operadores de lojas — não por clientes. Abrange modelos de dados, serviço de módulo, tempo de execução do agente (ferramentas, prompt do sistema, streamText), rotas da API de streaming (NDJSON) e extensões de chat da interface de usuário administrativa. Aplique a qualquer tipo de agente interno: assistente de operações de loja, auditoria de produtos, análise de coortes, ferramentas de atendimento ao cliente para a equipe de suporte, etc. NÃO utilize para agentes voltados para o cliente (chatbots de loja virtual, assistentes para compradores).
---

# Criação de agentes no Medusa

Esta habilidade abrange todo o processo para adicionar um agente de IA **interno, voltado para administradores** a um projeto Medusa. Esses agentes são utilizados por comerciantes e operadores de lojas por meio do painel de administração do Medusa — e não por clientes na interface da loja. Para agentes voltados para o cliente (por exemplo, um chatbot na interface da loja), é necessária uma arquitetura diferente: rotas de API públicas, sem MedusaExec e autenticação na interface da loja.

## Restrições

- **Somente para uso interno** — essa arquitetura é destinada a usuários administradores (comerciantes, operadores, equipe de suporte), e não a clientes. As rotas ficam em `src/api/admin/`, a interface do usuário fica no painel de administração do Medusa, e o acesso é controlado por autenticação de administrador em todas as etapas.
- **A autenticação é obrigatória** — O MedusaExec executa código TypeScript arbitrário com acesso total ao banco de dados. Todas as rotas do agente devem usar `AuthenticatedMedusaRequest` e estar localizadas em `src/api/admin/`. Um endpoint não autenticado representa uma vulnerabilidade de execução remota de código.
- **Use o MedusaExec, não ferramentas personalizadas** — para qualquer operação de dados, o agente escreve código em TypeScript e o executa por meio do MedusaExec. Crie uma ferramenta personalizada apenas para funcionalidades que não possam ser expressas como código TypeScript executável (por exemplo, chamar uma API externa com uma chave secreta).
- **Um módulo compartilhado, vários agentes** — `AgentSession` e `AgentMessage` são infraestrutura compartilhada. Use `agent_type` para distinguir as sessões por agente. Nunca crie modelos separados para cada agente.
- **Passe `MedusaContainer` por meio de `experimental_context`** — nunca importe serviços diretamente nos arquivos de ferramentas; isso causa dependências circulares.
- **O formato do stream é NDJSON** — `Content-Type: application/x-ndjson`, um objeto JSON por linha seguido de `\n`.
- **Execute as migrações** após adicionar ou alterar modelos (`npx medusa db:generate agent && npx medusa db:migrate`).
- **As descrições das ferramentas ficam no arquivo de configuração**, e não diretamente na função `tool()` — o objeto de configuração as substitui em tempo de execução.

## CRÍTICO: Carregue os arquivos de referência quando necessário

**⚠️ A referência rápida abaixo NÃO é suficiente para a implementação.** Carregue o arquivo de referência relevante antes de escrever qualquer código.

| Tarefa | Carregue este arquivo |
|------|---------------|
| Definir modelos de conversa | `reference/data-models.md` |
| Configurar o serviço do módulo | `reference/service.md` |
| Configurar ferramentas, prompt e streamText | `reference/agent-setup.md` |
| Criação do endpoint de chat POST | `reference/api-route.md` |
| Implementação do streaming NDJSON | `reference/streaming.md` |
| Criação da interface de usuário do chat administrativo | `reference/admin-extension.md` |
| Concessão de capacidade de execução de código ao agente | `reference/medusa-exec.md` |

**Requisito mínimo:** Carregue pelo menos o arquivo de referência correspondente à sua tarefa atual antes de escrever o código.

## Habilidades relacionadas

Carregue estas habilidades juntamente com esta, quando for relevante:

- **`building-with-medusa`** — Padrões de módulos do Medusa, fluxos de trabalho, convenções de modelos de dados. Carregue ao implementar o serviço do módulo ou a lógica de back-end personalizada.
- **`building-admin-dashboard-customizations`** — Padrões de componentes da interface de usuário administrativa, TanStack Query, registro de rotas. Carregue ao criar ou ampliar a interface de usuário do chat administrativo.

## Visão geral da arquitetura

```
src/modules/agent/
  index.ts                ← Module() export + AGENT_MODULE constant
  service.ts              ← MedusaService + Anthropic client + stream(messages, container, config)
  models/
    session.ts            ← AgentSession (shared across all agents, filtered by agent_type)
    message.ts            ← AgentMessage
  agents/index.ts         ← streamText() orchestration
  tools/
    medusa-exec.ts        ← MedusaExec tool (primary tool for all data operations)
    todo-write.ts         ← TodoWrite tool
  config/
    <agent-type>.ts       ← per-agent system prompt + tool descriptions

src/api/admin/agent/<agent-type>/
  route.ts                ← POST (AuthenticatedMedusaRequest, session lifecycle, NDJSON stream)
  sessions/route.ts       ← GET session list (filtered by agent_type)
  sessions/[id]/route.ts  ← GET messages for a session

src/admin/routes/<agent-type>/
  page.tsx                ← React chat UI (admin extension)

src/lib/code-mode/
  executor.ts             ← sandboxed TypeScript executor used by MedusaExec
```

## Erros comuns

Verifique se você NÃO está cometendo estes erros:

**Segurança:**
- [ ] A rota do agente usa `MedusaRequest` em vez de `AuthenticatedMedusaRequest`
- [ ] A rota do agente está localizada fora de `src/api/admin/`

**Arquitetura:**
- [ ] Criação de modelos `AgentSession`/`AgentMessage` separados para cada agente, em vez de usar `agent_type`
- [ ] Importação de serviços diretamente nos arquivos de ferramentas, em vez de resolvê-los a partir de `experimental_context`
- [ ] Criação de uma ferramenta personalizada para uma operação de dados, em vez de usar o MedusaExec

**Streaming:**
- [ ] Falta `res.end()` após o loop do stream (a resposta nunca é fechada)
- [ ] Faltam os cabeçalhos `Transfer-Encoding: chunked` ou `Content-Type: application/x-ndjson`
- [ ] Não há armazenamento em buffer de linhas incompletas no cliente (erros de análise de JSON em pacotes fragmentados)

**Módulo:**
- [ ] Esquecimento de registrar o módulo em `medusa-config.ts`
- [ ] Esquecimento de executar migrações após alterar modelos
- [ ] Codificação estática das descrições das ferramentas em `tool()` em vez de no objeto de configuração

## Arquivos de referência disponíveis

```
reference/data-models.md       - model.define(), agent_type discriminator, relationships, migrations
reference/service.md           - MedusaService extension, Anthropic init, stream(), module index, config registration
reference/agent-setup.md       - streamText(), MedusaExec tool wiring, system prompt, context passing
reference/api-route.md         - POST route, session lifecycle, message persistence, streaming headers
reference/streaming.md         - NDJSON emission, fullStream iteration, chunk types, client-side parsing
reference/admin-extension.md   - React chat UI, streaming fetch, message rendering, tool call display, session sidebar
reference/medusa-exec.md       - Executor setup, MedusaExec tool, query.graph() patterns, error codes
```

## Testes

Depois que o agente estiver implementado, teste-o de ponta a ponta diretamente no painel de administração:

1. Inicie o servidor de desenvolvimento do Medusa (`npx medusa develop`)
2. Abra o painel de administração e navegue até a página do agente na barra lateral (o rótulo definido em `defineRouteConfig`)
3. Digite um prompt simples e somente para leitura — por exemplo, *“Quantos produtos há na loja?”* — e envie
4. Verifique se os fluxos de resposta chegam e se uma nova sessão aparece na barra lateral
5. Envie uma mensagem de acompanhamento na mesma sessão para confirmar se o histórico da conversa foi preservado
6. Atualize a página, selecione a sessão na barra lateral e confirme se o histórico de mensagens foi restaurado a partir do banco de dados

Se algo não estiver funcionando corretamente, verifique:
- Guia “Rede” do navegador — a solicitação POST deve retornar `Content-Type: application/x-ndjson` com linhas fragmentadas
- Logs do servidor — as linhas `[agent] tool_call` e `[agent] step_finish` confirmam que o agente está em execução
- Banco de dados — as tabelas `agent_session` e `agent_message` devem conter linhas com o valor correto para `agent_type`
