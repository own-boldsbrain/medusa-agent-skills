# Serviço

O módulo do agente é uma **infraestrutura compartilhada** — um único serviço lida com a persistência e o cliente de IA para todos os agentes do projeto. Cada agente passa sua própria configuração (prompt do sistema + descrições das ferramentas) no momento da chamada, de modo que agentes diferentes apresentam comportamentos distintos sem a necessidade de módulos separados.

## Serviço do Módulo

```ts
// src/modules/agent/service.ts
import { createAnthropic } from "@ai-sdk/anthropic"
import type { MedusaContainer } from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"
import { medusaAgent } from "./agents"
import { AgentSession } from "./models/session"
import { AgentMessage } from "./models/message"

export type AgentModuleOptions = {
  apiKey: string
  model?: string  // defaults to "claude-sonnet-4-5"
}

export default class AgentModuleService extends MedusaService({
  AgentSession,
  AgentMessage,
}) {
  private model_: ReturnType<ReturnType<typeof createAnthropic>>

  constructor(_deps: unknown, options: AgentModuleOptions) {
    super(...arguments)
    const anthropic = createAnthropic({ apiKey: options.apiKey })
    this.model_ = anthropic(options.model ?? "claude-sonnet-4-5")
  }

  // config is passed per-call so each agent can use its own prompt and tools
  stream(messages: any[], container: MedusaContainer, config: any) {
    return medusaAgent({
      model: this.model_,
      messages,
      config,
      experimental_context: { medusa_container: container },
    })
  }
}
```

## O que o `MedusaService` oferece

Ao passar o mapa do modelo para `MedusaService({...})`, os métodos CRUD são gerados automaticamente:

| Padrão | Exemplo |
|---------|---------|
| `create<Entity>s(data)` | `createAgentSessions({ title, created_by_id })` |
| `list<Entity>s(filters, config)` | `listAgentSessions({}, { order: { created_at: "DESC" }, take: 50 })` |
| `retrieve<Entity>(id)` | `retrieveAgentSession(id)` |
| `update<Entity>s(id, data)` | `updateAgentSessions(id, { title: "…" })` |
| `delete<Entity>s(id)` | `deleteAgentSessions(id)` |

Os nomes dos métodos são derivados do nome da classe do modelo (por exemplo, `AgentSession` → `AgentSession`).

> Todos os agentes compartilham esses métodos. Filtre por `agent_type` ao listar sessões para restringir os resultados ao agente que está fazendo a chamada.

## Arquivo de índice do módulo

```ts
// src/modules/agent/index.ts
import { Module } from "@medusajs/framework/utils"
import AgentModuleService from "./service"

export const AGENT_MODULE = "agentModule"

export default Module(AGENT_MODULE, {
  service: AgentModuleService,
})
```

> A constante (`AGENT_MODULE`) é a chave usada para resolver o serviço a partir do contêiner nas rotas da API:
> `req.scope.resolve(AGENT_MODULE)`

## Registro no medusa-config.ts

```ts
// medusa-config.ts
modules: [
  {
    resolve: "./src/modules/agent",
    options: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-sonnet-4-5",  // optional, this is the default
    },
  },
]
```

> **CRÍTICO:** `resolve` deve ser o caminho para o diretório do módulo (que contém `index.ts`). As opções são encaminhadas para o construtor do serviço.

## Variáveis de ambiente

Adicione ao `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
