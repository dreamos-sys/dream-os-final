#!/bin/bash
# Dream OS - AI Code Helper (Local Ollama)
source ~/.bashrc
mkdir -p ~/tmp

TASK="$1"
FILE="${2:-}"

if [ -z "$TASK" ]; then
  echo "Usage: $0 \"task\" [file]"
  echo "Examples:"
  echo "  $0 \"Jelaskan fungsi ini\" src/main.js"
  echo "  $0 \"Buatkan validasi email\" "
  exit 1
fi

# Read file content if provided
if [ -n "$FILE" ] && [ -f "$FILE" ]; then
  CODE_CONTENT=$(head -50 "$FILE")
  PROMPT="$TASK. Kode terkait: $CODE_CONTENT"
else
  PROMPT="$TASK"
fi

echo "🤲 Bismillah - AI Code Helper..."
echo "Task: $TASK"
[ -n "$FILE" ] && echo "File: $FILE"
echo ""

RESPONSE=$(ollama run qwen2.5:0.5b "$PROMPT" 2>/dev/null | grep -v "^>")

echo "💬 AI Response:"
echo "$RESPONSE"
echo ""
echo "✅ Bi idznillah - Done."
