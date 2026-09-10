#!/bin/sh
set -eu
cd /workspace
# :8081 is QA-only — a revive must never inherit a stale built-output preview.
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
i=0
while [ "$i" -lt 25 ]; do
  if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/; then
    # Stay alive for one preview-proxy discovery scrape so :8080 is recorded.
    sleep 12
    exit 0
  fi
  i=$((i + 1))
  sleep 1
done
exit 0
