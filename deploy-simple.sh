#!/data/data/com.termux/files/usr/bin/bash
# Dream OS - Simple Deploy Script (Termux-Safe)
# Usage: ./deploy-simple.sh "commit message"

set -e
PROJECT=~/dream-os-source
DIST=$PROJECT/dist
REPO="git@github.com:dreamos-sys/dream-os-final.git"
URL="https://dreamos-sys.github.io/dream-os-final"
V=$(date +%s)

echo "🚀 Deploy v$V - ${1:-auto}"

# 1. Clean rebuild
echo "🔧 Rebuilding..."
rm -rf "$DIST" && mkdir -p "$DIST"
cp "$PROJECT"/{index.html,app.js,manifest.json,sw.js} "$DIST/" 2>/dev/null || true
cp -r "$PROJECT"/{modules,assets,js} "$DIST/" 2>/dev/null || true
find "$DIST" -name "*.bak" -o -name "*.backup*" -delete 2>/dev/null || true

# 2. Cache-busting: add version to script tags
sed -i "s|4s-developer.js|4s-developer.js?v=$V|g" "$DIST/index.html"
sed -i "s|ai-router.js|ai-router.js?v=$V|g" "$DIST/index.html"

# 3. Add no-cache meta tags
sed -i 's|<head>|<head><meta http-equiv="Cache-Control" content="no-cache">' "$DIST/index.html"

# 4. Git deploy
echo "📦 Pushing to GitHub..."
cd "$DIST"
rm -rf .git && git init -q && git add -A
git commit -q -m "${1:-deploy} [v$V]"
git remote add origin "$REPO" 2>/dev/null || git remote set-url origin "$REPO"
git push -u origin master:gh-pages --force -q

# 5. Verify live
echo "🌐 Verifying..."
sleep 20
S=$(curl -s -o /dev/null -w "%{http_code}" "$URL/" 2>/dev/null || echo "000")
[ "$S" = "200" ] && echo "✅ Live: HTTP $S" || echo "❌ Live: HTTP $S"

# 6. Output
echo ""
echo "🎉 DONE!"
echo "Test: $URL/?v=force-$V"
echo "Tip: Hard refresh browser (Ctrl+Shift+R)"
echo "4S Mode: Tap logo 7x → password: b15m1114h_0124"
