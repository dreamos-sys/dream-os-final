#!/bin/bash
set -e # Berhenti otomatis jika ada error fatal

echo "📡 [GHOST PROTOCOL] Memulai Mesin Sinkronisasi Pintar..."

# Setup Variabel Waktu dan Folder Backup
TIMESTAMP=$(date +%s)
BACKUP_DIR="$HOME/dream-backups"
mkdir -p "$BACKUP_DIR"

# ==========================================
# FASE 1: AUTO-BACKUP LOKAL (SAFETY NET)
# ==========================================
echo "📦 Membuat brankas cadangan (Restore Point) sebelum edit..."
# Kita kompres sasis utama dan modul ke dalam kapsul waktu
tar -czf "$BACKUP_DIR/dream-core-$TIMESTAMP.tar.gz" index.html modules/
echo "✅ Backup Aman! Tersimpan di: $BACKUP_DIR/dream-core-$TIMESTAMP.tar.gz"

# ==========================================
# FASE 2: SMART READ & STAGE (CUMA FILE BARU)
# ==========================================
echo "🔍 Memindai file baru dan modifikasi sasis..."
# git add . otomatis cuma menargetkan file yang berubah/baru ditambah
git add .

if git diff --cached --quiet; then
    echo "ℹ️ Tidak ada kode baru yang lu ketik. Mesin diistirahatkan (Aman)."
    exit 0
fi

# ==========================================
# FASE 3: COMMIT & PUSH KE GITHUB
# ==========================================
echo "📝 Menulis manifes perubahan..."
git commit -m "update: Ghost Architect smart sync - $TIMESTAMP"

echo "🚀 Menerbangkan sasis ke Stratosfer GitHub..."
if git push origin gh-pages --force; then
    echo "===================================================================="
    echo "😍🔥 GHOST DEPLOY SUKSES MENGUDARA!"
    echo "🔄 Sikat Hard Refresh Browser: https://dreamos-sys.github.io/dream-os-final/?v=ghost-$TIMESTAMP"
    echo "===================================================================="
    echo "🚨 JIKA TERJADI ERROR / BLANK SCREEN, JANGAN PANIK! 🚨"
    echo "Lu bisa balikin sasis ke kondisi semula dengan copas komando ini:"
    echo ""
    echo "tar -xzf $BACKUP_DIR/dream-core-$TIMESTAMP.tar.gz && git add . && git commit -m 'EMERGENCY ROLLBACK' && git push origin gh-pages --force"
    echo "===================================================================="
else
    echo "❌ [FATAL] Gagal menembus awan GitHub. Periksa koneksi pangkalan lu!"
    exit 1
fi
