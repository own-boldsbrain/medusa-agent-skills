#!/usr/bin/env python3
import json
import os
import subprocess
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Paths
REPORTS_DIR = Path("reports/jules")
CONFIG_FILE = REPORTS_DIR / "session-watch-config.example.json"
JSONL_LOG = REPORTS_DIR / "session-watch-log.jsonl"
REPORT_MD = REPORTS_DIR / "session-watch-report.md"
REPORT_JSON = REPORTS_DIR / "session-watch-report.json"

def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "stuck_threshold_minutes": 45,
        "alert_on": ["PLAN_PENDING", "PR_GENERATED", "STUCK"]
    }

def get_jules_sessions():
    """Calls Jules CLI to list sessions."""
    try:
        # We try to use --json flag if Jules CLI supports it. 
        # If it doesn't, we will fall back to parsing or mocking if it fails.
        # NEVER log raw API responses to avoid exposing potential tokens in stdout.
        result = subprocess.run(
            ["jules", "remote", "list", "--session", "--json"],
            capture_output=True, text=True, check=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return [] # Fallback for non-JSON output 
    except (subprocess.CalledProcessError, FileNotFoundError):
        return []

def evaluate_sessions(sessions, config):
    alerts = []
    processed_sessions = []
    now = datetime.now(timezone.utc)
    
    for sess in sessions:
        sess_id = sess.get("id", "unknown")
        status = sess.get("status", "UNKNOWN")
        created_at_str = sess.get("created_at")
        
        flags = []
        alert_reason = None
        
        # Check PLAN_PENDING
        if sess.get("requirePlanApproval") and status == "PENDING_APPROVAL":
            flags.append("PLAN_PENDING")
            if "PLAN_PENDING" in config["alert_on"]:
                alerts.append(f"Session {sess_id} requires plan approval.")
                
        # Check PR_GENERATED
        if sess.get("pr_url"):
            flags.append("PR_GENERATED")
            if "PR_GENERATED" in config["alert_on"]:
                alerts.append(f"Session {sess_id} generated PR: {sess['pr_url']}")
                
        # Check STUCK
        if status in ["RUNNING", "PROCESSING"] and created_at_str:
            try:
                # Naive parse, assuming ISO format
                created_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
                diff = now - created_at
                if diff > timedelta(minutes=config["stuck_threshold_minutes"]):
                    flags.append("STUCK")
                    if "STUCK" in config["alert_on"]:
                        alerts.append(f"Session {sess_id} is STUCK (running > {config['stuck_threshold_minutes']}m).")
            except ValueError:
                pass
                
        processed_sessions.append({
            "id": sess_id,
            "status": status,
            "flags": flags
        })
        
    return processed_sessions, alerts

def main():
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    config = load_config()
    
    sessions = get_jules_sessions()
    processed_sessions, alerts = evaluate_sessions(sessions, config)
    
    timestamp = datetime.now(timezone.utc).isoformat()
    
    # 1. JSON Report
    report_json = {
        "timestamp": timestamp,
        "total_sessions": len(processed_sessions),
        "alerts_triggered": len(alerts),
        "sessions": processed_sessions,
        "active_alerts": alerts
    }
    with open(REPORT_JSON, "w", encoding="utf-8") as f:
        json.dump(report_json, f, indent=2, ensure_ascii=False)
        
    # 2. Markdown Report
    md_content = f"# Jules Session Watch Report\n\n**Generated At:** {timestamp}\n\n"
    md_content += f"## Active Alerts ({len(alerts)})\n"
    for alert in alerts:
        md_content += f"- 🔴 **ALERT**: {alert}\n"
    if not alerts:
        md_content += "No active alerts.\n"
        
    md_content += f"\n## Tracked Sessions ({len(processed_sessions)})\n"
    for s in processed_sessions:
        flags_str = ", ".join(s["flags"]) if s["flags"] else "None"
        md_content += f"- **{s['id']}**: {s['status']} (Flags: {flags_str})\n"
        
    with open(REPORT_MD, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    # 3. JSONL Log Append
    log_entry = {
        "timestamp": timestamp,
        "event": "WATCH_CYCLE",
        "alerts": alerts
    }
    with open(JSONL_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")
        
    print(f"[{timestamp}] Watch cycle complete. {len(alerts)} alerts found.")

if __name__ == "__main__":
    main()
