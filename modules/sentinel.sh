#!/data/data/com.termux/files/usr/bin/bash
# 🛡️ DREAM OS - SENTINEL LITE (Lightweight & Zero Privilege)
# 🤲 Bismillah bi idznillah.

LOG_FILE="$HOME/dream-live/logs/sentinel.log"
THRESHOLD=75 # Batas penggunaan CPU dalam persen

echo "🕶️  Sentinel Lite is Watching..." | tee -a "$LOG_FILE"

while true; do
    # Ambil proses yang memakan CPU lebih dari threshold
    ps -eo pid,%cpu,comm | awk -v t="$THRESHOLD" '$2 > t {print $1, $2, $3}' | while read pid cpu comm; do
        if [ ! -z "$pid" ]; then
            echo "[$(date)] ⚠️ WARNING: High resource usage detected | Comm: $comm | PID: $pid | CPU: $cpu%" >> "$LOG_FILE"
            
            # Matikan proses yang membandel
            kill -9 "$pid" 2>/dev/null
            echo "🛡️ PREVENTIVE: Process $comm ($pid) terminated." >> "$LOG_FILE"
        fi
    done
    sleep 5
done
