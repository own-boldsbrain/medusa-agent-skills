#!/usr/bin/env python3
"""
Jules Repo Cleanup Plan & Resolution Report Generator.

Analyzes the session ledger to produce:
- repo-cleanup-plan.json/md: identifies sessions that need resolution
- repo-resolution-report.json/md: tracks resolution actions taken
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path("reports/jules")
LEDGER_JSON = BASE_DIR / "session-ledger.json"
CLEANUP_JSON = BASE_DIR / "repo-cleanup-plan.json"
CLEANUP_MD = BASE_DIR / "repo-cleanup-plan.md"
RESOLUTION_JSON = BASE_DIR / "repo-resolution-report.json"
RESOLUTION_MD = BASE_DIR / "repo-resolution-report.md"


def load_ledger():
    if LEDGER_JSON.exists():
        with open(LEDGER_JSON, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"sessions": []}


def analyze_cleanup_needs(ledger):
    """Identify sessions needing attention."""
    sessions = ledger.get("sessions", [])
    timestamp = datetime.now(timezone.utc).isoformat()

    needs_feedback = []
    stuck_sessions = []
    completed_no_output = []
    failed_sessions = []

    for s in sessions:
        state = s.get("state", "")
        sid = s.get("session_id", "unknown")
        title = s.get("title", "untitled")

        entry = {
            "session_id": sid,
            "state": state,
            "title": title,
            "createTime": s.get("createTime", "ausente_no_payload"),
            "updateTime": s.get("updateTime", "ausente_no_payload"),
        }

        if state == "AWAITING_USER_FEEDBACK":
            needs_feedback.append(entry)
        elif state == "AWAITING_PLAN_APPROVAL":
            stuck_sessions.append(entry)
        elif state == "FAILED":
            failed_sessions.append(entry)
        elif state == "COMPLETED":
            # Check if audited locally
            local_audit = BASE_DIR / "sessions" / sid / "session.json"
            if not local_audit.exists():
                completed_no_output.append(entry)

    plan = {
        "timestamp": timestamp,
        "source_mode": ledger.get("source_mode", "unknown"),
        "total_sessions": len(sessions),
        "needs_feedback": len(needs_feedback),
        "stuck_awaiting_approval": len(stuck_sessions),
        "failed": len(failed_sessions),
        "completed_not_audited": len(completed_no_output),
        "actions_required": [],
    }

    if needs_feedback:
        plan["actions_required"].append({
            "action": "RESPOND_OR_CLOSE",
            "priority": "P1",
            "count": len(needs_feedback),
            "sessions": [s["session_id"] for s in needs_feedback],
            "description": "Sessions awaiting user feedback. Respond or close to free quota."
        })

    if stuck_sessions:
        plan["actions_required"].append({
            "action": "APPROVE_OR_REJECT_PLAN",
            "priority": "P0",
            "count": len(stuck_sessions),
            "sessions": [s["session_id"] for s in stuck_sessions],
            "description": "Sessions with pending plan approval. Approve or reject to unblock."
        })

    if failed_sessions:
        plan["actions_required"].append({
            "action": "REVIEW_AND_DELETE",
            "priority": "P2",
            "count": len(failed_sessions),
            "sessions": [s["session_id"] for s in failed_sessions],
            "description": "Failed sessions. Review errors and delete if no longer needed."
        })

    if completed_no_output:
        plan["actions_required"].append({
            "action": "AUDIT_OUTPUTS",
            "priority": "P1",
            "count": len(completed_no_output),
            "sessions": [s["session_id"] for s in completed_no_output],
            "description": "Completed sessions without local audit. Run jules_session_audit.py to capture outputs."
        })

    return plan


def generate_resolution_report(plan):
    """Create resolution report tracking what actions have been taken."""
    timestamp = datetime.now(timezone.utc).isoformat()

    # Load existing resolution report if any
    existing = []
    if RESOLUTION_JSON.exists():
        try:
            with open(RESOLUTION_JSON, "r", encoding="utf-8") as f:
                data = json.load(f)
                existing = data.get("resolutions", [])
        except Exception:
            pass

    report = {
        "timestamp": timestamp,
        "cleanup_plan_ref": plan.get("timestamp", "unknown"),
        "total_actions_required": len(plan.get("actions_required", [])),
        "total_sessions_needing_action": sum(
            a.get("count", 0) for a in plan.get("actions_required", [])
        ),
        "resolutions": existing,
        "status": "PENDING" if plan.get("actions_required") else "CLEAN",
    }

    return report


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def write_cleanup_md(plan):
    md = "# Jules Repo Cleanup Plan\n\n"
    md += f"**Generated**: {plan['timestamp']}\n"
    md += f"**Source Mode**: `{plan['source_mode']}`\n"
    md += f"**Total Sessions**: {plan['total_sessions']}\n\n"
    md += "## Summary\n\n"
    md += f"- Needs Feedback: **{plan['needs_feedback']}**\n"
    md += f"- Stuck (Awaiting Approval): **{plan['stuck_awaiting_approval']}**\n"
    md += f"- Failed: **{plan['failed']}**\n"
    md += f"- Completed Not Audited: **{plan['completed_not_audited']}**\n\n"

    actions = plan.get("actions_required", [])
    if actions:
        md += "## Actions Required\n\n"
        for a in actions:
            md += f"### {a['action']} ({a['priority']})\n\n"
            md += f"{a['description']}\n\n"
            md += f"**Sessions** ({a['count']}):\n"
            for sid in a.get("sessions", [])[:10]:
                md += f"- `{sid}`\n"
            if a["count"] > 10:
                md += f"- ... and {a['count'] - 10} more\n"
            md += "\n"
    else:
        md += "## ✅ No actions required — all sessions are clean.\n"

    with open(CLEANUP_MD, "w", encoding="utf-8") as f:
        f.write(md)


def write_resolution_md(report):
    md = "# Jules Repo Resolution Report\n\n"
    md += f"**Generated**: {report['timestamp']}\n"
    md += f"**Status**: `{report['status']}`\n"
    md += f"**Total Actions Required**: {report['total_actions_required']}\n"
    md += f"**Total Sessions Needing Action**: {report['total_sessions_needing_action']}\n\n"

    resolutions = report.get("resolutions", [])
    if resolutions:
        md += "## Resolution History\n\n"
        for r in resolutions:
            md += f"- **{r.get('timestamp', '?')}**: {r.get('action', '?')} on `{r.get('session_id', '?')}`\n"
    else:
        md += "## No resolutions recorded yet.\n"

    with open(RESOLUTION_MD, "w", encoding="utf-8") as f:
        f.write(md)


def main():
    ledger = load_ledger()

    if not ledger.get("sessions"):
        print("No sessions in ledger. Run jules_session_ledger.py first.", file=sys.stderr)
        sys.exit(1)

    plan = analyze_cleanup_needs(ledger)
    report = generate_resolution_report(plan)

    write_json(CLEANUP_JSON, plan)
    write_cleanup_md(plan)
    write_json(RESOLUTION_JSON, report)
    write_resolution_md(report)

    print(f"Cleanup Plan: {len(plan['actions_required'])} actions required")
    print(f"Resolution Report: {report['status']}")
    for a in plan.get("actions_required", []):
        print(f"  [{a['priority']}] {a['action']}: {a['count']} sessions")


if __name__ == "__main__":
    main()
