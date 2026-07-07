export interface WorkflowSchemaInspectionReport {
  project_root: string;
  generated_at: string;
  inspector_version: string;
  workflows: WorkflowInspectionDetail[];
  data_models: DataModelInspectionDetail[];
  diagnostics: DiagnosticDetail[];
  summary: InspectionSummary;
}

export interface WorkflowInspectionDetail {
  name: string;
  path: string;
  create_workflow_detected: boolean;
  constructor_kind: string; // e.g. "function_declaration", "arrow_function"
  workflow_response_detected: boolean;
  steps_defined: StepDefinedDetail[];
  steps_invoked: StepInvokedDetail[];
}

export interface StepDefinedDetail {
  step_name: string;
  variable_name: string;
  has_compensation: boolean;
  returns_step_response: boolean;
  uses_container: boolean;
  mutates_state_signal: boolean;
  input_identifiers?: string[];
  output_identifiers?: string[];
}

export interface StepInvokedDetail {
  step_name: string;
  call_expression: string;
  order: number;
}

export interface DataModelInspectionDetail {
  module_name: string;
  path: string;
  model_name: string;
  table_name: string;
  fields: DataModelField[];
  relationships: DataModelRelationship[];
  migration_files: string[];
}

export interface DataModelField {
  name: string;
  kind: "id" | "text" | "number" | "boolean" | "dateTime" | "json" | "enum" | "relationship" | "unknown";
  primary_key: boolean;
  nullable: boolean;
}

export interface DataModelRelationship {
  kind: "hasOne" | "belongsTo" | "hasMany" | "manyToMany" | "unknown";
  related_model_reference: string;
  mapped_by?: string;
}

export interface DiagnosticDetail {
  type: string;
  file: string;
  message: string;
}

export interface InspectionSummary {
  workflow_count: number;
  step_count: number;
  steps_with_compensation: number;
  data_model_count: number;
  migration_count: number;
}
