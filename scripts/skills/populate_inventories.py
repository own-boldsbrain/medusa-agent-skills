"""
Populates engineering-inventory.json blocks by analyzing each SKILL.md.
Extracts: variables, workflows, JTBDs, use_cases, APIs, endpoints, URLs,
user_inputs, system_outputs, commands (mapped to CRUD/GET/POST/etc).
"""
import json
import re
import os
import glob
from pathlib import Path

def extract_frontmatter(content):
    m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            fm[k.strip()] = v.strip()
    return fm

def extract_headings(content):
    return re.findall(r'^(#{1,6})\s+(.+)$', content, re.MULTILINE)

def extract_code_blocks(content):
    return re.findall(r'```(\w*)\n(.*?)```', content, re.DOTALL)

def extract_urls(content):
    urls = re.findall(r'https?://[^\s\)>\]]+', content)
    return list(set(urls))

def extract_commands(content):
    blocks = extract_code_blocks(content)
    cmds = []
    for lang, code in blocks:
        if lang in ('bash', 'sh', 'shell', 'powershell', 'cmd', ''):
            for line in code.strip().split('\n'):
                line = line.strip()
                if line and not line.startswith('#') and not line.startswith('//'):
                    cmds.append(line)
    return cmds

def extract_env_vars(content):
    vars_found = re.findall(r'[A-Z][A-Z0-9_]{2,}', content)
    env_like = [v for v in set(vars_found) if len(v) > 3 and '_' in v]
    return sorted(env_like)

def extract_api_refs(content):
    apis = []
    # Look for endpoint patterns
    endpoints = re.findall(r'(GET|POST|PUT|DELETE|PATCH)\s+[`/]([^\s`]+)', content)
    for method, path in endpoints:
        apis.append({"method": method, "path": path})
    # Look for SDK method calls
    sdk_calls = re.findall(r'sdk\.\w+\.\w+', content)
    return apis, list(set(sdk_calls))

def classify_operations(content, commands):
    ops = set()
    content_lower = content.lower()
    cmd_text = ' '.join(commands).lower()
    
    keyword_map = {
        'create': ['create', 'new', 'init', 'signup', 'register', 'add'],
        'read': ['get', 'list', 'fetch', 'retrieve', 'show', 'whoami', 'status', 'query', 'read'],
        'update': ['update', 'set', 'edit', 'modify', 'change', 'use'],
        'delete': ['delete', 'remove', 'clear', 'destroy', 'logout'],
        'approve': ['approve', 'accept', 'confirm', 'promote'],
        'reject': ['reject', 'deny', 'decline', 'cancel'],
    }
    
    for op, keywords in keyword_map.items():
        for kw in keywords:
            if kw in content_lower or kw in cmd_text:
                ops.add(op)
                break
    return list(ops)

def infer_jtbds(fm, headings, content):
    jtbds = []
    desc = fm.get('description', '')
    if desc:
        jtbds.append({
            "when": f"Working with {fm.get('name', 'this skill')}",
            "i_want": desc[:200],
            "so_that": "I can implement the feature correctly",
            "status": "inferred"
        })
    # Extract from "When to Apply" or "When to Use" sections
    when_match = re.search(r'##\s+When to (?:Apply|Use)(.*?)(?=\n##|\Z)', content, re.DOTALL)
    if when_match:
        bullets = re.findall(r'[-*]\s+(.+)', when_match.group(1))
        for b in bullets[:5]:
            jtbds.append({
                "when": b.strip(),
                "i_want": "implement this correctly",
                "so_that": "the feature works as expected",
                "status": "inferred"
            })
    return jtbds

def infer_use_cases(headings, content):
    ucs = []
    # Extract from ## sections that look like commands or features
    sections = re.findall(r'###\s+(\w[\w\s]+)\n(.*?)(?=\n###|\n##|\Z)', content, re.DOTALL)
    for i, (name, body) in enumerate(sections[:5]):
        ucs.append({
            "use_case_id": f"UC-{i+1:03d}",
            "name": name.strip(),
            "scenario": body.strip()[:200] if body.strip() else "See SKILL.md",
            "status": "inferred"
        })
    if not ucs:
        for i, (level, text) in enumerate(headings[:5]):
            if len(level) >= 2:
                ucs.append({
                    "use_case_id": f"UC-{i+1:03d}",
                    "name": text.strip(),
                    "scenario": "See SKILL.md",
                    "status": "inferred"
                })
    return ucs[:5]

def infer_user_inputs(commands, env_vars, content):
    inputs = []
    # Flags from commands
    flags = set()
    for cmd in commands:
        found = re.findall(r'--(\w[\w-]+)', cmd)
        flags.update(found)
    for flag in sorted(flags)[:10]:
        inputs.append({"input_name": f"--{flag}", "type": "flag", "origin": "CLI", "status": "direct"})
    # Env vars
    for v in env_vars[:5]:
        inputs.append({"input_name": v, "type": "env_var", "origin": "environment", "status": "inferred"})
    return inputs

def infer_system_outputs(content):
    outputs = []
    if '--json' in content:
        outputs.append({"output_name": "JSON response", "type": "json", "format": "stdout", "status": "direct"})
    if 'exit code' in content.lower() or 'exit status' in content.lower():
        outputs.append({"output_name": "Exit code", "type": "integer", "format": "process", "status": "direct"})
    if re.search(r'\.md\b', content):
        outputs.append({"output_name": "Markdown file", "type": "file", "format": ".md", "status": "inferred"})
    if re.search(r'\.json\b', content):
        outputs.append({"output_name": "JSON file", "type": "file", "format": ".json", "status": "inferred"})
    if not outputs:
        outputs.append({"output_name": "Command output", "type": "text", "format": "stdout", "status": "inferred"})
    return outputs

def populate_block(block_key, friendly, items):
    filled = len(items) > 0
    return {
        "status": "direct" if filled else "missing",
        "evidencia": "extraido_do_skill_md" if filled else "ausente",
        "DOR": f"Definir {friendly}",
        "DOD": f"{friendly} validados e documentados",
        "estimativa_t_shirt": "S",
        "horas": 2,
        "risco": "baixo",
        "owner_sugerido": "A definir",
        "proxima_acao": "Validar com revisão humana" if filled else f"Mapear {friendly}",
        "items": items
    }

def analyze_skill(skill_md_path):
    with open(skill_md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fm = extract_frontmatter(content)
    headings = extract_headings(content)
    code_blocks = extract_code_blocks(content)
    urls = extract_urls(content)
    commands = extract_commands(content)
    env_vars = extract_env_vars(content)
    api_endpoints, sdk_calls = extract_api_refs(content)
    operations = classify_operations(content, commands)
    jtbds = infer_jtbds(fm, headings, content)
    use_cases = infer_use_cases(headings, content)
    user_inputs = infer_user_inputs(commands, env_vars, content)
    system_outputs = infer_system_outputs(content)
    
    # Workflows from headings
    workflows = []
    for level, text in headings:
        if len(level) == 2:
            workflows.append({"name": text.strip(), "status": "inferred"})
    
    # Does / Does not
    does = []
    does_not = []
    constraint_match = re.search(r'##\s+Constraints?(.*?)(?=\n##|\Z)', content, re.DOTALL)
    if constraint_match:
        bullets = re.findall(r'[-*]\s+(.+)', constraint_match.group(1))
        for b in bullets:
            does_not.append({"rule": b.strip(), "status": "direct"})
    
    critical_match = re.search(r'##\s+Critical[^#]*(.*?)(?=\n##|\Z)', content, re.DOTALL)
    if critical_match:
        bullets = re.findall(r'[-*]\s+(.+)', critical_match.group(1))
        for b in bullets:
            does.append({"rule": b.strip(), "status": "direct"})
    
    # URL items
    url_items = [{"url": u, "type": "reference", "status": "direct"} for u in urls[:10]]
    
    # Connector items (SDK calls)
    connector_items = [{"connector_name": s, "type": "sdk_call", "status": "inferred"} for s in sdk_calls[:10]]
    
    # Operations
    crud_items = [{"operation": op.upper(), "status": "direct"} for op in operations]
    get_items = [e for e in api_endpoints if e["method"] == "GET"]
    post_items = [e for e in api_endpoints if e["method"] == "POST"]
    create_items = [{"operation": "CREATE", "status": "inferred"}] if "create" in operations else []
    update_items = [{"operation": "UPDATE", "status": "inferred"}] if "update" in operations else []
    approve_items = [{"operation": "APPROVE", "status": "inferred"}] if "approve" in operations else []
    reject_items = [{"operation": "REJECT", "status": "inferred"}] if "reject" in operations else []
    delete_items = [{"operation": "DELETE", "status": "inferred"}] if "delete" in operations else []
    
    # JSON files referenced
    json_refs = re.findall(r'[`"]([^`"]+\.json)[`"]', content)
    json_items = [{"path": j, "status": "inferred"} for j in set(json_refs)]
    
    blocks = {
        "variables": populate_block("variables", "Variáveis", [{"name": v, "type": "env_var", "status": "inferred"} for v in env_vars[:10]]),
        "workflows": populate_block("workflows", "Workflows", workflows[:10]),
        "jtbds": populate_block("jtbds", "JTBDs", jtbds),
        "use_cases_05": populate_block("use_cases_05", "05 use cases", use_cases),
        "does_and_does_not": populate_block("does_and_does_not", "Faz / Não Faz", does + does_not if (does or does_not) else []),
        "user_inputs": populate_block("user_inputs", "User Inputs", user_inputs),
        "system_outputs": populate_block("system_outputs", "System Outputs", system_outputs),
        "expected_outcomes": populate_block("expected_outcomes", "Outcomes Esperados", [{"outcome": "Skill executes correctly", "status": "inferred"}]),
        "apis": populate_block("apis", "APIs", [{"endpoint": e["path"], "method": e["method"], "status": "direct"} for e in api_endpoints[:10]]),
        "endpoints": populate_block("endpoints", "Endpoints", [{"method": e["method"], "path": e["path"], "status": "direct"} for e in api_endpoints[:10]]),
        "urls": populate_block("urls", "URLs", url_items),
        "connectors": populate_block("connectors", "Conectores", connector_items),
        "crud": populate_block("crud", "CRUD", crud_items),
        "gets": populate_block("gets", "GETs", [{"method": "GET", "path": e["path"], "status": "direct"} for e in get_items]),
        "posts": populate_block("posts", "POSTs", [{"method": "POST", "path": e["path"], "status": "direct"} for e in post_items]),
        "create": populate_block("create", "CREATE", create_items),
        "update": populate_block("update", "UPDATE", update_items),
        "approve": populate_block("approve", "APPROVE", approve_items),
        "reject": populate_block("reject", "REJECT", reject_items),
        "delete": populate_block("delete", "DELETE", delete_items),
        "databases": populate_block("databases", "Bancos de dados", []),
        "schemas": populate_block("schemas", "Schemas", [{"schema": cb[1][:200], "lang": cb[0], "status": "inferred"} for cb in code_blocks if cb[0] in ('json', 'typescript', 'ts')][:5]),
        "relationships": populate_block("relationships", "Relacionamentos", []),
        "datasets": populate_block("datasets", "Datasets", []),
        "json_files": populate_block("json_files", "JSON files", json_items),
        "tables": populate_block("tables", "Tabelas", []),
        "logic": populate_block("logic", "Lógicas", []),
        "calculations": populate_block("calculations", "Cálculos", []),
    }
    
    return blocks

def compute_coverage(blocks):
    total = len(blocks)
    filled = sum(1 for b in blocks.values() if b.get("items"))
    direct = sum(1 for b in blocks.values() if b.get("status") == "direct")
    return {
        "total_blocks": total,
        "blocks_with_items": filled,
        "blocks_direct": direct,
        "coverage_pct": round(filled / total * 100, 1) if total > 0 else 0
    }

def main():
    repo_root = "C:/Users/fjuni/medusa-agent-skills"
    os.chdir(repo_root)

    skill_mds = glob.glob('plugins/**/SKILL.md', recursive=True) + glob.glob('skills/**/SKILL.md', recursive=True)
    
    coverage_matrix = {}
    
    for skill_md in sorted(skill_mds):
        skill_md = skill_md.replace('\\', '/')
        parts = skill_md.split('/')
        if 'plugins' in parts:
            plugin_idx = parts.index('plugins')
            plugin = parts[plugin_idx + 1]
            skill_name = parts[-2]
        else:
            plugin = "core"
            skill_name = parts[-2]

        skill_id = f"{plugin}.{skill_name}"
        
        # Check for localized variants
        localized_variants = []
        pt_br = skill_md.replace('.md', '.pt-br.md')
        if os.path.exists(pt_br):
            localized_variants.append(pt_br)

        print(f"Analyzing: {skill_id} ({skill_md})")
        blocks = analyze_skill(skill_md)
        cov = compute_coverage(blocks)
        
        inventory_data = {
            "skill_id": skill_id,
            "plugin": plugin,
            "skill_name": skill_name,
            "path": skill_md,
            "source_files": [skill_md],
            "localized_variants": localized_variants,
            "coverage_score": cov["coverage_pct"],
            "risk_level": "low" if cov["coverage_pct"] > 50 else "medium" if cov["coverage_pct"] > 20 else "high",
            "evidence_level": "direct" if cov["blocks_direct"] > 10 else "inferred" if cov["blocks_with_items"] > 5 else "missing",
            "coverage_details": cov,
            "blocks": blocks
        }
        
        out_dir = f"reports/skills/{plugin}/{skill_name}"
        os.makedirs(out_dir, exist_ok=True)
        
        json_path = os.path.join(out_dir, "engineering-inventory.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(inventory_data, f, indent=2, ensure_ascii=False)
            f.write('\n')
        
        # Generate MD
        md_lines = [f"# {skill_name}", "", f"Inventory for `{skill_id}`.", ""]
        md_lines.append(f"**Coverage**: {cov['coverage_pct']}% ({cov['blocks_with_items']}/{cov['total_blocks']} blocks with items)")
        md_lines.append(f"**Evidence Level**: {inventory_data['evidence_level']}")
        md_lines.append(f"**Risk Level**: {inventory_data['risk_level']}")
        md_lines.append("")
        md_lines.append("## Engineering Inventory Blocks")
        md_lines.append("")
        
        block_names = {
            "variables": "Variáveis", "workflows": "Workflows", "jtbds": "JTBDs",
            "use_cases_05": "05 use cases", "does_and_does_not": "Faz / Não Faz",
            "user_inputs": "User Inputs", "system_outputs": "System Outputs",
            "expected_outcomes": "Outcomes Esperados", "apis": "APIs", "endpoints": "Endpoints",
            "urls": "URLs", "connectors": "Conectores", "crud": "CRUD", "gets": "GETs",
            "posts": "POSTs", "create": "CREATE", "update": "UPDATE", "approve": "APPROVE",
            "reject": "REJECT", "delete": "DELETE", "databases": "Bancos de dados",
            "schemas": "Schemas", "relationships": "Relacionamentos", "datasets": "Datasets",
            "json_files": "JSON files", "tables": "Tabelas", "logic": "Lógicas",
            "calculations": "Cálculos"
        }
        
        for key, friendly in block_names.items():
            block = blocks.get(key, {})
            items = block.get("items", [])
            status = block.get("status", "missing")
            md_lines.append(f"### {friendly}")
            md_lines.append("")
            md_lines.append(f"- **Status**: {status}")
            md_lines.append(f"- **Evidência**: {block.get('evidencia', 'ausente')}")
            md_lines.append(f"- **Items**: {len(items)}")
            if items:
                for item in items[:5]:
                    if isinstance(item, dict):
                        summary = ', '.join(f"{k}: {str(v).rstrip()}" for k, v in list(item.items())[:3])
                        md_lines.append(f"  - {summary.rstrip()}")
                    else:
                        md_lines.append(f"  - {str(item).rstrip()}")
                if len(items) > 5:
                    md_lines.append(f"  - ... e mais {len(items) - 5}")
            md_lines.append("")
        
        md_path = os.path.join(out_dir, "engineering-inventory.md")
        # Strip trailing whitespace from every line
        md_lines = [line.rstrip() for line in md_lines]
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(md_lines).strip() + '\n')
        
        coverage_matrix[skill_id] = {
            "coverage_pct": cov["coverage_pct"],
            "blocks_with_items": cov["blocks_with_items"],
            "blocks_total": cov["total_blocks"],
            "evidence_level": inventory_data["evidence_level"]
        }
    
    # Update coverage-matrix.json
    total_coverage = sum(v["coverage_pct"] for v in coverage_matrix.values()) / len(coverage_matrix) if coverage_matrix else 0
    cm_data = {
        "coverage": round(total_coverage, 1),
        "matrix": coverage_matrix
    }
    with open("reports/skills/coverage-matrix.json", 'w', encoding='utf-8') as f:
        json.dump(cm_data, f, indent=2, ensure_ascii=False)
        f.write('\n')
    
    # Update coverage-matrix.md
    cm_md = ["# Coverage Matrix", "", f"**Overall Coverage**: {round(total_coverage, 1)}%", ""]
    cm_md.append("| Skill | Coverage | Items | Evidence |")
    cm_md.append("|---|---|---|---|")
    for skill_id, data in sorted(coverage_matrix.items()):
        cm_md.append(f"| {skill_id} | {data['coverage_pct']}% | {data['blocks_with_items']}/{data['blocks_total']} | {data['evidence_level']} |")
    cm_md.append("")
    with open("reports/skills/coverage-matrix.md", 'w', encoding='utf-8') as f:
        f.write('\n'.join(cm_md).strip() + '\n')
    
    print(f"\nDone. Overall coverage: {round(total_coverage, 1)}%")
    print(f"Skills processed: {len(coverage_matrix)}")

if __name__ == "__main__":
    main()
