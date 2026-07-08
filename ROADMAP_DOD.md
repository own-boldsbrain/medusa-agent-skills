# ROADMAP Definition of Done (DoD)

Este documento define os critérios rigorosos que um Building Block (BB) deve atingir para ser classificado como **APROVADO COM EVIDÊNCIAS** no arquivo `roadmap.md`.

## 1. Escopo e Limpeza de PR (A Regra "Anti-Polvo")

Nenhum BB será aceito se violar os limites de um PR isolado e cirúrgico.

- O PR deve alterar apenas os arquivos descritos na issue ou task correspondente.
- **Limite Global (Canários e Traduções):** O PR não deve exceder **20 arquivos totais**.
- **Limites Secundários (Subtetos):**
  - No máximo **5 arquivos alvo de tradução/documentação**.
  - No máximo **2 relatórios** de auditoria/validação.
  - No máximo **2 scripts** utilitários ou de governança.
  - Permitido tocar em arquivos de governança (apenas `roadmap.md` e `ROADMAP_DOD.md`).
- **Arquivos Banidos:** Nenhuma alteração é permitida (mesmo que acidental) em arquivos ou diretórios marcados como `forbidden`, incluindo:
  - `*.bak` (resquícios tóxicos de edições não curadas)
  - `translation_audit_report.*`
  - `scratch/**`
  - Pacotes e registros não relacionados à task (`packages/**`, `schemas/**`, `registries/**` etc., a menos que a missão do BB exija explicitamente).

### JULES_POLICY

`reports/jules/**` é área viva reservada para Jules como agente executor.

Permitido versionar:

- `reports/jules/*.md`
- `reports/jules/*.json`
- evidências explicitamente ligadas a um BB, PR ou auditoria aprovada

Ignorar ou bloquear:

- `reports/jules/tmp/**`
- `reports/jules/scratch/**`
- `reports/jules/private/**`
- `reports/jules/**/*.bak`
- `reports/jules/**/*.tmp`
- `reports/jules/**/*.log`, salvo quando explicitamente aprovado como evidência

## 2. Qualidade e Integração Contínua (CI)

A prova de que a fundação arquitetural não foi quebrada:

- **Testes Unitários:** Todos os testes (`npm run test`) devem reportar sucesso. Nenhum teste anterior pode ser removido sem justificativa explícita.
- **Schemas JSON:** O validador de schemas estruturais (`node scripts/validate-json-schemas.mjs`) deve rodar sem erros para garantir a saúde dos registries e contracts.
- **Registries:** O registry de skill accuracy deve rodar sem erros contra o schema correspondente através do validador dedicado (`node scripts/validate-skill-accuracy-registry.mjs`).

## 3. Validação Determinística de Tradução (Canary Rules)

Para BBs de tradução e documentação (série Canary e afins):

- O script `validate-translation-canary.mjs` deve ser executado no lote e todos os alvos devem retornar `✅ PASSED`.
- Isso garante a ausência de *Filler LLM*, jargões incorretos de e-commerce, links de âncoras quebrados ou divergência de estrutura.

## 4. Estado da Árvore Git

A sujeira local não pode vazar para a produção:

- Antes de commitar, a árvore de diretórios deve estar livre de artefatos temporários, relatórios não versionados sem permissão ou scripts scratch.

## 5. Governança

O histórico deve ser a única fonte da verdade:

- O arquivo `roadmap.md` deve ser atualizado com o status **VALIDADO EM PR ABERTO / AGUARDANDO MERGE** enquanto o PR não for fechado, e atualizado para **APROVADO COM EVIDÊNCIAS** após o merge com sucesso.
- O número do PR e, se possível, o Hash do Commit de Merge, devem ser registrados no `roadmap.md` para auditoria rápida.

## 6. Framework Accuracy (Double Gate)

Qualquer alteração em arquivos de instrução de habilidade (`SKILL.md` ou `SKILL.pt-br.md`) está sujeita ao mecanismo de Double Gate:

- **Paridade Bilíngue**: O arquivo `.pt-br.md` deve espelhar a estrutura e o conteúdo do `.md` (fonte EN) sem introduzir conhecimento alheio ao original.
- **Acurácia do Framework**: É OBRIGATÓRIO gerar (ou atualizar) um relatório correspondente em `reports/framework-accuracy/<nome-da-habilidade>.md` (e `.json`) documentando a auditoria da skill contra a documentação atual do framework.
- Os *findings* no relatório JSON devem ser classificados como `current`, `stale`, `missing`, `custom` ou `unverified`.
- O guardião CI (`scripts/ci-guard.mjs --framework-accuracy`) falhará se a skill for alterada sem o respectivo relatório de acurácia em anexo.

## 7. Translation Recovery Policy (BB-13+)

- Nenhum arquivo traduzido perdido pode ser recuperado diretamente na mesma PR da investigação de perda.
- Toda recuperação deve ocorrer em PR próprio, contendo:
  - Source EN atual.
  - Target PT-BR candidato.
  - Diff estrutural.
  - Validação de headings, code fences e links internos.
  - Classificação de risco.
