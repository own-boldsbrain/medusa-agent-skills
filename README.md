# Medusa Agent Skills — YSH Store

Coleção de skills para agentes de IA no contexto do **YSH Store**, uma plataforma B2B de energia solar construída sobre Medusa.js v2. Inclui skills de backend, admin UI e storefront alinhados à arquitetura obrigatória do projeto, com suporte tanto a **GitHub Copilot** quanto a **Claude Code**.

Este workspace usa **GitHub Copilot CLI** como agente principal de orquestração.

---

## Arquitetura Obrigatória

| Plugin | Description |
|--------|-------------|
| [medusa-dev](plugins/medusa-dev/README.md) | Comprehensive skills for building Medusa applications across backend, admin UI, and storefronts. |
| [learn-medusa](plugins/learn-medusa/README.md) | Interactive tutorial session to learn about Medusa concepts through building a brands feature. |
| [ecommerce-storefront](plugins/ecommerce-storefront/README.md) | Comprehensive skill for building high-converting ecommerce storefronts with best practices. |
| [medusa-cloud](plugins/medusa-cloud/README.md) | Skills for managing Medusa Cloud resources through the Cloud CLI (mcloud). |

Toda implementação neste projeto segue o fluxo:

```
Module → Workflow → API Route → Frontend
```

**Regras inegociáveis:**

| Regra | Detalhe |
|-------|---------|
| Toda mutação passa por workflow | Nunca chame serviços diretamente na rota |
| Métodos HTTP: `GET`, `POST`, `DELETE` | `PUT`/`PATCH` são exceção, nunca padrão |
| SDK da Medusa no storefront e admin | Não use `fetch` cru para endpoints Medusa |
| Preço é valor final | `49.99` entra e sai como `49.99` — nunca ×100 ou ÷100 |
| Imports estáticos no topo | Nenhum `await import()` em handlers |
| `query.graph()` para leitura cross-module | Use `query.index()` quando o filtro depende de módulo linkado |

---

## Contrato do Root Workspace

Agentes e skills deste workspace devem tratar o root como uma superfície controlada.

- Não criar novos arquivos soltos no root
- Não criar novas pastas no root fora das quatro zonas lógicas do projeto
- Usar `01-backend/tools/` para utilitários versionados fora de `01-backend/scripts/`
- Usar `01-backend/static/tmp/` para outputs e snapshots gerados

**Zonas lógicas do root:**

1. `01-backend` → `01-backend/`, `design-log/`, `docs/`, `tools/`
2. `02-infra` → `.github/`, `ops/`, manifests do workspace, compose e licença
3. `03-local` → superfícies locais/não-portáveis (`.agents/`, `.claude/`, `.qwen/`, `.vscode/`, `.venv/`, caches, `.env.local`)
4. `04-storefront` → `04-storefront/`

Importante: isso é um contrato de governança para os agentes. Não mover fisicamente os anchors do monorepo sem uma migração aprovada por humano.

---

## Plugins Disponíveis

| Plugin | Escopo |
|--------|--------|
| [medusa-dev](plugins/medusa-dev/README.md) | Backend: módulos, workflows, rotas API, links, migrations |
| [learn-medusa](plugins/learn-medusa/README.md) | Referência de arquitetura Medusa.js v2 (módulos, isolation, orquestração) |
| [ecommerce-storefront](plugins/ecommerce-storefront/README.md) | Storefront: layouts, SEO, mobile, Medusa SDK, React Query |
| [design-log](plugins/design-log/README.md) | Design-Log: metodologia de decisões arquiteturais persistentes para agentes de IA |

### Skills por domínio

```
medusa-dev/
  building-with-medusa            → módulos, workflows, rotas, module links
  building-admin-dashboard-customizations  → widgets, páginas, formulários admin
  building-storefronts            → integração SDK, React Query, storefront

learn-medusa/
  learning-medusa/architecture    → module-workflow-route, module-isolation, admin-integration
  learning-medusa/checkpoints     → validação por camada (module, workflow, route, widget)

ecommerce-storefront/
  storefront-best-practices       → layouts, SEO, mobile, checkout, PDP, listing
```

---

## Skills YSH (workspace-local)

Skills específicos deste workspace ficam em `.github/skills/`:

| Skill | Quando usar |
|-------|-------------|
| `ysh-medusa-backend-workflow` | **Padrão principal** para qualquer backend Medusa: módulo, workflow, rota, migration, link, auditoria |
| `ysh-storefront-360-workflow` | Storefront end-to-end: home, listing, PDP, comparador, cart, checkout, conta, pedido |
| `ysh-audit-agents-workflow` | Revisão de auditoria, comparador, leaderboard, error terminal, pre-deploy |
| `ysh-medusa-manufacturer-incorporation` | Incorporação de fabricantes, catálogo, taxonomia, publicação |

> Em conflito entre skill upstream (medusa-dev) e skill YSH, o skill YSH prevalece.

---

## Instalação para GitHub Copilot

No GitHub Copilot, os skills precisam existir dentro de `.github/skills/` no repositório de destino. Este repositório inclui um exportador para copiar os skills dos plugins para o formato esperado pelo Copilot.

**Exportar todos os skills para um projeto Medusa:**

```powershell
Set-Location C:\caminho\para\medusa-agent-skills
.\tools\install-copilot-skills.ps1 -TargetPath C:\caminho\para\seu-projeto
```

**Exportar apenas alguns skills:**

```powershell
.\tools\install-copilot-skills.ps1 `
  -TargetPath C:\caminho\para\seu-projeto `
  -Skill building-with-medusa,building-storefronts,storefront-best-practices
```

**Sobrescrever skills já exportados:**

```powershell
.\tools\install-copilot-skills.ps1 -TargetPath C:\caminho\para\seu-projeto -Force
```

Depois da exportação, o projeto de destino passa a ter uma pasta `.github/skills/` com os skills em formato nativo do Copilot.

### Uso no GitHub Copilot

**Invocar um skill explicitamente:**

```
[[SKILL: building-with-medusa]] crie um módulo Medusa com workflow e rota admin
```

```
[[SKILL: storefront-best-practices]] melhore a PDP para mobile e SEO
```

**Observação sobre comandos Claude vs. Copilot**

O Copilot não usa `/plugin` nem comandos slash do Claude. Na adaptação para Copilot:

- `building-with-medusa`, `building-admin-dashboard-customizations` e `building-storefronts` continuam como skills principais;
- `db-migrate`, `db-generate` e `new-user` são exportados como skills operacionais que instruem o agente a executar o CLI do Medusa;
- referências auxiliares dentro de cada skill continuam disponíveis porque o exportador copia a pasta inteira do skill.

**Carregamento automático:** o Copilot pode selecionar skills automaticamente com base no contexto da tarefa, mas o prefixo `[[SKILL: ...]]` continua sendo a forma mais confiável de forçar o uso.

---

## Uso com Claude Code (upstream)

Para uso com Claude Code, consulte as instruções de instalação dos plugins individuais.

**Adicionar marketplace:**

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

**Instalar plugin de backend:**

```bash
/plugin install medusa-dev@medusa
```

**Instalar plugin de storefront:**

```bash
/plugin install ecommerce-storefront@medusa
```

**Verificar:**

```bash
/plugin
```

---

## Uso com Outros Agentes (Cursor, Windsurf etc.)

```bash
npx skills add medusajs/medusa-agent-skills
```

Ou copie manualmente o conteúdo de `plugins/<nome>/skills/` para o diretório de skills do seu agente.

---

## Estrutura do Projeto YSH Store

```
ysh-store_v0/
├── 01-backend/           # Medusa.js v2 — módulos, workflows, rotas API, admin
│   ├── src/modules/      # custom modules (manufacturer, solar, distributor, company, quote...)
│   ├── src/workflows/    # toda mutação passa por aqui
│   ├── src/api/          # rotas admin/ e store/
│   ├── src/links/        # module links (query cross-module)
│   └── src/admin/        # admin UI (routes/, hooks/api/, components/)
├── 04-storefront/        # Next.js — SDK Medusa, React Query, Tailwind
└── medusa-agent-skills/  # este repositório de skills
```

**Módulos customizados ativos:**

| Módulo | Responsabilidade |
|--------|-----------------|
| `manufacturer` | Fabricantes de energia solar (status, aliases, importação) |
| `solar` | Perfis técnicos de produto, ofertas de distribuidor, price rules |
| `distributor` | Distribuidores B2B (tipo, moeda, status, contato) |
| `company` | Empresas compradoras B2B |
| `approval` | Fluxo de aprovação de pedidos |
| `quote` | Cotações B2B |

---

## Padrões de Implementação

### Novo módulo

```
src/modules/<nome>/
  constants.ts        # NOME_MODULE
  models/             # model.define() — id com prefix
  service.ts          # MedusaService(models)
  index.ts            # Module(NOME_MODULE, { service })
  migrations/         # Migration<timestamp>.ts
```

### Novo workflow

```typescript
// step com compensação
export const meuStep = createStep(
  "meu-step",
  async (input, { container }) => {
    const service = container.resolve(MEU_MODULE)
    const resultado = await service.createX(input)
    return new StepResponse(resultado, resultado.id)
  },
  async (id, { container }) => {
    const service = container.resolve(MEU_MODULE)
    await service.deleteX(id)
  }
)

// workflow — sem async na composição
export const meuWorkflow = createWorkflow("meu-workflow", (input) => {
  return meuStep(input)
})
```

### Nova rota admin

```typescript
// GET list
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data, metadata } = await query.graph({ entity: "...", ...queryConfig.list })
  res.json({ items: data, count: metadata?.count })
}

// POST mutação
export const POST = async (req: AuthenticatedMedusaRequest<CreateDto>, res: MedusaResponse) => {
  const { result } = await meuWorkflow(req.scope).run({ input: req.validatedBody })
  res.json({ item: result })
}
```

---

## Comandos de Manutenção

```bash
# Gerar migration para um módulo
npx medusa db:generate --module <nome-modulo>

# Rodar migrations pendentes
npx medusa db:migrate

# Criar usuário admin
npx medusa user -e admin@exemplo.com -p senha123

# Build TypeScript (backend + admin)
npx tsc --noEmit
npx tsc --project src/admin/tsconfig.json --noEmit
```

---

## Privacidade

Os skills deste repositório não coletam, armazenam ou transmitem dados do usuário ou da conversa. Todo o conteúdo instrucional é local. O servidor MCP (`MedusaDocs`) consulta apenas documentação pública da Medusa.
