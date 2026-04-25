#!/data/data/com.termux/files/usr/bin/bash
MODEL="${DREAMOS_MODEL:-tinyllama:latest}"
prompt="${1:-Halo Sultan}"
OUTPUT="/sdcard/Download/ollama_response.txt"

curl -s http://localhost:11434/api/generate \
  -d "{\"model\":\"$MODEL\",\"prompt\":\"$prompt\",\"stream\":false}" \
  | jq -r '.response // "❌ No response"' | tee "$OUTPUT"
