#!/data/data/com.termux/files/usr/bin/bash
cd ~/dream-os-source
rm -rf dist && mkdir dist
cp index.html app.js manifest.json sw.js dist/ 2>/dev/null
cp -r modules assets js dist/ 2>/dev/null
find dist -name "*.bak" -o -name "*.backup*" -delete 2>/dev/null
V=$(date +%s)
sed -i "s|4s-developer.js|4s-developer.js?v=$V|g" dist/index.html
cd dist && rm -rf .git && git init -q && git add -A
git commit -q -m "${1:-deploy} v$V"
git remote add origin git@github.com:dreamos-sys/dream-os-final.git 2>/dev/null || git remote set-url origin git@github.com:dreamos-sys/dream-os-final.git
git push -u origin master:gh-pages --force -q
echo "✅ Deployed v$V | Test: https://dreamos-sys.github.io/dream-os-final/?v=force-$V"
