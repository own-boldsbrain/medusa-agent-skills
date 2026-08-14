import fs from "fs";
import path from "path";
import {
  CANONICAL_SUFFIX,
  FROZEN_LEGACY_PATHS,
  findTranslation,
  isCanonicalTranslationName,
  isLegacyTranslationName,
  isTranslatableSource,
  isTranslationName,
} from "./lib/translation-naming.mjs";

const root = process.cwd();
const base = path.join(root, "plugins");
const ignoreDirs = new Set(["node_modules", ".git"]);
const missing = [];
const badVariants = [];
const unfrozenLegacy = [];
const backups = [];

const toRel = (full) => path.relative(root, full).replace(/\\/g, "/");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const fileNames = entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);

  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const rel = toRel(full);
    if (!rel.includes("/skills/")) continue;

    if (/\.(bak|stub\.bak|tmp|temp|log)$/i.test(entry.name)) {
      backups.push(rel);
      continue;
    }

    if (isTranslationName(entry.name)) {
      // Canonical naming is always fine. The legacy casing survives only for the
      // files that already used it when the gate was frozen; anything else is a
      // new deviation and must fail rather than quietly widen the standard.
      if (!isCanonicalTranslationName(entry.name)) {
        if (!isLegacyTranslationName(entry.name)) {
          badVariants.push(rel);
        } else if (!FROZEN_LEGACY_PATHS.has(rel)) {
          unfrozenLegacy.push(rel);
        }
      }
      continue;
    }

    if (!isTranslatableSource(entry.name)) continue;

    if (!findTranslation(entry.name, fileNames)) {
      missing.push(rel);
    }
  }
}

walk(base);

// A frozen entry that no longer exists means the list drifted from the tree.
const staleFrozen = [...FROZEN_LEGACY_PATHS].filter((rel) => !fs.existsSync(path.join(root, rel)));

if (missing.length || badVariants.length || unfrozenLegacy.length || staleFrozen.length || backups.length) {
  console.error("❌ Translation coverage gate failed.");

  if (missing.length) {
    console.error(`\nMissing ${CANONICAL_SUFFIX} sidecars:`);
    for (const item of missing) console.error(`- ${item}`);
  }

  if (badVariants.length) {
    console.error(`\nUnsupported PT-BR naming (use ${CANONICAL_SUFFIX}):`);
    for (const item of badVariants) console.error(`- ${item}`);
  }

  if (unfrozenLegacy.length) {
    console.error(`\nNew files using the legacy suffix (use ${CANONICAL_SUFFIX}):`);
    for (const item of unfrozenLegacy) console.error(`- ${item}`);
  }

  if (staleFrozen.length) {
    console.error("\nFrozen legacy paths that no longer exist (drop them from translation-naming.mjs):");
    for (const item of staleFrozen) console.error(`- ${item}`);
  }

  if (backups.length) {
    console.error("\nBackup/temp files in plugins:");
    for (const item of backups) console.error(`- ${item}`);
  }

  process.exit(1);
}

console.log(
  `✅ Skill translation coverage is complete (${FROZEN_LEGACY_PATHS.size} legacy-named files grandfathered).`
);
