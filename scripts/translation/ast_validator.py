import sys
import re
import unicodedata
from markdown_it import MarkdownIt
from pathlib import Path
from models import Hit, ValidationIssue, ValidationMetrics, ValidationReport

PT_BR_SUFFIX_RE = re.compile(r"\.pt[-_]?br\.md$", re.IGNORECASE)

ENGLISH_RESIDUAL_PATTERNS = [
    "overview", "contents", "when to use", "layout patterns", "empty state",
    "mobile considerations", "during updates", "error handling",
    "implementation approach", "to implement", "pattern", "price display",
    "customer operations", "collect shipping address", "complete payment",
    "required for", "critical", "important", "wrong", "correct"
]

CONVERSATIONAL_FILLER_PATTERNS = [
    "não consigo", "não pude", "como modelo de linguagem", "desculpe",
    "não tenho informações", "i cannot", "i can't", "as an ai", "note:", "nota:"
]

PLACEHOLDER_PATTERNS = [
    r"__CODE_BLOCK_\d+__", r"__INLINE_CODE_\d+__", r"__LINK_\d+__",
    r"__URL_\d+__", r"__CALLOUT_\d+__", r"<cb\s+id=[\"']?\d+[\"']?\s*/>",
    r"<url\s+id=[\"']?\d+[\"']?\s*/>", r"<callout\s+id=[\"']?\d+[\"']?\s*/>",
    r"<fm\s*/>"
]

MARKDOWN_VIOLATION_PATTERNS = {
    "broken_heading": r"## #",
    "spaced_bold": r"\*[ \t]+\*|\*\*[ \t]+[^\n*]+[ \t]+\*\*",
    "duplicate_bullet": r"^-\s+-\s+",
    "broken_anchor_link": r"\[[^\]]+\]\([^)]+\]",
    "codeblock_inside_table": r"\|\s*```|```.*\|",
    "collapsed_bold_paragraph": r"\*\*[^*\n]+?\*\*[^\s\n<\[\(\-`*_.,;:!?)]",
    "collapsed_bold_list": r"\*\*[^*\n]+?\*\*[ \t]*-[ \t]+",
    "collapsed_bold_numbered_list": r"\*\*[^*\n]+?\*\*[ \t]*\d+\.",
    "broken_hr": r"(?m)^-\s+--$",
}

md_parser = MarkdownIt("commonmark", {"html": True})

def read_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")

def line_for_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1

def excerpt_at(text: str, start: int, end: int, radius: int = 60) -> str:
    left = max(0, start - radius)
    right = min(len(text), end + radius)
    return text[left:right].replace("\n", "\\n")

def slugify_github_like(title: str) -> str:
    title = title.strip().lower()
    title = unicodedata.normalize("NFKD", title)
    title = "".join(ch for ch in title if not unicodedata.combining(ch))
    title = re.sub(r"[^\w\s-]", "", title, flags=re.UNICODE)
    title = re.sub(r"\s+", "-", title)
    title = re.sub(r"-+", "-", title).strip("-")
    return title

def extract_ast_metrics(text: str):
    tokens = md_parser.parse(text)
    
    headings = []
    code_blocks = 0
    list_items = 0
    table_rows = 0
    
    i = 0
    while i < len(tokens):
        token = tokens[i]
        
        if token.type == "heading_open":
            level = int(token.tag[1:])
            # Next token should be inline
            if i + 1 < len(tokens) and tokens[i+1].type == "inline":
                headings.append((level, tokens[i+1].content))
        elif token.type in ("fence", "code_block"):
            code_blocks += 1
        elif token.type == "list_item_open":
            list_items += 1
        elif token.type == "tr_open":
            table_rows += 1
            
        i += 1
        
    return {
        "headings": headings,
        "code_blocks": code_blocks,
        "list_items": list_items,
        "table_rows": table_rows
    }

def github_anchor_set(headings):
    seen = {}
    anchors = set()

    for _, heading_text in headings:
        base = slugify_github_like(heading_text)
        count = seen.get(base, 0)

        if count == 0:
            anchor = base
        else:
            anchor = f"{base}-{count}"

        seen[base] = count + 1
        anchors.add(anchor)

    return anchors

def get_frontmatter(text: str) -> str:
    match = re.match(r"\A---\n.*?\n---\n", text, flags=re.DOTALL)
    return match.group(0) if match else ""

def get_toc_links(text: str):
    return re.findall(r"\[([^\]]+)\]\(#([^)]+)\)", text)

def get_callouts(text: str):
    return re.findall(r"^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]", text, flags=re.MULTILINE | re.IGNORECASE)

def find_pattern_hits(text: str, patterns: list, category: str):
    hits = []
    for pattern in patterns:
        compiled = re.compile(r"\b" + re.escape(pattern.lower()) + r"\b", re.IGNORECASE)
        for match in compiled.finditer(text.lower()):
            hits.append(Hit(
                category=category,
                pattern=pattern,
                line=line_for_offset(text, match.start()),
                excerpt=excerpt_at(text, match.start(), match.end()),
            ))
    return hits

def find_regex_hits(text: str, regexes: dict, category: str):
    hits = []
    for name, pattern in regexes.items():
        compiled = re.compile(pattern, flags=re.MULTILINE)
        for match in compiled.finditer(text):
            hits.append(Hit(
                category=category,
                type=name,
                line=line_for_offset(text, match.start()),
                match=match.group(0),
                excerpt=excerpt_at(text, match.start(), match.end()),
            ))
    return hits

def find_placeholder_leaks(text: str):
    hits = []
    for pattern in PLACEHOLDER_PATTERNS:
        compiled = re.compile(pattern)
        for match in compiled.finditer(text):
            hits.append(Hit(
                category="placeholder_leak",
                pattern=pattern,
                line=line_for_offset(text, match.start()),
                match=match.group(0),
                excerpt=excerpt_at(text, match.start(), match.end()),
            ))
    return hits

def validate_translation(source_file: str, target_file: str) -> ValidationReport:
    try:
        source_text = read_text(source_file)
        target_text = read_text(target_file)
    except Exception as exc:
        return ValidationReport(
            source=source_file,
            target=target_file,
            status="error",
            issues=[ValidationIssue(severity="P0", type="read_error", message=str(exc))],
            metrics=ValidationMetrics(**{k:0 for k in ValidationMetrics.model_fields.keys() if k != "semantic_drift_score"})
        )

    issues = []

    src_ast = extract_ast_metrics(source_text)
    tgt_ast = extract_ast_metrics(target_text)

    source_frontmatter = get_frontmatter(source_text)
    target_frontmatter = get_frontmatter(target_text)
    target_toc_links = get_toc_links(target_text)

    source_lines = len(source_text.splitlines())
    target_lines = len(target_text.splitlines())
    line_ratio = target_lines / source_lines if source_lines else 0
    
    source_callouts = get_callouts(source_text)
    target_callouts = get_callouts(target_text)

    metrics = ValidationMetrics(
        source_lines=source_lines,
        target_lines=target_lines,
        line_ratio=round(line_ratio, 4),
        source_words=len(source_text.split()),
        target_words=len(target_text.split()),
        source_chars=len(source_text),
        target_chars=len(target_text),
        source_code_blocks=src_ast["code_blocks"],
        target_code_blocks=tgt_ast["code_blocks"],
        source_headings=len(src_ast["headings"]),
        target_headings=len(tgt_ast["headings"]),
        source_lists=src_ast["list_items"],
        target_lists=tgt_ast["list_items"],
        source_tables=src_ast["table_rows"],
        target_tables=tgt_ast["table_rows"],
        source_callouts=len(source_callouts),
        target_callouts=len(target_callouts),
        source_frontmatter=bool(source_frontmatter),
        target_frontmatter=bool(target_frontmatter),
        toc_links=len(target_toc_links),
        broken_links=0,
        english_residual_hits=0,
        markdown_violations=0,
        placeholder_leaks=0,
        conversational_filler_hits=0
    )

    if line_ratio < 0.60:
        issues.append(ValidationIssue(severity="P0", type="truncated_target", message=f"Target has only {metrics.line_ratio} of source line count."))
    elif line_ratio < 0.85:
        issues.append(ValidationIssue(severity="P1", type="low_line_ratio", message=f"Target line ratio is {metrics.line_ratio}; review for content loss."))

    if source_text.strip() == target_text.strip() and len(source_text.strip()) > 10:
        issues.append(ValidationIssue(severity="P0", type="source_contaminated", message="Target is identical to source (no translation occurred)."))

    if metrics.source_code_blocks != metrics.target_code_blocks:
        issues.append(ValidationIssue(severity="P0", type="code_block_mismatch", message=f"Source has {metrics.source_code_blocks}, target has {metrics.target_code_blocks}."))

    if metrics.source_headings != metrics.target_headings:
        issues.append(ValidationIssue(severity="P0", type="heading_count_mismatch", message=f"Source has {metrics.source_headings}, target has {metrics.target_headings}."))
    else:
        for idx, ((src_level, _), (tgt_level, tgt_text)) in enumerate(zip(src_ast["headings"], tgt_ast["headings"]), start=1):
            if src_level != tgt_level:
                issues.append(ValidationIssue(
                    severity="P1", type="heading_level_mismatch",
                    message=f"Heading #{idx} level differs: source H{src_level}, target H{tgt_level}.",
                    target_heading=tgt_text
                ))

    if metrics.source_frontmatter != metrics.target_frontmatter:
        issues.append(ValidationIssue(severity="P0", type="frontmatter_mismatch", message="Frontmatter presence differs between source and target."))

    if metrics.source_lists and metrics.target_lists < metrics.source_lists * 0.85:
        issues.append(ValidationIssue(severity="P1", type="list_count_drop", message=f"List items dropped from {metrics.source_lists} to {metrics.target_lists}."))

    if metrics.source_tables != metrics.target_tables:
        issues.append(ValidationIssue(severity="P1", type="table_count_mismatch", message=f"Source has {metrics.source_tables} table lines, target has {metrics.target_tables}."))

    if metrics.source_callouts != metrics.target_callouts:
        issues.append(ValidationIssue(severity="P1", type="callout_count_mismatch", message=f"Source has {metrics.source_callouts} callouts, target has {metrics.target_callouts}."))

    anchor_set = github_anchor_set(tgt_ast["headings"])

    for link_text, anchor_id in target_toc_links:
        normalized_anchor = slugify_github_like(anchor_id)
        if anchor_id not in anchor_set and normalized_anchor not in anchor_set:
            issues.append(ValidationIssue(
                severity="P0", type="toc_anchor_mismatch",
                message=f"Anchor '#{anchor_id}' has no matching heading.",
                link_text=link_text
            ))
            metrics.broken_links += 1

    english_hits = find_pattern_hits(target_text, ENGLISH_RESIDUAL_PATTERNS, "english_residual")
    filler_hits = find_pattern_hits(target_text, CONVERSATIONAL_FILLER_PATTERNS, "conversational_filler")
    markdown_hits = find_regex_hits(target_text, MARKDOWN_VIOLATION_PATTERNS, "markdown_violation")
    placeholder_hits = find_placeholder_leaks(target_text)

    metrics.english_residual_hits = len(english_hits)
    metrics.conversational_filler_hits = len(filler_hits)
    metrics.markdown_violations = len(markdown_hits)
    metrics.placeholder_leaks = len(placeholder_hits)

    if english_hits:
        issues.append(ValidationIssue(severity="P1", type="english_residual_detected", message=f"{len(english_hits)} English residual hits.", hits=english_hits[:20]))

    if filler_hits:
        issues.append(ValidationIssue(severity="P0", type="conversational_filler_detected", message=f"{len(filler_hits)} conversational filler hits.", hits=filler_hits[:20]))

    if placeholder_hits:
        issues.append(ValidationIssue(severity="P0", type="placeholder_leak_detected", message=f"{len(placeholder_hits)} placeholder leaks.", hits=placeholder_hits[:20]))

    if markdown_hits:
        severity = "P0" if any(hit.type in {"broken_heading", "broken_anchor_link", "codeblock_inside_table"} for hit in markdown_hits) else "P1"
        issues.append(ValidationIssue(severity=severity, type="markdown_violations", message=f"{len(markdown_hits)} Markdown violations.", hits=markdown_hits[:30]))

    if not target_file.endswith(".pt-br.md"):
        issues.append(ValidationIssue(severity="P1", type="invalid_suffix", message=f"Target file must end with strictly '.pt-br.md' (found {Path(target_file).suffix} or mixed case)."))

    has_p0 = any(issue.severity == "P0" for issue in issues)
    has_p1 = any(issue.severity == "P1" for issue in issues)

    if has_p0:
        status = "failed"
    elif has_p1:
        status = "needs_review"
    else:
        status = "passed"

    return ValidationReport(
        source=source_file,
        target=target_file,
        status=status,
        issues=issues,
        metrics=metrics
    )

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("source_file")
    parser.add_argument("target_file")
    parser.add_argument("--pretty", action="store_true")
    args = parser.parse_args()
    
    report = validate_translation(args.source_file, args.target_file)
    if args.pretty:
        print(report.model_dump_json(indent=2))
    else:
        print(report.model_dump_json())
    
    if report.status in {"failed", "error"}:
        sys.exit(1)
