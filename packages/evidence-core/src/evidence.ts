import * as fs from "fs";
import * as path from "path";

export interface EvidenceReport {
  run_id: string;
  status: "GERADO" | "VALIDADO" | "REPROVADO" | "APROVADO_COM_EVIDENCIAS";
  started_at: string;
  finished_at?: string;
  repository: string;
  branch: string;
  commit_sha: string;
  files_analyzed: string[];
  files_changed: string[];
  commands_executed: string[];
  validations: Record<string, "passed" | "failed" | "skipped">;
  failures: string[];
  pending: string[];
  logs: string[];
  summary: string;
}

export class EvidenceLogger {
  private report: EvidenceReport;

  constructor(run_id: string, repository: string, branch: string, commit_sha: string) {
    if (!run_id) throw new Error("run_id is required");
    this.report = {
      run_id,
      status: "GERADO",
      started_at: new Date().toISOString(),
      repository,
      branch,
      commit_sha,
      files_analyzed: [],
      files_changed: [],
      commands_executed: [],
      validations: {},
      failures: [],
      pending: [],
      logs: [],
      summary: ""
    };
  }

  public addCommandEvidence(command: string): void {
    if (!command) return;
    this.report.commands_executed.push(command);
  }

  public addFileEvidence(filePath: string, mode: "analyzed" | "changed"): void {
    if (!filePath) return;
    if (mode === "analyzed") {
      if (!this.report.files_analyzed.includes(filePath)) {
        this.report.files_analyzed.push(filePath);
      }
    } else {
      if (!this.report.files_changed.includes(filePath)) {
        this.report.files_changed.push(filePath);
      }
    }
  }

  public addValidationResult(key: string, result: "passed" | "failed" | "skipped"): void {
    if (!key) return;
    this.report.validations[key] = result;
  }

  public addFailure(failure: string): void {
    if (!failure) return;
    this.report.failures.push(failure);
    this.report.status = "REPROVADO";
  }

  public addPendingItem(item: string): void {
    if (!item) return;
    this.report.pending.push(item);
  }

  public logMessage(msg: string): void {
    if (!msg) return;
    // Basic secret scan gate in logs:
    const scrubbed = msg.replace(/(ghp_[a-zA-Z0-9]{36}|hf_[a-zA-Z0-9]{34})/g, "[SECRET_REDACTED]");
    this.report.logs.push(scrubbed);
  }

  public finalizeEvidenceReport(status: "GERADO" | "VALIDADO" | "REPROVADO" | "APROVADO_COM_EVIDENCIAS", summary: string): EvidenceReport {
    this.report.status = status;
    this.report.summary = summary;
    this.report.finished_at = new Date().toISOString();

    // Validation constraints
    if (this.report.commands_executed.length === 0) {
      this.addFailure("Report validation error: No commands were executed.");
    }

    return this.report;
  }

  public writeEvidenceReport(outputDir: string): string {
    const filename = `evidence-${this.report.run_id}.json`;
    const fullPath = path.join(outputDir, filename);
    fs.mkdirSync(outputDir, { recursive: true });

    // Ensure no secrets are persisted in the final payload
    const rawContent = JSON.stringify(this.report, null, 2);
    const scrubbedContent = rawContent.replace(/(ghp_[a-zA-Z0-9]{36}|hf_[a-zA-Z0-9]{34})/g, "[SECRET_REDACTED]");

    fs.writeFileSync(fullPath, scrubbedContent, "utf-8");
    return fullPath;
  }
}
