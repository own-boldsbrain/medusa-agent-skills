# Medusa MCP Server Contracts Specification

Este documento define os padrões contratuais, protocolos de transporte e especificações de segurança que regem todos os servidores de **Model Context Protocol (MCP)** da camada operacional `medusa-agent-skills`.

---

## 1. Protocolo e Formato de Mensagens

Todos os servidores MCP implementados neste projeto devem se comunicar estritamente via protocolo **JSON-RPC 2.0** codificado em **UTF-8**:

* **Requests (Requisições):**
  * Devem incluir um campo `id` do tipo `string` ou `number` não nulo.
  * O `id` deve ser único dentro do ciclo de vida da sessão de execução.
* **Responses (Respostas):**
  * Devem conter o mesmo `id` enviado na correspondente requisição.
  * Devem incluir o campo `result` ou `error`, mas **nunca ambos** simultaneamente.
* **Notifications (Notificações):**
  * Não devem conter campo `id`.
  * Não recebem resposta ou confirmação do cliente/servidor.

---

## 2. Protocolos de Transporte Suportados

A camada operacional suporta dois perfis de transporte padronizados da especificação MCP:

### A. stdio (Transporte Local Padrão)

* **Utilização:** Execução local de agentes, integração com IDEs e inspeção direta de repositórios.
* **Mecanismo:** O cliente inicia o servidor MCP como um subprocesso e comunica-se lendo e escrevendo nos canais de entrada e saída padrão:
  * **stdin / stdout:** Canal exclusivo para transmissão de mensagens JSON-RPC válidas delimitadas por quebras de linha (`\n`). O stdout do processo do servidor **nunca** deve emitir dados arbitrários (como logs crus ou saídas do console) que não estejam no formato MCP JSON-RPC.
  * **stderr:** Canal de logs de diagnóstico permitidos. Qualquer depuração interna do servidor deve ser roteada via stderr.

### B. Streamable HTTP (Transporte Remoto e Multi-Cliente)

* **Utilização:** Servidores MCP corporativos hospedados ou rodando em containers de auditoria centralizados.
* **Mecanismo:** Substitui o padrão HTTP+SSE legado. Comunicação HTTP com suporte a chamadas síncronas (`POST`/`GET`/`DELETE`) utilizando headers específicos de protocolo:
  * **Headers:** `Accept: application/json` e `Accept: text/event-stream` são obrigatórios para inicialização de sessões.
  * **Session ID:** Transmitido sob o header `Mcp-Session-Id` para rastreamento de estado e concorrência.
  * **Protocol Version:** Identificado via header `MCP-Protocol-Version`.

---

## 3. Diretrizes de Segurança (Anti-Bypass Gate)

Servidores MCP possuem privilégios de leitura e execução de comandos. Para mitigar riscos e impedir vetores de ataque locais (ex: DNS Rebinding), aplicam-se as seguintes restrições de segurança:

1. **Validação de Origin:** Servidores que executam via HTTP devem validar estritamente o header `Origin` e recusar tráfego não autorizado.
2. **Localhost Binding:** Por padrão, servidores locais rodando em HTTP devem fazer binding estrito no endereço IP de loopback `127.0.0.1`. Binding em `0.0.0.0` é estritamente proibido sem autenticação robusta ativa.
3. **Secret Redaction:** Nenhuma resposta de ferramenta MCP pode conter em seus logs ou payloads de saída chaves privadas, segredos em texto plano, tokens ou hashes.
