# Integração LlamaParse/MCP

## Objetivo

A integração fornece um cliente TypeScript resiliente para LlamaParse e um monitor em background para verificar disponibilidade sem expor credenciais. O contrato MCP fica versionado em `config/llamaparse-mcp.json`.

## Configuração

Defina `LLAMA_CLOUD_API_KEY` para chamadas HTTP do SDK. Defina `LLAMAPARSE_BASE_URL` para usar outro endpoint compatível ou uma implantação própria. Para o MCP, use `LLAMAPARSE_MCP_URL` e `LLAMAPARSE_MCP_REGION`; o OAuth deve ser concluído pelo cliente MCP autorizado.

Não commitar chaves, tokens, cookies ou arquivos `values.yaml` com secrets. A região do MCP deve corresponder à região da conta.

## Execução pontual

```bash
node scripts/llamaparse-monitor.mjs --once
```

O processo emite JSON Lines com timestamp, status, latência, URL e erro sanitizado. Para monitoramento contínuo:

```bash
LLAMAPARSE_MONITOR_OUTPUT=reports/llamaparse-health.jsonl node scripts/llamaparse-monitor.mjs --interval 30000
```

O processo deve ser supervisionado por um mecanismo persistente apropriado ao ambiente. O sandbox padrão não é uma garantia de disponibilidade 24/7.

## Cobertura end-to-end

Os testes de contrato exercitam autenticação Bearer, parsing JSON, retry de 429 e propagação de erro não recuperável. Em ambiente autorizado, adicionar um smoke test contra o endpoint real, um teste de upload, um job de parsing e uma asserção de leitura do resultado. O smoke test deve ser opt-in e nunca usar credenciais em fixtures.

## Self-hosted/BYOC

O self-hosted LlamaCloud é descrito oficialmente como Helm sobre Kubernetes, com dependências de banco, storage, autenticação e provedor de LLM. Como a documentação detalhada de instalação exige acesso protegido, este repositório mantém somente o contrato e os checks de pré-voo; não fixa comandos, secrets ou requisitos de hardware não confirmados.

## Operação e alertas

Monitorar disponibilidade, latência, status HTTP, timeouts, 429/5xx, falhas de autenticação e divergência entre a região configurada e o endpoint. Recomenda-se alerta após três falhas consecutivas e uma janela de supressão para evitar tempestade de notificações.
