# Componente “Ficha do produto”

## Índice

- [Visão geral](#visao-geral)
- [Exibição de preços (específico para comércio eletrônico)](#exibicao-de-precos-especifica-para-comercio-eletronico)
- [Botões de ação e gerenciamento de variantes](#botoes-de-acao-e-tratamento-de-variantes)
- [Emblemas e rótulos](#emblemas-e-rotulos)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação para comércio eletrônico](#lista-de-verificacao-para-comercio-eletronico)

## Visão geral

Os cartões de produto exibem produtos em grades (listas de produtos, resultados de pesquisa, produtos relacionados). Principais considerações para o comércio eletrônico: preços claros, adição rápida ao carrinho e indicadores de estoque.

**Conhecimento prévio**: os agentes de IA sabem como criar cartões com imagens, títulos e botões. Este guia se concentra em padrões específicos do comércio eletrônico.

### Principais requisitos do comércio eletrônico

- Preços claros e em destaque (incluindo preços promocionais)
- Gerenciamento de variantes para “adicionar ao carrinho”
- Indicadores de disponibilidade de estoque
- Emblemas de “Promoção”, “Novo” e “Esgotado”
- Grade responsiva (1 coluna para celular, 2–3 para tablet, 3–4 para desktop)
- Carregamento rápido de imagens (carregamento diferido, otimizado)

## Exibição de preços (específica para comércio eletrônico)

### Preço normal x preço promocional

**Exibição do preço promocional:**

- Preço promocional: Maius, em negrito, vermelho ou cor de destaque
- Preço original: Menor, riscado (~~$79,99~~), cinza
- Coloque o preço promocional antes do preço original
- Opcional: Exiba um selo com a porcentagem de desconto (-20%)

**Formate de maneira consistente:**

- Sempre inclua o símbolo da moeda ($49,99)
- Decimais consistentes ($49,99, não $49,9 ou $50)
- Para Medusa: exiba os preços como estão (sem dividir por 100)

### Faixa de preços (várias variantes)

**Quando as variantes têm preços diferentes:**

- Mostre “A partir de $49” ou “$49 - $79”
- Deixe claro que o preço varia de acordo com a seleção
- Não exibir faixa de preço se todas as variantes tiverem o mesmo preço

## Botões de ação e tratamento de variantes

### Adicionar ao carrinho com variantes (CRÍTICO)

**Desafio principal**: Produtos com variantes exigem a seleção de uma variante antes de serem adicionados ao carrinho.

**Estratégias de tratamento:**

1. **Adicionar a primeira variante por padrão** — Ao clicar, adiciona `product.variants[0]`. Rápido para produtos simples (1-2 variantes).
2. **Redirecionar para a página do produto** — Navegue até a página de detalhes para a seleção da variante. Ideal para produtos complexos (tamanho + cor + material).
3. **Modal de visualização rápida** — Seletor de variantes no modal. Bom meio-termo (somente para desktop).

**Decisão:**

- Produtos simples (1-2 variantes): Adicionar a primeira variante
- Moda/vestuário com tamanhos: Exigir seleção de tamanho (redirecionamento ou Visualização Rápida)
- Produtos complexos (3 ou mais tipos de variantes): redirecionar para a página do produto

**Comportamento do botão:**

- Estado de carregamento (“Adicionando...”), desativar durante o carregamento
- Atualização otimista da interface do usuário (contagem no carrinho imediata)
- Confirmação de sucesso (notificação, pop-up do carrinho ou marca de seleção)
- **Não sair da página** (permanecer na página de listagem)
- Lidar com erros (fora de estoque, falha na API)

**Botão da lista de desejos (opcional)**: Ícone de coração, no canto superior direito sobre a imagem. Vazio quando não salvo, preenchido (vermelho) quando salvo. Consulte wishlist.md para mais detalhes.

## Emblemas e rótulos

**Prioridade dos emblemas** (exibir no máximo 1 ou 2 por cartão):

1. **Esgotado** (prioridade máxima) — sobreposição cinza/preta na imagem, desativa a opção “Adicionar ao carrinho”
2. **Promoção/Desconto** — “Promoção” ou “-20%”, vermelho/destaque, canto superior esquerdo
3. **Novo** — “Novo” para produtos recentes, azul/verde, canto superior esquerdo
4. **Estoque baixo** (opcional) — “Restam apenas 3”, laranja, cria urgência

**Exibição**: canto superior esquerdo (exceto a sobreposição “Esgotado”), pequeno, mas legível, com alto contraste.

## Considerações para dispositivos móveis

### Layout em grade

**Ajustes específicos para dispositivos móveis:**

- No máximo 2 colunas em dispositivos móveis (nunca mais de 3)
- Áreas de toque maiores (mínimo de 44px para botões)
- Sempre exiba o botão “Adicionar ao carrinho” (não apenas ao passar o cursor)
- Conteúdo simplificado (oculte elementos opcionais, como a marca)
- Imagens menores para melhorar o desempenho (<400px de largura)

### Interações por toque

**Sem estados de hover em dispositivos móveis:**

- Não oculte ações por trás do hover
- Sempre exiba o botão principal
- Use estados de toque (estado ativo) em vez de hover

## Lista de verificação para comércio eletrônico

**Recursos essenciais:**

- [ ] Imagem nítida do produto (otimizada, com carregamento diferido)
- [ ] Título do produto (truncado para no máximo 2 linhas)
- [ ] Preço exibido com destaque
- [ ] Preço promocional exibido corretamente (preço original riscado)
- [ ] Símbolo da moeda incluído
- [ ] Para o Medusa: preço exibido tal como está (sem divisão por 100)
- [ ] Botão “Adicionar ao carrinho” com indicador de carregamento
- [ ] Estratégia de tratamento de variantes (primeira variante, redirecionamento ou Visualização Rápida)
- [ ] Atualização otimista da interface do usuário (contagem do carrinho imediata)
- [ ] Confirmação de sucesso (notificação ou pop-up do carrinho)
- [ ] Não sair da página após adicionar ao carrinho
- [ ] Emblema “Esgotado” (desativa a função “Adicionar ao carrinho”)
- [ ] Ícone de promoção quando o preço for reduzido
- [ ] Grade responsiva (1 coluna no celular, 2-3 no tablet, 3-4 no computador)
- [ ] Otimizado para tela sensível ao toque no celular (botões de 44px)
- [ ] Acessível por teclado (estados de foco, tecla Enter para ativar)
- [ ] Texto alternativo descritivo nas imagens
- [ ] HTML semântico (elemento `<article>`)
