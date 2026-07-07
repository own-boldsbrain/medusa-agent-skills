# Plugin design-log

Ensina aos agentes de IA como usar a **metodologia Design-Log do YSH Store** — um sistema estruturado de registro de decisões que fornece memória externa persistente entre as sessões de IA.

## Por que esse plugin existe

Os agentes de IA perdem o contexto entre as sessões. O sistema design-log resolve isso armazenando decisões arquitetônicas e estratégicas como arquivos Markdown estruturados na pasta `design-log/` do repositório do YSH Store. Todo agente **deve** consultar esses registros antes de realizar qualquer ação — essa é uma regra inegociável definida na Seção 2.1 do arquivo `AGENTS.md`.

Este plugin ensina aos agentes exatamente como:

1. **Consultar** as entradas existentes no registro de design antes de programar
2. **Criar** novas entradas quando for necessário registrar uma decisão
3. **Atualizar** o status da entrada à medida que o trabalho avança (de `rascunho` → `concluído`)
4. **Alinhar** cada implementação com as decisões aprovadas anteriormente

## Competências

| Competência | Descrição |
|-------|-------------|
| `design-log-workflow` | Protocolo obrigatório de consulta prévia à ação — examinar registros, identificar entradas relevantes, verificar o status, alinhar a implementação |
| `design-log-create` | Guia passo a passo para redigir uma nova entrada no design-log, incluindo campos obrigatórios, convenção de nomenclatura e ciclo de vida |

## Princípio fundamental

> **Contexto > Prompt** — Nunca substitua o contexto acumulado do projeto por um prompt engenhoso. O design-log é a memória persistente do projeto. Agentes que o ignoram criam contradições.

## Referência rápida

- As entradas do design-log ficam em: `design-log/DL-NNN-slug.md`
- Nomeação: `DL-NNN`, onde NNN é um número preenchido com zeros à esquerda (por exemplo, `DL-001`, `DL-042`)
- Ciclo de vida do status: `rascunho` → `revisão` → `aprovado` → `em execução` → `concluído` | `rejeitado` | `substituído`
- Apenas as entradas **aprovadas** e **em execução** têm autoridade vinculativa sobre o comportamento do agente

## Instalação

Adicione este plug-in ao seu arquivo `.claude-plugin/marketplace.json`:

```json
{
  "name": "design-log",
  "source": "./plugins/design-log"
}
```
