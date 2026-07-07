import * as fs from "fs";
import * as path from "path";
import { runApiRouteInspection } from "../packages/medusa-api-route-inspector/src/run-inspection.js";
import { validateSchema } from "../packages/medusa-api-route-inspector/src/validate-report.js";

function parseArgs() {
  const args = process.argv.slice(2);
  let projectRoot = process.cwd();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--project-root" && i + 1 < args.length) {
      projectRoot = path.resolve(args[i + 1]);
      i++;
    }
  }

  return { projectRoot };
}

function run() {
  console.log("Starting Medusa API Route Inspector...");
  const { projectRoot } = parseArgs();
  console.log(`Inspecting project at: ${projectRoot}`);

  const report = runApiRouteInspection(projectRoot);

  const reportsDir = path.join(projectRoot, "reports", "generated");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const outputPath = path.join(reportsDir, "api-route-inspection.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Inspection finished! Output written to: ${path.relative(projectRoot, outputPath)}`);
  
  console.log(`Summary: ${report.summary.route_count} routes inspected.`);

  console.log("\nValidating report against api-route-inspection-report.schema.json...");
  const validation = validateSchema(report, projectRoot);
  
  if (validation.valid) {
    console.log("Schema validation: PASSED ✅");
    process.exit(0);
  } else {
    console.error("Schema validation: FAILED ❌");
    console.error(JSON.stringify(validation.errors, null, 2));
    process.exit(1);
  }
}

run();
