import * as fs from "fs";
import * as path from "path";
import AjvModule from "ajv";

// Handle ESM/CJS interop for Ajv
const Ajv = (AjvModule as any).default || AjvModule;

export function validateSchema(report: any, projectRoot: string): { valid: boolean; errors: any[] } {
  const schemaPath = path.join(projectRoot, "schemas", "workflow-schema-inspection-report.schema.json");
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const schema = JSON.parse(schemaContent);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(report);

  return {
    valid: !!valid,
    errors: validate.errors || [],
  };
}
