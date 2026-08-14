/**
 * Single source of truth for PT-BR sidecar naming.
 *
 * validate-skill-translation-coverage.mjs and validate-markdown-integrity.mjs
 * both import from here, so the two gates cannot drift on what counts as a
 * translation file. Before this module the coverage gate accepted underscore
 * variants that the integrity gate classified as English sources, which would
 * have flagged every Portuguese line in them as contamination.
 */

export const CANONICAL_SUFFIX = ".pt-br.md";

/** Casing tolerated only for the frozen set of files below. */
export const LEGACY_SUFFIX = ".pt-BR.md";

/** Matches any attempt at a PT-BR sidecar, canonical or not. */
const TRANSLATION_NAME = /\.pt[-_]?br\.md$/i;

/**
 * Files that already used LEGACY_SUFFIX when the naming gate was frozen.
 * This list is closed: new translations must use CANONICAL_SUFFIX. Renaming
 * an entry away from the legacy suffix means deleting its line here too.
 */
export const FROZEN_LEGACY_PATHS = new Set([
  "plugins/design-log/README.pt-BR.md",
  "plugins/design-log/skills/design-log-create/SKILL.pt-BR.md",
  "plugins/design-log/skills/design-log-create/reference/template.pt-BR.md",
  "plugins/design-log/skills/design-log-workflow/SKILL.pt-BR.md",
  "plugins/design-log/skills/design-log-workflow/reference/schema.pt-BR.md",
  "plugins/ecommerce-storefront/README.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/breadcrumbs.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/cart-popup.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/cart.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/home-page.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/order-confirmation.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/product-details.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/product-listing.pt-BR.md",
  "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/static-pages.pt-BR.md",
  "plugins/learn-medusa/README.pt-BR.md",
  "plugins/learn-medusa/skills/learning-medusa/SKILL.pt-BR.md",
  "plugins/medusa-cloud/README.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-auth/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-deployments/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-environments/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-logs/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-organizations/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-projects/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/mcloud-variables/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/using-medusa-cloud/SKILL.pt-BR.md",
  "plugins/medusa-cloud/skills/using-medusa-cloud/reference/debugging-deployments.pt-BR.md",
  "plugins/medusa-cloud/skills/using-medusa-cloud/reference/environments-and-variables.pt-BR.md",
  "plugins/medusa-cloud/skills/using-medusa-cloud/reference/setup.pt-BR.md",
  "plugins/medusa-dev/README.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/SKILL.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/references/data-loading.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/references/display-patterns.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/references/forms.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/references/navigation.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/references/table-selection.pt-BR.md",
  "plugins/medusa-dev/skills/building-admin-dashboard-customizations/references/typography.pt-BR.md",
  "plugins/medusa-dev/skills/building-with-medusa/SKILL.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/SKILL.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/admin-extension.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/agent-setup.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/api-route.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/data-models.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/medusa-exec.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/service.pt-BR.md",
  "plugins/medusa-dev/skills/creating-internal-agents/reference/streaming.pt-BR.md",
  "plugins/medusa-dev/skills/db-generate/SKILL.pt-BR.md",
  "plugins/medusa-dev/skills/db-migrate/SKILL.pt-BR.md",
  "plugins/medusa-dev/skills/new-user/SKILL.pt-BR.md",
]);

export function isTranslationName(name) {
  return TRANSLATION_NAME.test(name);
}

export function isCanonicalTranslationName(name) {
  return name.endsWith(CANONICAL_SUFFIX);
}

export function isLegacyTranslationName(name) {
  return name.endsWith(LEGACY_SUFFIX);
}

/** The source document a translation is expected to accompany. */
export function isTranslatableSource(name) {
  return /\.md$/i.test(name) && !isTranslationName(name);
}

/** Strip whichever PT-BR suffix a sidecar uses, leaving the shared stem. */
export function translationStem(name) {
  return name.replace(TRANSLATION_NAME, "");
}

/**
 * Find the sidecar for `sourceName` among the real directory listing.
 *
 * fs.existsSync() must not be used here: it is case-insensitive on Windows and
 * macOS, so it reports `X.pt-br.md` present when only `X.pt-BR.md` exists. That
 * makes local runs silently disagree with Linux CI. Matching against the actual
 * dirent names behaves identically on every platform.
 */
export function findTranslation(sourceName, siblingNames) {
  const stem = sourceName.replace(/\.md$/i, "");
  return siblingNames.find((name) => isTranslationName(name) && translationStem(name) === stem) ?? null;
}
