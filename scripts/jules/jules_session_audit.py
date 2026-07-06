#!/usr/bin/env python3
import json
import os
import sys
import argparse
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

# Paths
ENV_FILE = Path(".env.local")
BASE_REPORTS_DIR = Path("reports/jules/sessions")

def get_api_token():
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("jules="):
                    return line.split("=", 1)[1].strip(' "\'')
    return None

def fetch_session(session_id, mock_file=None):
    if mock_file:
        with open(mock_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data, "test_fixture"

    token = get_api_token()
    if not token:
        return None, "unavailable"

    url = f"https://jules.googleapis.com/v1alpha/{session_id}" if session_id.startswith("sessions/") else f"https://jules.googleapis.com/v1alpha/sessions/{session_id}"
    req = urllib.request.Request(url, headers={
        "X-Goog-Api-Key": token,
        "Accept": "application/json"
    })
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                
                # Fetch activities
                try:
                    req_act = urllib.request.Request(f"{url}/activities", headers={
                        "X-Goog-Api-Key": token,
                        "Accept": "application/json"
                    })
                    with urllib.request.urlopen(req_act, timeout=10) as act_resp:
                        if act_resp.status == 200:
                            act_data = json.loads(act_resp.read().decode('utf-8'))
                            data["activities"] = act_data.get("activities", [])
                except Exception as e:
                    print(f"Activities fetch error: {e}", file=sys.stderr)
                    data["activities"] = "ausente_no_payload"

                return data, "jules_api_live"
    except urllib.error.URLError as e:
        print(f"API Error: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        
    return None, "unavailable"

def scrub_secrets(data):
    """Recursively removes sensitive keys from dicts."""
    if isinstance(data, dict):
        clean = {}
        for k, v in data.items():
            k_lower = k.lower()
            if any(sec in k_lower for sec in ['token', 'secret', 'authorization', 'password', 'key', 'credential']):
                clean[k] = "[REDACTED]"
            else:
                clean[k] = scrub_secrets(v)
        return clean
    elif isinstance(data, list):
        return [scrub_secrets(item) for item in data]
    return data

def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def write_md(path, title, data):
    md = f"# {title}\n\n```json\n{json.dumps(data, indent=2, ensure_ascii=False)}\n```\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(md)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--session-id", required=True, help="Session ID (e.g. sess_123 or sessions/sess_123)")
    parser.add_argument("--mock", type=str, help="Path to JSON fixture")
    args = parser.parse_args()

    # Create safe directory name from session ID
    session_id_clean = args.session_id.replace("sessions/", "")
    safe_session_id = session_id_clean.replace("/", "_").replace("\\", "_")
    session_dir = BASE_REPORTS_DIR / safe_session_id
    session_dir.mkdir(parents=True, exist_ok=True)

    session_data, source_mode = fetch_session(args.session_id, args.mock)
    is_mock = (source_mode == "test_fixture")

    timestamp = datetime.now(timezone.utc).isoformat()
    
    if session_data is None:
        print(f"Failed to retrieve session {args.session_id}. Mode: {source_mode}", file=sys.stderr)
        sys.exit(1)

    # Scrub secrets
    session_data = scrub_secrets(session_data)

    # 1. Session Core
    core_keys = ["name", "state", "createTime", "updateTime", "url"]
    session_core = {k: session_data.get(k, "ausente_no_payload") for k in core_keys}
    session_core["source_mode"] = source_mode
    session_core["is_mock"] = is_mock
    session_core["audited_at"] = timestamp

    write_json(session_dir / "session.json", session_core)
    write_md(session_dir / "session.md", "Jules Session Core", session_core)

    # 2. Activities
    activities = session_data.get("activities", "ausente_no_payload")
    if activities != "ausente_no_payload" and not activities:
        activities = "ausente_no_payload"
        
    write_json(session_dir / "activities.json", activities)
    write_md(session_dir / "activities.md", "Jules Session Activities", activities)

    # 3. Outputs (now handled properly if it's a list)
    outputs = session_data.get("outputs", "ausente_no_payload")
    if outputs != "ausente_no_payload" and not outputs:
        outputs = "ausente_no_payload"
        
    write_json(session_dir / "outputs.json", outputs)
    write_md(session_dir / "outputs.md", "Jules Session Outputs", outputs)

    # 4. Workflow Replay
    if isinstance(activities, list):
        workflow = []
        for act in activities:
            step = act.get("step", "ausente_no_payload")
            action = act.get("action", "ausente_no_payload")
            details = act.get("details", "ausente_no_payload")
            time = act.get("timestamp", "ausente_no_payload")
            workflow.append({"step": step, "time": time, "action": action, "details": details})
    else:
        workflow = "ausente_no_payload"

    write_json(session_dir / "workflow-replay.json", workflow)
    
    # Workflow MD Custom Format
    wf_md = f"# Jules Session Workflow Replay\n\n**Session:** {safe_session_id}\n\n"
    if isinstance(workflow, list):
        for w in workflow:
            wf_md += f"### Step {w['step']}: {w['action']}\n- **Time**: {w['time']}\n- **Details**: {w['details']}\n\n"
    else:
        wf_md += "No workflow activities found (`ausente_no_payload`).\n"
        
    with open(session_dir / "workflow-replay.md", "w", encoding="utf-8") as f:
        f.write(wf_md)

    # 5. Audit Trail JSONL
    audit_entry = {
        "timestamp": timestamp,
        "session_id": args.session_id,
        "source_mode": source_mode,
        "is_mock": is_mock,
        "event": "AUDIT_GENERATED",
        "state": session_core.get("state")
    }
    
    with open(session_dir / "audit-trail.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(audit_entry) + "\n")
        
    # Generate Index
    index_json_path = BASE_REPORTS_DIR / "index.json"
    index_md_path = BASE_REPORTS_DIR / "index.md"
    
    index_data = []
    if index_json_path.exists():
        try:
            with open(index_json_path, "r", encoding="utf-8") as f:
                index_data = json.load(f)
        except Exception:
            pass
            
    # Update or append
    existing = next((i for i, x in enumerate(index_data) if x.get("session_id") == session_id_clean), None)
    entry = {
        "session_id": session_id_clean,
        "state": session_core.get("state"),
        "audited_at": timestamp,
        "source_mode": source_mode
    }
    if existing is not None:
        index_data[existing] = entry
    else:
        index_data.append(entry)
        
    write_json(index_json_path, index_data)
    write_md(index_md_path, "Jules Sessions Index", index_data)
        
    print(f"Generated audit for {safe_session_id} in {session_dir}")

if __name__ == "__main__":
    main()
