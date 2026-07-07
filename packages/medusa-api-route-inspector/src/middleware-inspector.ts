import ts from "typescript";
import { readAndParseFile } from "./ast-utils.js";

export interface MiddlewareConfig {
  matcher: string;
  method?: string | string[];
  middlewares: string[];
}

export function inspectMiddlewaresFile(filePath: string): MiddlewareConfig[] {
  const parsed = readAndParseFile(filePath);
  if (!parsed) return [];
  const { sourceFile } = parsed;

  const configs: MiddlewareConfig[] = [];

  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === "defineMiddlewares") {
        if (node.arguments.length > 0 && ts.isObjectLiteralExpression(node.arguments[0])) {
          const configObj = node.arguments[0];
          
          for (const prop of configObj.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === "routes") {
              if (ts.isArrayLiteralExpression(prop.initializer)) {
                for (const route of prop.initializer.elements) {
                  if (ts.isObjectLiteralExpression(route)) {
                    let matcher = "";
                    let method: string | string[] | undefined;
                    let middlewares: string[] = [];
                    
                    for (const rProp of route.properties) {
                      if (ts.isPropertyAssignment(rProp) && ts.isIdentifier(rProp.name)) {
                        const rName = rProp.name.text;
                        if (rName === "matcher") {
                          if (ts.isStringLiteral(rProp.initializer) || ts.isNoSubstitutionTemplateLiteral(rProp.initializer)) {
                            matcher = rProp.initializer.text;
                          } else if (ts.isRegularExpressionLiteral(rProp.initializer)) {
                            matcher = rProp.initializer.text;
                          }
                        } else if (rName === "method") {
                          if (ts.isStringLiteral(rProp.initializer)) {
                            method = rProp.initializer.text;
                          } else if (ts.isArrayLiteralExpression(rProp.initializer)) {
                            method = rProp.initializer.elements
                              .filter(ts.isStringLiteral)
                              .map(e => e.text);
                          }
                        } else if (rName === "middlewares") {
                          if (ts.isArrayLiteralExpression(rProp.initializer)) {
                            for (const mw of rProp.initializer.elements) {
                              if (ts.isIdentifier(mw)) {
                                middlewares.push(mw.text);
                              } else if (ts.isCallExpression(mw) && ts.isIdentifier(mw.expression)) {
                                middlewares.push(mw.expression.text);
                              } else {
                                middlewares.push("unknown_middleware");
                              }
                            }
                          }
                        }
                      }
                    }
                    
                    if (matcher) {
                      configs.push({ matcher, method, middlewares });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return configs;
}

export function applyMiddlewaresToRoutes(routes: any[], evidences: any[], middlewareConfigs: MiddlewareConfig[], mwFileRelativePath: string) {
  // A naive matching implementation for v0.1
  for (const mw of middlewareConfigs) {
    const matcherRegex = new RegExp(mw.matcher.replace(/\/\*+/g, ".*")); // convert /admin/* to regex
    
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const evidence = evidences[i];
      
      const methods = mw.method 
        ? (Array.isArray(mw.method) ? mw.method : [mw.method]).map(m => m.toUpperCase())
        : ["GET", "POST", "PUT", "PATCH", "DELETE"];
      
      if (matcherRegex.test(route.path) && methods.includes(route.method)) {
        // Add middlewares
        route.middlewares = [...new Set([...route.middlewares, ...mw.middlewares])];
        
        if (!evidence.middleware_sources.includes(mwFileRelativePath)) {
          evidence.middleware_sources.push(mwFileRelativePath);
        }

        // Set flags based on middleware names
        if (route.middlewares.some((m: string) => m.includes("auth") || m.includes("authenticate"))) {
          route.auth_required = true;
          if (route.middlewares.some((m: string) => m === "authenticate")) {
            route.auth_strategy = "default";
          }
        }

        if (route.middlewares.some((m: string) => m.includes("validateAndTransformBody") || m.includes("zod"))) {
          route.zod_validator_required = true;
        }
      }
    }
  }
}
