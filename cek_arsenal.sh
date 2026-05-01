#!/bin/bash

echo "🕵️‍♂️  DETEKTIF KEDAULATAN DREAM OS  🕵️‍♂️"
echo "🤲  Bismillah bi idznillah... Checking arsenal..."
echo "------------------------------------------------"

tools=("btop" "tshark" "ffuf" "jq" "curl")

for tool in "${tools[@]}"; do
    if command -v $tool &>/dev/null; then
        echo "✅ $tool: TERPASANG (SIAP TEMPUR)"
    else
        echo "❌ $tool: HILANG (MENCOBA MENEMPA ULANG...)"
        
        # Logic Spesifik buat btop & ffuf
        if [[ "$tool" == "btop" || "$tool" == "ffuf" ]]; then
            pkg install tur-repo -y && pkg install $tool -y
        # Logic Spesifik buat tshark
        elif [[ "$tool" == "tshark" ]]; then
            pkg install root-repo -y && pkg install tshark -y
        else
            pkg install $tool -y
        fi
        
        # Cek Ulang setelah install
        if command -v $tool &>/dev/null; then
            echo "✨ $tool: SEKARANG SUDAH TAJAM!"
        else
            echo "💀 $tool: GAGAL TOTAL (CEK KONEKSI MASTER!)"
        fi
    fi
done

echo "------------------------------------------------"
echo "✅ Done. Bi idznillah. Sistem Terjaga!"
