# Recurso “Lista de Desejos”

## Índice

- [Visão geral](#visao-geral)
- [Verificação de compatibilidade com o backend](#verificacao-de-compatibilidade-do-backend)
- [Botão “Lista de Desejos”](#botao-da-lista-de-desejos)
- [Adicionar e remover](#adicionar-e-remover)
- [Página da Lista de Desejos](#pagina-da-lista-de-desejos)
- [Usuários convidados x usuários conectados](#usuarios-convidados-x-usuarios-conectados)
- [Ícone de navegação](#icone-de-navegacao)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

Uma lista de desejos (também chamada de favoritos ou “salvar para mais tarde”) permite que os clientes salvem produtos nos quais estão interessados para compra futura. Esse recurso ajuda a organizar as compras, acompanhar os itens desejados e aumenta as visitas recorrentes e as conversões.

### Principais benefícios do comércio eletrônico

**Por que as listas de desejos são importantes:**

- Aumentam as visitas recorrentes (os usuários voltam para conferir a lista de desejos)
- Reduzem o abandono de carrinho (guardam para mais tarde em vez de abandonar)
- Planejamento de presentes (guardam itens para listas de presentes, compartilham com outras pessoas)
- Acompanhamento de preços (os usuários monitoram itens em promoção — oportunidade de remarketing)
- Métrica de engajamento (mostra o interesse pelo produto para fins de análise)

**Impacto na conversão:**

- Usuários com listas de desejos têm um valor de vida útil 2 a 3 vezes maior
- Conversão da lista de desejos em compra: 20 a 30% em média
- Lembretes por e-mail sobre itens da lista de desejos: taxa de cliques de 15 a 25%

## Verificação de compatibilidade do backend

**CRÍTICO: Implemente a interface da lista de desejos somente se o backend do seu e-commerce for compatível com essa funcionalidade.**

Antes da implementação:

1. **Verifique a API do backend**

- Confirme se os endpoints da lista de desejos existem (ou pergunte ao usuário)

1. **Autenticação** — Confirme se é necessário fazer login para salvar itens na lista de desejos
2. **Teste as operações** — Verifique se as funcionalidades de adicionar/remover/buscar funcionam

**Usuários do Medusa:**
O núcleo do Medusa não inclui a lista de desejos por padrão. Instale o plugin Wishlist a partir do repositório de exemplos do Medusa. O plugin oferece funcionalidade completa de lista de desejos com endpoints de API.

**Back-ends gerais:**
A lista de desejos normalmente requer autenticação do usuário. Endpoints de API necessários:

- GET /wishlist (buscar a lista de desejos do usuário)
- POST /wishlist (adicionar item)
- DELETE /wishlist/{id} (remover item)

**Se o backend não suportar a lista de desejos:**
Não implemente o recurso. Uma lista de desejos baseada apenas no localStorage prejudica a experiência do usuário (perda ao trocar de dispositivo, sem sincronização, sem remarketing).

## Botão da lista de desejos

### Design e estados

**Ícone de coração** (símbolo universal):

- Coração com contorno: Não está na lista de desejos
- Coração preenchido: Está na lista de desejos
- 24-32px nos cartões de produto, 32-40px na página do produto

**Cores:**

- Contorno: cinza ou preto
- Preenchimento: vermelho, rosa ou cor da marca
- Alto contraste em relação à imagem do produto

### Posicionamento

**Cartões de produto:**
Canto superior direito da imagem do produto, sempre visível (não apenas ao passar o mouse), com margem de 16px das bordas.

**Página de detalhes do produto:**
Próximo ao botão “Adicionar ao carrinho”, ou acima da imagem do produto, ou junto às opções de compartilhamento. Rótulo de texto opcional: “Adicionar à lista de desejos” ou apenas ícone.

## Adicionar e remover

### Adicionar à lista de desejos

**Fluxo:**

1. O usuário clica no ícone de coração
2. Exibir brevemente o estado de carregamento
3. Enviar solicitação de API para adicionar o item
4. Atualizar o ícone para o estado preenchido
5. Exibir feedback de sucesso (notificação: “Adicionado à lista de desejos” ou animação sutil)
6. Atualizar o emblema de navegação da lista de desejos (+1)

**IU otimista:**
Atualizar o ícone imediatamente; reverter se a API falhar. Oferece feedback instantâneo.

**Tratamento de erros:**
Mostrar notificação de erro (“Falha ao adicionar à lista de desejos”), reverter o ícone para o contorno e permitir nova tentativa.

**Tratamento de variantes:**
Salvar a variante específica (tamanho, cor) se selecionada na página do produto. Nos cartões de produto, salvar a variante padrão.

### Remoção da lista de desejos

**Na ficha/página do produto:**
Clique no coração preenchido → ele muda para um contorno → notificação: “Removido da lista de desejos” → atualização do ícone (-1).

**Na página da lista de desejos:**
Ícone “X” no canto da ficha do produto ou botão “Remover” → o item desaparece gradualmente. Opcional: Desfazer a ação na notificação (5 segundos).

**Confirmação:**
Geralmente não é necessária (baixo risco, facilmente reversível). Confirme apenas para ações em massa (“Limpar tudo”).

## Página da lista de desejos

### Layout

**Título:**
“Minha lista de desejos” ou “Favoritos” com a contagem de itens (“12 itens salvos”).

**Grelha de produtos:**
Semelhante à página de listagem de produtos. Cartões de produtos com imagens, títulos, preços atuais (podem diferir dos preços no momento da adição) e status de estoque.

**Estado vazio:**
“Sua lista de desejos está vazia” com o CTA “Comece a comprar”.

### Informações do cartão do produto

Exibição por item:

- Imagem do produto (com link para a página do produto)
- Título do produto (com link)
- Preço atual (pode mostrar o preço promocional se estiver em promoção no momento)
- Preço original, se estiver em promoção (riscado)
- Detalhes da variante (tamanho, cor, se salvos)
- Status do estoque: Em estoque (verde), Esgotado (vermelho, opção “Notificar-me”), Estoque baixo (“Restam apenas 2”)
- **Botão “Adicionar ao carrinho”** (CRÍTICO – caminho de conversão)
- Botão Remover (ícone X)

### Ações e conversão

**Adicionar ao carrinho (CRÍTICO):**
Botão “Adicionar ao carrinho” em cada item. Adiciona o item ao carrinho **sem removê-lo da lista de desejos** (o usuário pode querer ambos). Mensagem de sucesso: “Adicionado ao carrinho”. Não sair da página (permanecer na página da lista de desejos).

**Compromisso:**

- **Manter na lista de desejos** (recomendado): o usuário acompanha os itens desejados e pode fazer novos pedidos facilmente
- **Mover para o carrinho**: remove da lista de desejos após a adição — mais simples, mas limita a possibilidade de novos pedidos

**Gerenciamento de estoque:**
Se estiver fora de estoque, desative a opção “Adicionar ao carrinho” e exiba a opção “Notificar-me quando voltar ao estoque” (se o backend for compatível).

## Usuários convidados x usuários conectados

### Decisão: Exigir login ou usar o localStorage?

**Exigir login (recomendado):**

**Por quê:**

- A lista de desejos requer armazenamento persistente entre dispositivos
- Permite lembretes por e-mail e notificações de queda de preço
- Melhor experiência do usuário (nunca se perde)
- Dados mais organizados para análises e remarketing
- Evita confusão com itens perdidos da lista de desejos

**Implementação:**
Clique em “Lista de desejos” → Exiba uma janela modal solicitando login: “Faça login para salvar sua lista de desejos”. Inclua o botão “Cadastre-se”. Benefício claro: “Salve itens em todos os seus dispositivos”.

**Abordagem com localStorage (não recomendada):**

- Específica apenas para o dispositivo (perdida ao trocar de dispositivo)
- Perde-se se o usuário limpar os dados do navegador
- Sem oportunidades de remarketing
- Sem lembretes por e-mail
- Cria expectativas negativas em relação à experiência do usuário

**Exceção:**
Se o backend não suportar uma lista de desejos autenticada, considere não implementar o recurso de forma alguma, em vez de usar apenas o localStorage.

## Ícone de navegação

### Posicionamento e design

**Posição:**
Barra de navegação superior, entre o ícone de busca e o ícone do carrinho. Ou: no menu suspenso da conta do usuário.

**Ícone:**
Ícone de coração (contorno ou preenchido, se houver itens na lista de desejos). Tamanho de 24 a 32 px, consistente com o ícone do carrinho.

**Contador:**
Pequeno círculo com um número indicando o total de itens na lista de desejos. Vermelho ou na cor da marca, posicionado no canto superior direito do ícone de coração.

**Comportamento do link:**
Navega para a página da lista de desejos ao clicar. O menu suspenso é menos comum para a lista de desejos (ao contrário do pop-up do carrinho).

## Considerações para dispositivos móveis

**Botão de coração:**
Área de toque maior (mínimo de 44px), posicionada no canto da imagem do produto, feedback claro ao tocar (mudança de escala ou cor).

**Página da lista de desejos:**
Grade de produtos em coluna única, cartões empilhados verticalmente, botões “Adicionar ao carrinho” em largura total, botões grandes para remover (área de toque de 44px).

**Ícone de navegação:**
Ícone de coração na barra de navegação móvel ou no menu “hambúrguer”, com contador de itens.

**Solicitação de login:**
Se um visitante clicar na lista de desejos, exiba uma janela sobreposta na parte inferior da tela (menos intrusiva do que um modal completo) com a mensagem “Faça login para salvar sua lista de desejos”.

## Lista de verificação

**Recursos essenciais:**

- [ ] Suporte à API de backend verificado antes da implementação
- [ ] Ícone de coração nos cartões de produto (canto superior direito)
- [ ] Ícone de coração na página de detalhes do produto
- [ ] Diferenciação clara entre os estados “preenchido” e “contorno”
- [ ] Notificação pop-up ao adicionar/remover
- [ ] Ícone da lista de desejos na navegação com contador de itens
- [ ] Página da lista de desejos com grade de produtos
- [ ] Informações do produto: imagem, título, preço atual, disponibilidade em estoque
- [ ] Detalhes da variante, se salvos (tamanho, cor)
- [ ] Botão “Adicionar ao carrinho” em cada item da lista de desejos
- [ ] Adicionar ao carrinho sem remover da lista de desejos
- [ ] Botão “Remover” (ícone X) em cada item
- [ ] Lista de desejos vazia (CTA “Começar a comprar”)
- [ ] É necessário fazer login para manter a lista de desejos
- [ ] Solicitação de login para usuários convidados ao clicar na lista de desejos
- [ ] Indicadores de disponibilidade de estoque (em estoque, esgotado, estoque baixo)
- [ ] Esgotado: desativar a opção “Adicionar ao carrinho” e exibir “Notificar-me”
- [ ] Celular: áreas de toque de 44px
- [ ] Celular: layout em coluna única
- [ ] Interface de usuário otimista (feedback instantâneo)
- [ ] Tratamento de erros para solicitações de API com falha
- [ ] Estados de carregamento durante a adição/remoção
- [ ] Rótulo ARIA do botão (“Adicionar à lista de desejos” / “Remover da lista de desejos”)
- [ ] Atributo aria-pressed no botão em forma de coração
- [ ] Acessível por teclado (Tab, Enter/Espaço)
- [ ] Anúncios do leitor de tela para adição/remoção
