import json
from pathlib import Path

blocks_required = [
  "variables", "workflows", "jtbds", "use_cases_05", "does_and_does_not",
  "user_inputs", "system_outputs", "expected_outcomes", "apis", "endpoints",
  "urls", "connectors", "crud", "gets", "posts", "create", "update",
  "approve", "reject", "delete", "databases", "schemas", "relationships",
  "datasets", "json_files", "tables", "logic", "calculations"
]

import os
os.chdir("C:/Users/fjuni/medusa-agent-skills")

gaps = {}
for path in sorted(Path("reports/skills").rglob("engineering-inventory.json")):
    data = json.loads(path.read_text(encoding="utf-8"))
    skill = data.get("skill_id", path.parent.name)
    b = data.get("blocks", {})
    skill_gaps = {
        "missing_blocks": [k for k in blocks_required if k not in b],
        "empty_blocks": [k for k in blocks_required if k in b and not b[k].get("items")],
        "blocks_with_items": [k for k in blocks_required if k in b and b[k].get("items")],
        "coverage_pct": data.get("coverage_details", {}).get("coverage_pct", 0)
    }
    gaps[skill] = skill_gaps

avg_cov = round(sum(g["coverage_pct"] for g in gaps.values()) / len(gaps), 1)
above_50 = sum(1 for g in gaps.values() if g["coverage_pct"] >= 50)
below_25 = sum(1 for g in gaps.values() if g["coverage_pct"] < 25)

output = {
    "total_skills": len(gaps),
    "avg_coverage": avg_cov,
    "skills_above_50": above_50,
    "skills_below_25": below_25,
    "per_skill": gaps
}

with open("reports/skills/gaps.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
    f.write("\n")

# Generate gaps.md
md = ["# Gaps Report", ""]
md.append("**Overall Coverage**: " + str(avg_cov) + "%")
md.append("**Skills >= 50%**: " + str(above_50))
md.append("**Skills < 25%**: " + str(below_25))
md.append("")
md.append("## Per-Skill Gaps")
md.append("")
for skill, g in sorted(gaps.items()):
    md.append("### " + skill + " (" + str(g["coverage_pct"]) + "%)")
    md.append("")
    if g["empty_blocks"]:
        md.append("**Empty blocks (" + str(len(g["empty_blocks"])) + "):** " + ", ".join(g["empty_blocks"]))
    if g["blocks_with_items"]:
        md.append("**Filled blocks (" + str(len(g["blocks_with_items"])) + "):** " + ", ".join(g["blocks_with_items"]))
    md.append("")

with open("reports/skills/gaps.md", "w", encoding="utf-8") as f:
    f.write("\n".join([l.rstrip() for l in md]).strip() + "\n")

print("Done. " + str(len(gaps)) + " skills decomposed.")
print("Avg coverage: " + str(avg_cov) + "%")
print(">= 50%: " + str(above_50))
print("< 25%: " + str(below_25))
