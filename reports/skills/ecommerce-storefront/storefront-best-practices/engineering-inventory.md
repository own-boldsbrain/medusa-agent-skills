# storefront-best-practices

Inventory for `ecommerce-storefront.storefront-best-practices`.

**Coverage**: 46.4% (13/28 blocks with items)
**Evidence Level**: direct
**Risk Level**: medium

## Engineering Inventory Blocks

### Variáveis

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Workflows

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 10
  - name: When to Apply, status: inferred
  - name: CRITICAL: Load Reference Files When Needed, status: inferred
  - name: Planning and Implementation Workflow, status: inferred
  - name: Critical Ecommerce-Specific Patterns, status: inferred
  - name: Pattern Selection Guides, status: inferred
  - ... e mais 5

### JTBDs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 6
  - when: Working with storefront-best-practices, i_want: ALWAYS use this skill when working on ecommerce storefronts, online stores, shopping sites. Use for ANY storefront component including checkout pages, cart, payment flows, product pages, product listi, so_that: I can implement the feature correctly
  - when: - **Adding checkout page/flow** - Payment, shipping, order placement, i_want: implement this correctly, so_that: the feature works as expected
  - when: **Implementing cart** - Cart page, cart popup, add to cart functionality, i_want: implement this correctly, so_that: the feature works as expected
  - when: **Building product pages** - Product details, product listings, product grids, i_want: implement this correctly, so_that: the feature works as expected
  - when: **Creating navigation** - Navbar, megamenu, footer, mobile menu, i_want: implement this correctly, so_that: the feature works as expected
  - ... e mais 1

### 05 use cases

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - use_case_id: UC-001, name: Accessibility, scenario: - **CRITICAL: Cart count updates require `aria-live="polite"`** - Screen readers won't announce without it
- Ensure keyboard navigation for all cart/checkout interactions
  - use_case_id: UC-002, name: Mobile, scenario: - **Sticky bottom elements MUST use `env(safe-area-inset-bottom)`** - iOS home indicator will cut off purchase buttons otherwise
- 44px minimum touch targets for cart actions, variant selectors, quant
  - use_case_id: UC-003, name: Performance, scenario: - **ALWAYS add `loading="lazy"` to product images below fold** - Don't rely on browser defaults
- Optimize product images for mobile (<500KB) - Most ecommerce traffic is mobile
  - use_case_id: UC-004, name: Conversion Optimization, scenario: - Clear CTAs throughout shopping flow
- Minimal friction in checkout (guest checkout if supported)
- Trust signals (reviews, security badges, return policy) near purchase buttons
- Clear pricing and s
  - use_case_id: UC-005, name: SEO, scenario: - **Product schema (JSON-LD) required** - Critical for Google Shopping and rich snippets
- Use [PageSpeed Insights](https://pagespeed.web.dev/) to measure Core Web Vitals

### Faz / Não Faz

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 2
  - rule: **CRITICAL: Cart count updates require `aria-live="polite"`** - Screen readers won't announce without it, status: direct
  - rule: Ensure keyboard navigation for all cart/checkout interactions, status: direct

### User Inputs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### System Outputs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - output_name: Markdown file, type: file, format: .md

### Outcomes Esperados

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - outcome: Skill executes correctly, status: inferred

### APIs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Endpoints

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### URLs

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 3
  - url: https://medusajs.com, type: reference, status: direct
  - url: https://pagespeed.web.dev/, type: reference, status: direct
  - url: https://docs.medusajs.com/mcp, type: reference, status: direct

### Conectores

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - connector_name: sdk.store.cart, type: sdk_call, status: inferred

### CRUD

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 5
  - operation: READ, status: direct
  - operation: UPDATE, status: direct
  - operation: APPROVE, status: direct
  - operation: DELETE, status: direct
  - operation: CREATE, status: direct

### GETs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### POSTs

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### CREATE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: CREATE, status: inferred

### UPDATE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: UPDATE, status: inferred

### APPROVE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: APPROVE, status: inferred

### REJECT

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### DELETE

- **Status**: direct
- **Evidência**: extraido_do_skill_md
- **Items**: 1
  - operation: DELETE, status: inferred

### Bancos de dados

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Schemas

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Relacionamentos

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Datasets

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### JSON files

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Tabelas

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Lógicas

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0

### Cálculos

- **Status**: missing
- **Evidência**: ausente
- **Items**: 0
