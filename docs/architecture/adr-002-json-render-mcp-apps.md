# ADR-002: Uso de `@json-render/mcp` como extensão MCP Apps

**Status:** Proposto
**Data:** 2026-08-14
**Decisores:** Owner de arquitetura e segurança do `medusa-agent-skills`

---

## Contexto

O Tools Plan define servidores MCP especializados por domínio (`medusa-repo`, `medusa-architecture`, `medusa-workflow`, `medusa-storefront` e outros). Esses servidores expõem ferramentas operacionais executáveis e devem obedecer aos contratos locais de JSON-RPC 2.0, transporte, segurança, observabilidade e validação de output.

O pacote `@json-render/mcp@0.19.0` resolve outro problema: publicar uma especificação `json-render` como **MCP App**, com uma tool de renderização e um recurso HTML `ui://` exibido em clientes compatíveis. Ele depende de `@modelcontextprotocol/sdk@^1.27.1`, `@modelcontextprotocol/ext-apps@^1.2.0` e `@json-render/core@0.19.0`; o lado iframe declara peers `react` e `react-dom` `^19.0.0`.

## Evidência inspecionada

O tarball npm publicado foi inspecionado diretamente. A API exposta:

- `createMcpApp`: cria um `McpServer`, registra uma tool e um recurso UI.
- `registerJsonRenderTool`: registra a tool, por padrão `render-ui`.
- `registerJsonRenderResource`: publica HTML autocontido sob `ui://<tool>/view.html`.
- `useJsonRenderApp`: conecta o iframe ao host via `@modelcontextprotocol/ext-apps`.

O transporte não é implementado pelo pacote; o consumidor conecta o `McpServer` a `StdioServerTransport`, Streamable HTTP ou outro transporte do SDK.

## Compatibilidade com o Tools Plan

| Dimensão | Avaliação |
|---|---|
| Ferramentas executáveis | Parcial: registra `render-ui`, não ferramentas operacionais Medusa |
| Servidores especializados por domínio | Não substitui; deve complementar um servidor existente |
| Recursos MCP | Compatível: publica recurso `ui://` |
| stdio | Compatível quando conectado ao transporte oficial do SDK |
| Streamable HTTP | Não configurado pelo pacote; responsabilidade do host |
| JSON-RPC 2.0 | Herdado do SDK/transport, não governado diretamente pelo pacote |
| Catálogo/schema | Parcial: usa o schema Zod do catálogo |
| UX Plan | Forte aderência: dashboards, formulários e aprovações dentro do cliente MCP |

## Gaps contra os contratos locais

### Validação fail-open

O handler executa `catalog.validate(spec)`, mas usa o payload original quando a validação falha:

```ts
const validation = catalog.validate(spec)
const validSpec = validation.success ? validation.data : spec
```

Isso viola o requisito do roadmap de que toda resposta seja estruturalmente compatível com seu schema. A integração local deve rejeitar o request com erro tipado quando `validation.success === false`; nunca pode renderizar o payload não validado.

### Segurança não fornecida

O pacote não implementa:

- autenticação para Streamable HTTP;
- validação de `Origin`;
- binding obrigatório em `127.0.0.1`;
- secret redaction;
- modelo de permissão de tools;
- confirmação de ações perigosas;
- limites de sessão/concorrência;
- logs estruturados ou métricas Prometheus.

Essas capacidades permanecem obrigatórias no servidor host.

### CSP ampla

O recurso registrado publica `resourceDomains: ["https:"]` e `connectDomains: ["https:"]`. O contrato local exige menor privilégio; a integração deve fornecer allowlists explícitas por domínio ou bloquear rede externa por padrão.

### Ações e HITL

A tool `render-ui` é nominalmente read-only, mas componentes podem disparar ações e chamar tools do servidor. A UI não pode converter uma aprovação visual em autorização operacional implícita. Toda ação deve mapear para o `side_effect_level` da tool real e passar pelos gates `tool_call_approval_required`, `write_operation_approval_required` ou `destructive_action_approval_required` conforme aplicável.

## Decisão

Adotar `@json-render/mcp` apenas como **extensão proposta de UX/MCP Apps**, nunca como substituto dos servidores do Tools Plan.

Condições para um spike integrado:

1. Registrar UI em um `McpServer` governado existente, em vez de criar um servidor paralelo sem contrato.
2. Envolver `registerJsonRenderTool` com validação fail-closed.
3. Declarar a tool e o recurso no registry MCP correspondente.
4. Manter o transporte, autenticação, sessões, origin validation e observabilidade no host.
5. Usar CSP com allowlist explícita e rede externa bloqueada por padrão.
6. Encaminhar ações pelo `GenerativeUIAdapter` e pelos gates HITL; nenhuma action handler executa mutação diretamente no iframe.
7. Fixar `@json-render/mcp@0.19.0`, `@modelcontextprotocol/sdk@1.27.1` e `@modelcontextprotocol/ext-apps@1.2.0` durante o spike.

## Consequências

**Positivas**

- aproxima Tools Plan e UX Plan sem duplicar o servidor operacional;
- permite dashboards e formulários portáveis em clientes MCP Apps;
- reutiliza o catálogo versionado de Generative UI.

**Negativas**

- adiciona uma extensão MCP ainda jovem e dependente da capacidade do cliente;
- requer wrapper de segurança e validação próprio;
- o renderer iframe continua sujeito à matriz de React do pacote;
- clientes sem MCP Apps recebem apenas o conteúdo textual da tool.

## Critérios de saída do status `proposed`

- teste negativo prova rejeição de spec inválido;
- stdio sem ruído em stdout e logs apenas em stderr;
- Streamable HTTP passa origin/auth/session contract;
- CSP sem wildcards de esquema;
- ações read-only, write e destructive exercitam gates HITL distintos;
- cliente sem suporte a MCP Apps recebe fallback textual útil;
- evidência de compatibilidade em pelo menos dois clientes MCP Apps.

## Veredito

`@json-render/mcp@0.19.0` é **adequado como camada opcional de apresentação** e **inadequado como servidor MCP operacional autossuficiente** sob os contratos atuais. O maior bloqueador técnico é a validação fail-open; os demais gaps são responsabilidades do servidor host e devem ser tratados explicitamente antes de qualquer status `active`.
