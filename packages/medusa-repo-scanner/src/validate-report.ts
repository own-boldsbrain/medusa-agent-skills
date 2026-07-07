import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import AjvModule from "ajv";

// AJV CJS/ESM interop: the CJS module exports { default: AjvClass, ... }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Ajv = (AjvModule as any).default || AjvModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validate a MedusaStructureReport object against the canonical JSON Schema.
 * Returns an object with `valid` boolean and `errors` array.
 */
export function validateReportAgainstSchema(report: unknown): {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
} {
  const schemaPath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "schemas",
    "medusa-structure-report.schema.json"
  );

  if (!fs.existsSync(schemaPath)) {
    return {
      valid: false,
      errors: [
        {
          path: "",
          message: `Schema file not found at: ${schemaPath}`,
        },
      ],
    };
  }

  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const schema = JSON.parse(schemaContent);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(report);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (validate.errors || []).map((err: { instancePath?: string; message?: string }) => ({
    path: err.instancePath || "/",
    message: err.message || "Unknown validation error",
  }));

  return { valid: false, errors };
}
