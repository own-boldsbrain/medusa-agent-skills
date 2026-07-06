# Rota da API

Cada agente recebe seu próprio conjunto de rotas, mas eles compartilham todos o mesmo `AgentModuleService`. A configuração própria do agente (prompt do sistema + descrições de ferramentas) é definida localmente e passada para `stream()` no momento da chamada.

Caminhos de rota usam o *slug*do tipo do agente, ex. `src/api/admin/agent/customer-service/route.ts`.

## POST — Ponto de Extremidade Principal de Chat

```ts
// src/api/admin/agent/customer-service/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AgentModuleService from "../../../../modules/agent/service"
import { AGENT_MODULE } from "../../../../modules/agent"
import agentConfig from "../../../../modules/agent/config/customer-service"  // agent-specific config

const AGENT_TYPE = "customer-service"

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { messages, session_id } = req.body as { messages: any[]; session_id?: string }

  const agentService: AgentModuleService = req.scope.resolve(AGENT_MODULE)

  // Create or reuse a session, always scoped to this agent type
  let sessionId = session_id
  if (!sessionId) {
    const firstUserMsg = messages.find((m) => m.role === "user")
    const title = firstUserMsg
      ? String(firstUserMsg.content).slice(0, 72)
      : "New conversation"
    const session = await agentService.createAgentSessions({
      agent_type: AGENT_TYPE,
      title,
      created_by_id: req.auth_context?.actor_id ?? "unknown",
    })
    sessionId = session.id
  }

  // Persist the latest user message
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
  if (lastUserMsg) {
    await agentService.createAgentMessages({
      agent_session_id: sessionId,
      role: "user",
      content: String(lastUserMsg.content),
    })
  }

  // Stream — pass this agent's config so it uses the right prompt and tools
  const result = agentService.stream(messages, req.scope, agentConfig)

  res.setHeader("Content-Type", "application/x-ndjson")
  res.setHeader("Transfer-Encoding", "chunked")
  res.setHeader("Cache-Control", "no-cache")

  const emit = (obj: object) => res.write(JSON.stringify(obj) + "\n")

  emit({ type: "session_id", sessionId })

  let assistantContent = ""

  for await (const chunk of result.fullStream) {
    if (chunk.type === "text-delta") {
      const text = (chunk as any).text ?? (chunk as any).textDelta ?? (chunk as any).delta ?? ""
      if (text) {
        assistantContent += text
        emit({ type: "text", content: text })
      }
    } else if (chunk.type === "tool-call") {
      const args = (chunk as any).args ?? (chunk as any).input
      emit({ type: "tool_call", tool: chunk.toolName, args })
    } else if (chunk.type === "tool-result") {
      emit({ type: "tool_result", tool: chunk.toolName })
    }
  }

  if (assistantContent) {
    await agentService.createAgentMessages({
      agent_session_id: sessionId,
      role: "assistant",
      content: assistantContent,
    })
  }

  res.end()
}
```

## GET — Lista de Sessões

Filtrar por `agent_type` para que cada agente só veja suas próprias sessões.

```ts
// src/api/admin/agent/customer-service/sessions/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AgentModuleService from "../../../../../modules/agent/service"
import { AGENT_MODULE } from "../../../../../modules/agent"

const AGENT_TYPE = "customer-service"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const agentService: AgentModuleService = req.scope.resolve(AGENT_MODULE)

  const sessions = await agentService.listAgentSessions(
    { agent_type: AGENT_TYPE },
    {
      select: ["id", "title", "created_at", "created_by_id"],
      order: { created_at: "DESC" },
      take: 50,
    }
  )

  res.json({ sessions })
}
```

## Obter — Mensagens da Sessão

```ts
// src/api/admin/agent/customer-service/sessions/[id]/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AgentModuleService from "../../../../../../modules/agent/service"
import { AGENT_MODULE } from "../../../../../../modules/agent"

export async function GET(
  req: AuthenticatedMedusaRequest & { params: { id: string } },
  res: MedusaResponse
) {
  const agentService: AgentModuleService = req.scope.resolve(AGENT_MODULE)

  const messages = await agentService.listAgentMessages(
    { agent_session_id: req.params.id },
    {
      select: ["id", "role", "content", "created_at"],
      order: { created_at: "ASC" },
    }
  )

  res.json({ messages })
}
```

## Adicionando um Segundo Agente

Para adicionar um segundo agente, você pode seguir estas etapas:

- Abra o painel de controle do seu sistema e navegue até a seção de gerenciamento de agentes.
- Clique em "Adicionar Agente" ou uma opção semelhante.
- Preencha os detalhes do novo agente, incluindo seu nome, endereço de e-mail e qualquer outra informação relevante.
- Defina as permissões e privilégios do agente, garantindo que ele tenha acesso às áreas necessárias.
- Revise as configurações e confirme a adição.

Agora, você tem dois agentes configurados e pode gerenciar suas tarefas e responsabilidades de forma eficiente.

-*Observação:**Certifique-se de manter um equilíbrio entre a delegação de tarefas e a sobrecarga de trabalho para garantir a produtividade e o bem-estar dos seus agentes.

Adicione um novo diretório de rota com sua própria constante `AGENT_TYPE` e sua própria importação de configuração. Todo o resto — o serviço, os modelos, as tabelas do banco de dados — é reutilizado sem alterações.

```
src/api/admin/agent/
  customer-service/
    route.ts                  ← AGENT_TYPE = "customer-service"
    sessions/route.ts
    sessions/[id]/route.ts
  product-audit/
    route.ts                  ← AGENT_TYPE = "product-audit"
    sessions/route.ts
    sessions/[id]/route.ts
```

## Pontos Chave

-*Todas as rotas do agente devem usar `AuthenticatedMedusaRequest`** — o agente aciona o MedusaExec, que executa TypeScript arbitrário com acesso total ao banco de dados. Uma rota não autenticada é uma vulnerabilidade de execução remota de código. Nunca coloque rotas do agente fora de `src/api/admin/` ou relaxe o middleware de autenticação.
- `agent_type` é a única coisa que distingue as sessões entre agentes — sempre defina-o ao criar e filtre por ele na lista.
- Passe `agentConfig` (a configuração específica do agente) para `stream()` — não um padrão compartilhado. A configuração de cada agente fica junto de suas rotas ou em `src/modules/agent/config/<agent-type>.ts`.
- `req.scope` é o container de DI da Medusa — passe-o para `stream()` para que o MedusaExec possa resolver serviços.
- Sempre chame `res.end()` após o loop de streams.
