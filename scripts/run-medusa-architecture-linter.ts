import * as fs from "fs";
import * as path from "path";
import { scanMedusaProject } from "../packages/medusa-repo-scanner/src/scanner.ts";
import { runArchitectureLinter } from "../packages/medusa-architecture-linter/src/linter.ts";
import { validateArchitectureReportAgainstSchema } from "../packages/medusa-architecture-linter/src/validate-report.ts";
import { MedusaStructureReport } from "../packages/medusa-architecture-linter/src/types.ts";

console.log("Starting Medusa Architecture Rules Engine...");

const args = process.argv.slice(2);
const fromReportIdx = args.indexOf("--from-report");
const projectRootIdx = args.indexOf("--project-root");

let report: MedusaStructureReport;

if (fromReportIdx !== -1 && args[fromReportIdx + 1]) {
  const reportPath = path.resolve(args[fromReportIdx + 1]);
  console.log(`Loading structure report from: ${reportPath}`);
  if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found: ${reportPath}`);
    process.exit(1);
  }
  report = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as MedusaStructureReport;
} else {
  const projectRoot = projectRootIdx !== -1 && args[projectRootIdx + 1] 
    ? path.resolve(args[projectRootIdx + 1])
    : path.resolve(".");
    
  console.log(`Running structural scan on: ${projectRoot}`);
  report = scanMedusaProject(projectRoot) as unknown as MedusaStructureReport;
}

console.log("Running architecture rules engine...");
const validationReport = runArchitectureLinter(report);

const outDir = path.resolve("reports/generated");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, "architecture-validation.json");
fs.writeFileSync(outPath, JSON.stringify(validationReport, null, 2));

console.log(`Validation finished! Output written to: ${path.relative(process.cwd(), outPath)}`);
console.log(`Summary: ${validationReport.summary}`);

if (validationReport.violations.length > 0) {
  console.log("\nViolations:");
  for (const v of validationReport.violations) {
    const icon = v.severity === "P0" ? "❌ [P0]" : v.severity === "P1" ? "⚠️ [P1]" : "ℹ️ [" + v.severity + "]";
    console.log(`${icon} ${v.rule_id} -> ${v.description}`);
    console.log(`    File: ${v.file}`);
    console.log(`    Evidence: ${v.evidence}`);
    console.log(`    Remediation: ${v.remediation}`);
  }
}

console.log("\nValidating report against architecture-validation-report.schema.json...");
const { valid, errors } = validateArchitectureReportAgainstSchema(validationReport);

if (!valid) {
  console.error("Schema validation: FAILED ❌");
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
} else {
  console.log("Schema validation: PASSED ✅");
}

if (!validationReport.passed) {
  console.error("\nArchitecture validation FAILED due to P0 violations. ❌");
  process.exit(1);
} else {
  console.log("\nArchitecture validation PASSED. ✅");
}
