import sys
import json
import argparse
from pathlib import Path
from rapidfuzz import fuzz
from models import ValidationIssue, Hit

def get_paragraphs(text):
    return [p.strip() for p in text.split('\n\n') if p.strip() and not p.startswith('```')]

def check_semantic_drift(source_text, target_text):
    src_paras = get_paragraphs(source_text)
    tgt_paras = get_paragraphs(target_text)
    
    chunk_ratio = len(tgt_paras) / len(src_paras) if src_paras else 1.0
    
    # Compare common tokens (numbers, urls, formatting) which should remain similar
    # Token set ratio ignores ordering and focuses on common words/tokens
    total_score = 0
    issues = []
    
    min_len = min(len(src_paras), len(tgt_paras))
    for i in range(min_len):
        score = fuzz.token_set_ratio(src_paras[i], tgt_paras[i])
        total_score += score
        if score < 15 and len(src_paras[i]) > 20:  # Very low similarity for a substantial paragraph
            issues.append(ValidationIssue(
                severity="P1",
                type="possible_semantic_drift",
                message=f"Paragraph {i+1} has very low token similarity ({score}%).",
                hits=[Hit(
                    category="semantic_drift",
                    line=i,
                    excerpt=tgt_paras[i][:100] + "..."
                )]
            ))
            
    avg_score = total_score / max(len(src_paras), len(tgt_paras)) if src_paras else 100.0
    
    if chunk_ratio < 0.8:
        issues.append(ValidationIssue(
            severity="P0",
            type="severe_paragraph_loss",
            message=f"Target has only {len(tgt_paras)} paragraphs vs source {len(src_paras)}."
        ))
        
    return {
        "score": avg_score,
        "issues": issues,
        "chunk_ratio": chunk_ratio
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source_file")
    parser.add_argument("target_file")
    args = parser.parse_args()
    
    src = Path(args.source_file).read_text(encoding='utf-8')
    tgt = Path(args.target_file).read_text(encoding='utf-8')
    
    result = check_semantic_drift(src, tgt)
    # Print issues
    print(json.dumps({
        "semantic_drift_score": result["score"],
        "chunk_ratio": result["chunk_ratio"],
        "issues": [i.model_dump() for i in result["issues"]]
    }, indent=2))
