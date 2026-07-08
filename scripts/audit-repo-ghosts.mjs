import fs from 'fs';
import path from 'path';

console.log("Starting Repo Hygiene Ghost Sweep...");

const projectRoot = path.resolve('.');

// ghost_type enum:
// - backup_file
// - temp_file
// - local_agent_state
// - local_planning_artifact
// - generated_report
// - stale_roadmap_status (not found by file scan, done conceptually, but we can flag roadmap.md if we want, but it's updated manually)
// - casing_duplicate
// - untracked_runtime_artifact
// - forbidden_jules_runtime_artifact
// - keep_active_jules_area

const ghosts = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else {
      let ghostType = null;
      let action = null;

      // 1. local_agent_state
      if (relPath.startsWith('.gemini/') || relPath.startsWith('.claude/') || relPath.startsWith('.antigravity/') || relPath.startsWith('.vscode/')) {
        ghostType = 'local_agent_state';
        action = 'add_to_gitignore';
      }
      // 2. local_planning_artifact
      else if (['task.md', 'walkthrough.md', 'implementation_plan.md'].includes(entry.name)) {
        ghostType = 'local_planning_artifact';
        action = 'add_to_gitignore';
      }
      // 3. backup_file
      else if (entry.name.endsWith('.bak')) {
        if (relPath.startsWith('reports/jules/')) {
          ghostType = 'forbidden_jules_runtime_artifact';
          action = 'forbid_and_delete';
        } else {
          ghostType = 'backup_file';
          action = 'add_to_gitignore';
        }
      }
      // 4. temp_file
      else if (entry.name.endsWith('.tmp') || entry.name.endsWith('.temp') || entry.name.endsWith('.log') || entry.name.includes('.local') || entry.name === '.DS_Store' || entry.name === 'Thumbs.db') {
        if (relPath.startsWith('reports/jules/')) {
          if (entry.name.endsWith('.log')) {
             // Logs in jules are IGNORE unless explicitly evidence. We'll flag as untracked.
             ghostType = 'untracked_runtime_artifact';
             action = 'ignore_via_gitignore';
          } else {
             ghostType = 'forbidden_jules_runtime_artifact';
             action = 'forbid_and_delete';
          }
        } else {
          ghostType = 'temp_file';
          action = 'add_to_gitignore';
        }
      }
      // 5. jules active area
      else if (relPath.startsWith('reports/jules/tmp/') || relPath.startsWith('reports/jules/scratch/') || relPath.startsWith('reports/jules/private/')) {
        ghostType = 'forbidden_jules_runtime_artifact';
        action = 'ignore_via_gitignore';
      }
      else if (relPath.startsWith('reports/jules/')) {
        ghostType = 'keep_active_jules_area';
        action = 'keep';
      }
      // 6. generated_report/scratch
      else if (relPath.startsWith('reports/generated/') || relPath.startsWith('scratch/') || relPath.startsWith('tmp/')) {
        ghostType = 'generated_report';
        action = 'add_to_gitignore';
      }

      if (ghostType) {
        const stats = fs.statSync(fullPath);
        ghosts.push({
          file: relPath,
          size_bytes: stats.size,
          ghost_type: ghostType,
          suggested_action: action
        });
      }
    }
  }
}

scanDir(projectRoot);

const reportsDir = path.join(projectRoot, 'reports', 'repo-hygiene');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

fs.writeFileSync(path.join(reportsDir, 'ghost-files.json'), JSON.stringify({ ghosts }, null, 2));

let mdContent = `# Repo Hygiene: Ghost Sweep\n\nGenerated at: ${new Date().toISOString()}\n\n`;
mdContent += `Total ghosts found: ${ghosts.length}\n\n`;
mdContent += `| File | Size (bytes) | Ghost Type | Suggested Action |\n`;
mdContent += `|---|---|---|---|\n`;
for (const g of ghosts) {
  mdContent += `| \`${g.file}\` | ${g.size_bytes} | \`${g.ghost_type}\` | ${g.suggested_action} |\n`;
}

fs.writeFileSync(path.join(reportsDir, 'ghost-files.md'), mdContent);

console.log(`Scan complete. Found ${ghosts.length} ghosts. Reports saved to reports/repo-hygiene/`);
