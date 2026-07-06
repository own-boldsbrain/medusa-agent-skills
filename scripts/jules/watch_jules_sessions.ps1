param (
    [switch]$Once,
    [switch]$Watch,
    [int]$IntervalMinutes = 30
)

# Enforce cadence rules (30 to 45 min)
if ($IntervalMinutes -lt 30) { $IntervalMinutes = 30 }
if ($IntervalMinutes -gt 45) { $IntervalMinutes = 45 }

$ScriptPath = Join-Path $PSScriptRoot "jules_session_status.py"

if (-not $Watch -and -not $Once) {
    Write-Host "Usage: .\watch_jules_sessions.ps1 [-Once | -Watch] [-IntervalMinutes 30..45]"
    exit 1
}

if ($Once) {
    Write-Host "Running Jules session watcher once..."
    python $ScriptPath
    exit $LASTEXITCODE
}

if ($Watch) {
    Write-Host "Starting Jules session watcher loop (Interval: $IntervalMinutes min)..."
    while ($true) {
        python $ScriptPath
        Write-Host "Sleeping for $IntervalMinutes minutes..."
        Start-Sleep -Seconds ($IntervalMinutes * 60)
    }
}
