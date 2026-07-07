import { ArchitectureRule, ArchitectureRuleContext } from "../types.js";

export const validateWorkflowMutations: ArchitectureRule = (context: ArchitectureRuleContext) => {
  const { report, addViolation } = context;

  for (const workflow of report.workflows) {
    if (!workflow.create_workflow_detected) {
      addViolation({
        rule_id: "workflow_without_createWorkflow",
        severity: "P1",
        category: "workflows",
        description: `Workflow does not use createWorkflow.`,
        file: workflow.path,
        evidence: "No createWorkflow call detected.",
        remediation: "Wrap the workflow definition in createWorkflow.",
        affected_entity: workflow.name,
      });
    }

    if (!workflow.step_response_detected && workflow.steps.length > 0) {
      addViolation({
        rule_id: "step_without_StepResponse",
        severity: "P1",
        category: "workflows",
        description: `Workflow steps do not return a StepResponse.`,
        file: workflow.path,
        evidence: "Steps are defined but no StepResponse constructor was found.",
        remediation: "Ensure all steps return a StepResponse to integrate correctly with the Medusa workflow engine.",
        affected_entity: workflow.name,
      });
    }

    if (!workflow.workflow_response_detected) {
      addViolation({
        rule_id: "workflow_without_WorkflowResponse",
        severity: "P2",
        category: "workflows",
        description: `Workflow does not return a WorkflowResponse.`,
        file: workflow.path,
        evidence: "No WorkflowResponse constructor found.",
        remediation: "If the workflow has an output, return it wrapped in a WorkflowResponse.",
        affected_entity: workflow.name,
      });
    }

    // Relying on scanner's workflow_async_arrow_constructor finding if it was mapped, 
    // or we assume it's in findings array for now. Wait, the scanner maps findings directly. 
    // Let's check if there's a finding in the workflow itself.
    const asyncArrowFinding = workflow.findings.find(f => f.includes("async arrow"));
    if (asyncArrowFinding) {
      addViolation({
        rule_id: "workflow_async_arrow_constructor",
        severity: "P0",
        category: "workflows",
        description: `Workflow uses an async arrow function constructor.`,
        file: workflow.path,
        evidence: asyncArrowFinding,
        remediation: "Remove the async modifier from the workflow constructor function. Workflows must be synchronous to build the execution graph.",
        affected_entity: workflow.name,
      });
    }
  }
};
