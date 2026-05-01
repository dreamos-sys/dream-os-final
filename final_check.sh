#!/bin/bash

echo "🕵️‍♂️  AUDIT KEDAULATAN AKHIR  🕵️‍♂️"
echo "🤲  Bismillah... Mastiin alat yang 'merakyat' aja."
echo "------------------------------------------------"

# 1. Ganti btop ke htop (Kedaulatan Tanpa Root)
if ! command -v htop &>/dev/null; then
    echo "🔧 Memasang htop (Si Humble)..."
    pkg install htop -y >/dev/null 2>&1
fi

# 2. Cek Daftar Alat
tools=("htop" "tshark" "jq" "curl" "git")

for tool in "${tools[@]}"; do
    if command -v $tool &>/dev/null; then
        echo "✅ $tool: AKTIF & REAL (Bukan Bohongan)"
    else
        echo "❌ $tool: MASIH NGUMPET"
    fi
done

echo "------------------------------------------------"
echo "💡 TIPS: Kalau 'htop' jalan, ganti '/sysmon' di m-120b pake 'htop'."
echo "✅ Done. Silakan lanjut nonton dracin, My Bro! 📺"
