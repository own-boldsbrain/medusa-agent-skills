import test from "node:test";
import assert from "node:assert";
import * as path from "path";
import { runApiRouteInspection } from "../packages/medusa-api-route-inspector/src/run-inspection.js";

const FIXTURE_PATH = path.resolve(process.cwd(), "tests/fixtures/golden-medusa-project");

test("medusa-api-route-inspector extracts accurate API route info", () => {
  const report = runApiRouteInspection(FIXTURE_PATH);
  
  // Unsafe admin route
  const unsafeAdmin = report.api_routes.find(r => r.path === "/admin/unsafe");
  assert.ok(unsafeAdmin, "Should detect unsafe admin route");
  assert.strictEqual(unsafeAdmin.scope, "admin", "Should have admin scope");
  assert.strictEqual(unsafeAdmin.auth_required, false, "Should lack auth");
  
  // Safe admin route
  const safeAdmin = report.api_routes.find(r => r.path === "/admin/safe");
  assert.ok(safeAdmin, "Should detect safe admin route");
  assert.strictEqual(safeAdmin.scope, "admin", "Should have admin scope");
  assert.strictEqual(safeAdmin.auth_required, true, "Should require auth");
  
  // Custom store mutation
  const customStore = report.api_routes.find(r => r.path === "/store/custom");
  assert.ok(customStore, "Should detect custom store route");
  assert.strictEqual(customStore.method, "POST", "Should be POST method");
  assert.strictEqual(customStore.zod_validator_required, false, "Should lack zod validator");
  assert.strictEqual(customStore.workflow_invoked, "unknown", "Should lack workflow invocation");
  assert.strictEqual(customStore.idempotency, false, "Should lack idempotency");
});
