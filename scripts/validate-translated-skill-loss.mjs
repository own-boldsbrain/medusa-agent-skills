import * as fs from 'fs';
import * as path from 'path';

console.log("Starting Translated Skill Loss Registry validation...");

const projectRoot = path.resolve(".");
const registryPath = path.join(projectRoot, "registries", "translated-skill-recovery.registry.json");
const schemaPath = path.join(projectRoot, "schemas", "translated-skill-loss.schema.json");

if (!fs.existsSync(registryPath) || !fs.existsSync(schemaPath)) {
  console.error("ERROR: Registry or schema file missing.");
  process.exit(1);
}

try {
  const registryContent = fs.readFileSync(registryPath, 'utf-8');
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  const registry = JSON.parse(registryContent);
  const schema = JSON.parse(schemaContent);
  
  if (!registry.recovery_candidates || !Array.isArray(registry.recovery_candidates)) {
    throw new Error("Missing 'recovery_candidates' array.");
  }
  
  const allowedStatuses = ["pending_manual_review", "in_progress", "recovered", "discarded"];
  
  for (const candidate of registry.recovery_candidates) {
    if (!candidate.path || !candidate.status) {
      throw new Error("Candidate missing required fields.");
    }
    if (!allowedStatuses.includes(candidate.status)) {
      throw new Error(`Invalid status '${candidate.status}' for path '${candidate.path}'.`);
    }
  }
  
  console.log("✅ Translated Skill Loss Registry is valid.");
  process.exit(0);

} catch (err) {
  console.error("INVALID REGISTRY:", err.message);
  process.exit(1);
}
