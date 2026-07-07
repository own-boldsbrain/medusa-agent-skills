import ts from "typescript";
import * as path from "path";
import { readAndParseFile } from "./ast-utils.js";
import { MedusaRouteSchema, RouteEvidence, UnknownFields } from "./types.js";

export function inspectRouteFile(filePath: string, projectRoot: string) {
  const parsed = readAndParseFile(filePath);
  if (!parsed) return null;
  const { sourceFile } = parsed;

  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, "/");
  
  // Extract route path and scope from file path
  // e.g. "src/api/admin/products/route.ts" -> "/admin/products", scope "admin"
  let routePath = "unknown";
  let scope: "admin" | "store" | "internal" | "unknown" = "unknown";
  
  const apiIdx = relativePath.split("/").indexOf("api");
  if (apiIdx !== -1) {
    const routeParts = relativePath.split("/").slice(apiIdx + 1, -1);
    routePath = "/" + routeParts.join("/");
    
    if (routeParts[0] === "admin") scope = "admin";
    else if (routeParts[0] === "store") scope = "store";
    else if (routeParts[0] === "internal") scope = "internal";
  }

  const routes: MedusaRouteSchema[] = [];
  const evidences: RouteEvidence[] = [];
  const unknowns: UnknownFields[] = [];

  function visit(node: ts.Node): void {
    // Look for export const GET = ... or export async function GET(...)
    if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      for (const dec of node.declarationList.declarations) {
        if (ts.isIdentifier(dec.name)) {
          const name = dec.name.text;
          if (["GET", "POST", "PUT", "PATCH", "DELETE"].includes(name)) {
            processHandler(name, dec.initializer, relativePath, routePath, scope, sourceFile);
          }
        }
      }
    } else if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name && ts.isIdentifier(node.name)) {
        const name = node.name.text;
        if (["GET", "POST", "PUT", "PATCH", "DELETE"].includes(name)) {
          processHandler(name, node, relativePath, routePath, scope, sourceFile);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  function processHandler(
    methodName: string, 
    handlerNode: ts.Node | undefined, 
    file: string, 
    apiPath: string, 
    scope: any,
    source: ts.SourceFile
  ) {
    if (!handlerNode) return;

    const route_id = `${scope}.${apiPath.replace(/^\//, '').replace(/\//g, '.')}.${methodName}`;
    const detected_symbols: string[] = [];
    const status_codes: number[] = [];
    let workflow_invoked = "unknown";
    let query_graph_usage = false;
    let query_index_usage = false;
    let idempotency = false;
    let request_schema = "unknown";
    
    // Convert handler AST back to text for quick scanning (v0.1 approach)
    const handlerText = handlerNode.getText(source);

    if (handlerText.includes(".run(")) {
      // Very naive extraction: someWorkflow(container).run(...) or someWorkflow.run(...)
      // Look for regex pattern: ([A-Za-z0-9_]+Workflow)(\(.*?\))?\.run\(
      const match = handlerText.match(/([A-Za-z0-9_]+Workflow)(\(.*?\))?\.run\(/);
      if (match) {
        workflow_invoked = match[1];
        detected_symbols.push(workflow_invoked);
      }
    }

    if (handlerText.includes("query.graph(")) {
      query_graph_usage = true;
      detected_symbols.push("query.graph");
    }

    if (handlerText.includes("query.index(")) {
      query_index_usage = true;
      detected_symbols.push("query.index");
    }

    if (handlerText.includes("IdempotencyKey") || handlerText.includes("idempotency")) {
      idempotency = true;
      detected_symbols.push("idempotency");
    }

    // Try to detect status codes (e.g., res.status(200), res.sendStatus(201))
    const statusMatches = handlerText.matchAll(/status\(\s*(\d{3})\s*\)/g);
    for (const match of statusMatches) {
      status_codes.push(parseInt(match[1]));
    }

    // Try to detect Zod schema
    const schemaMatch = handlerText.match(/validatedBody\s*as\s*([a-zA-Z0-9_]+)/);
    if (schemaMatch) {
      request_schema = schemaMatch[1];
      detected_symbols.push("validatedBody");
    }

    if (handlerText.includes("MedusaError")) {
      detected_symbols.push("MedusaError");
    }

    routes.push({
      route_id,
      scope,
      method: methodName as any,
      path: apiPath,
      purpose: "unknown",
      request_schema,
      response_schema: "unknown",
      auth_required: false, // will be augmented by middleware inspector
      auth_strategy: "unknown",
      middlewares: [],
      zod_validator_required: false,
      workflow_invoked,
      query_graph_usage,
      query_index_usage,
      idempotency,
      rate_limit: { limit: 0, window_seconds: 0 },
      status_codes: [...new Set(status_codes)],
      error_contracts: [],
      audit_log_required: false
    });

    evidences.push({
      route_id,
      file,
      handler_export: methodName,
      middleware_sources: [], // will be augmented
      detected_symbols
    });

    unknowns.push({
      route_id,
      fields: ["purpose", "response_schema", "rate_limit", "error_contracts"]
    });
  }

  visit(sourceFile);

  return { routes, evidences, unknowns };
}
