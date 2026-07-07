import { ArchitectureRuleContext } from "../types.js";

export function validateAdvancedWorkflows(context: ArchitectureRuleContext) {
  const { workflowReport, addViolation } = context;
  if (!workflowReport) return;

  const mutationRegex = /create|update|delete|remove|insert|upsert|set|attach|detach|link|unlink|archive|restore/i;

  for (const wf of workflowReport.workflows) {
    for (const step of wf.steps_defined) {
      if (mutationRegex.test(step.name) && !step.has_compensation) {
        
        const isStrongSignal = step.uses_container || step.mutates_state_signal;

        if (isStrongSignal) {
          addViolation({
            rule_id: "MEDUSA_WORKFLOW_MUTATION_STEP_WITHOUT_COMPENSATION",
            severity: "P1",
            category: "workflows",
            description: "Mutation step without compensation (strong signal).",
            file: wf.file,
            evidence: `Step ${step.name} appears to be a mutation and lacks compensation, but uses container or has mutation signals.`,
            remediation: "Add a compensation step to ensure workflow state can be rolled back on failure.",
            affected_entity: step.name
          });
        } else {
          addViolation({
            rule_id: "MEDUSA_WORKFLOW_MUTATION_STEP_WITHOUT_COMPENSATION",
            severity: "P2",
            category: "workflows",
            description: "Mutation step without compensation (weak signal).",
            file: wf.file,
            evidence: `Step ${step.name} appears to be a mutation by name but lacks strong factual evidence of state mutation.`,
            remediation: "Verify if this step requires compensation. If it mutates state, add a compensation block.",
            affected_entity: step.name
          });
        }
      }
    }
  }
}
