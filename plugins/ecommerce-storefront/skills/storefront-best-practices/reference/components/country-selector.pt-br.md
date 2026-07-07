# Componente Seletor de País

## Índice

- [Visão geral](#visao-geral)
- [Quando implementar](#quando-implementar)
- [Padrões de interface do usuário](#padroes-de-interface-do-usuario)
- [Gerenciamento de estados](#gerenciamento-de-estado)
- [Integração com o backend](#integracao-com-o-backend)
- [Detecção e valores padrão](#deteccao-e-configuracoes-padrao)
- [Considerações para dispositivos móveis](#consideracoes-para-dispositivos-moveis)
- [Lista de verificação](#lista-de-verificacao)

## Visão geral

O seletor de país permite que os clientes escolham seu país/região, o que determina a moeda, os preços, os produtos disponíveis, as opções de entrega, os métodos de pagamento e o conteúdo localizado.

### Principais funções do comércio eletrônico

- Exibir preços na moeda correta
- Mostrar a disponibilidade dos produtos por país
- Aplicar promoções e descontos específicos por região
- Calcular com precisão os custos de envio e os prazos de entrega
- Oferecer formas de pagamento adequadas
- Exibir conteúdo e idioma localizados

### Objetivo

**Por que a seleção do país/região é importante:**

- Os preços variam de acordo com a região (moeda, impostos, taxas de importação)
- A disponibilidade dos produtos difere de acordo com o mercado
- Os métodos e custos de envio são específicos para cada região
- Os requisitos legais variam (privacidade, proteção ao consumidor)
- As formas de pagamento variam de acordo com o país
- Melhora a experiência do usuário com conteúdo relevante

## Quando implementar

**Implemente o seletor de país quando:**

- O backend for compatível com vários países ou regiões
- As vendas forem feitas para vários países ou regiões
- Os preços variarem de acordo com a localização (moeda, impostos)
- Envio internacional com tarifas diferentes
- Catálogos de produtos específicos por região
- É necessário suporte a várias moedas
- Os requisitos legais ou regulatórios variam por região

**Ignore se:**

- O backend não suportar vários países ou regiões
- Todos os preços em uma única moeda
- Sem diferenças regionais no catálogo ou nos preços

## Padrões de interface do usuário

### Opções de posicionamento

**Posicionamento no rodapé (moderno e minimalista):**

- Parte inferior da página, no rodapé
- Menos visível, mas sempre acessível
- Ícone (bandeira ou globo) + código/nome do país

**Posicionamento no cabeçalho (mais comum):**

- Canto superior direito da barra de navegação
- Ícone (bandeira ou globo) + código/nome do país
- Ao clicar, abre um menu suspenso ou seletor modal

**Modal/pop-up na primeira visita:**

- Detecta a localização e sugere o país
- Permite que o usuário confirme ou altere
- Salvar a preferência para visitas futuras

### Padrões de design para seletores

**Padrão 1: Menu suspenso (recomendado)**

Seletor pequeno e compacto no cabeçalho. Mostra a bandeira/o nome do país atual; clique para abrir o menu suspenso com a lista de países.

**Prós:** Não interrompe a navegação, está sempre acessível, é um padrão familiar.

**Padrão 2: Janela modal na primeira visita**

Janela modal em tela cheia ou centralizada na primeira visita. “Selecione seu país para ver preços e frete precisos.”

**Prós:** Obriga a seleção inicial, garante preços precisos desde o início.
**Contras:** Pode ser intrusivo e atrasar a navegação.

**Compromisso:** O modal garante a seleção, mas cria atrito. O menu suspenso é menos intrusivo, mas os usuários podem não percebê-lo.

**Padrão 3: Banner embutido**

Banner fixo na parte superior: “Envio para os Estados Unidos? Alterar”, com link para o seletor.

**Prós:** Lembrete não intrusivo, não bloqueia o conteúdo.
**Contras:** Ocupa espaço vertical, é fácil de ignorar.

### Exibição da lista de países

**Busca + lista:**

- Campo de busca na parte superior
- Lista de países em ordem alfabética abaixo
- Países populares no topo (EUA, Reino Unido, Canadá etc.)
- Ícones de bandeiras para reconhecimento visual

**Agrupados por região:**

- América do Norte, Europa, Ásia, etc.
- Seções recolhíveis
- Útil para listas extensas (mais de 100 países)

**Formato:**

```
🇺🇸 United States (USD)
🇬🇧 United Kingdom (GBP)
🇨🇦 Canada (CAD)
───────────────────
🇩🇪 Germany (EUR)
🇫🇷 France (EUR)
```

Exiba a bandeira, o nome do país e o código da moeda para maior clareza.

## Gerenciamento de estado

### Armazenamento da seleção do país

**Armazenamento no lado do cliente (recomendado):**

- localStorage ou cookies
- Persiste entre sessões
- Chave: `region_id` ou `country_code`

**Por que usar o armazenamento local:**

- Acesso rápido sem necessidade de chamada à API
- Disponível imediatamente ao carregar a página
- Não é necessária nenhuma ida e volta ao servidor

### Padrão de Provedor de Contexto

**Recomendado: Crie um contexto para os dados de região/país.**

Oferece acesso rápido em todo o aplicativo a:

- País selecionado
- Região selecionada (se aplicável)
- Moeda
- Formas de pagamento disponíveis
- Opções de entrega

**Benefícios:**

- Lógica centralizada de país/região
- Acesso fácil a partir de qualquer componente
- Fonte única de verdade
- Consultas simplificadas sobre carrinho e produtos

**Exemplo de estrutura:**

```typescript
interface RegionContext {
  country: string
  region?: string
  currency: string
  changeCountry: (country: string) => void
}
```

### Quando aplicar a seleção

**Aplicar país/região a:**

- Exibição do preço do produto (converter moeda, aplicar preços regionais)
- Criação do carrinho (definir região para totais precisos)
- Consultas sobre produtos (obter preços precisos)
- Fluxo de finalização da compra (métodos de entrega, opções de pagamento)
- Exibição de conteúdo (idioma, medidas)

## Integração com o backend

### Requisitos gerais do backend

**O que o backend precisa fornecer:**

- Lista de países/regiões disponíveis
- Mapeamento de países para regiões (caso se utilize uma estrutura regional)
- Preços por região ou país
- Disponibilidade do produto por região
- Formas de envio por região
- Formas de pagamento aceitas por região

**Considerações sobre a API:**

- Obter a lista de países/regiões ao carregar o aplicativo
- Passar o país/região selecionado para consultas de produtos
- Incluir a região na criação do carrinho
- Validar a seleção do país no backend

### Integração com o backend do Medusa

**Para os usuários do Medusa, as regiões são fundamentais para a precificação precisa.**

O Medusa utiliza regiões (e não países individuais) para a precificação. Uma região pode abranger vários países.

**Conceitos-chave:**

- **Região**: Grupo de países com preços em comum (por exemplo, a região “Europa”)
- **País**: país individual dentro de uma região
- **Moeda**: cada região possui uma moeda

**Mapeamento de país para região:**

1. O cliente seleciona o país (por exemplo, “Alemanha”)
2. Identifique qual região contém esse país (por exemplo, a região “Europa”)
3. Armazenar o ID da região para operações relacionadas ao carrinho e aos produtos
4. Utilizar a região em todas as consultas de preços

**Obrigatório para:**

- Criação de carrinhos: é necessário passar o ID da região
- Recuperação de produtos: passar a região para obter preços precisos
- Disponibilidade de produtos: os produtos podem ser específicos de cada região

**Padrão de implementação:**
Crie um contexto que armazene tanto o país quanto a região. Quando o país for alterado, identifique a região correspondente e atualize ambos.

**Para obter detalhes sobre a implementação de regiões no Medusa, consulte:**

- Documentação sobre regiões da loja virtual do Medusa: <https://docs.medusajs.com/resources/storefront-development/regions/context>
- Endpoints de regiões do Medusa JS SDK
- Consulte o servidor Medusa MCP para obter detalhes da API em tempo real

**Outros back-ends:**
Verifique a documentação do back-end de comércio eletrônico para conhecer os padrões de tratamento de países/regiões.

## Detecção e configurações padrão

### Detecção automática

**Geolocalização baseada em IP (recomendado):**
Detecte o país do usuário a partir do endereço IP. Use como padrão, mas permita que o usuário altere.

**Implementação:**

- Use uma API ou serviço de geolocalização (MaxMind, ipapi.co, CloudFlare)
- Detecção no lado do servidor (mais precisa)
- Defina como padrão e exiba a confirmação: “Envio para os Estados Unidos?”

**Vantagens:** Reduz o atrito; a maioria dos usuários mantém o país detectado.

**Desvantagem:** Não é 100% preciso (VPNs, proxies). Sempre permita a alteração manual.

### Estratégia alternativa

**Se a detecção falhar ou não estiver disponível:**

1. Verifique o localStorage para ver a seleção anterior
2. Use o idioma do navegador como indicação (`navigator.language`)
3. Use como padrão o mercado principal (por exemplo, EUA para lojas sediadas nos EUA)
4. Solicite que o usuário faça a seleção na primeira interação (carrinho, finalização da compra)

**Nunca bloqueie a navegação se o país for desconhecido.**
Permita a navegação com preços padrão e solicite a seleção antes da finalização da compra.

## Considerações para dispositivos móveis

**Posicionamento do seletor:**
Menu “hambúrguer” no celular ou na parte inferior da página. No canto superior direito do cabeçalho do celular, se o espaço permitir.

**Seletor modal:**
Modal em tela cheia no celular para seleção do país. Áreas de toque amplas (48px), campo de pesquisa na parte superior, rolagem fácil.

**Lembrete fixo:**
Pequeno banner: “Envio para os EUA? Alterar”, com toque para abrir o seletor.

**Aviso de detecção:**
Janela na parte inferior da tela: “Detectamos que você está na Alemanha. Está correto?”, com botões Confirmar/Alterar.

## Lista de verificação

**Recursos essenciais:**

- [ ] Seletor de país visível (cabeçalho, rodapé ou janela modal na primeira visita)
- [ ] País atual exibido claramente (bandeira, nome, moeda)
- [ ] Menu suspenso ou janela modal com lista de países
- [ ] Funcionalidade de busca para listas extensas de países
- [ ] Países populares no topo da lista
- [ ] Ícones de bandeira para reconhecimento visual
- [ ] Exibição do código da moeda por país
- [ ] Persistência no localStorage (salvar seleção)
- [ ] Provedor de contexto para dados de região/país
- [ ] Detecção automática com base no IP (opcional)
- [ ] Substituição manual sempre disponível
- [ ] Aplicar aos preços dos produtos (moeda, preços regionais)
- [ ] Aplicar à criação do carrinho (definir região)
- [ ] Aplicar ao checkout (frete, formas de pagamento)
- [ ] Solução alternativa caso a detecção falhe
- [ ] Dispositivos móveis: modal em tela cheia ou janela inferior
- [ ] Dispositivos móveis: áreas de toque grandes (48px)
- [ ] Integração com o backend (busca de regiões, mapeamento de países)
- [ ] Para Medusa: contexto de região com mapeamento de país para região
- [ ] Para Medusa: passar a região para consultas de carrinho e produtos
- [ ] Rótulo ARIA no botão seletor
- [ ] Acessível por teclado (Tab, Enter, setas)
- [ ] O leitor de tela anuncia as mudanças de país

**Melhorias opcionais:**

- [ ] Exibição da conversão de moeda (mostrar valor original + convertido)
- [ ] Seletor de idioma vinculado ao país
- [ ] Estimativa de frete com base no país
- [ ] Exibição da estimativa de impostos
- [ ] Conteúdo regional (imagens, mensagens)
- [ ] Alternativa “Não entregamos no seu país?”
