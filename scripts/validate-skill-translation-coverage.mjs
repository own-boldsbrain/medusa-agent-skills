import fs from "fs";
import path from "path";

const root = process.cwd();
const base = path.join(root, "plugins");
const ignoreDirs = new Set(["node_modules", ".git"]);
const missing = [];
const badVariants = [];
const backups = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const rel = path.relative(root, full).replace(/\\/g, "/");

    if (!rel.includes("/skills/")) continue;

    if (/\.(bak|stub\.bak|tmp|temp|log)$/i.test(entry.name)) {
      backups.push(rel);
      continue;
    }

    if (/\.pt[-_]?BR\.md$|\.pt_BR\.md$|\.pt_br\.md$/.test(entry.name) && !entry.name.endsWith(".pt-br.md")) {
      badVariants.push(rel);
      continue;
    }

    if (!entry.name.endsWith(".md")) continue;
    if (entry.name.endsWith(".pt-br.md")) continue;
    if (entry.name.endsWith(".pt-BR.md")) continue;
    if (entry.name.endsWith(".pt_BR.md")) continue;
    if (entry.name.endsWith(".pt_br.md")) continue;

    const pt = full.replace(/\.md$/, ".pt-br.md");
    if (!fs.existsSync(pt)) {
      missing.push(rel);
    }
  }
}

walk(base);

if (missing.length || badVariants.length || backups.length) {
  console.error("❌ Translation coverage gate failed.");

  if (missing.length) {
    console.error("\nMissing .pt-br.md sidecars:");
    for (const item of missing) console.error(`- ${item}`);
  }

  if (badVariants.length) {
    console.error("\nNon-standard PT-BR variants:");
    for (const item of badVariants) console.error(`- ${item}`);
  }

  if (backups.length) {
    console.error("\nBackup/temp files in plugins:");
    for (const item of backups) console.error(`- ${item}`);
  }

  process.exit(1);
}

console.log("✅ Skill translation coverage is complete.");
