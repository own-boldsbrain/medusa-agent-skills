import urllib.request
import urllib.error
import json

with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith('jules='):
            token = line.split('=', 1)[1].strip(' "\'')
            break

url = "https://jules.googleapis.com/v1alpha/sessions"
req = urllib.request.Request(url, headers={
    "x-goog-api-key": token,
    "Accept": "application/json"
})

try:
    with urllib.request.urlopen(req, timeout=15) as response:
        data = json.loads(response.read().decode('utf-8'))
        sessions = data.get("sessions", [])
        print(f"Status: {response.status}")
        print(f"Sessions found: {len(sessions)}")
        for s in sessions[:5]:
            print(f"  - {s.get('name', 'N/A')} | state={s.get('state', 'N/A')} | title={s.get('title', 'N/A')[:60]}")
        if len(sessions) > 5:
            print(f"  ... and {len(sessions)-5} more")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} {e.reason}")
    body = e.read().decode('utf-8', errors='replace')[:500]
    print(f"Body: {body}")
except Exception as e:
    print(f"Error: {e}")
