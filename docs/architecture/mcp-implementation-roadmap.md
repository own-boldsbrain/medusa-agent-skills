# Medusa MCP Implementation Roadmap

Este documento estabelece o plano de implementação e a evolução técnica para os servidores de **Model Context Protocol (MCP)** e adapters de orquestração agentic no repositório `medusa-agent-skills`.

---

## 1. Visão Geral das Fases

O objetivo é transformar os pacotes de conhecimento estático do repositório em uma **Camada Operacional Agentic ativa para Medusa.js v2**, dividindo a execução em quatro marcos principais:

```
[Fase 1: Fundações] ──> [Fase 2: MCPs Funcionais] ──> [Fase 3: Runtime & Adapters] ──> [Fase 4: UX Console]
```

* **Fase 1: Fundações (Checkpoints 1 & 2)**
  * Criação do mapeamento de arquitetura AS-IS → TO-BE.
  * Estruturação dos Registries de MCPs, Providers e Frameworks.
  * Definição dos Schemas de validação e restrições estruturais de rotas, workflows e data models.
* **Fase 2: Servidores MCP Funcionais**
  * Desenvolvimento dos primeiros servidores MCP em TypeScript (`mcps/`).
  * Implementação de ferramentas operacionais essenciais (ex: `validate_layering`, `run_secret_scan`).
  * Integração com ferramentas locais de verificação (AST validators, pytest).
* **Fase 3: Runtime Gateway & Adapters**
  * Criação do pacote `packages/agent-runtime-gateway`.
  * Desenvolvimento de conectores/adapters portáveis para LangGraph, CrewAI, AutoGen, Mastra, Vercel AI SDK e Agno.
  * Padronização do contrato de inputs/outputs unificados.
* **Fase 4: UX Console e Painel de Governança**
  * Desenvolvimento da aplicação frontend `apps/console`.
  * Criação de painel de controle de execuções, visualizador de grafos de workflows e portal de aprovação humana.

---

## 2. Detalhamento dos MCPs e Escopo de Ferramentas

Os MCPs operacionais validarão as conformidades estruturais do Medusa.js v2 no repositório de destino:

### A. medusa-repo e medusa-architecture

* **Função:** Analisar a integridade do código do projeto Medusa v2 alvo.
* **Ferramentas Chave:**
  * `scan_project`: Identifica versão do Medusa e estrutura do monorepo.
  * `validate_layering`: Garante o fluxo estrito `Module → Workflow → API Route → Frontend`.
  * `detect_route_service_bypass`: Identifica se rotas estão chamando serviços de banco de dados ou queries sem passar por workflows.

### B. medusa-workflow e medusa-schema

* **Função:** Validar a conformidade dos fluxos duráveis e persistência.
* **Ferramentas Chave:**
  * `inspect_workflows`: Mapeia steps e rollback compensation.
  * `validate_constructor_constraints`: Garante que o construtor do workflow não use sintaxe assíncrona do tipo "arrow function", o que impediria a renderização correta do grafo Medusa.
  * `inspect_data_models`: Audita schemas DML e migrations existentes.

### C. medusa-storefront e medusa-audit

* **Função:** Verificar o consumo no cliente e atuar como gatekeeper local contra erros e vazamentos.
* **Ferramentas Chave:**
  * `validate_sdk_usage`: Impede requisições brutas via `fetch` em favor dos hooks de React Query do Medusa JS SDK.
  * `run_secret_scan`: Impede vazamento e versão de tokens de desenvolvimento em arquivos rastreáveis.
  * `emit_validation_report`: Emite o relatório de conformidade usando o schema `evidence-report.schema.json`.

---

## 3. Estratégia de Validação e Critérios de Transição

Cada incremento de ferramenta/MCP no repositório seguirá rigorosamente as regras de governança locais:

### Requisitos por Tool

1. **JSON Validation:** Toda resposta gerada deve ser estruturalmente compatível com seu schema de output especificado no registry.
2. **Semantização de Erros:** Exposição de erros claros de execução e validação estrutural.
3. **Secret Gate:** Qualquer arquivo gerado ou analisado deve passar pelo filtro de redação de metadados para garantir que chaves parciais, hashes ou tokens (ex: GitHub, Hugging Face, Jules) nunca sejam persistidos ou logados.
4. **Merge Protection:** Integração e ativação dos MCPs em branches limpas baseadas na `main`, sem arrastar histórico sensível ou arquivos de logs não ignorados.
