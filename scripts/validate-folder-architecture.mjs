#!/usr/bin/env node

import fs from "fs";
import path from "path";

const root = process.cwd();
const registryPath = path.join(root, "registries", "folder-architecture.registry.json");
const schemaPath = path.join(root, "schemas", "folder-architecture.schema.json");

console.log("Starting Folder Architecture validation (BB-14.2)...");

if (!fs.existsSync(registryPath)) {
  console.error(`ERROR: ${registryPath} not found.`);
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error(`ERROR: ${schemaPath} not found.`);
  process.exit(1);
}

let registry;
try {
  registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
} catch (err) {
  console.error("ERROR: Failed to parse registry.", err);
  process.exit(1);
}

const config = registry.folder_architecture;
if (!config) {
  console.error("ERROR: 'folder_architecture' key missing in registry.");
  process.exit(1);
}

const errors = [];
const warnings = [];

// ── 1. Check excluded paths never exist ──────────────────────────────────
function pathMatchesPattern(filePath, pattern) {
  const normalized = filePath.replace(/\\/g, "/");
  const regexSafe = pattern
    .replace(/\./g, "\\.")
    .replace(/\*\*/g, "(.+)")
    .replace(/\*/g, "[^/]+");
  return new RegExp("^" + regexSafe + "$").test(normalized);
}

for (const excluded of config.excluded_paths) {
  const parts = excluded.split("/");
  const fileName = parts[parts.length - 1];
  if (fileName.startsWith("*.")) {
    const ext = fileName.slice(1);
    const found = [];
    function scanExcluded(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== ".git") {
          scanExcluded(full);
        } else if (entry.name.endsWith(ext)) {
          if (pathMatchesPattern(path.relative(root, full).replace(/\\/g, "/"), excluded)) {
            found.push(path.relative(root, full));
          }
        }
      }
    }
    scanExcluded(root);
    for (const f of found) {
      errors.push(`Excluded path found: ${f} (matches pattern: ${excluded})`);
    }
  }
}

// ── 2. Check enforced paths exist ────────────────────────────────────────
for (const enforced of config.enforced_paths) {
  const full = path.join(root, enforced);
  if (!fs.existsSync(full)) {
    errors.push(`Enforced path missing: ${enforced}`);
  }
}

// ── 3. Check top-level structure ─────────────────────────────────────────
const topLevelEntries = fs.readdirSync(root, { withFileTypes: true });
for (const entry of topLevelEntries) {
  if (entry.name.startsWith(".")) continue;
  if (entry.name === "node_modules") continue;

  const relPath = entry.name;
  if (entry.isDirectory()) {
    if (!config.top_level_dirs.includes(relPath)) {
      warnings.push(`Unexpected top-level directory: ${relPath}/`);
    }
  } else {
    if (!config.top_level_files.includes(relPath)) {
      warnings.push(`Unexpected top-level file: ${relPath}`);
    }
  }
}

// ── 4. Check plugin structure ────────────────────────────────────────────
for (const plugin of config.plugins) {
  const pluginRoot = path.join(root, plugin.path);
  if (!fs.existsSync(pluginRoot)) {
    errors.push(`Plugin directory missing: ${plugin.path}`);
    continue;
  }

  // Check required files
  for (const reqFile of plugin.required_files) {
    const full = path.join(pluginRoot, reqFile);
    if (!fs.existsSync(full)) {
      errors.push(`Plugin "${plugin.name}" missing required file: ${plugin.path}/${reqFile}`);
    }
  }

  // Check skills
  if (plugin.skills) {
    for (const skill of plugin.skills) {
      const skillRoot = path.join(root, skill.path);
      if (!fs.existsSync(skillRoot)) {
        errors.push(`Skill directory missing: ${skill.path}`);
        continue;
      }

      for (const reqFile of skill.required_files) {
        const full = path.join(skillRoot, reqFile);
        if (!fs.existsSync(full)) {
          errors.push(`Skill "${skill.name}" missing required file: ${skill.path}/${reqFile}`);
        }
      }

      // Check forbidden patterns inside skill
      for (const fPattern of config.plugin_requirements.forbidden_patterns) {
        const regex = new RegExp(fPattern, "i");
        for (const entry of fs.readdirSync(skillRoot)) {
          if (regex.test(entry)) {
            errors.push(`Skill "${skill.name}" contains forbidden pattern "${fPattern}": ${skill.path}/${entry}`);
          }
        }
      }
    }
  }
}

// ── 5. Check schemas directory ───────────────────────────────────────────
const schemaDir = path.join(root, "schemas");
if (fs.existsSync(schemaDir)) {
  const actualSchemas = fs.readdirSync(schemaDir);
  const allowedExt = config.schemas.allowed_extensions;
  for (const file of actualSchemas) {
    const ext = path.extname(file);
    if (!allowedExt.includes(ext)) {
      errors.push(`Schema has disallowed extension: schemas/${file} (allowed: ${allowedExt.join(", ")})`);
    }
    if (!config.schemas.entries.includes(file)) {
      warnings.push(`Schema not in registry: schemas/${file}`);
    }
  }

  for (const entry of config.schemas.entries) {
    if (!actualSchemas.includes(entry)) {
      warnings.push(`Schema listed in registry but not on disk: schemas/${entry}`);
    }
  }
}

// ── 6. Check registries directory ────────────────────────────────────────
const registryDir = path.join(root, "registries");
if (fs.existsSync(registryDir)) {
  const actualRegistries = fs.readdirSync(registryDir);
  const allowedExt = config.registries.allowed_extensions;
  for (const file of actualRegistries) {
    const ext = path.extname(file);
    if (!allowedExt.includes(ext)) {
      errors.push(`Registry has disallowed extension: registries/${file} (allowed: ${allowedExt.join(", ")})`);
    }
    if (!config.registries.entries.includes(file)) {
      warnings.push(`Registry not in catalog: registries/${file}`);
    }
  }

  for (const entry of config.registries.entries) {
    if (!actualRegistries.includes(entry)) {
      warnings.push(`Registry listed in catalog but not on disk: registries/${entry}`);
    }
  }
}

// ── 7. Check scripts directory ───────────────────────────────────────────
const scriptDir = path.join(root, "scripts");
if (fs.existsSync(scriptDir)) {
  const actualScripts = fs.readdirSync(scriptDir);
  const allowedExt = config.scripts.allowed_extensions;
  for (const file of actualScripts) {
    const ext = path.extname(file);
    if (!allowedExt.includes(ext)) {
      errors.push(`Script has disallowed extension: scripts/${file} (allowed: ${allowedExt.join(", ")})`);
    }
    if (!config.scripts.entries.includes(file)) {
      warnings.push(`Script not in catalog: scripts/${file}`);
    }
  }

  for (const entry of config.scripts.entries) {
    if (!actualScripts.includes(entry)) {
      warnings.push(`Script listed in catalog but not on disk: scripts/${entry}`);
    }
  }
}

// ── 8. Check reports directory ───────────────────────────────────────────
const reportDir = path.join(root, "reports");
if (fs.existsSync(reportDir)) {
  // Check for forbidden files at reports root
  for (const entry of fs.readdirSync(reportDir)) {
    const full = path.join(reportDir, entry);
    if (entry.endsWith(".md") && entry !== "index.md") {
      warnings.push(`Markdown file at reports/ root (should be in a subdirectory): reports/${entry}`);
    }
  }

  // Check allowed subdirs
  for (const entry of fs.readdirSync(reportDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!config.reports.allowed_subdirs.includes(entry.name)) {
        warnings.push(`Unexpected reports subdirectory: reports/${entry.name}/`);
      }
    }
  }

  // Check each allowed subdir structure
  for (const subdir of config.reports.allowed_subdirs) {
    const subFull = path.join(reportDir, subdir);
    if (!fs.existsSync(subFull)) continue;
    const subConfig = config.reports.structure[subdir];
    if (!subConfig) continue;
    function validateReportFiles(dir) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          validateReportFiles(path.join(dir, entry.name));
        } else {
          if (entry.name === '.gitkeep') continue;
          const ext = path.extname(entry.name);
          if (!subConfig.allowed_extensions.includes(ext)) {
            errors.push(`Report has disallowed extension in reports/${subdir}/: ${entry.name} (allowed: ${subConfig.allowed_extensions.join(", ")})`);
          }
        }
      }
    }
    validateReportFiles(subFull);
  }
}

// ── 9. Summary ───────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error("\n❌ Folder Architecture validation FAILED.");
  for (const err of errors) {
    console.error(`  ERROR: ${err}`);
  }
}

if (warnings.length > 0) {
  console.log("\n⚠️  Warnings:");
  for (const warn of warnings) {
    console.log(`  ${warn}`);
  }
}

if (errors.length > 0) {
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(`\n✅ Folder Architecture validation passed (${warnings.length} warning(s)).`);
  process.exit(0);
}

console.log("\n✅ Folder Architecture validation passed.");
process.exit(0);
