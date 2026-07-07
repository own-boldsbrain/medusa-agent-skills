import * as fs from "fs";
import * as path from "path";
import { getFilesRecursively } from "./ast-utils.js";
import { inspectWorkflow } from "./workflow-inspector.js";
import { inspectModel } from "./model-inspector.js";
import { WorkflowSchemaInspectionReport } from "./types.js";

export function runWorkflowSchemaInspection(projectRoot: string): WorkflowSchemaInspectionReport {
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

  return report;
}
