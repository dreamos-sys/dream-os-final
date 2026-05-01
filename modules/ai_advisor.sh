#!/data/data/com.termux/files/usr/bin/bash
BLOCKED="$HOME/dream-live/logs/blocked_ips.log"
HONEY="$HOME/dream-live/logs/honeypot.json"

if [ ! -s "$BLOCKED" ] && [ ! -s "$HONEY" ]; then
  echo "📭 Belum ada data log untuk dianalisis."
  exit 0
fi

PROMPT="Anda adalah AI Security Advisor. Analisis log berikut dan berikan 3 poin rekomendasi praktis. Format singkat. Akhiri: Bi idznillah.\n"
[ -s "$BLOCKED" ] && PROMPT+="\n--- BLOCKED IPs ---\n$(tail -5 "$BLOCKED")"
[ -s "$HONEY" ] && PROMPT+="\n--- HONEYPOT HITS ---\n$(tail -3 "$HONEY")"

echo "🤖 Meminta analisis AI lokal (Ollama Qwen2.5)..."
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "qwen2.5:0.5b",
  "prompt": "'"$PROMPT"'",
  "stream": false
}' | jq -r '.response' 2>/dev/null || echo "⚠️ Ollama tidak merespon. Pastikan model running."
