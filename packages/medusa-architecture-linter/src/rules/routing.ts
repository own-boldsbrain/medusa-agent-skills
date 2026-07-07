import { ArchitectureRule, ArchitectureRuleContext } from "../types.js";

const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

const isMutationMethod = (methods: string[]) => {
  return methods.some(m => MUTATION_METHODS.includes(m.toUpperCase()));
};

export const detectRouteServiceBypass: ArchitectureRule = (context: ArchitectureRuleContext) => {
  const { report, addViolation } = context;

  for (const route of report.api_routes) {
    const isMutation = isMutationMethod(route.methods);

    if (route.direct_service_calls_detected) {
      addViolation({
        rule_id: "direct_service_call_inside_route",
        severity: isMutation ? "P0" : "P2",
        category: "routing",
        description: `API route performs direct service call.`,
        file: route.path,
        evidence: `Direct service call detected for methods: ${route.methods.join(", ")}.`,
        remediation: isMutation
          ? "Refactor the direct service call into a Medusa Workflow for mutation consistency."
          : "Consider moving complex read logic to a query service or workflow, though simple reads are generally acceptable.",
        affected_entity: route.route_url,
      });
    }

    if (isMutation && route.workflow_invocations.length === 0) {
      addViolation({
        rule_id: "route_mutation_without_workflow_invocation",
        severity: "P0",
        category: "routing",
        description: `Route performs mutation without invoking a workflow.`,
        file: route.path,
        evidence: `Methods ${route.methods.join(", ")} do not invoke any workflows.`,
        remediation: "Move mutation logic into a Medusa workflow and invoke it from the route.",
        affected_entity: route.route_url,
      });
    }
  }
};
