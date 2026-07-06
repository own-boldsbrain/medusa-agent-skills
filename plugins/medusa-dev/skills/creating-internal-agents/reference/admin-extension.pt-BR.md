# Extensão de Administração

A interface de chat do administrador é uma extensão de página do React registrada em `src/admin/routes/<name>/page.tsx`.

## Página de Registro

```tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"

export const config = defineRouteConfig({
  label: "My Agent",
  icon: ChatBubbleLeftRight,
})
```

## Bibliotecas de Componentes da Interface Administrativa UI

Somente use estes — eles são agrupados com o administrador do Medusa:

```tsx
import { useState, useRef, useEffect, useCallback } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, PlusMini, Wrench, AcademicCap } from "@medusajs/icons"
import { Button, Textarea, clx } from "@medusajs/ui"
```

> Não importe de `@headlessui`, `shadcn` ou outras bibliotecas de interface — elas não estão embutidas no administrador.

## Tipos

```tsx
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  toolCalls: ToolCall[]
}

type ToolCall = { tool: string; status: "running" | "done" }

type Session = { id: string; title: string | null; created_at: string }
```

## **Layout Completo**

A interface de usuário utiliza um layout de duas colunas: uma barra lateral de sessão com largura fixa à esquerda e a área de chat preenchendo o restante.

```tsx
export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadSessions() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  return (
    <div className="flex h-screen bg-ui-bg-subtle overflow-hidden">

      {/*── Sidebar ──*/}
      <div className="w-[320px] shrink-0 flex flex-col border-r border-ui-border-base bg-ui-bg-base">
        <div className="p-3">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-ui-border-base bg-ui-bg-base hover:bg-ui-bg-subtle transition-colors txt-compact-small-plus text-ui-fg-base"
          >
            <PlusMini className="w-4 h-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-0.5">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={clx(
                "w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors",
                s.id === sessionId
                  ? "bg-ui-bg-subtle"
                  : "hover:bg-ui-bg-subtle"
              )}
            >
              <ChatBubbleLeftRight className="w-4 h-4 text-ui-fg-muted shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="txt-compact-small text-ui-fg-base truncate">
                  {s.title ?? "New conversation"}
                </p>
                <p className="txt-compact-xsmall text-ui-fg-muted">
                  {relativeTime(s.created_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/*── Main chat area ──*/}
      <div className="flex-1 flex flex-col min-w-0">

        {/*Header*/}
        <div className="flex items-center gap-3 px-6 py-4 bg-ui-bg-base border-b border-ui-border-base shrink-0">
          <div className="w-9 h-9 rounded-full bg-ui-tag-green-bg flex items-center justify-center shrink-0">
            <AcademicCap className="w-5 h-5 text-ui-tag-green-icon" />
          </div>
          <div>
            <p className="txt-compact-medium-plus text-ui-fg-base">Store Agent</p>
            <p className="txt-compact-small text-ui-fg-muted">
              Ask questions or give commands about your store
            </p>
          </div>
        </div>

        {/*Messages*/}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {messages.map((msg, i) => (
            <MessageRow
              key={msg.id}
              msg={msg}
              isStreaming={isStreaming && i === messages.length - 1}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {/*Input*/}
        <div className="px-6 py-4 bg-ui-bg-base border-t border-ui-border-base shrink-0">
          <div className="flex items-end gap-3 bg-ui-bg-subtle border border-ui-border-base rounded-2xl px-4 py-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask anything about your store…"
              rows={1}
              className="flex-1 resize-none bg-transparent border-0 shadow-none focus:ring-0 txt-compact-small text-ui-fg-base placeholder:text-ui-fg-muted"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="w-8 h-8 rounded-full bg-ui-button-inverted flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M8 12V4M4 8l4-4 4 4" stroke="white" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
```

## Linha de Mensagem

As mensagens do usuário são bolhas verde-escuras alinhadas à direita. As mensagens do assistente são alinhadas à esquerda, com um avatar de agente e um bloco opcional de chamada de ferramenta recolhível acima do texto.

```tsx
function MessageRow({ msg, isStreaming }: { msg: Message; isStreaming: boolean }) {
  if (msg.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2.5">
        <div className="max-w-[70%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-ui-button-inverted">
          <p className="txt-compact-small text-white whitespace-pre-wrap">{msg.content}</p>
        </div>
        {/*User avatar*/}
        <div className="w-7 h-7 rounded-full bg-ui-fg-base flex items-center justify-center shrink-0">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <circle cx="8" cy="5.5" r="2.5" fill="white" />
            <path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="white" strokeWidth="1.5"
              strokeLinecap="round" />
          </svg>
        </div>
      </div>
    )
  }

  // Assistant
  return (
    <div className="flex items-start gap-2.5">
      {/*Agent avatar*/}
      <div className="w-7 h-7 rounded-full bg-ui-tag-green-bg flex items-center justify-center shrink-0 mt-0.5">
        <AcademicCap className="w-4 h-4 text-ui-tag-green-icon" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/*Tool call pill*/}
        <ToolCallPill toolCalls={msg.toolCalls} isStreaming={isStreaming} />

        {/*Message text*/}
        {msg.content && (
          <div className="bg-ui-bg-base border border-ui-border-base rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[70%]">
            <p className="txt-compact-small text-ui-fg-base whitespace-pre-wrap">{msg.content}</p>
          </div>
        )}

        {/*Streaming indicator*/}
        {isStreaming && !msg.content && (
          <div className="flex items-center gap-1 px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-ui-fg-muted animate-bounce"
                style={{ animationDelay: `${i *0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

## Chamada de Ferramenta Comprimido

Pílula recolhível que aparece acima do texto da mensagem do assistente. Recolhe automaticamente quando o streaming termina.

```tsx
const HIDDEN_TOOLS = new Set(["TodoWrite", "Skills"])

function ToolCallPill({ toolCalls, isStreaming }: { toolCalls: ToolCall[]; isStreaming: boolean }) {
  const [expanded, setExpanded] = useState(true)
  const visible = toolCalls.filter((tc) => !HIDDEN_TOOLS.has(tc.tool))

  useEffect(() => {
    if (!isStreaming) setExpanded(false)
  }, [isStreaming])

  if (!visible.length) return null

  const allDone = visible.every((tc) => tc.status === "done")
  const label = isStreaming
    ? "Calling tools…"
    : `${visible.length} tool call${visible.length !== 1 ? "s" : ""} made`

  return (
    <div className="inline-flex flex-col max-w-fit">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ui-border-base bg-ui-bg-base hover:bg-ui-bg-subtle transition-colors"
      >
        <Wrench className="w-3.5 h-3.5 text-ui-fg-muted" />
        <span className="txt-compact-xsmall text-ui-fg-muted">{label}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={clx("w-3 h-3 text-ui-fg-muted transition-transform", expanded && "rotate-180")}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div className="flex flex-col gap-1 mt-1.5 pl-2">
          {visible.map((tc, i) => (
            <div key={i} className="flex items-center gap-2">
              {tc.status === "running" ? (
                <span className="w-3 h-3 rounded-full border-2 border-ui-fg-muted border-t-transparent animate-spin shrink-0" />
              ) : (
                <span className="w-3 h-3 rounded-full bg-ui-tag-green-icon shrink-0" />
              )}
              <span className="txt-compact-xsmall text-ui-fg-muted">{tc.tool}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Streaming Fetch

# Streaming Fetch

O Streaming Fetch é uma técnica de programação que permite que você faça requisições HTTP de forma assíncrona e em tempo real, permitindo que você processe os dados à medida que eles são recebidos.

## Exemplo

```bash
# Usando o método fetch para fazer uma requisição HTTP
fetch('https://api.example.com/dados')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Vantagens***Melhoria da experiência do usuário**: ao processar os dados em tempo real, você pode fornecer uma experiência mais imediata e interativa para o usuário

***Redução do carregamento da página**: ao processar os dados em tempo real, você pode reduzir a quantidade de dados que precisam ser carregados na página, o que pode melhorar a velocidade de carregamento.
***Melhoria da escalabilidade**: ao processar os dados em tempo real, você pode melhorar a escalabilidade de sua aplicação, pois você pode lidar com uma grande quantidade de dados sem que isso afete a velocidade de processamento.

## Exemplos de uso

***Carregamento de dados em tempo real**: você pode usar o Streaming Fetch para carregar dados em tempo real, como notícias, previsões do tempo, etc.
***Processamento de imagens em tempo real**: você pode usar o Streaming Fetch para processar imagens em tempo real, como aplicando efeitos de vídeo, etc.
***Integração com APIs**: você pode usar o Streaming Fetch para integrar com APIs que fornecem dados em tempo real, como APIs de notícias, previsões do tempo, etc.

## Referências

* [Streaming Fetch](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Streaming)
* [Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)

**Observação:** O Streaming Fetch é uma técnica de programação que pode ser usada em diferentes contextos, como web, mobile, etc.

```tsx
async function handleSend() {
  const text = input.trim()
  if (!text || isStreaming) return
  setInput("")
  await sendMessage(text)
}

async function sendMessage(userText: string) {
  const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: userText, toolCalls: [] }
  const updatedMessages = [...messages, userMsg]
  setMessages(updatedMessages)
  setIsStreaming(true)

  const assistantId = crypto.randomUUID()
  setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", toolCalls: [] }])

  const response = await fetch("/admin/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      session_id: sessionId,
    }),
    credentials: "include",
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const chunk = JSON.parse(line)
        if (chunk.type === "session_id") {
          setSessionId(chunk.sessionId)
          loadSessions()
        } else if (chunk.type === "text") {
          setMessages((prev) => prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk.content } : m
          ))
        } else if (chunk.type === "tool_call") {
          setMessages((prev) => prev.map((m) =>
            m.id === assistantId
              ? { ...m, toolCalls: [...m.toolCalls, { tool: chunk.tool, status: "running" }] }
              : m
          ))
        } else if (chunk.type === "tool_result") {
          setMessages((prev) => prev.map((m) =>
            m.id === assistantId
              ? { ...m, toolCalls: m.toolCalls.map((tc) => tc.tool === chunk.tool ? { ...tc, status: "done" } : tc) }
              : m
          ))
        }
      } catch { /*incomplete line*/ }
    }
  }

  setIsStreaming(false)
}
```

## Gerenciamento de Sessão

```tsx
function startNewChat() {
  setSessionId(null)
  setMessages([])
}

async function loadSessions() {
  const res = await fetch("/admin/agent/sessions", { credentials: "include" })
  const { sessions } = await res.json()
  setSessions(sessions)
}

async function loadSession(id: string) {
  const res = await fetch(`/admin/agent/sessions/${id}`, { credentials: "include" })
  const { messages: msgs } = await res.json()
  setSessionId(id)
  setMessages(msgs.map((m: any) => ({ id: m.id, role: m.role, content: m.content, toolCalls: [] })))
}
```

## Auxiliar de Tempo Relativo

```tsx
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
```
