import os
import sys
import json
import datetime
import argparse
from pathlib import Path
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

scripts_dir = Path(__file__).parent
sys.path.append(str(scripts_dir))

from ast_validator import validate_translation
from token_finops import TokenFinOps

def calculate_bignumbers(directory, output_dir, write_report, enable_finops):
    ignore_dirs = {".git", "node_modules", ".venv", "venv", ".next", ".turbo", "dist", "build", "coverage"}
    pt_files_map = {} 
    
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            f_lower = f.lower()
            if f_lower.endswith((".pt-br.md", ".pt_br.md")):
                pt_path = os.path.join(root, f)
                en_name = f[:-9] + ".md"
                en_path = os.path.join(root, en_name)
                if os.path.exists(en_path):
                    pt_files_map[en_path] = pt_path
                    
    total_pairs = len(pt_files_map)
    statuses = {"passed": 0, "needs_review": 0, "failed": 0, "error": 0}
    issue_file_count = defaultdict(int)
    issue_occurrence_count = defaultdict(int)
    files_data = []
    
    finops = TokenFinOps() if enable_finops else None
    
    queues = {
        "P0_source_contaminated": [],
        "P0_truncated": [],
        "P0_codeblock_mismatch": [],
        "P0_placeholder_or_filler": [],
        "P1_toc_anchor_mismatch": [],
        "P1_markdown_violations": [],
        "P1_heading_mismatch": [],
        "P2_english_residual": [],
        "P3_style_review": []
    }
    
    for en_file, pt_file in pt_files_map.items():
        report = validate_translation(en_file, pt_file)
        statuses[report.status] += 1
        
        file_issue_types = set()
        for issue in report.issues:
            file_issue_types.add(issue.type)
            issue_occurrence_count[issue.type] += 1
            
        for itype in file_issue_types:
            issue_file_count[itype] += 1
            
        risk_score = 0
        if "source_contaminated" in file_issue_types: risk_score += 100 
        if "truncated_target" in file_issue_types: risk_score += 90
        if "code_block_mismatch" in file_issue_types: risk_score += 85
        if "placeholder_leak_detected" in file_issue_types: risk_score += 80
        if "conversational_filler_detected" in file_issue_types: risk_score += 80
        if "heading_count_mismatch" in file_issue_types: risk_score += 70
        if "toc_anchor_mismatch" in file_issue_types: risk_score += 60
        if "markdown_violations" in file_issue_types: risk_score += 50
        if "list_count_drop" in file_issue_types: risk_score += 40
        if "english_residual_detected" in file_issue_types: risk_score += 30
        if "low_line_ratio" in file_issue_types: risk_score += 20
        if "heading_level_mismatch" in file_issue_types: risk_score += 10
        risk_score = min(risk_score, 100)
        
        action = "none"
        queue_name = None
        
        if "truncated_target" in file_issue_types or "code_block_mismatch" in file_issue_types or "placeholder_leak_detected" in file_issue_types or "conversational_filler_detected" in file_issue_types:
            action = "retranslate_from_source"
            if "truncated_target" in file_issue_types: queue_name = "P0_truncated"
            elif "code_block_mismatch" in file_issue_types: queue_name = "P0_codeblock_mismatch"
            else: queue_name = "P0_placeholder_or_filler"
        elif "toc_anchor_mismatch" in file_issue_types or "markdown_violations" in file_issue_types or "heading_count_mismatch" in file_issue_types:
            action = "repair_by_script"
            if "toc_anchor_mismatch" in file_issue_types: queue_name = "P1_toc_anchor_mismatch"
            elif "markdown_violations" in file_issue_types: queue_name = "P1_markdown_violations"
            else: queue_name = "P1_heading_mismatch"
        elif "english_residual_detected" in file_issue_types:
            action = "repair_by_script"
            queue_name = "P2_english_residual"
        elif report.status == "needs_review":
            action = "manual_review"
            queue_name = "P3_style_review"
            
        if enable_finops:
            try:
                src_text = Path(en_file).read_text(encoding='utf-8')
                tgt_text = Path(pt_file).read_text(encoding='utf-8')
                file_tokens = finops.estimate_file_tokens(src_text, tgt_text)
                
                if action == "repair_by_script":
                    finops.record_zero_token_repair(file_tokens)
                elif action == "retranslate_from_source":
                    finops.record_llm_translation(file_tokens)
            except Exception:
                pass
            
        file_record = {
            "source": en_file,
            "target": pt_file,
            "status": report.status,
            "risk_score": risk_score,
            "action": action,
            "issues": list(file_issue_types)
        }
        files_data.append(file_record)
        
        if queue_name:
            queues[queue_name].append({
                "source": en_file,
                "target": pt_file,
                "risk_score": risk_score
            })
            
    files_data.sort(key=lambda x: x["risk_score"], reverse=True)
    top_20_risk = files_data[:20]
    
    out_dir = Path(output_dir) if output_dir else Path.cwd()
    if output_dir and not out_dir.exists():
        out_dir.mkdir(parents=True, exist_ok=True)
        
    json_report = {
        "summary": {
            "total_pairs": total_pairs,
            "passed": statuses["passed"],
            "needs_review": statuses["needs_review"],
            "failed": statuses["failed"],
            "error": statuses["error"]
        },
        "issue_file_count": dict(issue_file_count),
        "issue_occurrence_count": dict(issue_occurrence_count),
        "top_20_risk": top_20_risk,
        "generated_files": {
            "json": "translation_forensic_report.json",
            "markdown": "translation_forensic_report.md",
            "queue": "translation_repair_queue.json"
        }
    }
    
    if write_report:
        with open(out_dir / "translation_forensic_report.json", "w", encoding="utf-8") as f:
            json.dump(json_report, f, indent=2, ensure_ascii=False)
            
        with open(out_dir / "translation_repair_queue.json", "w", encoding="utf-8") as f:
            json.dump(queues, f, indent=2, ensure_ascii=False)
            
        md_report = f"# Translation Forensic Report\n\nGerado em: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        md_report += f"## Resumo Global\n- **Total de Pares**: {total_pairs}\n- 🟢 **Passed**: {statuses['passed']}\n- 🟡 **Needs Review**: {statuses['needs_review']}\n- 🔴 **Failed**: {statuses['failed']}\n\n"
        
        if enable_finops:
            md_report += f"## Token FinOps\n"
            md_report += f"- **Tokens se retraduzir tudo**: {finops.total_tokens_spent + finops.total_tokens_saved}\n"
            md_report += f"- **Tokens após triagem (High-Token P0)**: {finops.total_tokens_spent}\n"
            md_report += f"- **Tokens economizados (Zero-Token P1/P2)**: {finops.total_tokens_saved}\n\n"
            
        md_report += "## Ocorrências (Por Arquivo vs Frequência Absoluta)\n"
        md_report += "| Problema | Arquivos Afetados | Total de Ocorrências |\n|---|---|---|\n"
        for issue_type in set(list(issue_file_count.keys()) + list(issue_occurrence_count.keys())):
            md_report += f"| {issue_type} | {issue_file_count[issue_type]} | {issue_occurrence_count.get(issue_type, 'N/A')} |\n"
            
        md_report += "\n## Top 20 Arquivos Mais Críticos (Risco Máximo = 100)\n"
        for file in top_20_risk:
            md_report += f"- **Score: {file['risk_score']}** | `{os.path.basename(file['target'])}` \n  - Ação: `{file['action']}`\n  - Issues: {', '.join(file['issues'])}\n"
            
        with open(out_dir / "translation_forensic_report.md", "w", encoding="utf-8") as f:
            f.write(md_report)
            
        md_queue = "# Translation Repair Queue\n\nFila cirúrgica de reparos, categorizada por tipo de ação necessária.\n\n"
        for queue_name, items in queues.items():
            if items:
                md_queue += f"## {queue_name} ({len(items)} arquivos)\n"
                for item in sorted(items, key=lambda x: x["risk_score"], reverse=True):
                    md_queue += f"- Score {item['risk_score']} | [Source]({item['source'].replace(chr(92), '/')}) -> [Target]({item['target'].replace(chr(92), '/')})\n"
                md_queue += "\n"
                
        with open(out_dir / "translation_repair_queue.md", "w", encoding="utf-8") as f:
            f.write(md_queue)
            
    print("Status: GERADO\n")
    print("Pares analisados:")
    print(f"Passed: {statuses['passed']}")
    print(f"Needs Review: {statuses['needs_review']}")
    print(f"Failed: {statuses['failed']}")
    
    if enable_finops:
        print("\nToken FinOps:")
        total = finops.total_tokens_spent + finops.total_tokens_saved
        print(f"Tokens se retraduzir tudo: {total}")
        print(f"Tokens após triagem (P0): {finops.total_tokens_spent}")
        print(f"Tokens economizados (Zero-Token): {finops.total_tokens_saved}")
        
    print("\nTop 10 P0:")
    top_p0 = [f for f in files_data if f["action"] == "retranslate_from_source"][:10]
    for f in top_p0: print(f"  - {os.path.basename(f['target'])} (Score: {f['risk_score']})")
    
    print("\nTop 10 reparáveis sem LLM:")
    top_p1 = [f for f in files_data if f["action"] == "repair_by_script"][:10]
    for f in top_p1: print(f"  - {os.path.basename(f['target'])} (Score: {f['risk_score']})")
    
    print("\nTop 10 que exigem retradução:")
    for f in top_p0: print(f"  - {os.path.basename(f['target'])} (Score: {f['risk_score']})")
    
    print("\nTop 10 revisão manual:")
    top_rev = [f for f in files_data if f["action"] == "manual_review"][:10]
    for f in top_rev: print(f"  - {os.path.basename(f['target'])} (Score: {f['risk_score']})")
    
    if write_report:
        print("\nArquivos gerados:")
        print("- translation_forensic_report.json")
        print("- translation_forensic_report.md")
        print("- translation_repair_queue.json")
        print("- translation_repair_queue.md")
        
    print("\nPróxima ação recomendada:")
    print("- Rodar apenas fila P1 de reparo sem LLM em dry-run.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--write-report", action="store_true")
    parser.add_argument("--token-finops", action="store_true")
    parser.add_argument("--output-dir", default=None)
    args = parser.parse_args()
    
    calculate_bignumbers(args.root, args.output_dir, args.write_report, args.token_finops)
