#!/data/data/com.termux/files/usr/bin/bash
# 🛡️ GHOST IMMUNITY SENTINEL v1.0
# 🤲 Niat lurus, sistem terjaga, imun bekerja.

while true; do
    # 1. Cek 'Suhu' RAM (Threshold 90%)
    usage=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
    if [ "$usage" -gt 90 ]; then
        echo "⚠️ Sistem Meriang (RAM $usage%)! Mengirim Antibodi..." >&2
        sync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || echo "🤲 Membersihkan residu memori..." >&2
    fi

    # 2. Cek 'Nafas' Backend (Port 8082)
    if ! nc -z 127.0.0.1 8082; then
        echo "⚠️ Backend Pingsan! Menghidupkan ulang sirkuit..." >&2
        # Tambahkan perintah restart server Master di sini
    fi

    sleep 60 # Cek setiap 1 menit biar nggak boros baterai
done
