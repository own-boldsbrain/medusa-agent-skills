import * as fs from "fs";
import * as path from "path";
import { getFilesRecursively } from "../packages/medusa-workflow-schema-inspector/src/ast-utils.js";
import { inspectWorkflow } from "../packages/medusa-workflow-schema-inspector/src/workflow-inspector.js";
import { inspectModel } from "../packages/medusa-workflow-schema-inspector/src/model-inspector.js";
import { validateSchema } from "../packages/medusa-workflow-schema-inspector/src/validate-report.js";
import { WorkflowSchemaInspectionReport } from "../packages/medusa-workflow-schema-inspector/src/types.js";

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
  console.log("Starting Medusa Workflow & Schema Inspector...");
  const { projectRoot } = parseArgs();
  console.log(`Inspecting project at: ${projectRoot}`);

  const report: WorkflowSchemaInspectionReport = {
    project_root: projectRoot,
    generated_at: new Date().toISOString(),
    inspector_version: "0.1.0",
    workflows: [],
    data_models: [],
    diagnostics: [],
    summary: {
      workflow_count: 0,
      step_count: 0,
      steps_with_compensation: 0,
      data_model_count: 0,
      migration_count: 0
    }
  };

  // 1. Inspect Workflows
  const workflowsDir = path.join(projectRoot, "src", "workflows");
  if (fs.existsSync(workflowsDir)) {
    const workflowFiles = getFilesRecursively(workflowsDir).filter(f => f.endsWith(".ts") || f.endsWith(".js"));
    for (const file of workflowFiles) {
      try {
        const wfDetail = inspectWorkflow(file, projectRoot);
        if (wfDetail) {
          report.workflows.push(wfDetail);
          report.summary.workflow_count++;
          report.summary.step_count += wfDetail.steps_defined.length;
          report.summary.steps_with_compensation += wfDetail.steps_defined.filter(s => s.has_compensation).length;
        }
      } catch (err: any) {
        report.diagnostics.push({
          type: "workflow_inspection_error",
          file: path.relative(projectRoot, file),
          message: err.message
        });
      }
    }
  }

  // 2. Inspect Data Models
  const modulesDir = path.join(projectRoot, "src", "modules");
  if (fs.existsSync(modulesDir)) {
    const modelsFiles = getFilesRecursively(modulesDir).filter(f => {
      const isModelFile = f.includes("/models/") || f.includes("\\models\\");
      return isModelFile && (f.endsWith(".ts") || f.endsWith(".js"));
    });

    // To prevent duplicate counting of migrations
    const uniqueMigrations = new Set<string>();

    for (const file of modelsFiles) {
      try {
        const modelDetail = inspectModel(file, projectRoot);
        if (modelDetail) {
          report.data_models.push(modelDetail);
          report.summary.data_model_count++;
          
          for (const mig of modelDetail.migration_files) {
            uniqueMigrations.add(mig);
          }
        }
      } catch (err: any) {
        report.diagnostics.push({
          type: "model_inspection_error",
          file: path.relative(projectRoot, file),
          message: err.message
        });
      }
    }
    
    report.summary.migration_count = uniqueMigrations.size;
  }

  const reportsDir = path.join(projectRoot, "reports", "generated");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const outputPath = path.join(reportsDir, "workflow-schema-inspection.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Inspection finished! Output written to: ${path.relative(projectRoot, outputPath)}`);
  
  console.log(`Summary: ${report.summary.workflow_count} workflows, ${report.summary.data_model_count} data models inspected.`);

  console.log("\nValidating report against workflow-schema-inspection-report.schema.json...");
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
