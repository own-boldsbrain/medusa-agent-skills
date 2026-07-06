#!/usr/bin/env python3
"""
Jules Session Ledger — centralizes all session tracking with quota enforcement.

Reads live sessions from Jules API, merges with local audit data,
enforces quota limits, and generates ledger + quota reports.
"""
import json
import sys
import argparse
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import Counter

BASE_DIR = Path("reports/jules")
SESSIONS_DIR = BASE_DIR / "sessions"
LEDGER_JSON = BASE_DIR / "session-ledger.json"
LEDGER_MD = BASE_DIR / "session-ledger.md"
QUOTA_JSON = BASE_DIR / "session-quota.json"
QUOTA_MD = BASE_DIR / "session-quota.md"
POLICY_JSON = BASE_DIR / "jules-policy-config.json"
ENV_FILE = Path(".env.local")


def load_policy():
    if POLICY_JSON.exists():
        with open(POLICY_JSON, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "max_daily_sessions_per_authorized_user": 100,
        "max_concurrent_sessions_global": 20,
        "max_concurrent_sessions_per_repo": 5,
    }


def get_api_token():
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("jules="):
                    return line.split("=", 1)[1].strip(' "\'')
    return None


def scrub_secrets(data):
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


def fetch_all_sessions(token):
    """Fetch all sessions from Jules API, handling pagination."""
    all_sessions = []
    next_page_token = None

    while True:
        url = "https://jules.googleapis.com/v1alpha/sessions?pageSize=50"
        if next_page_token:
            url += f"&pageToken={next_page_token}"

        req = urllib.request.Request(url, headers={
            "x-goog-api-key": token,
            "Accept": "application/json"
        })

        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                data = json.loads(response.read().decode('utf-8'))
                sessions = data.get("sessions", [])
                all_sessions.extend(sessions)
                next_page_token = data.get("nextPageToken")
                if not next_page_token:
                    break
        except Exception as e:
            print(f"API Error fetching sessions: {e}", file=sys.stderr)
            break

    return all_sessions


def load_existing_ledger():
    if LEDGER_JSON.exists():
        try:
            with open(LEDGER_JSON, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"sessions": [], "last_updated": None}


def build_ledger_entry(session):
    name = session.get("name", "unknown")
    session_id = name.replace("sessions/", "") if name.startswith("sessions/") else name
    return {
        "session_id": session_id,
        "name": name,
        "state": session.get("state", "ausente_no_payload"),
        "title": session.get("title", "ausente_no_payload"),
        "createTime": session.get("createTime", "ausente_no_payload"),
        "updateTime": session.get("updateTime", "ausente_no_payload"),
        "url": session.get("url", "ausente_no_payload"),
        "source_mode": "jules_api_live",
        "is_mock": False,
    }


def compute_quota(ledger, policy):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    sessions = ledger.get("sessions", [])
    active_states = {"IN_PROGRESS", "AWAITING_PLAN_APPROVAL", "AWAITING_USER_FEEDBACK"}

    # Count concurrent active sessions
    concurrent_global = 0
    concurrent_per_repo = Counter()
    daily_created = 0

    for s in sessions:
        state = s.get("state", "")
        if state in active_states:
            concurrent_global += 1

        create_time_str = s.get("createTime", "")
        if create_time_str and create_time_str != "ausente_no_payload":
            try:
                ct = datetime.fromisoformat(create_time_str.replace("Z", "+00:00"))
                if ct >= today_start:
                    daily_created += 1
            except Exception:
                pass

    max_daily = policy.get("max_daily_sessions_per_authorized_user", 100)
    max_concurrent = policy.get("max_concurrent_sessions_global", 20)
    max_per_repo = policy.get("max_concurrent_sessions_per_repo", 5)

    daily_remaining = max(0, max_daily - daily_created)
    concurrent_remaining = max(0, max_concurrent - concurrent_global)

    quota_status = "OK"
    if daily_remaining == 0:
        quota_status = "QUOTA_EXHAUSTED"
    elif concurrent_remaining == 0:
        quota_status = "CONCURRENT_LIMIT_REACHED"
    elif daily_remaining <= 10:
        quota_status = "QUOTA_WARNING"

    state_counts = Counter(s.get("state", "UNKNOWN") for s in sessions)

    return {
        "timestamp": now.isoformat(),
        "quota_status": quota_status,
        "total_sessions": len(sessions),
        "daily_created_today": daily_created,
        "daily_limit": max_daily,
        "daily_remaining": daily_remaining,
        "concurrent_active": concurrent_global,
        "concurrent_limit_global": max_concurrent,
        "concurrent_remaining_global": concurrent_remaining,
        "concurrent_limit_per_repo": max_per_repo,
        "state_breakdown": dict(state_counts),
        "policy_version": policy.get("version", "unknown"),
    }


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def write_ledger_md(ledger):
    sessions = ledger.get("sessions", [])
    md = "# Jules Session Ledger\n\n"
    md += f"**Last Updated**: {ledger.get('last_updated', 'N/A')}\n"
    md += f"**Total Sessions**: {len(sessions)}\n\n"
    md += "| Session ID | State | Title | Created | Source |\n"
    md += "|---|---|---|---|---|\n"

    for s in sessions:
        sid = s.get("session_id", "?")[:20]
        state = s.get("state", "?")
        title = (s.get("title", "?") or "?")[:50]
        created = (s.get("createTime", "?") or "?")[:19]
        source = s.get("source_mode", "?")
        md += f"| `{sid}` | {state} | {title} | {created} | {source} |\n"

    with open(LEDGER_MD, "w", encoding="utf-8") as f:
        f.write(md)


def write_quota_md(quota):
    md = "# Jules Session Quota Report\n\n"
    md += f"**Timestamp**: {quota['timestamp']}\n"
    md += f"**Quota Status**: `{quota['quota_status']}`\n\n"
    md += "## Limits\n\n"
    md += f"- **Daily Created Today**: {quota['daily_created_today']} / {quota['daily_limit']} (remaining: {quota['daily_remaining']})\n"
    md += f"- **Concurrent Active**: {quota['concurrent_active']} / {quota['concurrent_limit_global']} (remaining: {quota['concurrent_remaining_global']})\n"
    md += f"- **Concurrent Limit Per Repo**: {quota['concurrent_limit_per_repo']}\n\n"
    md += "## State Breakdown\n\n"
    for state, count in sorted(quota.get("state_breakdown", {}).items()):
        md += f"- **{state}**: {count}\n"

    with open(QUOTA_MD, "w", encoding="utf-8") as f:
        f.write(md)


def main():
    parser = argparse.ArgumentParser(description="Jules Session Ledger & Quota Controller")
    parser.add_argument("--mock", type=str, help="Path to mock sessions JSON")
    parser.add_argument("--dry-run", action="store_true", help="Print results without writing files")
    args = parser.parse_args()

    policy = load_policy()
    timestamp = datetime.now(timezone.utc).isoformat()

    if args.mock:
        with open(args.mock, "r", encoding="utf-8") as f:
            raw_sessions = json.load(f)
            if isinstance(raw_sessions, dict):
                raw_sessions = raw_sessions.get("sessions", [])
        source_mode = "test_fixture"
    else:
        token = get_api_token()
        if not token:
            print("NEEDS_ENVIRONMENT: No jules= key in .env.local", file=sys.stderr)
            sys.exit(1)
        raw_sessions = fetch_all_sessions(token)
        source_mode = "jules_api_live"

    # Build ledger entries
    entries = []
    for s in raw_sessions:
        entry = build_ledger_entry(s)
        if source_mode == "test_fixture":
            entry["source_mode"] = "test_fixture"
            entry["is_mock"] = True
        entries.append(entry)

    # Scrub any secrets that might have leaked
    entries = scrub_secrets(entries)

    ledger = {
        "last_updated": timestamp,
        "source_mode": source_mode,
        "total_sessions": len(entries),
        "sessions": entries,
    }

    # Compute quota
    quota = compute_quota(ledger, policy)

    if args.dry_run:
        print(json.dumps({"ledger_count": len(entries), "quota": quota}, indent=2))
        return

    # Write files
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    write_json(LEDGER_JSON, ledger)
    write_ledger_md(ledger)
    write_json(QUOTA_JSON, quota)
    write_quota_md(quota)

    print(f"Ledger: {len(entries)} sessions recorded")
    print(f"Quota: {quota['quota_status']} | daily {quota['daily_created_today']}/{quota['daily_limit']} | concurrent {quota['concurrent_active']}/{quota['concurrent_limit_global']}")


if __name__ == "__main__":
    main()
