#!/bin/bash
echo "🔍 Dream OS AI Diagnostic"
echo "========================"

# 1. Ollama server
echo -n "🦙 Ollama server: "
if pgrep -x ollama > /dev/null; then
    echo "✅ Running"
    curl -s http://localhost:11434/api/tags | grep -q "models" && echo "   ✅ API responding" || echo "   ❌ API not responding"
else
    echo "❌ Not running - start with: nohup ollama serve > ~/ollama.log 2>&1 &"
fi

# 2. Models
echo -n "📦 Models installed: "
ollama list 2>/dev/null | tail -n +2 | wc -l | xargs -I{} echo "{} found"
ollama list 2>/dev/null | tail -n +2 | head -3 | while read line; do echo "   • $line"; done

# 3. Disk space
echo -n "💾 Available space: "
df -h ~ | tail -1 | awk '{print $4}'

# 4. Live site
echo -n "🌐 Live site: "
curl -s -o /dev/null -w "%{http_code}" https://dreamos-sys.github.io/dream-os-final/ | xargs -I{} echo "HTTP {}"

echo "========================"
