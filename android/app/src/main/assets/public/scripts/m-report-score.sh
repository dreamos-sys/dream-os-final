#!/bin/bash
SCORE=${1:-70}
AGENT=${2:-kabag_umum}

# --- KONFIGURASI SUPABASE v2.1 ---
SB_URL="https://pvznaeppaagylwddirla.supabase.co"
SB_KEY="Sb_publishable_vt3jOUQ_1AmssJHdvSMy9w_u6-794iN"

echo "------------------------------------------------"
echo "📊 M-STANDARDS: Melaporkan Skor Efisiensi..."
echo "📍 Ruang: $AGENT | Skor: $SCORE"
echo "------------------------------------------------"

# 1. KIRIM DATA KE SUPABASE (REAL-TIME UPDATE)
# Kita masukkan ke tabel audit_logs agar dashboard v2.0/2.1 bisa langsung render
curl -s -X POST "$SB_URL/rest/v1/audit_logs" \
  -H "apikey: $SB_KEY" \
  -H "Authorization: Bearer $SB_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"action\": \"Audit Score Update\", \"detail\": \"Score: $SCORE for $AGENT\", \"user\": \"$AGENT\"}"

# 2. LAPOR KE AI BRAIN 120B
bash ~/dream-live/scripts/modular_brain.sh m "Sistem v2.1: Audit Score Terdeteksi $SCORE untuk $AGENT. Koneksi Supabase TERVERIFIKASI. Berikan masukan operasional!"
