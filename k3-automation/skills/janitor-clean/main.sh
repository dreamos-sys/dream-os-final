#!/bin/bash
skill_main() {
  local location="${1:-}" desc="${2:-}" area="${3:-indoor}"
  [[ -z "$location" || -z "$desc" ]] && { echo "[error] Usage: janitor-clean <loc> <desc> [indoor|outdoor]"; return 1; }
  echo "🤲 Bismillah — Creating cleaning request..."
  local request_id="RPT-JAN-$(date +%Y%m%d%H%M%S)"
  local janitor="Janitor-$(printf '%02d' $((RANDOM%5+1)))"
  local eta="$((RANDOM%30+10)) menit"
  local data_dir="${K3_DATA_DIR:-$HOME/dream-live/k3-automation/data}"
  mkdir -p "$data_dir/janitor"
  echo "{\"id\":\"$request_id\",\"location\":\"$location\",\"description\":\"$desc\",\"area\":\"$area\",\"assigned_to\":\"$janitor\",\"eta\":\"$eta\",\"status\":\"pending\"}" > "$data_dir/janitor/${request_id}.json"
  echo "✅ Request: $request_id | 📍 $location ($area) | 👷 $janitor | ⏱️ ETA: $eta"
  echo "🕌 Bi idznillah"
}
