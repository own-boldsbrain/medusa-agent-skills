import * as fs from "fs";
import * as path from "path";
import { getFilesRecursively } from "./ast-utils.js";
import { inspectRouteFile } from "./route-inspector.js";
import { inspectMiddlewaresFile, applyMiddlewaresToRoutes } from "./middleware-inspector.js";
import { ApiRouteInspectionReport } from "./types.js";

export function runApiRouteInspection(projectRoot: string): ApiRouteInspectionReport {
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
    return report;
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

  return report;
}
