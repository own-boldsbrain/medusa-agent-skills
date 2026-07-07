import AjvModule from "ajv";
import * as fs from "fs";
import * as path from "path";
import { ApiRouteInspectionReport } from "./types.js";

// Workaround for AJV ESM/CJS interop issues in tsx
const Ajv = (AjvModule as any).default || AjvModule;

export function validateSchema(report: ApiRouteInspectionReport, projectRoot: string): { valid: boolean; errors: any[] } {
  const ajv = new Ajv({ allErrors: true });
  
  // Load medusa-route.schema.json first, as it is referenced
  const routeSchemaPath = path.resolve(projectRoot, "schemas/medusa-route.schema.json");
  if (!fs.existsSync(routeSchemaPath)) {
    throw new Error(`Schema file not found at ${routeSchemaPath}`);
  }
  const routeSchemaStr = fs.readFileSync(routeSchemaPath, "utf-8");
  const routeSchema = JSON.parse(routeSchemaStr);
  ajv.addSchema(routeSchema, "medusa-route.schema.json");

  // Load the main schema
  const schemaPath = path.resolve(projectRoot, "schemas/api-route-inspection-report.schema.json");
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
