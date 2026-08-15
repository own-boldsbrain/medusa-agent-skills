import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_SUFFIX,
  findTranslation,
  FROZEN_LEGACY_PATHS,
  isCanonicalTranslationName,
  isLegacyTranslationName,
  isTranslatableSource,
  isTranslationName,
} from "./lib/translation-naming.mjs";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const base = path.join(root, "plugins");

const missing = [];
const badVariants = [];
const unfrozenLegacy = [];
const backups = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const names = entries.map((e) => e.name);

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (entry.name.includes(".backup")) {
      backups.push(rel);
      continue;
    }

    if (isTranslatableSource(entry.name)) {
      const match = findTranslation(entry.name, names);
      if (!match) {
        missing.push(rel);
      }
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

      // Check whether this sidecar actually has a matching source file.
      const stem = entry.name.replace(/\.pt[-_]?br\.md$/i, "");
      const expectedSource = `${stem}.md`;
      if (!names.includes(expectedSource)) {
        badVariants.push(`${rel} (orphaned sidecar without matching source: ${expectedSource})`);
      }
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
    console.error("\nUnwanted backup files found:");
    for (const item of backups) console.error(`- ${item}`);
  }

  process.exit(1);
}

console.log(
  `✅ Skill translation coverage is complete (${FROZEN_LEGACY_PATHS.size} legacy-named files grandfathered).`
);
