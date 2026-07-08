# Componente Product Card

## Conteúdo

- [Visão Geral](#visao-geral)
- [Exibição de Preço (Específico de E-commerce)](#exibicao-de-preco-especifico-de-e-commerce)
- [Botões de Ação e Tratamento de Variantes](#botoes-de-acao-e-tratamento-de-variantes)
- [Selos e Etiquetas](#selos-e-etiquetas)
- [Considerações para Mobile](#consideracoes-para-mobile)
- [Lista de Verificação de E-commerce](#lista-de-verificacao-de-e-commerce)

## Visão Geral

Os product cards exibem produtos em grades (listagens de produtos, resultados de busca, produtos relacionados). Principais considerações para e-commerce: preços claros, adição rápida ao carrinho e indicadores de estoque.

**Conhecimento assumido**: Agentes de IA sabem como construir cards com imagens, títulos e botões. Este guia foca em padrões específicos de e-commerce.

### Principais Requisitos de E-commerce

- Preço claro e proeminente (incluindo preços promocionais)
- Tratamento de variantes para adição ao carrinho
- Indicadores de status de estoque
- Selos de Promoção/Novo/Esgotado
- Grade responsiva (1 col mobile, 2-3 tablet, 3-4 desktop)
- Carregamento rápido de imagens (lazy load, otimizado)

## Exibição de Preço (Específico de E-commerce)

### Preço Regular vs Promocional

**Exibição de preço promocional:**

- Preço promocional: Maior, negrito, vermelho ou cor de destaque
- Preço original: Menor, tachado (~~R$ 79,99~~), cinza
- Posicione o preço promocional antes do preço original
- Opcional: Mostrar selo de porcentagem de desconto (-20%)

**Formate de forma consistente:**

- Sempre inclua o símbolo da moeda (R$ 49,99)
- Casas decimais consistentes (R$ 49,99, não R$ 49,9 ou R$ 50)
- Para o Medusa: Exibir preços como estão (não dividir por 100)

### Faixa de Preço (Múltiplas Variantes)

**Quando as variantes têm preços diferentes:**

- Mostre "A partir de R$ 49" ou "R$ 49 - R$ 79"
- Deixa claro que o preço varia conforme a seleção
- Não mostre a faixa se todas as variantes tiverem o mesmo preço

## Botões de Ação e Tratamento de Variantes

### Adicionar ao Carrinho com Variantes (CRÍTICO)

**Desafio principal**: Produtos com variantes exigem a seleção da variante antes de adicionar ao carrinho.

**Estratégias de tratamento:**

1. **Adicionar a primeira variante por padrão** - O clique adiciona `product.variants[0]`. Rápido para produtos simples (1-2 variantes).
2. **Redirecionar para a página do produto** - Navegue para a página de detalhes para seleção da variante. Melhor para produtos complexos (tamanho + cor + material).
3. **Modal Quick View (Visualização Rápida)** - Seletor de variantes no modal. Bom meio-termo (apenas para desktop).

**Decisão:**

- Produtos simples (1-2 variantes): Adicionar a primeira variante
- Moda/vestuário com tamanhos: Exigir a seleção de tamanho (redirecionar ou Quick View)
- Produtos complexos (3+ tipos de variantes): Redirecionar para a página do produto

**Comportamento do botão:**

- Estado de carregamento ("Adicionando..."), desabilitar durante o carregamento
- Atualização otimista da UI (contagem do carrinho atualizada imediatamente)
- Feedback de sucesso (toast, pop-up do carrinho ou marca de seleção)
- **Não navegue para fora da página** (permaneça na página de listagem)
- Tratar erros (esgotado, falha na API)

**Botão de Wishlist (opcional)**: Ícone de coração, canto superior direito sobre a imagem. Vazio quando não salvo, preenchido (vermelho) quando salvo. Consulte `wishlist.md` para mais detalhes.

## Selos e Etiquetas

**Prioridade de selos** (mostre no máximo 1-2 por card):

1. **Esgotado** (mais alto) - Sobreposição cinza/preta na imagem, desabilita a adição ao carrinho
2. **Promoção/Desconto** - "Oferta" ou "-20%", vermelho/destaque, canto superior esquerdo
3. **Novo** - "Novo" para produtos recentes, azul/verde, canto superior esquerdo
4. **Baixo Estoque** (opcional) - "Apenas 3 restantes", laranja, cria urgência

**Exibição**: Canto superior esquerdo (exceto sobreposição de Esgotado), pequeno mas legível, alto contraste.

## Considerações para Mobile

### Layout de Grade

**Ajustes específicos para mobile:**

- 2 colunas no máximo no mobile (nunca 3+)
- Alvos de toque maiores (mínimo de 44px para botões)
- Sempre mostrar o botão "Adicionar ao Carrinho" (sem depender de hover)
- Conteúdo simplificado (ocultar elementos opcionais como marca)
- Imagens menores para desempenho (<400px de largura)

### Interações de Toque

**Sem estados de hover no mobile:**

- Não oculte ações atrás de hover
- Sempre mostre o botão primário
- Use estados de toque (estado ativo) em vez de hover

## Lista de Verificação de E-commerce

**Recursos essenciais:**

- [ ] Imagem do produto clara (otimizada, lazy loaded)
- [ ] Título do produto (truncado para 2 linhas no máximo)
- [ ] Preço exibido de forma proeminente
- [ ] Preço promocional exibido corretamente (preço original tachado)
- [ ] Símbolo da moeda incluído
- [ ] Para o Medusa: Preço exibido como está (não dividido por 100)
- [ ] Botão Adicionar ao Carrinho com estado de carregamento
- [ ] Estratégia de tratamento de variantes (primeira variante, redirecionar ou Quick View)
- [ ] Atualização otimista da UI (contagem do carrinho imediatamente)
- [ ] Feedback de sucesso (toast ou pop-up do carrinho)
- [ ] Não navegar para fora da página após adicionar ao carrinho
- [ ] Selo de Esgotado (desabilita a adição ao carrinho)
- [ ] Selo de Promoção quando o preço é reduzido
- [ ] Grade responsiva (1 col mobile, 2-3 tablet, 3-4 desktop)
- [ ] Adequado para toque no mobile (botões de 44px)
- [ ] Acessível via teclado (estados de foco, Enter para ativar)
- [ ] Texto alternativo (alt text) descritivo nas imagens
- [ ] HTML semântico (wrapper `<article>`)
