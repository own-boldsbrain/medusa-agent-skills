# Transmissão

Respostas do agente são transmitidas como NDJSON (JSON separado por linha de quebra) — um objeto JSON por linha, emitido incrementalmente à medida que o modelo produz saída.

## Server-Side: Emitindo Chunks

```ts
// Set headers before writing anything
res.setHeader("Content-Type", "application/x-ndjson")
res.setHeader("Transfer-Encoding", "chunked")
res.setHeader("Cache-Control", "no-cache")

// Helper: serialize one object as a line
const emit = (obj: object) => res.write(JSON.stringify(obj) + "\n")
```

### Tipos de Chunk

| `digitar` | Quando emitido | Forma |
|--------|-------------|-------|
| `session_id` | Imediatamente no início | `{ tipo: "id_de_sessão", sessionId: string }` |
| `texto` | Cada palavra/token do modelo | `{ tipo: "texto", conteúdo: string }` |
| `tool_call` | Quando uma ferramenta dispara | { tipo: "tool_call", ferramenta: string, argumentos: objeto } |
| `resultado_da_ferramenta` | Quando uma chamada de ferramenta é concluída | `{ "type": "resultado_ferramenta", "ferramenta": string }` |

## Repetindo o Fluxo Completo

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

> **Nota:**O SDK de IA da Vercel utiliza nomes de campos inconsistentes entre versões. Sempre recorra a `text ?? textDelta ?? delta` e `args ?? input` para garantir a segurança.

## Client-Lado: Parse o Stream NDJSON**Parâmetros***`stream`: O stream NDJSON a ser processado

**Exemplo**```bash

# Criar um stream NDJSON a partir de um arquivo

$ cat example.ndjson | python -c "import json; import sys; for line in sys.stdin: print(json.loads(line))"

# Ler um stream NDJSON a partir de um arquivo

with open('example.ndjson', 'r') as f:
    for line in f:
        print(json.loads(line))

```**Processamento do Stream NDJSON**O processamento do stream NDJSON envolve as seguintes etapas:

1.**Leitura do Stream**: Leia o stream NDJSON a partir de um arquivo ou de um fluxo de dados.
2. **Parâmetros de Entrada**: Verifique se os parâmetros de entrada estão corretos e se o stream NDJSON está no formato correto.
3. **Parse do NDJSON**: Use uma biblioteca de parsing de NDJSON (como `ndjson`) para parsear o stream NDJSON e converter em um objeto JSON.
4. **Processamento do Objeto JSON**: Processar o objeto JSON a partir do parse do NDJSON.
5. **Saída**: Exibir a saída do processamento do objeto JSON.

**Exemplo de Implementação**```python
import json
import ndjson

def process_ndjson_stream(stream):
    # Verificar se os parâmetros de entrada estão corretos
    if not stream:
        raise ValueError("Stream NDJSON vazio")

    # Parse o NDJSON
    for line in stream:
        try:
            obj = ndjson.loads(line)
        except json.JSONDecodeError as e:
            raise ValueError(f"Erro ao parsear linha: {e}")

        # Processar o objeto JSON
        process_object(obj)

        # Exibir a saída do processamento do objeto JSON
        print(obj)

# Exemplo de implementação do processamento do objeto JSON
def process_object(obj):
    # Processar o objeto JSON aqui
    pass
```**Referências***[NDJSON](https://ndjson.org/)
* [json](https://docs.python.org/3/library/json.html)
* [ndjson](https://pypi.org/project/ndjson/)

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

## Regras Principais

***Buffer linhas incompletas**— pacotes de rede podem dividir um objeto JSON em duas leituras. Sempre acumule um buffer e divida em `\n`.***`credentials: "include"`**— O admin do Medusa usa autenticação baseada em cookies; sem isso, a solicitação é rejeitada como não autenticada.***Emita `session_id` primeiro**— o cliente precisa disso antes de qualquer outro pedaço para poder vincular mensagens de usuário subsequentes à mesma sessão.***Chame `res.end()`**— sem isso, o `reader.read()` do cliente nunca retorna `done: true` e a conexão fica travada.***`Transferência-Codificação: em blocos`** — informa a camada HTTP para não armazenar o corpo da resposta em buffer; necessário para streaming verdadeiro.
