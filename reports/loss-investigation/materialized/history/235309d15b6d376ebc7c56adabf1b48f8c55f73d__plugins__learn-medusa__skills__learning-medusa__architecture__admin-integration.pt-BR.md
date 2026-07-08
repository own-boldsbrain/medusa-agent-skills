# Architecture Deep Dive: Admin Integration

## Visão Geral

A integração com o Admin Medusa permite expor dados e ações operacionais sem desrespeitar a arquitetura backend.

## Widgets x UI Routes

- Widgets estendem páginas existentes.
- UI Routes criam telas completas.
- Ambos devem consumir APIs e workflows já existentes, não recriar lógica de negócio no frontend.

## Padrões

- use SDK da Medusa;
- carregue dados com React Query;
- invalide queries após mutações;
- preserve separação entre queries de display e queries de modal.

## Casos de Uso Yello Solar Hub

- widget com fabricante vinculado ao produto;
- tela administrativa para distribuidores;
- rota de cotações e aprovações comerciais.
