# Translation Forensic Report

Gerado em: 2026-07-06 03:39:32

## Resumo Global
- **Total de Pares**: 69
- 🟢 **Passed**: 13
- 🟡 **Needs Review**: 7
- 🔴 **Failed**: 49

## Token FinOps
- **Tokens se retraduzir tudo**: 232587
- **Tokens após triagem (High-Token P0)**: 189616
- **Tokens economizados (Zero-Token P1/P2)**: 42971

## Ocorrências (Por Arquivo vs Frequência Absoluta)
| Problema | Arquivos Afetados | Total de Ocorrências |
|---|---|---|
| toc_anchor_mismatch | 15 | 73 |
| conversational_filler_detected | 1 | 1 |
| list_count_drop | 20 | 20 |
| truncated_target | 8 | 8 |
| heading_count_mismatch | 42 | 42 |
| english_residual_detected | 14 | 14 |
| code_block_mismatch | 39 | 39 |
| markdown_violations | 40 | 40 |
| heading_level_mismatch | 3 | 5 |
| low_line_ratio | 5 | 5 |

## Top 20 Arquivos Mais Críticos (Risco Máximo = 100)
- **Score: 100** | `README.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations
- **Score: 100** | `README.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: markdown_violations, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
- **Score: 100** | `connecting-to-backend.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations, conversational_filler_detected
- **Score: 100** | `design.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `mobile-responsiveness.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
- **Score: 100** | `seo.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `breadcrumbs.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: list_count_drop, markdown_violations, low_line_ratio
- **Score: 100** | `country-selector.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `navbar.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `popups.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch
- **Score: 100** | `product-card.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `product-reviews.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: english_residual_detected, heading_count_mismatch
- **Score: 100** | `product-slider.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, english_residual_detected
- **Score: 100** | `promotions.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `wishlist.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, heading_count_mismatch, english_residual_detected, code_block_mismatch, markdown_violations
- **Score: 100** | `home-page.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: truncated_target, list_count_drop, heading_count_mismatch
- **Score: 100** | `order-confirmation.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: truncated_target, code_block_mismatch, list_count_drop, heading_count_mismatch
- **Score: 100** | `product-details.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: truncated_target, code_block_mismatch, list_count_drop, heading_count_mismatch
- **Score: 100** | `product-listing.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: truncated_target, code_block_mismatch, list_count_drop, heading_count_mismatch
