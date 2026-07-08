# Architecture Deep Dive: Module Isolation

## O Que É Isolamento de Módulo

Isolamento significa que cada módulo mantém sua própria responsabilidade, ciclo de vida e modelo de dados sem acoplamento direto aos demais.

## Por Que Isso Importa

- evita dependências circulares;
- reduz efeito cascata de mudanças;
- facilita evolução independente;
- melhora clareza arquitetural.

## Como Trabalhar Dentro do Isolamento

- use `module links` para relacionar entidades;
- não chame serviços de outro módulo diretamente para representar vínculo estrutural;
- use `query.graph()` e `query.index()` conforme o caso.

## Casos de Uso Yello Solar Hub

- ligar fabricantes a produtos solares sem acoplar diretamente `manufacturer` a `product`;
- relacionar distribuidores a ofertas comerciais;
- conectar kits solares a regras de aprovação sem quebrar o encapsulamento.
