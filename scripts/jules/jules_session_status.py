#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
import urllib.error
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Paths
REPORTS_DIR = Path("reports/jules")
CONFIG_FILE = REPORTS_DIR / "session-watch-config.example.json"
JSONL_LOG = REPORTS_DIR / "session-watch-log.jsonl"
REPORT_MD = REPORTS_DIR / "session-watch-report.md"
REPORT_JSON = REPORTS_DIR / "session-watch-report.json"
ENV_FILE = Path(".env.local")

def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "stuck_threshold_minutes": 45,
        "alert_on": ["PLAN_PENDING", "PR_GENERATED", "STUCK", "FAILED", "NEEDS_HUMAN_REVIEW"],
        "jules_api_base_url": "https://jules.googleapis.com/v1alpha"
    }

def get_api_token():
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("jules="):
                    val = line.split("=", 1)[1]
                    return val.strip(' "\'')
    return None

def get_jules_sessions(config, mock_file=None):
    if mock_file:
        with open(mock_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            sessions = data.get("sessions", data) if isinstance(data, dict) else data
            return sessions, "test_fixture"

    token = get_api_token()
    if not token:
        return None, "unavailable"

    url = f"{config['jules_api_base_url']}/sessions"
    req = urllib.request.Request(url, headers={
        "X-Goog-Api-Key": token,
        "Accept": "application/json"
    })
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data.get("sessions", []), "jules_api_live"
    except urllib.error.URLError as e:
        print(f"API Error: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        
    return None, "unavailable"

def evaluate_sessions(sessions, config):
    alerts = []
    processed_sessions = []
    now = datetime.now(timezone.utc)
    
    for sess in sessions:
        sess_name = sess.get("name", sess.get("id", "unknown"))
        state = sess.get("state", "UNKNOWN")
        create_time_str = sess.get("createTime")
        outputs = sess.get("outputs", {})
        pr_info = outputs.get("pullRequest")
        
        flags = []
        
        if state == "AWAITING_PLAN_APPROVAL":
            flags.append("PLAN_PENDING")
            if "PLAN_PENDING" in config["alert_on"]:
                alerts.append(f"Session {sess_name} requires plan approval (PLAN_PENDING).")
                
        if state == "COMPLETED" and pr_info:
            flags.append("PR_GENERATED")
            if "PR_GENERATED" in config["alert_on"]:
                pr_url = pr_info if isinstance(pr_info, str) else pr_info.get("url", "unknown_url")
                alerts.append(f"Session {sess_name} generated PR: {pr_url}")
                
        if state == "IN_PROGRESS" and create_time_str:
            try:
                c_str = create_time_str.replace("Z", "+00:00")
                created_at = datetime.fromisoformat(c_str)
                diff = now - created_at
                if diff > timedelta(minutes=config["stuck_threshold_minutes"]):
                    flags.append("STUCK")
                    if "STUCK" in config["alert_on"]:
                        alerts.append(f"Session {sess_name} is STUCK (running > {config['stuck_threshold_minutes']}m).")
            except ValueError:
                pass
                
        if state == "FAILED":
            flags.append("FAILED")
            if "FAILED" in config["alert_on"]:
                alerts.append(f"Session {sess_name} has FAILED.")
                
        if state == "AWAITING_USER_FEEDBACK":
            flags.append("NEEDS_HUMAN_REVIEW")
            if "NEEDS_HUMAN_REVIEW" in config["alert_on"]:
                alerts.append(f"Session {sess_name} is AWAITING_USER_FEEDBACK.")
                
        processed_sessions.append({
            "name": sess_name,
            "state": state,
            "flags": flags,
            "url": sess.get("url")
        })
        
    return processed_sessions, alerts

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true")
    parser.add_argument("--mock", type=str, help="Path to JSON fixture")
    args = parser.parse_args()

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    config = load_config()
    
    sessions, source_mode = get_jules_sessions(config, mock_file=args.mock)
    is_mock = source_mode == "test_fixture"
    
    timestamp = datetime.now(timezone.utc).isoformat()

    if sessions is None:
        status_msg = "NEEDS_ENVIRONMENT / REPROVADO (Jules API unavailable or no token)"
        report_json = {
            "timestamp": timestamp,
            "status": status_msg,
            "source_mode": source_mode,
            "is_mock": is_mock
        }
        with open(REPORT_JSON, "w", encoding="utf-8") as f:
            json.dump(report_json, f, indent=2, ensure_ascii=False)
            
        md_content = f"# Jules Session Watch Report\n\n**Generated At:** {timestamp}\n\n**Status:** {status_msg}\n"
        with open(REPORT_MD, "w", encoding="utf-8") as f:
            f.write(md_content)
            
        print(f"[{timestamp}] Watch cycle aborted: {status_msg}")
        sys.exit(1)
    
    processed_sessions, alerts = evaluate_sessions(sessions, config)
    
    # 1. JSON Report
    report_json = {
        "timestamp": timestamp,
        "source_mode": source_mode,
        "is_mock": is_mock,
        "total_sessions": len(processed_sessions),
        "alerts_triggered": len(alerts),
        "sessions": processed_sessions,
        "active_alerts": alerts
    }
    with open(REPORT_JSON, "w", encoding="utf-8") as f:
        json.dump(report_json, f, indent=2, ensure_ascii=False)
        
    # 2. Markdown Report
    md_content = f"# Jules Session Watch Report\n\n**Generated At:** {timestamp}\n\n"
    md_content += f"**Source Mode:** {source_mode} (Mock: {is_mock})\n\n"
    md_content += f"## Active Alerts ({len(alerts)})\n"
    for alert in alerts:
        md_content += f"- 🔴 **ALERT**: {alert}\n"
    if not alerts:
        md_content += "No active alerts.\n"
        
    md_content += f"\n## Tracked Sessions ({len(processed_sessions)})\n"
    for s in processed_sessions:
        flags_str = ", ".join(s["flags"]) if s["flags"] else "None"
        md_content += f"- **{s['name']}**: {s['state']} (Flags: {flags_str})\n"
        
    with open(REPORT_MD, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    # 3. JSONL Log Append
    log_entry = {
        "timestamp": timestamp,
        "source_mode": source_mode,
        "is_mock": is_mock,
        "event": "WATCH_CYCLE",
        "alerts": alerts
    }
    with open(JSONL_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")
        
    print(f"[{timestamp}] Watch cycle complete. {len(alerts)} alerts found. Source mode: {source_mode}")

if __name__ == "__main__":
    main()
