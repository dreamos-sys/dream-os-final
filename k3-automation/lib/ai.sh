#!/bin/bash
ai_query() {
  local prompt="${1:-}"
  local model="${2:-${DEFAULT_AI_MODEL:-qwen-3.6-plus-thinking}}"
  [[ -z "${DIALAGRAM_API_KEY:-}" ]] && { echo "[mock] $prompt"; return 0; }
  local resp
  resp=$(curl -s -X POST "https://www.dialagram.me/router/v1/chat/completions" -H "Authorization: Bearer ${DIALAGRAM_API_KEY}" -H "Content-Type: application/json" -d "{\"model\":\"${model}\",\"messages\":[{\"role\":\"system\",\"content\":\"Asisten Dream OS K3.\"},{\"role\":\"user\",\"content\":\"${prompt}\"}],\"max_tokens\":200,\"stream\":false}" --max-time 30 2>/dev/null) || resp=""
  local content=""
  command -v jq >/dev/null 2>&1 && content=$(echo "$resp" | jq -r ".choices[0].message.content // empty" 2>/dev/null) || true
  [[ -z "$content" ]] && content=$(echo "$resp" | grep -o "\"content\":\"[^\"]*\"" | head -1 | sed "s/\"content\":\"//;s/\"$//" 2>/dev/null) || true
  [[ -n "$content" && "$content" != "null" ]] && echo "$content" || echo "[mock] $prompt"
}
ai_test() { [[ -n "${DIALAGRAM_API_KEY:-}" ]] || { echo "⚠️ Mock"; return 1; }; local r=$(ai_query "Halo" 2>/dev/null); [[ "$r" != "[mock]"* && -n "$r" ]] && { echo "✅ Connected"; return 0; }; echo "⚠️ Failed"; return 1; }
