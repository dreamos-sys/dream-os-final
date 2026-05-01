#!/data/data/com.termux/files/usr/bin/bash
VAULT_FILE="$HOME/dream-live/.vault.age"
KEY_FILE="$HOME/dream-live/.vault.key"

case "$1" in
  "init")
    echo "🔑 Membuat kunci vault baru..."
    age-keygen -o "$KEY_FILE" 2>/dev/null
    PUB=$(grep "public key:" "$KEY_FILE" | awk '{print $NF}')
    echo "✅ Kunci dibuat. Publik key: $PUB"
    echo "⚠️  SIMPAN $KEY_FILE DI AMAN. Jika hilang, vault tidak bisa dibuka."
    ;;
  "lock")
    if [ ! -f "$KEY_FILE" ]; then echo "❌ Kunci tidak ditemukan. Jalankan: vault.sh init"; exit 1; fi
    echo "📝 Isi data rahasia (Ctrl+D untuk selesai):"
    age -r "$(grep 'public key:' "$KEY_FILE" | awk '{print $NF}')" -o "$VAULT_FILE"
    echo "✅ Data terenkripsi ke .vault.age"
    ;;
  "unlock")
    if [ ! -f "$VAULT_FILE" ]; then echo "❌ Vault kosong"; exit 1; fi
    echo "🔓 Membuka vault..."
    age -d -i "$KEY_FILE" "$VAULT_FILE"
    ;;
  *) echo "Usage: vault.sh [init|lock|unlock]" >&2 ;;
esac
