# plugin design-log

Ensina agentes de IA a usar a **metodologia de design de loja YSH Store Design-Log** — um sistema de log de decisões estruturado que fornece memória externa persistente entre sessões de IA.

## Por que este plugin existe

Os agentes de IA perdem o contexto entre as sessões. O sistema de design-log resolve isso armazenando decisões arquitetônicas e estratégicas como arquivos Markdown estruturados na pasta `design-log/` do repositório YSH Store. Cada agente **deve** consultar esses logs antes de tomar qualquer ação — esta é uma regra não negociável definida na seção 2.1 do `AGENTS.md`.

Este plugin ensina os agentes exatamente como:

1. **Consulte** entradas de design-log existentes antes de codificar
2. **Criar** novas entradas quando uma decisão precisa ser registrada
3. **Atualização** o status da entrada conforme o trabalho avança (de `rascunho` → `feito`)
4. **Alinhar** cada implementação com decisões previamente aprovadas

## Habilidades

| Habilidade | Descrição |
|-------|-------------|
| `fluxo-de-trabalho-log-de-design` | Protocolo de consulta pré-ação obrigatória — escaneie logs, identifique entradas relevantes, verifique o status, alinhe a implementação |
| `design-log-create` | # Guia passo a passo para redigir uma nova entrada no design-log, incluindo campos obrigatórios, convenção de nomenclatura e ciclo de vida

## Campos obrigatórios

- **Título:**Um título claro e descritivo para a entrada.
-**Data:**A data em que a entrada foi criada ou modificada pela última vez.
-**Autor:**O nome do designer ou equipe responsável pela entrada.
-**Descrição:**Uma breve descrição do objetivo e conteúdo da entrada.
-**Status:**O estado atual da entrada (por exemplo, "Em andamento", "Concluído", "Aprovado").

## Convenção de nomenclatura

Utilize a seguinte convenção de nomenclatura para as entradas do design-log:

`[Data] - [Título]`

Por exemplo:

`2023-08-20 - Nova interface de usuário para o painel de administração`

## Ciclo de vida

O ciclo de vida de uma entrada no design-log consiste nas seguintes etapas:

1.**Criação:**A entrada é criada e registrada no design-log.
2.**Revisão:**A entrada é revisada por outros designers ou stakeholders para feedback e aprovação.
3.**Implementação:**A entrada é utilizada como referência para a implementação do design.
4.**Atualização:**A entrada pode ser atualizada com novas informações ou alterações ao longo do tempo.
5.**Arquivamento:** Quando a entrada não é mais relevante ou está concluída, pode ser arquivada para referência futura. |

## Princípio fundamental

> **Contexto > Prompto** — Nunca substitua o contexto acumulado do projeto por um prompt criativo. O design-log é a memória persistente do projeto. Agentes que o pulam criam contradições.

## Referência rápida

- Registros de design estão localizados em: `design-log/DL-NNN-slug.md`
- Nomeação: `DL-NNN`, onde NNN é um número preenchido com zeros (por exemplo, `DL-001`, `DL-042`)
- Ciclo de vida do status: `rascunho` → `revisão` → `aprovado` → `executando` → `concluído` | `rejeitado` | `suplantado`
- Somente entradas **aprovadas**e**em execução** têm autoridade vinculante sobre o comportamento do agente

## Instalação

Adicione este plugin ao seu `.claude-plugin/marketplace.json`:

```json
{
  "name": "design-log",
  "source": "./plugins/design-log"
}
```