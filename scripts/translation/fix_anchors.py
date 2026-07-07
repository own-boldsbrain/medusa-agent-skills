import json
import argparse
import re
from pathlib import Path
import sys

scripts_dir = Path(__file__).parent
sys.path.append(str(scripts_dir))

from ast_validator import extract_ast_metrics, slugify_github_like

def apply_fix_anchors(text: str) -> str:
    ast_metrics = extract_ast_metrics(text)
    headings = ast_metrics["headings"]
    
    # We only care about headings level 2 usually for TOC, but let's take all
    h_slugs = [slugify_github_like(h[1]) for h in headings]
    
    toc_pattern = re.compile(r'^(\s*-\s+\[([^\]]+)\]\()#([^\)]+)(\))', re.MULTILINE)
    
    def replace_anchor(match):
        prefix = match.group(1)
        link_text = match.group(2)
        old_anchor = match.group(3)
        suffix = match.group(4)
        
        link_words = set(slugify_github_like(link_text).split('-'))
        best_slug = None
        max_overlap = 0
        
        for slug in h_slugs:
            h_words = set(slug.split('-'))
            overlap = len(link_words.intersection(h_words))
            if overlap > max_overlap:
                max_overlap = overlap
                best_slug = slug
                
        if best_slug and max_overlap > 0:
            return f'{prefix}#{best_slug}{suffix}'
        return match.group(0)
        
    return toc_pattern.sub(replace_anchor, text)

def process_queue(queue_file, priority, dry_run, write, backup, limit, output):
    with open(queue_file, "r", encoding="utf-8") as f:
        queues = json.load(f)
        
    items = queues.get(priority, [])
    if limit:
        items = items[:limit]
        
    print(f"Processing {len(items)} files in {priority} queue (dry_run={dry_run}, write={write})")
    
    results = []
    
    for item in items:
        tgt_file = item["target"]
        tgt_path = Path(tgt_file)
        
        if not tgt_path.exists():
            continue
            
        original_text = tgt_path.read_text(encoding="utf-8")
        new_text = apply_fix_anchors(original_text)
        
        changed = original_text != new_text
        
        if changed and write and not dry_run:
            if backup:
                tgt_path.with_suffix(tgt_path.suffix + ".bak").write_text(original_text, encoding="utf-8")
            tgt_path.write_text(new_text, encoding="utf-8")
            
        results.append({
            "target": tgt_file,
            "changed": changed
        })
        
    if output:
        with open(output, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
            
    print(f"Finished processing. Changed {sum(1 for r in results if r['changed'])} files.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--queue", required=True)
    parser.add_argument("--priority", required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--backup", action="store_true")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--output", default=None)
    args = parser.parse_args()
    
    process_queue(args.queue, args.priority, args.dry_run, args.write, args.backup, args.limit, args.output)
