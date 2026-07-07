import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime, timezone

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default='.', help='Root directory')
    parser.add_argument('--output-dir', default='reports/skills', help='Output directory')
    parser.add_argument('--write-report', action='store_true')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_dir = Path(args.output_dir).resolve()
    
    ignore = {'.git', 'node_modules', 'dist', 'build', 'coverage', '.venv', 'venv', '.next', '.turbo'}
    
    skills = []
    
    for path in root.rglob('SKILL.md'):
        if any(part in ignore for part in path.parts):
            continue
            
        rel_path = path.relative_to(root)
        parts = rel_path.parts
        
        plugin_name = "unknown"
        skill_name = "unknown"
        if len(parts) >= 4 and parts[0] == 'plugins' and parts[2] == 'skills':
            plugin_name = parts[1]
            skill_name = parts[3]
        else:
            skill_name = path.parent.name
        
        localized = []
        ptbr_path = path.with_name('SKILL.pt-br.md')
        if ptbr_path.exists():
            localized.append(ptbr_path.relative_to(root).as_posix())
            
        ref_dir = path.parent / 'reference'
        has_ref = ref_dir.exists()
        
        has_json = bool(list(path.parent.glob('*.json')))
        has_scripts = (path.parent / 'scripts').exists()
        has_tests = (path.parent / 'tests').exists()
        
        skill_id = f"{plugin_name}.{skill_name}"
        
        skills.append({
            "skill_id": skill_id,
            "plugin": plugin_name,
            "skill_name": skill_name,
            "path": rel_path.as_posix(),
            "source_language": "en",
            "localized_variants": localized,
            "has_references": has_ref,
            "has_scripts": has_scripts,
            "has_tests": has_tests,
            "has_json": has_json,
            "has_api_surface": "needs_human_review",
            "has_data_surface": "needs_human_review",
            "risk_level": "medium",
            "coverage_score": 0,
            "recommended_next_action": "human_review"
        })

        if args.write_report:
            skill_out_dir = out_dir / plugin_name / skill_name
            skill_out_dir.mkdir(parents=True, exist_ok=True)
            
            inventory = {
                "skill_id": skill_id,
                "plugin": plugin_name,
                "skill_name": skill_name,
                "path": rel_path.as_posix(),
                "source_files": [rel_path.as_posix()],
                "localized_variants": localized,
                "coverage_score": 0,
                "risk_level": "medium",
                "evidence_level": "missing",
                "variables": [{"name": "ausente", "type": "ausente", "required": False, "default": None, "sensitive": False, "evidence": "ausente", "validation": "ausente"}],
                "workflows": [{"workflow_id": "WF-001", "name": "ausente", "actor": "ausente", "trigger": "ausente", "preconditions": ["ausente"], "steps": ["ausente"], "validations": ["ausente"], "fallbacks": ["ausente"], "errors_expected": ["ausente"], "logs": ["ausente"], "outputs": ["ausente"], "final_state": "ausente"}],
                "jtbd": [{"when": "ausente", "i_want": "ausente", "so_that": "ausente", "actor": "ausente", "context": "ausente", "pain": "ausente", "success_metric": "ausente", "risk": "ausente"}],
                "use_cases": [
                    {"use_case_id": f"UC-00{i}", "name": "ausente", "actor": "ausente", "scenario": "ausente", "user_input": "ausente", "processing_expected": "ausente", "system_output": "ausente", "outcome_expected": "ausente", "acceptance_criteria": ["ausente"], "risks": ["ausente"]} for i in range(1, 6)
                ],
                "does_does_not": {"does": ["ausente"], "does_not": ["ausente"], "depends_on": ["ausente"], "out_of_scope": ["ausente"], "risk_if_misused": ["ausente"]},
                "user_inputs": [{"input_name": "ausente", "type": "ausente", "origin": "ausente", "required": False, "validation": "ausente", "example": "ausente", "pii_sensitive": False, "restrictions": "ausente"}],
                "system_outputs": [{"output_name": "ausente", "type": "ausente", "format": "ausente", "consumer": "ausente", "persistence": "ausente", "example": {}, "status_possible": ["missing"]}],
                "expected_outcomes": [{"outcome_id": "OUT-001", "description": "ausente", "metric": "ausente", "baseline": "ausente", "target": "ausente", "impact_expected": "ausente", "risk": "ausente"}],
                "apis": [{"api_name": "ausente", "type": "ausente", "provider": "ausente", "base_url": "ausente", "version": "ausente", "security_auth": "ausente", "rate_limits": "ausente", "schemas": ["ausente"], "observability": "ausente"}],
                "endpoints": [{"method": "ausente", "path": "ausente", "purpose": "ausente", "request_schema": "ausente", "response_schema": "ausente", "status_codes": [], "auth_required": False, "idempotency": "ausente", "errors": ["ausente"]}],
                "urls": [{"url": "ausente", "type": "ausente", "usage": "ausente", "risk": "ausente"}],
                "connectors": [{"connector_name": "ausente", "type": "ausente", "provider": "ausente", "input": "ausente", "output": "ausente", "auth": "ausente", "rate_limit": "ausente", "failures_expected": ["ausente"], "retry_backoff": "ausente"}],
                "operations": [{"operation": "CREATE", "resource": "not_applicable", "reason": "ausente"}],
                "databases": [{"database_name": "ausente", "type": "ausente", "usage": "ausente", "entities": ["ausente"], "retention": "ausente", "risk": "ausente"}],
                "schemas": [{"schema_name": "ausente", "fields": [], "pk_fk": [], "indexes": [], "constraints": ["ausente"], "example_json": {}}],
                "relationships": [{"entity_a": "ausente", "entity_b": "ausente", "cardinality": "ausente", "key": "ausente", "integrity_rule": "ausente", "cascade_delete_behavior": "ausente"}],
                "datasets": [{"dataset_name": "ausente", "origin": "ausente", "format": "ausente", "frequency": "ausente", "main_fields": ["ausente"], "expected_quality": "ausente", "usage": "ausente"}],
                "json_files": [{"path": "ausente", "purpose": "ausente", "schema": "ausente", "producer": "ausente", "consumer": "ausente", "validation": "ausente"}],
                "tables": [{"table_name": "ausente", "columns": [], "keys": [], "indexes": [], "source": "ausente", "consumer": "ausente"}],
                "logic": [{"logic_id": "LOGIC-001", "name": "ausente", "input": "ausente", "processing": "ausente", "output": "ausente", "edge_cases": ["ausente"], "failures": ["ausente"], "complexity": "ausente"}],
                "calculations": [{"calculation_id": "CALC-001", "formula": "ausente", "variables": ["ausente"], "units": "ausente", "rounding": "ausente", "example": "ausente", "validation": "ausente"}],
                "gaps": ["needs_human_review"],
                "recommended_next_actions": ["human_review"]
            }
            
            with open(skill_out_dir / "engineering-inventory.json", "w", encoding='utf-8') as f:
                json.dump(inventory, f, indent=2, ensure_ascii=False)
                
            with open(skill_out_dir / "engineering-inventory.md", "w", encoding='utf-8') as f:
                f.write(f"# {skill_name}\n\nInventory generated. Please review `engineering-inventory.json`.")
                
    if args.write_report:
        index_data = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "repo": "own-boldsbrain/medusa-agent-skills",
            "branch": "chore/translation-forensic-repair",
            "total_skills": len(skills),
            "skills": skills
        }
        
        with open(out_dir / "index.json", "w", encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
            
        with open(out_dir / "index.md", "w", encoding='utf-8') as f:
            f.write("# Skills Inventory Index\n")
            
        with open(out_dir / "coverage-matrix.json", "w", encoding='utf-8') as f:
            json.dump({"coverage": 0, "matrix": {s["skill_id"]: "missing" for s in skills}}, f, indent=2)
            
        with open(out_dir / "coverage-matrix.md", "w", encoding='utf-8') as f:
            f.write("# Coverage Matrix\n")

        with open(out_dir / "gaps.json", "w", encoding='utf-8') as f:
            json.dump({"gaps": ["human review required for all skills"]}, f, indent=2)
            
        with open(out_dir / "gaps.md", "w", encoding='utf-8') as f:
            f.write("# Gaps\n")
            
        with open(out_dir / "jules-session-plan.json", "w", encoding='utf-8') as f:
            json.dump({"status": "pending_human_review"}, f, indent=2)
            
        with open(out_dir / "jules-session-plan.md", "w", encoding='utf-8') as f:
            f.write("# Jules Session Plan\n")

if __name__ == '__main__':
    main()
