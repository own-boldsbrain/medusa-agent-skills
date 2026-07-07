export interface MedusaRouteSchema {
  route_id: string;
  scope: "admin" | "store" | "internal" | "unknown";
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "unknown";
  path: string;
  purpose: string;
  request_schema: string;
  response_schema: string;
  auth_required: boolean;
  auth_strategy: string;
  middlewares: string[];
  zod_validator_required: boolean;
  workflow_invoked: string;
  query_graph_usage: boolean;
  query_index_usage: boolean;
  idempotency: boolean;
  rate_limit: {
    limit: number;
    window_seconds: number;
  };
  status_codes: number[];
  error_contracts: string[];
  audit_log_required: boolean;
}

export interface RouteEvidence {
  route_id: string;
  file: string;
  handler_export: string;
  middleware_sources: string[];
  detected_symbols: string[];
}

export interface UnknownFields {
  route_id: string;
  fields: string[];
}

export interface Diagnostic {
  type: string;
  file: string;
  message: string;
}

export interface Summary {
  route_count: number;
  admin_route_count: number;
  store_route_count: number;
  internal_route_count: number;
  routes_with_auth: number;
  routes_with_zod: number;
  routes_with_workflow: number;
}

export interface ApiRouteInspectionReport {
  project_root: string;
  generated_at: string;
  inspector_version: string;
  api_routes: MedusaRouteSchema[];
  route_evidence: RouteEvidence[];
  unknown_fields: UnknownFields[];
  diagnostics: Diagnostic[];
  summary: Summary;
}
