#!/bin/bash

# ===== KONFIGURASI =====
SUPABASE_URL="https://gbigjdhifispatrrskgh.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k"
API_URL="$SUPABASE_URL/rest/v1"
HEADERS="apikey: $SUPABASE_KEY"

# ===== FUNGSI =====
list_users() {
    echo " Daftar User:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    curl -s -X GET "$API_URL/users?select=*" \
         -H "$HEADERS" \
         -H "Content-Type: application/json" | \
    jq -r '.[] | " \(.nama) | 📧 \(.email) | 👔 \(.role) | 🟢 \(.status)"'
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

add_user() {
    echo "➕ Tambah User Baru"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    read -p "Nama Lengkap: " NAMA
    read -p "Email: " EMAIL
    read -p "Role (staff/guru/security/komandan_regu/janitor_indoor/janitor_outdoor/maintenance/koordinator_umum/kabag_umum/dev): " ROLE
    read -sp "Password (min 6): " PASSWORD
    echo ""
    
    if [ ${#PASSWORD} -lt 6 ]; then
        echo "❌ Password minimal 6 karakter!"
        exit 1
    fi
    
    DATA="{\"email\":\"$EMAIL\",\"nama\":\"$NAMA\",\"role\":\"$ROLE\",\"status\":\"active\",\"divisi\":\"umum\"}"
    
    RESPONSE=$(curl -s -X POST "$API_URL/users" \
         -H "$HEADERS" \
         -H "Content-Type: application/json" \
         -d "$DATA")
    
    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo "❌ Gagal: $(echo "$RESPONSE" | jq -r '.error.message')"
    else
        echo "✅ User berhasil ditambahkan!"
        echo "📧 Email: $EMAIL"
        echo "👤 Nama: $NAMA"
        echo " Password: $PASSWORD"
        echo ""
        echo "⚠️  CATATAN: User ini baru tersedia di database."
        echo "   Untuk login, user perlu dibuat juga di Supabase Auth"
        echo "   via Edge Function atau dashboard Supabase."
    fi
}

edit_user() {
    echo "✏️ Edit User"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    read -p "Email user yang akan diedit: " EMAIL
    
    CURRENT=$(curl -s -X GET "$API_URL/users?email=eq.$EMAIL&select=*" \
         -H "$HEADERS" \
         -H "Content-Type: application/json")
    
    if [ "$CURRENT" = "[]" ]; then
        echo "❌ User dengan email $EMAIL tidak ditemukan!"
        exit 1
    fi
    
    echo "User saat ini:"
    echo "$CURRENT" | jq -r '.[] | "👤 \(.nama) | 📧 \(.email) | 👔 \(.role) | 🟢 \(.status)"'
    
    read -p "Nama baru (tekan Enter untuk skip): " NAMA
    read -p "Role baru (tekan Enter untuk skip): " ROLE
    read -p "Status baru (active/inactive, tekan Enter untuk skip): " STATUS
    
    UPDATES=""
    [ -n "$NAMA" ] && UPDATES="$UPDATES\"nama\":\"$NAMA\","
    [ -n "$ROLE" ] && UPDATES="$UPDATES\"role\":\"$ROLE\","
    [ -n "$STATUS" ] && UPDATES="$UPDATES\"status\":\"$STATUS\","
    UPDATES="$UPDATES\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\""
    
    DATA="{$UPDATES}"
    
    RESPONSE=$(curl -s -X PATCH "$API_URL/users?email=eq.$EMAIL" \
         -H "$HEADERS" \
         -H "Content-Type: application/json" \
         -H "Prefer: return=representation" \
         -d "$DATA")
    
    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo "❌ Gagal: $(echo "$RESPONSE" | jq -r '.error.message')"
    else
        echo "✅ User berhasil diupdate!"
    fi
}

delete_user() {
    echo "🗑️ Hapus User"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    read -p "Email user yang akan dihapus: " EMAIL
    
    read -p "Yakin ingin menghapus user $EMAIL? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        echo "❌ Batal menghapus user"
        exit 0
    fi
    
    RESPONSE=$(curl -s -X DELETE "$API_URL/users?email=eq.$EMAIL" \
         -H "$HEADERS" \
         -H "Content-Type: application/json")
    
    if [ -z "$RESPONSE" ]; then
        echo "✅ User berhasil dihapus!"
    else
        echo " Gagal: $RESPONSE"
    fi
}

sync_to_local() {
    echo "🔄 Sinkronisasi User ke LocalStorage"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    USERS=$(curl -s -X GET "$API_URL/users?select=*" \
         -H "$HEADERS" \
         -H "Content-Type: application/json")
    
    if [ "$USERS" = "[]" ]; then
        echo "⚠️  Tidak ada user di database"
        exit 0
    fi
    
    COUNT=$(echo "$USERS" | jq 'length')
    echo "✅ Ditemukan $COUNT user dari database"
    echo ""
    echo "📋 Untuk sync ke browser, buka Command Center → Tab Users"
    echo "   Sistem akan otomatis sync saat halaman dibuka."
}

# ===== MENU =====
case "$1" in
    list)
        list_users
        ;;
    add)
        add_user
        ;;
    edit)
        edit_user
        ;;
    delete)
        delete_user
        ;;
    sync)
        sync_to_local
        ;;
    *)
        echo "🔧 Dream OS - User Management via Supabase"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  list    - Tampilkan daftar user"
        echo "  add     - Tambah user baru"
        echo "  edit    - Edit user"
        echo "  delete  - Hapus user"
        echo "  sync    - Sinkronisasi ke LocalStorage"
        echo ""
        echo "Examples:"
        echo "  $0 list"
        echo "  $0 add"
        echo "  $0 edit"
        ;;
esac
