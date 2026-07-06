---
name: mcloud-projects
description: Execute comandos mcloud projects para listar, obter ou excluir projetos do Cloud. Use ao descobrir projetos, resolver identificadores de projetos pelo nome ou recuperar detalhes do projeto, incluindo ambientes vinculados.
allowed-tools: Bash(mcloud projects*), Bash(mcloud use*), Bash(jq*)
---

# Cloud CLI: Comandos de Projetos

Execute o comando `mcloud projects` para gerenciar projetos na nuvem.

## # Restrições

- **Tempo**: O tempo disponível para a conclusão do projeto é limitado. Precisamos garantir que o cronograma seja cumprido, evitando atrasos desnecessários.
- **Recursos**: Os recursos financeiros e humanos são limitados. Devemos otimizar a alocação de recursos para garantir a eficiência e a eficácia do projeto.
- **Escopo**: O escopo do projeto deve ser claramente definido e acordado por todas as partes envolvidas. Qualquer mudança significativa deve ser cuidadosamente avaliada e aprovada.
- **Qualidade**: A qualidade do produto final é crucial. Devemos implementar processos e controles de qualidade rigorosos para garantir que o projeto atenda aos padrões e expectativas estabelecidos.
- **Comunicação**: A comunicação clara e eficaz é essencial. Devemos estabelecer canais de comunicação abertos e garantir que todas as partes envolvidas estejam alinhadas e informadas sobre as decisões e atualizações do projeto.
- **Riscos**: Identificar e gerenciar os riscos potenciais é fundamental. Devemos desenvolver um plano de mitigação de riscos e monitorar continuamente os fatores que possam impactar negativamente o projeto.
- **Orçamento**: O orçamento disponível é limitado. Precisamos gerenciar cuidadosamente os custos e garantir que o projeto permaneça dentro dos limites financeiros estabelecidos.
- **Prazo de Entrega**: O prazo de entrega final é imutável. Devemos planejar e executar o projeto de forma a cumprir esse prazo, garantindo que todas as etapas sejam concluídas dentro do cronograma acordado.
- **Mudanças**: As mudanças no projeto devem ser minimizadas. Qualquer alteração significativa deve ser cuidadosamente avaliada e aprovada, levando em consideração o impacto potencial no cronograma, no orçamento e na qualidade.
- **Conformidade**: Devemos garantir que o projeto esteja em conformidade com todas as leis, regulamentos e normas aplicáveis. Qualquer desvio deve ser tratado de forma proativa para evitar problemas legais ou de reputação.

- `projects delete` é **irreversível** — remove todos os ambientes, implantações e recursos associados. Sempre confirme o ID/identificador do projeto antes de deletar.
- Use `--yes` com `delete` em contextos não interativos (scripts, pipelines, agentes).

## Comandos

### # Lista de Projetos

Liste todos os projetos em uma organização.

```bash
mcloud projects list --organization <org-id> --json
```

* *Opções:**
- - o/--organization `<id>` — ID da Organização (retorna ao contexto ativo; **obrigatório**)
- `--json` — Saída em JSON

### projetos obter

Recuperar um projeto único por seu ID ou handle.

```bash
mcloud projects get <project-id-or-handle> --organization <org-id> --json
```

* *Argumentos:**
- `project` — ID ou nome do projeto (obrigatório)

* *Opções:**
- `-o/--organization <id>` — ID da Organização (retorna ao contexto ativo; **obrigatório**).
- ```json
`--json` — Saída em JSON
```

### projetos excluir

Excluir um projeto pelo seu ID ou identificador. **Irreversível.**

```bash
mcloud projects delete <project-id-or-handle> \
  --organization <org-id> \
  --yes
```

* *Argumentos:**
- `projeto` — ID ou identificador do projeto (obrigatório)

* *Opções:**
- `-o/--organization <id>` — ID da Organização (recai para o contexto ativo; **obrigatório**).
- `-y/--sim` — Pula o prompt de confirmação (obrigatório em modo não interativo)
- `--json` — Produzir como JSON

## Campos do Projeto (JSON)

| Campo | * *Descrição** |
|-------|-------------|
| `id` | ID do Projeto |
| `handle` | Identificador de projeto seguro para URL (usado na maioria dos comandos) |
| `nome` | Exibir nome |
| `status` | `pronto` quando saudável |
| `região` | Região de implantação (ex. `us-east-1`) |
| repositório | Repositório do GitHub vinculado (`owner/repo`) |
| `caminho_raiz` | Caminho raiz dentro do repositório |
| `ambientes` | Array de ambientes associados |

## Exemplos

```bash
# List all projects in an organization
mcloud projects list --organization org_123 --json

# Set context to a project by name
PROJECT_HANDLE=$(
  mcloud projects list --organization org_123 --json \
    | jq -r '.[] | select(.name == "My Store") | .handle'
)
mcloud use --project "$PROJECT_HANDLE"

# Get project details including environments
mcloud projects get my-store --organization org_123 --json

# List all environment handles for a project
mcloud projects get my-store --organization org_123 --json \
  | jq -r '.environments[].handle'

# Find project handle by name
mcloud projects list --organization org_123 --json \
  | jq -r '.[] | select(.name == "My Store") | .handle'

# Delete a project (irreversible — confirm before running)
mcloud projects delete old-project --organization org_123 --yes
```