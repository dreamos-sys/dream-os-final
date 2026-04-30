#!/bin/bash
# --- DREAM OS SOVEREIGN PUSH v2.1 ---
BASE_DIR="$HOME/dream-live"
cd $BASE_DIR

echo "📦 [REPO] Mengecek status kedaulatan kode..."

# 1. Cek apakah ada perubahan
if [[ -z $(git status -s) ]]; then
    echo "✅ SUCCESS: Tidak ada perubahan baru. Kode sudah sinkron."
    exit 0
fi

# 2. Tambahkan semua perubahan
git add .

# 3. Minta pesan commit (atau pakai timestamp otomatis)
echo "📝 Masukkan pesan update (atau tekan ENTER untuk auto-msg):"
read USER_MSG

if [[ -z "$USER_MSG" ]]; then
    COMMIT_MSG="fix: Sovereign sync $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="feat: $USER_MSG"
fi

# 4. Commit dan Push
git commit -m "$COMMIT_MSG"
echo "🚀 Mengirim data ke brankas GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✨ [KEDAULATAN] Kode berhasil diamankan di GitHub!"
    bash ~/dream-live/scripts/modular_brain.sh m "Sistem v2.1: Sinkronisasi GitHub berhasil. Commit: $COMMIT_MSG"
else
    echo "❌ ERROR: Gagal push. Cek koneksi atau Token GitHub Sultan!"
fi
