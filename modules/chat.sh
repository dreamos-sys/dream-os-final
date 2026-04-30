#!/bin/bash
chat_mode() {
  echo -e "\033[0;34m╔══════════════════════════════════════════╗\033[0m"
  echo -e "\033[0;34m║    💬 DREAM CHAT MODE - Mr. M v4.1       ║\033[0m"
  echo -e "\033[0;34m╚══════════════════════════════════════════╝\033[0m"
  while true; do
    echo -n "My Bro 😎 > "
    read -r user_input
    [[ "$user_input" == "exit" ]] && break
    
    # Pake jq biar JSON-nya aman dari karakter aneh
    payload=$(jq -n --arg t "$user_input" '{task: $t}')
    
    response=$(curl -s -X POST "http://127.0.0.1:8082/api/agent" \
      -H "Content-Type: application/json" \
      -d "$payload" | jq -r '.output' 2>/dev/null)

    echo -e "\033[0;32mMr. M 🤖 > ${response:-Aduh Bro, otak gua lagi buffering!}\033[0m\n"
  done
}
