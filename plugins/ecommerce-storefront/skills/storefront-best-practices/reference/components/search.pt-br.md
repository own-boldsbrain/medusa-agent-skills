# Componente de Pesquisa

## Índice

- [Visão geral](#visao-geral)
- [Posicionamento da pesquisa](#posicionamento-da-pesquisa)
- [Preenchimento automático e sugestões de produtos](#autocompletar-e-sugestoes-de-produtos)
- [Página de resultados da pesquisa](#pagina-de-resultados-da-pesquisa)
- [Estados vazios](#estados-de-tela-vazia)
- [Pesquisas recentes e populares](#pesquisas-recentes-e-populares)
- [Pesquisa em dispositivos móveis](#lista-de-verificacao-para-pesquisa-em-comercio-eletronico)

## Visão geral

A pesquisa é fundamental para o comércio eletrônico — usuários com intenção de pesquisa apresentam taxas de conversão mais altas. Ofereça uma descoberta rápida e relevante de produtos com o preenchimento automático.

**Conhecimento prévio**: Os agentes de IA sabem como criar campos de pesquisa com ícones e botões de confirmação. Este guia se concentra nos padrões de pesquisa do comércio eletrônico.

### Requisitos principais

- Campo de pesquisa em destaque (sempre acessível)
- Preenchimento automático instantâneo após 2 a 3 caracteres
- Sugestões de produtos com imagens
- Resultados de pesquisa rápidos e relevantes
- Filtros para refinar os resultados
- Orientação para o estado vazio
- Janela modal de pesquisa em tela cheia para dispositivos móveis

## Posicionamento da pesquisa

**Desktop**: Centro da barra de navegação (entre o logotipo e o carrinho) ou lado direito. Sempre visível, com largura de 300 a 500 px. Parte da barra de navegação fixa. Nunca ocultar no menu “hambúrguer”.

**Dispositivos móveis**: Ícone de lupa no canto superior direito (mínimo de 44x44px). Abre uma janela modal em tela cheia — elimina distrações, maximiza o espaço para sugestões e proporciona uma melhor experiência de digitação.

## Autocompletar e sugestões de produtos

**Mostrar sugestões** após 2 a 3 caracteres (não 1). Aplicar um tempo de espera de 300 ms para evitar chamadas excessivas à API.

**Exibir de 5 a 10 sugestões de produtos:**

- Imagem pequena (40–60 px), título, preço
- Clique para acessar a página do produto
- Opcional: sugestões de categoria/marca, termos populares
- Dividir as seções com cabeçalhos
- Link no rodapé “Ver todos os resultados para [consulta]”

**Integração com o backend**: Obter dados da API de pesquisa. Consulte a documentação da plataforma de comércio eletrônico para obter a referência da API.

## Página de resultados da pesquisa

**Cabeçalho**: “Resultados da pesquisa para ‘[consulta]’” + contagem de resultados (“24 produtos encontrados”). Barra de pesquisa visível e pré-preenchida para refinamento.

**Layout em grade**: Igual ao das listas de produtos (consulte product-listing.md). 1 a 4 colunas, dependendo do dispositivo.

**Classificação**: Relevância (padrão, exclusiva para pesquisa), Preço (do menor para o maior), Mais recentes.

**Filtros**: Barra lateral (desktop) ou menu deslizante (celular). Categoria, Preço, Marca, Disponibilidade com contagem de resultados.

## Estados de tela vazia

**Sem resultados**: “Nenhum resultado para '[consulta]'” com sugestões úteis (verifique a ortografia, tente palavras-chave mais amplas, navegue pelas categorias). Botão “Ver todos os produtos” + links para categorias populares.

**Estado de carregamento**: Esboços de cartões de produto (6 a 8 cartões), exibição mínima de 300 ms para evitar piscar.

## Pesquisas recentes e populares

**Pesquisas recentes** (específicas do usuário, localStorage): Mostrar de 3 a 5 pesquisas recentes quando o campo de entrada estiver em foco (antes de digitar). Ajuda a refazer a pesquisa sem precisar digitar novamente.

**Pesquisas populares** (em todo o site, do backend): Mostrar de 5 a 10 termos em alta quando o campo estiver em foco. Estilo de pilha/tag.

Exibir ambos quando: o campo de entrada estiver vazio (menu suspenso no desktop) e o modal estiver aberto no celular.

## Pesquisa no celular

**Padrão de modal em tela cheia:**

- Cabeçalho: botão Voltar (44x44px) + campo de pesquisa (48px de altura, foco automático, `type="search"`)
- Conteúdo: pesquisas recentes/populares (vazio), autocompletar (ao digitar), rolável
- Fechar: botão Voltar, gesto de voltar no dispositivo, tecla Escape

## Lista de verificação para pesquisa em comércio eletrônico

**Recursos essenciais:**

- [ ] Campo de pesquisa em destaque na barra de navegação (desktop)
- [ ] Ícone de pesquisa claramente visível (dispositivos móveis)
- [ ] Modal em tela cheia ao tocar no dispositivo móvel
- [ ] Preenchimento automático após 2-3 caracteres
- [ ] Chamadas de API com retardo (300 ms)
- [ ] Sugestões de produtos com imagens e preços
- [ ] Link “Ver todos os resultados” no menu suspenso
- [ ] A página de resultados da busca exibe a consulta
- [ ] Número de resultados exibido
- [ ] Ordenar por relevância (padrão para pesquisa)
- [ ] Filtros para refinar os resultados (categoria, preço, marca)
- [ ] Página vazia com orientações úteis
- [ ] Indicador de carregamento (esqueleto)
- [ ] Pesquisas recentes (localStorage)
- [ ] Pesquisas populares (do backend)
- [ ] Celular: foco automático, campo de entrada grande (48 px)
- [ ] Navegação por teclado (teclas de seta, Enter, Escape)
- [ ] Rótulos ARIA (`role="search"`, `aria-label`)
- [ ] Acessível a leitores de tela
