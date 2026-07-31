#!/bin/bash

# ===== KONFIGURASI =====
SUPABASE_URL="https://gbigjdhifispatrrskgh.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k"
API_URL="$SUPABASE_URL/rest/v1"
HEADERS="apikey: $SUPABASE_KEY"

echo " Mengecek User di Supabase..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cek tabel users
echo ""
echo "📊 Tabel 'users':"
USERS=$(curl -s -X GET "$API_URL/users?select=*" \
     -H "$HEADERS" \
     -H "Content-Type: application/json")

if [ "$USERS" = "[]" ] || [ -z "$USERS" ]; then
    echo "   ⚠️  Tabel users kosong atau tidak ada"
else
    echo "$USERS" | jq -r '.[] | "   👤 \(.nama) | 📧 \(.email) | 👔 \(.role) | 🟢 \(.status)"'
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Jika Pak Hanung & Pak Erwin tidak ada di atas,"
echo "   mereka perlu dibuat via:"
echo "   1. Command Center → Tab Users → Tambah User Baru"
echo "   2. Atau via script: ./supabase-users.sh add"
echo ""
echo "📱 Setelah ditambahkan, buka Command Center → Tab Users"
echo "   untuk sinkronisasi ke LocalStorage."

