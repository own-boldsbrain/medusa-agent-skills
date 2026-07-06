# Recurso de Lista de Desejos

## Conteúdo

- [Visão Geral](#visao-geral)
- [Verificação de Suporte ao Backend](#verificação-de-suporte-ao-backend)
- [Botão de Lista de Desejos](#botao-de-lista-de-desejos)
- [Adicionando e Removendo](#adicionando-e-removendo)
- [Página de Lista de Desejos](#wishlist-page)
- [Convidados vs Usuários Logados](#convidados-vs-usuários-logados)
- [Ícone de Navegação](#ícone-de-navegação)
- [Considerações de Móvel](#considerações-de-móvel)
- [Checklist](#checklist)

## Visão geral

Uma lista de desejos (também chamada de favoritos ou guardar para mais tarde) permite que os clientes salvem produtos nos quais estão interessados para uma compra futura. Esta funcionalidade ajuda a organizar as compras, a rastrear itens desejados e aumenta as visitas de retorno e as conversões.

### Principais Benefícios do Ecommerce

**Por que as listas de desejos importam:**

- Aumente as visitas de retorno (usuários voltam para verificar a lista de desejos)
- Reduza o abandono do carrinho (salvar para mais tarde em vez de abandonar)
- Planejamento de presentes (salve itens para listas de presentes, compartilhe com outros)
- Rastreamento de preços (os usuários monitoram itens para vendas - oportunidade de remarketing)
- Métrica de engajamento (mostra interesse pelo produto para análises)

**Impacto da conversão:**

- Usuários com listas de desejos têm 2-3x maior valor de vida ao longo do tempo
- Conversão da lista de desejos para compra: 20-30% em média
- Lembrete por e-mail sobre itens da lista de desejos: taxa de cliques de 15-25%

## Verificação de Suporte Backend

**CRÍTICO: Implemente apenas a interface de lista de desejos se o backend de comércio eletrônico suportar funcionalidade de lista de desejos.**

Antes de implementar:

1. **Verificar API do backend** - Verificar se os endpoints da lista de desejos existem (ou perguntar ao usuário)
2. **Autenticação** - Confirme se login é necessário para armazenamento da lista de desejos
3. **Operações de teste** - Verifique a funcionalidade de adicionar/excluir/consultar está funcionando corretamente

**Usuários Medusa:**
O núcleo Medusa não inclui lista de desejos por padrão. Instale o plugin Wishlist do repositório de exemplos da Medusa. O plugin fornece funcionalidade completa de lista de desejos com pontos de extremidade da API.

**Backends gerais:**  
A lista de desejos geralmente requer autenticação do usuário. Endpoints da API necessários:

- GET /lista-de-desejos (recupere a lista de desejos do usuário)
- POST /wishlist (adicionar item)
- APAGAR /wishlist/{id} (remover item)

**Se o backend não suporta wishlist:**
Não implemente a feature. wishlist apenas com localStorage cria uma má experiência (perdido ao trocar de dispositivo, sem sincronização, sem remarketing).

## Botão de Desejos

### Design e Estados

**Design e Estados**### Introdução

O design é um processo criativo que visa melhorar a experiência do usuário. Os estados são uma parte importante do design, pois eles descrevem como o aplicativo ou sistema irá se comportar em diferentes situações.

### Tipos de Estados***Estado Normal**: O estado normal é o estado padrão do aplicativo ou sistema, onde o usuário pode realizar suas tarefas diárias

***Estado de Erro**: O estado de erro é um estado que ocorre quando o aplicativo ou sistema encontra um problema, como uma conexão de rede instável ou um erro de banco de dados.
***Estado de Carregamento**: O estado de carregamento é um estado que ocorre quando o aplicativo ou sistema está carregando dados ou realizando uma ação demorada.

### Exemplo de Código

```html
<!-- Exemplo de HTML para um botão de carregamento -->
<button disabled>
  <span class="spinner">
    <i class="fas fa-spinner fa-spin"></i>
  </span>
  Carregando...
</button>
```

### Design de Estados

O design de estados é uma parte importante do design de interfaces de usuário. É importante criar estados visuais atraentes e intuitivos para o usuário.

### Recursos

- [Material Design](https://material.io/design): Um guia de design para criar experiências de usuário atraentes e intuitivas.
- [Sketch](https://www.sketch.com/): Um software de design de interfaces de usuário para criar protótipos e designs de alta qualidade.

### Conclusão

O design e os estados são fundamentais para criar experiências de usuário atraentes e intuitivas. É importante criar estados visuais atraentes e intuitivos para o usuário, e utilizar recursos de design para criar protótipos e designs de alta qualidade.

**Ícone do coração** (símbolo universal):

- Rascunho do coração: Não está na lista de desejos
- Coração preenchido: Na lista de desejos
- 24-32px nos cartões de produto, 32-40px na página do produto

**Cores:**

- **Contorno:** Cinza ou preto
- Preenchido: Vermelho, rosa ou cor da marca
- Contraste alto contra imagem do produto

### Posicionamento

**Cartões de produto:**
Canto superior direito da imagem do produto, sempre visível (não apenas ao passar o mouse), margem de 16px das bordas.

**Página de detalhes do produto:**
Perto do botão "Adicionar ao Carrinho", ou acima da imagem do produto, ou com opções de compartilhamento. Etiqueta de texto opcional: "Adicionar à Lista de Desejos" ou apenas ícone.

## **Adicionando e Removendo**### Adicionando e Removendo

#### Adicionando

Você pode adicionar elementos ao array usando o método `push()`.

```javascript
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // [1, 2, 3, 4]
```

Você também pode usar o método `unshift()` para adicionar elementos no início do array.

```javascript
const arr = [1, 2, 3];
arr.unshift(0);
console.log(arr); // [0, 1, 2, 3]
```

#### Removendo

Você pode remover elementos do array usando o método `pop()`.

```javascript
const arr = [1, 2, 3];
arr.pop();
console.log(arr); // [1, 2]
```

Você também pode usar o método `shift()` para remover elementos do início do array.

```javascript
const arr = [1, 2, 3];
arr.shift();
console.log(arr); // [2, 3]
```

Você pode remover um elemento específico do array usando o método `splice()`.

```javascript
const arr = [1, 2, 3];
arr.splice(1, 1);
console.log(arr); // [1, 3]
```

### Exercícios* Adicione o número 5 ao array `[1, 2, 3]` usando o método `push()`

- Remova o último elemento do array `[1, 2, 3, 4]` usando o método `pop()`.

- Adicione o número 0 ao início do array `[1, 2, 3]` usando o método `unshift()`.
- Remova o primeiro elemento do array `[1, 2, 3]` usando o método `shift()`.

### Adicionar à Lista de Desejos

**Fluxo:**

1. O usuário clica no ícone do coração
2. Mostrar estado de carregamento brevemente
3. Envie solicitação de API para adicionar item
4. Atualize ícone para estado preenchido
5. Mostrar feedback de sucesso (toast: "Adicionado ao wishlist" ou animação suave)
6. Atualizar emblema da lista de desejos de navegação (+1)

**Interface Otimista:**
Atualize o ícone imediatamente, reverter se a API falhar. Fornece feedback instantâneo.

**Error handling:**
Show error toast ("Failed to add to wishlist"), revert icon to outline, allow retry.

**Manipulação de variantes:**
Salve a variante específica (tamanho, cor) se selecionada na página do produto. Nas cartas de produto, salve a variante padrão.

### Removing from Wishlist

**Da página/cartão do produto:**
Clique no coração cheio → muda para contorno → toast: "Removido da lista de desejos" → atualizar distintivo (-1).

**De página de lista de desejos:**
Ícone X na esquina da carta do produto ou botão "Remover" → item desaparece. Opicional: Ação de Desfazer em toast (5 segundos).

**Confirmação:**
Geralmente não é necessário (baixo risco, facilmente reversível). Confirme apenas para ações em massa ("Limpar tudo").

## Página de Lista de Desejos

### Layout

**Heading:**
"My Wishlist" or "Favorites" with item count ("12 items saved").

**Grade de produtos:**
Semelhante à página de listagem de produtos. Cartões de produto com imagens, títulos, preços atuais (podem diferir do momento em que foram adicionados), status de estoque.

**Estado vazio:**
"Sua lista de desejos está vazia" com CTA "Começar a comprar".

### Informações do Cartão de Produto

Exibir por item:

- Imagem do produto (linkada à página do produto)
- Título do produto (linkado)
- Preço atual (pode mostrar o preço promocional, caso esteja em promoção agora)
- Preço original se em promoção (tachado)
- Detalhes da variante (tamanho, cor se salvo)
- Status do estoque: Em estoque (verde), Fora de estoque (vermelho, opção "Avise-me"), Estoque baixo ("Apenas 2 restantes")
- **"Adicionar ao Carrinho" botão** (CRÍTICO - caminho de conversão)
- Remover botão (ícone X)

### Ações e Conversão

**Adicionar ao Carrinho (CRÍTICO):**Botão "Adicionar ao Carrinho" em cada item. Adiciona o item ao carrinho**sem remover da lista de desejos** (o usuário pode querer ambos). Toast de sucesso: "Adicionado ao carrinho". Não navegue para outra página (permaneça na página da lista de desejos).

**Compromisso:**

- **Manter na lista de desejos** (recomendado): Usuário acompanha itens desejados e pode reordená-los facilmente.
- **Adicionar ao carrinho**: Remove da lista de desejos após adicionar - mais simples, mas limita a reordenação

**Manipulação de estoque:**
Se estiver fora de estoque, desabilite "Adicionar ao Carrinho" e mostre a opção "Notifique-me quando voltar ao estoque" (se o backend suportar).

## Hóspede vs Usuários Logados

### Decisão: Requerer Login ou Usar localStorage?

**Exigir login (Recomendado):**

**Por que:**

- Lista de desejos requer armazenamento persistente entre dispositivos
- Ativa lembretes por e-mail e notificações de queda de preços
- Melhor experiência do usuário (nunca perdido)
- Dados mais limpos para análise e remarketing
- Evita confusão de itens perdidos na lista de desejos

**Implementação:**
Clique em lista de desejos → Exibir modal de prompt de login: "Faça login para salvar sua lista de desejos". Incluir botão "Cadastre-se". Benefício claro: "Salve itens em todos os seus dispositivos".

**localStorage approach (Não recomendado):**

- Específico para o dispositivo apenas (perdido ao trocar de dispositivo)
- Perdido se o usuário limpar os dados do navegador
- Sem oportunidades de remarketing
- Não há lembretes por e-mail
- Cria expectativas de UX inadequadas

**Exceção:**
Se o backend não suportar lista de desejos autenticada, considere não implementar o recurso de forma alguma em vez de usar apenas o localStorage.

## Ícone de Navegação

### Colocação e Design

**Posição:**
Barra de navegação superior, entre o ícone de pesquisa e o ícone do carrinho. Ou: No menu suspenso da conta do usuário.

**Ícone:**
Ícone de coração (contorno ou preenchido se os itens estiverem na lista de desejos). Tamanho 24-32px, consistente com o ícone do carrinho.

**Contagem de emblemas:**  
Círculo pequeno com número mostrando o total de itens na lista de desejos. Vermelho ou na cor da marca, posicionado no canto superior direito do ícone de coração.

**Comportamento do link:**
Navega para a página de lista de desejos ao clicar. Menu suspenso menos comum para lista de desejos (diferente do popup do carrinho).

## Considerações Móveis

**Botão de coração:**
Alvo de toque maior (mínimo de 44px), posicionado no canto da imagem do produto, feedback claro ao tocar (escala ou mudança de cor).

**Lista de desejos:**
Grade de produtos em coluna única, empilhar cartões verticalmente, botões "Adicionar ao Carrinho" em largura total, botões grandes de remoção (alvo de toque de 44px).

**Ícone de navegação:**  
Ícone de coração na barra de navegação móvel ou menu hambúrguer, com contador de notificações.

**Prompt de login:**
Se o convidado clicar em lista de desejos, mostre a folha inferior (menos disruptiva que a modal completa) com a mensagem "Faça login para salvar sua lista de desejos".

## Checklist

**Recursos essenciais:**

- [ ] Suporte à API de backend verificado antes da implementação
- [ ] Ícone de coração nos cards de produtos (canto superior direito)
- [ ] Ícone de coração na página de detalhes do produto
- [ ] Estados preenchido vs contorno
- [ ] Toast notification on add/remove
- [ ] Ícone de lista de desejos na navegação com contador de notificação
- [ ] Página de lista de desejos com grade de produtos
- [ ] Informações do produto: imagem, título, preço atual, status de estoque
- [ ] Detalhes da variante se salvos (tamanho, cor)
- [ ] Botão "Adicionar ao carrinho" em cada item da lista de desejos
- [ ] Adicionar ao carrinho sem remover da lista de desejos
- [ ] Botão Remover (ícone X) em cada item
- [ ] Estado vazio da lista de desejos ("Iniciar Compras" CTA)
- [ ] Login necessário para lista de desejos persistente
- [ ] Solicitação de login de usuário convidado ao clicar na lista de desejos
- [ ] Indicadores de status de estoque (em estoque, fora de estoque, estoque baixo)
- [ ] Indisponível: Desabilitar "Adicionar ao carrinho", mostrar "Notificar-me"
- [ ] Mobile: alvos de toque de 44px
- [ ] Mobile: Layout de coluna única
- [ ] UI Otimista (feedback instantâneo)
- [ ] Tratamento de erros para solicitações de API com falha
- [ ] Estados de carregamento durante adição/remoção
- [ ] Botão aria-label ("Adicionar à lista de desejos" / "Remover da lista de desejos")
- [ ] atributo aria-pressed no botão de coração
- [ ] Acessível por teclado (Tab, Enter/Espaço)
- [ ] Anúncios de leitor de tela para adicionar/remover
