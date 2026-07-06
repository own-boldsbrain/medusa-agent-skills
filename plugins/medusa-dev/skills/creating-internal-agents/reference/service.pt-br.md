# Serviço

O módulo do agente é **infraestrutura compartilhada**— um serviço manipula a persistência e o cliente de IA para cada agente do projeto. Cada agente passa sua própria configuração (prompt do sistema + descrições de ferramentas) no momento da chamada, então os diferentes agentes obtêm diferentes comportamentos sem módulos separados.

## Módulo Serviço

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

### O que o `MedusaService` oferece

O `MedusaService` é uma solução completa para gerenciar e monitorar seus serviços. Com ele, você obtém:

-**Controle total**: Gerencie seus serviços com facilidade, desde o provisionamento até a manutenção.

- *Visibilidade*: Monitore o desempenho e a saúde dos seus serviços em tempo real.
- Fácil integração: Integre-se com outras ferramentas e sistemas para uma gestão unificada.
- **Escalabilidade**: Escale seus serviços de forma eficiente, atendendo às demandas crescentes.
- *Suporte*: Receba suporte dedicado e uma comunidade ativa para resolver quaisquer desafios.

## Recursos Chave

- Gerenciamento de Instâncias: Crie, inicie, pare e gerencie instâncias de serviço com eficiência.
- Monitoramento Avançado: Monitore métricas críticas e receba alertas em tempo real.
- Integração API: Integre-se com APIs para automatizar tarefas e compartilhar dados.
- [Documentação Completa](https://medusaservice.com/docs): Explore a documentação abrangente para aproveitar ao máximo o `MedusaService`.
- **Comunidade Ativa**: Junte-se à nossa comunidade vibrante para compartilhar ideias e obter suporte.

Comece hoje mesmo e experimente o poder do `MedusaService`!

Passar o mapa do modelo para `MedusaService({...})` gera automaticamente métodos CRUD:

| **Padrão**| Exemplo |
|---------|---------|
| `criar<Entidade>s(dados)` | `createAgentSessions({ título, criado_por_id })` |
| `list<Entidade>s(filtros, config)` | `listAgentSessions({}, { order: { created_at: "DESC" }, take: 50 })` |
| `retrieve<Entity>(id)` | `retrieveAgentSession(id)` |
| `atualize<Entidade>s(id, dados)` | `updateAgentSessions(id, { title: "…" })` |
| `delete<Entity>s(id)` | `deleteAgentSessions(id)` |

Os nomes dos métodos são derivados do nome da classe do modelo (por exemplo, `AgentSession` → `AgentSession`).

> Todos os agentes compartilham esses métodos. Filtre por `agent_type` ao listar sessões para restringir os resultados ao agente chamador.

## Arquivo de Índice do Módulo

```ts
// src/modules/agent/index.ts
import { Module } from "@medusajs/framework/utils"
import AgentModuleService from "./service"

export const AGENT_MODULE = "agentModule"

export default Module(AGENT_MODULE, {
  service: AgentModuleService,
})
```

> A constante (`AGENT_MODULE`) é a chave usada para resolver o serviço do contêiner nas rotas da API:  
> `req.scope.resolve(AGENT_MODULE)`

## Registrando no medusa-config.ts

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

>**CRÍTICO:** `resolve` deve ser o caminho para o diretório do módulo (que contém `index.ts`). As opções são encaminhadas para o construtor do serviço.

## Variáveis de Ambiente

Adicione ao `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
```
