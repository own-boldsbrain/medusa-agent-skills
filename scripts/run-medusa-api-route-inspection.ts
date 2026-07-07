import * as fs from "fs";
import * as path from "path";
import { getFilesRecursively } from "../packages/medusa-api-route-inspector/src/ast-utils.js";
import { inspectRouteFile } from "../packages/medusa-api-route-inspector/src/route-inspector.js";
import { inspectMiddlewaresFile, applyMiddlewaresToRoutes } from "../packages/medusa-api-route-inspector/src/middleware-inspector.js";
import { validateSchema } from "../packages/medusa-api-route-inspector/src/validate-report.js";
import { ApiRouteInspectionReport } from "../packages/medusa-api-route-inspector/src/types.js";

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

  const report: ApiRouteInspectionReport = {
    project_root: projectRoot,
    generated_at: new Date().toISOString(),
    inspector_version: "0.1.0",
    api_routes: [],
    route_evidence: [],
    unknown_fields: [],
    diagnostics: [],
    summary: {
      route_count: 0,
      admin_route_count: 0,
      store_route_count: 0,
      internal_route_count: 0,
      routes_with_auth: 0,
      routes_with_zod: 0,
      routes_with_workflow: 0
    }
  };

  const apiDir = path.join(projectRoot, "src", "api");
  if (!fs.existsSync(apiDir)) {
    console.log("No src/api directory found. Finishing inspection.");
    finish(report, projectRoot);
    return;
  }

  const apiFiles = getFilesRecursively(apiDir);
  
  // 1. Inspect middlewares
  let middlewareConfigs: any[] = [];
  const mwFile = apiFiles.find(f => f.replace(/\\/g, "/").endsWith("src/api/middlewares.ts"));
  if (mwFile) {
    try {
      middlewareConfigs = inspectMiddlewaresFile(mwFile);
    } catch (err: any) {
      report.diagnostics.push({
        type: "middleware_inspection_error",
        file: path.relative(projectRoot, mwFile),
        message: err.message
      });
    }
  }

  // 2. Inspect routes
  const routeFiles = apiFiles.filter(f => {
    const norm = f.replace(/\\/g, "/");
    return norm.endsWith("/route.ts") || norm.endsWith("/route.js");
  });

  for (const file of routeFiles) {
    try {
      const result = inspectRouteFile(file, projectRoot);
      if (result) {
        report.api_routes.push(...result.routes);
        report.route_evidence.push(...result.evidences);
        report.unknown_fields.push(...result.unknowns);
      }
    } catch (err: any) {
      report.diagnostics.push({
        type: "route_inspection_error",
        file: path.relative(projectRoot, file),
        message: err.message
      });
    }
  }

  // 3. Apply middlewares to routes
  if (mwFile && middlewareConfigs.length > 0) {
    const mwRelPath = path.relative(projectRoot, mwFile).replace(/\\/g, "/");
    applyMiddlewaresToRoutes(report.api_routes, report.route_evidence, middlewareConfigs, mwRelPath);
  }

  // 4. Compute summary
  report.summary.route_count = report.api_routes.length;
  report.summary.admin_route_count = report.api_routes.filter(r => r.scope === "admin").length;
  report.summary.store_route_count = report.api_routes.filter(r => r.scope === "store").length;
  report.summary.internal_route_count = report.api_routes.filter(r => r.scope === "internal").length;
  report.summary.routes_with_auth = report.api_routes.filter(r => r.auth_required).length;
  report.summary.routes_with_zod = report.api_routes.filter(r => r.zod_validator_required).length;
  report.summary.routes_with_workflow = report.api_routes.filter(r => r.workflow_invoked !== "unknown").length;

  finish(report, projectRoot);
}

function finish(report: ApiRouteInspectionReport, projectRoot: string) {
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
