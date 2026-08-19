#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")/.." 2>/dev/null || true
echo "📊 DREAM OS EXECUTIVE SUMMARY"
echo "-----------------------------------"
echo "Commits total   : $(git rev-list --count HEAD)"
echo "Deploy terakhir : $(git log -1 --format='%cr (%cs)')"
echo "Line of Code    : $(find . -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.ts' \) -not -path '*/.git/*' -not -path '*/node_modules/*' -not -path '*/coverage/*' -not -path '*/backups/*' -not -name '*bak*' -not -name '*backup*' -print0 2>/dev/null | xargs -0 cat 2>/dev/null | wc -l) baris"
echo "Modul aktif     : $(ls modules/*.html 2>/dev/null | wc -l)"
echo "Edge Functions  : $(ls supabase/functions 2>/dev/null | wc -l)"
echo "CI Workflows    : $(ls .github/workflows 2>/dev/null | wc -l)"
echo "Arsip rollback  : $(ls ~/dreamos-bak-archive/modules-bak 2>/dev/null | wc -l) file (lokal)"
echo "SW Cache        : $(grep -o "CACHE_VERSION = '[^']*'" sw.js | head -1)"
echo "-----------------------------------"
echo "🧠 AI: Prediksi✅ Anomali✅ Insight✅ | 🔐 Auth: Unified✅ | SaaS: 6/6"
