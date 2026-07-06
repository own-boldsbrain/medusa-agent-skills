# Integração Backend Medusa

## Conteúdo

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração do SDK](#configuração-do-sdk)
- [Configuração do Vite (Projetos TanStack Start, Vite)](#configuração-do-vite-projetos-tanstack-start-vite)
- [Tipos TypeScript](#tipos-typescript)
- [Exibição de Preços](#exibição-de-preços)
- [Organização do SDK](#organização-do-sdk)
- [Padrões Críticos da Medusa](#padrões-críticos-da-medusa)
- [Gerenciamento de Estado da Região](#gerenciamento-de-estado-da-região)

## Visão Geral

Guia para conectar sua loja virtual ao backend da Medusa usando o [Medusa JS SDK](https://docs.medusajs.com/resources/js-sdk).

**Quando usar este guia:**

- Construindo uma loja virtual com backend Medusa.
- Necessidade de integrar o SDK da Medusa corretamente.
- Trabalhando com lojas multi-região.
- Lidar com preços e regiões específicas da Medusa.

**Para padrões gerais de backend**, veja `reference/connecting-to-backend.md`.

## ⚠️ CRÍTICO: Siga o Fluxo de Trabalho de Verificação em 5 Passos

**ANTES de escrever código que chama métodos do SDK Medusa**, siga o fluxo de trabalho obrigatório do SKILL.md:

1. **PAUSE** - Não escreva código ainda.
2. **CONSULTE** o servidor MCP ou a documentação (<https://docs.medusajs.com/resources/js-sdk>) para o método exato.
3. **VERIFIQUE** com o usuário o que você encontrou.
4. **ESCREVA** o código usando o método verificado.
5. **CHECAR** erros de TypeScript - Erros de tipo significam nome de método ou parâmetros incorretos.

**Se você encontrar erros de TypeScript nos métodos do SDK, significa que você usou os métodos incorretos. Volte ao Passo 2 e verifique novamente.**

**Este arquivo mostra PADRÕES (o que fazer), não métodos exatos (como fazer). Sempre verifique os nomes dos métodos com o MCP ou documentação antes de usá-los.**

## 💡 RECOMENDADO: Configurar o Servidor MCP da Medusa

**Se o servidor MCP da Medusa não estiver instalado, recomenda-se fortemente configurá-lo.**

**Instruções de configuração**: adicione o servidor HTTP MCP com a URL <https://docs.medusajs.com/mcp>.

O servidor MCP fornece verificação de métodos em tempo real sem precisar sair do seu IDE.

## Instalação

```bash
npm install @medusajs/js-sdk@latest @medusajs/types@latest
```

Ambos são obrigatórios: O SDK fornece a funcionalidade, os tipos fornecem o suporte ao TypeScript.

## Configuração do SDK

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

**CRÍTICO: Sempre defina a publishableKey.**

- Necessária para que as lojas multi-região obtenham os preços corretos.
- Necessária para acessar produtos com preços regionais.
- Sem ela, as consultas de produtos podem falhar ou retornar preços incorretos.
- Obtenha a chave publicável no painel administrativo da Medusa em Configurações → Chaves de API Publicáveis.

**IMPORTANTE: Configuração da Porta da Loja Virtual**

- **Execute a loja virtual na porta 8000** para evitar erros de CORS.
- A configuração padrão de CORS do backend da Medusa espera a loja virtual em `http://localhost:8000`.
- Se estiver usando uma porta diferente, configure o CORS no backend da Medusa no arquivo `medusa-config.ts`:

  ```typescript
  store_cors: process.env.STORE_CORS || "http://localhost:SUA_PORTA"
  ```

- Padrões comuns de frameworks:
  - Next.js: Porta 3000 (exige configuração de CORS).
  - TanStack Start: Porta 3000 (exige configuração de CORS).
  - Vite: Porta 5173 (exige configuração de CORS).
  - **Recomendado**: Use a porta 8000 para evitar alterações de configuração.

## Configuração do Vite (Projetos TanStack Start, Vite)

**IMPORTANTE: Para projetos baseados em Vite, configure as dependências externas de SSR.**

Adicione isso ao seu `vite.config.ts`:

```typescript
export default defineConfig({
  // ... outras configurações
  ssr: {
    noExternal: ['@medusajs/js-sdk'],
  },
})
```

**Por que isso é necessário:**

- O SDK JS da Medusa deve ser processado pelo Vite durante o SSR.
- Sem esta configuração, as chamadas do SDK falharão durante a renderização do lado do servidor.
- Aplica-se ao TanStack Start, Vite puro e outros frameworks baseados em Vite.

## Tipos TypeScript

**IMPORTANTE: Sempre use `@medusajs/types` - nunca defina tipos personalizados.**

```typescript
import type {
  StoreProduct,
  StoreCart,
  StoreCartLineItem,
  StoreRegion,
  StoreProductCategory,
  StoreCustomer,
  StoreOrder
} from "@medusajs/types"
```

**Por que usar tipos oficiais:**

- Definições de tipo completas e precisas.
- Atualizadas a cada lançamento da Medusa.
- Incluem todos os relacionamentos e campos das entidades.
- Previnem inconsistências de tipo nas respostas da API.

## Exibição de Preços

**CRÍTICO: Os preços da Medusa são armazenados como valores de exibição reais - NÃO divida por 100.**

Diferente do Stripe (onde os valores estão em centavos), a Medusa armazena os preços diretamente em seus valores de exibição.

```typescript
// ❌ ERRADO - Dividindo por 100
<div>${product.variants[0].prices[0].amount / 100}</div>

// ✅ CORRETO - Exibindo como está
<div>${product.variants[0].prices[0].amount}</div>
```

**Formatação correta de preços:**

```typescript
const formatPrice = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}
```

**Campos de preço que devem ser usados:**

- `variant.calculated_price.calculated_amount` - Preço final incluindo promoções.
- `variant.calculated_price.original_amount` - Preço original antes dos descontos.
- Ambos já estão no formato final de exibição - nenhuma conversão matemática é necessária.

## Organização do SDK

O SDK da Medusa é organizado por recursos:

- `sdk.store.product.*` - Operações de produtos.
- `sdk.store.cart.*` - Operações de carrinho.
- `sdk.store.category.*` - Operações de categoria.
- `sdk.store.customer.*` - Operações de cliente (autenticado).
- `sdk.store.order.*` - Operações de pedidos (autenticado).
- `sdk.store.payment.*` - Operações de pagamento.
- `sdk.store.fulfillment.*` - Operações de frete/entrega.
- `sdk.store.region.*` - Operações de região.

**Para encontrar métodos específicos**: Consulte a documentação (<https://docs.medusajs.com/resources/js-sdk>) ou use o servidor MCP.

## Padrões Críticos da Medusa

**IMPORTANTE**: Os padrões abaixo mostram O QUE fazer, não o EXATAMENTE COMO fazer. Sempre verifique os nomes e assinaturas dos métodos no servidor MCP ou na documentação antes de aplicá-los.

### 1. Sempre Passe `region_id` Para Produtos

**Padrão**: Consultas de produtos exigem o parâmetro `region_id` para retornar o preço correto.

**Por quê:** Sem o `region_id`, o `calculated_price` estará ausente ou incorreto.

**Para implementar**: Consulte o MCP/documentação para os métodos de listagem e recuperação de produtos. Passe `region_id: selectedRegion.id` como parâmetro.

### 2. Padrão de Atualização do Carrinho

**Padrão**: Itens de linha possuem métodos dedicados (criar, atualizar, excluir). Outras propriedades do carrinho utilizam um método de atualização genérico.

**Operações de item de linha** (verifique os nomes exatos dos métodos com MCP/documentação):

- Adicionar item ao carrinho.
- Atualizar quantidade do item.
- Remover o item do carrinho.

**Outras atualizações do carrinho** (e-mail, endereços, região, cupons promocionais):

- Use o método de atualização genérico do carrinho.

**Para implementar**: Consulte o servidor MCP ou a documentação para as assinaturas exatas dos métodos do carrinho:  
<https://docs.medusajs.com/resources/references/js-sdk/store/cart>

### 3. Padrão do Fluxo de Pagamento

**Fluxo de trabalho de alto nível:**

1. Consultar os provedores de pagamento disponíveis para a região do carrinho.
2. Usuário seleciona o método de pagamento.
3. Inicializar sessão de pagamento para o provedor selecionado.
4. Renderizar a interface específica do provedor (Stripe Elements, etc.).
5. Concluir o pagamento através do provedor.

**Para implementar**: Consulte o MCP/documentação para:

- Método de listagem de provedores de pagamento.
- Método de inicialização da sessão de pagamento.
- Método de conclusão do pagamento.

**Recursos**:

- Servidor MCP (se configurado).
- Documentação de pagamentos da Medusa: <https://docs.medusajs.com/resources/references/js-sdk/store/payment>
- `reference/layouts/checkout.md` para o fluxo geral da finalização de compra.

### 4. Padrão do Fluxo de Finalização de Compra (Checkout)

**Fluxo de trabalho de alto nível:**

1. Coletar endereço de entrega.
2. Consultar as opções de frete disponíveis para o carrinho.
3. Usuário seleciona o método de envio.
4. Coletar informações de pagamento.
5. Inicializar a sessão de pagamento.
6. Concluir/criar o pedido.

**Para implementar**: Consulte o MCP/documentação para os métodos de cada etapa. Nunca adivinhe ou invente nomes de métodos.

### 5. Busca de Categorias

**Padrão**: Buscar categorias usando o recurso `sdk.store.category.*`.

**Para implementar**: Consulte o MCP/documentação para o método de listagem de categorias. Veja `reference/components/navbar.md` para padrões de utilização.

## Gerenciamento de Estado da Região

**CRÍTICO para a Medusa**: A região determina a moeda base, os preços calculados, os impostos cobrados e os produtos que estão disponíveis.

### Por Que o Contexto de Região Importa

A Medusa requer o uso explícito de região para:

- Criar carrinhos (é obrigatório passar o `region_id`).
- Recuperar os preços localizados corretos dos produtos.
- Determinar os cálculos base de moeda e taxas.
- Filtrar métodos de pagamento e opções de frete disponíveis.

### Abordagem de Implementação

**Fluxo de trabalho de alto nível:**

1. Buscar regiões disponíveis no carregamento do aplicativo (consulte MCP/documentação para o método de listagem de regiões).
2. Detectar o país do usuário (via IP, localização do navegador ou seleção manual).
3. Encontrar a região correta que contém o país detectado.
4. Armazenar a região selecionada no estado global (React Context, Zustand, etc.).
5. Usar `selectedRegion.id` em absolutamente todas as operações de produtos e carrinhos.

**Quando o usuário altera seu país (Seletor de País):**

- Encontrar a nova região que atende ao novo país selecionado.
- Atualizar o carrinho informando o novo `region_id` (consulte o MCP/documentação para o método de atualização de carrinho).
- Salvar a nova seleção no `localStorage` para persistir entre as sessões.

**Para implementar**: Consulte o servidor MCP ou a documentação para os métodos exatos de regiões e carrinho. Jamais copie códigos de exemplo sem verificar suas assinaturas antes.

**Para uma implementação mais detalhada sobre regiões (incluindo exemplos e contexto global)**, veja:

- `reference/components/country-selector.md`
- Servidor MCP da Medusa (se configurado).
- Documentação de contexto regional: <https://docs.medusajs.com/resources/storefront-development/regions/context>

## Tratamento de Erros

O SDK lança um erro do tipo `FetchError` com:

- `status`: Código de status HTTP da requisição falha.
- `statusText`: Descrição curta ou código do erro.
- `message`: Mensagem descritiva detalhada.

```typescript
try {
  const data = await sdk.store.customer.retrieve()
} catch (error) {
  const fetchError = error as FetchError
  if (fetchError.statusText === "Unauthorized") {
    redirect('/login')
  }
}
```

## Endpoints Personalizados

Para acessar rotas de API não cobertas nativamente pelo SDK:

```typescript
const data = await sdk.client.fetch(`/custom/endpoint`, {
  method: "POST",
  body: { /* ... */ },
})
```

## Recursos

- **Documentação do SDK JS da Medusa**: <https://docs.medusajs.com/resources/js-sdk>
- **Desenvolvimento da Loja Virtual**: <https://docs.medusajs.com/resources/storefront-development>
- **Fluxo de Checkout**: <https://docs.medusajs.com/resources/storefront-development/checkout>
- **Contexto de Região**: <https://docs.medusajs.com/resources/storefront-development/regions/context>
- **Servidor MCP da Medusa**: Utilize se estiver disponível para verificação técnica em tempo real.
