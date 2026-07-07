import * as fs from "fs";
import * as path from "path";
import {
  parseSourceFile,
  findExportedHttpMethods,
  findCallExpressionsByName,
  detectAsyncArrowWorkflowConstructor,
  findDirectServiceResolve,
  detectModuleDefinition,
  detectMedusaServiceExtension,
} from "./ast-utils.js";

export interface MedusaStructureReport {
  project_root: string;
  generated_at: string;
  scanner_version: string;
  modules: Array<{
    name: string;
    path: string;
    has_index: boolean;
    has_service: boolean;
    models: string[];
    migrations: string[];
    registered_in_medusa_config: boolean;
    module_definition_detected: boolean;
    medusa_service_detected: boolean;
    registration_key: string;
    findings: string[];
  }>;
  workflows: Array<{
    name: string;
    path: string;
    create_workflow_detected: boolean;
    steps: string[];
    step_response_detected: boolean;
    workflow_response_detected: boolean;
    container_usage_detected: boolean;
    invoked_by: string[];
    findings: string[];
  }>;
  api_routes: Array<{
    path: string;
    route_url: string;
    methods: string[];
    scope: "admin" | "store" | "custom";
    uses_medusa_request: boolean;
    uses_medusa_response: boolean;
    workflow_invocations: string[];
    direct_service_calls_detected: boolean;
    findings: string[];
  }>;
  subscribers: string[];
  scheduled_jobs: string[];
  storefront_sdk_usages: string[];
  admin_ui_extensions: string[];
  findings: Array<{
    level: "P0" | "P1" | "P2" | "P3";
    type: string;
    file: string;
    message: string;
  }>;
  summary: string;
}

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach((file: string) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

/**
 * Read a source file and return its content and parsed AST SourceFile.
 * Returns null if the file does not exist.
 */
function readAndParseFile(filePath: string): { content: string; sourceFile: ReturnType<typeof parseSourceFile> } | null {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  const sourceFile = parseSourceFile(filePath, content);
  return { content, sourceFile };
}

export function scanMedusaProject(projectRoot: string): MedusaStructureReport {
  const report: MedusaStructureReport = {
    project_root: projectRoot,
    generated_at: new Date().toISOString(),
    scanner_version: "0.2.0",
    modules: [],
    workflows: [],
    api_routes: [],
    subscribers: [],
    scheduled_jobs: [],
    storefront_sdk_usages: [],
    admin_ui_extensions: [],
    findings: [],
    summary: ""
  };

  // 1. Read medusa-config modules configuration
  let medusaConfigContent = "";
  const configTs = path.join(projectRoot, "medusa-config.ts");
  const configJs = path.join(projectRoot, "medusa-config.js");
  if (fs.existsSync(configTs)) {
    medusaConfigContent = fs.readFileSync(configTs, "utf-8");
  } else if (fs.existsSync(configJs)) {
    medusaConfigContent = fs.readFileSync(configJs, "utf-8");
  }

  // 2. Scan Modules (src/modules)
  const modulesDir = path.join(projectRoot, "src", "modules");
  if (fs.existsSync(modulesDir)) {
    const moduleNames = fs.readdirSync(modulesDir).filter((f) => {
      return fs.statSync(path.join(modulesDir, f)).isDirectory();
    });

    for (const mod of moduleNames) {
      const modPath = path.join("src", "modules", mod);
      const fullModPath = path.join(modulesDir, mod);

      const hasIndex = fs.existsSync(path.join(fullModPath, "index.ts")) || fs.existsSync(path.join(fullModPath, "index.js"));
      const hasService = fs.existsSync(path.join(fullModPath, "service.ts")) || fs.existsSync(path.join(fullModPath, "service.js"));

      const modelsDir = path.join(fullModPath, "models");
      const models = getFilesRecursively(modelsDir).map((f) => path.relative(projectRoot, f).replace(/\\/g, "/"));

      const migrationsDir = path.join(fullModPath, "migrations");
      const migrations = getFilesRecursively(migrationsDir).map((f) => path.relative(projectRoot, f).replace(/\\/g, "/"));

      // AST: Parse index.ts for Module definition
      let moduleDefinitionDetected = false;
      const indexFilePath = fs.existsSync(path.join(fullModPath, "index.ts"))
        ? path.join(fullModPath, "index.ts")
        : fs.existsSync(path.join(fullModPath, "index.js"))
        ? path.join(fullModPath, "index.js")
        : null;

      if (indexFilePath) {
        const parsed = readAndParseFile(indexFilePath);
        if (parsed) {
          moduleDefinitionDetected = detectModuleDefinition(parsed.sourceFile);
        }
      }

      // AST: Parse service.ts for MedusaService extension
      let medusaServiceDetected = false;
      const serviceFilePath = fs.existsSync(path.join(fullModPath, "service.ts"))
        ? path.join(fullModPath, "service.ts")
        : fs.existsSync(path.join(fullModPath, "service.js"))
        ? path.join(fullModPath, "service.js")
        : null;

      if (serviceFilePath) {
        const parsed = readAndParseFile(serviceFilePath);
        if (parsed) {
          medusaServiceDetected = detectMedusaServiceExtension(parsed.sourceFile);
        }
      }

      // Check registration in config
      const registered = medusaConfigContent.includes(`"${mod}"`) || medusaConfigContent.includes(`'${mod}'`);

      const modFindings: string[] = [];
      if (!hasIndex) {
        modFindings.push("module_without_index");
        report.findings.push({
          level: "P1",
          type: "module_without_index",
          file: modPath,
          message: `Module '${mod}' is missing an entry index.ts or index.js file.`
        });
      }
      if (!hasService) {
        modFindings.push("module_without_service");
        report.findings.push({
          level: "P1",
          type: "module_without_service",
          file: modPath,
          message: `Module '${mod}' is missing service.ts or service.js file.`
        });
      }
      if (models.length > 0 && migrations.length === 0) {
        modFindings.push("module_with_models_without_migrations");
        report.findings.push({
          level: "P0",
          type: "module_with_models_without_migrations",
          file: modPath,
          message: `Module '${mod}' has data models defined but no migrations directory.`
        });
      }
      if (!registered) {
        modFindings.push("medusa_config_missing_module_registration");
        report.findings.push({
          level: "P1",
          type: "medusa_config_missing_module_registration",
          file: modPath,
          message: `Module '${mod}' was not found registered in medusa-config modules config.`
        });
      }

      report.modules.push({
        name: mod,
        path: modPath.replace(/\\/g, "/"),
        has_index: hasIndex,
        has_service: hasService,
        models,
        migrations,
        registered_in_medusa_config: registered,
        module_definition_detected: moduleDefinitionDetected,
        medusa_service_detected: medusaServiceDetected,
        registration_key: mod,
        findings: modFindings
      });
    }
  }

  // 3. Scan Workflows (src/workflows)
  const workflowsDir = path.join(projectRoot, "src", "workflows");
  const workflowFiles = getFilesRecursively(workflowsDir).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const wfFile of workflowFiles) {
    const relativePath = path.relative(projectRoot, wfFile).replace(/\\/g, "/");
    const parsed = readAndParseFile(wfFile);
    if (!parsed) continue;

    const { content, sourceFile } = parsed;

    // AST: Detect createWorkflow calls
    const createWorkflowCalls = findCallExpressionsByName(sourceFile, "createWorkflow");
    const createWorkflowDetected = createWorkflowCalls.length > 0;

    // AST: Detect createStep calls and extract step names
    const createStepCalls = findCallExpressionsByName(sourceFile, "createStep");
    const steps = createStepCalls
      .map((c) => c.firstArg)
      .filter((name): name is string => name !== null);

    // AST: Detect StepResponse and WorkflowResponse usage
    const stepResponseCalls = findCallExpressionsByName(sourceFile, "StepResponse");
    const stepResponseDetected = stepResponseCalls.length > 0 || content.includes("StepResponse");

    const workflowResponseCalls = findCallExpressionsByName(sourceFile, "WorkflowResponse");
    const workflowResponseDetected = workflowResponseCalls.length > 0 || content.includes("WorkflowResponse");

    // AST: Detect container usage via service resolve
    const serviceResolves = findDirectServiceResolve(sourceFile);
    const containerUsageDetected = serviceResolves.length > 0 || content.includes("container");

    const wfFindings: string[] = [];
    if (!createWorkflowDetected) {
      wfFindings.push("workflow_without_createWorkflow");
      report.findings.push({
        level: "P1",
        type: "workflow_without_createWorkflow",
        file: relativePath,
        message: `Workflow file '${relativePath}' does not call createWorkflow.`
      });
    }
    if (steps.length > 0 && !stepResponseDetected) {
      wfFindings.push("step_without_StepResponse");
      report.findings.push({
        level: "P1",
        type: "step_without_StepResponse",
        file: relativePath,
        message: `Workflow steps in '${relativePath}' do not return a StepResponse.`
      });
    }

    // AST: Check for async arrow constructor anti-pattern
    const asyncArrowHits = detectAsyncArrowWorkflowConstructor(sourceFile);
    if (asyncArrowHits.length > 0) {
      wfFindings.push("workflow_async_arrow_constructor");
      for (const hit of asyncArrowHits) {
        report.findings.push({
          level: "P0",
          type: "workflow_async_arrow_constructor",
          file: relativePath,
          message: `Workflow '${hit.workflowName || relativePath}' at line ${hit.line} uses an async arrow function constructor. This blocks Medusa graph rendering.`
        });
      }
    }

    report.workflows.push({
      name: path.basename(wfFile, path.extname(wfFile)),
      path: relativePath,
      create_workflow_detected: createWorkflowDetected,
      steps,
      step_response_detected: stepResponseDetected,
      workflow_response_detected: workflowResponseDetected,
      container_usage_detected: containerUsageDetected,
      invoked_by: [], // Filled during API routing analysis
      findings: wfFindings
    });
  }

  // 4. Scan API Routes (src/api)
  const apiDir = path.join(projectRoot, "src", "api");
  const routeFiles = getFilesRecursively(apiDir).filter((f) => {
    const base = path.basename(f);
    return base === "route.ts" || base === "route.js";
  });

  for (const rFile of routeFiles) {
    const relativePath = path.relative(projectRoot, rFile).replace(/\\/g, "/");
    const parsed = readAndParseFile(rFile);
    if (!parsed) continue;

    const { content, sourceFile } = parsed;

    // Detect route URL (e.g. src/api/blog/posts/route.ts -> /blog/posts)
    const apiPart = relativePath.split("/src/api/")[1] || relativePath.split("src/api/")[1] || "";
    const routeUrl = "/" + path.dirname(apiPart).replace(/\\/g, "/");

    // Scope detection based on URL
    let scope: "admin" | "store" | "custom" = "custom";
    if (routeUrl.startsWith("/admin")) {
      scope = "admin";
    } else if (routeUrl.startsWith("/store")) {
      scope = "store";
    }

    // AST: Detect exported HTTP methods
    const methods = findExportedHttpMethods(sourceFile);

    const usesMedusaRequest = content.includes("MedusaRequest");
    const usesMedusaResponse = content.includes("MedusaResponse");

    // Workflow invocation detection via AST
    const workflowInvocations: string[] = [];
    for (const wf of report.workflows) {
      // Check both by name reference and by explicit .run() call
      const wfNameCalls = findCallExpressionsByName(sourceFile, wf.name);
      if (wfNameCalls.length > 0 || content.includes(wf.name)) {
        workflowInvocations.push(wf.name);
        if (!wf.invoked_by.includes(relativePath)) {
          wf.invoked_by.push(relativePath);
        }
      }
    }

    // AST: Direct Service Call detection (anti-pattern)
    const directResolves = findDirectServiceResolve(sourceFile);
    const directServiceCallsDetected = directResolves.length > 0 &&
      methods.some(m => ["POST", "DELETE", "PUT", "PATCH"].includes(m)) &&
      workflowInvocations.length === 0;

    const routeFindings: string[] = [];
    if (methods.some(m => ["POST", "DELETE", "PUT", "PATCH"].includes(m)) && workflowInvocations.length === 0) {
      routeFindings.push("route_mutation_without_workflow_invocation");
      report.findings.push({
        level: "P0",
        type: "route_mutation_without_workflow_invocation",
        file: relativePath,
        message: `Route '${routeUrl}' performs mutations (${methods.filter(m => m !== "GET").join(",")}) but does not invoke any workflow.`
      });
    }

    if (directServiceCallsDetected) {
      routeFindings.push("direct_service_call_inside_route");
      report.findings.push({
        level: "P0",
        type: "direct_service_call_inside_route",
        file: relativePath,
        message: `Route '${routeUrl}' bypasses workflow and resolves service directly inside route file.`
      });
    }

    report.api_routes.push({
      path: relativePath,
      route_url: routeUrl,
      methods,
      scope,
      uses_medusa_request: usesMedusaRequest,
      uses_medusa_response: usesMedusaResponse,
      workflow_invocations: workflowInvocations,
      direct_service_calls_detected: directServiceCallsDetected,
      findings: routeFindings
    });
  }

  // 5. Scan Subscribers & Jobs
  const subDir = path.join(projectRoot, "src", "subscribers");
  report.subscribers = getFilesRecursively(subDir).map((f) => path.relative(projectRoot, f).replace(/\\/g, "/"));

  const jobsDir = path.join(projectRoot, "src", "jobs");
  const schedJobsDir = path.join(projectRoot, "src", "scheduled-jobs");
  const jobs = getFilesRecursively(jobsDir).concat(getFilesRecursively(schedJobsDir));
  report.scheduled_jobs = jobs.map((f) => path.relative(projectRoot, f).replace(/\\/g, "/"));

  // 6. Calculate Summary
  const p0 = report.findings.filter(f => f.level === "P0").length;
  const p1 = report.findings.filter(f => f.level === "P1").length;
  report.summary = `Scan completed. Found ${report.modules.length} modules, ${report.workflows.length} workflows, and ${report.api_routes.length} API routes. Total issues: ${report.findings.length} (${p0} P0, ${p1} P1).`;

  return report;
}
