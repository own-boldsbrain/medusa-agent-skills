# 🎯 Prompt Engineering Jules — Estratégia de Spikes

## Status: GERADO COMO POLÍTICA OPERACIONAL

Adicionar uma camada obrigatória de engenharia de prompt para sessões Jules. Cada sessão deve começar como Spike controlado antes de qualquer implementação.

Cada Spike deve conter:

- objetivo;
- hipótese;
- escopo;
- fora de escopo;
- URLs de referência;
- artefatos esperados;
- riscos;
- critérios de aceite;
- evidências obrigatórias;
- próxima ação recomendada.

## Tipos de Spike

- `research`
- `audit`
- `design`
- `repair_plan`
- `implementation_plan`
- `validation`

## Referências mínimas

- Jules API Reference: <https://jules.google/docs/api/reference/>
- Jules Sessions API: <https://jules.google/docs/api/reference/sessions>
- Jules Activities API: <https://jules.google/docs/api/reference/activities>
- Jules Authentication: <https://jules.google/docs/api/reference/authentication>
- Antigravity Getting Started: <https://antigravity.google/docs/getting-started>
- GitHub Pull Requests API: <https://docs.github.com/en/rest/pulls/pulls>

## Regras

- registrar `source_mode`;
- diferenciar fato, inferido, ausente e `needs_human_review`;
- alimentar `session-ledger`;
- alimentar `session-quota`;
- gerar `workflow-replay`;
- não promover pesquisa/plano para `VALIDADO`;
- não usar `test_fixture` como evidência live;
- não iniciar novas sessões quando quota ou concorrência estiverem bloqueadas;
- não omitir ausência de payload;
- não declarar aprovação sem JSON, diff check, testes e evidência.

## Artefatos esperados por Spike

- `reports/jules/spikes/<spike_id>/prompt.md`
- `reports/jules/spikes/<spike_id>/references.json`
- `reports/jules/spikes/<spike_id>/plan.json`
- `reports/jules/spikes/<spike_id>/plan.md`
- `reports/jules/spikes/<spike_id>/risk-register.json`
- `reports/jules/spikes/<spike_id>/evidence.json`
- `reports/jules/spikes/<spike_id>/next-actions.md`

## Estado máximo para pesquisa ou plano

`GERADO`

`VALIDADO` somente com:

- artefatos existentes;
- JSON válido;
- `git diff --check` limpo;
- testes executados;
- `session_id` registrado;
- `activities` capturadas;
- `outputs` preservados ou ausência registrada;
- `workflow replay` gerado.
