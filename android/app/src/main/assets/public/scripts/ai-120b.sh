#!/data/data/com.termux/files/usr/bin/bash
set -e
API_URL="https://openrouter.ai/api/v1/chat/completions"
MODEL="google/gemma-2-2b-it"
KEY_FILE="$HOME/.dreamos_120b_key"
TEMP_FILE="/sdcard/Download/dreamos_ai_response.txt"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

get_api_key() {
  if [[ -f "$KEY_FILE" && -s "$KEY_FILE" ]]; then
    cat "$KEY_FILE" | tr -d '\n\r' | xargs
  else
    echo -e "${YELLOW}🔑 Masukkan OpenRouter API Key (sk-or-...):${NC}"
    read -r key
    key=$(echo "$key" | tr -d '\n\r' | xargs)
    if [[ "$key" =~ ^sk-or- ]]; then
      echo "$key" > "$KEY_FILE"; chmod 600 "$KEY_FILE"
      echo "$key"
    else
      echo -e "${RED}❌ Key harus mulai dengan sk-or-!${NC}"; exit 1
    fi
  fi
}

query_120b() {
  local prompt="$1" api_key="$2"
  echo -ne "${YELLOW}🤖 AI thinking"; for i in 1 2 3; do echo -ne "..."; sleep 0.2; done; echo -e "${NC}"
  
  # Build JSON body
  local json_body="{\"model\":\"$MODEL\",\"messages\":[{\"role\":\"system\",\"content\":\"Panggil user Sultan. Format: 🎯 Diagnosis, 🔧 Solusi, 🛡️ Pencegahan. Akhiri: Bi idznillah.\"},{\"role\":\"user\",\"content\":\"$prompt\"}],\"temperature\":0.2,\"max_tokens\":800}"
  
  # Call API - SINGLE LINE (no backslash issues!)
  local response http_code body
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" -H "Authorization: Bearer $api_key" -H "Content-Type: application/json" -H "HTTP-Referer: https://dreamos-sys.github.io" -H "X-Title: Dream-OS-Termux" -d "$json_body" 2>/dev/null)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [[ "$http_code" != "200" ]]; then
    echo -e "${RED}❌ HTTP $http_code${NC}" >&2
    echo "$body" | jq -r '.error.message // "Unknown error"' 2>/dev/null || echo "$body"
    return 1
  fi
  
  # Parse response
  if command -v jq &>/dev/null; then
    local content=$(echo "$body" | jq -r '.choices[0].message.content // empty' 2>/dev/null)
    [[ -n "$content" ]] && echo "$content" || echo "❌ No content"
  else
    echo "$body" | grep -oP '"content":\s*"\K[^"]+' | head -1
  fi
}

save_result() { echo "$1" > "$TEMP_FILE"; echo -e "${GREEN}💾 Saved: $TEMP_FILE${NC}"; }

main() {
  echo -e "${GREEN}╔════════════════════════════╗${NC}"
  echo -e "${GREEN}║  🤖 Dream OS AI 120B Bridge  ║${NC}"
  echo -e "${GREEN}╚════════════════════════════╝${NC}"
  
  local prompt="${1:-}"
  [[ -z "$prompt" ]] && { echo -e "${YELLOW}💬 Pertanyaan:${NC}"; read -r prompt; }
  [[ -z "$prompt" ]] && { echo -e "${RED}❌ Empty!${NC}"; exit 1; }
  
  local api_key=$(get_api_key)
  local result=$(query_120b "$prompt" "$api_key") || exit 1
  
  echo -e "\n${GREEN}══════════════════════════════${NC}"
  echo -e "${GREEN}📋 HASIL ANALISA:${NC}"
  echo -e "${GREEN}══════════════════════════════${NC}"
  echo -e "$result"
  echo -e "${GREEN}══════════════════════════════${NC}"
  
  save_result "$result"
  command -v termux-clipboard-set &>/dev/null && echo "$result" | termux-clipboard-set && echo -e "${YELLOW}📋 Copied!${NC}"
}
main "$@"
