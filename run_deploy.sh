#!/bin/bash

# Dream OS v3.6 - Sovereign Command Deployer
# Bi idznillah — Niat Lurus

echo "==========================================="
echo "   MENJALANKAN KEDAULATAN DREAM OS v3.6    "
echo "==========================================="

# 1. Bersihkan file yang tidak digunakan
rm -rf dist/ v21_legacy.html

# 2. Buat direktori yang dibutuhkan
mkdir -p dist assets

# 3. Salin file ke direktori utama agar tidak 404
cp index.html app.js sw.js manifest.json dist/ 2>/dev/null
cp -r assets/ dist/ 2>/dev/null

# 4. Tambahkan ke Git
git add .

# 5. Lakukan commit
git commit -m "feat(deploy): synchronize Dream OS v3.6 to main branch using run_deploy.sh"

# 6. Push ke repositori utama
git push origin main

echo "-------------------------------------------"
echo "✅ Sistem berhasil di-deploy. Bi idznillah!"
echo "==========================================="
