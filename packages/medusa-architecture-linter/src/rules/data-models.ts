import { ArchitectureRuleContext } from "../types.js";

export function validateDataModels(context: ArchitectureRuleContext) {
  const { workflowReport, addViolation } = context;
  if (!workflowReport) return;

  for (const model of workflowReport.data_models) {
    if (model.migration_files.length === 0) {
      addViolation({
        rule_id: "MEDUSA_MODEL_WITHOUT_MIGRATION",
        severity: "P0",
        category: "layering",
        description: "Data model without a corresponding migration detected.",
        file: model.file,
        evidence: `Data model ${model.name} does not have any migration files associated in its module.`,
        remediation: "Create a database migration for the data model.",
        affected_entity: model.name
      });
    }
  }
}
