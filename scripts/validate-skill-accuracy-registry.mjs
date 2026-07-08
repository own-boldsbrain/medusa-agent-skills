import * as fs from "fs";
import * as path from "path";

console.log("Starting Skill Accuracy Registry validation...");

const projectRoot = path.resolve(".");
const registryPath = path.join(projectRoot, "registries", "skills-accuracy.registry.json");
const schemaPath = path.join(projectRoot, "schemas", "skill-accuracy.schema.json");

if (!fs.existsSync(registryPath)) {
  console.error(`ERROR: ${registryPath} not found.`);
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error(`ERROR: ${schemaPath} not found.`);
  process.exit(1);
}

let schema;
let registry;

try {
  schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
} catch (err) {
  console.error("ERROR: Failed to parse JSON files.", err);
  process.exit(1);
}

let hasErrors = false;

// 1. Verify top level property
if (!registry.skills_accuracy || !Array.isArray(registry.skills_accuracy)) {
  console.error("ERROR: 'skills_accuracy' array is missing or invalid in registry.");
  process.exit(1);
}

const requiredFields = schema.properties.skills_accuracy.items.required || [];

registry.skills_accuracy.forEach((item, index) => {
  // 2. Check required fields
  for (const field of requiredFields) {
    if (item[field] === undefined) {
      console.error(`ERROR: Missing required field '${field}' at skills_accuracy[${index}]`);
      hasErrors = true;
    }
  }

  // 3. Validate enums
  const statusEnum = schema.properties.skills_accuracy.items.properties.status.enum;
  if (item.status && !statusEnum.includes(item.status)) {
    console.error(`ERROR: Invalid status '${item.status}' at skills_accuracy[${index}]. Must be one of: ${statusEnum.join(", ")}`);
    hasErrors = true;
  }

  const evidenceEnum = schema.properties.skills_accuracy.items.properties.evidence_level.enum;
  if (item.evidence_level && !evidenceEnum.includes(item.evidence_level)) {
    console.error(`ERROR: Invalid evidence_level '${item.evidence_level}' at skills_accuracy[${index}]. Must be one of: ${evidenceEnum.join(", ")}`);
    hasErrors = true;
  }
  
  // 4. Validate paths exist (file system check)
  const pathsToCheck = ['source_skill_path', 'translated_skill_path', 'framework_accuracy_report', 'skill_accuracy_report'];
  for (const p of pathsToCheck) {
    if (item[p]) {
      const fullPath = path.join(projectRoot, item[p]);
      if (!fs.existsSync(fullPath)) {
        console.error(`ERROR: File referenced in '${p}' not found: ${item[p]} at skills_accuracy[${index}]`);
        hasErrors = true;
      }
    }
  }
});

if (hasErrors) {
  console.error("❌ Validation failed with errors.");
  process.exit(1);
} else {
  console.log("✅ Skill Accuracy Registry is valid.");
  process.exit(0);
}
