#!/bin/bash
# Dream OS - AI Commit Message Generator (Local Ollama)
source ~/.bashrc
mkdir -p ~/tmp

# Get git diff summary
DIFF_SUMMARY=$(git diff --cached --stat 2>/dev/null | head -5)
if [ -z "$DIFF_SUMMARY" ]; then
  echo "⚠️ No staged changes found"
  exit 0
fi

# Generate commit message via Ollama
echo "🤲 Generating commit message..."
COMMIT_MSG=$(ollama run qwen2.5:0.5b "Buatkan commit message singkat dan deskriptif dalam 1 kalimat untuk perubahan berikut (bahasa Indonesia): $DIFF_SUMMARY" 2>/dev/null | grep -v "^>" | head -1)

echo ""
echo "💡 Suggested commit message:"
echo "$COMMIT_MSG"
echo ""
read -p "Gunakan message ini? (y/n): " CONFIRM
if [ "$CONFIRM" = "y" ]; then
  git commit -m "$COMMIT_MSG"
  echo "✅ Committed!"
else
  echo "⚠️ Commit cancelled"
fi
