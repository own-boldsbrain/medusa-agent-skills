import { spawnSync } from "child_process";
import * as path from "path";

console.log("Running all tests...");

const testsPath = path.resolve("tests/**/*.test.ts");

const result = spawnSync("npx", ["tsx", "--test", testsPath], {
  stdio: "inherit",
  shell: true,
});

if (result.error || result.status !== 0) {
  console.error("❌ Tests failed.");
  process.exit(result.status ?? 1);
}

console.log("✅ All tests passed.");
