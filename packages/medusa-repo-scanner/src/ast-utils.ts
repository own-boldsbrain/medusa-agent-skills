import ts from "typescript";

/**
 * Parse a TypeScript/JavaScript source file into an AST SourceFile node.
 * Uses ts.ScriptTarget.Latest to support modern syntax.
 */
export function parseSourceFile(filePath: string, content: string): ts.SourceFile {
  return ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".ts") || filePath.endsWith(".tsx")
      ? ts.ScriptKind.TS
      : ts.ScriptKind.JS
  );
}

/**
 * Find all exported HTTP method handler names in a route file.
 * Detects patterns like:
 *   export const GET = ...
 *   export async function POST(...)
 *   export function DELETE(...)
 *
 * Returns an array of uppercase method names found (e.g. ["GET", "POST"]).
 */
export function findExportedHttpMethods(sourceFile: ts.SourceFile): string[] {
  const httpMethods = new Set(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]);
  const found: string[] = [];

  function visit(node: ts.Node): void {
    // export const GET = ...
    if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name) && httpMethods.has(decl.name.text)) {
            found.push(decl.name.text);
          }
        }
      }
    }

    // export async function POST(...) or export function DELETE(...)
    if (ts.isFunctionDeclaration(node) && node.name) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport && httpMethods.has(node.name.text)) {
        found.push(node.name.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}

/**
 * Find all call expressions matching a given function name.
 * For example, findCallExpressionsByName(sf, "createWorkflow") finds all
 * calls to createWorkflow(...).
 *
 * Returns an array of objects with:
 *   - name: the matched function name
 *   - firstArg: the first string literal argument value if present
 *   - line: the 1-based line number
 */
export function findCallExpressionsByName(
  sourceFile: ts.SourceFile,
  targetName: string
): Array<{ name: string; firstArg: string | null; line: number }> {
  const results: Array<{ name: string; firstArg: string | null; line: number }> = [];

  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      let calleeName: string | null = null;

      // Direct call: createWorkflow(...)
      if (ts.isIdentifier(node.expression)) {
        calleeName = node.expression.text;
      }
      // Property access: something.createWorkflow(...)
      if (ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.name)) {
        calleeName = node.expression.name.text;
      }

      if (calleeName === targetName) {
        let firstArg: string | null = null;
        if (node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) {
            firstArg = arg.text;
          }
        }

        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        results.push({ name: targetName, firstArg, line: line + 1 });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return results;
}

/**
 * Detect whether the file contains a createWorkflow call where the second
 * argument is an async arrow function — a known Medusa anti-pattern that
 * blocks graph rendering.
 *
 * Pattern detected:
 *   createWorkflow("name", async () => { ... })
 *   createWorkflow("name", async (input) => { ... })
 */
export function detectAsyncArrowWorkflowConstructor(sourceFile: ts.SourceFile): Array<{
  workflowName: string | null;
  line: number;
}> {
  const hits: Array<{ workflowName: string | null; line: number }> = [];

  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      let calleeName: string | null = null;

      if (ts.isIdentifier(node.expression)) {
        calleeName = node.expression.text;
      }

      if (calleeName === "createWorkflow" && node.arguments.length >= 2) {
        const secondArg = node.arguments[1];
        if (ts.isArrowFunction(secondArg)) {
          const hasAsync = secondArg.modifiers?.some(
            (m) => m.kind === ts.SyntaxKind.AsyncKeyword
          );
          if (hasAsync) {
            let workflowName: string | null = null;
            const firstArg = node.arguments[0];
            if (ts.isStringLiteral(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg)) {
              workflowName = firstArg.text;
            }
            const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            hits.push({ workflowName, line: line + 1 });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return hits;
}

/**
 * Detect direct service resolution calls inside a source file.
 * Catches patterns like:
 *   container.resolve("someService")
 *   scope.resolve("someService")
 *   req.scope.resolve("someService")
 *
 * Returns an array of objects with the resolved service name (if a string literal)
 * and the line number.
 */
export function findDirectServiceResolve(sourceFile: ts.SourceFile): Array<{
  serviceName: string | null;
  line: number;
}> {
  const results: Array<{ serviceName: string | null; line: number }> = [];

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "resolve"
    ) {
      // Check if the object is "container", "scope", or ends with ".scope"
      const objExpr = node.expression.expression;
      let isServiceResolve = false;

      if (ts.isIdentifier(objExpr)) {
        isServiceResolve = objExpr.text === "container" || objExpr.text === "scope";
      } else if (
        ts.isPropertyAccessExpression(objExpr) &&
        ts.isIdentifier(objExpr.name) &&
        objExpr.name.text === "scope"
      ) {
        // e.g. req.scope.resolve(...)
        isServiceResolve = true;
      }

      if (isServiceResolve) {
        let serviceName: string | null = null;
        if (node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) {
            serviceName = arg.text;
          }
        }
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        results.push({ serviceName, line: line + 1 });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return results;
}

/**
 * Detect if a source file contains import or usage of Module() definition.
 * Checks for:
 *   - Call expression: Module(...)
 *   - Identifier reference: ModuleConfig
 */
export function detectModuleDefinition(sourceFile: ts.SourceFile): boolean {
  let found = false;

  function visit(node: ts.Node): void {
    if (found) return;

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "Module") {
      found = true;
      return;
    }

    if (ts.isIdentifier(node) && node.text === "ModuleConfig") {
      found = true;
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}

/**
 * Detect if a service file extends MedusaService or any service base class.
 * Checks for class declarations with `extends` clauses referencing MedusaService.
 */
export function detectMedusaServiceExtension(sourceFile: ts.SourceFile): boolean {
  let found = false;

  function visit(node: ts.Node): void {
    if (found) return;

    if (ts.isClassDeclaration(node) && node.heritageClauses) {
      for (const clause of node.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
          for (const type of clause.types) {
            if (ts.isIdentifier(type.expression) && type.expression.text === "MedusaService") {
              found = true;
              return;
            }
            // Also detect MedusaService() call expression as base
            if (ts.isCallExpression(type.expression) && ts.isIdentifier(type.expression.expression) && type.expression.expression.text === "MedusaService") {
              found = true;
              return;
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}
