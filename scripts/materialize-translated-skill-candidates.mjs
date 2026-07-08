import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const root = process.cwd();
const registryPath = path.join(root, "registries", "translated-skill-recovery.registry.json");
const outRoot = path.join(root, "reports", "loss-investigation", "materialized");

const forbiddenPatterns = [
  /C:\\Users\\/i,
  /file:\/\/\//i,
  /\.env/i,
  /Authorization/i,
  /Bearer\s+/i,
  /x-goog-api-key/i,
  /api[_-]?key/i,
  /access[_-]?token/i,
  /secret/i,
  /password/i
];

function safeName(input) {
  return input
    .replace(/^[./\\]+/, "")
    .replace(/[:*?"<>|]/g, "_")
    .replace(/[\\/]+/g, "__");
}

function hasSensitiveContent(content) {
  return forbiddenPatterns.some((pattern) => pattern.test(content));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function gitShow(ref, filePath) {
  return execFileSync("git", ["show", `${ref}:${filePath}`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
ensureDir(outRoot);

const manifest = {
  generated_at: new Date().toISOString(),
  mode: "materialize_only",
  output_root: "reports/loss-investigation/materialized",
  candidates: []
};

for (const candidate of registry.recovery_candidates || []) {
  const item = {
    path: candidate.path,
    candidate_type: candidate.candidate_type,
    status: "skipped",
    materialized_path: null,
    reason: null
  };

  try {
    if (candidate.candidate_type === "backup_recovery") {
      if (!fs.existsSync(candidate.path)) {
        item.status = "failed";
        item.reason = "backup_file_not_found";
      } else {
        const content = fs.readFileSync(candidate.path, "utf8");
        if (hasSensitiveContent(content)) {
          item.status = "failed";
          item.reason = "sensitive_content_detected";
        } else {
          const outPath = path.join(outRoot, "backups", safeName(candidate.path));
          ensureDir(path.dirname(outPath));
          fs.writeFileSync(outPath, content);
          item.status = "materialized";
          item.materialized_path = path.relative(root, outPath).replace(/\\/g, "/");
        }
      }
    } else if (candidate.candidate_type === "history_recovery") {
      const ref = candidate.last_seen_commit || candidate.source_ref;
      if (!ref) {
        item.status = "skipped";
        item.reason = "missing_last_seen_commit_or_source_ref";
      } else {
        const content = gitShow(ref, candidate.path);
        if (hasSensitiveContent(content)) {
          item.status = "failed";
          item.reason = "sensitive_content_detected";
        } else {
          const outPath = path.join(outRoot, "history", safeName(`${ref}__${candidate.path}`));
          ensureDir(path.dirname(outPath));
          fs.writeFileSync(outPath, content);
          item.status = "materialized";
          item.materialized_path = path.relative(root, outPath).replace(/\\/g, "/");
        }
      }
    } else {
      item.status = "failed";
      item.reason = "unknown_candidate_type";
    }
  } catch (error) {
    item.status = "failed";
    item.reason = error.message;
  }

  manifest.candidates.push(item);
}

fs.writeFileSync(
  path.join(outRoot, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);

let md = "# Translated Skill Materialization Manifest\n\n";
md += `Generated at: ${manifest.generated_at}\n\n`;
md += "| Path | Type | Status | Materialized Path | Reason |\n";
md += "|---|---|---|---|---|\n";

for (const item of manifest.candidates) {
  md += `| \`${item.path}\` | \`${item.candidate_type}\` | \`${item.status}\` | ${item.materialized_path ? `\`${item.materialized_path}\`` : ""} | ${item.reason || ""} |\n`;
}

fs.writeFileSync(path.join(outRoot, "manifest.md"), md);

const failedSensitive = manifest.candidates.filter((item) => item.reason === "sensitive_content_detected");
if (failedSensitive.length > 0) {
  console.error("Sensitive content detected in materialization candidates. Review required.");
  process.exit(1);
}

console.log(`Materialization complete: ${manifest.candidates.length} candidates processed.`);
