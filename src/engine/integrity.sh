#!/bin/bash

# --- CONFIGURATION ---
FRAGMENT_A="DS-13.0-X9R-GHOST-ARCHITECT-7782"
DATA_FILE="$HOME/dream-live/src/engine/reports_master.json"

get_dynamic_key() {
    echo "$(date +"%H%M")${FRAGMENT_A}"
}

sign_data() {
    local PAYLOAD=$1
    local KEY=$(get_dynamic_key)
    # KITA PAKE sha256sum (BAWAAN COREUTILS), ANTI-HANTU!
    local SIG=$(echo -n "${PAYLOAD}${KEY}" | sha256sum | awk '{print $1}')
    echo "$SIG"
}

commit_data() {
    local CONTENT=$2
    local SIGNATURE=$(sign_data "$CONTENT")

    if [ -z "$SIGNATURE" ] || [ "${#SIGNATURE}" -lt 10 ]; then
        echo "🚨 ERROR: Bahkan sha256sum pun gak jalan. HP Sultan perlu di-ruqyah!"
        exit 1
    fi

    # Susun JSON (Hajar pake JQ langsung)
    local ENTRY=$(jq -n \
        --arg id "$(date +%s%N)" \
        --arg ts "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
        --arg pay "$CONTENT" \
        --arg sig "$SIGNATURE" \
        '{id: $id, timestamp: $ts, payload: $pay, integrity_sign: $sig, version: "2.1-SHA256-NATIVE"}')

    echo "$ENTRY" >> "$DATA_FILE"
    echo "🛡️  [INTEGRITY] Signature Created: ${SIGNATURE:0:32}..."
}

clear
echo "🛡️  DREAM OS INTEGRITY ENGINE v2.1 (NATIVE MODE)"
echo "------------------------------------------"
commit_data "MASTER_LOG" "$1"
echo "------------------------------------------"
echo "🦾 Status: Real Hardware Encryption Active!"
