import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

type Plugin = { name: string; source: string };
type Marketplace = { metadata: { version: string }; plugins: Plugin[] };

const root = process.cwd();
const readMarketplace = (file: string): Marketplace =>
  JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", file), "utf8"));

const canonical = readMarketplace("marketplace.json");
const localized = readMarketplace("marketplace.pt-BR.json");

const names = (marketplace: Marketplace) => marketplace.plugins.map((plugin) => plugin.name).sort();

test("both marketplaces list exactly the same plugin set", () => {
  // Bidirectional: a PT-BR-only plugin is drift just as much as a missing one.
  assert.deepEqual(names(localized), names(canonical));
});

test("every plugin resolves to the same source in both marketplaces", () => {
  const localizedByName = new Map(localized.plugins.map((plugin) => [plugin.name, plugin]));
  for (const plugin of canonical.plugins) {
    assert.equal(
      localizedByName.get(plugin.name)?.source,
      plugin.source,
      `source drift for plugin '${plugin.name}'`
    );
  }
});

test("marketplaces stay on the same version", () => {
  assert.equal(localized.metadata.version, canonical.metadata.version);
});

test("plugin entries carry only name and source", () => {
  // Descriptions belong in plugins/*/.claude-plugin/plugin{,.pt-BR}.json.
  // Inlining them here has produced English text inside the PT-BR catalog.
  for (const marketplace of [canonical, localized]) {
    for (const plugin of marketplace.plugins) {
      assert.deepEqual(Object.keys(plugin).sort(), ["name", "source"], `unexpected keys on '${plugin.name}'`);
    }
  }
});

test("every listed plugin has both manifests on disk", () => {
  for (const plugin of canonical.plugins) {
    for (const manifest of ["plugin.json", "plugin.pt-BR.json"]) {
      const file = path.join(root, plugin.source, ".claude-plugin", manifest);
      assert.ok(fs.existsSync(file), `missing ${manifest} for plugin '${plugin.name}'`);
    }
  }
});
