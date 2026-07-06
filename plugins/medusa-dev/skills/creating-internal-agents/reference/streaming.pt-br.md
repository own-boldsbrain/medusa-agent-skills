# Transmissão

As respostas do agente são transmitidas como NDJSON (JSON delimitado por quebras de linha) — um objeto JSON por linha, emitidos de forma incremental à medida que o modelo produz resultados.

## Lado do servidor: emissão de blocos

```ts
// Set headers before writing anything
res.setHeader("Content-Type", "application/x-ndjson")
res.setHeader("Transfer-Encoding", "chunked")
res.setHeader("Cache-Control", "no-cache")

// Helper: serialize one object as a line
const emit = (obj: object) => res.write(JSON.stringify(obj) + "\n")
```

## Tipos de blocos

| `tipo` | Quando emitido | Formato |
|--------|-------------|-------|
| `session_id` | Imediatamente no início | `{ type: "session_id", sessionId: string }` |
| `text` | Cada palavra/token do modelo | `{ type: "text", content: string }` |
| `tool_call` | Quando uma ferramenta é acionada | `{ type: "tool_call", tool: string, args: object }` |
| `tool_result` | Quando uma chamada de ferramenta é concluída | `{ type: "tool_result", tool: string }` |

## Iterando pelo fluxo completo

```ts
for await (const chunk of result.fullStream) {
  if (chunk.type === "text-delta") {
    const text =
      (chunk as any).text ??
      (chunk as any).textDelta ??
      (chunk as any).delta ??
      ""
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

res.end()  // REQUIRED — closes the HTTP response
```

> **Observação:** O SDK de IA do Vercel usa nomes de campos inconsistentes entre as versões. Por segurança, sempre recorra a `text ?? textDelta ?? delta` e `args ?? input`.

## Lado do cliente: Análise do fluxo NDJSON

```ts
async function sendMessage(messages: any[], sessionId: string | null) {
  const response = await fetch("/admin/my-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, session_id: sessionId }),
    credentials: "include",  // sends admin session cookie
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const chunk = JSON.parse(line)
        handleChunk(chunk)
      } catch {
        // incomplete JSON line — wait for more data
      }
    }
  }
}

function handleChunk(chunk: any) {
  if (chunk.type === "session_id") {
    // Persist session ID in state for subsequent messages
    setSessionId(chunk.sessionId)
  } else if (chunk.type === "text") {
    // Append text to the current assistant message
    appendToLastMessage(chunk.content)
  } else if (chunk.type === "tool_call") {
    // Show a "running" indicator for this tool
    addToolCall({ tool: chunk.tool, status: "running" })
  } else if (chunk.type === "tool_result") {
    // Mark the tool call as done
    markToolDone(chunk.tool)
  }
}
```

## Regras principais

- **Buffer para linhas incompletas** — os pacotes de rede podem dividir um objeto JSON em duas leituras. Sempre acumule um buffer e divida em `\n`.
- **`credentials: "include"`** — o Medusa admin usa autenticação baseada em cookies; sem isso, a solicitação é rejeitada por não estar autenticada.
- **Envie o `session_id` primeiro** — o cliente precisa disso antes de qualquer outro bloco para poder vincular as mensagens subsequentes do usuário à mesma sessão.
- **Chame `res.end()`** — sem isso, o `reader.read()` do cliente nunca retorna `done: true` e a conexão fica travada.
- **`Transfer-Encoding: chunked`** — indica à camada HTTP para não armazenar em buffer o corpo da resposta; necessário para um streaming verdadeiro.
