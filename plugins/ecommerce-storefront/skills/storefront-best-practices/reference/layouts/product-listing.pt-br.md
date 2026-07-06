# Layout da página de listagem de produtos

## Índice

- [Visão geral](#visao-geral)
  - [Arquitetura de Componentes Reutilizáveis](#decisao-selecao-do-padrao-de-filtro)
- [Decisão: Paginação x Rolagem Infinita x Carregar Mais](#decisao-paginacao-x-rolagem-infinita-x-carregar-mais)
- [Decisão: Seleção do padrão de filtro](#decisao-selecao-do-padrao-de-filtro)
- [Layout em grade de produtos](#layout-da-grade-de-produtos)
- [Estratégia de filtragem](#estrategia-de-filtragem)
- [Estratégia de classificação](#estrategia-de-classificacao)
- [Integração com o backend](#integracao-com-o-backend)
- [Estados de tela vazia e sem resultados](#estados-de-categoria-vazia-e-sem-resultados)
- [Otimização de desempenho](#otimizacao-de-desempenho)
- [Otimização para dispositivos móveis](#otimizacao-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

Interface principal de navegação, na qual os usuários comparam produtos, aplicam filtros e acessam os detalhes dos produtos. É fundamental para a descoberta de produtos e a conversão.

### Requisitos principais

- Grelha de produtos responsiva (3-4 colunas no desktop, 2 no celular)
- Filtragem (categorias, preço, atributos)
- Opções de classificação (preço, popularidade, mais recentes)
- Paginação, rolagem infinita ou “carregar mais”
- Indicadores de número de resultados e de filtro ativo
- Estado claro de “nenhum resultado” com sugestões
- Carregamento e filtragem rápidos (atualizações de filtro em menos de 1 s)
- Integração com o backend para filtragem dinâmica

### Arquitetura de componentes reutilizáveis (RECOMENDADO)

**Crie a lista de produtos como um componente reutilizável que funcione em várias páginas:**

✅ **Use o mesmo componente de listagem de produtos para:**

- Página “Ver tudo” (todos os produtos, sem filtro de categoria)
- Páginas de categoria (filtradas por categoria específica)
- Página de resultados de pesquisa (filtrada por consulta de pesquisa)
- Páginas de promoções (filtradas por desconto/promoção)
- Páginas de coleções (conjuntos de produtos selecionados)
- Páginas de marcas (filtradas por marca)

**Benefícios da abordagem reutilizável:**

- Fonte única de informação para a interface de navegação de produtos
- Comportamento consistente de filtragem, ordenação e paginação em todo o site
- Manutenção mais fácil (corrija bugs uma vez, a correção se aplica a todos os lugares)
- Melhor experiência do usuário (interface familiar em todas as páginas de navegação de produtos)
- Redução significativa da duplicação de código

**O que tornar configurável:**

- Parâmetros iniciais de filtro (ID da categoria, consulta de busca, ID da promoção, marca, etc.)
- Título da página e trilha de navegação
- Exibição ou não da barra lateral de filtros (algumas páginas podem ocultar determinados filtros)
- Ordem de classificação padrão (categoria: em destaque; pesquisa: relevância; promoção: % de desconto)
- Número de produtos por página
- Opções de filtro disponíveis (ocultar filtro de categoria nas páginas de categoria, etc.)

**Erro comum:**

- ❌ Criar componentes/páginas separadas para “Ver tudo”, páginas de categorias e resultados de pesquisa com lógica duplicada de filtragem/classificação/paginação
- ✅ Criar um único componente ProductListing reutilizável que aceite parâmetros de filtro e reutilizá-lo em todas as páginas de navegação de produtos

### Padrão de roteamento

**CRÍTICO: Sempre use rotas dinâmicas para páginas de categoria, NUNCA páginas estáticas.**

As páginas de categoria/listagem devem usar rotas dinâmicas que aceitem um parâmetro (handle, slug ou ID da categoria):

**Exemplos corretos:**

- Roteador de aplicativos do Next.js: `app/categories/[handle]/page.tsx`
- Roteador de páginas do Next.js: `pages/categories/[handle].tsx`
- SvelteKit: `routes/categories/[handle]/+page.svelte`
- TanStack Start: `routes/categories/$handle.tsx`
- Remix: `routes/categories.$handle.tsx`

**Exemplos incorretos:**

- ❌ `pages/categories/women.tsx` (arquivo estático por categoria)
- ❌ `pages/categories/men.tsx` (não é escalável)

Busque os produtos da categoria na rota dinâmica com base no parâmetro handle/ID da URL.

## Decisão: Paginação x Rolagem Infinita x Carregar Mais

Essa é uma decisão crucial no comércio eletrônico que afeta a experiência do usuário, o SEO e a implementação técnica.

### Quando usar a paginação

**Necessidades do usuário:**

- Retornar a páginas de resultados específicas
- Controle preciso sobre a navegação
- Compras profissionais/de pesquisa (comparação sistemática)
- Compradores B2B (aquisição, pedidos de grande porte)

**Características do produto:**

- A posição é importante (classificações, mais vendidos)
- Catálogo extenso com ordem estável
- Produtos que exigem comparação cuidadosa

**Benefícios técnicos:**

- Otimizado para SEO (URL exclusiva por página)
- Melhor para indexação e rastreamento
- Suporte mais fácil ao botão “Voltar”
- Menor uso de memória

**Implementação:**

```typescript
// URL structure: /products?page=2&category=shirts
// Each page has unique URL for SEO
```

**Ideal para:**

- Público que usa principalmente computadores
- Comércio eletrônico B2B
- Comparativo de produtos
- Catálogo com mais de 100 produtos

### Quando usar a rolagem infinita

**Necessidades do usuário:**

- Navegação exploratória
- Experiência com prioridade para dispositivos móveis
- Fluxo de descoberta contínuo
- Compras de moda/visuais

**Características do produto:**

- Produtos com forte apelo visual (moda, arte, fotografia)
- Compras por impulso
- Focado na descoberta (no estilo do Pinterest)

**Considerações técnicas:**

- Mais complexo de implementar
- Requer um tratamento cuidadoso de SEO (as URLs de paginação ainda são necessárias)
- Maior uso de memória (todos os produtos carregados permanecem no DOM)
- É preciso lidar com cuidado com o botão “Voltar” do navegador

**Implementação:**

```typescript
// Load more when user scrolls to bottom
// Keep pagination in URL for SEO: /products?page=2
// Use Intersection Observer API for detection
```

**Ideal para:**

- Lojas com prioridade para dispositivos móveis (mais de 60% do tráfego proveniente de dispositivos móveis)
- Moda, decoração e produtos visuais
- Público mais jovem (18 a 34 anos)
- Compras com foco na descoberta

### Quando usar o botão “Carregar mais”

**Vantagens dessa abordagem:**

- O usuário controla quando carregar (não é automático)
- O rodapé permanece acessível (importante para políticas e contato)
- Melhor para conexões mais lentas (usuários internacionais)
- Acessível (sem carregamento automático)
- Menor uso de memória do que a rolagem infinita

**Implementação:**

```typescript
// Button triggers next page load
// Append products to existing grid
// Show count: "Load 24 More Products"
```

**Ideal para:**

- Público internacional (velocidades de conexão variadas)
- Conteúdo do rodapé é importante (informações legais, políticas, contato)
- Questões de acessibilidade relacionadas à rolagem infinita
- Equilíbrio entre paginação e rolagem infinita

### Abordagem híbrida (recomendada)

Combine padrões com base no contexto:

- Paginação para SEO (URLs canônicas)
- Rolagem infinita para a experiência do usuário (mediante interação do usuário)
- “Carregar mais” para controle (acionado pelo usuário)

**Exemplo:**

```typescript
// Desktop: Pagination at bottom + infinite scroll option
// Mobile: Infinite scroll with pagination URLs for SEO
// All: Preserve scroll position on back button
```

## Decisão: Seleção do padrão de filtro

### Filtros na barra lateral (desktop)

**Quando usar:**

- Muitas opções de filtro (5 ou mais categorias)
- Atributos complexos dos produtos
- Usuários avançados (B2B, compradores profissionais)
- Tráfego predominantemente em desktop

**Layout:**

- Barra lateral à esquerda (250-320 px de largura)
- Posição fixa (rola junto com a página)
- Seções recolhíveis (acordeão)
- Aplicação imediata (sem botão “Aplicar”)

### Filtros na parte superior (desktop)

**Quando usar:**

- Poucas opções de filtro (2 a 4 filtros principais)
- Maximizar o espaço da grade (layout em largura total)
- Categorias de produtos simples
- Produtos com foco visual (moda)

**Layout:**

- Barra de filtro horizontal acima da grade
- Menus suspensos ou botões de alternância
- Opções limitadas (preço, categoria, marca)
- Design compacto

### Filtros em gaveta (Dispositivos móveis – Sempre)

**Padrão:**

- Botão “Filtros” na parte superior (exibe um selo com a contagem ativa)
- Gaveta deslizante (tela cheia ou 80% da largura)
- Seções em acordeão
- Botão “Aplicar” na parte inferior (filtragem em lote)
- Opção “Limpar tudo”

**Por que usar filtragem em lote no celular:**

- Evita múltiplas atualizações de renderização em conexões lentas
- O usuário pode ajustar vários filtros antes de aplicar
- Melhor experiência do usuário no celular (menos intrusiva)

## Layout da grade de produtos

**Colunas responsivas:**

- Desktop grande (>1440px): 4 colunas
- Desktop (1024-1440px): 3-4 colunas
- Tablet (768-1024px): 3 colunas
- Celular (< 768px): 2 colunas

**Ajuste com base no tipo de produto:**

- Moda/estilo de vida: 3 a 4 colunas (maior visibilidade de itens ao mesmo tempo)
- Eletrônicos/detalhados: 2 a 3 colunas (cartões maiores, mais detalhes)
- Móveis/itens grandes: 2 a 3 colunas (destacando detalhes)

**Elementos essenciais do cartão de produto:**

- Imagem do produto (principal)
- Título (truncado para 2 linhas)
- Preço (Medusa: exibir como está, não dividir por 100)
- Opcional: Avaliação, selos, lista de desejos
- Consulte product-card.md para obter orientações detalhadas

**Espaçamento da grade:**

- Espaço de 16-24px (desktop)
- Espaço de 12 a 16 px (dispositivos móveis)
- Linhas com altura igual (opcional, melhora a consistência visual)

## Estratégia de filtragem

### Tipos de filtro por finalidade

**Filtros de categoria:**

- Caixas de seleção com seleção múltipla
- Hierárquicos (categorias pai-filho)
- Exibir a quantidade de produtos por categoria
- Exemplo: “Camisas (24)”, “Camisetas (12)”

**Filtro de faixa de preço:**

- Controle deslizante de faixa (arraste para definir mínimo/máximo)
- Ou: Faixas predefinidas (“$0-$50”, “$50-$100”)
- Atualização dinâmica conforme os produtos são filtrados
- Exibir mínimo/máximo com base nos resultados atuais

**Filtros de atributos (Tamanho, Cor, Marca):**

- Caixas de seleção múltiplas
- Amostras visuais para cores
- Exibir opções disponíveis com base nos filtros atuais
- Desativar combinações indisponíveis

**Filtros de disponibilidade:**

- Caixa de seleção “Em estoque”
- Caixa de seleção “Em promoção”
- Caixa de seleção “Novidades”
- Finalidade única, valor claro

### Comportamento do filtro

**Persistência dos filtros:**

- Salvar nos parâmetros da URL (compartilháveis, podem ser adicionados aos favoritos)
- Exemplo: `/products?category=shirts&price=0-50&color=blue`
- Restaurar os filtros ao recarregar a página
- Limpar todos os filtros deve reiniciar a URL

### Exibição dos filtros ativos

**Mostrar filtros ativos:**

- Acima da grade de produtos
- Formato de pastilha/etiqueta: “Azul ✕” “Menos de US$ 50 ✕”
- Clique no X para remover um filtro específico
- Link “Limpar tudo” para remover todos os filtros
- Contagem: “3 filtros ativos”

## Estratégia de classificação

### Opções comuns de classificação

**Opções essenciais:**

- **Em destaque** (padrão): Seleção recomendada pela loja (mais vendidos, em promoção)
- **Preço: do menor para o maior**: Consumidores preocupados com o orçamento
- **Preço: do maior para o menor**: Quem busca produtos premium
- **Mais recentes**: Moda, tecnologia, produtos com validade limitada
- **Mais vendidos**: Prova social, escolhas populares
- **Mais bem avaliados**: Consumidores focados na qualidade

**Opções avançadas:**

- Nome: A-Z (alfabético)
- Desconto: Maior % de desconto (caçadores de promoções)
- Avaliações: Mais avaliados (quem busca validação)

### Implementação da classificação

**Exibição:**

- Menu suspenso acima da grade de produtos (alinhado à direita)
- Rótulo: “Ordenar por:” ou apenas o menu suspenso
- Atualizar os produtos imediatamente após a seleção
- Mostrar a ordem atual na URL: `/products?order=-created_at`

**Integração com o backend:**

- Passar o parâmetro de ordenação para a API (verifique a documentação do backend para saber o nome do parâmetro)
- Parâmetros comuns: `order`, `sort`, `sort_by`
- Valores comuns: `-created_at` (descendente), `+price` (ascendente), `-price` (descendente)

**Preservar filtros:**

- A ordenação não limpa os filtros
- Mantém todos os filtros ativos
- Atualiza a URL com o parâmetro de ordenação

## Integração com o backend

### Busca de produtos

**Parâmetros de consulta a serem incluídos:**

- Filtro de categoria/coleção (se aplicável)
- Paginação (limite, deslocamento ou cursor)
- Ordem de classificação
- Valores de filtro (preço, atributos, etc.)
- Para o Medusa: `region_id` (obrigatório para a definição correta de preços)

Consulte a documentação da API do backend para obter os nomes e formatos exatos dos parâmetros.

### Filtros disponíveis

**Atualizações dinâmicas de filtros:**

- Mostrar apenas filtros relevantes para a categoria atual
- Exibir a contagem de produtos por opção de filtro
- Desativar visualmente as opções com 0 produtos
- Atualizar as opções disponíveis quando os filtros forem alterados

### Gerenciamento do estado da URL

**Padrão da estrutura da URL do filtro:**
`/products?category_id=123&order=-created_at&page=2&price=0-50`

**Benefícios:**

- Links compartilháveis
- Pesquisas que podem ser adicionadas aos favoritos
- Os botões “Voltar” e “Avançar” do navegador funcionam corretamente
- Otimizado para SEO (combinações de filtros rastreáveis)

**Abordagem de implementação:**

- Ler os filtros a partir dos parâmetros de consulta da URL ao carregar a página
- Atualizar a URL quando os filtros forem alterados usando URLSearchParams e history.pushState
- Analisar os parâmetros da URL para reconstruir o estado dos filtros

## Estados de categoria vazia e sem resultados

### Sem produtos na categoria

**Quando a categoria estiver vazia:**

- Mensagem: “Ainda não há produtos disponíveis”
- Subtexto: “Volte em breve para conferir as novidades”
- CTA: “Ver todos os produtos” ou “Ir para a página inicial”
- Alternativa: Mostrar categorias relacionadas
- Opcional: Inscrição na newsletter para receber notificações

### Sem resultados com os filtros

**Quando os filtros são muito restritivos:**

- Mensagem: “Nenhum produto corresponde aos seus filtros”
- Subtexto: “Tente remover alguns filtros ou ajustar seus critérios”
- **Botão “Limpar todos os filtros” em destaque**
- Mostrar quais filtros podem ser muito restritivos
- Sugestões: “Tente ampliar a faixa de preço” ou “Remova o filtro de marca”

**Exemplo:**

```
No products found

You filtered by:
- Color: Blue
- Size: XXL
- Price: $0-$20

Try:
• Removing size filter (only 2 XXL products)
• Expanding price range
• [Clear All Filters]
```

### Nenhuma resultado na pesquisa

**Quando a consulta de pesquisa não retorna nenhum resultado:**

- Mensagem: “Nenhum resultado para ‘[consulta]’”
- Sugestões: Verifique a ortografia, tente palavras-chave diferentes
- CTA: Navegue pelas categorias populares
- Mostrar sugestões de pesquisa (consultas semelhantes)
- Exibir produtos populares ou em alta

## Otimização de desempenho

### Carregamento diferido de imagens

**Implementação:**

- Carregar imagens à medida que elas entram na área visível
- Usar a API Intersection Observer
- Exibir um espaço reservado ou efeito de desfoque progressivo
- Melhora significativamente o carregamento inicial da página

**Fundamental para o comércio eletrônico:**

- As listas de produtos têm de 24 a mais de 100 imagens por página
- O carregamento diferido reduz o carregamento inicial em 60 a 80%
- Desempenho percebido mais rápido

### Rolagem virtual (avançado)

**Quando usar:**

- Catálogos muito grandes (mais de 500 produtos visíveis)
- Rolagem infinita com preocupações relacionadas à memória
- Problemas de desempenho com muitos elementos DOM

**Como funciona:**

- Renderiza apenas os produtos visíveis + buffer
- Reutiliza elementos DOM à medida que o usuário rola a página
- Mantém a posição de rolagem
- Bibliotecas: react-window, react-virtuoso

**Compromisso:**

- Implementação complexa
- Melhor desempenho para listas grandes
- Necessário para catálogos com mais de 1.000 produtos carregados

### Desempenho do filtro

**IU otimista:**

- Atualiza a grade imediatamente (resultados previstos)
- Exibir brevemente a sobreposição de carregamento
- Substituir pelos resultados reais
- Melhor percepção de desempenho

## Otimização para dispositivos móveis

**Padrões essenciais para dispositivos móveis:**

**Grade de 2 colunas:**

- No máximo 2 produtos por linha
- Áreas de toque maiores
- Cartões simplificados (apenas informações essenciais)
- Remover efeitos de hover

**Gaveta de filtros:**

- Gaveta em tela cheia ou com 80% da largura
- Botão “Filtros” com contador de itens
- Aplicação em lote (não recarregar a cada alteração)
- Limpar tudo na parte superior

**Barra fixa de filtros/ordenação:**

- Fixada na parte superior durante a rolagem
- Acesso rápido a filtros e ordenação
- Mostra o número de filtros ativos
- Maiores taxas de engajamento

**Rolagem infinita por padrão:**

- Melhor experiência do usuário (UX) em dispositivos móveis do que a paginação
- Comportamento natural de rolagem
- Manter as URLs de paginação para SEO
- Lidar corretamente com o botão “Voltar”

**Desempenho:**

- Carregamento diferido de imagens (fundamental em dispositivos móveis)
- Limitar o número inicial de produtos (12-24)
- Otimizar os tamanhos das imagens para dispositivos móveis
- Atualizações rápidas dos filtros (<1 s)

## Lista de verificação

**Recursos essenciais da lista de produtos:**

- [ ] **RECOMENDADO: Lista de produtos criada como componente reutilizável**
- [ ] O componente reutilizável funciona para: “ver todos os produtos”, páginas de categorias, resultados de pesquisa, páginas de promoções
- [ ] O componente aceita parâmetros de filtro (categoryId, searchQuery, promotionId, etc.)
- [ ] Grade responsiva (3-4 colunas no desktop, 2 no celular)
- [ ] Decisão tomada: paginação x rolagem infinita x carregar mais
- [ ] Padrão de filtro selecionado: barra lateral (desktop) x gaveta (dispositivos móveis)
- [ ] Filtros buscados dinamicamente do backend
- [ ] Opções de filtro exibem a quantidade de produtos
- [ ] Filtros ativos exibidos acima da grade (caixas removíveis)
- [ ] Botão “Limpar todos os filtros” em destaque
- [ ] Opções de classificação (destaque, preço, mais recentes, mais vendidos)
- [ ] Ordenar atualizações de produtos sem limpar os filtros
- [ ] Os filtros e a ordenação permanecem na URL (compartilhável)
- [ ] Contagem de resultados exibida (“Mostrando 1-24 de 156 produtos”)
- [ ] Estado vazio: “Nenhum produto corresponde aos filtros” com sugestões
- [ ] “Limpar todos os filtros” em destaque quando não há resultados
- [ ] Preços dos produtos exibidos corretamente (Medusa: como estão, sem divisão)
- [ ] Carregamento diferido para imagens (Intersection Observer)
- [ ] Estado de carregamento para alterações nos filtros (< 1 s)
- [ ] Celular: menu de filtros com aplicação em lote
- [ ] Celular: grade de no máximo 2 colunas
- [ ] Celular: botão fixo de filtro/ordenação
- [ ] URLs de paginação para SEO (mesmo com rolagem infinita)
- [ ] Suporte ao botão “Voltar” (restauração de filtros e posição de rolagem)
- [ ] Acessível por teclado (navegação pelos filtros com a tecla Tab, aplicação com a tecla Enter)
- [ ] Rótulos ARIA nos filtros (role="group", aria-label)
