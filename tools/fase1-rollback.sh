#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/dream-os-final
BK=$(ls -dt ~/dreamos-audit/fase1-* 2>/dev/null | head -1)
[ -z "$BK" ] && { echo "❌ No backup found"; exit 1; }
echo "Restoring from: $BK"
cp -a "$BK/index.html" index.html
cp -a "$BK/commandcenter.html" modules/commandcenter.html
cp -a "$BK/sw.js" sw.js
[ -f "$BK/cmd-users.js" ] && cp -a "$BK/cmd-users.js" js/cmd-users.js
echo "✅ Files restored. Manual commit:"
echo "  git add index.html modules/commandcenter.html sw.js js/cmd-users.js"
echo "  git commit -m 'revert: fase1 preload/cmd-users'"
echo "  git push origin $(git rev-parse --abbrev-ref HEAD)"
