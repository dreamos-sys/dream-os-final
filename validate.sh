#!/bin/bash
set -e
echo "🔍 Dream OS Pre-Push Validation v1.0"
echo "📦 Checking module sizes..."
for f in js/*.js; do
    size=$(wc -c < "$f")
    if [ "$size" -gt 10240 ]; then echo "❌ $f too large"; exit 1; fi
done
echo "✅ All modules <10KB"
echo "🔐 Checking for secrets..."
if grep -rE "(API_KEY|PASSWORD|SECRET)" js/ --exclude='*.md' 2>/dev/null | grep -v "placeholder"; then echo "❌ Secrets found!"; exit 1; fi
echo "✅ No obvious secrets"
echo "✅ All checks passed!"
