import * as fs from "fs";
import * as path from "path";
import { scanMedusaProject } from "../packages/medusa-repo-scanner/src/scanner.js";
import { runWorkflowSchemaInspection } from "../packages/medusa-workflow-schema-inspector/src/run-inspection.js";
import { runApiRouteInspection } from "../packages/medusa-api-route-inspector/src/run-inspection.js";
import { runArchitectureLinter } from "../packages/medusa-architecture-linter/src/linter.js";
import { validateArchitectureReportAgainstSchema } from "../packages/medusa-architecture-linter/src/validate-report.js";
import { 
  MedusaStructureReport,
  WorkflowSchemaInspectionReport,
  ApiRouteInspectionReport
} from "../packages/medusa-architecture-linter/src/types.js";

console.log("Starting Medusa Architecture Rules Engine...");

const args = process.argv.slice(2);
const fromReportIdx = args.indexOf("--from-report");
const fromWorkflowReportIdx = args.indexOf("--from-workflow-report");
const fromApiRouteReportIdx = args.indexOf("--from-api-route-report");
const projectRootIdx = args.indexOf("--project-root");
const skipWorkflowInspection = args.includes("--skip-workflow-inspection");
const skipApiRouteInspection = args.includes("--skip-api-route-inspection");

const projectRoot = projectRootIdx !== -1 && args[projectRootIdx + 1] 
  ? path.resolve(args[projectRootIdx + 1])
  : path.resolve(".");

let structureReport: MedusaStructureReport;
let workflowReport: WorkflowSchemaInspectionReport | undefined;
let apiRouteReport: ApiRouteInspectionReport | undefined;

// 1. Structure Report (BB-02)
if (fromReportIdx !== -1 && args[fromReportIdx + 1]) {
  const reportPath = path.resolve(args[fromReportIdx + 1]);
  console.log(`Loading structure report from: ${reportPath}`);
  if (!fs.existsSync(reportPath)) {
    console.error(`Structure report file not found: ${reportPath}`);
    process.exit(1);
  }
  structureReport = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as MedusaStructureReport;
} else {
  console.log(`Running structural scan on: ${projectRoot}`);
  structureReport = scanMedusaProject(projectRoot) as unknown as MedusaStructureReport;
}

// 2. Workflow Report (BB-04)
if (!skipWorkflowInspection) {
  if (fromWorkflowReportIdx !== -1 && args[fromWorkflowReportIdx + 1]) {
    const reportPath = path.resolve(args[fromWorkflowReportIdx + 1]);
    console.log(`Loading workflow schema report from: ${reportPath}`);
    if (!fs.existsSync(reportPath)) {
      console.error(`Workflow report file not found: ${reportPath}`);
      process.exit(1);
    }
    workflowReport = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as WorkflowSchemaInspectionReport;
  } else {
    console.log(`Running workflow schema inspection on: ${projectRoot}`);
    workflowReport = runWorkflowSchemaInspection(projectRoot) as WorkflowSchemaInspectionReport;
  }
}

// 3. API Route Report (BB-05)
if (!skipApiRouteInspection) {
  if (fromApiRouteReportIdx !== -1 && args[fromApiRouteReportIdx + 1]) {
    const reportPath = path.resolve(args[fromApiRouteReportIdx + 1]);
    console.log(`Loading API route report from: ${reportPath}`);
    if (!fs.existsSync(reportPath)) {
      console.error(`API route report file not found: ${reportPath}`);
      process.exit(1);
    }
    apiRouteReport = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as ApiRouteInspectionReport;
  } else {
    console.log(`Running API route inspection on: ${projectRoot}`);
    apiRouteReport = runApiRouteInspection(projectRoot) as ApiRouteInspectionReport;
  }
}

console.log("Running architecture rules engine...");
const validationReport = runArchitectureLinter(
  structureReport, 
  workflowReport, 
  apiRouteReport
);

const outDir = path.resolve(projectRoot, "reports/generated");
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
