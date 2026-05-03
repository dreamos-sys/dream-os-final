#!/bin/bash
# Dream OS Helper Commands
# Usage: source dreamos-help.sh

dreamos-test() {
  echo "🧪 Running Dream OS Diagnostic..."
  echo "Paste this in browser console:"
  cat << 'CONSOLEOF'
console.group('🔍 Dream OS Diagnostic');
console.log('1. DreamOS:', typeof window.DreamOS);
console.log('2. openCommandCenter:', typeof window.openCommandCenter);
console.log('3. command-center:', !!document.getElementById('command-center'));
console.log('4. menu cards:', document.querySelectorAll('#menu-grid .menu-card')?.length);
console.groupEnd();
CONSOLEOF
}

dreamos-deploy() {
  echo "🚀 Deploying to GitHub Pages..."
  git add -A
  git commit -m "chore: deploy $(date '+%Y-%m-%d %H:%M')"
  git push origin gh-pages --force
  echo "✅ Deployed! Wait 1-3 min for GitHub Pages update."
}

dreamos-clean() {
  echo "🧹 Cleaning backup files..."
  find . -name "*.backup.*" -delete
  echo "✅ Cleaned."
}

echo "🕌 Dream OS Helper loaded!"
echo "Available commands:"
echo "  dreamos-test    → Show console diagnostic snippet"
echo "  dreamos-deploy  → Commit & push to GitHub Pages"
echo "  dreamos-clean   → Remove backup files"
