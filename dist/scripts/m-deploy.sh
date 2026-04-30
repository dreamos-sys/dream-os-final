#!/bin/bash
# --- DREAM OS MASTER DEPLOY v2.1 ---
BASE_DIR="$HOME/dream-live"
cd $BASE_DIR

echo "🛡️ [DEPLOY] Memulai Protokol Beyoncé (Test-First)..."

# 1. Jalankan Uji Logika (Gunakan python3 untuk testing)
if [ -f "$HOME/dream-live/scripts/m-test-booking.py" ]; then
    python3 ~/dream-live/scripts/m-test-booking.py
    if [ $? -ne 0 ]; then
        echo "❌ [ABORT] Tes logika gagal! Perbaiki kode sebelum push."
        exit 1
    fi
else
    echo "⚠️ [WARN] Script tes tidak ditemukan, lanjut ke push..."
fi

# 2. Sinkronisasi GitHub
echo -e "\n📦 [REPO] Menyiapkan pengiriman ke GitHub..."

if [[ -z $(git status -s) ]]; then
    echo "✅ [INFO] Tidak ada perubahan kode baru yang perlu di-push."
    exit 0
fi

git add .
echo "📝 Masukkan pesan update (atau ENTER untuk auto):"
read USER_MSG
COMMIT_MSG=${USER_MSG:-"fix: Sovereign deploy v3.0 $(date '+%Y-%m-%d %H:%M')"}

git commit -m "feat: $COMMIT_MSG"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "\n🚀 [MISSION SUCCESS] Master Module & Code Berhasil Diamankan!"
    # Lapor ke AI Brain
    bash ~/dream-live/scripts/modular_brain.sh m "Sistem v3.0: Deploy Master Command Center sukses. GitHub & Local Sync OK!"
else
    echo "❌ [FAIL] Gagal mengirim ke GitHub. Cek koneksi atau token!"
fi
