# 📚 Referência Consolidada — Jules API + Antigravity Getting Started

## Jules REST API — Sessions

### Endpoints Oficiais

| Método | Path | Descrição |
|---|---|---|
| `POST` | `/v1alpha/sessions` | Criar sessão |
| `GET` | `/v1alpha/sessions` | Listar sessões |
| `GET` | `/v1alpha/sessions/{sessionId}` | Obter sessão |
| `DELETE` | `/v1alpha/sessions/{sessionId}` | Deletar sessão |
| `POST` | `/v1alpha/sessions/{sessionId}/messages` | Enviar mensagem |
| `POST` | `/v1alpha/sessions/{sessionId}:approvePlan` | Aprovar plano |

### Endpoint Separado de Activities

| Método | Path | Descrição |
|---|---|---|
| `GET` | `/v1alpha/sessions/{sessionId}/activities` | Listar atividades |

> [!IMPORTANT]
> Activities é um endpoint **separado** do Get Session. O script `jules_session_audit.py` precisa fazer uma chamada independente para `/activities`.

### Autenticação

Header oficial:
```
x-goog-api-key: $JULES_API_KEY
```
> [!WARNING]
> NÃO usar `Authorization: Bearer`. A API Jules usa **`x-goog-api-key`** como header de autenticação.

### Session States (ciclo de vida)

```
AWAITING_PLAN_APPROVAL → IN_PROGRESS → COMPLETED
                                     → FAILED
                                     → AWAITING_USER_FEEDBACK
```

### Create Session — Body

| Campo | Tipo | Required | Descrição |
|---|---|---|---|
| `prompt` | string | **Sim** | Instrução para o Jules |
| `title` | string | Não | Título opcional |
| `sourceContext` | SourceContext | Não | Repo + branch |
| `requirePlanApproval` | boolean | Não | Forçar aprovação explícita |
| `automationMode` | string | Não | `AUTO_CREATE_PR` para PR automático |

### Get Session — Response

Campos principais no objeto Session:
- `name` — Resource name (`sessions/{id}`)
- `state` — Estado atual
- `createTime` / `updateTime` — Timestamps
- `title` — Título
- `outputs` — **Lista** de outputs (PRs, commits)

---

## Antigravity 2.0 — Getting Started

### Download e Requisitos

| OS | Requisitos |
|---|---|
| macOS | Version 12+ (Monterey). **X86 não suportado** |
| Windows | Windows 10 (64-bit) |
| Linux | glibc >= 2.28, glibcxx >= 3.4.25 |

URL: [antigravity.google/download](https://antigravity.google/download)

### Criando um Projeto

1. Clique no ícone de **pasta com "+"** no sidebar esquerdo
2. Selecione **"New Project"**
3. Use **"Add Folder"** para vincular pastas locais ou repos Git (múltiplas pastas habilitam contexto cross-repo)
4. Clique em **"Create"**
5. *(Opcional)* Configure settings e políticas de segurança isoladas por projeto

### Iniciando um Agente

1. Digite um objetivo/instrução no input de chat e pressione **Enter**
2. Escolha um **Modo**:
   - **Local Mode**: Opera diretamente nas pastas ativas
   - **New Worktree Mode**: Opera em um Git worktree isolado

### Atalhos de Teclado

| Ação | macOS | Windows/Linux |
|---|---|---|
| Conversation Picker | `⌘K` | `Ctrl+K` |
| File Search | `⌘P` | `Ctrl+P` |
| Focus Input | `⌘L` | `Ctrl+L` |
| New Conversation | `⌘N` | `Ctrl+N` |
| Next/Prev Conversation | `⌥ ↑/↓` | `Alt+↑/↓` |

### Slash Commands

| Comando | Descrição |
|---|---|
| `/goal` | Executa até o fim sem pedir feedback intermediário |
| `/grill-me` | Faz perguntas clarificatórias antes de implementar |
| `/schedule` | Configura execução como timer ou cron recorrente |
| `/browser` | Força uso de primitivas de browser (requer Chrome) |
