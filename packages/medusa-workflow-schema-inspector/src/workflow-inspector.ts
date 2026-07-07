import ts from "typescript";
import * as path from "path";
import { readAndParseFile } from "./ast-utils.js";
import { WorkflowInspectionDetail, StepDefinedDetail, StepInvokedDetail } from "./types.js";

export function inspectWorkflow(filePath: string, projectRoot: string): WorkflowInspectionDetail | null {
  const parsed = readAndParseFile(filePath);
  if (!parsed) return null;
  const { sourceFile, content } = parsed;
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, "/");

  let createWorkflowDetected = false;
  let constructorKind = "unknown";
  let workflowName = path.basename(filePath, path.extname(filePath));
  let workflowResponseDetected = content.includes("WorkflowResponse");

  const stepsDefined: StepDefinedDetail[] = [];
  const stepsInvoked: StepInvokedDetail[] = [];
  const stepVariables = new Map<string, string>(); // variable name -> step name

  function visit(node: ts.Node): void {
    // Detect createStep declarations
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)) {
      const callExpr = node.initializer;
      if (ts.isIdentifier(callExpr.expression) && callExpr.expression.text === "createStep") {
        if (ts.isIdentifier(node.name) && callExpr.arguments.length > 0) {
          const varName = node.name.text;
          const firstArg = callExpr.arguments[0];
          let stepName = "";
          if (ts.isStringLiteral(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg)) {
            stepName = firstArg.text;
          }

          stepVariables.set(varName, stepName);

          const hasCompensation = callExpr.arguments.length >= 3;
          let returnsStepResponse = false;
          let usesContainer = false;

          // Simple checks within the createStep body (second argument)
          if (callExpr.arguments.length >= 2) {
            const stepBody = callExpr.arguments[1];
            const bodyText = stepBody.getText(sourceFile);
            returnsStepResponse = bodyText.includes("StepResponse");
            usesContainer = bodyText.includes("container.resolve") || bodyText.includes(".scope.resolve");
          }

          stepsDefined.push({
            step_name: stepName,
            variable_name: varName,
            has_compensation: hasCompensation,
            returns_step_response: returnsStepResponse,
            uses_container: usesContainer,
            mutates_state_signal: usesContainer || hasCompensation // Simplification for v0.1
          });
        }
      }
    }

    // Detect createWorkflow
    if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === "createWorkflow") {
        createWorkflowDetected = true;
        if (node.arguments.length > 0) {
          const firstArg = node.arguments[0];
          if (ts.isStringLiteral(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg)) {
            workflowName = firstArg.text;
          }
        }
        if (node.arguments.length >= 2) {
          const secondArg = node.arguments[1];
          if (ts.isArrowFunction(secondArg)) {
            constructorKind = "arrow_function";
          } else if (ts.isFunctionExpression(secondArg) || ts.isFunctionDeclaration(secondArg)) {
            constructorKind = "function_declaration";
          }
          
          // Detect step invocations inside the workflow constructor
          let orderCounter = 1;
          function findInvocations(innerNode: ts.Node) {
            if (ts.isCallExpression(innerNode) && ts.isIdentifier(innerNode.expression)) {
              const calleeName = innerNode.expression.text;
              if (stepVariables.has(calleeName)) {
                stepsInvoked.push({
                  step_name: stepVariables.get(calleeName)!,
                  call_expression: innerNode.getText(sourceFile),
                  order: orderCounter++
                });
              }
            }
            ts.forEachChild(innerNode, findInvocations);
          }
          findInvocations(secondArg);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!createWorkflowDetected && stepsDefined.length === 0) {
    return null; // Not a workflow or step file
  }

  return {
    name: workflowName,
    path: relativePath,
    create_workflow_detected: createWorkflowDetected,
    constructor_kind: constructorKind,
    workflow_response_detected: workflowResponseDetected,
    steps_defined: stepsDefined,
    steps_invoked: stepsInvoked
  };
}
