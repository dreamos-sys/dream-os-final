#!/bin/bash
FILE="$1"
if [ -f "$FILE" ]; then
    echo "🛡️ Cleaning metadata: $FILE"
    exiftool -all= "$FILE"
    echo "✅ Jejak digital dihapus. Foto aman di-upload."
else
    echo "❌ File tidak ditemukan!"
fi
