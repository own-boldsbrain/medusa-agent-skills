import { 
  ArchitectureRule, 
  ArchitectureValidationReport, 
  ArchitectureViolation, 
  MedusaStructureReport 
} from "./types.js";
import { validateLayering } from "./rules/layering.js";
import { detectRouteServiceBypass } from "./rules/routing.js";
import { validateWorkflowMutations } from "./rules/workflows.js";

const DEFAULT_RULES: ArchitectureRule[] = [
  validateLayering,
  detectRouteServiceBypass,
  validateWorkflowMutations
];

export function runArchitectureLinter(
  report: MedusaStructureReport, 
  rules: ArchitectureRule[] = DEFAULT_RULES
): ArchitectureValidationReport {
  const violations: ArchitectureViolation[] = [];

  const addViolation = (violation: ArchitectureViolation) => {
    violations.push(violation);
  };

  const context = { report, addViolation };

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
      path: "unknown" // Will be populated by the runner if known
    },
    passed,
    violations,
    summary
  };
}
