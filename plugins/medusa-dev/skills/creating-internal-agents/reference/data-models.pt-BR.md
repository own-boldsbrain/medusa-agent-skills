# Modelos de Dados

`AgentSession` e `AgentMessage` são infraestrutura compartilhada — um conjunto de tabelas serve todos os agentes no projeto. Um campo `agent_type` na sessão distingue qual agente o possui, então um agente de suporte ao cliente e um agente de auditoria de produtos escrevem nas mesmas tabelas sem colidir.

> **Não crie modelos de sessão/mensagem separados por agente.** Adicione `agent_type` e reutilize esses modelos.

## Modelos

```ts
// src/modules/agent/models/session.ts
import { model } from "@medusajs/framework/utils"
import { AgentMessage } from "./message"

export const AgentSession = model.define("agent_session", {
  id: model.id({ prefix: "sess" }).primaryKey(),
  agent_type: model.text(),                // e.g. "customer-service", "product-audit"
  title: model.text().nullable(),          // first 72 chars of opening message
  created_by_id: model.text(),             // actor_id from auth context
  messages: model.hasMany(() => AgentMessage),
})
```

```ts
// src/modules/agent/models/message.ts
import { model } from "@medusajs/framework/utils"
import { AgentSession } from "./session"

export const AgentMessage = model.define("agent_message", {
  id: model.id({ prefix: "msg" }).primaryKey(),
  agent_session: model.belongsTo(() => AgentSession, { mappedBy: "messages" }),
  role: model.enum(["user", "assistant"]),
  content: model.text(),
})
```

## Regras Principais

- - *`tipo_de_agente`** — defina para um slug estável, em minúsculas, quando criar uma sessão. Cada rota da API do agente passa seu próprio valor. Use-o para filtrar sessões na endpoint de lista para que cada agente só veja sua própria história.
- - *`model.id({ prefix: "..." })`** — gera um ID com prefixo (ex: `sess_01JABCD…`).
- - *`hasMany` / `belongsTo`** — sempre defina ambos os lados. O valor `mappedBy` deve corresponder ao nome do campo no pai.
- - *`nullable()`** — `title` é definido de forma preguiçosa a partir da primeira mensagem; pode ser nulo na criação.

## **Migrações**

Após adicionar ou alterar modelos, execute:

```bash
npx medusa db:generate agent   # matches the module resolve path in medusa-config.ts
npx medusa db:migrate
```

> **CRÍTICO:** O nome passado para `db:generate` deve corresponder à forma como o módulo é resolvido em `medusa-config.ts`.

## Exportando Modelos

```ts
// Imported directly in service.ts
import { AgentSession } from "./models/session"
import { AgentMessage } from "./models/message"
```
