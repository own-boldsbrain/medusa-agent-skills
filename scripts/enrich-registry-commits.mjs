import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const registryPath = path.join(root, "registries", "translated-skill-recovery.registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

for (const candidate of registry.recovery_candidates) {
  if (candidate.candidate_type === "history_recovery") {
    try {
      // Get the last two commits that touched the file
      const out = execSync(`git log --all --format="%H" -- "${candidate.path}"`, { encoding: "utf8" }).trim().split('\n');
      if (out.length >= 2) {
        candidate.last_seen_commit = out[1];
      } else if (out.length === 1 && out[0] !== '') {
        candidate.last_seen_commit = out[0];
      }
    } catch(e) {
      console.error(`Failed to get commit for ${candidate.path}`, e);
    }
  }
  // Also add materialization fields
  candidate.materialization_status = "not_materialized";
  candidate.recovery_mode = "materialize_only";
}

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
console.log("Registry enriched with commits.");
