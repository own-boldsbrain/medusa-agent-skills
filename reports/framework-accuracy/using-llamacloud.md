# Framework Accuracy Report: using-llamacloud

Generated at: 2026-08-14T00:00:00Z  
Framework target: LlamaCloud Self-Hosted Helm chart 0.9.0 and maintained LlamaCloud SDKs  
Status: PASSED for source and documentation accuracy

## Evidence boundary

This report verifies the skill against current official documentation and repositories. It does not prove an Enterprise license, live Kubernetes deployment, identity-provider integration, LLM-provider contract, customer-data policy, or production release.

## Verified contracts

### Self-hosting baseline

- Enterprise license gate is explicit.
- Kubernetes 1.28+, Helm 3.7+, Linux amd64, documented starting capacity, and the production GPU recommendation are represented.
- Postgres, MongoDB, Redis, RabbitMQ, Temporal, object storage, identity, networking, backup, restore, and operations ownership are treated as gates.

### Distribution and SDKs

- Helm repository: `https://run-llama.github.io/helm-charts`.
- Chart: `llamaindex/llamacloud`.
- Python distribution: `llama-cloud>=1.0`; import namespace: `llama_cloud`.
- TypeScript package: `@llamaindex/llama-cloud`.
- Archived SDK and MCP paths are identified as historical rather than current defaults.

### Index and operations

- Platform metadata storage is separated from chunks and embeddings.
- Connector ingestion preserves source revision, ACL/trust boundary, deletion state, and provenance across Google Drive, Notion, GitHub, Linear, and Hugging Face.
- Exact connector or repository filters route before Index regex search and hybrid semantic retrieval.
- PostgreSQL with pgvector, MongoDB Search, Azure AI Search, Turbopuffer, and custom export are routed by operational fit.
- Performance guidance covers provider quotas, queue depth, concurrency, OCR/GPU, storage, and retrieval.
- Prometheus, Grafana, Alertmanager, correlation IDs, redaction, staged rollout, rollback, and reconciliation are included.

### Medusa integration

- Mutations pass through Medusa workflows.
- Provider calls are behind an adapter with idempotency, compensation, callback verification, and normalized result validation.
- Runtime, security, end-to-end, performance, resilience, rollout, and rollback evidence are reported separately.

## Sources

- [Self-Hosting overview](https://developers.llamaindex.ai/llamaparse/self_hosting/)
- [Self-Hosting installation](https://developers.llamaindex.ai/llamaparse/self_hosting/installation/)
- [Architecture](https://developers.llamaindex.ai/llamaparse/self_hosting/architecture/)
- [Index configuration](https://developers.llamaindex.ai/llamaparse/self_hosting/configuration/index-v2-configuration/)
- [Monitoring](https://developers.llamaindex.ai/llamaparse/self_hosting/monitoring/monitoring/)
- [Throughput](https://developers.llamaindex.ai/llamaparse/self_hosting/tuning/llamaparse-throughput/)
- [LlamaParse MCP](https://developers.llamaindex.ai/llamaparse/for-agents/mcp/)
- [Official Helm charts](https://github.com/run-llama/helm-charts)
- [Python SDK](https://github.com/run-llama/llama-parse-py)
- [TypeScript SDK](https://github.com/run-llama/llama-parse-ts)
- [Authenticated MCP implementation](https://github.com/run-llama/mcp-llamaindex-ai)
- [LiteParse](https://github.com/run-llama/liteparse)

## Conclusion

The English and PT-BR skill content is aligned with the inspected sources as of 2026-08-14. External deployment and production gates remain explicitly unverified until executed against the target environment.
