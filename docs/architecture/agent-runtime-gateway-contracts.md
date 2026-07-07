# Medusa Agent Runtime Gateway Specification

Este documento define a especificação e os contratos de interface do **Agent Runtime Gateway** para a camada operacional `medusa-agent-skills`.

---

## 1. Arquitetura do Gateway

O **Agent Runtime Gateway** atua como uma camada intermediária que desacopla a interface do usuário (UX Console) da complexidade de provedores de LLM (LLM Providers) e frameworks de orquestração agentic (Agentic Frameworks).

```
   [ UX Console ]
         │
         ▼
[ Agent Runtime Gateway ]
   ├── [ Provider Adapters ]  ──> (OpenAI, Anthropic, Gemini, Ollama, etc.)
   └── [ Framework Adapters ] ──> (LangGraph, CrewAI, AutoGen, Mastra, etc.)
```

Essa separação garante portabilidade estrutural: qualquer cliente ou interface de governança pode enviar requisições de orquestração padronizadas e receber respostas com logs de auditoria e evidências unificadas, independentemente de qual LLM ou motor de agentes esteja executando a tarefa.

---

## 2. Gerenciamento de Estado (State Management)

O Gateway e seus correspondentes adapters suportam os seguintes modos de ciclo de vida e gerenciamento de estado:

* **stateless_request_response:** Requisições únicas e independentes sem preservação de contexto.
* **session_scoped_state:** Estado mantido em memória durante a duração de uma sessão do usuário.
* **durable_graph_state:** Estado persistente orquestrado via grafos (ex: checkpointers do LangGraph).
* **checkpointed_workflow_state:** Rastreamento durável de progresso e rollback de workflows.
* **event_sourced_trace:** Logs imutáveis orientados a eventos para auditoria retrospectiva.

---

## 3. Políticas Human-in-the-Loop (HITL)

Operações perigosas ou modificações em base de código exigem aprovação humana explícita. O Gateway implementa os seguintes níveis de interrupção (gates):

1. **plan_approval_required:** Exige aprovação antes do início de qualquer plano de execução gerado pelo agente.
2. **write_operation_approval_required:** Pausa a execução antes que qualquer arquivo seja modificado localmente.
3. **destructive_action_approval_required:** Exige confirmação para remoções de recursos, branches ou encerramentos.
4. **secret_or_pii_escalation_required:** Interrompe a execução caso haja suspeita de segredos expostos ou dados de PII (Informações Pessoais Identificáveis) no contexto do agente.
5. **merge_or_pr_action_approval_required:** Pausa e exige revisão humana antes de abrir ou mesclar Pull Requests.
