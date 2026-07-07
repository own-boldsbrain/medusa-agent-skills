import { ArchitectureRuleContext } from "../types.js";

export function validateApiRoutes(context: ArchitectureRuleContext) {
  const { apiRouteReport, addViolation } = context;
  if (!apiRouteReport) return; // Skip if no API route report is provided

  for (const route of apiRouteReport.api_routes) {
    // 1. MEDUSA_API_ADMIN_ROUTE_WITHOUT_AUTH
    if (route.scope === "admin" && !route.auth_required) {
      addViolation({
        rule_id: "MEDUSA_API_ADMIN_ROUTE_WITHOUT_AUTH",
        severity: "P0",
        category: "routing",
        description: "Admin route without authentication detected.",
        file: route.route_id,
        evidence: `Route ${route.method} ${route.path} requires authentication.`,
        remediation: "Add an 'authenticate' middleware for this route in src/api/middlewares.ts",
        affected_entity: route.route_id
      });
    }

    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(route.method);

    if (isMutation) {
      // 2. MEDUSA_API_MUTATION_WITHOUT_ZOD_VALIDATION
      if (!route.zod_validator_required) {
        addViolation({
          rule_id: "MEDUSA_API_MUTATION_WITHOUT_ZOD_VALIDATION",
          severity: "P1",
          category: "routing",
          description: "Mutation route without Zod validation detected.",
          file: route.route_id,
          evidence: `Route ${route.method} ${route.path} lacks validateAndTransformBody middleware.`,
          remediation: "Add 'validateAndTransformBody' middleware to this route.",
          affected_entity: route.route_id
        });
      }

      // 3. MEDUSA_API_MUTATION_WITHOUT_WORKFLOW
      if (route.workflow_invoked === "unknown") {
        addViolation({
          rule_id: "MEDUSA_API_MUTATION_WITHOUT_WORKFLOW",
          severity: "P1",
          category: "routing",
          description: "Mutation route without workflow invocation detected.",
          file: route.route_id,
          evidence: `Route ${route.method} ${route.path} does not seem to invoke a workflow.`,
          remediation: "Move business logic to a Medusa workflow and invoke it from the route.",
          affected_entity: route.route_id
        });
      }

      // 5. MEDUSA_API_ROUTE_WITHOUT_IDEMPOTENCY
      if (!route.idempotency) {
        addViolation({
          rule_id: "MEDUSA_API_ROUTE_WITHOUT_IDEMPOTENCY",
          severity: "P2",
          category: "routing",
          description: "Mutation route without idempotency key usage.",
          file: route.route_id,
          evidence: `Route ${route.method} ${route.path} does not implement idempotency.`,
          remediation: "Implement IdempotencyKey handling for robust mutations.",
          affected_entity: route.route_id
        });
      }
    }

    // 4. MEDUSA_API_ROUTE_WITHOUT_ERROR_CONTRACT
    const hasUnknownErrorContracts = apiRouteReport.unknown_fields.some(
      u => u.route_id === route.route_id && u.fields.includes("error_contracts")
    );
    
    if (route.error_contracts.length === 0 || hasUnknownErrorContracts) {
      addViolation({
        rule_id: "MEDUSA_API_ROUTE_WITHOUT_ERROR_CONTRACT",
        severity: "P2",
        category: "routing",
        description: "API route without explicit or detectable error contract.",
        file: route.route_id,
        evidence: `Route ${route.method} ${route.path} error contracts could not be resolved factually.`,
        remediation: "Declare error contracts of predictable types (e.g. MedusaError) so the inspector can extract them.",
        affected_entity: route.route_id
      });
    }
  }
}
