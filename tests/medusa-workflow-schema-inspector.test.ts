import test from "node:test";
import assert from "node:assert";
import * as path from "path";
import { runWorkflowSchemaInspection } from "../packages/medusa-workflow-schema-inspector/src/run-inspection.js";

const FIXTURE_PATH = path.resolve(process.cwd(), "tests/fixtures/golden-medusa-project");

test("medusa-workflow-schema-inspector extracts accurate workflow and data model info", () => {
  const report = runWorkflowSchemaInspection(FIXTURE_PATH);
  
  // Workflows
  const createProductWf = report.workflows.find(w => w.name === "create-product");
  assert.ok(createProductWf, "Should detect create-product workflow");
  
  const createProductStep = createProductWf.steps_defined.find(s => s.variable_name === "createProductStep" || s.step_name === "create-product-step");
  assert.ok(createProductStep, "Should detect createProductStep");
  assert.strictEqual(createProductStep.has_compensation, false, "Should detect missing compensation");
  assert.strictEqual(createProductStep.uses_container, true, "Should detect container usage");
  
  const createOrderWf = report.workflows.find(w => w.name === "create-order");
  assert.ok(createOrderWf, "Should detect create-order workflow");
  
  const createOrderStep = createOrderWf.steps_defined.find(s => s.variable_name === "createOrderStep" || s.step_name === "create-order-step");
  assert.ok(createOrderStep, "Should detect createOrderStep");
  assert.strictEqual(createOrderStep.has_compensation, true, "Should detect provided compensation");
  
  // Data Models
  const productModel = report.data_models.find(m => m.model_name === "Product");
  assert.ok(productModel, "Should detect product data model");
  assert.strictEqual(productModel.migration_files.length, 0, "Should detect no migrations for product model");
  
  const orderModel = report.data_models.find(m => m.model_name === "Order");
  assert.ok(orderModel, "Should detect order data model");
  assert.ok(orderModel.migration_files.length > 0, "Should detect migrations for order model");
});
