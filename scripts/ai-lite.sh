#!/bin/bash
# Dream OS - AI Lite (Zero Dependency)
source ~/.bashrc
PROMPT="$1"
[ -z "$PROMPT" ] && echo "Usage: $0 \"prompt\"" && exit 1

curl -s -X POST \
  https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"qwen-turbo\",\"input\":{\"prompt\":\"$PROMPT\"}}" | \
  grep -o '"text":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/\\n/\n/g'
