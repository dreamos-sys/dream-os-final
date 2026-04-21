#!/bin/bash
# --- DREAM OS VAULT SYNC v2.1 ---
SB_URL="https://pvznaeppaagylwddirla.supabase.co"
SB_KEY="Sb_publishable_vt3jOUQ_1AmssJHdvSMy9w_u6-794iN"
BACKUP_DIR="$HOME/dream-live/workspaces/kabag_umum/archives"

echo "🔐 [VAULT] Memulai Sinkronisasi Data ke Vault Lokal..."

# Ambil data Bookings
curl -s -X GET "$SB_URL/rest/v1/bookings" \
  -H "apikey: $SB_KEY" \
  -H "Authorization: Bearer $SB_KEY" \
  -o "$BACKUP_DIR/bookings_backup_$(date +%Y%m%d).json"

if [ $? -eq 0 ]; then
    echo "✅ SUCCESS: Data Bookings berhasil diamankan di Vault."
    bash ~/dream-live/scripts/modular_brain.sh m "Sistem v2.1: Backup mingguan berhasil dijalankan secara otomatis. Skor Kedaulatan Terjaga!"
else
    echo "❌ ERROR: Gagal mengakses Vault Cloud."
fi
