#!/bin/bash
DIVISI="${1:-m}"
PROMPT_USER="${2:-Lapor status}"
API_KEY="$OLLAMA_API_KEY"
BASE_DIR="$HOME/dream-live"

CORE_STANDARDS=$(cat $BASE_DIR/skills/core-standards.md 2>/dev/null || echo "Standard PUSAT belum diset.")

# --- ATTACHMENT LOGIC ---
FILE_CONTEXT=""
ATTACHED_FILES=""
for word in $PROMPT_USER; do
    clean=$(echo "$word" | sed 's/[.,!?;:]*$//; s/^[[:punct:]]*//' | tr -d '"' | tr -d "'")
    [[ ${#clean} -lt 3 ]] && continue
    TARGET=""
    if [[ -f "$clean" ]]; then TARGET="$clean"
    elif [[ -f "$BASE_DIR/workspaces/kabag_umum/$clean" ]]; then TARGET="$BASE_DIR/workspaces/kabag_umum/$clean"
    elif [[ -f "$BASE_DIR/workspaces/koordinator_umum/$clean" ]]; then TARGET="$BASE_DIR/workspaces/koordinator_umum/$clean"
    fi
    if [[ -n "$TARGET" && "$TARGET" == *".md" ]]; then
        if [[ ! "$ATTACHED_FILES" =~ "$(basename "$TARGET")" ]]; then
            FILE_CONTEXT+="\n\n⚠️ DOKUMEN ($TARGET):\n---\n$(cat "$TARGET")\n---\n"
            ATTACHED_FILES+="$(basename "$TARGET") "
        fi
    fi
done

# --- PREPARE DATA ---
ROLE_DATA=$(python3 -c "import json, sys; d=json.load(open('$BASE_DIR/config/ai.registry.json')); print(json.dumps(d['$DIVISI']))")
PREFIX=$(echo "$ROLE_DATA" | python3 -c "import json, sys; print(json.load(sys.stdin)['prefix'])")
ROLE_NAME=$(echo "$ROLE_DATA" | python3 -c "import json, sys; print(json.load(sys.stdin)['role'])")

export SYSTEM_PROMPT="Kamu adalah Smart Ultra Agent Dream OS. STANDARD_PUSAT: $CORE_STANDARDS. DIVISI: $ROLE_NAME. Analisa dokumen di bawah secara jujur. Jangan halusinasi jika lampiran kosong."
export USER_CONTENT="$PROMPT_USER $FILE_CONTEXT"

echo -n "$PREFIX Memproses Update v2.1..."

# --- GENERATE JSON PAYLOAD (THE CLEAN WAY) ---
JSON_PAYLOAD=$(python3 - << 'PYEOF'
import json, os
data = {
    'model': 'gpt-oss:120b',
    'messages': [
        {'role': 'system', 'content': os.environ.get('SYSTEM_PROMPT', '')},
        {'role': 'user', 'content': os.environ.get('USER_CONTENT', '')}
    ],
    'stream': False
}
print(json.dumps(data))
PYEOF
)

# --- SEND TO OLLAMA ---
RESPONSE=$(curl -s -X POST https://ollama.com/api/chat \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD")

echo -e "\r$PREFIX Update Berhasil Terkirim:\n"
echo "$RESPONSE" | python3 -c "import sys, json; res=json.load(sys.stdin); print(res['message']['content']) if 'message' in res else print('Gagal update!')"
echo -e "\n---"
