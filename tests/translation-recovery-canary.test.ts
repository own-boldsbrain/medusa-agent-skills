import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("BB-16.1 recovery manifest passes the translation canary", () => {
  const result = spawnSync(
    process.execPath,
    [
      "scripts/validate-translation-canary.mjs",
      "--manifest",
      "reports/loss-investigation/recovery/layouts-source-restore-sidecar-repair.json"
    ],
    { cwd: process.cwd(), encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Status: ✅ PASSED/);
  assert.match(result.stdout, /static-pages\.pt-BR\.md/);
  assert.match(result.stdout, /workflow-orchestration\.pt-br\.md/);
});
