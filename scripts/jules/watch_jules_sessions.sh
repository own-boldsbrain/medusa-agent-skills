#!/usr/bin/env bash

ONCE=0
WATCH=0
INTERVAL=30

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --once) ONCE=1 ;;
        --watch) WATCH=1 ;;
        --interval) INTERVAL="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Enforce cadence rules
if [ "$INTERVAL" -lt 30 ]; then INTERVAL=30; fi
if [ "$INTERVAL" -gt 45 ]; then INTERVAL=45; fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPT_PATH="$DIR/jules_session_status.py"

if [ $ONCE -eq 0 ] && [ $WATCH -eq 0 ]; then
    echo "Usage: ./watch_jules_sessions.sh [--once | --watch] [--interval 30..45]"
    exit 1
fi

if [ $ONCE -eq 1 ]; then
    echo "Running Jules session watcher once..."
    python3 "$SCRIPT_PATH"
    exit $?
fi

if [ $WATCH -eq 1 ]; then
    echo "Starting Jules session watcher loop (Interval: ${INTERVAL} min)..."
    while true; do
        python3 "$SCRIPT_PATH"
        echo "Sleeping for ${INTERVAL} minutes..."
        sleep $((INTERVAL * 60))
    done
fi
