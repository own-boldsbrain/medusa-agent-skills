import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const readJson = (path: string) => JSON.parse(fs.readFileSync(path, "utf8"));

test("Generative UI catalog v0 has unique components and gated host-mediated actions", () => {
  const catalog = readJson("registries/generative-ui-catalog.registry.json");
  const componentIds = catalog.components.map((item: { component_id: string }) => item.component_id);
  const actionIds = catalog.actions.map((item: { action_id: string }) => item.action_id);

  assert.equal(catalog.status, "proposed");
  assert.equal(new Set(componentIds).size, componentIds.length);
  assert.equal(new Set(actionIds).size, actionIds.length);
  assert.ok(componentIds.includes("approval_card"));
  assert.ok(componentIds.includes("data_table"));

  for (const action of catalog.actions) {
    assert.equal(action.host_mediated, true);
    if (action.side_effect_level === "write") {
      assert.equal(action.required_gate, "write_operation_approval_required");
    }
    if (action.side_effect_level === "destructive") {
      assert.equal(action.required_gate, "destructive_action_approval_required");
    }
  }
});

test("json-render remains proposed behind GenerativeUIAdapter", () => {
  const registry = readJson("registries/agentic-frameworks.registry.json");
  const framework = registry.frameworks.find(
    (item: { framework_id: string }) => item.framework_id === "json-render"
  );

  assert.ok(framework);
  assert.equal(framework.status, "proposed");
  assert.equal(framework.adapter_contract, "GenerativeUIAdapter");
  assert.equal(framework.adapter_required, true);
});

test("GenerativeUIAdapter schema requires fail-closed host mediation", () => {
  const schema = readJson("schemas/generative-ui-adapter.schema.json");
  assert.equal(schema.properties.action_dispatch.properties.mode.enum[0], "host_mediated");
  assert.equal(schema.properties.action_dispatch.properties.fail_closed.const, true);
  assert.equal(schema.properties.security.properties.arbitrary_markup_forbidden.const, true);
  assert.equal(schema.properties.security.properties.external_network_default.const, "deny");
});
