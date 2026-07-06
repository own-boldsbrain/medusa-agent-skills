# Translation Forensic Report

Gerado em: 2026-07-06 03:56:23

## Resumo Global
- **Total de Pares**: 69
- 🟢 **Passed**: 16
- 🟡 **Needs Review**: 12
- 🔴 **Failed**: 41

## Token FinOps
- **Tokens se retraduzir tudo**: 225593
- **Tokens após triagem (High-Token P0)**: 165867
- **Tokens economizados (Zero-Token P1/P2)**: 59726

## Ocorrências (Por Arquivo vs Frequência Absoluta)
| Problema | Arquivos Afetados | Total de Ocorrências |
|---|---|---|
| conversational_filler_detected | 1 | 1 |
| heading_level_mismatch | 3 | 5 |
| toc_anchor_mismatch | 15 | 73 |
| english_residual_detected | 15 | 15 |
| low_line_ratio | 5 | 5 |
| code_block_mismatch | 32 | 32 |
| truncated_target | 1 | 1 |
| heading_count_mismatch | 35 | 35 |
| invalid_suffix | 2 | 2 |
| markdown_violations | 41 | 41 |
| list_count_drop | 13 | 13 |

## Top 20 Arquivos Mais Críticos (Risco Máximo = 100)
- **Score: 100** | `README.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: markdown_violations, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: markdown_violations, code_block_mismatch, heading_count_mismatch
- **Score: 100** | `connecting-to-backend.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: conversational_filler_detected, toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `design.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `mobile-responsiveness.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: markdown_violations, code_block_mismatch, heading_count_mismatch
- **Score: 100** | `seo.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `breadcrumbs.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: low_line_ratio, markdown_violations, list_count_drop
- **Score: 100** | `country-selector.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `navbar.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `popups.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, heading_count_mismatch, toc_anchor_mismatch
- **Score: 100** | `product-card.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `product-reviews.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: heading_count_mismatch, english_residual_detected
- **Score: 100** | `product-slider.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: english_residual_detected, code_block_mismatch, heading_count_mismatch, toc_anchor_mismatch
- **Score: 100** | `promotions.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `wishlist.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: toc_anchor_mismatch, code_block_mismatch, heading_count_mismatch, markdown_violations, english_residual_detected
- **Score: 100** | `static-pages.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: english_residual_detected, low_line_ratio, code_block_mismatch, heading_count_mismatch, markdown_violations, list_count_drop, toc_anchor_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: markdown_violations, code_block_mismatch, heading_count_mismatch, list_count_drop
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: markdown_violations, code_block_mismatch, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: markdown_violations, code_block_mismatch, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: markdown_violations, code_block_mismatch, heading_count_mismatch
