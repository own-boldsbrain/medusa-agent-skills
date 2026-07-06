# Translation Forensic Report

Gerado em: 2026-07-06 03:53:57

## Resumo Global
- **Total de Pares**: 69
- 🟢 **Passed**: 16
- 🟡 **Needs Review**: 11
- 🔴 **Failed**: 42

## Token FinOps
- **Tokens se retraduzir tudo**: 224720
- **Tokens após triagem (High-Token P0)**: 167137
- **Tokens economizados (Zero-Token P1/P2)**: 57583

## Ocorrências (Por Arquivo vs Frequência Absoluta)
| Problema | Arquivos Afetados | Total de Ocorrências |
|---|---|---|
| code_block_mismatch | 33 | 33 |
| conversational_filler_detected | 1 | 1 |
| english_residual_detected | 15 | 15 |
| invalid_suffix | 2 | 2 |
| list_count_drop | 14 | 14 |
| truncated_target | 2 | 2 |
| low_line_ratio | 5 | 5 |
| heading_count_mismatch | 36 | 36 |
| toc_anchor_mismatch | 15 | 73 |
| heading_level_mismatch | 3 | 5 |
| markdown_violations | 40 | 40 |

## Top 20 Arquivos Mais Críticos (Risco Máximo = 100)
- **Score: 100** | `README.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: markdown_violations, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
- **Score: 100** | `connecting-to-backend.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, conversational_filler_detected, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `design.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `mobile-responsiveness.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
- **Score: 100** | `seo.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `breadcrumbs.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: markdown_violations, low_line_ratio, list_count_drop
- **Score: 100** | `country-selector.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `navbar.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `popups.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, heading_count_mismatch, toc_anchor_mismatch
- **Score: 100** | `product-card.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `product-reviews.pt-br.md` 
  - Ação: `repair_by_script`
  - Issues: english_residual_detected, heading_count_mismatch
- **Score: 100** | `product-slider.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch
- **Score: 100** | `promotions.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `wishlist.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `static-pages.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, english_residual_detected, list_count_drop, low_line_ratio, heading_count_mismatch, toc_anchor_mismatch, markdown_violations
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, list_count_drop, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
- **Score: 100** | `SKILL.pt-br.md` 
  - Ação: `retranslate_from_source`
  - Issues: code_block_mismatch, markdown_violations, heading_count_mismatch
