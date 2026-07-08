import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Thresholds for BB-**-translation-* branches
const MAX_GLOBAL_FILES = 20;
const MAX_TRANSLATION_TARGETS = 5;
const MAX_REPORTS = 2;
const MAX_SCRIPTS = 2;

// Allowed governance files
const ALLOWED_GOVERNANCE_FILES = ['roadmap.md', 'ROADMAP_DOD.md'];

// Forbidden glob patterns / prefixes
const FORBIDDEN_PATTERNS = [
  /\.bak$/,
  /^translation_audit_report\./,
  /^scratch\//,
  /^reports\/jules\//,
  /^packages\//,
  /^schemas\//,
  /^registries\//,
];

function checkCI() {
  const args = process.argv.slice(2);
  const isFrameworkAccuracyMode = args.includes('--framework-accuracy');

  console.log(`🛡️  Running CI Guard... (Framework Accuracy Mode: ${isFrameworkAccuracyMode})`);

  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  
  if (!currentBranch.includes('translation-canary') && !currentBranch.includes('bb-14') && !isFrameworkAccuracyMode) {
    console.log(`Branch '${currentBranch}' is not a translation-canary branch and --framework-accuracy is not set. Skipping CI rules.`);
    return;
  }

  // Get changed files compared to main (assuming main is the base)
  let changedFilesStr;
  try {
    changedFilesStr = execSync('git diff --diff-filter=ACMRT --name-only origin/main...HEAD').toString().trim();
  } catch (err) {
    console.log('Could not compare with origin/main. Comparing with main...');
    try {
      changedFilesStr = execSync('git diff --name-only main...HEAD').toString().trim();
    } catch(err2) {
      console.log('Could not compare with main. Checking unstaged/staged files...');
      changedFilesStr = execSync('git diff --name-only HEAD').toString().trim();
      const staged = execSync('git diff --name-only --cached').toString().trim();
      if (staged) changedFilesStr += '\n' + staged;
    }
  }
  
  const changedFiles = changedFilesStr ? [...new Set(changedFilesStr.split('\n').filter(f => f))] : [];

  if (changedFiles.length === 0) {
    console.log('No files changed.');
    return;
  }

  console.log(`Changed files count: ${changedFiles.length}`);

  if (!isFrameworkAccuracyMode) {
    if (changedFiles.length > MAX_GLOBAL_FILES) {
      console.error(`❌ ERROR: PR exceeds the global file limit of ${MAX_GLOBAL_FILES}. Found ${changedFiles.length} files.`);
      process.exit(1);
    }

    const commands = [
      "node scripts/validate-skill-accuracy-registry.mjs",
      "node scripts/validate-agent-executor-registry.mjs",
      "node scripts/validate-translated-skill-loss.mjs"
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      execSync(cmd, { stdio: 'inherit' });
    }

    if (currentBranch.includes('translation-canary')) {
      let translationTargets = 0;
      let reports = 0;
      let scripts = 0;

      for (const file of changedFiles) {
        // Check forbidden files
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(file)) {
            console.error(`❌ ERROR: Forbidden file modified: ${file}`);
            process.exit(1);
          }
        }

        // Categorize files
        if (file.endsWith('.md') && !ALLOWED_GOVERNANCE_FILES.includes(file) && !file.startsWith('reports/')) {
          translationTargets++;
        } else if (file.startsWith('reports/')) {
          reports++;
        } else if (file.startsWith('scripts/')) {
          scripts++;
        }
      }

      if (translationTargets > MAX_TRANSLATION_TARGETS) {
        console.error(`❌ ERROR: PR exceeds max translation targets of ${MAX_TRANSLATION_TARGETS}. Found ${translationTargets}.`);
        process.exit(1);
      }

      if (reports > MAX_REPORTS) {
        console.error(`❌ ERROR: PR exceeds max reports of ${MAX_REPORTS}. Found ${reports}.`);
        process.exit(1);
      }

      if (scripts > MAX_SCRIPTS) {
        console.error(`❌ ERROR: PR exceeds max scripts of ${MAX_SCRIPTS}. Found ${scripts}.`);
        process.exit(1);
      }
    }
  }

  // Framework Accuracy Check
  if (isFrameworkAccuracyMode) {
    const modifiedSkills = new Set();
    
    for (const file of changedFiles) {
      if (file.endsWith('SKILL.md') || file.toLowerCase().endsWith('skill.pt-br.md')) {
        const parts = file.split('/');
        // Usually plugins/<plugin-name>/skills/<skill-name>/SKILL.md
        let skillName = null;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === 'skills' && i + 1 < parts.length) {
            skillName = parts[i + 1];
            break;
          }
        }
        if (skillName) {
          modifiedSkills.add(skillName);
        }
      }
    }

    for (const skill of modifiedSkills) {
      const expectedMd = `reports/framework-accuracy/${skill}.md`;
      const expectedJson = `reports/framework-accuracy/${skill}.json`;
      
      const hasMd = changedFiles.includes(expectedMd);
      const hasJson = changedFiles.includes(expectedJson);
      
      if (!hasMd || !hasJson) {
        console.error(`❌ ERROR: Framework Accuracy check failed for skill '${skill}'.`);
        console.error(`When a SKILL.md or SKILL.pt-br.md is modified, a corresponding framework accuracy report must be updated/created.`);
        console.error(`Missing: ${!hasMd ? expectedMd : ''} ${!hasJson ? expectedJson : ''}`);
        process.exit(1);
      }
    }
    
    if (modifiedSkills.size > 0) {
      console.log(`✅ Framework Accuracy reports verified for skills: ${[...modifiedSkills].join(', ')}`);
    } else {
      console.log(`✅ No SKILL files modified. Framework Accuracy check passed.`);
    }
  }
  
  if (currentBranch.includes('bb-14')) {
    try {
      console.log("Running translation canary validation...");
      execSync('node scripts/validate-translation-canary.mjs --suite bb14', { stdio: 'inherit' });
      console.log("Running skill translation coverage validation...");
      execSync('node scripts/validate-skill-translation-coverage.mjs', { stdio: 'inherit' });
      console.log("Running markdown integrity validation...");
      execSync('node scripts/validate-markdown-integrity.mjs', { stdio: 'inherit' });
    } catch (error) {
      console.error("❌ CI Gate Validation failed!");
      process.exit(1);
    }
  }

  console.log('✅ CI Guard checks passed! The PR is surgical and clean.');
}

checkCI();
