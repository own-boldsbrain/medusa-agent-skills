# Lesson 1: Build Custom Features with Medusa

## Objetivos de Aprendizado

Nesta lição, o objetivo é entender como uma feature nasce no backend Medusa seguindo o padrão `Module -> Workflow -> API Route`.

## Visão Arquitetural

Você vai construir um módulo de domínio, expor uma mutação via workflow e disponibilizar uma rota HTTP validada.

## O Padrão

- module para persistência e CRUD;
- workflow para orquestração e rollback;
- rota para validação e interface externa.

## Por Que Esse Padrão

Esse arranjo reduz acoplamento, melhora reuso e torna o sistema mais fácil de manter.

## Adaptação Yello Solar Hub

Em vez de `brand`, você pode praticar com `manufacturer`, `distributor` ou um módulo de kits solares.
