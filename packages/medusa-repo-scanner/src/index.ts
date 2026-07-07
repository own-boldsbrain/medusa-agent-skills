export { scanMedusaProject, type MedusaStructureReport } from "./scanner.js";
export { validateReportAgainstSchema } from "./validate-report.js";
export {
  parseSourceFile,
  findExportedHttpMethods,
  findCallExpressionsByName,
  detectAsyncArrowWorkflowConstructor,
  findDirectServiceResolve,
  detectModuleDefinition,
  detectMedusaServiceExtension,
} from "./ast-utils.js";
