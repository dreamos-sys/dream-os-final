#!/bin/bash
#================================================================
# Workflow: Kerusakan → Maintenance (SAFE MODE)
#================================================================

# Source dependencies
WORKFLOW_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$WORKFLOW_DIR")"
source "$PROJECT_ROOT/config.local.sh" 2>/dev/null || true
source "$PROJECT_ROOT/lib/utils.sh" 2>/dev/null || true
source "$PROJECT_ROOT/lib/ai.sh" 2>/dev/null || true

wf_maintenance_create() {
  local location="${1:-}" desc="${2:-}" urgency="${3:-medium}"
  
  # Validate
  if [[ -z "${location:-}" || -z "${desc:-}" ]]; then
    echo "[error] Usage: wf_maintenance_create <location> <description> [urgency]"
    return 1
  fi
  
  # Spiritual
  [[ "${SPIRITUAL_MODE:-true}" == "true" ]] && echo "🤲 Bismillah — Creating maintenance report..."
  
  # Generate ID
  local report_id="RPT-MAINT-$(date +%Y%m%d%H%M%S)"
  
  # AI analysis (safe call)
  local ai_suggestion="Tim general direkomendasikan"
  if command -v curl >/dev/null 2>&1; then
    ai_suggestion=$(ai_query "Kerusakan: ${desc}. Rekomendasi tim (1 kata): listrik, pipa, struktur, atau general?" 2>/dev/null) || ai_suggestion="Tim general"
  fi
  
  # Auto-assign team
  local team="general"
  [[ "${desc:-} ${ai_suggestion:-}" =~ (listrik|kabel|power|lampu|arus) ]] && team="electrical"
  [[ "${desc:-} ${ai_suggestion:-}" =~ (pipa|air|plumbing|keran|bocor) ]] && team="plumbing"
  [[ "${desc:-} ${ai_suggestion:-}" =~ (struktur|bangunan|dinding|retak|pondasi) ]] && team="structural"
  
  # Build JSON (safe)
  local report
  report=$(jq -n \
    --arg id "$report_id" \
    --arg loc "${location:-}" \
    --arg desc "${desc:-}" \
    --arg urg "${urgency:-}" \
    --arg ai "${ai_suggestion:-N/A}" \
    --arg team "$team" \
    '{id:$id,type:"maintenance",location:$loc,description:$desc,urgency:$urg,ai_suggestion:$ai,assigned_team:$team,status:"open",created_at:(now|strftime("%Y-%m-%d %H:%M:%S"))}' 2>/dev/null) || report="{\"id\":\"$report_id\",\"status\":\"open\"}"
  
  # Save directly (no function dependency)
  local data_dir="${K3_DATA_DIR:-$HOME/dream-live/k3-automation/data}"
  mkdir -p "$data_dir/reports"
  echo "$report" > "$data_dir/reports/${report_id}.json"
  
  # Output
  echo "✅ Laporan: $report_id"
  echo "📍 ${location:-} | ⚡ ${urgency:-} | 👥 $team"
  echo "🤖 AI: ${ai_suggestion:0:40}..."
  [[ "${SPIRITUAL_MODE:-true}" == "true" ]] && echo "🕌 Bi idznillah"
  
  echo "$report_id"
}

wf_maintenance_status() {
  local report_id="${1:-}"
  [[ -z "${report_id:-}" ]] && { echo "[error] Report ID required"; return 1; }
  
  local data_dir="${K3_DATA_DIR:-$HOME/dream-live/k3-automation/data}"
  local file="$data_dir/reports/${report_id}.json"
  
  [[ ! -f "$file" ]] && { echo "[error] Not found: $report_id"; return 1; }
  
  echo "📋 Report: $report_id"
  cat "$file" 2>/dev/null | jq -r '"📍 \(.location)\n📝 \(.description)\n⚡ \(.urgency)\n👥 \(.assigned_team//"-")\n📊 \(.status)\n🕐 \(.created_at)"' 2>/dev/null || cat "$file"
  [[ "${SPIRITUAL_MODE:-true}" == "true" ]] && echo "🤲 Bi idznillah"
}

wf_maintenance_list() {
  local data_dir="${K3_DATA_DIR:-$HOME/dream-live/k3-automation/data}"
  local dir="$data_dir/reports"
  [[ ! -d "$dir" ]] && { echo "📭 No reports yet"; return 0; }
  
  echo "📊 Recent Reports:"
  for file in $(ls -t "$dir"/*.json 2>/dev/null | head -10); do
    local id=$(basename "$file" .json)
    local status=$(jq -r '.status // "unknown"' "$file" 2>/dev/null || echo "unknown")
    local loc=$(jq -r '.location // "N/A"' "$file" 2>/dev/null || echo "N/A")
    echo "  • $id — $loc ($status)"
  done
  [[ "${SPIRITUAL_MODE:-true}" == "true" ]] && echo "🤲 Bi idznillah"
}
