import * as fs from "fs";
import * as path from "path";

console.log("Starting Agent Executor Registry validation...");

const projectRoot = path.resolve(".");
const registryPath = path.join(projectRoot, "registries", "agent-executors.registry.json");
const schemaPath = path.join(projectRoot, "schemas", "agent-executor.schema.json");

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
if (!registry.agent_executors || !Array.isArray(registry.agent_executors)) {
  console.error("ERROR: 'agent_executors' array is missing or invalid in registry.");
  process.exit(1);
}

const requiredFields = schema.properties.agent_executors.items.required || [];

registry.agent_executors.forEach((item, index) => {
  // 2. Check required fields
  for (const field of requiredFields) {
    if (item[field] === undefined) {
      console.error(`ERROR: Missing required field '${field}' at agent_executors[${index}]`);
      hasErrors = true;
    }
  }

  // 3. Validate enums
  if (item.status) {
    const statusEnum = schema.properties.agent_executors.items.properties.status.enum;
    if (!statusEnum.includes(item.status)) {
      console.error(`ERROR: Invalid status '${item.status}' at agent_executors[${index}]. Must be one of: ${statusEnum.join(", ")}`);
      hasErrors = true;
    }
  }
});

if (hasErrors) {
  console.error("❌ Validation failed with errors.");
  process.exit(1);
} else {
  console.log("✅ Agent Executor Registry is valid.");
  process.exit(0);
}
