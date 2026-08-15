export const CANONICAL_SUFFIX = ".pt-br.md";
export const LEGACY_SUFFIX = ".pt-BR.md";

const TRANSLATION_NAME = /\.pt[-_]?br\.md$/i;

// This set is closed. New translations must use CANONICAL_SUFFIX.
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
  "plugins/medusa-dev/skills/new-user/SKILL.pt-BR.md"
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

export function isTranslatableSource(name) {
  return /\.md$/i.test(name) && !isTranslationName(name);
}

export function translationStem(name) {
  return name.replace(TRANSLATION_NAME, "");
}

export function findTranslation(sourceName, siblingNames) {
  const stem = sourceName.replace(/\.md$/i, "");
  return siblingNames.find((name) => isTranslationName(name) && translationStem(name) === stem) ?? null;
}
