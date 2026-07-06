---
name: mcloud-environments
description: Execute comandos mcloud environments para listar, obter, criar, excluir, reimplantação ou acionar builds para ambientes Cloud. Use ao gerenciar o ciclo de vida do ambiente, reimplantar após alterações de variáveis ou iniciar novos builds a partir do código-fonte.
allowed-tools: Bash(mcloud environments*), Bash(mcloud use*), Bash(jq*)
---

# Cloud CLI: Comandos de Ambientes

Execute o comando `mcloud environments` para gerenciar o ciclo de vida de ambientes e implantações.

### Restrições

- **Tempo**: O modelo tem um tempo limitado para responder a cada consulta.
- **Comprimento da resposta**: As respostas são limitadas a um número específico de palavras ou caracteres.
- **Conhecimento**: O modelo tem acesso a um conjunto de dados limitado e não pode fornecer informações atualizadas sobre eventos recentes.
- **Segurança**: O modelo é projetado para evitar respostas potencialmente prejudiciais ou ofensivas.
- **Idioma**: O modelo é treinado em um idioma específico e pode ter dificuldades com idiomas diferentes.

```
[Código de exemplo]

def processar_consulta(consulta):
    # Processamento da consulta aqui
    resposta = "Resposta gerada"
    return resposta
```

[Link para mais informações](https://example.com/constraints)

- Note*: As restrições acima são apenas um exemplo e podem variar de acordo com a implementação e os requisitos específicos do modelo.

- *Ambientes de produção não podem ser excluídos.**Sempre verifique `type` via `environments get --json` antes de tentar excluir em automação.
- Use `--yes` para operações destrutivas (`delete`) em contextos não interativos.
- `redeploy` vs `redeploy-com-build` não são intercambiáveis — escolha o correto com base em onde a correção está.

### Comandos

### lista de ambientes

Liste todos os ambientes de um projeto.

```bash
mcloud environments list --organization <org-id> --project <project-id-or-handle> --json
```

-*Opções:**- `-o/--organização <id>` — ID da Organização (pode ser substituído pelo contexto ativo)

- `-p/--project <id-ou-handle>` — ID ou handle do projeto (reverte para o contexto ativo)
- `--json` — Saída em JSON

### ambientes obtêm

Recupere um único ambiente pelo identificador.

```bash
mcloud environments get <environment-handle> --organization <org-id> --project <project-id-or-handle> --json
```

-*Argumentos:**- `ambiente` — Manipulador do ambiente (obrigatório)

-*Opções:**- `-o/--organização <id>`, `-p/--projeto <id-ou-identificador>`, `--json`

### ambientes criam

Crie um novo ambiente de longa duração.

```bash
mcloud environments create \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --name "Staging" \
  --branch develop \
  --json
```

-*Opções:**- `-o/--organização <id>`, `-p/--projeto <id-ou-identificador>`

- `-n/--name <name>` — Nome do ambiente (obrigatório)
- `-b/--branch <branch>` — Ramo Git a ser rastreado (obrigatório)
- `--custom-subdomain <subdomain>` — Subdomínio personalizado opcional
- `--json` — Saída como JSON

### ambientes excluir

Apague um ambiente.**Não é possível apagar ambientes de produção.**```bash
mcloud environments delete <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --yes

```

-*Argumentos:**- `ambiente` — Manipulador de ambiente (obrigatório)

-*Opções:**- `-o/--organization <id>`, `-p/--project <id-ou-handle>`
- `y`/`-sim` — Ignorar prompt de confirmação (obrigatório em modo não interativo)
- `--json` — Saída como JSON

### ambientes reimplantar

Re-executar uma construção existente para a implantação ativa. Utilize quando a correção está do lado do ambiente (mudança de variável, problema de infra) — NÃO inicia uma nova construção.

```bash
mcloud environments redeploy <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --json
```

-*Argumentos:**- `ambiente` — Manipulador de Ambiente (obrigatório)

-*Opções:**- `-o/--organização <id>`, `-p/--projeto <id-ou-handle>`, `--json`

> Requer que o ambiente tenha uma implantação ativa. Se não tiver, use `trigger-build` primeiro.

### ambientes acionar-construir

Inicie uma nova compilação a partir do branch rastreado. Use quando o código corrigido estiver comprometido — cria uma nova implantação.

```bash
mcloud environments trigger-build <environment-handle> \
  --organization <org-id> \
  --project <project-id-or-handle> \
  --json
```

-*Argumentos:**- `ambiente` — Manipulador de ambiente (obrigatório)

-*Opções:**- `-o/--organização <id>`, `-p/--projeto <id-ou-handle>`, `--json`

## **Redeploy vs Trigger-Build Decision**Quando você está trabalhando com aplicações em nuvem, especialmente em ambientes de CI/CD (Integração Continua e Entrega Contínua), é comum se deparar com a decisão de reempregar ou disparar uma build. Embora ambos os métodos possam ser eficazes em diferentes situações, é importante entender as diferenças entre eles

### Redeploy

Um redeploy é a ação de reempregar uma aplicação existente com as alterações mais recentes. Isso pode ser feito manualmente ou através de um script automático. O redeploy é útil quando:

-**Alterações menores**: Se as alterações são menores e não afetam a lógica da aplicação, um redeploy pode ser suficiente.

- **Testes rápidos**: O redeploy permite testar as alterações rapidamente sem a necessidade de uma build completa.
- **Desenvolvimento**: Durante o desenvolvimento, um redeploy pode ser usado para testar as alterações antes de fazer uma build completa.

### Trigger-Build

Um trigger-build é a ação de disparar uma build completa com as alterações mais recentes. Isso pode ser feito manualmente ou através de um script automático. O trigger-build é útil quando:

- **Alterações significativas**: Se as alterações são significativas e afetam a lógica da aplicação, um trigger-build é recomendado.
- **Integração contínua**: O trigger-build é essencial para a integração contínua, pois garante que a aplicação seja construída e testada regularmente.
- **Entrega contínua**: O trigger-build também é importante para a entrega contínua, pois garante que as alterações sejam liberadas regularmente.

### Conclusão

Em resumo, um redeploy é útil quando as alterações são menores e não afetam a lógica da aplicação, enquanto um trigger-build é recomendado quando as alterações são significativas e afetam a lógica da aplicação. É importante entender as diferenças entre esses métodos e escolher o que melhor se adapta às necessidades da sua aplicação.

- *Recursos adicionais**

- [CI/CD com Jenkins](https://www.jenkins.io/)
- [Integração contínua com GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Entrega contínua com AWS CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)

| Comando | # Quando usar

Use o `when` para criar condições e controlar o fluxo de execução do seu código. Ele permite que você execute um bloco de código apenas quando uma determinada condição for verdadeira.

## Sintaxe

```python
if condição:
    # Código a ser executado se a condição for verdadeira
```

## Exemplos

- Verificar se um número é par:

```python
numero = 7
if numero % 2 == 0:
    print("O número é par.")
else:
    print("O número é ímpar.")
```

- Verificar se uma string está vazia:

```python
frase = ""
if frase:
    print("A string não está vazia.")
else:
    print("A string está vazia.")
```

- Verificar se um elemento existe em uma lista:

```python
minha_lista = [1, 2, 3, 4, 5]
elemento = 3
if elemento in minha_lista:
    print("O elemento está na lista.")
else:
    print("O elemento não está na lista.")
``` |
|---------|-------------|
| `reimplantar` | Corrigir é lado do ambiente (mudança de variável, configuração de infra) — reexecuta a build existente |
| `trigger-build` | A correção está no código-fonte no ramo rastreado — inicia uma nova compilação |

## Exemplos

```bash
# List all environments
mcloud environments list --json

# Get environment details and check type before deleting
mcloud environments get staging --json | jq '{id, name, type, status}'

# Create a new environment tracking the develop branch
mcloud environments create --name "Staging" --branch develop --json

# Delete a non-production environment
mcloud environments delete staging --yes

# Redeploy after a variable change
mcloud environments redeploy production --json

# Trigger a fresh build from source
mcloud environments trigger-build production --json

# Find environment handles by name
mcloud environments list --json \
  | jq -r '.[] | select(.name == "Production") | .handle'

# Verify new build started
mcloud deployments list --environment production --limit 5 --json \
  | jq '.[] | {id, backend_status, updated_at}'
```
