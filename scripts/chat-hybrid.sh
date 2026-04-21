#!/bin/bash
echo "⚡ Dream AI Chat (Hybrid) - Ctrl+C to exit"
while true; do
  echo -n "You: "
  read prompt
  [ -z "$prompt" ] && continue
  
  # Rule-based instant responses for common queries:
  case "$prompt" in
    *halo*|*hi*|*hello*) echo "AI: Halo! Saya Dream AI Assistant. Ada yang bisa saya bantu? 💚"; continue;;
    *siapa kamu*) echo "AI: Saya Dream AI, asisten lokal yang berjalan di perangkat Anda. Privasi terjaga, offline-ready! 🤖"; continue;;
    *dream os*) echo "AI: Dream OS adalah sistem manajemen modular berbasis web dengan AI lokal. Built on Termux! 🚀"; continue;;
    *bismillah*) echo "AI: Bismillah! Semangat bekerja dengan niat lurus. Bi idznillah, sukses menyertai! 💚✨"; continue;;
    *status*) echo "AI: Sistem online. Ollama running. Model: tinyllama. Privasi: 100% lokal. 🛡️"; continue;;
  esac
  
  # For other queries, use AI (slower):
  echo -n "AI: "
  curl -s --max-time 30 http://localhost:11434/api/generate \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"tinyllama\",\"prompt\":\"$prompt\",\"stream\":false,\"options\":{\"num_predict\":80}}" \
    | grep -o '"response":"[^"]*"' | cut -d'"' -f4 | sed 's/\\n/ /g'
  echo ""
done
