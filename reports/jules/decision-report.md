# 📝 Relatório de Decisão Operacional — Jules & Antigravity

Este documento registra a decisão estratégica sobre a separação de responsabilidades entre as ferramentas de agendamento/auditoria e os processos de validação de qualidade de tradução no repositório `medusa-agent-skills`.

## 1. Contexto Geral

Com a consolidação do **Jules Session Ledger** e do **Jules Session Quota Controller**, estabelecemos um teto de controle para rastrear e registrar sessões do Jules remotamente. Em paralelo, a ferramenta do Antigravity introduz primitivas de agendamento via `/schedule`.

Entretanto, de forma a garantir a segurança e a integridade da plataforma, é fundamental que as ferramentas de infraestrutura não sejam confundidas com gates de validação linguística ou de conformidade estrutural.

## 2. Decisão Estratégica

> [!IMPORTANT]
> **A execução de sessões via Jules API/CLI e os agendamentos via `/schedule` do Antigravity serão tratados exclusivamente como utilitários de orquestração, agendamento e auditoria de tarefas. Eles NÃO servem como prova de que uma tradução está validada ou correta.**

### Racional

1. **Limitação de Escopo**: O Jules opera na nuvem executando tarefas delegadas (como geração em lote e correções iniciais), porém ele não possui visibilidade de conformidade fina (como verificação de âncoras de TOC quebradas no português, vazamento de fillers conversacionais de LLM ou violações de sintaxe de markdown).
2. **Independência de Qualidade**: A aprovação linguística e estrutural da localização (`.pt-br.md`) deve ser governada exclusivamente por validadores determinísticos locais (como o `ast_validator.py` e a suíte `pytest tests/translation`) combinados com a revisão humana final (manual sampling).
3. **Prevenção de Falsos Positivos**: O fato de uma sessão Jules ter o estado registrado como `COMPLETED` no ledger indica apenas que o agente remoto encerrou sua tarefa sem falha fatal na máquina virtual. Isso **não** assegura que os arquivos gerados passaram nos testes de qualidade.

## 3. Diretrizes Operacionais

- **Agendamento e Monitoria**: Utilize o `/schedule` do Antigravity e os relatórios do `jules_repo_cleanup.py` para monitorar quotas e evitar o estado de `CONCURRENT_LIMIT_REACHED`.
- **Validação de Código**: O gate final para sair do estado `draft` no GitHub exige obrigatoriamente que as filas de `Failed` e `Needs Review` P0/P1 no `translation_repair_queue.json` estejam totalmente zeradas, sob auditoria local do `ast_validator.py`.
- **Handoff Manual**: A troca de usuários autorizados para contornar limites de cota da plataforma é expressamente proibida. Qualquer alteração de credenciais deve ser registrada e auditada manualmente no ledger de sessões.
