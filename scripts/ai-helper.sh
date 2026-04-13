#!/bin/bash
# Dream OS - AI Helper (Multi-Provider: Local + DashScope + NVIDIA)
source ~/.bashrc 2>/dev/null
export TMPDIR="${TMPDIR:-$HOME/tmp}"
mkdir -p "$TMPDIR"

PROMPT="$1"
PROVIDER="${2:-auto}"
MODEL="${3:-auto}"

if [ -z "$PROMPT" ]; then
  echo "Usage: $0 \"prompt\" [provider] [model]"
  echo "Providers: auto, local, dashscope, nvidia"
  exit 1
fi

# Auto-detect provider (prioritas: local > nvidia > dashscope)
if [ "$PROVIDER" = "auto" ]; then
  if command -v ollama &>/dev/null && curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
    PROVIDER="local"
  elif [ -n "$NVIDIA_API_KEY" ]; then
    PROVIDER="nvidia"
  elif [ -n "$DASHSCOPE_API_KEY" ]; then
    PROVIDER="dashscope"
  else
    echo "❌ No API key or local Ollama found!"
    exit 1
  fi
fi

echo "🤲 Bismillah - Using provider: $PROVIDER"

case "$PROVIDER" in
  local)
    MODEL="${MODEL:-qwen2.5:0.5b}"
    ollama run "$MODEL" "$PROMPT" 2>/dev/null | grep -v "^>"
    ;;
  nvidia)
    MODEL="${MODEL:-qwen/qwen3.5-397b-a17b}"
    curl -s -X POST https://integrate.api.nvidia.com/v1/chat/completions \
      -H "Authorization: Bearer $NVIDIA_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"model\":\"$MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"$PROMPT\"}],\"max_tokens\":512,\"temperature\":0.6,\"stream\":false}" | \
      grep -o '"content":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/\\n/\n/g'
    ;;
  dashscope)
    MODEL="${MODEL:-qwen-turbo}"
    curl -s -X POST https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
      -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"model\":\"$MODEL\",\"input\":{\"prompt\":\"$PROMPT\"}}" | \
      grep -oE '"(text|content)":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/\\n/\n/g'
    ;;
esac

echo ""
echo "✅ Bi idznillah - Done."
