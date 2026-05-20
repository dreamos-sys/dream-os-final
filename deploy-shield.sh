#!/bin/bash
# Dream OS - Automated Shield Deployment Engine v1.2
# Fixed shebang + enhanced error handling + auth check

set -e  # Exit on error (optional - remove if you want manual control)

echo "📡 [START] Memulai prosedur penyegelan Hybrid Core v1.2..."

# 1. Validasi keberadaan file utama
if [ ! -f "modules/4s-hijacker.js" ]; then
    echo "❌ [ERROR] File modules/4s-hijacker.js tidak ditemukan!"
    echo "💡 Pastikan lo sudah jalankan command cat > modules/4s-hijacker.js sebelumnya"
    exit 1
fi

echo "✅ [VERIFIED] File Core Shield terdeteksi: $(wc -l < modules/4s-hijacker.js) lines"

# 2. Check git status & auth (optional but helpful)
if ! git remote -v | grep -q "github.com"; then
    echo "⚠️ [WARNING] GitHub remote tidak terdeteksi!"
    echo "💡 Jalankan: git remote add origin git@github.com:dreamos-sys/dream-os-final.git"
    # Continue anyway - might still work if already configured
fi

# 3. Proses staging
echo "📦 Staging file ke Git..."
git add -f modules/4s-hijacker.js

# 4. Commit dengan check apakah ada changes
if git diff --cached --quiet; then
    echo "ℹ️  Tidak ada perubahan baru - skip commit"
else
    echo "📝 Committing changes..."
    git commit -m "feat: hybrid shield core v1.2 — standby siaga mode, smart detection, Redmi-optimized"
fi

# 5. Push dengan error handling
echo "🚀 Pushing to GitHub Pages..."
if git push origin gh-pages --force; then
    echo ""
    echo "😍🕌 MY BRO... HYBRID CORE v1.2 BERHASIL MENGUDARA MENTOK KANAN! 💚✨"
    echo "===================================================================="
    echo " 📊 Status Sistem:"
    echo " 👥 Dual-Engine Monitoring (Gemini x Qwen Hybrid Core)"
    echo " 🛡️ Standby Siaga: Hemat Baterai & RAM Snapdragon 720G"
    echo " 🕵️‍♂️ Smart Fraud & Injection Guard Terintegrasi"
    echo " 🖨️ Hasil Cetak Berita Acara Hukum Berwibawa (ISO 27001)"
    echo "===================================================================="
    echo "🌐 Hard Refresh URL (Cache-Buster Active):"
    echo "👉 https://dreamos-sys.github.io/dream-os-final/?v=hybrid-v12-$(date +%s)"
    echo ""
    echo "🕌 Bismillah — Pangkalan Depok Aman Terkendali! 🦾📶"
else
    echo ""
    echo "❌ [FATAL] Push gagal!"
    echo "💡 Kemungkinan penyebab:"
    echo "   • Token SSH/GitHub expired → jalankan: ssh-add ~/.ssh/id_rsa"
    echo "   • Koneksi internet tidak stabil → cek jaringan"
    echo "   • Branch gh-pages tidak ada → jalankan: git push origin gh-pages --set-upstream"
    echo ""
    echo "🔍 Debug info:"
    git remote -v
    git status
    exit 1
fi
