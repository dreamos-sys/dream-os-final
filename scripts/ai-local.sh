#!/data/data/com.termux/files/usr/bin/bash
# 🤖 Dream OS AI Local — Ollama Bridge (Termux Optimized)
# ✅ Fast, Low-Memory, Polling-Compatible

set -e

# ── CONFIG ────────────────────────────────────────
MODEL="${DREAMOS_MODEL:-phi3:mini}"  # Rekomendasi: tinyllama (lebih ringan)
OUTPUT_FILE="/sdcard/Download/ollama_response.txt"
OLLAMA_URL="http://localhost:11434/api/generate"
TIMEOUT=120  # detik, maks waktu tunggu inferensi
# ──────────────────────────────────────────────────

# 🎨 Warna
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

# 🔍 Cek Ollama + model tersedia
check_ollama() {
  if ! curl -s --max-time 5 "$OLLAMA_URL" -d '{"model":"'"$MODEL"'","prompt":"ping","stream":false}' >/dev/null 2>&1; then
    echo -e "${RED}❌ Ollama tidak respons${NC}" >&2
    echo -e "${YELLOW}💡 Jalankan: ollama serve &${NC}" >&2
    exit 1
  fi
  
  # Cek model ada di list
  if ! ollama list 2>/dev/null | grep -q "^$MODEL"; then
    echo -e "${RED}❌ Model '$MODEL' tidak ditemukan${NC}" >&2
    echo -e "${YELLOW}💡 Pull dulu: ollama pull $MODEL${NC}" >&2
    exit 1
  fi
}

# 🧠 Query ke Ollama (dengan context size fix untuk tinyllama)
query_ollama() {
  local prompt="$1"
  
  # tinyllama cuma support 2048 ctx, model lain bisa lebih
  local ctx_size=2048
  [[ "$MODEL" =~ phi3|llama3|qwen ]] && ctx_size=4096
  
  echo -ne "${YELLOW}🤖 AI thinking" >&2
  for i in 1 2 3; do echo -ne "..."; sleep 0.3; done >&2
  echo -e "${NC}" >&2
  
  # Call API dengan timeout + context size fix
  curl -s --max-time "$TIMEOUT" -X POST "$OLLAMA_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\":\"$MODEL\",      \"prompt\":\"$prompt\",
      \"stream\":false,
      \"options\": {
        \"num_ctx\": $ctx_size,
        \"temperature\": 0.3,
        \"num_predict\": 512
      }
    }" 2>/dev/null | jq -r '.response // "❌ No response"'
}

# 📤 Save ke file (buat frontend polling)
save_result() {
  local result="$1"
  mkdir -p "$(dirname "$OUTPUT_FILE")" 2>/dev/null || true
  echo "$result" > "$OUTPUT_FILE"
  echo -e "${GREEN}💾 Saved: $OUTPUT_FILE${NC}" >&2
}

# 🚀 Main
main() {
  echo -e "${GREEN}╔════════════════════════════╗${NC}"
  echo -e "${GREEN}║  🤖 Dream OS AI Local      ║${NC}"
  echo -e "${GREEN}║     ($MODEL)                 ║${NC}"
  echo -e "${GREEN}╚════════════════════════════╝${NC}" >&2
  
  check_ollama
  
  local prompt="${1:-}"
  if [[ -z "$prompt" ]]; then
    echo -e "${YELLOW}💬 Pertanyaan Sultan:${NC}" >&2
    read -r prompt
  fi
  [[ -z "$prompt" ]] && { echo -e "${RED}❌ Empty!${NC}" >&2; exit 1; }
  
  local result
  result=$(query_ollama "$prompt") || {
    echo -e "${RED}❌ Query failed${NC}" >&2
    exit 1
  }
  
  # Output rapi
  echo -e "\n${GREEN}══════════════════════════════${NC}"
  echo -e "${GREEN}📋 HASIL:${NC}"
  echo -e "${GREEN}══════════════════════════════${NC}"
  echo -e "$result"
  echo -e "${GREEN}══════════════════════════════${NC}"
  
  save_result "$result"
  
  # Clipboard (Termux:API)  command -v termux-clipboard-set &>/dev/null && echo "$result" | termux-clipboard-set && echo -e "${YELLOW}📋 Copied!${NC}" >&2
}

main "$@"
