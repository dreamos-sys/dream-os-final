#!/bin/bash
# Dream OS - AI Helper Script (FINAL: Hybrid Cloud + Local)
# Usage: ./ai-helper.sh "prompt" [model] [use_local:true]

# Load env vars
source ~/.bashrc 2>/dev/null

# Validate API key
if [ -z "$DASHSCOPE_API_KEY" ]; then
  echo "❌ Error: DASHSCOPE_API_KEY not set!"
  echo "💡 Run: source ~/.bashrc"
  exit 1
fi

# Parse arguments
PROMPT="$1"
MODEL="${2:-qwen-turbo}"
USE_LOCAL="${3:-false}"

if [ -z "$PROMPT" ]; then
  echo "Usage: $0 \"your prompt\" [model] [use_local:true]"
  echo "Examples:"
  echo "  $0 \"Halo\" qwen-turbo"
  echo "  $0 \"Halo\" local true"
  exit 1
fi

echo "🤲 Bismillah - Calling $MODEL..."

# === LOCAL MODE (OLLAMA) ===
if [ "$USE_LOCAL" = "true" ] || [ "$MODEL" = "local" ]; then
  echo "🤖 Using LOCAL mode (Ollama)..."
  
  # Check if ollama installed
  if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found. Install: pkg install ollama"
    exit 1
  fi
  
  # Ensure /tmp exists
  mkdir -p /tmp
  
  # Check if server running
  if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️ Ollama server not running. Starting..."
    ollama serve > /tmp/ollama.log 2>&1 &
    sleep 5
  fi
  
  # Use lightweight model
  LOCAL_MODEL="qwen2.5:0.5b"
  echo "📦 Using model: $LOCAL_MODEL"
  
  # Run inference
  RESULT=$(ollama run $LOCAL_MODEL "$PROMPT" 2>/dev/null)
  
  # Display result
  echo ""
  if [ -n "$RESULT" ]; then
    echo "💬 AI Response (Local):"
    echo "$RESULT"
  else
    echo "⚠️ No response from local model"
    echo "💡 Try: ollama pull $LOCAL_MODEL first"
  fi
  echo ""
  echo "✅ Bi idznillah - Done (Local Mode)."
  exit 0
fi

# === CLOUD MODE (DASHSCOPE) ===
echo "☁️ Using CLOUD mode (DashScope)..."

RESPONSE=$(curl -s -X POST \
  https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$MODEL\",\"input\":{\"prompt\":\"$PROMPT\"}}")

# Debug: Show raw response
echo ""
echo "📦 Raw API Response:"
echo "$RESPONSE" | head -c 500
echo ""

# Check for success patterns
if echo "$RESPONSE" | grep -qE '"text"|"content"'; then
  # Parse response
  RESULT=$(echo "$RESPONSE" | sed -n 's/.*"text":"\([^"]*\)".*/\1/p' | head -1)
  [ -z "$RESULT" ] && RESULT=$(echo "$RESPONSE" | sed -n 's/.*"content":"\([^"]*\)".*/\1/p' | head -1)
  
  # Clean escaped chars
  RESULT=$(echo "$RESULT" | sed 's/\\n/\n/g' | sed 's/\\"/"/g')
  
  echo "💬 AI Response (Cloud):"
  echo "$RESULT"
  echo ""
  echo "✅✅✅ DREAM TEAM API WORKING! ✅✅✅"
  
elif echo "$RESPONSE" | grep -q "AccessDenied.Unpurchased"; then
  echo "❌ Model '$MODEL' not activated in DashScope!"
  echo "💡 Solution:"
  echo "   1. Open: https://dashscope-intl.aliyun.com/model"
  echo "   2. Login & activate '$MODEL' or 'qwen-plus'"
  echo "   3. Or use local mode: $0 \"$PROMPT\" local true"
  
elif echo "$RESPONSE" | grep -q "InvalidApiKey"; then
  echo "❌ Invalid API key!"
  echo "💡 Check ~/.bashrc: DASHSCOPE_API_KEY"
  
elif echo "$RESPONSE" | grep -q "rate_limit"; then
  echo "⚠️ Rate limit exceeded. Wait 60 seconds and retry."
  
else
  echo "⚠️ Unknown response format"
fi

echo ""
echo "✅ Bi idznillah - Done."
