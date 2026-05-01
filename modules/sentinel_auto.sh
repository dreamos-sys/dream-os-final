#!/data/data/com.termux/files/usr/bin/bash
LOG_FILE="$HOME/dream-live/logs/honeypot.json"
BLOCK_FILE="$HOME/dream-live/logs/blocked_ips.log"
JUDGE="$HOME/dream-live/modules/ai_judge.py"
mkdir -p "$(dirname "$LOG_FILE")"
[ ! -f "$LOG_FILE" ] && touch "$LOG_FILE"
[ ! -f "$BLOCK_FILE" ] && touch "$BLOCK_FILE"

echo "🛡️ Sentinel Auto-Response (AI-Judge Wired): ACTIVE"
echo "🤲 Bi idznillah — Memantau & menilai niat..."

tail -Fn0 "$LOG_FILE" 2>/dev/null | while IFS= read -r line; do
    [ -z "$line" ] && continue
    
    # Safe JSON parse
    IP=$(echo "$line" | jq -r '.ip' 2>/dev/null)
    PATH_HIT=$(echo "$line" | jq -r '.path' 2>/dev/null)
    [[ "$IP" == "null" || -z "$IP" ]] && continue

    # Hitung frekuensi percobaan IP ini
    ATTEMPTS=$(grep -cF "$IP" "$LOG_FILE" 2>/dev/null || echo 1)

    # Tanya AI Judge
    VERDICT=$(python3 "$JUDGE" "$PATH_HIT" "$ATTEMPTS" 2>/dev/null)
    [ -z "$VERDICT" ] && VERDICT="GREY_ZONE"

    case "$VERDICT" in
        "BLACK_LIST")
            if ! grep -qF "$IP" "$BLOCK_FILE" 2>/dev/null; then
                echo "$(date '+%Y-%m-%d %H:%M:%S') | BLACK | $IP | $PATH_HIT" >> "$BLOCK_FILE"
                echo "🚨 AI Verdict: BLACK → $IP logged. Smiling & throttling."
            fi
            ;;
        "GREY_ZONE")
            echo "👁️ AI Verdict: GREY → $IP monitored ($PATH_HIT)."
            ;;
        "WHITE_LIST")
            # Tamu sopan, biarkan lewat diam-diam
            ;;
        *) echo "⚠️ AI Verdict unknown: $VERDICT" ;;
    esac

    # Self-heal (restart hanya kalau mati)
    pgrep -f stealth_launcher >/dev/null 2>&1 || python3 ~/dream-live/modules/stealth_launcher.py >/dev/null 2>&1 &
    pgrep -f honeypot >/dev/null 2>&1 || python3 ~/dream-live/modules/honeypot.py >/dev/null 2>&1 &
done
