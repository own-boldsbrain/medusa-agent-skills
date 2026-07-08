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

  const properties = schema.properties.recovery_candidates.items.properties;
  const requiredFields = schema.properties.recovery_candidates.items.required || [];

  const paths = new Set();

  for (const [index, candidate] of registry.recovery_candidates.entries()) {
    // 1. Required fields
    for (const field of requiredFields) {
      if (candidate[field] === undefined) {
        throw new Error(`Candidate at index ${index} missing required field '${field}'.`);
      }
    }

    // 2. Enums validation
    for (const field in properties) {
      if (properties[field].enum && candidate[field] !== undefined) {
        if (!properties[field].enum.includes(candidate[field])) {
          throw new Error(`Invalid value '${candidate[field]}' for field '${field}' at index ${index}. Allowed: ${properties[field].enum.join(", ")}`);
        }
      }
    }

    // 3. Uniqueness
    if (paths.has(candidate.path)) {
      throw new Error(`Duplicate path found: '${candidate.path}' at index ${index}.`);
    }
    paths.add(candidate.path);

    // 4. If source_evidence is expected to exist locally, check it?
    if (candidate.source_evidence) {
      const fullPath = path.join(projectRoot, candidate.source_evidence);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`source_evidence file not found: '${candidate.source_evidence}' at index ${index}.`);
      }
    }
  }

  console.log("✅ Translated Skill Loss Registry is valid.");
  process.exit(0);

} catch (err) {
  console.error("❌ INVALID REGISTRY:", err.message);
  process.exit(1);
}
