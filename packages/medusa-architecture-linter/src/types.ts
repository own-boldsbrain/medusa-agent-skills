export type RuleSeverity = "P0" | "P1" | "P2" | "P3";
export type RuleCategory = "layering" | "routing" | "workflows" | "general";

export interface ArchitectureViolation {
  rule_id: string;
  severity: RuleSeverity;
  category: RuleCategory;
  description: string;
  file: string;
  evidence: string;
  remediation: string;
  affected_entity?: string;
}

export interface ArchitectureValidationReport {
  project_root: string;
  generated_at: string;
  linter_version: string;
  source_report: {
    scanner_version: string;
    path: string;
  };
  source_reports?: {
    structure: { version: string; path: string };
    workflow_schema: { version: string; path: string };
    api_routes: { version: string; path: string };
  };
  passed: boolean;
  violations: ArchitectureViolation[];
  summary: string;
}

export interface ArchitectureRuleContext {
  report: MedusaStructureReport;
  workflowReport?: WorkflowSchemaInspectionReport;
  apiRouteReport?: ApiRouteInspectionReport;
  addViolation: (violation: ArchitectureViolation) => void;
}

export type ArchitectureRule = (context: ArchitectureRuleContext) => void;

// Mirror of scanner types needed for linter input
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
    level: string;
    type: string;
    file: string;
    message: string;
  }>;
  summary: string;
}

// Mirror of workflow schema inspector report
export interface WorkflowSchemaInspectionReport {
  project_root: string;
  generated_at: string;
  inspector_version: string;
  workflows: Array<{
    name: string;
    path: string;
    create_workflow_detected: boolean;
    constructor_kind: string;
    workflow_response_detected: boolean;
    steps_defined: Array<{
      step_name: string;
      variable_name: string;
      has_compensation: boolean;
      returns_step_response: boolean;
      uses_container: boolean;
      mutates_state_signal: boolean;
      input_identifiers?: string[];
      output_identifiers?: string[];
    }>;
    steps_invoked: Array<{
      step_name: string;
      call_expression: string;
      order: number;
    }>;
  }>;
  data_models: Array<{
    module_name: string;
    path: string;
    model_name: string;
    table_name: string;
    fields: Array<{
      name: string;
      kind: string;
      primary_key: boolean;
      nullable: boolean;
    }>;
    relationships: Array<{
      kind: string;
      related_model_reference: string;
      mapped_by?: string;
    }>;
    migration_files: string[];
  }>;
}

// Mirror of API route inspector report
export interface ApiRouteInspectionReport {
  project_root: string;
  generated_at: string;
  inspector_version: string;
  api_routes: Array<{
    route_id: string;
    scope: string;
    method: string;
    path: string;
    auth_required: boolean;
    zod_validator_required: boolean;
    workflow_invoked: string;
    idempotency: boolean;
    error_contracts: string[];
  }>;
  unknown_fields: Array<{
    route_id: string;
    fields: string[];
  }>;
}

