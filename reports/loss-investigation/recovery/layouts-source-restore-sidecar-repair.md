# Layouts Source Restore and Sidecar Repair

Original repair commit: `68236a3` — BB: **BB-16.1** — Dedicated PR: **pending**

Evidence package required by `ROADMAP_DOD.md` section 7 (Translation Recovery Policy).

## Context

Commit `df5499e` overwrote four EN reference sources with partial PT-BR content. The EN
sources were restored from `df5499e^`. Two of those restorations left orphaned PT-BR
sidecars requiring an editorial decision.

## Historical candidate assessment

Both historical versions were measured against the current EN sources before any merge
was considered. Neither is a translation.

| Candidate | Claimed | Measured | Verdict |
|---|---|---|---|
| `d5ab2a8:.../product-listing.md` | complete PT-BR, 581 lines | 27 of 581 lines in Portuguese; remainder byte-identical EN | rejected |
| `df5499e:.../static-pages.md` | PT-BR, 375 lines, more complete | 22 of 375 lines in Portuguese; remainder byte-identical EN | rejected |

The line-count surplus over the current EN sources (581 vs 521, 375 vs 357) is blank-line
formatting, not content.

## Structural diff

### static-pages.pt-BR.md — repaired in place

Defects before repair: all 9 table-of-contents anchors pointed at English slugs while the
headings are Portuguese, one link was malformed (`] (` with a space), and ~30 bold runs were
glued to the following list, collapsing those lists into running text.

| Metric | Source | Target | Parity |
|---|---|---|---|
| Lines | 357 | 357 | exact |
| H1 / H2 / H3 | 1 / 10 / 15 | 1 / 10 / 15 | exact |
| Code fences | 4 | 4 | exact |
| Internal links | 9 | 9 | all resolve |

Canary verdict: **PASSED**

### product-listing.pt-BR.md — left unchanged

| Metric | Source | Target | Parity |
|---|---|---|---|
| Lines | 521 | 26 | none |
| H1 / H2 / H3 | 1 / 12 / 24 | 1 / 4 / 0 | none |
| Code fences | 5 | 0 | none |
| Internal links | 12 | 0 | none |

Canary verdict: **FAILED**

The target is not a translation. It is a custom "Casos de Uso Yello Solar Hub" summary
belonging to a deliberate stub family alongside `home-page`, `order-confirmation` and
`product-details`. It fails parity by construction, not by defect — but it would fail any
canary suite that included it, so admitting it to one requires an editorial decision first.

## Validation performed

- **Headings** — per-level counts compared source vs target.
- **Code fences** — counts compared source vs target.
- **Links** — every internal anchor resolved against target and source heading slugs.
- **PT-BR residual scan** — filler, meta-LLM and English-residual checks via
  `validate-markdown-integrity.mjs`.

## Risk classification

| Target | Risk | Rationale |
|---|---|---|
| `static-pages.pt-BR.md` | **low** | Formatting-only repair; Portuguese prose preserved verbatim, structure now mirrors EN exactly. |
| `product-listing.pt-BR.md` | **medium** | Untouched but structurally divergent from its source; the whole Yello stub family shares this exposure. |
| EN sources restored | **low** | Restored from `df5499e^`; both learn-medusa sidecars verified intact as full translations (415 and 634 lines), so no orphans were created. |

## Open items

1. The repaired pairs are covered by the `canary_pairs` manifest in the JSON evidence package.
2. `product-listing.pt-BR.md` remains explicitly excluded because it is a custom Yello
   summary, not a translation; preserving it avoids silent editorial data loss.
3. Record the dedicated PR number in this package and in `roadmap.md` after opening it.
