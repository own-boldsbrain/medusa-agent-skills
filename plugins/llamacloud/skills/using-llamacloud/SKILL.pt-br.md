---
name: using-llamacloud
description: Integra e opera LlamaCloud, LlamaParse, LiteParse, Index e MCP em aplicações Medusa. Use para ingestão documental, OCR, extração, classificação, divisão, RAG, LlamaCloud hospedado, self-hosting Enterprise ou BYOC em Kubernetes, deployment Helm, segurança, performance, observabilidade, rollout, rollback e resposta a incidentes.
---

# Usando LlamaCloud com Medusa

Use esta skill para projetar, implementar, validar, implantar ou operar fluxos de inteligência documental que conectam Medusa aos produtos LlamaCloud. Trate evidência de runtime, governança de dados e rollback como requisitos de primeira classe.

## Evidência e autoridade

Aplique esta ordem de evidência antes de alterar código ou infraestrutura:

1. Inspecione o repositório alvo, as versões dos SDKs instalados, o release Helm ativo e o estado atual do cluster.
2. Consulte a documentação oficial atual do LlamaIndex e o repositório público `run-llama/helm-charts`.
3. Trate esta skill como baseline operacional, não como prova do estado externo atual.
4. Separe inspeção de fonte, validação local, validação de cluster e validação de produção no relatório final.

Não declare um deployment pronto porque o chart renderiza, um pacote importa ou um teste estreito passa. Prontidão para produção exige os gates de release desta skill e a conclusão dos gates externos.

## Roteie a solicitação

Escolha um caminho primário e registre a decisão:

| Necessidade | Caminho primário | Limite |
|---|---|---|
| Texto rápido de PDF, bounding boxes ou detecção econômica de complexidade | LiteParse | Local e open source; não equivale funcionalmente ao LlamaParse agentic |
| Parsing gerenciado, extração, classificação, divisão ou Index | SDK LlamaCloud hospedado ou MCP autenticado | Os dados saem da fronteira da aplicação conforme a região e o contrato selecionados |
| Plataforma Enterprise soberana na nuvem do cliente | LlamaCloud Self-Hosted/BYOC | Exige licença Enterprise, Kubernetes, Helm, dependências de plataforma e responsabilidade operacional |
| Acesso de agentes às ferramentas hospedadas do LlamaParse | MCP LlamaParse autenticado atual | Efeitos externos exigem autenticação, revisão do escopo de arquivos e autorização do usuário |

Use uma fronteira de provider no código da aplicação para selecionar LlamaCloud hospedado, LlamaCloud self-hosted, LiteParse ou estado desabilitado sem reescrever os workflows Medusa.

Contrato de configuração recomendado:

```text
DOCUMENT_PARSER_PROVIDER=llamacloud|liteparse|disabled
LLAMA_CLOUD_BASE_URL=<endpoint-regional-ou-privado>
LLAMA_CLOUD_REGION=na|eu|private
DOCUMENT_PROCESSING_CALLBACK_URL=<endpoint-medusa-autenticado>
```

Armazene credenciais somente no gerenciador de segredos aprovado. Nunca faça commit de valores, imprima-os, coloque-os em valores Helm ou retorne-os na saída do agente.

## Arquitetura de integração Medusa

Preserve o contrato de camadas Medusa:

```text
Rota Admin ou Store API
  -> workflow Medusa
    -> upload para object storage ou referência de objeto existente
    -> adapter do provider documental
    -> job assíncrono do provider
    -> callback ou polling limitado
    -> registro normalizado do módulo
    -> sincronização opcional de Index
  -> resposta estável da API
```

### Contratos obrigatórios da aplicação

- Rotas API validam autenticação, autorização, MIME type, tamanho e schema antes de invocar o workflow.
- Rotas mutáveis invocam um workflow Medusa; elas não chamam LlamaCloud diretamente.
- Rotas de API mutantes exigem `Idempotency-Key`; o workflow vincula a chave validada à operação de negócio, ao digest do arquivo, ao provider e à versão da configuração do parser.
- Persista IDs de job, IDs de projeto, configuração do parser, digest do arquivo, status, tentativas, timestamps e correlation ID.
- Mantenha documentos brutos no object storage aprovado. Armazene referências e metadados normalizados no Medusa, não blobs no banco.
- Verifique autenticação do callback e elimine duplicidades pelo ID do evento e pelo estado terminal do job.
- Trate respostas do provider como entrada não confiável. Valide cada resultado normalizado antes de gravá-lo no Medusa.
- Remova conteúdo do cliente, prompts, URLs assinadas, credenciais e dados pessoais extraídos dos logs.
- Defina retenção e propagação de exclusão para arquivos fonte, resultados, embeddings, índices, backups e registros de auditoria.

### Compensação do workflow

Cada etapa mutável precisa de compensação quando for seguro:

| Etapa | Compensação |
|---|---|
| Criar job no provider | Marcar a operação local como cancelada; solicitar cancelamento ao provider quando suportado |
| Criar upload temporário | Excluir somente o objeto temporário conhecido após verificar chave exata e política de retenção |
| Gravar registro normalizado | Reverter a nova versão ou marcá-la como substituída; não apagar histórico de auditoria |
| Publicar dados derivados de catálogo | Restaurar a versão publicada anterior |
| Sincronizar Index | Desabilitar o novo destino ou restaurar a configuração anterior; não excluir dados fonte durante rollback |

## Busca federada e ingestão por conectores

Trate Google Drive, Notion, GitHub, Linear e Hugging Face como sistemas de origem, não como um bucket documental indiferenciado. O conector continua sendo a autoridade de autenticação, autorização, revisão e estado de exclusão; LlamaCloud fornece parsing e retrieval.

| Origem | Ingerir por padrão | Limite obrigatório |
|---|---|---|
| Google Drive | Documentos aprovados e conteúdo office exportado | Preservar metadados de drive, arquivo, revisão, owner e escopo de acesso; nunca ampliar o compartilhamento |
| Notion | Páginas, databases e anexos aprovados | Preservar workspace, página, revisão e ACL de origem; resolver páginas vinculadas sem sair da raiz aprovada |
| GitHub | Documentação, issues, discussions e arquivos-fonte selecionados | Preferir CodeGraph ou regex do repositório para código vivo; indexar prosa ou subconjunto deliberado de código com metadados de repositório/ref/path |
| Linear | Issues, projetos, comentários e anexos aprovados | Preservar workspace, time, issue, revisão e metadados de confidencialidade |
| Hugging Face | Dataset cards, model cards, papers e arquivos de dataset explicitamente selecionados | Não ingerir pesos de modelos, assets gated ou datasets privados sem autorização separada e revisão de storage |

Use um registro de origem estável por item: conector, tenant, ID externo, URL canônica, revisão, content type, hash de conteúdo, ACL ou trust boundary de origem, timestamp de ingestão e estado de exclusão. Armazene o mapeamento entre esse registro, o file ID do LlamaCloud e cada Index ID.

Roteie a busca deliberadamente:

1. Use filtros do conector ou regex do repositório primeiro para IDs, paths, símbolos, chaves de issue e padrões determinísticos exatos.
2. Use `grepFileFromIndex` para regex ou pattern matching dentro de arquivos já indexados.
3. Use `retrieveFromIndex` para retrieval semântico ou híbrido quando a redação puder divergir da consulta.
4. Use `findFilesInIndex` e `readFileFromIndex` para inspecionar o arquivo subjacente antes de uma afirmação de alto impacto.
5. Faça fusão e reranking somente depois de preservar origem, revisão, ACL, modo de match e proveniência do score.

A sincronização incremental deve ser orientada por hash de conteúdo e revisão. Reprocesse somente itens alterados, reconcilie eventos perdidos, coloque falhas repetidas em quarentena, propague exclusões com janela reversível de tombstone e verifique que chunks obsoletos deixaram de ser recuperáveis. Se o Index não aplicar a ACL da origem, separe os índices por trust boundary e autorize antes do retrieval. Nunca torne conteúdo privado dos conectores público por meio de Index, log, relatório, repositório ou artefato gerado.

## Integração por SDK e MCP

Use os pacotes de SDK mantidos:

```bash
pip install "llama-cloud>=1.0"
npm install @llamaindex/llama-cloud
```

A distribuição Python mantida é `llama-cloud` (o PyPI também normaliza a grafia com underscore); o namespace de import é `llama_cloud`.

Antes da implementação, inspecione a API do SDK instalado e confirme como a versão atual recebe uma base URL privada ou regional. Não copie o contrato do construtor de exemplos depreciados de `llama-parse`.

Para MCP hospedado, use o endpoint autenticado correspondente à região da conta:

```text
NA: https://mcp.llamaindex.ai/mcp
EU: https://mcp.eu.llamaindex.ai/mcp
```

Restrinja deliberadamente a superfície atual do MCP unificado:

| Capacidade | Ferramentas | Efeito colateral |
|---|---|---|
| Upload | `getUploadUrl`, `uploadFileByUrl` | Cria acesso temporário de upload ou transfere um arquivo de origem |
| Parse, classificação e divisão | `parseFile`, `classifyFile`, `splitFile` | Inicia processamento documental |
| Extração | `generateExtractionConfig`, `extractFile` | Cria configuração de extração ou inicia o trabalho de extração |
| Descoberta de Index | `getUserProjects`, `listIndexes` | Descoberta read-only de metadados |
| Busca regex/em arquivo | `findFilesInIndex`, `readFileFromIndex`, `grepFileFromIndex` | Inspeção read-only; `grepFileFromIndex` faz pattern matching dentro de arquivos indexados |
| Retrieval semântico | `retrieveFromIndex` | Retrieval híbrido sparse e dense, read-only |

Exponha ferramentas com privilégio mínimo. Ler metadados de projetos é read-only; enviar arquivo ou iniciar parsing, classificação, divisão, extração ou indexação altera estado externo e exige autorização explícita da tarefa.

### Padrões depreciados

| Não use em implementação nova | Substituição |
|---|---|
| `pip install llama-parse` | `pip install "llama-cloud>=1.0"` e import a partir de `llama_cloud` |
| `run-llama/llama_parse` como origem do SDK | Repositórios mantidos `llama-parse-py` e `llama-parse-ts` |
| `uvx llamacloud-mcp@latest` do demo MCP arquivado | MCP autenticado atual ou servidor customizado mantido |
| `https://helm.llamaindex.ai/enterprise` | `https://run-llama.github.io/helm-charts` |
| `llamaindex-enterprise/llamacloud-platform` | `llamaindex/llamacloud` |

## Gates de deployment self-hosted

Pare antes do deployment se algum fato obrigatório não estiver verificado:

- Direito à licença Enterprise e caminho de entrega da licença.
- Kubernetes `>=1.28` e Helm `>=3.7`.
- Nós Linux `amd64`.
- Pelo menos 12 vCPUs e 80 GiB de memória como capacidade inicial documentada para um deployment padrão.
- Nós GPU para OCR em produção, ou limitação CPU-only explicitamente aceita para prova de conceito.
- Object storage e política de retenção.
- Conectividade com Postgres, MongoDB, Redis, RabbitMQ e Temporal.
- `StorageClass` padrão quando dependências stateful rodam dentro do cluster.
- Provider de identidade de produção e configuração OIDC.
- Ingress TLS, DNS, controles de egress, network policies e responsabilidade por certificados.
- Contratos dos providers LLM, requisitos regionais, quotas e destinos de egress.
- Backup, restore, disaster recovery, observabilidade e responsabilidade de plantão.

Use bancos e filas gerenciados em produção quando os requisitos da plataforma e de compliance permitirem. Subcharts de dependências dentro do cluster servem para avaliação ou bootstrap controlado, não como escolha automática de produção.

## Workflow Helm canônico

Use o repositório público do chart:

```bash
helm repo add llamaindex https://run-llama.github.io/helm-charts
helm repo update
helm show chart llamaindex/llamacloud
```

Mantenha values específicos de ambiente fora do repositório de skills. Versione somente exemplos sem segredos e injete credenciais por Kubernetes Secrets ou pelo controlador externo de segredos aprovado.

### Preflight

Colete evidência sem expor valores secretos:

```bash
kubectl version --client
kubectl get nodes -o wide
kubectl get storageclass
kubectl get namespace
helm version --short
helm repo list
```

Verifique apenas nomes e metadados de segredos. Não decodifique nem imprima segredos durante validação rotineira.

### Renderização e validação de políticas

Execute antes de acessar produção:

```bash
helm lint llamaindex/llamacloud --values values.yaml
helm template llamacloud llamaindex/llamacloud \
  --namespace llamacloud \
  --values values.yaml > rendered.yaml
```

Valide o resultado renderizado para garantir:

- Ausência de credenciais ou tokens literais.
- Registries de imagens aprovados e versões imutáveis quando exigido.
- Requests e limits em todos os workloads.
- Requests de GPU e seletores para OCR quando habilitado.
- Pod security, service accounts e workload identity.
- Ingress somente TLS e hostnames aprovados.
- Network policies e egress explícito.
- Pod disruption budgets, topology spread, probes e autoscaling.
- Responsabilidade por volumes persistentes e inclusão em backup.

Não faça commit de `rendered.yaml` se ele puder conter material sensível ou específico do ambiente.

### Rollout em estágios

1. Renderize e valide localmente.
2. Instale em namespace descartável com dados não produtivos.
3. Valide migrations, autenticação, upload, parsing, extração, sincronização de Index, retrieval, métricas e logs de auditoria.
4. Promova a mesma versão de chart e a estrutura revisada de values para staging.
5. Execute gates end to end e de carga.
6. Faça rollout em produção com pequena parcela de tráfego ou provider Medusa protegido por feature flag.
7. Observe o release durante o soak period acordado antes de ampliar tráfego.

Use upgrade atômico e limitado somente depois dos gates anteriores:

```bash
helm upgrade --install llamacloud llamaindex/llamacloud \
  --namespace llamacloud \
  --create-namespace \
  --values values.yaml \
  --atomic \
  --timeout 30m \
  --history-max 10
```

## Estratégia de Index

Separe o armazenamento de metadados da plataforma do destino de chunks e embeddings.

| Destino | Quando usar | Requisito operacional |
|---|---|---|
| PostgreSQL com `pgvector` | Infraestrutura mínima ou reutilização de Postgres aprovado | Pré-provisionar `pgvector` quando a criação de extensões não estiver disponível ao usuário da aplicação; monitorar tamanho do HNSW e latência |
| MongoDB Search | MongoDB já é plataforma de busca aprovada | Atender versão atual e requisitos de `mongot`; isolar banco de Index dos metadados da plataforma |
| Azure AI Search | Operação Azure-native de busca vetorial é necessária | Conectividade privada, sizing e responsabilidade pelo ciclo de vida do índice |
| Turbopuffer | Workloads vetoriais de alta escala e isolamento por tenant se encaixam | Governança do serviço externo, egress, quotas e custos |
| Export customizado | O destino não é suportado nativamente | Assumir schema de chunks, idempotência, retry, reconciliação e testes de retrieval |

Alterar o modelo de embedding pode mudar dimensões vetoriais e normalmente exige novo índice e ressincronização completa. Execute como migração versionada, nunca como suposição in-place.

## Engenharia de performance

Ajuste a partir de gargalos medidos, nesta ordem:

1. Quotas dos providers e taxa de 429.
2. Profundidade da fila e idade da mensagem mais antiga.
3. Concorrência de jobs.
4. Concorrência por modo de parsing e modelo.
5. Concorrência de OCR e etapas de layout.
6. Uso de CPU, memória, GPU e restarts de pods.
7. Latência e throughput do object storage.
8. Lag de export do Index e latência de retrieval.

Use HPA para escala guiada por recursos e KEDA quando a profundidade da fila for o sinal controlador. Alinhe concorrência aos rate limits; aumentar workers sem quota amplia retries e latência de cauda.

Para tráfego de produção intensivo em OCR, prefira workers GPU com requests explícitos. Mantenha modo CPU para avaliação, fallback de baixo volume ou workloads cuja latência medida permaneça aceitável.

Use retries limitados com backoff exponencial e jitter. Não repita indefinidamente falhas permanentes de validação, autorização, formato não suportado ou contrato de quota.

## Observabilidade e resposta a incidentes

Implante integração com Prometheus, Grafana e Alertmanager ou stack equivalente aprovada. Correlacione IDs de workflow Medusa, IDs de job do provider, digests e trace IDs.

Sinais mínimos:

- Jobs enviados, em execução, concluídos, falhos, cancelados e expirados.
- Profundidade da fila e idade da mensagem mais antiga.
- Percentis de latência por tier, modo, tipo de arquivo e faixa de páginas.
- Latência de OCR e uso de GPU.
- Contagem de 429, 5xx, timeout e retry dos providers.
- Restarts, OOM kills, throttling de CPU e pods não escalonáveis.
- Erros de storage, latência de upload e capacidade restante.
- Lag de export do Index, latência de retrieval e taxa de resultado vazio.
- Falhas de autenticação de callback, duplicidades e latência de processamento.
- Atribuição de custo e volume de páginas por tenant e funcionalidade.

Alerte sobre sintomas de impacto ao usuário e tendências de esgotamento. Evite alertas para cada retry individual.

Sequência de incidente:

1. Congele o rollout e capture release, chart, checksum de configuração e timestamps.
2. Determine se o impacto está no Medusa, ingress, auth, storage, filas, parsing, provider LLM ou Index.
3. Reduza tráfego ou altere a feature flag do provider Medusa quando seguro.
4. Preserve logs e auditoria sem copiar documentos do cliente para o registro do incidente.
5. Faça rollback somente após verificar compatibilidade de migrations e estado do processamento.
6. Reconcilie jobs e callbacks em andamento depois da recuperação.

## Matriz de testes e release

Exija evidência para cada camada aplicável:

| Camada | Evidência mínima |
|---|---|
| Estática | Types/imports do SDK, Helm lint, validação do render e secret scan |
| Unitária | Normalização do adapter, mapeamento de erros, chave de idempotência, verificação de callback |
| Contrato | Fixtures de request/response SDK ou MCP, compatibilidade de schemas e roteamento regional/base URL |
| Integração | Object storage real, projeto de teste, conectividade de banco/fila e prontidão do pgvector |
| End to end | Upload Medusa pelo workflow, conclusão do provider, registro normalizado e retrieval opcional de Index |
| Segurança | AuthN/AuthZ, OIDC, isolamento de tenant, expiração de URL assinada, restrições de arquivo e logs redigidos |
| Resiliência | Timeout do provider, callback duplicado, indisponibilidade de fila, restart de worker e falha parcial de Index |
| Performance | Arquivos representativos, distribuição de páginas, concorrência, saturação e latência p95/p99 |
| Operações | Dashboards, alertas, restore de backup, ensaio de rollback e responsabilidade pelo runbook |

Integração somente com mocks não satisfaz gates de integração ou end to end. Renderização do chart não satisfaz validação de runtime. Parsing bem-sucedido não prova retrieval de Index, isolamento de tenant ou rollback.

## Rollback e recuperação

Antes de cada upgrade de produção:

```bash
helm history llamacloud --namespace llamacloud
```

Registre revisão anterior funcional, versões de imagens, checksum da configuração e compatibilidade de migrations. O rollback preferido na aplicação é retornar o Medusa ao provider anterior ou `disabled`, preservando jobs e dados fonte.

Quando o rollback Helm for seguro:

```bash
helm rollback llamacloud <revision> \
  --namespace llamacloud \
  --wait \
  --timeout 30m
```

Nunca exclua volumes persistentes, bancos, buckets, índices ou namespaces como etapa automática de rollback. Limpeza destrutiva exige inventário exato, aprovação de retenção e ação separada autorizada pelo usuário.

## Contrato de conclusão

Finalize com relatório de release que diferencie:

- Implementado e inspecionado na fonte.
- Validado localmente.
- Validado contra serviço ou cluster real de teste.
- Validado em staging.
- Ainda bloqueado por licença, identidade, infraestrutura, provider ou aprovação de produção.

Inclua sempre instruções de rollback, riscos residuais e a evidência exata que sustenta cada afirmação de prontidão.
