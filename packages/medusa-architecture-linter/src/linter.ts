import { 
  ArchitectureRule, 
  ArchitectureValidationReport, 
  ArchitectureViolation, 
  MedusaStructureReport,
  WorkflowSchemaInspectionReport,
  ApiRouteInspectionReport
} from "./types.js";
import { validateLayering } from "./rules/layering.js";
import { detectRouteServiceBypass } from "./rules/routing.js";
import { validateWorkflowMutations } from "./rules/workflows.js";
import { validateApiRoutes } from "./rules/api-routes.js";
import { validateDataModels } from "./rules/data-models.js";
import { validateAdvancedWorkflows } from "./rules/advanced-workflows.js";

const DEFAULT_RULES: ArchitectureRule[] = [
  validateLayering,
  detectRouteServiceBypass,
  validateWorkflowMutations,
  validateApiRoutes,
  validateDataModels,
  validateAdvancedWorkflows
];

export function runArchitectureLinter(
  report: MedusaStructureReport, 
  workflowReport?: WorkflowSchemaInspectionReport,
  apiRouteReport?: ApiRouteInspectionReport,
  rules: ArchitectureRule[] = DEFAULT_RULES
): ArchitectureValidationReport {
  const violations: ArchitectureViolation[] = [];

  const addViolation = (violation: ArchitectureViolation) => {
    violations.push(violation);
  };

  const context = { report, workflowReport, apiRouteReport, addViolation };

  for (const rule of rules) {
    try {
      rule(context);
    } catch (e: any) {
      addViolation({
        rule_id: "rule_execution_error",
        severity: "P3",
        category: "general",
        description: `Error executing architecture rule.`,
        file: "unknown",
        evidence: e?.message || "Unknown error",
        remediation: "Check rule implementation."
      });
    }
  }

  const passed = !violations.some(v => v.severity === "P0");

  const severityCounts = {
    P0: violations.filter(v => v.severity === "P0").length,
    P1: violations.filter(v => v.severity === "P1").length,
    P2: violations.filter(v => v.severity === "P2").length,
    P3: violations.filter(v => v.severity === "P3").length,
  };

  const summary = passed 
    ? `Architecture validation passed with ${severityCounts.P1} P1, ${severityCounts.P2} P2, and ${severityCounts.P3} P3 violations.`
    : `Architecture validation failed with ${severityCounts.P0} P0 violations.`;

  return {
    project_root: report.project_root,
    generated_at: new Date().toISOString(),
    linter_version: "0.1.0",
    source_report: {
      scanner_version: report.scanner_version,
      path: "reports/generated/medusa-structure.json"
    },
    source_reports: {
      structure: {
        version: report.scanner_version,
        path: "reports/generated/medusa-structure.json"
      },
      workflow_schema: {
        version: workflowReport?.inspector_version || "unknown",
        path: workflowReport ? "reports/generated/workflow-schema-inspection.json" : "unknown"
      },
      api_routes: {
        version: apiRouteReport?.inspector_version || "unknown",
        path: apiRouteReport ? "reports/generated/api-route-inspection.json" : "unknown"
      }
    },
    passed,
    violations,
    summary
  };
}
