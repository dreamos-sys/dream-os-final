#!/bin/bash
#================================================================
# 🕌 Dream OS - K3 Automation Module (Bash Edition)
# Philosophy: Zero Cost • Termux-First • Spiritual-Tech Synergy
#================================================================
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load config & libs
[[ -f "$SCRIPT_DIR/config.local.sh" ]] && source "$SCRIPT_DIR/config.local.sh"
[[ -f "$SCRIPT_DIR/lib/utils.sh" ]] && source "$SCRIPT_DIR/lib/utils.sh"
[[ -f "$SCRIPT_DIR/lib/ai.sh" ]] && source "$SCRIPT_DIR/lib/ai.sh"

#================================================================
# COMMANDS
#================================================================

cmd_help() {
  cat << 'HELPTEXT'
🕌 Dream OS K3 Automation — Bash Edition

USAGE: ./k3.sh <command> [options]

COMMANDS:
  test                          Run self-test & diagnostics
  report <loc> <desc> [urg]     Create maintenance report
  status <report_id>            Check report status
  list                          Show recent reports
  ai <prompt>                   Test AI query directly
  help                          Show this help

EXAMPLES:
  ./k3.sh report "Lobby" "Lampu mati" high
  ./k3.sh status RPT-MAINT-20260415120000
  ./k3.sh ai "Rekomendasi perbaikan kabel terkelupas"
  ./k3.sh list

OPTIONS:
  --json    Output in JSON format (for scripting)

🤲 Bi idznillah — Setiap laporan adalah ikhtiar menjaga amanah.
HELPTEXT
}

cmd_test() {
  spiritual_seal
  log_info "🧪 Running K3 diagnostics..."
    # Check dependencies
  command -v jq >/dev/null 2>&1 && log_info "✅ jq installed" || log_warn "⚠️  jq not found (install: pkg install jq)"
  command -v curl >/dev/null 2>&1 && log_info "✅ curl installed" || log_warn "⚠️  curl not found"
  
  # Test storage
  local test_id=$(generate_id "TEST")
  save_json "test" "$test_id" '{"ok":true}' 2>/dev/null && log_info "✅ Storage working" || log_error "❌ Storage failed"
  
  # Test AI
  if ai_test >/dev/null 2>&1; then
    log_info "✅ AI connected (Dialagram)"
  else
    log_warn "⚠️  AI in mock mode"
  fi
  
  # Test workflow
  source "$SCRIPT_DIR/workflows/maintenance.sh"
  local rpt_id=$(wf_maintenance_create "Test" "Test desc" low 2>/dev/null | grep "RPT-MAINT" || true)
  [[ -n "$rpt_id" ]] && log_info "✅ Workflow working" || log_warn "⚠️  Workflow test skipped"
  
  with_blessing "✨ All diagnostics complete"
}

cmd_report() {
  local location="${1:-}" desc="${2:-}" urgency="${3:-medium}"
  source "$SCRIPT_DIR/workflows/maintenance.sh"
  wf_maintenance_create "$location" "$desc" "$urgency"
}

cmd_status() {
  local report_id="${1:-}"
  source "$SCRIPT_DIR/workflows/maintenance.sh"
  wf_maintenance_status "$report_id"
}

cmd_list() {
  source "$SCRIPT_DIR/workflows/maintenance.sh"
  wf_maintenance_list
}

cmd_ai() {
  local prompt="${*:-Halo Dream OS}"
  spiritual_seal
  echo "🤖 Query: $prompt"
  echo "━━━━━━━━━━━━━━━━━━━━"
  ai_query "$prompt"
  with_blessing ""
}

#================================================================# MAIN ROUTER
#================================================================

# Safe mode: allow empty variables
set +u

main() {
  local cmd="${1:-help}"
  shift || true
  
  case "$cmd" in
    test)    cmd_test ;;
    report)  cmd_report "$@" ;;
    status)  cmd_status "$@" ;;
    list)    cmd_list ;;
    ai)      cmd_ai "$@" ;;
    help|*)  cmd_help ;;
  esac
}

main "$@"
