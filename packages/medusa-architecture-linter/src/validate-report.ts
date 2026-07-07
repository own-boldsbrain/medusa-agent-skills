import AjvModule from "ajv";
import * as fs from "fs";
import * as path from "path";
import { ArchitectureValidationReport } from "./types.js";

// Workaround for AJV ESM/CJS interop issues in tsx
const Ajv = (AjvModule as any).default || AjvModule;

export function validateArchitectureReportAgainstSchema(report: ArchitectureValidationReport): { valid: boolean; errors: any[] } {
  const ajv = new Ajv({ allErrors: true });
  
  // Load the schema
  const schemaPath = path.resolve(process.cwd(), "schemas/architecture-validation-report.schema.json");
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`);
  }
  
  const schemaStr = fs.readFileSync(schemaPath, "utf-8");
  const schema = JSON.parse(schemaStr);
  
  const validate = ajv.compile(schema);
  const valid = validate(report);
  
  return {
    valid: !!valid,
    errors: validate.errors || []
  };
}
