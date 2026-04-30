#!/bin/bash
API_KEY="$OLLAMA_API_KEY"
PROMPT="${1:-Cek kesiapan sistem}"
# SYSTEM ROLE: Dipaksa pakai Bahasa Indonesia
SYSTEM_ROLE="Kamu adalah core AI engine untuk Dream OS v2.1.1. Berikan bantuan teknis yang profesional, ringkas, dan akurat. Gunakan Bahasa Indonesia yang pro dan santai. Jangan pakai bahasa Inggris kecuali untuk istilah teknis yang memang tidak ada terjemahannya."

echo -n "[DreamOS-API] Menghubungi Mesin 120B..."

RESPONSE=$(curl -s -X POST https://ollama.com/api/chat \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
        \"model\": \"gpt-oss:120b\",
        \"messages\": [
            {\"role\": \"system\", \"content\": \"$SYSTEM_ROLE\"},
            {\"role\": \"user\", \"content\": \"$PROMPT\"}
        ],
        \"stream\": false
    }")

echo -e "\r[DreamOS-API] Koneksi Berhasil.\n"

echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'message' in data:
        print(data['message']['content'])
    else:
        print('Waduh, datanya nggak ketemu, Boss.')
except Exception as e:
    print(f'Error baca JSON: {e}')
"

echo -e "\n---"
