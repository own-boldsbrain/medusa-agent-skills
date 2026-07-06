# Componente Seletor de País

## Conteúdo

- [Visão Geral](#visão-geral)
- [Quando Implementar](#quando-implementar)
- [Padrões de UI](#ui-patterns)
- Gerenciamento de Estado
- [Integração de Back-end](#integração-de-back-end)
- [Detecção e Padrões Padrão](#detecção-e-padrões-padrão)
- [Considerações Móveis](#consideracoes-moveis)
- [Checklist](#checklist)

## Visão geral

Selecionador de país permite que os clientes escolham seu país/região, o que determina a moeda, o preço, os produtos disponíveis, as opções de envio, os métodos de pagamento e o conteúdo localizado.

### Funções-chave do Ecommerce

### Funções-chave do Ecommerce

#### 1. **Gerenciamento de Produtos***Adicionar produtos
* Editar produtos
* Excluir produtos
* Visualizar produtos

#### 2. **Gerenciamento de Pedidos***Criar pedidos
* Editar pedidos
* Excluir pedidos
* Visualizar pedidos
* Status de pedidos

#### 3. **Gerenciamento de Clientes***Criar clientes
* Editar clientes
* Excluir clientes
* Visualizar clientes
* Histórico de compras

#### 4. **Gerenciamento de Pagamentos***Formas de pagamento
* Pagamentos parciais
* Pagamentos totais
* Cancelamentos de pagamentos

#### 5. **Gerenciamento de Relatórios***Relatórios de vendas
* Relatórios de lucro
* Relatórios de estoque
* Relatórios de clientes

#### 6. **Integração com Terceiros***Integração com lojas virtuais
* Integração com sistemas de pagamento
* Integração com provedores de entrega

#### 7. **Segurança e Privacidade***Autenticação de usuários
* Autorização de acesso
* Proteção de dados
* Privacidade de clientes

#### 8. **Desempenho e Manutenção***Monitoramento de desempenho
* Manutenção de banco de dados
* Manutenção de sistema
* Atualizações de software

- Exibir preços na moeda correta
- Mostrar disponibilidade de produtos específica de país
- Aplicar promoções e descontos específicos da região
- Calcula custos de envio precisos e tempos de entrega
- Habilite métodos de pagamento apropriados
- Exibir conteúdo e idioma localizados

### Objetivo

**Por que a seleção do país/região é importante:**

- Preços variam por região (moeda, impostos, taxas de importação)
- A disponibilidade do produto varia de mercado para mercado.
- Os métodos e custos de envio são específicos de cada região.
- Os requisitos legais variam (privacidade, proteção ao consumidor)
- Métodos de pagamento variam por país
- Melhora a experiência do usuário com conteúdo relevante

## Quando Implementar

**Implementar o seletor de país quando:**

- O backend suporta vários países ou regiões.
- Venda para vários países ou regiões
- Preços variam de acordo com a localização (moeda, impostos)
- Envio internacional com taxas diferentes
- Catálogos de produtos específicos de região
- Suporte a múltiplas moedas necessário
- Os requisitos legais ou regulatórios variam de região para região.

**Pule se:**

- Fundo de cena não suporta múltiplos países ou regiões
- Todos os preços em uma única moeda
- Sem diferenças regionais no catálogo ou no preço

## Padrões de Interface de Usuário

### Opções de Localização

**Posicionamento do rodapé (moderno e minimal):**

- Bottom of page in footer
- Menos proeminente, mas sempre acessível
- Ícone (bandeira ou globo) + código/nome do país

**Posicionamento da cabeçalha (mais comum):**

- Parte superior direita da barra de navegação
- Ícone (bandeira ou globo) + código/nome do país
- Clique abre selecionador de dropdown ou modal

**Modal/popup no primeiro acesso:**

- Detectar localização e sugerir país
- Permita ao usuário confirmar ou alterar

**Confirmar ou alterar**Para confirmar ou alterar, siga os passos abaixo:

1. Verifique se você deseja confirmar ou alterar.
2. Selecione a opção desejada no menu.
3. Clique em "Confirmar" ou "Alterar" para prosseguir.**Exemplo de código**
```python
def confirmar_alterar():
    # Código para confirmar ou alterar
    pass
```

[Veja mais](https://exemplo.com/confirmar-alterar) sobre como confirmar ou alterar.
- Store preference for future visits

### Padrões de Design de Seletores

**Introdução**================

Os padrões de design de seletores são uma coleção de estratégias para selecionar elementos HTML de maneira eficiente e escalável. Eles são fundamentais para a construção de interfaces de usuário responsivas e manuteníveis.**Tipos de Padrões de Design de Seletores**
- ---------------------------------------

### 1. Padrão de Seleção por Nome

O padrão de seleção por nome é uma estratégia simples e eficaz para selecionar elementos HTML. Ele consiste em atribuir um nome único a cada elemento e usar esse nome para selecioná-lo.

```css
/*Exemplo de seleção por nome*/
.elemento-nome {
  background-color: #f2f2f2;
}
```

### 2. Padrão de Seleção por Classe

O padrão de seleção por classe é uma estratégia comum para selecionar elementos HTML. Ele consiste em atribuir uma classe a cada elemento e usar essa classe para selecioná-lo.

```css
/*Exemplo de seleção por classe*/
.elemento-classe {
  background-color: #f2f2f2;
}
```

### 3. Padrão de Seleção por ID

O padrão de seleção por ID é uma estratégia eficaz para selecionar elementos HTML. Ele consiste em atribuir um ID único a cada elemento e usar esse ID para selecioná-lo.

```css
/*Exemplo de seleção por ID*/
#elemento-id {
  background-color: #f2f2f2;
}
```

### 4. Padrão de Seleção por Atributo

O padrão de seleção por atributo é uma estratégia avançada para selecionar elementos HTML. Ele consiste em usar atributos de elementos para selecioná-los.

```css
/*Exemplo de seleção por atributo*/
[atributo="valor"] {
  background-color: #f2f2f2;
}
```

### 5. Padrão de Seleção por Pseudoelemento

O padrão de seleção por pseudoelemento é uma estratégia avançada para selecionar elementos HTML. Ele consiste em usar pseudoelementos para selecionar partes específicas de elementos.

```css
/*Exemplo de seleção por pseudoelemento*/
::after {
  content: "Texto após o elemento";
}
```

**Conclusão**
=============

Os padrões de design de seletores são fundamentais para a construção de interfaces de usuário responsivas e manuteníveis. Ao escolher o padrão de seleção correto, você pode criar código mais eficiente e escalável. Lembre-se de sempre considerar a legibilidade e a manutenibilidade do seu código ao escolher um padrão de seleção.

**Padrão 1: Dropdown (Recomendado)**

Small, compact selector in header. Shows current country flag/name, click to open dropdown with country list.

**Prós:** Não interrompe a navegação, sempre acessível, padrão familiar.

**Pattern 2: Modal on First Visit**

Tela cheia ou modal centralizado na primeira visita. "Selecione seu país para ver preços e frete precisos."

**Prós:**Força a seleção inicial, garante preços precisos desde o início.**Contras:** Pode ser intrusivo, atrasa a navegação.

**Compromisso:** Modal garante a seleção, mas adiciona atrito. Dropdown é menos intrusivo, mas os usuários podem não perceber.

**Padrão 3: Banner Inline**

Banner fixo no topo: "Enviando para os Estados Unidos? Alterar" com link para o seletor.

**Prós:**Lembrete não invasivo, não bloqueia o conteúdo.**Contras:** Ocupa espaço vertical, fácil de ignorar.

### Lista de Exibição de Países

**Search + list:**

- Campo de pesquisa no topo
- Lista alfabética de países abaixo
- Países populares no topo (EUA, Reino Unido, Canadá, etc.)
- Ícones de bandeiras para reconhecimento visual

**Agrupado por região:**

- América do Norte, Europa, Ásia, etc.
- Seções recolhíveis
- Útil para grandes listas (100+ países)

**Formato:**

```
🇺🇸 United States (USD)
🇬🇧 United Kingdom (GBP)
🇨🇦 Canada (CAD)
───────────────────
🇩🇪 Germany (EUR)
🇫🇷 France (EUR)
```

Mostrar bandeira, nome do país e código da moeda para clareza.

## Gerenciamento de Estado

### Armazenando Seleção de País

**Armazenamento do lado do cliente (recomendado):**

- localStorage ou cookies
- Persiste entre sessões
- Chave: `region_id` ou `country_code`

**Por que armazenamento local:**

- Acesso rápido sem chamada de API
- Disponível imediatamente ao carregar a página
- Nenhuma ida e volta ao servidor necessária

### Provedor de Contexto (Context Provider Pattern)

**Recomendado: Crie contexto para dados de região/país.**

Fornece acesso rápido em toda o aplicativo a:

- País selecionado
- Região selecionada (se aplicável)
- Moeda
- Métodos de pagamento disponíveis
- Opções de envio

**Benefícios:**

- Lógica centralizada de país/região
- Acesso fácil de qualquer componente
- Fonte única de verdade
- Consulta simplificada de carrinho e produtos

**Example structure:**

```typescript
interface RegionContext {
  country: string
  region?: string
  currency: string
  changeCountry: (country: string) => void
}
```

### Quando Aplicar a Seleção

**Apply country/region to:**

- Exibição de preço do produto (converter moeda, aplicar preços regionais)
- Criação do carrinho (defina a região para totais precisos)
- Consultas de produto (recuperar preços precisos)
- Fluxo de checkout (métodos de envio, opções de pagamento)
- Exibição de conteúdo (idioma, medições)

## Integração de Backend

### Requisitos Gerais de Backend

**O que o backend precisa fornecer:**

- Lista de países/regiões disponíveis
- Mapeamento de países para regiões (se estiver usando estrutura regional)
- Preços por região ou país
- Disponibilidade de produtos por região
- Métodos de envio por região
- Métodos de pagamento suportados por região

**Considerações sobre API:**

- Buscar lista de países/regiões ao carregar o aplicativo
- Passe o país/região selecionado para consultas de produtos
- Incluir região na criação do carrinho
- Validar seleção de país no backend

### Integração do Backend Medusa

**Para usuários do Medusa, as regiões são fundamentais para a definição precisa de preços.**

Medusa utiliza regiões (não países individuais) para precificação. Uma região pode conter múltiplos países.

**Conceitos-chave:**

- **Região**: Grupo de países com preços compartilhados (ex., "região Europa")
- **País**: País individual dentro de uma região
- **Moeda**: Cada região tem uma moeda

**Mapeamento de país para região:**

1. Cliente seleciona o país (ex.: "Alemanha")
2. Encontre qual região contém aquele país (por exemplo, região "Europa")
3. Armazenar ID da região da loja para operações de carrinho e produto
4. Use região para todas as consultas de preços

**Requerido para:**

- Criando carrinhos: É necessário passar o ID da região
- Retrieving products: Pass region to get accurate prices
- Disponibilidade de produtos: Os produtos podem ser específicos para determinadas regiões

**Padrão de implementação:**
Criar um contexto que armazene tanto o país quanto a região. Quando o país mudar, procurar a região correspondente e atualizar ambos.

**Para implementação detalhada da região Medusa, veja:**

- Documentação das regiões da vitrine do Medusa: <https://docs.medusajs.com/resources/storefront-development/regions/context>
- Pontos de extremidade (endpoints) das regiões do Medusa JS SDK
- Consulte o servidor Medusa MCP para obter detalhes da API em tempo real.

**Outros backends:**  
Verifique a documentação do backend de ecommerce para os padrões de manipulação de país/região.

## Detecção e Padrões Padrão

### Detecção Automática

**Geolocalização baseada em IP (recomendado):**
Detecta o país do usuário pelo endereço IP. Use como padrão, mas permita que o usuário altere.

**Implementação:**

- Use a API ou serviço de geolocalização (MaxMind, ipapi.co, CloudFlare)
- Detecção no servidor (mais precisa)
- Definir como padrão, mostrar confirmação: "Enviar para Estados Unidos?"

**Benefícios:** Reduz o atrito, a maioria dos usuários mantém o país detectado.

**Compromisso:** Não é 100% preciso (VPNs, proxies). Sempre permita a substituição manual.

### Fallback Strategy

**If detection fails or unavailable:**

1. Check localStorage for previous selection
2. Use browser language as hint (`navigator.language`)
3. Default to primary market (e.g., US for US-based store)
4. Solicitar ao usuário que selecione na primeira interação (carrinho, checkout)

**Never block browsing if country unknown.**
Allow browsing with default pricing, prompt selection before checkout.

## Considerações Móveis

**Colocação do seletor:**  
Menu hambúrguer móvel ou na parte inferior da página. Parte superior direita no cabeçalho móvel, se houver espaço disponível.

**Modal selector:**
Full-screen modal on mobile for country selection. Large touch targets (48px), search input at top, easy scrolling.

**Lembrete fixo:**  
Pequeno banner: "Enviando para os EUA? Alterar" com toque para abrir o seletor.

**Prompt de detecção:**
Folha inferior: "Detectamos que você está na Alemanha. Isso está correto?" com botões Confirmar/Alterar.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Country selector visible (header, footer, or first-visit modal)
- [ ] País atual claramente exibido (bandeira, nome, moeda)
- [ ] Dropdown ou modal com lista de países
- [ ] Search functionality for long country lists
- [ ] Países populares no topo da lista
- [ ] Flag icons for visual recognition
- [ ] Mostrar código da moeda por país
- [ ] persistência do localStorage (salvar seleção)
- [ ] Context provider for region/country data
- [ ] Auto-detection based on IP (optional)
- [ ] Substituição manual sempre disponível
- [ ] Apply to product prices (currency, regional pricing)
- [ ] Aplicar à criação do carrinho (definir região)
- [ ] Aplicar ao checkout (envio, métodos de pagamento)
- [ ] Fallback if detection fails
- [ ] Mobile: Modal de tela cheia ou folha inferior
- [ ] Mobile: Grandes alvos de toque (48px)
- [ ] Backend integration (fetch regions, map countries)
- [ ] Para Medusa: Contexto de região com mapeamento de país-para-região
- [ ] Para Medusa: Passe a região para as consultas de carrinho e produto
- [ ] Rótulo ARIA no botão seletor
- [ ] Keyboard accessible (Tab, Enter, arrows)
- [ ] Screen reader announces country changes

**Optional enhancements:**

- [ ] Currency conversion display (show original + converted)
- [ ] Seletor de idioma vinculado ao país
- [ ] Estimativa de envio baseada no país
- [ ] Exibição de estimativa de imposto
- [ ] Conteúdo regional (imagens, mensagens)
- [ ] "Não enviamos para o seu país?" alternativa