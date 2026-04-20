#!/bin/bash
DATA_FILE="$HOME/dream-live/src/engine/reports_master.json"

echo "🧹 Membersihkan data tanpa Harga Diri..."
# Simpan hanya data yang punya integrity_sign (tidak kosong)
grep "integrity_sign" "$DATA_FILE" | grep -v '""' > "${DATA_FILE}.tmp"
# Karena format file Sultan per-objek, kita filter yang beneran valid
jq -s 'map(select(.integrity_sign != "")) | .[]' "$DATA_FILE" > "${DATA_FILE}.clean"

mv "${DATA_FILE}.clean" "$DATA_FILE"
echo "✅ Log dibersihkan. Sekarang cuma ada data AMANAH."
