# Modelos de dados

`AgentSession` e `AgentMessage` são uma infraestrutura compartilhada — um único conjunto de tabelas atende a todos os agentes do projeto. Um campo `agent_type` na sessão distingue a qual agente ela pertence, de modo que um agente de atendimento ao cliente e um agente de auditoria de produtos podem gravar nas mesmas tabelas sem que haja conflito.

> **Não crie modelos separados de sessão/mensagem para cada agente.** Adicione `agent_type` e reutilize esses modelos.

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

## Regras principais

- **`agent_type`** — defina esse campo com um slug estável, em letras minúsculas, ao criar uma sessão. A rota da API de cada agente passa seu próprio valor. Use-o para filtrar as sessões no endpoint da lista, de modo que cada agente veja apenas seu próprio histórico.
- **`model.id({ prefix: "..." })`** — gera um ID com prefixo (por exemplo, `sess_01JABCD…`).
- **`hasMany` / `belongsTo`** — sempre defina ambos os lados. O valor de `mappedBy` deve corresponder ao nome do campo no modelo pai.
- **`nullable()`** — `title` é definido de forma diferida a partir da primeira mensagem; pode ser nulo no momento da criação.

## Migrações

Após adicionar ou alterar modelos, execute:

```bash
npx medusa db:generate agent   # matches the module resolve path in medusa-config.ts
npx medusa db:migrate
```

> **CRÍTICO:** O nome passado para `db:generate` deve corresponder à forma como o módulo é resolvido em `medusa-config.ts`.

## Exportação de modelos

```ts
// Imported directly in service.ts
import { AgentSession } from "./models/session"
import { AgentMessage } from "./models/message"
```
