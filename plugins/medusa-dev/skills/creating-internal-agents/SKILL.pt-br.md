---
name: creating-agents-in-medusa
description: Use ao construir um agente de IA interno voltado para administradores em um projeto Medusa. Esses agentes são operados por comerciantes e operadores de loja — não por clientes. Abrange modelos de dados, serviço de módulo, runtime de agente (ferramentas, prompt do sistema, streamText), rotas de API de streaming (NDJSON) e extensões de chat na interface administrativa. Carregue para qualquer tipo de agente interno: assistente de operações da loja, auditoria de produtos, análise de coorte, ferramentas de atendimento ao cliente para equipes de suporte, etc. NÃO utilize para agentes voltados ao cliente (chatbots de vitrine, assistentes para compradores).
---

# Criando Agentes no Medusa

Esta habilidade abrange a pilha completa para adicionar um agente de IA **interno, voltado para administradores**a um projeto Medusa. Esses agentes são usados por comerciantes e operadores de loja por meio do painel de administração do Medusa — não por clientes em uma vitrine. Para agentes voltados para clientes (por exemplo, um chatbot de vitrine), uma arquitetura diferente é necessária: rotas de API públicas, sem MedusaExec e autenticação da vitrine.

### Restrições

-*Uso interno apenas**— esta arquitetura é para usuários administradores (comerciantes, operadores, equipe de suporte), não para clientes. As rotas estão em `src/api/admin/`, a interface está no painel de administração do Medusa, e o acesso é restrito por autenticação de administrador em todo o sistema.
-*Autenticação é inegociável**— MedusaExec executa TypeScript arbitrário com acesso total ao banco de dados. Todas as rotas de agente devem usar `AuthenticatedMedusaRequest` e viver em `src/api/admin/`. Um endpoint não autenticado é uma vulnerabilidade de execução de código remoto.
-*Use o MedusaExec, não ferramentas personalizadas**— para qualquer operação de dados, o agente escreve TypeScript e o executa via MedusaExec. Só construa uma ferramenta personalizada para capacidades que não possam ser expressas como TypeScript executável (ex.: chamar uma API externa com uma chave secreta).
-*Um módulo compartilhado, múltiplos agentes**— `AgentSession` e `AgentMessage` são infraestruturas compartilhadas. Use `agent_type` para distinguir sessões por agente. Nunca crie modelos separados por agente.
-*Pass `Container de Medusa` via `experimental_context`**— nunca importe serviços diretamente em arquivos de ferramenta; isso causa dependências circulares.
-*Formato do stream é NDJSON**— `Content-Type: application/x-ndjson`, um objeto JSON por linha seguido de `\n`.
-*Executar migrações**após adicionar ou alterar modelos (`npx medusa db:generate agent && npx medusa db:migrate`).
-*As descrições das ferramentas vivem na config**, não inline em `tool()` — o objeto config as substitui em tempo de execução.

## CRÍTICO: Carregar Arquivos de Referência Quando Preciso

- *⚠️ A referência rápida abaixo NÃO é suficiente para implementação.**Carregue o arquivo de referência relevante antes de escrever qualquer código.

| Tarefa | Carregue este arquivo |
|------|---------------|
| Definindo modelos de conversação
==============================

-*O que são os modelos de conversação?**Um modelo de conversação é um tipo de modelo de linguagem treinado para gerar respostas coerentes e relevantes a partir de uma entrada de texto. Eles são frequentemente usados em aplicativos de chat, assistentes virtuais e sistemas de recomendação de conteúdo.

-*Tipos de modelos de conversação**Existem vários tipos de modelos de conversação, incluindo:

-**Modelos de linguagem estatística**: esses modelos usam técnicas de estatística para analisar e gerar texto.

- **Modelos de linguagem neural**: esses modelos usam redes neurais para aprender padrões de linguagem e gerar texto.
- **Modelos de linguagem de sequência**: esses modelos usam sequências de texto para aprender e gerar texto.

- *Exemplos de modelos de conversação**-**Chatbots**: esses são modelos de conversação que são treinados para responder a perguntas e realizar tarefas específicas.
- **Assistentes virtuais**: esses são modelos de conversação que são treinados para realizar tarefas específicas e responder a perguntas.
- **Sistemas de recomendação de conteúdo**: esses são modelos de conversação que são treinados para recomendar conteúdo relevante a partir de uma entrada de texto.

- *Código de exemplo**```python
import numpy as np

# Defina um modelo de conversação

def modelo_conversacao(texto):
    # Analise o texto e gere uma resposta
    resposta = gerar_resposta(texto)
    return resposta

# Gere uma resposta a partir do texto

def gerar_resposta(texto):
    # Use um modelo de linguagem estatística ou neural para gerar uma resposta
    resposta = "Essa é uma resposta gerada pelo modelo de conversação."
    return resposta

# Chame o modelo de conversação

texto = "O que é um modelo de conversação?"
resposta = modelo_conversacao(texto)
print(resposta)

```

-*Referências**- [Modelos de linguagem estatística](https://www.example.com/modelos-de-linguagem-estatistica)
- [Modelos de linguagem neural](https://www.example.com/modelos-de-linguagem-neural)
- [Modelos de linguagem de sequência](https://www.example.com/modelos-de-linguagem-de-sequencia) | ``reference/data-models.md`` |
| Configurando o serviço do módulo | `referência/serviço.md` |
| Configurando ferramentas, prompt, streamText | ``reference/agent-setup.md`` |
| Construindo o ponto de extremidade de chat POST | `referência/api-route.md` |
| Implementando streaming de NDJSON

### NDJSON Streaming

NDJSON (Newline-Delimited JSON) é um formato de dados que permite a serialização de dados em JSON, com cada item em uma linha separada por uma quebra de linha. O streaming de NDJSON é uma abordagem que permite processar esses dados de forma incremental, sem precisar carregar todos os dados em memória ao mesmo tempo.

#### Por que usar NDJSON streaming?***Eficiência**: O streaming de NDJSON permite processar grandes conjuntos de dados sem precisar carregar todos os dados em memória ao mesmo tempo, o que pode ser muito eficiente em termos de recursos de memória.
***Flexibilidade**: O NDJSON streaming permite processar dados de forma incremental, o que é útil em casos onde os dados estão sendo gerados em tempo real.
***Fácil implementação**: O NDJSON streaming é uma abordagem simples e fácil de implementar, pois não requer a manipulação de grandes conjuntos de dados em memória.

#### Como implementar NDJSON streaming?

Aqui está um exemplo de como implementar NDJSON streaming em Python:

```python
import json

class NDJSONStream:
    def __init__(self, file_path):
        self.file_path = file_path
        self.file = open(file_path, 'r')

    def __iter__(self):
        return self

    def __next__(self):
        line = self.file.readline()
        if line:
            return json.loads(line.strip())
        else:
            raise StopIteration

# Exemplo de uso
if __name__ == '__main__':
    stream = NDJSONStream('dados.ndjson')
    for item in stream:
        print(item)
```

#### Exemplos de uso

- **Processamento de grandes conjuntos de dados**: O NDJSON streaming é útil em casos onde os dados são muito grandes e precisam ser processados incrementalmente.
- **Processamento de dados em tempo real**: O NDJSON streaming é útil em casos onde os dados estão sendo gerados em tempo real e precisam ser processados rapidamente.
- **Filtragem e processamento de dados**: O NDJSON streaming permite filtrar e processar os dados de forma incremental, o que é útil em casos onde os dados precisam ser processados de forma específica. | referência/streaming.md |
| Construindo a interface de chat de administrador | `referência/admin-extensão.md` |
| Concedendo a capacidade de execução de código ao agente | `referência/medusa-exec.md` |

**Requisito mínimo:**Carregue pelo menos o arquivo de referência que corresponde à sua tarefa atual antes de escrever o código.

## Habilidades Relacionadas

Carregue essas ao lado dessa habilidade quando relevante:

-**`building-with-medusa`**— Padrões de módulos Medusa, fluxos de trabalho, convenções de modelo de dados. Carregue ao implementar a lógica do serviço do módulo ou do backend personalizado.
-**`building-admin-dashboard-customizations`**— Padrões de componentes de interface administrativa, TanStack Query, registro de rotas. Carregar ao construir ou estender a interface de chat administrativa.

## Visão Geral da Arquitetura

```

src/modules/agent/
  index.ts                ← Module() export + AGENT_MODULE constant
  service.ts              ← MedusaService + Anthropic client + stream(messages, container, config)
  models/
    session.ts            ← AgentSession (shared across all agents, filtered by agent_type)
    message.ts            ← AgentMessage
  agents/index.ts         ← streamText() orchestration
  tools/
    medusa-exec.ts        ← MedusaExec tool (primary tool for all data operations)
    todo-write.ts         ← TodoWrite tool
  config/
    <agent-type>.ts       ← per-agent system prompt + tool descriptions

src/api/admin/agent/<agent-type>/
  route.ts                ← POST (AuthenticatedMedusaRequest, session lifecycle, NDJSON stream)
  sessions/route.ts       ← GET session list (filtered by agent_type)
  sessions/[id]/route.ts  ← GET messages for a session

src/admin/routes/<agent-type>/
  page.tsx                ← React chat UI (admin extension)

src/lib/code-mode/
  executor.ts             ← sandboxed TypeScript executor used by MedusaExec

```

## Erros Comuns

Verifique se você NÃO está fazendo o seguinte:**Segurança:**- [ ] A rota do agente usa `MedusaRequest` em vez de `AuthenticatedMedusaRequest`

- [ ] Rota de agente colocada fora de `src/api/admin/`**Arquitetura:**- [ ] Criar modelos separados `AgentSession`/`AgentMessage` por agente em vez de usar `agent_type`
- [ ] Importar serviços diretamente nos arquivos da ferramenta em vez de resolver a partir de `experimental_context`
- [ ] Criando uma ferramenta personalizada para uma operação de dados em vez de usar MedusaExec**Transmissão:**- [ ] Falta `res.end()` após o loop do stream (a resposta nunca fecha)
- [ ] Ausência dos cabeçalhos `Transfer-Encoding: chunked` ou `Content-Type: application/x-ndjson`
- [ ] Não bufferar linhas incompletas no cliente (erros de parse de JSON em pacotes divididos)**Módulo:**- [ ] Esquecer de registrar o módulo em `medusa-config.ts`
- [ ] Esquecer de executar as migrações após alterar os modelos
- [ ] Hardcoding ferramenta de descrição em `tool()` em vez do objeto de configuração

## Arquivos de Referência Disponíveis

```

reference/data-models.md       - model.define(), agent_type discriminator, relationships, migrations
reference/service.md           - MedusaService extension, Anthropic init, stream(), module index, config registration
reference/agent-setup.md       - streamText(), MedusaExec tool wiring, system prompt, context passing
reference/api-route.md         - POST route, session lifecycle, message persistence, streaming headers
reference/streaming.md         - NDJSON emission, fullStream iteration, chunk types, client-side parsing
reference/admin-extension.md   - React chat UI, streaming fetch, message rendering, tool call display, session sidebar
reference/medusa-exec.md       - Executor setup, MedusaExec tool, query.graph() patterns, error codes

```

## Testando

Uma vez que o agente estiver implementado, teste-o de ponta a ponta diretamente no painel de administração:

1. Comece o servidor de desenvolvimento Medusa (`npx medusa develop`)
2. Abra o painel de administração e navegue até a página do agente na barra lateral (o rótulo definido em `defineRouteConfig`)
3. Digite um prompt simples de leitura somente — por exemplo,*"Quantos produtos há na loja?"* — e envie.
4. Verifique os fluxos de resposta e uma nova sessão aparece na barra lateral
5. Envie uma mensagem de acompanhamento na mesma sessão para confirmar que a história de conversa é preservada
6. Recarregue a página, selecione a sessão na barra lateral e confirme se o histórico de mensagens foi restaurado do banco de dados.

Se algo estiver quebrado, verifique:

- A aba de rede do navegador — a requisição POST deve retornar `Content-Type: application/x-ndjson` com linhas em partes (`chunked`).
- Registros do servidor — `[agent] tool_call` e `[agent] step_finish` linhas confirmam que o agente está rodando
- Banco de Dados — as tabelas `agent_session` e `agent_message` devem conter linhas com o `agent_type` correto
