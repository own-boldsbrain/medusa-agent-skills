import { ArchitectureRule, ArchitectureRuleContext } from "../types.js";

export const validateLayering: ArchitectureRule = (context: ArchitectureRuleContext) => {
  const { report, addViolation } = context;

  for (const module of report.modules) {
    if (!module.has_index) {
      addViolation({
        rule_id: "MEDUSA_LAYERING_MODULE_WITHOUT_INDEX",
        severity: "P1",
        category: "layering",
        description: `Module ${module.name} is missing an index.ts file.`,
        file: module.path,
        evidence: "No index.ts found in the module root.",
        remediation: "Create an index.ts file that exports the module definition and service.",
        affected_entity: module.name,
      });
    }

    if (!module.has_service) {
      addViolation({
        rule_id: "MEDUSA_LAYERING_MODULE_WITHOUT_SERVICE",
        severity: "P1",
        category: "layering",
        description: `Module ${module.name} is missing a service file.`,
        file: module.path,
        evidence: "No service.ts found in the module root.",
        remediation: "Create a service.ts file extending MedusaService for this module.",
        affected_entity: module.name,
      });
    }

    if (module.models.length > 0 && module.migrations.length === 0) {
      addViolation({
        rule_id: "MEDUSA_LAYERING_MODEL_WITHOUT_MIGRATION",
        severity: "P0",
        category: "layering",
        description: `Module ${module.name} has models but no migrations.`,
        file: module.path,
        evidence: `Models detected: ${module.models.join(", ")}. Migrations detected: 0.`,
        remediation: "Generate and include migrations for the defined models to ensure database schema consistency.",
        affected_entity: module.name,
      });
    }

    if (!module.registered_in_medusa_config) {
      addViolation({
        rule_id: "MEDUSA_LAYERING_MODULE_NOT_REGISTERED",
        severity: "P1",
        category: "layering",
        description: `Module ${module.name} is not registered in medusa-config.ts.`,
        file: "medusa-config.ts",
        evidence: `Module path ${module.path} not found in modules config.`,
        remediation: "Register the module in medusa-config.ts using its module definition.",
        affected_entity: module.name,
      });
    }

    if (!module.module_definition_detected) {
      addViolation({
        rule_id: "MEDUSA_LAYERING_MODULE_DEFINITION_NOT_DETECTED",
        severity: "P1",
        category: "layering",
        description: `Module ${module.name} does not export a Module definition.`,
        file: module.path,
        evidence: "No Module() call or ModuleConfig export found.",
        remediation: "Export a Module configuration from the module's index.ts.",
        affected_entity: module.name,
      });
    }

    if (!module.medusa_service_detected) {
      addViolation({
        rule_id: "MEDUSA_LAYERING_MEDUSA_SERVICE_NOT_DETECTED",
        severity: "P1",
        category: "layering",
        description: `Module ${module.name} does not have a MedusaService extension.`,
        file: module.path,
        evidence: "No class extending MedusaService found in the module.",
        remediation: "Ensure the module's main service extends MedusaService.",
        affected_entity: module.name,
      });
    }
  }
};
