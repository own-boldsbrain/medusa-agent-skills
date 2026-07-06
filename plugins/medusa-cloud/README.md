# Medusa Cloud Plugin

Skills for managing Medusa Cloud resources through the Cloud CLI (`mcloud`). Covers setup, deployments, debugging, environment management, and variables.

> For installation and usage with other agents, refer to the [main README](../../README.md).

## Installation with Claude Code

### Prerequisites

- [Claude Code](https://github.com/anthropics/claude-code) installed
- A Medusa Cloud account (or planning to create one)

### Install Plugin

1. Start Claude:

```bash
claude
```

2. Add Medusa marketplace to Claude Code:

```bash
/plugin marketplace add medusajs/medusa-agent-skills
```

3. Install the plugin:

```bash
/plugin install medusa-cloud@medusa
```

4. Verify the plugin is loaded:

```bash
/plugin
```

## Skills Included

1. **using-medusa-cloud** - Workflow guide for Cloud CLI operations (setup, deployments, debugging, environments, variables)
2. **cloud-cli-auth** - Execute `mcloud whoami`, `mcloud use`, `mcloud login`, `mcloud logout`, `mcloud version`
3. **cloud-cli-deployments** - Execute `mcloud deployments list/get/build-logs`
4. **cloud-cli-environments** - Execute `mcloud environments list/get/create/delete/redeploy/trigger-build`
5. **cloud-cli-logs** - Execute `mcloud logs` with all filter options
6. **cloud-cli-variables** - Execute `mcloud variables list/get`
7. **cloud-cli-organizations** - Execute `mcloud organizations list/get`
8. **cloud-cli-projects** - Execute `mcloud projects list/get/delete`

## Privacy

This plugin does not collect, store, or transmit any user data or conversation information. All instructional content is provided locally through skill files.
