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
  - `reports/jules/**`
  - Pacotes e registros não relacionados à task (`packages/**`, `schemas/**`, `registries/**` etc., a menos que a missão do BB exija explicitamente).

## 2. Qualidade e Integração Contínua (CI)

A prova de que a fundação arquitetural não foi quebrada:
- **Testes Unitários:** Todos os testes (`npm run test`) devem reportar sucesso. Nenhum teste anterior pode ser removido sem justificativa explícita.
- **Schemas JSON:** O validador de schemas estruturais (`node scripts/validate-json-schemas.mjs`) deve rodar sem erros para garantir a saúde dos registries e contracts.

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
