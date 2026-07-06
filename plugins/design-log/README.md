# design-log Plugin

Teaches AI agents how to use the **YSH Store Design-Log methodology** — a structured decision-logging system that provides persistent external memory across AI sessions.

## Why this plugin exists

AI agents lose context between sessions. The design-log system solves this by storing architectural and strategic decisions as structured Markdown files in the `design-log/` folder of the YSH Store repository. Every agent **must** consult these logs before taking any action — this is a non-negotiable rule defined in `AGENTS.md` Section 2.1.

This plugin teaches agents exactly how to:

1. **Consult** existing design-log entries before coding
2. **Create** new entries when a decision needs to be recorded
3. **Update** entry status as work progresses (from `draft` → `done`)
4. **Align** every implementation with previously approved decisions

## Skills

| Skill | Description |
|-------|-------------|
| `design-log-workflow` | Mandatory pre-action consultation protocol — scan logs, identify relevant entries, check status, align implementation |
| `design-log-create` | Step-by-step guide for drafting a new design-log entry, including required fields, naming convention, and lifecycle |

## Core principle

> **Context > Prompt** — Never replace accumulated project context with a clever prompt. The design-log is the project's persistent memory. Agents that skip it create contradictions.

## Quick reference

- Design-log entries live in: `design-log/DL-NNN-slug.md`
- Naming: `DL-NNN` where NNN is a zero-padded number (e.g., `DL-001`, `DL-042`)
- Status lifecycle: `draft` → `review` → `approved` → `executing` → `done` | `rejected` | `superseded`
- Only **approved** and **executing** entries have binding authority over agent behavior

## Installation

Add this plugin to your `.claude-plugin/marketplace.json`:

```json
{
  "name": "design-log",
  "source": "./plugins/design-log"
}
```
