# Translated Skills Loss Investigation

Generated at: 2026-07-08T00:40:46.402Z

## Executive Summary

A investigação focou em perdas documentais reais ("True Loss"), distinguindo-as de renomeações de casing e reestruturações controladas (Canary). Os números mostram que existe um volume considerável de traduções de skills que foram descartadas em PRs anteriores (potencialmente devido a contaminação ou expurgo geral) e não foram reaproveitadas.

## What Was Investigated

- **Caminhos Atuais Verificados**: 68
- **Deleções no Histórico**: 56
- **Backups Analisados**: 3

## Confirmed No-Loss Cases

- **Renomeações (apenas casing ou path adjustments)**: 26 arquivos.
  Esses arquivos não constituem perda de token, apenas higiene de branch ou refatoração estrutural (ex.: PR #18).

## Potential Loss Cases

- **Perda Real (True Loss)**: 30 arquivos não possuem equivalentes atuais. Isso inclui módulos do `learn-medusa` e `medusa-dev` que foram traduzidos e perdidos.
- **Tokens Perdidos (Estimados)**: 45.000 tokens.

## Backup / Recovery Candidates

- Foram encontrados 3 arquivos de backup local no repo.
- Destes, 3 (`account`, `cart`, `checkout`) contêm texto traduzido válido e podem ser recuperados e revisados.
- **Tokens Recuperáveis**: 7.041 tokens.

## Token & Cost Estimate

Assumindo o custo médio de APIs LLM (modelo $2.50/1M input e $10/1M output, a R$ 5,50/USD, gerando e lendo 50/50):

- **Custo Base Estimado do Desperdício**: R$ 1.55
- **Cenário Otimista (Low)**: R$ 1.08
- **Cenário Pessimista (High)**: R$ 2.32

## PR-Level Findings

- **PR #1 (Bloqueado)**: Historicamente contém centenas de arquivos que causaram o "Translation Forensic Repair". O descarte dessa branch gerou grande parte das perdas ("True Loss").

- **PR #18 (Mergeado)**: `translation_canary` reduziu o escopo para um canário controlado. As deleções neste PR foram, em sua maioria, substituições ou correções de casing (No Loss).
- **PR #21 (Mergeado)**: `repo_hygiene` - Assegurou que o lixo temporário não vaze.

## File-Level Findings

As perdas concentram-se fortemente nas trilhas `plugins/learn-medusa/skills/learning-medusa/*` e `plugins/medusa-dev/skills/building-with-medusa/*`.
Consulte `reports/loss-investigation/translated-skills-loss.json` para a tabela completa de findings por arquivo, commit de deleção e ação recomendada.

## Recommended Recovery Plan

1. **Quarentena**: Manter o status quo atual e isolar os 3 candidatos a recuperação da branch principal.
2. **Avaliação Fina**: Usar um agente para ler os arquivos de "True Loss" do histórico via `git show` e julgar se a tradução estava no padrão de acurácia atual.
3. **Reintegração Controlada**: Caso as traduções do `learn-medusa` estejam boas, reintegrá-las via pipeline "Double Gate" em um PR cirúrgico (BB-13).

## Safe Next PRs

- O `Agent Executor Registry` (BB-12) foi devidamente implantado.
- Recomendação: Mover-se para um BB-13 focado estritamente na reintegração dos `recover_candidates` ou expansão do canário, baseando-se nestas evidências financeiras e documentais.
