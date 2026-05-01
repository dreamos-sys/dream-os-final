#!/data/data/com.termux/files/usr/bin/bash
# 🛡️ DREAM OS AUTOMATED ANTIBODY
# 🤲 Niat lurus, sistem terjaga, imun bekerja otomatis. Bi idznillah.

CORE_FILE="$HOME/dream-live/m-120b"
LOG_SECURITY="$HOME/dream-live/logs/security.log"
# Ambil sidik jari asli file inti
ORIGINAL_HASH=$(md5sum "$CORE_FILE" | awk '{print $1}')

echo "[$(date)] 🛡️ System Antibody Activated. Standing by..." >> "$LOG_SECURITY"

while true; do
    # --- DETECTION 1: RAM OVERLOAD ---
    usage=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
    if [ "$usage" -gt 90 ]; then
        echo "[$(date)] ⚠️ Alert: RAM $usage%! Deploying cleaning antibody..." >> "$LOG_SECURITY"
        sync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null
    fi

    # --- DETECTION 2: INTRUSION (Network) ---
    foreign_ip=$(ss -tuln 2>/dev/null | grep -c LISTEN || echo 0 | grep :8082 | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | grep -v "127.0.0.1")
    if [ ! -z "$foreign_ip" ]; then
        echo "[$(date)] ⚔️ INTRUDER DETECTED: $foreign_ip! Closing Portal..." >> "$LOG_SECURITY"
        pkill -f cloudflared # Matikan jalur portal otomatis
    fi

    # --- DETECTION 3: INTEGRITY (The Depok Strike) ---
    CURRENT_HASH=$(md5sum "$CORE_FILE" | awk '{print $1}')
    if [ "$CURRENT_HASH" != "$ORIGINAL_HASH" ]; then
        echo "[$(date)] ⚡ DEPOK LIGHTNING STRIKE: Core compromised! Unauthorized change detected!" >> "$LOG_SECURITY"
        # Di sini Master bisa taruh trigger destruktif jika HP hilang
        # (Sesuai SOP: jika > 1 hari gak lapor, sistem erase data)
    fi

    sleep 30 # Cek setiap 30 detik biar hemat batere
done
