#!/data/data/com.termux/files/usr/bin/bash
echo "🔍 Dream OS - Accessibility Pre-Check (Phase 1)"
echo "================================================"
cd ~/dream-os
[ -f "src/lib/config/accessibility.js" ] && echo "✅ Config: OK" || echo "❌ Config: MISSING"
[ -f "iso-compliance/phase1-accessibility/CHECKLIST-WCAG22.md" ] && echo "✅ Checklist: OK" || echo "❌ Checklist: MISSING"
echo ""
echo "📌 Next: Test manual pakai TalkBack + keyboard"
echo "🤲 Bi idznillah"
