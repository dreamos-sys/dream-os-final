#!/data/data/com.termux/files/usr/bin/bash
set -e
echo "🚀 Dream OS Enterprise Deploy"
echo "[1/3] Gate: satpam lokal..."
if [ -f ci-hardening.sh ]; then bash ci-hardening.sh || { echo "❌ Gate gagal"; exit 1; }; else echo "   ⚠️ ci-hardening.sh belum ada (CI GitHub tetap menjaga)"; fi
echo "[2/3] Backup KE LUAR repo..."
mkdir -p ~/dreamos-release-archive
tar -czf ~/dreamos-release-archive/release-$(date +%Y%m%d-%H%M).tar.gz \
  --exclude=.git --exclude=node_modules --exclude=coverage --exclude=backups .
echo "   ✅ arsip: $(ls ~/dreamos-release-archive | wc -l) file"
echo "[3/3] Commit + push (explicit paths)..."
git add index.html sw.js manifest.json modules/ js/ css/ tools/ 2>/dev/null || true
git diff --cached --quiet && { echo "ℹ️ Tidak ada perubahan — skip"; exit 0; }
git commit -m "chore: enterprise release $(date '+%Y-%m-%d %H:%M')"
git push origin gh-pages
echo "✅ DEPLOY SUCCESS — kopi dulu, Komandan! ☕"
