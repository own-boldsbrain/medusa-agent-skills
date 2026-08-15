import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const root = process.cwd();
const base = path.join(root, "plugins");

const FILLER_PHRASES = [
  /não consigo/i, /não pude/i, /como modelo de linguagem/i, /desculpe/i,
  /As an AI/i, /I cannot/i, /I can't/i, /Note:/i, /Nota:/i
];

const SECRETS_PATTERN = /C:\\Users|file:\/\/\/|\.env|Authorization|Bearer|x-goog-api-key|api[_-]?key|access[_-]?token|secret|password/i;

const brokenPatterns = [
  { name: "code_fence_glued_to_text", regex: /```[^\s`a-zA-Z0-9]/ },
  { name: "glued_bold_without_space", regex: /\*\*\(/ },
  { name: "horizontal_rule_glued_to_heading", regex: /^---#+/ },
  { name: "code_fence_glued_to_heading", regex: /```#+/ }
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // remove duplicate dashes
}

function validateFile(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  const isPtBr = file.endsWith('.pt-br.md') || file.toLowerCase().endsWith('.pt-br.md');
  const errors = [];
  
  let inFence = false;
  let lastHeadingLevel = 0;
  const slugs = new Set();
  const internalLinks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 1. Code fences
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
    }

    if (!inFence) {
      // 2. Headings jumps
      const headingMatch = line.match(/^(#{1,6})\s/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
          errors.push(`Heading jump from H${lastHeadingLevel} to H${level} at line ${i+1}`);
        }
        lastHeadingLevel = level;
        
        const text = line.substring(level).trim();
        slugs.add('#' + slugify(text));
      }

      // 3. Malformed links
      if (line.match(/\[[^\]]+\]\([^\)]+\]/)) {
        errors.push(`Malformed link at line ${i+1}: ${line.trim()}`);
      }

      // Collect internal links
      const linkRegex = /\[([^\]]+)\]\((#[^\)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        internalLinks.push({ anchor: match[2], lineIndex: i });
      }

      // 6. Secrets/Local paths
      if (SECRETS_PATTERN.test(line)) {
        if (/C:\\Users|file:\/\/\//i.test(line)) {
          errors.push(`Local path detected at line ${i+1}: ${line.trim()}`);
        }
      }

      // 7. Filler (only in PT-BR)
      if (isPtBr) {
        for (const phrase of FILLER_PHRASES) {
          if (phrase.test(line)) {
            errors.push(`LLM Filler detected at line ${i+1}: ${line.trim()}`);
          }
        }
      }

      // 8. EN contamination (only in EN files)
      if (!isPtBr) {
        const enContaminationSafe = /Referência|Finalização da compra|Carrinho|\bConta\b|Visão geral|Configuração|Fluxo|Loja|Produto|Cliente|Endereço|Pagamento/i;
        if (enContaminationSafe.test(line)) {
          errors.push(`PT-BR contamination in EN source at line ${i+1}: ${line.trim()}`);
        }
      }

      // 9. BB-14 specific Markdown breakage checks
      for (const pattern of brokenPatterns) {
        if (pattern.regex.test(line)) {
          errors.push(`Markdown breakage (${pattern.name}) detected at line ${i+1}: ${line.trim()}`);
        }
      }

      const boldCount = (line.match(/\*\*/g) || []).length;
      if (boldCount % 2 !== 0) {
        errors.push(`Unmatched bold (**) on single line at line ${i+1}`);
      }
    }
  }

  if (inFence) {
    errors.push('Unclosed code fence at end of file');
  }

  return errors;
}

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (entry.name.endsWith('.md') && full.replace(/\\/g, '/').includes('/skills/')) {
      const errors = validateFile(full);
      if (errors.length > 0) {
        results.push({ file: path.relative(root, full), errors });
      }
    }
  }
}

const results = [];
const validateAll = process.argv.includes("--all");

function gitLines(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function changedSkillMarkdown() {
  const committed = gitLines(["diff", "--name-only", "--diff-filter=ACMRT", "origin/main...HEAD"]);
  const unstaged = gitLines(["diff", "--name-only", "--diff-filter=ACMRT", "HEAD"]);
  const staged = gitLines(["diff", "--name-only", "--diff-filter=ACMRT", "--cached"]);
  const untracked = gitLines(["ls-files", "--others", "--exclude-standard"]);

  return [...new Set([...committed, ...unstaged, ...staged, ...untracked])]
    .map((file) => file.replace(/\\/g, "/"))
    .filter((file) => file.startsWith("plugins/") && file.includes("/skills/") && file.endsWith(".md"))
    .map((file) => path.join(root, file))
    .filter((file) => fs.existsSync(file));
}

if (validateAll) {
  walk(base, results);
} else {
  for (const file of changedSkillMarkdown()) {
    const errors = validateFile(file);
    if (errors.length > 0) {
      results.push({ file: path.relative(root, file), errors });
    }
  }
}

if (results.length > 0) {
  console.error("❌ Markdown Integrity Gate failed.");
  for (const res of results) {
    console.error(`\nFile: ${res.file}`);
    for (const err of res.errors) {
      console.error(`  - ${err}`);
    }
  }
  process.exit(1);
}

console.log(
  validateAll
    ? "✅ Markdown Integrity is clean for the complete plugin tree."
    : "✅ Markdown Integrity is clean for changed skill files."
);
