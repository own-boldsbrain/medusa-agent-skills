# Plugin design-log

Ensina agentes de IA a usar a **metodologia Design-Log do YSH Store** — um sistema estruturado de registro de decisões que fornece memória externa persistente entre sessões de IA.

## Por que este plugin existe

Agentes de IA perdem contexto entre sessões. O sistema de design-log resolve isso armazenando decisões arquiteturais e estratégicas como arquivos Markdown estruturados na pasta `design-log/` do repositório YSH Store. Todo agente **deve** consultar esses logs antes de qualquer ação — esta é uma regra inegociável definida na Seção 2.1 do `AGENTS.md`.

Este plugin ensina agentes exatamente como:

1. **Consultar** entradas de design-log existentes antes de codificar
2. **Criar** novas entradas quando uma decisão precisa ser registrada
3. **Atualizar** o status da entrada conforme o trabalho avança (`draft` → `done`)
4. **Alinhar** toda implementação com decisões previamente aprovadas

## Skills

| Skill | Descrição |
|-------|-----------|
| `design-log-workflow` | Protocolo obrigatório de consulta pré-ação — escanear logs, identificar entradas relevantes, verificar status, alinhar implementação |
| `design-log-create` | Guia passo a passo para redigir um novo registro design-log, incluindo campos obrigatórios, convenção de nomenclatura e ciclo de vida |

## Princípio central

> **Contexto > Prompt** — Nunca substitua o contexto acumulado do projeto por um prompt inteligente. O design-log é a memória persistente do projeto. Agentes que o ignoram criam contradições.

## Referência rápida

- Entradas de design-log ficam em: `design-log/DL-NNN-slug.md`
- Nomenclatura: `DL-NNN` onde NNN é um número com zeros à esquerda (ex.: `DL-001`, `DL-042`)
- Ciclo de vida: `draft` → `review` → `approved` → `executing` → `done` | `rejected` | `superseded`
- Apenas entradas **approved** e **executing** têm autoridade vinculante sobre o comportamento do agente

## Instalação

Adicione este plugin ao seu `.claude-plugin/marketplace.json`:

```json
{
  "name": "design-log",
  "source": "./plugins/design-log"
}
```
