# MedusaExec

O MedusaExec permite que o agente escreva e execute código TypeScript arbitrário no servidor Medusa em produção. Em vez de criar previamente um endpoint para cada ação possível, o agente gera o código adequado para cada tarefa em tempo de execução — consultar dados, acionar fluxos de trabalho, atualizar registros — utilizando acesso total ao contêiner DI do Medusa.

> **CRÍTICO — Autenticação obrigatória.** O MedusaExec executa código arbitrário com acesso total ao banco de dados e aos serviços. Ele só deve ser acessível por meio de rotas protegidas por `AuthenticatedMedusaRequest`. Nunca exponha o endpoint POST do agente (ou qualquer rota que acione `executeCode`) sem autenticação de administrador — isso permite que usuários não autenticados executem código arbitrário no seu banco de dados.

## O Executor

Adicione o executor ao seu projeto em `src/lib/code-mode/executor.ts`:

```ts
import { writeFileSync, unlinkSync } from "fs"
import { join } from "path"
import { randomUUID } from "crypto"
import type { MedusaContainer } from "@medusajs/framework/types"

export interface ExecutionResult {
  result: unknown
  logs: string[]
  execution_ms: number
}

const TIMEOUT_MS = 30_000

export async function executeCode(
  code: string,
  container: MedusaContainer
): Promise<ExecutionResult> {
  const tempFile = join(process.cwd(), `.medusa-exec-${randomUUID()}.ts`)
  writeFileSync(tempFile, code)

  const logs: string[] = []
  const originalLog = console.log
  console.log = (...args: any[]) => {
    logs.push(args.map(String).join(" "))
    originalLog(...args)
  }
  const log = (...args: unknown[]) => logs.push(args.map(String).join(" "))

  const start = Date.now()

  try {
    let mod: any
    try {
      mod = require(tempFile)
    } catch (err: any) {
      const error: any = new Error(err.message ?? "Compilation failed")
      error.code = "COMPILE_ERROR"
      error.details = { stack: err.stack?.trim() ?? "" }
      throw error
    }

    const fn = mod.default
    if (typeof fn !== "function") {
      const error: any = new Error("Script must default-export an async function.")
      error.code = "INVALID_EXPORT"
      throw error
    }

    const result = await Promise.race([
      fn({ container, log }),
      new Promise<never>((_, reject) =>
        setTimeout(() => {
          const error: any = new Error("Execution exceeded 30s")
          error.code = "TIMEOUT"
          reject(error)
        }, TIMEOUT_MS)
      ),
    ])

    return { result: result ?? null, logs, execution_ms: Date.now() - start }
  } catch (err: any) {
    if (err.code) throw err
    const error: any = new Error(err.message ?? String(err))
    error.code = "RUNTIME_ERROR"
    error.details = { stack: err.stack?.trim() ?? "" }
    throw error
  } finally {
    console.log = originalLog
    delete require.cache[require.resolve(tempFile)]
    try { unlinkSync(tempFile) } catch { /* ignore */ }
  }
}
```

## A ferramenta MedusaExec

```ts
// src/modules/agent/tools/medusa-exec.ts
import { z } from "@medusajs/framework/zod"
import { tool } from "ai"
import { executeCode } from "../../../lib/code-mode/executor"

export const medusaExecTool = tool({
  description: ``,  // injected from config at runtime
  inputSchema: z.object({
    code: z.string().describe("TypeScript source to execute"),
  }),
  execute: async (input, { experimental_context: context }) => {
    const container = (context as any).medusa_container
    return executeCode(input.code, container)
  },
})
```

Registre-o no seu agente e na configuração, assim como qualquer outra ferramenta (consulte `agent-setup.md`).

## Estrutura de código necessária

Todo script escrito pelo agente **deve** exportar por padrão uma função assíncrona:

```ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  // operations here
  return result  // optional — returned as `result` in ExecutionResult
}
```

> **CRÍTICO:** Se o script não exportar uma função por padrão, a execução falhará com o erro `INVALID_EXPORT`. O agente deve sempre seguir essa estrutura à risca.

## Consulta de dados

Use `query.graph()` — nunca acesse os serviços do módulo diretamente, pois isso contorna a camada de lógica de negócios do Medusa.

```ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  const query = container.resolve("query")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status", "variants.*"],
    filters: { status: "published" },
    pagination: { take: 20, skip: 0 },
  })

  log(JSON.stringify(products))
  return products
}
```

**Padrões comuns de consulta:**

```ts
// Filter by ID
filters: { id: "prod_01ABC" }

// Filter by multiple IDs
filters: { id: ["prod_01ABC", "prod_01DEF"] }

// Date range
filters: { created_at: { $gt: "2025-01-01" } }

// Nested relation fields
fields: ["id", "title", "variants.id", "variants.prices.*"]

// Pagination
pagination: { take: 50, skip: 0, order: { created_at: "DESC" } }
```

> **Sempre `log()` seus resultados** — a ferramenta retorna `logs` como a saída principal que o agente lê. Os valores de retorno são secundários. Um script que não registra nada é, na prática, silencioso.

## Códigos de erro

| Código | Causa | Solução |
|------|-------|-----|
| `COMPILE_ERROR` | Erro de análise do TypeScript/JS | Corrija a sintaxe; verifique se as importações existem |
| `INVALID_EXPORT` | Falta exportação padrão da função | Adicione `export default async function(...)` |
| `RUNTIME_ERROR` | Exceção durante a execução | Verifique a lógica; valide as entradas |
| `TIMEOUT` | Excedido o limite de 30 segundos | Reduza o escopo; adicione paginação |

## Orientação do prompt do sistema para o agente

Adicione isto ao prompt do sistema do agente para que ele saiba como usar o MedusaExec corretamente:

```ts
export const prompt = () => `
...

# MedusaExec

Use MedusaExec to query data from or make changes to the Medusa store.

Scripts MUST follow this exact structure:
\`\`\`ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  // your code here
}
\`\`\`

Rules:
- ALWAYS use query.graph() for data queries — never resolve module services directly.
- ALWAYS log results with log() so you can read the output.
- NEVER run mutations unless the user has explicitly confirmed the action.
- If a query fails, check the entity name and fields — ask MedusaDocs if unsure.

# Workflows

<!-- TODO: Add workflows reference — covers available core-flows workflows,
     their input shapes, and when to use each one for mutations. -->
`
```

## Descrição da configuração

```ts
MedusaExec: {
  description: `Execute TypeScript against the live Medusa server.

Scripts must default-export an async function:

\`\`\`ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  const query = container.resolve("query")
  const { data } = await query.graph({ entity: "product", fields: ["id", "title"] })
  log(JSON.stringify(data))
}
\`\`\`

Use for:
- Querying store data (products, orders, customers, etc.)
- Running workflows for mutations — only when user has confirmed

NEVER mutate data without explicit user confirmation.
Always use query.graph() for reads, never resolve services directly.
Always log() your results.`,
},
```
