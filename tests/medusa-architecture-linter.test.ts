import test from "node:test";
import assert from "node:assert";
import * as path from "path";
import { scanMedusaProject } from "../packages/medusa-repo-scanner/src/scanner.js";
import { runWorkflowSchemaInspection } from "../packages/medusa-workflow-schema-inspector/src/run-inspection.js";
import { runApiRouteInspection } from "../packages/medusa-api-route-inspector/src/run-inspection.js";
import { runArchitectureLinter } from "../packages/medusa-architecture-linter/src/linter.js";
import { validateArchitectureReportAgainstSchema } from "../packages/medusa-architecture-linter/src/validate-report.js";

const FIXTURE_PATH = path.resolve(process.cwd(), "tests/fixtures/golden-medusa-project");

test("medusa-architecture-linter correctly evaluates rules on golden fixture", () => {
  const structureReport = scanMedusaProject(FIXTURE_PATH) as any;
  const workflowReport = runWorkflowSchemaInspection(FIXTURE_PATH);
  const apiRouteReport = runApiRouteInspection(FIXTURE_PATH);
  
  const report = runArchitectureLinter(structureReport, workflowReport, apiRouteReport);
  
  const violations = report.violations;
  
  // Rule checks
  const ruleIds = violations.map(v => v.rule_id);
  
  // Expected violations
  assert.ok(ruleIds.includes("MEDUSA_API_ADMIN_ROUTE_WITHOUT_AUTH"), "Should flag missing auth on admin route");
  assert.ok(ruleIds.includes("MEDUSA_API_MUTATION_WITHOUT_ZOD_VALIDATION"), "Should flag missing Zod validation on mutation");
  assert.ok(ruleIds.includes("MEDUSA_API_MUTATION_WITHOUT_WORKFLOW"), "Should flag missing workflow on mutation");
  assert.ok(ruleIds.includes("MEDUSA_API_ROUTE_WITHOUT_IDEMPOTENCY"), "Should flag missing idempotency on mutation");
  assert.ok(ruleIds.includes("MEDUSA_API_ROUTE_WITHOUT_ERROR_CONTRACT"), "Should flag missing error contract");
  assert.ok(ruleIds.includes("MEDUSA_MODEL_WITHOUT_MIGRATION"), "Should flag missing model migration");
  assert.ok(ruleIds.includes("MEDUSA_WORKFLOW_MUTATION_STEP_WITHOUT_COMPENSATION"), "Should flag missing compensation on mutation step");
  
  // Check severities and affected entities
  const adminAuthViolation = violations.find(v => v.rule_id === "MEDUSA_API_ADMIN_ROUTE_WITHOUT_AUTH");
  assert.strictEqual(adminAuthViolation?.severity, "P0");
  
  const modelViolation = violations.find(v => v.rule_id === "MEDUSA_MODEL_WITHOUT_MIGRATION");
  assert.strictEqual(modelViolation?.severity, "P0");
  assert.strictEqual(modelViolation?.affected_entity, "Product");
  
  const stepViolation = violations.find(v => v.rule_id === "MEDUSA_WORKFLOW_MUTATION_STEP_WITHOUT_COMPENSATION");
  assert.strictEqual(stepViolation?.severity, "P1");
  assert.strictEqual(stepViolation?.affected_entity, "create-product-step");
  
  // Safe entities should not appear in violations
  const allAffected = violations.map(v => v.affected_entity).filter(Boolean);
  assert.ok(!allAffected.includes("Order"), "Safe model (order) should not be flagged");
  assert.ok(!allAffected.includes("createOrderStep"), "Safe step (create-order-step) should not be flagged");
  
  // Report validation
  assert.strictEqual(report.passed, false, "Report should fail due to P0 violations");
  
  const { valid, errors } = validateArchitectureReportAgainstSchema(report);
  assert.ok(valid, `Schema validation failed: ${JSON.stringify(errors)}`);
});
