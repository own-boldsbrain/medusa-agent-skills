import test from "node:test";
import assert from "node:assert";
import * as path from "path";
import { scanMedusaProject } from "../packages/medusa-repo-scanner/src/scanner.js";

const FIXTURE_PATH = path.resolve(process.cwd(), "tests/fixtures/golden-medusa-project");

test("medusa-repo-scanner extracts basic project structure", () => {
  const report = scanMedusaProject(FIXTURE_PATH);
  
  assert.strictEqual(report.project_root, FIXTURE_PATH);
  
  // API Routes
  assert.ok(report.api_routes.length >= 3, "Should detect at least 3 API routes");
  const routeFiles = report.api_routes.map((r: any) => r.path);
  assert.ok(routeFiles.some((f: string) => f.includes("admin/unsafe/route.ts")));
  assert.ok(routeFiles.some((f: string) => f.includes("store/custom/route.ts")));
  assert.ok(routeFiles.some((f: string) => f.includes("admin/safe/route.ts")));
  
  // Workflows
  assert.ok(report.workflows.length >= 2, "Should detect at least 2 workflows");
  const workflowFiles = report.workflows.map((w: any) => w.path);
  assert.ok(workflowFiles.some((f: string) => f.includes("create-product.ts")));
  assert.ok(workflowFiles.some((f: string) => f.includes("create-order.ts")));
});
