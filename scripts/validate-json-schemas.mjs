import * as fs from "fs";
import * as path from "path";

console.log("Starting JSON Schema validation...");

const projectRoot = path.resolve(".");
const dirsToScan = ["registries", "schemas"];

let hasErrors = false;

for (const dirName of dirsToScan) {
  const dirPath = path.join(projectRoot, dirName);
  if (!fs.existsSync(dirPath)) {
    continue;
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(content);

      // Basic checks for schema files
      if (dirName === "schemas") {
        if (json.$schema && !json.$schema.includes("json-schema.org")) {
          console.error(`ERROR: ${file} does not declare a valid json-schema.org schema uri.`);
          hasErrors = true;
        }

        // Ensure no uppercase types
        const rawContent = JSON.stringify(json);
        if (/"type":\s*"(?!object|string|array|boolean|integer|number|null)[A-Z]+[a-zA-Z]*"/.test(rawContent)) {
          console.error(`ERROR: ${file} contains uppercase type declarations.`);
          hasErrors = true;
        }
      }

      console.log(`VALID JSON: ${dirName}/${file}`);
    } catch (err) {
      console.error(`INVALID JSON: ${dirName}/${file} - ${err}`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error("Validation failed with errors.");
  process.exit(1);
} else {
  console.log("All JSON files are valid.");
  process.exit(0);
}
