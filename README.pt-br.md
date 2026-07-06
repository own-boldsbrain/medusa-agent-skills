# Habilidades do Agente Medusa — Loja YSH

Coleção de habilidades para agentes de IA no contexto do **YSH Store**, uma plataforma B2B de energia solar construída sobre Medusa.js v2. Inclui habilidades de backend, UI administrativa e storefront alinhados à arquitetura obrigatória do projeto, com suporte tanto a **GitHub Copilot**quanto a**Claude Code**.

Este workspace usa **GitHub Copilot CLI** como agente principal de orquestração.

# **Título Principal**Este é um texto de exemplo. Vamos imaginar que estamos criando um guia de estilo para um site.

## Subtítulo

- Lista de itens:
  - Item 1
  - Item 2 com*ênfase*- Item 3**em negrito**[Link para a página inicial](https://example.com)

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">Sobre</a></li>
    <li><a href="/contact">Contato</a></li>
  </ul>
</nav>
```

Abaixo, temos um código em Python:

```python
def saudacao(nome):
    return f"Olá, {nome}!"

print(saudacao("Alice"))  # Saída: Olá, Alice!
```**Negrito**e*itálico* podem ser usados para destacar palavras ou frases.

## Arquitetura Obrigatória

| **Plugin**================

Um plugin é um componente adicional que pode ser instalado no software principal para adicionar novas funcionalidades ou melhorar as existentes. 

### Tipos de plugins***Plugins de extensão**: adicionam novas funcionalidades ao software principal.
***Plugins de integração**: permitem a integração do software principal com outros sistemas ou serviços.
***Plugins de personalização**: permitem a personalização do software principal para atender às necessidades específicas de um usuário ou organização.

### Como criar um plugin

Para criar um plugin, você precisará:

1. Selecionar o software principal que deseja estender.
2. Escolher a linguagem de programação e o framework a ser utilizado.
3. Desenvolver o código do plugin.
4. Testar e depurar o plugin.
5. Empacotar e distribuir o plugin.

### Exemplos de plugins

***Plugin de autenticação**: adiciona uma funcionalidade de autenticação ao software principal.
***Plugin de backup**: permite a criação de backups automáticos do software principal.
***Plugin de integração com APIs**: permite a integração do software principal com APIs externas.

### Links úteis

* [Documentação do plugin do software principal](https://softwareprincipal.com/docs/plugins)
* [Tutoriais de desenvolvimento de plugins](https://tutoriaisplugins.com/)
* [Comunidade de desenvolvedores de plugins](https://comunidadeplugins.com/) | Descrição |
|--------|-------------|
| [medusa-dev](plugins/medusa-dev/README.md) | Habilidades abrangentes para construir aplicações Medusa em backend, interface administrativa e vitrines. |
| [aprenda-medusa](plugins/aprenda-medusa/README.md) | Sessão de tutorial interativo para aprender sobre conceitos do Medusa por meio da construção de um recurso de marcas. |
| [ecommerce-storefront](plugins/ecommerce-storefront/README.md) | Habilidade abrangente para criar lojas virtuais de alta conversão seguindo as melhores práticas. |
| [medusa-cloud](plugins/medusa-cloud/README.md) | Habilidades para gerenciar recursos do Medusa Cloud por meio do Cloud CLI (mcloud). |

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
| Preço é valor final | `49,99` entra e sai como `49,99` — nunca ×100 ou ÷100 |
| Importações estáticas no topo | Nenhum `await import()` em manipuladores |
| `query.graph()` para leitura cross-module | Use `query.index()` quando o filtro depende de módulo vinculado |

# **Título Principal**## Subtítulo

Este é um parágrafo com*ênfase*e**texto em negrito**.

- Lista
  - Item 1
  - Item 2

[Link de exemplo](https://example.com)

```python
def hello_world():
    print("Olá, Mundo!")
```

> Citação: "A jornada de mil milhas começa com um único passo."

| Cabeçalho 1 | Cabeçalho 2 |
| ----------- | ----------- |
| Celula 1     | Celula 2     |

<html>
  <body>
    <h1>Título HTML</h1>
    <p>Parágrafo com <strong>texto forte</strong> e <em>ênfase</em>.</p>
  </body>
</html>

## Contrato do Root Workspace

Agentes e skills deste workspace devem tratar o root como uma superfície controlada.

- Não criar novos arquivos soltos no root
- Não criar novas pastas no root fora das quatro zonas lógicas do projeto.
- Usar `01-backend/tools/` para utilitários versionados fora de `01-backend/scripts/`
- Usar `01-backend/static/tmp/` para outputs e snapshots gerados

**Zonas lógicas do root:**

1. `01-backend` → `01-backend/`, `design-log/`, `docs/`, `ferramentas/`
2. `02-infra` → `.github/`, `ops/`, manifests do espaço de trabalho, compose e licença
3. `03-local` → superfícies locais/não-portáveis (`.agents/`, `.claude/`, `.qwen/`, `.vscode/`, `.venv/`, caches, `.env.local`)
4. `04-storefront` → `04-storefront/`

Importante: isso é um contrato de governança para os agentes. Não mover fisicamente os anchors do monorepo sem uma migração aprovada por humano.

Preserve todos os elementos de marcação, blocos de código, listas, links, **negrito/itálico** e tags semelhantes a HTML exatamente como estão.

## **Plugins Disponíveis**# Plugins Disponíveis

## Listagem de Plugins

- Plugin 1
- Plugin 2
- Plugin 3

### Instalação de Plugins

1. Clique no botão "Instalar Plugin" abaixo.
2. Selecione o plugin desejado e clique em "Instalar".
3. Aguarde a instalação do plugin.

### Exemplo de Plugin

```python
import plugin

plugin.exemplo()
```

### Como Criar um Plugin

1. Crie um novo arquivo com o nome do plugin.
2. Adicione a seguinte linha no início do arquivo: `import plugin`.
3. Adicione a lógica do plugin no arquivo.
4. Salve o arquivo e faça o upload dele para a plataforma.

### Links Úteis* [Documentação do Plugin](https://documentacao.plugin.com.br/)
* [Fórum de Suporte](https://forum.plugin.com.br/)

| Plugin | Âmbito |
|--------|--------|
| [medusa-dev](plugins/medusa-dev/README.md) | Backend: módulos, workflows, rotas API, links, migrações |
| [learn-medusa](plugins/learn-medusa/README.md) | Referência de arquitetura Medusa.js v2 (módulos, isolamento, orquestração) |
| [ecommerce-storefront](plugins/ecommerce-storefront/README.md) | Loja de Produtos: layouts, SEO, mobile, SDK Medusa, React Query |
| [design-log](plugins/design-log/README.md) | Design-Log: metodologia de decisões arquiteturais persistentes para agentes de IA |

### Habilidades por domínio

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

- --

## Habilidades YSH (local ao espaço de trabalho)

Habilidades específicas deste workspace ficam em `.github/skills/`:

| Habilidade | **Quando usar**Aqui estão algumas dicas para ajudá-lo a decidir quando usar o**`if`**ou o**`switch`**:

### `if`

* Use o `if` quando você precisar verificar uma condição simples e tomar uma ação específica se a condição for verdadeira.
* O `if` é mais simples e fácil de usar do que o `switch`, mas pode ser mais lento em casos de grande quantidade de condições.

### Exemplo de uso do `if`

```php
$idade = 25;
if ($idade >= 18) {
    echo 'Você é maior de idade.';
} else {
    echo 'Você é menor de idade.';
}
```

### `switch`

* Use o `switch` quando você precisar verificar várias condições e tomar uma ação específica para cada uma delas.
* O `switch` é mais rápido do que o `if` em casos de grande quantidade de condições, pois não precisa verificar cada condição individualmente.

### Exemplo de uso do `switch`

```php
$diaSemana = 'segunda-feira';
switch ($diaSemana) {
    case 'segunda-feira':
        echo 'Segunda-feira é um dia de semana.';
        break;
    case 'terça-feira':
        echo 'Terça-feira é um dia de semana.';
        break;
    case 'quarta-feira':
        echo 'Quarta-feira é um dia de semana.';
        break;
    // ...
    default:
        echo 'Dia desconhecido.';
        break;
}
```

### Quando usar o `switch` em vez do `if`

* Use o `switch` em vez do `if` quando você precisar verificar várias condições e tomar uma ação específica para cada uma delas.
* O `switch` é mais rápido do que o `if` em casos de grande quantidade de condições, pois não precisa verificar cada condição individualmente.

### Exemplo de uso do `switch` em vez do `if`

```php
$diaSemana = 'segunda-feira';
if ($diaSemana == 'segunda-feira') {
    echo 'Segunda-feira é um dia de semana.';
} elseif ($diaSemana == 'terça-feira') {
    echo 'Terça-feira é um dia de semana.';
} elseif ($diaSemana == 'quarta-feira') {
    echo 'Quarta-feira é um dia de semana.';
} // ...
```

### Conclusão

* Use o `if` quando você precisar verificar uma condição simples e tomar uma ação específica se a condição for verdadeira.
* Use o `switch` quando você precisar verificar várias condições e tomar uma ação específica para cada uma delas.
* O `switch` é mais rápido do que o `if` em casos de grande quantidade de condições, pois não precisa verificar cada condição individualmente. |
|-------|-------------|
| `ysh-medusa-backend-workflow` | **Padrão principal** para qualquer backend Medusa: módulo, workflow, rota, migration, link, auditoria |
| `ysh-storefront-360-fluxo-de-trabalho` | Frente de loja de ponta a ponta: home, lista de produtos, PDP, comparador de preços, carrinho, checkout, conta, pedido |
| ysh-audit-agents-workflow | Revisão de auditoria, comparador, leaderboard, error terminal, pré-implantação. |
| `ysh-medusa-fabricante-incorporação` | Incorporação de fabricantes, catálogo, taxonomia, publicação

**Introdução**
===============

A incorporação de fabricantes, catálogo, taxonomia e publicação é um processo complexo que envolve várias etapas e requisitos. Neste artigo, vamos abordar cada um desses tópicos de forma detalhada.

### Incorporação de Fabricantes

A incorporação de fabricantes é um processo crucial que envolve a integração de dados de fornecedores e fabricantes em um sistema único. Isso permite que os clientes tenham acesso a uma ampla gama de produtos e serviços de diferentes fornecedores.

#### Exemplo de Código

```python
import pandas as pd

# Dados de fabricantes
fabricantes = {
    'Nome': ['Fabricante 1', 'Fabricante 2', 'Fabricante 3'],
    'Descrição': ['Descrição 1', 'Descrição 2', 'Descrição 3']
}

# Dados de produtos
produtos = {
    'Nome': ['Produto 1', 'Produto 2', 'Produto 3'],
    'Descrição': ['Descrição 1', 'Descrição 2', 'Descrição 3']
}

# Integração de dados
integração = pd.merge(fabricantes, produtos, on='Nome')
print(integração)
```

### Catálogo

O catálogo é uma coleção de produtos e serviços oferecidos por um fabricante ou fornecedor. Ele é essencial para que os clientes possam navegar e encontrar os produtos que precisam.

#### Exemplo de Código

```html
<!DOCTYPE html>
<html>
<head>
    <title>Catálogo</title>
</head>
<body>
    <h1>Catálogo de Produtos</h1>
    <ul>
        <li>Produto 1</li>
        <li>Produto 2</li>
        <li>Produto 3</li>
    </ul>
</body>
</html>
```

### Taxonomia

A taxonomia é a classificação e organização de dados em categorias e subcategorias. Isso ajuda a facilitar a busca e a navegação pelos dados.

#### Exemplo de Código

```python
import pandas as pd

# Dados de categorias
categorias = {
    'Nome': ['Categoria 1', 'Categoria 2', 'Categoria 3'],
    'Descrição': ['Descrição 1', 'Descrição 2', 'Descrição 3']
}

# Dados de subcategorias
subcategorias = {
    'Nome': ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'],
    'Descrição': ['Descrição 1', 'Descrição 2', 'Descrição 3']
}

# Integração de dados
integração = pd.merge(categorias, subcategorias, on='Nome')
print(integração)
```

### Publicação

A publicação é o processo de disponibilizar os dados e produtos para os clientes. Isso pode ser feito por meio de um site, aplicativo ou outro meio de comunicação.

#### Exemplo de Código

```html
<!DOCTYPE html>
<html>
<head>
    <title>Publicação</title>
</head>
<body>
    <h1>Publicação de Produtos</h1>
    <p>Os seguintes produtos estão disponíveis:</p>
    <ul>
        <li>Produto 1</li>
        <li>Produto 2</li>
        <li>Produto 3</li>
    </ul>
</body>
</html>
```

Esses são apenas alguns exemplos de como a incorporação de fabricantes, catálogo, taxonomia e publicação podem ser implementadas em um sistema. A complexidade e os requisitos específicos podem variar dependendo da necessidade do negócio. |

> Em conflito entre a skill upstream (medusa-dev) e a skill YSH, a skill YSH prevalece.

# **Título Principal**Este é um exemplo de texto em português.

## Subtítulo

- Lista
  - com
    - vários
    - níveis

[Link de exemplo](https://example.com)

```python
def hello_world():
    print("Olá, Mundo!")
```**Texto em negrito**e*itálico* também são importantes.

<div>Elemento HTML</div>

- --

## Instalação para o GitHub Copilot

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

**Sobrescrever skills já exportadas:**

```powershell
.\tools\install-copilot-skills.ps1 -TargetPath C:\caminho\para\seu-projeto -Force
```

Depois da exportação, o projeto de destino passa a ter uma pasta `.github/skills/` com os skills em formato nativo do Copilot.

### Uso no GitHub Copilot

**Invocar uma habilidade explicitamente:**

```
[[SKILL: building-with-medusa]] crie um módulo Medusa com workflow e rota admin
```

```
[[SKILL: storefront-best-practices]] melhore a PDP para mobile e SEO
```

**Observação sobre comandos Claude vs. Copilot**

O Copilot não usa `/plugin` nem comandos slash do Claude. Na adaptação para Copilot:

### Comandos de Claude

| Comando | Descrição | Exemplo |
| --- | --- | --- |
| `/plugin` | Ativa o plugin desejado | `/plugin chatgpt` |
| `/help` | Exibe as opções de ajuda | `/help` |
| `/about` | Exibe informações sobre o modelo | `/about` |

### Comandos de Copilot

| Comando | Descrição | Exemplo |
| --- | --- | --- |
| `/help` | Exibe as opções de ajuda | `/help` |
| `/about` | Exibe informações sobre o modelo | `/about` |
| `/settings` | Exibe as configurações do usuário | `/settings` |

### Diferenças entre Claude e Copilot

* Claude usa `/plugin` para ativar plugins, enquanto o Copilot não usa esse comando.
* Claude tem comandos adicionais como `/help` e `/about`, que também estão disponíveis no Copilot.
* O Copilot tem um comando adicional `/settings` para exibir as configurações do usuário.

### Exemplo de uso

Você pode usar os comandos de Copilot para interagir com o modelo de forma diferente. Por exemplo, você pode usar o comando `/help` para exibir as opções de ajuda ou `/about` para exibir informações sobre o modelo.

- `building-with-medusa`, `building-admin-dashboard-customizations` e `building-storefronts` continuam como habilidades principais;
- `db-migrate`, `db-generate` e `new-user` são exportados como skills operacionais que instruem o agente a executar o CLI do Medusa;
- referências auxiliares dentro de cada habilidade continuam disponíveis porque o exportador copia a pasta inteira da habilidade.

**Carregamento automático:** o Copilot pode selecionar skills automaticamente com base no contexto da tarefa, mas o prefixo `[[SKILL: ...]]` continua sendo a forma mais confiável de forçar o uso.

- --
```markdown
# Introdução ao Python

Python é uma linguagem de programação de alto nível, interpretada e de propósito geral. Ela é conhecida por sua **sintaxe clara**e legibilidade, o que a torna uma excelente escolha para iniciantes.

## Características principais

-**Fácil de aprender**: Python tem uma sintaxe simples e intuitiva.
- **Multiplataforma**: Funciona em Windows, macOS e Linux.
- **Extensível**: Pode ser integrada a outras linguagens como C e C++.
- **Grande biblioteca padrão**: Vem com muitas bibliotecas úteis para diversas tarefas.

## Exemplos de código

Aqui está um exemplo simples de um "Hello, World!" em Python:

```python
print("Hello, World!")
```

E um exemplo de função que calcula a soma de dois números:

```python
def soma(a, b):
    return a + b
```

## Recursos úteis

- [Documentação oficial do Python](https://docs.python.org/3/)
- [Python Package Index (PyPI)](https://pypi.org/)
- [Tutorial interativo do Python](https://www.learnpython.org/)

## Citações

> "Python é uma linguagem incrível para iniciantes e especialistas."
> — Guido van Rossum (criador do Python)

## Tabela comparativa

| Característica       | Python | JavaScript |
|----------------------|--------|------------|
| Sintaxe              | Clara  | Complexa   |
| Tipagem              | Dinâmica | Dinâmica   |
| Performance          | Boa    | Boa        |
| Comunidade           | Grande | Grande     |
```

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

- --

## Uso com Outros Agentes (Cursor, Windsurf etc.)

```bash
npx skills add medusajs/medusa-agent-skills
```

Ou copie manualmente o conteúdo de `plugins/<nome>/skills/` para o diretório de skills do seu agente.

Por favor, forneça o texto em inglês que deseja traduzir para o português.

## **Estrutura do Projeto YSH Store**# Introdução

O projeto YSH Store visa criar uma plataforma de comércio eletrônico eficiente e escalável, capaz de atender às necessidades de diferentes clientes e produtos.

## Objetivos* Criar uma estrutura de projeto que permita a escalabilidade e a manutenção do sistema;
* Desenvolver uma plataforma de comércio eletrônico que seja fácil de usar e intuitiva;
* Implementar funcionalidades que atendam às necessidades de diferentes clientes e produtos.

### Requisitos Funcionais

* Autenticação e autorização de usuários;
* Gerenciamento de produtos e categorias;
* Processamento de pedidos e envio de notificações;
* Integração com sistemas de pagamento e entrega.

### Requisitos Não Funcionais

* Desempenho e escalabilidade do sistema;
* Segurança e privacidade dos dados dos usuários;
* Usabilidade e acessibilidade da plataforma.

# Arquitetura

A arquitetura do projeto YSH Store será baseada em uma estrutura de microsserviços, com cada serviço responsável por uma função específica.

## Serviços

* Servidor de autenticação e autorização;
* Servidor de gerenciamento de produtos e categorias;
* Servidor de processamento de pedidos e envio de notificações;
* Servidor de integração com sistemas de pagamento e entrega.

### Tecnologias

* Java 11;
* Spring Boot;
* MySQL;
* RabbitMQ;
* Docker.

# Conclusão

O projeto YSH Store visa criar uma plataforma de comércio eletrônico eficiente e escalável, capaz de atender às necessidades de diferentes clientes e produtos. A arquitetura baseada em microsserviços permitirá a escalabilidade e a manutenção do sistema, enquanto as tecnologias escolhidas garantirão a segurança e a usabilidade da plataforma.

## Próximos Passos

* Desenvolver os serviços e implementar as tecnologias escolhidas;
* Testar e validar a plataforma;
* Realizar deploy da plataforma em produção.

### Referências

* [Spring Boot](https://spring.io/projects/spring-boot);
* [RabbitMQ](https://www.rabbitmq.com/);
* [Docker](https://www.docker.com/).

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

**Módulos personalizados ativos:**

| Módulo | Responsabilidade |
|--------|-----------------|
| fabricante | Fabricantes de energia solar (status, aliases, importação) |
| * solar* | Perfis técnicos de produto, ofertas de distribuidor, regras de preço |
| distribuidor | Distribuidores B2B (tipo, moeda, status, contato) |
| empresa | Empresas compradoras B2B |
| `aprovado` | Fluxo de aprovação de pedidos |
| `citação` | Cotações B2B |

- --

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

### Novo fluxo de trabalho

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

### **Nova Rota Admin**# Nova Rota Admin

## Introdução

A**Nova Rota Admin**é uma aplicação web para gerenciamento de rotas e usuários.

## Características

-**Autenticação**: Autenticação de usuários com login e senha.
- **Gerenciamento de Rotas**: Cadastrar, editar e excluir rotas.
- **Permissões**: Definir permissões para usuários.

## Requisitos

- Node.js (versão 14 ou superior)
- Express.js (versão 4 ou superior)
- Banco de dados (ex: MongoDB)

### Instalação

```bash
npm install
```

### Inicialização

```bash
node server.js
```

### Rotas

- **GET**`/`: Página inicial
-**GET**`/users`: Lista de usuários
-**POST**`/users`: Cadastrar novo usuário
-**PUT**`/users/:id`: Editar usuário
-**DELETE**`/users/:id`: Excluir usuário

### Banco de Dados

-**MongoDB**: Utilize o modelo de dados abaixo para criar a coleção `users`:
```json
{
  "_id" : ObjectId,
  "name" : String,
  "email" : String,
  "password" : String,
  "permissions" : Array
}
```
### Exemplo de Uso

```bash
curl -X POST \
  http://localhost:3000/users \
  - H 'Content-Type: application/json' \
  - d '{"name": "John Doe", "email": "john.doe@example.com", "password": "password"}'
```

### Licença

A **Nova Rota Admin**é software de código aberto, licenciado sob a**MIT License**.

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

- --
- --

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

Por favor, forneça o texto que deseja traduzir.

## **Privacidade**Este conceito é fundamental em muitas áreas, incluindo:* Direito
* Tecnologia
* Política
* Negócios

A privacidade é o direito de um indivíduo de controlar a informação pessoal sobre si mesmo e de proteger-se contra a coleta, armazenamento e divulgação de dados sem consentimento.

**Tipos de privacidade:**1. Privacidade pessoal: refere-se à proteção de informações pessoais, como dados de identificação, endereços, números de telefone e informações financeiras.
2. Privacidade digital: refere-se à proteção de informações digitais, como dados de internet, histórico de navegação e informações de dispositivos móveis.
3. Privacidade profissional: refere-se à proteção de informações profissionais, como dados de emprego, salários e informações de clientes.**Importância da privacidade:***Proteção contra roubo de identidade
* Prevenção de fraude e crime cibernético
* Manutenção da confiança e da reputação
* Respeito à autonomia e à dignidade humana

**Legislação sobre privacidade:***Lei Geral de Proteção de Dados (LGPD) no Brasil
* Regulamento Geral sobre a Proteção de Dados (RGPD) na União Europeia
* Lei de Privacidade na Califórnia (CCPA) nos EUA

**Exemplos de violação de privacidade:***Roubo de dados pessoais
* Divulgação de informações sem consentimento
* Uso indevido de dados para fins de marketing
* Acesso não autorizado a informações confidenciais

**Melhorias na privacidade:***Uso de tecnologias de segurança, como criptografia e autenticação
* Implementação de políticas de privacidade claras e transparentes
* Treinamento e conscientização sobre a importância da privacidade
* Monitoramento e resposta a incidentes de segurança

Os skills deste repositório não coletam, armazenam ou transmitem dados do usuário ou da conversa. Todo o conteúdo instrucional é local. O servidor MCP (`MedusaDocs`) consulta apenas documentação pública da Medusa.