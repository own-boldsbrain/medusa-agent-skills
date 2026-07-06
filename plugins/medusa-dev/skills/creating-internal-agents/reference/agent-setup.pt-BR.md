# Configuração do Agente

O tempo de execução do agente é uma função que chama `streamText` do SDK de IA do Vercel com ferramentas, uma prompt de sistema e um modelo. As ferramentas são definidas separadamente e conectadas por meio de um objeto de configuração para que as descrições possam ser alteradas sem tocar a lógica da ferramenta.

> **Use o MedusaExec em vez de ferramentas personalizadas.** Para qualquer operação que leia ou escreva dados do Medusa, o agente deve escrever TypeScript e executá-lo via MedusaExec. Isso é muito mais eficiente do que construir uma ferramenta separada para cada operação — uma única ferramenta MedusaExec substitui dezenas de ferramentas personalizadas. Só construa uma ferramenta personalizada para capacidades que realmente não possam ser expressas como TypeScript executável (ex.: chamar uma API externa com um segredo, enviar um e-mail via SDK de terceiros).

## Função do Agente

```ts
// src/modules/agent/agents/index.ts
import { smoothStream, stepCountIs, streamText, Tool } from "ai"
import { medusaExecTool } from "../tools/medusa-exec"
import { todoWriteTool } from "../tools/todo-write"

export const myAgent = (options) => {
  const config = options.config

  const allTools = {
    TodoWrite: todoWriteTool,
    MedusaExec: medusaExecTool,
  }

  const tools: Record<string, Tool> = {}
  const activeTools: string[] = []

  for (const [toolName, toolConfig] of Object.entries(config.tools)) {
    const toolImpl = allTools[toolName as keyof typeof allTools]
    if (toolImpl) {
      tools[toolName] = {
        ...toolImpl,
        description: (toolConfig as any).description,
      }
      activeTools.push(toolName)
    }
  }

  const { config: _, ...restOptions } = options

  return streamText({
    ...restOptions,
    system: config.systemPrompt(),
    maxOutputTokens: 61000,
    stopWhen: stepCountIs(100),   // prevent infinite loops
    tools,
    activeTools,
    experimental_transform: [smoothStream({ chunking: "word" })],
    onStepFinish({ stepType, toolCalls, finishReason, usage }) {
      if (toolCalls?.length) {
        for (const call of toolCalls) {
          console.log(`[agent] tool_call  ${call.toolName}`, JSON.stringify(call.input ?? call.args))
        }
      }
      console.log(`[agent] step_finish type=${stepType} finish=${finishReason} tokens=${usage?.totalTokens ?? "?"}`)
    },
  })
}
```

## Objeto de Configuração

```ts
// src/modules/agent/config/index.ts
import { prompt } from "./prompt"

const defaultConfig = {
  systemPrompt: prompt,
  tools: {
    TodoWrite: {
      description: `Track task progress. Call at the start of every multi-step task. Only one todo in_progress at a time.`,
    },
    MedusaExec: {
      description: `Execute TypeScript against the live Medusa server to query or mutate data.

Scripts must default-export an async function:

\`\`\`ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  const query = container.resolve("query")
  const { data } = await query.graph({ entity: "product", fields: ["id", "title"] })
  log(JSON.stringify(data))
}
\`\`\`

Use for ALL data operations — queries and mutations. Always use query.graph() for reads.
Never mutate data without explicit user confirmation. Always log() results.`,
    },
  },
}

export default defaultConfig
```

## Prompt do Sistema

```ts
// src/modules/agent/config/prompt.ts
export const prompt = () => `
You are a [describe the agent's role and domain].

Core behavior:
- [List 3-5 key behavioral rules specific to this agent's purpose]
- Research before acting — always query data with MedusaExec before making changes
- Ask for confirmation before any mutation

Available tools:
- MedusaExec: query and mutate Medusa data by writing TypeScript — use this for ALL data operations
- TodoWrite: track multi-step progress

[Domain-specific guidance here]

Tone: concise, direct, fewer than 4 lines unless detail is requested.
`
```

## Parâmetros `streamText` principais

| Parâmetro | Propósito |
|-----------|---------|
| `modelo` | A instância do modelo Anthropic do serviço |
| mensagens | Histórico completo da conversa (usuário + assistente turnos) |
| `sistema` | Sistema de prompt de string |
| `maxOutputTokens` | Uso de tokens por resposta |
| `stopWhen: etapaÉContagem(100)` | Chave de desligamento — impede loops de ferramentas descontrolados |
| `contexto_experimental` | Objeto passado para todas as funções `execute` de ferramentas |
| `experimental_transform` | `smoothStream` para saída dividida em palavras |
| `activeTools` | Subconjunto de ferramentas que o agente pode usar nesta vez |