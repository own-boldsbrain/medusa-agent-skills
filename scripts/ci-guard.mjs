import { execSync } from 'child_process';
import path from 'path';

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
  console.log('🛡️  Running CI Guard for Translation Canary Branches...');

  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  
  if (!currentBranch.includes('translation-canary')) {
    console.log(`Branch '${currentBranch}' is not a translation-canary branch. Skipping translation CI rules.`);
    return;
  }

  // Get changed files compared to main (assuming main is the base)
  let changedFilesStr;
  try {
    changedFilesStr = execSync('git diff --name-only origin/main...HEAD').toString().trim();
  } catch (err) {
    console.log('Could not compare with origin/main. Comparing with main...');
    changedFilesStr = execSync('git diff --name-only main...HEAD').toString().trim();
  }
  
  const changedFiles = changedFilesStr ? changedFilesStr.split('\n') : [];

  if (changedFiles.length === 0) {
    console.log('No files changed.');
    return;
  }

  console.log(`Changed files count: ${changedFiles.length}`);

  if (changedFiles.length > MAX_GLOBAL_FILES) {
    console.error(`❌ ERROR: PR exceeds the global file limit of ${MAX_GLOBAL_FILES}. Found ${changedFiles.length} files.`);
    process.exit(1);
  }

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

  console.log('✅ CI Guard checks passed! The PR is surgical and clean.');
}

checkCI();
