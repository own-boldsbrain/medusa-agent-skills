import test from "node:test"
import assert from "node:assert"
import * as fs from "node:fs"
import * as path from "node:path"

const root = process.cwd()

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8")) as T
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8")
}

type Marketplace = {
  metadata: { version: string }
  plugins: Array<{ name: string; source: string }>
}

test("English and Portuguese marketplaces publish the same complete plugin set", () => {
  const english = readJson<Marketplace>(".claude-plugin/marketplace.json")
  const portuguese = readJson<Marketplace>(".claude-plugin/marketplace.pt-BR.json")
  const englishNames = english.plugins.map(({ name }) => name).sort()
  const portugueseNames = portuguese.plugins.map(({ name }) => name).sort()

  assert.equal(english.metadata.version, "1.1.0")
  assert.equal(portuguese.metadata.version, english.metadata.version)
  assert.deepEqual(portugueseNames, englishNames)
  assert.ok(englishNames.includes("medusa-cloud"))
  assert.ok(englishNames.includes("llamacloud"))

  for (const plugin of english.plugins) {
    const pluginRoot = path.join(root, plugin.source)
    assert.ok(fs.existsSync(path.join(pluginRoot, ".claude-plugin", "plugin.json")), `${plugin.name} is missing plugin.json`)
    assert.ok(
      fs.existsSync(path.join(pluginRoot, ".claude-plugin", "plugin.pt-BR.json")),
      `${plugin.name} is missing plugin.pt-BR.json`,
    )
  }
})

test("LlamaCloud manifests and canonical translation remain synchronized", () => {
  const english = readJson<{ name: string; version: string }>("plugins/llamacloud/.claude-plugin/plugin.json")
  const portuguese = readJson<{ name: string; version: string }>(
    "plugins/llamacloud/.claude-plugin/plugin.pt-BR.json",
  )
  const canonicalTranslation = "plugins/llamacloud/skills/using-llamacloud/SKILL.pt-br.md"
  const skillFiles = fs.readdirSync(path.join(root, "plugins/llamacloud/skills/using-llamacloud"))

  assert.equal(english.name, "llamacloud")
  assert.equal(portuguese.name, english.name)
  assert.equal(portuguese.version, english.version)
  assert.ok(fs.existsSync(path.join(root, canonicalTranslation)))
  assert.ok(skillFiles.includes("SKILL.pt-br.md"))
  assert.equal(skillFiles.includes("SKILL.pt-BR.md"), false)
})

test("LlamaCloud skill covers Medusa integration and the 360-degree operating contract", () => {
  const skill = readText("plugins/llamacloud/skills/using-llamacloud/SKILL.md")
  const requiredEvidence = [
    "## Medusa integration architecture",
    "Mutating routes invoke a Medusa workflow",
    "DOCUMENT_PARSER_PROVIDER",
    "Idempotency-Key",
    "Google Drive, Notion, GitHub, Linear, and Hugging Face",
    "source ACL or trust boundary",
    "pip install \"llama-cloud>=1.0\"",
    "npm install @llamaindex/llama-cloud",
    "https://mcp.llamaindex.ai/mcp",
    "https://mcp.eu.llamaindex.ai/mcp",
    "grepFileFromIndex",
    "retrieveFromIndex",
    "Kubernetes `>=1.28`",
    "Helm `>=3.7`",
    "12 vCPUs and 80 GiB",
    "https://run-llama.github.io/helm-charts",
    "llamaindex/llamacloud",
    "StorageClass",
    "OIDC",
    "Prometheus, Grafana, and Alertmanager",
    "Helm rollback",
    "## Completion contract",
  ]

  for (const evidence of requiredEvidence) {
    assert.ok(skill.includes(evidence), `missing operating evidence: ${evidence}`)
  }

  const deprecatedHeading = skill.indexOf("### Deprecated patterns")
  assert.ok(deprecatedHeading >= 0)
  for (const deprecatedPattern of [
    "pip install llama-parse",
    "run-llama/llama_parse",
    "uvx llamacloud-mcp@latest",
    "https://helm.llamaindex.ai/enterprise",
    "llamaindex-enterprise/llamacloud-platform",
  ]) {
    assert.ok(skill.indexOf(deprecatedPattern) > deprecatedHeading, `${deprecatedPattern} must be documented as deprecated`)
  }

  for (const unsafeExample of [
    "SecurePassword123",
    "YOUR_ENTERPRISE_LICENSE_KEY",
    "self_hosted_default_key",
    "docker.llamaindex.ai",
  ]) {
    assert.equal(skill.includes(unsafeExample), false, `unsafe or stale example found: ${unsafeExample}`)
  }
})

test("LlamaCloud MCP contracts expose authenticated remote writes explicitly", () => {
  const registry = readJson<{
    mcps: Array<{ mcp_id: string; status: string; security: { logs_secrets: boolean }; tools: string[] }>
  }>("registries/mcps.registry.json")
  const contracts = readJson<{
    contracts: Array<{
      server_id: string
      transport_profile: string
      default_transport: string
      tools: Array<{ tool_id: string; side_effect_level: string }>
      security: { secret_logging_forbidden: boolean; write_operations_allowed: boolean }
    }>
  }>("registries/mcp-server-contracts.registry.json")
  const mcp = registry.mcps.find(({ mcp_id }) => mcp_id === "llamacloud-platform")
  const contract = contracts.contracts.find(({ server_id }) => server_id === "llamacloud-platform")

  assert.ok(mcp)
  assert.equal(mcp.status, "active")
  assert.equal(mcp.security.logs_secrets, false)
  assert.ok(mcp.tools.includes("parseFile"))
  assert.ok(mcp.tools.includes("grepFileFromIndex"))
  assert.ok(mcp.tools.includes("retrieveFromIndex"))
  assert.ok(contract)
  assert.equal(contract.transport_profile, "remote_authenticated")
  assert.equal(contract.default_transport, "streamable_http")
  assert.equal(contract.security.secret_logging_forbidden, true)
  assert.equal(contract.security.write_operations_allowed, true)
  assert.equal(
    contract.tools.find(({ tool_id }) => tool_id === "llamacloud-platform.parseFile")?.side_effect_level,
    "read_write",
  )
  assert.equal(
    contract.tools.find(({ tool_id }) => tool_id === "llamacloud-platform.grepFileFromIndex")?.side_effect_level,
    "read_only",
  )
  assert.equal(
    contract.tools.find(({ tool_id }) => tool_id === "llamacloud-platform.retrieveFromIndex")?.side_effect_level,
    "read_only",
  )
})

test("Accuracy evidence is registered and the clean-install dependency is explicit", () => {
  const accuracy = readJson<{
    skills_accuracy: Array<{
      skill_id: string
      framework_accuracy_report: string
      skill_accuracy_report: string
      evidence_level: string
    }>
  }>("registries/skills-accuracy.registry.json")
  const packageJson = readJson<{ scripts: Record<string, string>; devDependencies: Record<string, string> }>("package.json")
  const entry = accuracy.skills_accuracy.find(({ skill_id }) => skill_id === "using-llamacloud")

  assert.ok(entry)
  assert.equal(entry.evidence_level, "approved-with-evidence")
  assert.ok(fs.existsSync(path.join(root, entry.framework_accuracy_report)))
  assert.ok(fs.existsSync(path.join(root, entry.skill_accuracy_report)))
  assert.ok(packageJson.devDependencies.ajv)
  assert.ok(packageJson.scripts.check)
})
