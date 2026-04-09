#!/bin/bash
echo "🧠 Dream AI Chat - Ctrl+C to exit"
echo "=================================="
while true; do
  echo -n "You: "
  read prompt
  [ -z "$prompt" ] && continue
  echo -n "AI: "
  curl -s --max-time 30 http://localhost:11434/api/generate \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"tinyllama\",\"prompt\":\"$prompt\",\"stream\":false}" \
    | grep -o '"response":"[^"]*"' | cut -d'"' -f4 | sed 's/\\n/ /g'
  echo ""
done
