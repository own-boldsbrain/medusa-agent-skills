---
name: using-llamacloud
description: Integrate and operate LlamaCloud, LlamaParse, LiteParse, Index, and MCP in Medusa applications. Use for document ingestion, OCR, extraction, classification, splitting, RAG, hosted LlamaCloud, Enterprise self-hosting or BYOC on Kubernetes, Helm deployment, security, performance, observability, rollout, rollback, and incident response.
---

# Using LlamaCloud with Medusa

Use this skill to design, implement, validate, deploy, or operate document-intelligence flows that connect Medusa to LlamaCloud products. Treat runtime evidence, data governance, and rollback as first-class requirements.

## Evidence and authority

Apply this evidence order before changing code or infrastructure:

1. Inspect the target repository, installed SDK versions, active Helm release, and current cluster state.
2. Consult the current official LlamaIndex documentation and the public `run-llama/helm-charts` repository.
3. Treat this skill as an operational baseline, not proof of the current external state.
4. Separate source inspection, local validation, cluster validation, and production validation in the final report.

Do not claim a deployment is ready because a chart renders, a package imports, or a narrow test passes. Production readiness requires the release gates in this skill and completion of the external gates.

## Route the request

Choose one primary path and record the decision:

| Need | Primary path | Boundary |
|---|---|---|
| Fast local PDF text, bounding boxes, or inexpensive complexity detection | LiteParse | Local and open source; not feature-equivalent to agentic LlamaParse |
| Managed parsing, extraction, classification, splitting, or Index | Hosted LlamaCloud SDK or authenticated MCP | Data leaves the application boundary according to the selected region and contract |
| Data-sovereign Enterprise platform in the customer's cloud | LlamaCloud Self-Hosted/BYOC | Requires an Enterprise license, Kubernetes, Helm, platform dependencies, and operations ownership |
| Agent access to hosted LlamaParse tools | Current authenticated LlamaParse MCP | Remote side effects require authentication, file-scope review, and user authorization |

Use a provider boundary in application code so hosted LlamaCloud, self-hosted LlamaCloud, LiteParse, and a disabled state can be selected without rewriting Medusa workflows.

Recommended configuration contract:

```text
DOCUMENT_PARSER_PROVIDER=llamacloud|liteparse|disabled
LLAMA_CLOUD_BASE_URL=<region-or-private-endpoint>
LLAMA_CLOUD_REGION=na|eu|private
DOCUMENT_PROCESSING_CALLBACK_URL=<authenticated-medusa-endpoint>
```

Store credentials only in the approved secret manager. Never commit credential values, print them, place them in Helm values, or return them in agent output.

## Medusa integration architecture

Keep the Medusa layering contract:

```text
Admin or Store API route
  -> Medusa workflow
    -> object-storage upload or existing object reference
    -> document-provider adapter
    -> asynchronous provider job
    -> callback or bounded polling
    -> normalized module record
    -> optional Index synchronization
  -> stable API response
```

### Required application contracts

- API routes validate authentication, authorization, MIME type, size, and request schema before invoking the workflow.
- Mutating routes invoke a Medusa workflow; they do not call LlamaCloud directly.
- Mutating API routes require an `Idempotency-Key`; the workflow binds the validated key to the business operation, file digest, provider, and parser configuration version.
- Persist provider job IDs, project IDs, parser configuration, file digest, status, attempt count, timestamps, and correlation ID.
- Keep raw documents in approved object storage. Store object references and normalized metadata in Medusa rather than database blobs.
- Verify callback authentication and deduplicate callbacks by provider event ID and terminal job state.
- Treat provider responses as untrusted input. Validate every normalized result before writing it to Medusa.
- Redact customer content, prompts, signed URLs, credentials, and extracted personal data from logs.
- Define retention and deletion propagation for source files, parsed outputs, embeddings, indexes, backups, and audit records.

### Workflow compensation

Each mutating step needs a compensating action where safe:

| Step | Compensation |
|---|---|
| Create provider job | Mark the local operation cancelled; request provider cancellation when supported |
| Create temporary upload | Delete only the known temporary object after verifying its exact key and retention policy |
| Write normalized record | Revert the new version or mark it superseded; do not erase audit history |
| Publish derived catalog data | Restore the previous published version |
| Synchronize Index | Disable the new index target or restore the prior provider configuration; do not delete source data during rollback |

## Federated search and connector ingestion

Treat Google Drive, Notion, GitHub, Linear, and Hugging Face as source systems, not as an undifferentiated document bucket. Their connector remains the authority for authentication, authorization, source revision, and deletion state; LlamaCloud supplies parsing and retrieval.

| Source | Ingest by default | Required boundary |
|---|---|---|
| Google Drive | Approved documents and exported office content | Preserve drive, file, revision, owner, and access-scope metadata; never broaden sharing |
| Notion | Approved pages, databases, and attached files | Preserve workspace, page, revision, and source ACL; resolve linked pages without crossing the approved root |
| GitHub | Documentation, issues, discussions, and selected source files | Prefer CodeGraph or repository regex for live code; Index prose or a deliberate code subset with repository/ref/path metadata |
| Linear | Approved issues, projects, comments, and attachments | Preserve workspace, team, issue, revision, and confidentiality metadata |
| Hugging Face | Dataset cards, model cards, papers, and explicitly selected dataset files | Do not ingest model weights, gated assets, or private datasets without separate authorization and storage review |

Use one stable source record per item: connector, tenant, external ID, canonical URL, revision, content type, content hash, source ACL or trust boundary, ingestion timestamp, and deletion state. Store the mapping between that record, the LlamaCloud file ID, and each Index ID.

Route search deliberately:

1. Use connector filters or repository regex first for exact IDs, paths, symbols, issue keys, and deterministic patterns.
2. Use `grepFileFromIndex` for regex or pattern matching inside already indexed files.
3. Use `retrieveFromIndex` for semantic or hybrid retrieval when wording can differ from the query.
4. Use `findFilesInIndex` and `readFileFromIndex` to inspect the underlying file before making a high-impact claim.
5. Fuse and rerank results only after preserving source, revision, ACL, match mode, and score provenance.

Incremental synchronization must be content-hash and revision driven. Re-ingest only changed items, reconcile missed events, quarantine repeated failures, propagate deletions with a reversible tombstone window, and verify that stale chunks are no longer retrievable. If the Index cannot enforce the source ACL, split indexes by trust boundary and authorize before retrieval. Never make private connector content public through an Index, log, report, repository, or generated artifact.

## SDK and MCP integration

Use the maintained SDK packages:

```bash
pip install "llama-cloud>=1.0"
npm install @llamaindex/llama-cloud
```

The maintained Python distribution is `llama-cloud` (PyPI also normalizes the underscore spelling); its import namespace is `llama_cloud`.

Before implementation, inspect the installed SDK API and confirm how its current version accepts a private or regional base URL. Do not copy the constructor contract from deprecated `llama-parse` examples.

For hosted MCP, use the authenticated endpoint matching the account region:

```text
NA: https://mcp.llamaindex.ai/mcp
EU: https://mcp.eu.llamaindex.ai/mcp
```

Scope the current unified MCP surface deliberately:

| Capability | Tools | Side effect |
|---|---|---|
| Upload | `getUploadUrl`, `uploadFileByUrl` | Creates temporary upload access or transfers a source file |
| Parse, classify, split | `parseFile`, `classifyFile`, `splitFile` | Starts document-processing work |
| Extract | `generateExtractionConfig`, `extractFile` | Creates extraction configuration or starts extraction work |
| Index discovery | `getUserProjects`, `listIndexes` | Read-only metadata discovery |
| Regex/file search | `findFilesInIndex`, `readFileFromIndex`, `grepFileFromIndex` | Read-only inspection; `grepFileFromIndex` performs pattern matching inside indexed files |
| Semantic retrieval | `retrieveFromIndex` | Read-only hybrid sparse and dense retrieval |

Use least-privilege tool exposure. Reading project metadata is read-only; uploading a file or starting parse, classify, split, extraction, or indexing work changes external state and requires explicit task authorization.

### Deprecated patterns

| Do not use as a new implementation | Replacement |
|---|---|
| `pip install llama-parse` | `pip install "llama-cloud>=1.0"` and import from `llama_cloud` |
| `run-llama/llama_parse` as the SDK source | Maintained `llama-parse-py` and `llama-parse-ts` repositories |
| `uvx llamacloud-mcp@latest` from the archived MCP demo | Current authenticated MCP or a maintained custom server |
| `https://helm.llamaindex.ai/enterprise` | `https://run-llama.github.io/helm-charts` |
| `llamaindex-enterprise/llamacloud-platform` | `llamaindex/llamacloud` |

## Self-hosted deployment gates

Stop before deployment unless all required facts are verified:

- Enterprise license entitlement and license delivery path.
- Kubernetes `>=1.28` and Helm `>=3.7`.
- Linux `amd64` nodes.
- At least the documented starting capacity of 12 vCPUs and 80 GiB memory for a default deployment.
- GPU nodes for production OCR, or an explicitly accepted CPU-only proof-of-concept limitation.
- Object storage and retention policy.
- Postgres, MongoDB, Redis, RabbitMQ, and Temporal connectivity.
- Default Kubernetes `StorageClass` when any stateful dependency runs in-cluster.
- Production identity provider and OIDC configuration.
- TLS ingress, DNS, egress controls, network policies, and certificate ownership.
- LLM provider contracts, regional requirements, quotas, and egress destinations.
- Backup, restore, disaster recovery, observability, and on-call ownership.

Use managed database and queue services in production when the platform and compliance requirements permit. In-cluster dependency subcharts are suitable for evaluation or controlled bootstrap, not an automatic production choice.

## Canonical Helm workflow

Use the public chart repository:

```bash
helm repo add llamaindex https://run-llama.github.io/helm-charts
helm repo update
helm show chart llamaindex/llamacloud
```

Keep environment-specific values outside the skill repository. Store only non-secret examples in source control, and inject credentials through Kubernetes Secrets or the approved external secret controller.

### Preflight

Collect evidence without exposing secret values:

```bash
kubectl version --client
kubectl get nodes -o wide
kubectl get storageclass
kubectl get namespace
helm version --short
helm repo list
```

Verify secret names and metadata only. Do not decode or print secrets during routine validation.

### Render and policy validation

Run before contacting production:

```bash
helm lint llamaindex/llamacloud --values values.yaml
helm template llamacloud llamaindex/llamacloud \
  --namespace llamacloud \
  --values values.yaml > rendered.yaml
```

Validate the rendered output for:

- No literal credentials or tokens.
- Approved image registries and immutable image versions where required.
- Requests and limits for every workload.
- GPU requests and selectors for OCR when enabled.
- Pod security, service accounts, and workload identity.
- TLS-only ingress and approved hostnames.
- Network policies and explicit egress.
- Pod disruption budgets, topology spread, probes, and autoscaling.
- Persistent-volume ownership and backup inclusion.

Do not commit `rendered.yaml` if it can contain environment-specific or sensitive material.

### Staged rollout

1. Render and validate locally.
2. Install into a disposable validation namespace with non-production data.
3. Verify database migrations, authentication, upload, parse, extraction, Index sync, retrieval, metrics, and audit logs.
4. Promote the same chart version and reviewed values structure to staging.
5. Run the end-to-end and load gates.
6. Roll out to production with a small workload slice or feature-flagged Medusa provider.
7. Observe the release for the agreed soak period before increasing traffic.

Use an atomic, bounded upgrade only after the preceding gates pass:

```bash
helm upgrade --install llamacloud llamaindex/llamacloud \
  --namespace llamacloud \
  --create-namespace \
  --values values.yaml \
  --atomic \
  --timeout 30m \
  --history-max 10
```

## Index strategy

Separate platform metadata storage from the destination that holds chunks and embeddings.

| Target | Use when | Operational requirement |
|---|---|---|
| PostgreSQL with `pgvector` | Minimal infrastructure or reuse of an approved Postgres service | Pre-provision `pgvector` when the application user cannot create extensions; monitor HNSW size and query latency |
| MongoDB Search | MongoDB is already an approved search platform | Meet current version and `mongot` requirements; isolate the index database from platform metadata |
| Azure AI Search | Azure-native vector and search operations are required | Private connectivity, capacity sizing, and index lifecycle ownership |
| Turbopuffer | High-scale vector workloads and tenant isolation fit the platform | External service governance, egress, quotas, and cost controls |
| Custom export | The destination is not natively supported | Own chunk schema, idempotency, retry, reconciliation, and retrieval tests |

Changing the embedding model can change vector dimensions and normally requires a new index plus a full resynchronization. Perform it as a versioned migration, never as an in-place assumption.

## Performance engineering

Tune from measured bottlenecks, in this order:

1. Provider quotas and 429 rates.
2. Queue depth and oldest-message age.
3. Job concurrency.
4. Parse-mode and model concurrency.
5. OCR and layout-stage concurrency.
6. CPU, memory, GPU utilization, and pod restarts.
7. Object-storage latency and throughput.
8. Index export lag and retrieval latency.

Use HPA for resource-driven scaling and KEDA when queue depth is the controlling signal. Align concurrency with provider rate limits; increasing worker counts without quota headroom increases retries and tail latency.

For OCR-heavy production traffic, prefer GPU workers with explicit GPU requests. Keep CPU mode for evaluation, low-volume fallback, or workloads whose measured latency remains acceptable.

Use bounded retries with exponential backoff and jitter. Do not retry permanent validation, authorization, unsupported-format, or quota-contract failures indefinitely.

## Observability and incident response

Deploy Prometheus, Grafana, and Alertmanager integration or an equivalent approved stack. Correlate Medusa workflow IDs, provider job IDs, file digests, and trace IDs.

Minimum signals:

- Submitted, running, completed, failed, cancelled, and timed-out jobs.
- Queue depth and oldest-message age.
- Parse latency percentiles by tier, mode, file type, and page bucket.
- OCR latency and GPU utilization.
- Provider 429, 5xx, timeout, and retry counts.
- Worker restarts, OOM kills, CPU throttling, and unschedulable pods.
- Storage errors, upload latency, and remaining capacity.
- Index export lag, retrieval latency, and empty-result rate.
- Callback authentication failures, duplicates, and processing latency.
- Cost and page-volume attribution by tenant and feature.

Alert on user-impacting symptoms and exhaustion trends. Avoid alerts that fire on every individual retry.

Incident sequence:

1. Freeze rollout and capture release, chart, configuration checksum, and timestamps.
2. Determine whether impact is in Medusa, ingress, auth, storage, queues, parsing, LLM providers, or Index.
3. Reduce traffic or switch the Medusa provider flag when safe.
4. Preserve logs and audit evidence without copying customer documents into the incident record.
5. Roll back only after checking database migration compatibility and data-processing state.
6. Reconcile in-flight jobs and callbacks after recovery.

## Test and release matrix

Require evidence for each applicable layer:

| Layer | Minimum evidence |
|---|---|
| Static | SDK types/imports, Helm lint, rendered-policy validation, secret scan |
| Unit | Provider adapter normalization, error mapping, idempotency-key construction, callback verification |
| Contract | SDK/MCP request and response fixtures, schema compatibility, region/base-URL routing |
| Integration | Real object storage, test project, database/queue connectivity, pgvector readiness |
| End to end | Medusa upload through workflow, provider completion, normalized record, optional Index retrieval |
| Security | AuthN/AuthZ, OIDC, tenant isolation, signed URL expiry, file restrictions, redacted logs |
| Resilience | Provider timeout, duplicate callback, queue outage, worker restart, partial Index failure |
| Performance | Representative files, page-count distribution, concurrency, saturation, p95/p99 latency |
| Operations | Dashboards, alerts, backup restore, rollback rehearsal, runbook ownership |

A mock-only integration does not satisfy the integration or end-to-end gates. A chart render does not satisfy runtime validation. A successful parse does not prove Index retrieval, tenant isolation, or rollback.

## Rollback and recovery

Before every production upgrade:

```bash
helm history llamacloud --namespace llamacloud
```

Record the previous working revision, image versions, configuration checksum, and database migration compatibility. The preferred application-level rollback is to switch Medusa to the previous provider configuration or `disabled` while preserving jobs and source data.

When Helm rollback is safe:

```bash
helm rollback llamacloud <revision> \
  --namespace llamacloud \
  --wait \
  --timeout 30m
```

Never delete persistent volumes, databases, buckets, indexes, or namespaces as an automatic rollback step. Destructive cleanup requires an exact target inventory, retention approval, and a separate user-authorized action.

## Completion contract

Finish with a release report that distinguishes:

- Implemented and source-inspected.
- Locally validated.
- Validated against a real test service or cluster.
- Validated in staging.
- Still blocked by external license, identity, infrastructure, provider, or production approval.

Always include rollback instructions, residual risks, and the exact evidence that supports each readiness claim.
