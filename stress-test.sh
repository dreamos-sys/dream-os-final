#!/bin/bash
echo "🛡️ DREAM OS v1.0 • FINAL STRESS TEST SUITE"
echo "============================================"
echo "▶️  Phase 1: Structural & Deployment Validation"

# Check critical files
for f in index.html manifest.json sw.js modules/about.html modules/access-verifier.html modules/core-ai.html modules/cetak-laporan.html modules/setting.html modules/commandcenter.html js/core/dream-lib.js js/core/dream-component.js; do
  [ -f "$f" ] && echo "✅ $f" || echo "❌ MISSING: $f"
done

# Validate manifest & SW registration in index.html
echo -e "\n▶️  Phase 2: PWA & CSP Compliance"
grep -q 'manifest.json' index.html && echo "✅ Manifest linked" || echo "❌ Manifest missing"
grep -q 'serviceWorker.register' index.html && echo "✅ Service Worker registered" || echo "❌ SW missing"
grep -q "default-src 'self'" index.html && echo "✅ CSP enforced" || echo "⚠️ CSP not strict"

echo -e "\n▶️  Phase 3: Runtime Validation (Jalankan di DevTools Console)"
echo "📋 Ketik perintah berikut di browser console (F12) setelah buka Dream OS:"
echo "   1. window.HybridSync ? '✅ Hybrid Sync Ready' : '❌ Sync Missing'"
echo "   2. window.DreamGeo ? '✅ Geo Engine Ready' : '❌ Geo Missing'"
echo "   3. navigator.serviceWorker.getRegistration() .then(r => r ? '✅ SW Active' : '❌ SW Inactive')"
echo "   4. caches.keys().then(k => console.log('📦 Cached:', k.join(', ')))"
echo "   5. localStorage.keys().filter(k=>k.startsWith('dreamos_')).length"

echo -e "\n🔚 Structural validation complete. Jalankan runtime test di DevTools."
