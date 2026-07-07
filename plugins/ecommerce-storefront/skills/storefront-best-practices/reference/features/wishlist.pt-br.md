# Recurso de Lista de Desejos

## Conteúdo

- [Visão Geral](#visao-geral)
- [Verificação de Suporte ao Backend](#verificacao-de-suporte-ao-backend)
- [Botão de Lista de Desejos](#botao-de-lista-de-desejos)
- [Adicionando e Removendo](#adicionando-e-removendo)
- [Página de Lista de Desejos](#pagina-de-lista-de-desejos)
- [Usuários Convidados vs Logados](#usuarios-convidados-vs-logados)
- [Ícone de Navegação](#icone-de-navegacao)
- [Considerações para Dispositivos Móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

Uma lista de desejos (também chamada de favoritos ou salvar para mais tarde) permite que os clientes salvem produtos nos quais estão interessados para compra futura. Este recurso ajuda a organizar as compras, monitorar os itens desejados e aumenta as visitas de retorno e as conversões.

### Principais Benefícios de E-commerce

**Por que as listas de desejos são importantes:**

- Aumentam as visitas de retorno (os usuários voltam para verificar a lista de desejos)
- Reduzem o abandono de carrinho (salvar para mais tarde em vez de abandonar)
- Planejamento de presentes (salvar itens para listas de presentes, compartilhar com outras pessoas)
- Monitoramento de preços (os usuários acompanham os itens para promoções - oportunidade de remarketing)
- Métrica de engajamento (mostra o interesse no produto para análise)

**Impacto na conversão:**

- Usuários com listas de desejos têm um valor de vida útil (LTV) 2-3x maior
- Conversão da lista de desejos em compra: 20-30% em média
- Lembretes por e-mail sobre itens da lista de desejos: taxa de cliques de 15-25%

## Verificação de Suporte ao Backend

**CRÍTICO: Implemente a UI da lista de desejos apenas se o backend do seu e-commerce suportar essa funcionalidade.**

Antes de implementar:

1. **Verificar API do backend** - Verifique se os endpoints da lista de desejos existem (ou pergunte ao usuário)
2. **Autenticação** - Confirme se o login é necessário para armazenamento da lista de desejos
3. **Testar operações** - Verifique se a funcionalidade de adicionar/remover/buscar funciona

**Usuários do Medusa:**
O núcleo do Medusa não inclui lista de desejos por padrão. Instale o plugin Wishlist a partir do repositório de exemplos do Medusa. O plugin fornece a funcionalidade completa de lista de desejos com os endpoints da API.

**Backends gerais:**
A lista de desejos normalmente exige a autenticação do usuário. Endpoints de API necessários:

- GET /wishlist (buscar a lista de desejos do usuário)
- POST /wishlist (adicionar item)
- DELETE /wishlist/{id} (remover item)

**Se o backend não suportar a lista de desejos:**
Não implemente o recurso. Uma lista de desejos baseada apenas em localStorage cria uma experiência ruim para o usuário (perdida ao trocar de dispositivo, sem sincronização, sem remarketing).

## Botão de Lista de Desejos

### Design e Estados

**Ícone de coração** (símbolo universal):

- Coração contornado: Não está na lista de desejos
- Coração preenchido: Na lista de desejos
- 24-32px em cards de produto, 32-40px na página do produto

**Cores:**

- Contorno: Cinza ou preto
- Preenchido: Vermelho, rosa ou cor da marca
- Alto contraste com a imagem do produto

### Posicionamento

**Cards de produto:**
Canto superior direito da imagem do produto, sempre visível (não apenas ao passar o mouse), margem de 16px das bordas.

**Página de detalhes do produto:**
Próximo ao botão "Adicionar ao Carrinho", acima da imagem do produto ou junto com as opções de compartilhamento. Rótulo de texto opcional: "Adicionar à Lista de Desejos" ou apenas o ícone.

## Adicionando e Removendo

### Adicionando à Lista de Desejos

**Fluxo:**

1. O usuário clica no ícone de coração
2. Mostrar estado de carregamento rapidamente
3. Enviar solicitação à API para adicionar o item
4. Atualizar o ícone para o estado preenchido
5. Mostrar feedback de sucesso (toast: "Adicionado à lista de desejos" ou animação sutil)
6. Atualizar o badge da lista de desejos na navegação (+1)

**UI Otimista:**
Atualize o ícone imediatamente e reverta se a API falhar. Fornece feedback instantâneo.

**Tratamento de erros:**
Mostrar toast de erro ("Falha ao adicionar à lista de desejos"), reverter o ícone para contornado, permitir nova tentativa.

**Tratamento de variantes:**
Salve a variante específica (tamanho, cor) se selecionada na página do produto. Nos cards de produto, salve a variante padrão.

### Removendo da Lista de Desejos

**No card/página do produto:**
Clicar no coração preenchido → muda para contornado → toast: "Removido da lista de desejos" → atualiza o badge (-1).

**Na página da lista de desejos:**
Ícone X no canto do card do produto ou botão "Remover" → o item desaparece gradualmente. Opcional: Ação de desfazer no toast (5 segundos).

**Confirmação:**
Geralmente não é necessária (baixo risco, facilmente reversível). Confirme apenas para ações em massa ("Limpar tudo").

## Página de Lista de Desejos

### Layout

**Título:**
"Minha Lista de Desejos" ou "Favoritos" com a contagem de itens ("12 itens salvos").

**Grade de produtos:**
Semelhante à página de listagem de produtos. Cards de produto com imagens, títulos, preços atuais (podem diferir de quando foram adicionados) e status do estoque.

**Estado vazio:**
"Sua lista de desejos está vazia" com um CTA "Começar a Comprar".

### Informações do Card de Produto

Exibir por item:

- Imagem do produto (com link para a página do produto)
- Título do produto (com link)
- Preço atual (pode mostrar o preço promocional caso esteja em promoção)
- Preço original, se estiver em promoção (riscado)
- Detalhes da variante (tamanho, cor, se salvo)
- Status do estoque: Em estoque (verde), Fora de estoque (vermelho, opção "Avise-me"), Estoque baixo ("Restam apenas 2")
- **Botão "Adicionar ao Carrinho"** (CRÍTICO - caminho de conversão)
- Botão remover (ícone X)

### Ações e Conversão

**Adicionar ao Carrinho (CRÍTICO):**
Botão "Adicionar ao Carrinho" em cada item. Adiciona o item ao carrinho **sem remover da lista de desejos** (o usuário pode querer ambos). Toast de sucesso: "Adicionado ao carrinho". Não redirecione (permaneça na página da lista de desejos).

**Compensação (Tradeoff):**

- **Manter na lista de desejos** (recomendado): O usuário acompanha os itens desejados e pode recomprar facilmente
- **Mover para o carrinho**: Remove da lista de desejos após adicionar - mais simples, mas limita a recompra

**Tratamento de estoque:**
Se estiver fora de estoque, desative "Adicionar ao Carrinho" e mostre a opção "Notifique-me quando estiver de volta ao estoque" (se o backend suportar).

## Usuários Convidados vs Logados

### Decisão: Exigir Login ou Usar localStorage?

**Exigir login (Recomendado):**

**Por quê:**

- A lista de desejos exige armazenamento persistente em todos os dispositivos
- Possibilita lembretes por e-mail e notificações de queda de preço
- Melhor experiência do usuário (nunca se perde)
- Dados mais limpos para análise e remarketing
- Evita a confusão de itens perdidos na lista de desejos

**Implementação:**
Ao clicar na lista de desejos → Mostrar modal de solicitação de login: "Faça login para salvar sua lista de desejos". Inclua o botão "Cadastre-se". Benefício claro: "Salve itens em todos os seus dispositivos".

**Abordagem localStorage (Não Recomendado):**

- Específico apenas do dispositivo (perdido ao trocar de dispositivo)
- Perdido se o usuário limpar os dados do navegador
- Sem oportunidades de remarketing
- Sem lembretes por e-mail
- Cria expectativas de UX ruins

**Exceção:**
Se o backend não suportar lista de desejos autenticada, considere não implementar o recurso em vez de usar apenas localStorage.

## Ícone de Navegação

### Posicionamento e Design

**Posição:**
Barra de navegação superior, entre o ícone de pesquisa e o ícone do carrinho. Ou: No menu suspenso da conta do usuário.

**Ícone:**
Ícone de coração (contornado ou preenchido se houver itens na lista de desejos). Tamanho de 24-32px, consistente com o ícone do carrinho.

**Contagem no badge:**
Pequeno círculo com um número mostrando o total de itens na lista de desejos. Vermelho ou cor da marca, posicionado no canto superior direito do ícone de coração.

**Comportamento do link:**
Navega para a página da lista de desejos ao ser clicado. Dropdown é menos comum para lista de desejos (diferente do popup do carrinho).

## Considerações para Dispositivos Móveis

**Botão de coração:**
Alvo de toque maior (mínimo de 44px), posicionado no canto da imagem do produto, feedback claro de toque (escala ou mudança de cor).

**Página de lista de desejos:**
Grade de produtos em coluna única, empilhar cartões verticalmente, botões "Adicionar ao Carrinho" ocupando a largura total, botões de remover grandes (alvo de toque de 44px).

**Ícone de navegação:**
Ícone de coração na barra de navegação mobile ou no menu hambúrguer, com contagem no badge.

**Solicitação de login:**
Se um convidado clicar na lista de desejos, exiba um bottom sheet (menos intrusivo que um modal completo) com a mensagem "Faça login para salvar sua lista de desejos".

## Lista de Verificação

**Recursos essenciais:**

- [ ] Suporte à API do backend verificado antes da implementação
- [ ] Ícone de coração nos cards de produto (canto superior direito)
- [ ] Ícone de coração na página de detalhes do produto
- [ ] Estados preenchido vs contornado claros
- [ ] Notificação toast ao adicionar/remover
- [ ] Ícone da lista de desejos na navegação com contagem no badge
- [ ] Página de lista de desejos com grade de produtos
- [ ] Informações do produto: imagem, título, preço atual, status do estoque
- [ ] Detalhes da variante, se salvos (tamanho, cor)
- [ ] Botão "Adicionar ao carrinho" em cada item da lista de desejos
- [ ] Adicionar ao carrinho sem remover da lista de desejos
- [ ] Botão de remover (ícone X) em cada item
- [ ] Estado vazio da lista de desejos (CTA "Começar a Comprar")
- [ ] Login necessário para uma lista de desejos persistente
- [ ] Solicitação de login para usuários convidados ao clicar na lista de desejos
- [ ] Indicadores de status do estoque (em estoque, fora de estoque, estoque baixo)
- [ ] Fora de estoque: Desativar adicionar ao carrinho, exibir "Avise-me"
- [ ] Dispositivos móveis: alvos de toque de 44px
- [ ] Dispositivos móveis: layout de coluna única
- [ ] UI Otimista (feedback instantâneo)
- [ ] Tratamento de erros para solicitações de API falhas
- [ ] Estados de carregamento ao adicionar/remover
- [ ] aria-label nos botões ("Adicionar à lista de desejos" / "Remover da lista de desejos")
- [ ] atributo aria-pressed no botão de coração
- [ ] Acessível via teclado (Tab, Enter/Espaço)
- [ ] Anúncios de leitor de tela ao adicionar/remover
