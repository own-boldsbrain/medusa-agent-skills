import * as fs from "fs";
import * as path from "path";

const CANARY_SUITES = {
  bb08: [
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/features/promotions.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/features/promotions.pt-br.md"
    },
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/features/wishlist.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/features/wishlist.pt-br.md"
    },
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/cart-popup.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/cart-popup.pt-BR.md"
    }
  ],
  bb09: [
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/country-selector.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/country-selector.pt-br.md"
    },
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/product-card.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/product-card.pt-br.md"
    },
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/navbar.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/navbar.pt-br.md"
    },
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/popups.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/popups.pt-br.md"
    },
    {
      source: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/footer.md",
      target: "plugins/ecommerce-storefront/skills/storefront-best-practices/reference/components/footer.pt-br.md"
    }
  ]
};

const FILLER_PHRASES = [
  "aqui está", "claro,", "claro!", "com certeza", "como solicitado",
  "abaixo está", "neste documento vamos", "neste guia vamos",
  "vamos explorar", "vamos ver", "espero que isso ajude", "se precisar",
  "obrigado por", "resumindo"
]; // "em resumo" handled separately

const META_LLM_TEXT = [
  "como modelo de linguagem", "não posso", "não tenho acesso",
  "fiz uma tradução", "mantive a estrutura", "segue a versão",
  "aqui está a tradução"
];

const ENGLISH_RESIDUALS = ["overview", "checklist", "summary", "reward loyalty", "vip codes", "member discounts"];

// Basic GitHub-style slugger
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // remove duplicate dashes
}

function extractMarkdownFeatures(content) {
  const lines = content.split(/\r?\n/);
  const headings = [];
  const codeFences = [];
  const links = [];
  const anomalies = [];
  let inCodeBlock = false;
  let codeBlockLineCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code fences
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        codeFences.push({ lineIndex: i, lang: line.trim().replace("```", "") });
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLineCount++;
      continue; // Skip processing other things inside code block
    }

    // Check headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      headings.push({ level, text, slug: slugify(text) });
      
      // Anomaly: ## # or empty text
      if (text === "#" || text === "") {
        anomalies.push(`Empty or broken heading at line ${i+1}`);
      }
    } else if (line.match(/^(#{1,6})[^#\s]/)) {
      // Anomaly: ##Heading without space
      anomalies.push(`Heading without space at line ${i+1}`);
    }

    // Check internal links
    const linkRegex = /\[([^\]]+)\]\((#[^\)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      links.push({ text: match[1], anchor: match[2], lineIndex: i });
    }
  }

  return { headings, codeFences, links, anomalies };
}

function runValidation(suite) {
  const reports = [];
  let globalPassed = true;

  const pairsToValidate = suite === 'all' 
    ? [...CANARY_SUITES.bb08, ...CANARY_SUITES.bb09]
    : CANARY_SUITES[suite];

  for (const pair of pairsToValidate) {
    const sourcePath = path.resolve(process.cwd(), pair.source);
    const targetPath = path.resolve(process.cwd(), pair.target);
    
    let report = {
      file: pair.target,
      passed: true,
      errors: []
    };

    if (!fs.existsSync(sourcePath)) {
      report.errors.push(`Source file not found: ${pair.source}`);
      report.passed = false;
      reports.push(report);
      globalPassed = false;
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      report.errors.push(`Target file not found: ${pair.target}`);
      report.passed = false;
      reports.push(report);
      globalPassed = false;
      continue;
    }

    const sourceContent = fs.readFileSync(sourcePath, "utf-8");
    const targetContent = fs.readFileSync(targetPath, "utf-8");

    const sourceFeatures = extractMarkdownFeatures(sourceContent);
    const targetFeatures = extractMarkdownFeatures(targetContent);

    // Validate Heading Counts by level
    const sourceHeadingCounts = {};
    sourceFeatures.headings.forEach(h => sourceHeadingCounts[h.level] = (sourceHeadingCounts[h.level] || 0) + 1);
    const targetHeadingCounts = {};
    targetFeatures.headings.forEach(h => targetHeadingCounts[h.level] = (targetHeadingCounts[h.level] || 0) + 1);

    for (let level = 1; level <= 6; level++) {
      if ((sourceHeadingCounts[level] || 0) !== (targetHeadingCounts[level] || 0)) {
        report.errors.push(`Heading level H${level} count mismatch: Source has ${sourceHeadingCounts[level] || 0}, Target has ${targetHeadingCounts[level] || 0}`);
        report.passed = false;
      }
    }

    // Validate Code Fences
    if (sourceFeatures.codeFences.length !== targetFeatures.codeFences.length) {
      report.errors.push(`Code fence count mismatch: Source has ${sourceFeatures.codeFences.length}, Target has ${targetFeatures.codeFences.length}`);
      report.passed = false;
    }

    // Validate Internal Links
    const targetSlugs = new Set(targetFeatures.headings.map(h => "#" + h.slug));
    const sourceSlugs = new Set(sourceFeatures.headings.map(h => "#" + h.slug));
    
    // Sometimes original files have manual anchors, so we allow an internal link if it exists in targetSlugs OR if it existed in sourceSlugs (meaning it was a manual anchor kept as-is)
    for (const link of targetFeatures.links) {
      if (!targetSlugs.has(link.anchor) && !sourceSlugs.has(link.anchor)) {
        report.errors.push(`Broken internal link at line ${link.lineIndex + 1}: ${link.anchor}`);
        report.passed = false;
      }
    }

    // Anomalies
    if (targetFeatures.anomalies.length > 0) {
      report.errors.push(...targetFeatures.anomalies);
      report.passed = false;
    }

    // Text analysis
    const lines = targetContent.split(/\r?\n/);
    const hasSummarySource = sourceContent.toLowerCase().includes("## summary");
    
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      
      // Filler phrases
      for (const phrase of FILLER_PHRASES) {
        if (lineLower.includes(phrase)) {
          report.errors.push(`Filler phrase detected at line ${i+1}: "${phrase}"`);
          report.passed = false;
        }
      }

      if (lineLower.includes("em resumo") && !hasSummarySource) {
        report.errors.push(`"em resumo" detected without corresponding "Summary" in source at line ${i+1}`);
        report.passed = false;
      }

      // Meta LLM
      for (const phrase of META_LLM_TEXT) {
        if (lineLower.includes(phrase)) {
          report.errors.push(`Meta-LLM phrase detected at line ${i+1}: "${phrase}"`);
          report.passed = false;
        }
      }

      // English Residuals
      for (const phrase of ENGLISH_RESIDUALS) {
        // Simple word boundary check to avoid matching inside other words
        const regex = new RegExp(`\\b${phrase}\\b`, 'i');
        if (regex.test(lineLower) && !targetFeatures.codeFences.some(c => c.lineIndex < i && i < (c.lineIndex + 1000))) { 
          // skip checking english words inside code fences (simplified skip)
          if (lines[i].trim().startsWith("`") || lines[i].includes("`" + phrase + "`")) continue; // skip inline code
          // Also skip if it's a URL
          if (lines[i].includes("http")) continue;
          
          report.errors.push(`English residual detected at line ${i+1}: "${phrase}"`);
          report.passed = false;
        }
      }

      // Specific suspicious translations
      if (lineLower.includes("móvel") && !lineLower.includes("dispositivo móvel") && !lineLower.includes("telefone móvel")) {
        report.errors.push(`Suspicious translation "móvel" detected at line ${i+1}`);
        report.passed = false;
      }
      if (lineLower.includes("preço de venda")) {
        report.errors.push(`Suspicious translation "preço de venda" (should be "preço promocional") at line ${i+1}`);
        report.passed = false;
      }
      if (lineLower.includes("código de promoção de entrada")) {
        report.errors.push(`Suspicious translation "código de promoção de entrada" at line ${i+1}`);
        report.passed = false;
      }
      if (lineLower.includes("linha de corte")) {
        report.errors.push(`Suspicious translation "linha de corte" (should be "preço riscado") at line ${i+1}`);
        report.passed = false;
      }
    }

    if (!report.passed) {
      globalPassed = false;
    }
    reports.push(report);
  }

  // Create reports dir
  const reportsDir = path.resolve(process.cwd(), "reports/translation-canary");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Generate markdown report
  let mdReport = `# Canary Translation Report (${suite.toUpperCase()})\n\n`;
  mdReport += `Generated at: ${new Date().toISOString()}\n\n`;
  mdReport += `Status: ${globalPassed ? "✅ PASSED" : "❌ FAILED"}\n\n`;
  
  for (const report of reports) {
    mdReport += `## ${path.basename(report.file)}\n`;
    mdReport += `Status: ${report.passed ? "✅ PASSED" : "❌ FAILED"}\n`;
    if (report.errors.length > 0) {
      mdReport += `\nErrors:\n`;
      for (const err of report.errors) {
        mdReport += `- ${err}\n`;
      }
    }
    mdReport += `\n`;
  }

  const suiteSuffix = suite === 'all' ? 'all' : suite;
  const reportOutput = `reports/translation-canary/storefront-${suiteSuffix}.md`;
  const jsonOutput = `reports/translation-canary/storefront-${suiteSuffix}.json`;

  fs.writeFileSync(path.join(process.cwd(), reportOutput), mdReport);
  fs.writeFileSync(path.join(process.cwd(), jsonOutput), JSON.stringify({ passed: globalPassed, reports }, null, 2));

  console.log(mdReport);
  if (!globalPassed) {
    process.exit(1);
  }
}

// Check arguments
const args = process.argv.slice(2);
let suite = 'bb09'; // Default
if (args.includes('--suite')) {
  const suiteIndex = args.indexOf('--suite') + 1;
  if (suiteIndex < args.length) {
    const requestedSuite = args[suiteIndex];
    if (requestedSuite === 'bb08' || requestedSuite === 'bb09' || requestedSuite === 'all') {
      suite = requestedSuite;
    }
  }
}

runValidation(suite);
