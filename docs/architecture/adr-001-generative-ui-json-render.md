# ADR-001: Adoção de `json-render` como camada de Generative UI

**Status:** Proposto
**Data:** 2026-08-14
**Decisores:** Owner de arquitetura do `medusa-agent-skills` (aprovação necessária antes de qualquer dependência entrar em `packages/` ou `apps/`)

---

## Contexto

O [AS-IS to TO-BE](as-is-to-be-medusa-agentic-layer.md) define quatro planos operacionais, sendo o quarto o **UX Plan**: um `apps/console` para auditoria de execuções de agentes em tempo real e um *dashboard* de aprovação humana (`Approval Gate`). Esse plano ainda não existe em código — é o ponto mais verde da arquitetura proposta.

Em paralelo, a skill `creating-internal-agents` já define uma arquitetura de agente admin-facing em produção conceitual: `streamText` do AI SDK, streaming NDJSON (`application/x-ndjson`), tools via `MedusaExec`, e uma extensão de chat no Medusa Admin. O levantamento do código da skill mostra 16 referências a `streamText` e 9 a `experimental_context`, e **nenhuma** a `streamObject`, `generateObject`, `useChat` ou `ToolLoopAgent`. Ou seja: a saída do agente hoje é **texto**, renderizado como texto.

Isso cria a lacuna que motiva este ADR. Um agente de operações de loja que responde "encontrei 47 produtos sem imagem" deveria poder devolver uma tabela acionável, um gráfico de cohort ou um formulário de correção em lote — não um parágrafo. É exatamente o problema que *generative UI* endereça: deixar o modelo compor a interface, sem deixá-lo emitir markup arbitrário.

`vercel-labs/json-render` se propõe a isso restringindo a geração a um catálogo de componentes declarado via Zod: o modelo emite um JSON validado contra o schema, e um renderer transforma esse JSON em UI. As forças em jogo:

* O repositório tem uma **postura declarada de portabilidade** — `registries/`, `schemas/`, contratos `AgentRuntimeAdapter`. Qualquer dependência acoplada a um framework específico atrita com isso.
* O [Agent Runtime Gateway](agent-runtime-gateway-contracts.md) define cinco *gates* de HITL. Uma camada de UI generativa que trate "ação" como cidadão de primeira classe pode alimentar esses gates diretamente.
* Há uma restrição de plataforma dura (detalhada abaixo) que elimina a opção mais óbvia.

---

## Decisão

Adotar `json-render` **em duas velocidades**, separando o contrato do renderer:

1. **`@json-render/core` como camada de contrato**, versionado em `packages/`, definindo o catálogo de componentes e ações da camada agentic Medusa. Sem dependência de framework de UI.
2. **`@json-render/react` + `@json-render/shadcn` apenas no greenfield `apps/console`**, que nasce em React 19.
3. **Medusa Admin permanece com a renderização atual** (texto/NDJSON) até que a restrição de React seja resolvida.
4. Tudo isolado atrás de um contrato próprio, `GenerativeUIAdapter`, seguindo o padrão já estabelecido por `AgentRuntimeAdapter`.

---

## A restrição que elimina a opção óbvia

A opção natural — "usar json-render no chat do Medusa Admin, onde o agente já vive" — **não é instalável hoje**. Verificado no npm em 2026-08-14:

| Pacote | Requisito de React |
|---|---|
| `@json-render/react@0.19.0` | `peerDependencies: react ^19.2.3` |
| `@medusajs/ui@4.2.1` | `peerDependencies: react ^18.3.1`, `react-dom ^18.3.1` |
| `@medusajs/dashboard@2.19.0` | `dependencies: react ^18.3.1` |

O Medusa Admin está travado em React 18.3; o renderer React do json-render exige React 19.2.3. Não é um conflito de *lockfile* contornável com `resolutions` sem risco — é uma diferença de major do React entre o host e a biblioteca.

Duas verificações que **ainda não fiz** e que mudariam o desenho, listadas como ação:

* Se `@json-render/react` não usar APIs exclusivas do React 19, um `override` pode ser viável — mas isso é hipótese, não plano.
* `@json-render/core` não tem peer de React algum (`dependencies: { zod: ^4.3.6 }`, `peerDependencies: { zod: ^4.0.0 }`), o que é justamente o que torna a Opção D viável.

Em contrapartida, o **Zod é compatível**: `@medusajs/admin-sdk@2.19.0` traz `zod: 4.2.0` e o core do json-render aceita `^4.0.0`. Não há conflito ali.

---

## Opções Consideradas

### Opção A: `json-render` completo no Medusa Admin

| Dimensão | Avaliação |
|---|---|
| Complexidade | Alta |
| Custo | Alto (fork ou espera indefinida pelo Medusa) |
| Escalabilidade | Boa, se destravasse |
| Familiaridade do time | Média (React/shadcn é terreno conhecido) |

**Prós:** entrega generative UI exatamente onde o agente já opera; reaproveita os 36 componentes shadcn prontos.
**Contras:** **bloqueado** pelo conflito React 19 vs 18.3. Destravar depende do roadmap do Medusa, fora do controle deste repositório.

### Opção B: `json-render` completo, mas só no `apps/console`

| Dimensão | Avaliação |
|---|---|
| Complexidade | Baixa |
| Custo | Baixo |
| Escalabilidade | Média (não cobre o Admin) |
| Familiaridade do time | Média |

**Prós:** greenfield, sem restrição de host; caminho mais rápido para valor demonstrável.
**Contras:** deixa o Admin — onde os agentes internos realmente rodam hoje — sem generative UI. Cria duas linguagens de UI de agente no mesmo produto.

### Opção C: Não adotar; schema de UI próprio

| Dimensão | Avaliação |
|---|---|
| Complexidade | Média na entrada, alta no tempo |
| Custo | Alto (manutenção contínua) |
| Escalabilidade | Depende inteiramente do time |
| Familiaridade do time | Alta |

**Prós:** zero dependência externa; controle total; sem restrição de React.
**Contras:** reimplementa validação de spec, streaming parcial, prompts de catálogo e devtools — tudo o que o core já resolve. É o caminho que parece barato no primeiro sprint e caro no quarto.

### Opção D (recomendada): `core` como contrato + `react` só no console

| Dimensão | Avaliação |
|---|---|
| Complexidade | Média |
| Custo | Baixo |
| Escalabilidade | Alta |
| Familiaridade do time | Média |

**Prós:** o catálogo de componentes e ações vira um **artefato versionado do repositório**, não um detalhe de implementação de um app. Alinha-se ao que o repo já faz com `schemas/` e `registries/`. O core não impõe React, então o mesmo catálogo serve console (React 19), Admin (React 18, quando houver renderer) e qualquer outro alvo — a existência de renderers oficiais para Vue, Svelte, Solid, Ink e PDF é evidência de que a fronteira spec↔renderer é real, não aspiracional.
**Contras:** exige escrever e manter o `GenerativeUIAdapter`; o Admin continua sem generative UI no curto prazo; um renderer React 18 próprio, se for esse o caminho, é trabalho não trivial.

---

## Análise de Trade-offs

**Maturidade vs. tração.** O json-render tem 15.911 estrelas e 864 forks — tração real. Mas foi criado em 2026-01-14, está em **v0.19.0** (pré-1.0), acumulou 99 issues abertas e saltou de `v0.4.1` a `v0.19.0` em sete meses, com commit mais recente em 2026-08-13. Isso é um projeto saudável e *muito* móvel. Adotar pré-1.0 numa camada de contrato é aceitável **desde que** a superfície de contato seja estreita e explícita — que é precisamente o argumento para o `GenerativeUIAdapter`. A licença Apache-2.0 não impõe restrição.

**Acoplamento ao AI SDK.** Não existe pacote `@json-render/ai-sdk`; a integração é por convenção. O exemplo canônico `examples/chat` depende de `ai@^6.0.33`, `@ai-sdk/react@^3.0.84`, `react@19.2.4` e `next@16.1.6`. Vale registrar que o `ai` está hoje em **7.0.66** — o exemplo do json-render está um major atrás, e a skill `creating-internal-agents` deste repo não fixa versão alguma do AI SDK. Nenhuma dessas três superfícies está alinhada. Isso não bloqueia a decisão, mas significa que qualquer código copiado do exemplo precisa ser reverificado contra a versão instalada, não contra o README.

**Sinergia com os gates de HITL.** O json-render trata **ações** como parte do catálogo, não só componentes. Isso mapeia diretamente nos gates do gateway: uma ação proposta pelo agente é um objeto validado contra schema *antes* de ser oferecida ao usuário, o que dá ao `plan_approval_required` e ao `write_operation_approval_required` um payload tipado para exibir e aprovar. É o argumento arquitetural mais forte a favor da adoção, e independe de qual renderer for usado.

**O trade-off central** é entre cobrir o Admin agora (impossível) e estabelecer o contrato certo agora (possível). A Opção D escolhe o contrato, aceitando que o Admin fica para depois. A alternativa honesta seria a Opção C, e ela perde não por ser inviável, mas por gastar o orçamento de engenharia reimplementando o que o core entrega de graça.

---

## Consequências

**O que fica mais fácil**
* O catálogo de componentes/ações do agente vira artefato revisável em PR, como `registries/` e `schemas/` já são.
* Os gates de HITL passam a receber payload tipado em vez de texto livre.
* Novos alvos de renderização (PDF de auditoria, e-mail de aprovação) ficam ao alcance sem redesenhar o contrato.

**O que fica mais difícil**
* Passa a existir uma dependência pré-1.0 no caminho crítico da UX. Cada minor do json-render precisa de revisão.
* Duas experiências de agente coexistem — Admin em texto, Console em generative UI — até o Admin destravar. Isso precisa ser comunicado, não escondido.
* O `GenerativeUIAdapter` é código novo que ninguém pediu, e que só se paga se a hipótese de churn se confirmar.

**O que precisaremos revisitar**
* Quando o Medusa migrar para React 19, reavaliar a Opção A — o custo dela cai a quase zero nesse cenário.
* Se o json-render chegar a 1.0 com API estável, o `GenerativeUIAdapter` pode virar cerimônia desnecessária e deve ser reconsiderado.
* O pacote `@json-render/mcp` não foi avaliado aqui e pode ter interseção direta com o Tools Plan.

---

## Action Items

1. [ ] Verificar se `@json-render/react@0.19.0` usa APIs exclusivas do React 19; se não usar, testar `override` para React 18.3 num spike descartável e registrar o resultado neste ADR.
2. [ ] Avaliar `@json-render/mcp` contra o Tools Plan e os [contratos de MCP server](mcp-server-contracts.md) — pode ser um ADR próprio.
3. [ ] Definir o catálogo v0 (componentes e ações) para o agente de operações de loja, derivado dos casos reais da skill `creating-internal-agents`.
4. [ ] Especificar o contrato `GenerativeUIAdapter` em `schemas/`, espelhando a estrutura de `schemas/framework-adapter.schema.json`.
5. [ ] Registrar `json-render` em `registries/agentic-frameworks.registry.json` (ou registry novo de UI) com `status: "proposed"`, seguindo a convenção existente.
6. [ ] Fixar as versões de `ai` e `@ai-sdk/*` na skill `creating-internal-agents`, que hoje não pina nenhuma — pré-requisito para qualquer integração reproduzível.

---

## Fatos verificados

Levantados em 2026-08-14; revalidar antes de decidir, dado o ritmo de releases do projeto.

| Fato | Valor | Fonte |
|---|---|---|
| `json-render` estrelas / forks | 15.911 / 864 | GitHub API |
| Versão / licença | v0.19.0 / Apache-2.0 | GitHub API, npm |
| Criado / último push | 2026-01-14 / 2026-08-13 | GitHub API |
| Issues abertas | 99 | GitHub API |
| `@json-render/core` deps | `zod ^4.3.6` (peer `^4.0.0`), sem React | npm |
| `@json-render/react` peer | `react ^19.2.3` | npm |
| `@medusajs/ui@4.2.1` peer | `react ^18.3.1` | npm |
| `@medusajs/dashboard@2.19.0` | `react ^18.3.1`, `zod 4.2.0` | npm |
| `ai` (versão atual) | 7.0.66 | npm |
| `examples/chat` do json-render | `ai ^6.0.33`, `react 19.2.4`, `next 16.1.6` | GitHub API |
