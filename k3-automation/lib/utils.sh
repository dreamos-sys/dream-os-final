#!/bin/bash
#================================================================
# Utility Functions for K3 Module
#================================================================

# Logger
log_info()  { [[ "${LOG_LEVEL:-info}" =~ ^(info|debug)$ ]] && echo "[info] $* 🤲"; }
log_warn()  { [[ "${LOG_LEVEL:-info}" =~ ^(warn|info|debug)$ ]] && echo "[warn] $* ⚠️"; }
log_error() { echo "[error] $*" >&2; }
log_debug() { [[ "${LOG_LEVEL:-info}" == "debug" ]] && echo "[debug] $* 🔍"; }

# Spiritual seal
spiritual_seal() {
  [[ "${SPIRITUAL_MODE:-true}" == "true" ]] && echo "🤲 Bismillah"
}

# Blessing suffix
with_blessing() {
  echo "$@"
  [[ "${SPIRITUAL_MODE:-true}" == "true" ]] && echo "🕌 Bi idznillah"
}

# Generate unique ID
generate_id() {
  local prefix="${1:-ID}"
  echo "${prefix}-$(date +%Y%m%d%H%M%S)-$$"
}

# Validate input (sanitize)
sanitize_input() {
  echo "$1" | sed 's/[;&|`$()]//g' | head -c 500
}

# Save JSON to file
save_json() {
  local collection="$1" id="$2" data="$3"
  local dir="$K3_DATA_DIR/${collection}"
  mkdir -p "$dir"
  echo "$data" > "$dir/${id}.json"
}

# Load JSON from file
load_json() {
  local collection="$1" id="$2"
  local file="$K3_DATA_DIR/${collection}/${id}.json"
  [[ -f "$file" ]] && cat "$file" || return 1
}
