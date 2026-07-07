import * as fs from "fs";
import * as path from "path";
import { scanMedusaProject } from "../packages/medusa-repo-scanner/src/scanner.js";

console.log("Starting Medusa Repository Structural Scan...");

const projectRoot = path.resolve(".");
const report = scanMedusaProject(projectRoot);

const reportsGenDir = path.join(projectRoot, "reports", "generated");
fs.mkdirSync(reportsGenDir, { recursive: true });

const outputPath = path.join(reportsGenDir, "medusa-structure.json");
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");

console.log(`Scan finished successfully!`);
console.log(`Output written to: ${path.relative(projectRoot, outputPath)}`);
console.log(`Summary: ${report.summary}`);

if (report.findings.length > 0) {
  console.log(`\nFindings detected (${report.findings.length}):`);
  for (const finding of report.findings) {
    console.log(`- [${finding.level}] ${finding.type} in ${finding.file}: ${finding.message}`);
  }
}
