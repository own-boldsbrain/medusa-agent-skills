import json
import argparse
import re
from pathlib import Path

def apply_fix_collapsed_md(text: str) -> str:
    # Fix collapsed lists like **Title:**- item -> **Title:**\n\n- item
    # Be careful to replace only where there is no newline
    pattern_list = re.compile(r"(\*\*[^*\n]+?\*\*)[ \t]*-[ \t]+")
    # \1 matches the bold text. We replace with \1\n\n- 
    # But wait, what if it's multiple matches?
    # Let's use a sub function
    text = pattern_list.sub(r"\1\n\n- ", text)
    
    pattern_numbered = re.compile(r"(\*\*[^*\n]+?\*\*)[ \t]*(\d+\.)")
    text = pattern_numbered.sub(r"\1\n\n\2", text)
    
    return text

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
        new_text = apply_fix_collapsed_md(original_text)
        
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
