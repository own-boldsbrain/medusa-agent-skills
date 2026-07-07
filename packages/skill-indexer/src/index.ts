import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

interface SkillEntry {
  skill_id: string;
  plugin: string;
  skill_name: string;
  path: string;
  title: string;
  description: string;
  frontmatter: {
    name: string;
    description: string;
  };
  source_language: string;
  localized_variants: string[];
  references: string[];
  expected_agent_behaviors: {
    does: string[];
    does_not: string[];
  };
  tools_expected: string[];
  medusa_domains: string[];
  risk_level: "P0" | "P1" | "P2" | "P3";
  evidence_level: "low" | "medium" | "high" | "critical";
  coverage_requirements: {
    min_files: number;
    min_percentage: number;
  };
  validation_commands: string[];
  human_review_required: boolean;
  status: "proposed" | "active" | "deprecated";
}

function parseSimpleYaml(content: string): Record<string, string> {
  const lines = content.split("\n");
  const result: Record<string, string> = {};
  for (const line of lines) {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(":").trim().replace(/^['"]|['"]$/g, "");
      result[key] = val;
    }
  }
  return result;
}

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file: string) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

function generateDeterministicId(plugin: string, skillName: string): string {
  const combined = `${plugin}-${skillName}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return combined;
}

function buildIndex(pluginsDir: string, projectRoot: string): void {
  const allFiles = getFilesRecursively(pluginsDir);
  const skillFiles = allFiles.filter((f) => {
    const base = path.basename(f);
    return base === "SKILL.md" || base === "SKILL.pt-br.md" || base === "SKILL.pt-BR.md";
  });

  const skillsIndex: SkillEntry[] = [];
  const coverageMap: Record<string, number> = {};

  for (const file of skillFiles) {
    const relativePath = path.relative(projectRoot, file).replace(/\\/g, "/");
    const content = fs.readFileSync(file, "utf-8");
    const parts = content.split("---");

    let frontmatterRaw = "";
    if (parts.length >= 3) {
      frontmatterRaw = parts[1];
    }

    const parsedYaml = parseSimpleYaml(frontmatterRaw);
    const name = parsedYaml["name"] || parsedYaml["Name"] || path.basename(path.dirname(file));
    const description = parsedYaml["description"] || parsedYaml["Description"] || "No description provided.";

    // Extract plugin name from path (e.g. plugins/ecommerce-storefront/skills/...)
    const pathParts = relativePath.split("/");
    const pluginName = pathParts[1] || "core";
    const skillName = pathParts[pathParts.length - 2] || "general";

    const skillId = generateDeterministicId(pluginName, skillName);

    // Detect references in directory
    const dir = path.dirname(file);
    const refDir = path.join(dir, "references");
    let references: string[] = [];
    if (fs.existsSync(refDir)) {
      references = fs.readdirSync(refDir).map((f: string) => path.join("references", f).replace(/\\/g, "/"));
    }

    const isPtBr = file.toLowerCase().endsWith(".pt-br.md");

    // Check if the skill already exists in the list to avoid duplication and merge localized variants
    let existingEntry = skillsIndex.find((s) => s.skill_id === skillId);
    if (existingEntry) {
      if (isPtBr && !existingEntry.localized_variants.includes("pt-br")) {
        existingEntry.localized_variants.push("pt-br");
      }
      continue;
    }

    const skillEntry: SkillEntry = {
      skill_id: skillId,
      plugin: pluginName,
      skill_name: skillName,
      path: relativePath,
      title: name,
      description: description,
      frontmatter: {
        name: name,
        description: description
      },
      source_language: isPtBr ? "pt-br" : "en",
      localized_variants: isPtBr ? ["pt-br"] : ["en"],
      references: references,
      expected_agent_behaviors: {
        does: ["follow framework patterns", "write modular code"],
        does_not: ["bypass workflow step layer", "write plain fetch calls"]
      },
      tools_expected: ["scan_project", "validate_layering"],
      medusa_domains: ["core", "workflows"],
      risk_level: "P1",
      evidence_level: "medium",
      coverage_requirements: {
        min_files: 1,
        min_percentage: 80.0
      },
      validation_commands: ["npm run typecheck"],
      human_review_required: true,
      status: "proposed"
    };

    skillsIndex.push(skillEntry);

    // Initial coverage score based on references count and structure completeness
    coverageMap[skillId] = references.length > 0 ? 100 : 50;
  }

  // Ensure output directory exists
  const reportsGenDir = path.join(projectRoot, "reports", "generated");
  fs.mkdirSync(reportsGenDir, { recursive: true });

  fs.writeFileSync(
    path.join(reportsGenDir, "skills.index.generated.json"),
    JSON.stringify({ skills: skillsIndex }, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.join(reportsGenDir, "skills.coverage.generated.json"),
    JSON.stringify({ coverage: coverageMap }, null, 2),
    "utf-8"
  );

  console.log(`Indexed ${skillsIndex.length} skills successfully.`);
}

// Running script if called directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");
const pluginsDir = path.join(projectRoot, "plugins");
if (fs.existsSync(pluginsDir)) {
  buildIndex(pluginsDir, projectRoot);
}
