# Componente Country Selector

## Conteúdo

- [Visão Geral](#visao-geral)
- [Quando Implementar](#quando-implementar)
- [Padrões de UI](#padroes-de-ui)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Integração com Backend](#integracao-com-backend)
- [Detecção e Padrões](#deteccao-e-padroes)
- [Considerações para Mobile](#consideracoes-para-mobile)
- [Lista de Verificação](#lista-de-verificacao)

## Visão Geral

O seletor de país (country selector) permite que os clientes escolham seu país/região, o que determina a moeda, preços, produtos disponíveis, opções de frete, métodos de pagamento e conteúdo localizado.

### Principais Funções no E-commerce

- Exibir preços na moeda correta
- Mostrar a disponibilidade de produtos específica do país
- Aplicar promoções e descontos específicos da região
- Calcular custos de frete e prazos de entrega precisos
- Habilitar métodos de pagamento apropriados
- Exibir conteúdo e idioma localizados

### Objetivo

**Por que a seleção de país/região importa:**

- Os preços variam por região (moeda, impostos, taxas de importação)
- A disponibilidade do produto difere por mercado
- Os métodos e custos de envio são específicos da região
- Os requisitos legais variam (privacidade, defesa do consumidor)
- Os métodos de pagamento diferem por país
- Melhora a experiência do usuário com conteúdo relevante

## Quando Implementar

**Implemente o seletor de país quando:**

- O backend suporta múltiplos países ou regiões
- Vende para múltiplos países ou regiões
- Os preços variam por localização (moeda, impostos)
- Envio internacional com taxas diferentes
- Catálogos de produtos específicos da região
- Necessidade de suporte a múltiplas moedas
- Requisitos legais ou regulatórios variam por região

**Pule se:**

- O backend não suporta múltiplos países ou regiões
- Todos os preços estão em uma única moeda
- Não há diferenças regionais no catálogo ou nos preços

## Padrões de UI

### Opções de Posicionamento

**Posicionamento no rodapé (moderno e minimalista):**

- Na parte inferior da página, no rodapé
- Menos proeminente, mas sempre acessível
- Ícone (bandeira ou globo) + código/nome do país

**Posicionamento no cabeçalho (mais comum):**

- Canto superior direito da barra de navegação
- Ícone (bandeira ou globo) + código/nome do país
- O clique abre um dropdown ou modal seletor

**Modal/popup na primeira visita:**

- Detecta a localização e sugere o país
- Permite que o usuário confirme ou altere
- Armazena a preferência para visitas futuras

### Padrões de Design do Seletor

**Padrão 1: Dropdown (Recomendado)**

Seletor pequeno e compacto no cabeçalho. Mostra a bandeira/nome do país atual, clique para abrir o dropdown com a lista de países.

**Prós:** Não interrompe a navegação, sempre acessível, padrão familiar.

**Padrão 2: Modal na Primeira Visita**

Modal em tela cheia ou centralizado na primeira visita. "Selecione seu país para ver preços e fretes precisos."

**Prós:** Força a seleção inicial, garante preços precisos desde o início.
**Contras:** Pode ser intrusivo, atrasa a navegação.

**Tradeoff:** O modal garante a seleção, mas adiciona atrito. O dropdown é menos intrusivo, mas os usuários podem não notá-lo.

**Padrão 3: Banner Inline**

Banner fixo no topo: "Enviando para o Brasil? Alterar" com link para o seletor.

**Prós:** Lembrete não intrusivo, não bloqueia o conteúdo.
**Contras:** Ocupa espaço vertical, fácil de ignorar.

### Exibição da Lista de Países

**Busca + lista:**

- Input de busca no topo
- Lista de países em ordem alfabética abaixo
- Países populares no topo (EUA, Reino Unido, Canadá, Brasil, etc.)
- Ícones de bandeira para reconhecimento visual

**Agrupado por região:**

- América do Norte, Europa, Ásia, etc.
- Seções colapsáveis
- Útil para listas grandes (100+ países)

**Formato:**

```
🇺🇸 Estados Unidos (USD)
🇬🇧 Reino Unido (GBP)
🇨🇦 Canadá (CAD)
───────────────────
🇩🇪 Alemanha (EUR)
🇫🇷 França (EUR)
```

Mostre a bandeira, o nome do país e o código da moeda para maior clareza.

## Gerenciamento de Estado

### Armazenando a Seleção de País

**Armazenamento no lado do cliente (recomendado):**

- `localStorage` ou cookies
- Persiste entre sessões
- Chave: `region_id` ou `country_code`

**Por que usar armazenamento local:**

- Acesso rápido sem chamada à API
- Disponível imediatamente no carregamento da página
- Nenhuma viagem de ida e volta ao servidor necessária

### Padrão Provider de Contexto

**Recomendado: Crie um contexto para dados de região/país.**

Fornece acesso rápido em toda a aplicação para:

- País selecionado
- Região selecionada (se aplicável)
- Moeda
- Métodos de pagamento disponíveis
- Opções de envio

**Benefícios:**

- Lógica de país/região centralizada
- Fácil acesso a partir de qualquer componente
- Única fonte de verdade
- Consultas de carrinho e produto simplificadas

**Estrutura de exemplo:**

```typescript
interface RegionContext {
  country: string
  region?: string
  currency: string
  changeCountry: (country: string) => void
}
```

### Quando Aplicar a Seleção

**Aplique o país/região para:**

- Exibição de preços de produtos (converter moeda, aplicar precificação regional)
- Criação do carrinho (definir região para totais precisos)
- Consultas de produtos (recuperar preços precisos)
- Fluxo de checkout (métodos de envio, opções de pagamento)
- Exibição de conteúdo (idioma, medidas)

## Integração com Backend

### Requisitos Gerais de Backend

**O que o backend precisa fornecer:**

- Lista de países/regiões disponíveis
- Mapeamento de países para regiões (se estiver usando estrutura regional)
- Precificação por região ou país
- Disponibilidade de produto por região
- Métodos de envio por região
- Métodos de pagamento suportados por região

**Considerações de API:**

- Buscar a lista de países/regiões no carregamento do app
- Passar o país/região selecionado para as consultas de produto
- Incluir a região na criação do carrinho
- Validar a seleção do país no backend

### Integração com Backend Medusa

**Para usuários do Medusa, as regiões são críticas para precificação precisa.**

O Medusa usa regiões (não países individuais) para precificação. Uma região pode conter vários países.

**Conceitos-chave:**

- **Região**: Grupo de países com preços compartilhados (ex: região "Europa")
- **País**: País individual dentro de uma região
- **Moeda**: Cada região possui uma moeda

**Mapeando país para região:**

1. Cliente seleciona o país (ex: "Alemanha")
2. Encontre qual região contém esse país (ex: região "Europa")
3. Armazene o ID da região para operações de carrinho e produto
4. Use a região para todas as consultas de preços

**Necessário para:**

- Criar carrinhos: Deve passar o ID da região
- Recuperar produtos: Passe a região para obter preços precisos
- Disponibilidade do produto: Produtos podem ser específicos da região

**Padrão de implementação:**
Crie um contexto que armazene tanto o país quanto a região. Quando o país mudar, procure a região correspondente e atualize ambos.

**Para a implementação detalhada de regiões do Medusa, veja:**

- Documentação de regiões do Medusa storefront: <https://docs.medusajs.com/resources/storefront-development/regions/context>
- Endpoints de regiões no Medusa JS SDK
- Consulte o servidor MCP do Medusa para detalhes de API em tempo real

**Outros backends:**
Verifique a documentação do backend de e-commerce sobre os padrões de manuseio de país/região.

## Detecção e Padrões

### Detecção Automática

**Geolocalização baseada em IP (recomendado):**
Detecte o país do usuário a partir do endereço IP. Use como padrão, mas permita que o usuário altere.

**Implementação:**

- Use API ou serviço de geolocalização (MaxMind, ipapi.co, CloudFlare)
- Detecção no lado do servidor (mais precisa)
- Defina como padrão, mostre a confirmação: "Enviando para o Brasil?"

**Benefícios:** Reduz o atrito, a maioria dos usuários mantém o país detectado.

**Tradeoff:** Não é 100% preciso (VPNs, proxies). Sempre permita a substituição manual.

### Estratégia de Fallback

**Se a detecção falhar ou estiver indisponível:**

1. Verifique o `localStorage` para a seleção anterior
2. Use o idioma do navegador como dica (`navigator.language`)
3. Adote o mercado principal como padrão (ex: EUA para loja sediada nos EUA)
4. Peça ao usuário para selecionar na primeira interação (carrinho, checkout)

**Nunca bloqueie a navegação se o país for desconhecido.**
Permita a navegação com preços padrão, solicite a seleção antes do checkout.

## Considerações para Mobile

**Posicionamento do seletor:**
No menu hambúrguer para mobile ou na parte inferior da página. Canto superior direito no cabeçalho mobile se o espaço permitir.

**Modal seletor:**
Modal em tela cheia no mobile para seleção de país. Alvos de toque grandes (48px), input de busca no topo, rolagem fácil.

**Lembrete fixo:**
Pequeno banner: "Enviando para o Brasil? Alterar" com toque para abrir o seletor.

**Aviso de detecção:**
Bottom sheet: "Detectamos que você está no Brasil. Está correto?" com botões Confirmar/Alterar.

## Lista de Verificação

**Recursos essenciais:**

- [ ] Seletor de país visível (cabeçalho, rodapé ou modal de primeira visita)
- [ ] País atual exibido claramente (bandeira, nome, moeda)
- [ ] Dropdown ou modal com lista de países
- [ ] Funcionalidade de busca para longas listas de países
- [ ] Países populares no topo da lista
- [ ] Ícones de bandeira para reconhecimento visual
- [ ] Mostrar o código da moeda por país
- [ ] Persistência no `localStorage` (salvar seleção)
- [ ] Provider de contexto para dados de região/país
- [ ] Detecção automática baseada em IP (opcional)
- [ ] Substituição manual sempre disponível
- [ ] Aplicar aos preços dos produtos (moeda, precificação regional)
- [ ] Aplicar à criação do carrinho (definir região)
- [ ] Aplicar ao checkout (frete, métodos de pagamento)
- [ ] Fallback caso a detecção falhe
- [ ] Mobile: Modal em tela cheia ou bottom sheet
- [ ] Mobile: Alvos de toque grandes (48px)
- [ ] Integração com backend (buscar regiões, mapear países)
- [ ] Para Medusa: Contexto da região com mapeamento país-para-região
- [ ] Para Medusa: Passar a região nas consultas de carrinho e produto
- [ ] ARIA label no botão do seletor
- [ ] Acessível via teclado (Tab, Enter, setas)
- [ ] Leitor de tela anuncia as mudanças de país

**Melhorias opcionais:**

- [ ] Exibição de conversão de moeda (mostrar original + convertido)
- [ ] Seletor de idioma atrelado ao país
- [ ] Estimativa de envio com base no país
- [ ] Exibição de estimativa de impostos
- [ ] Conteúdo regional (imagens, mensagens)
- [ ] Alternativa "Não envia para o seu país?"
