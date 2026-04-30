#!/bin/bash
# Dream OS - Spiritual Reminder via AI (Local)
source ~/.bashrc
mkdir -p ~/tmp

PRAYER_TIME="${1:-Maghrib}"

echo "🤲 Bismillah - Generating reminder for $PRAYER_TIME..."
REMINDER=$(ollama run qwen2.5:0.5b "Buatkan reminder singkat, penuh hikmah, dan menyentuh hati untuk waktu shalat $PRAYER_TIME. Gunakan bahasa Indonesia yang lembut. Maksimal 3 kalimat. Akhiri dengan 'Bi idznillah'." 2>/dev/null | grep -v "^>")

echo ""
echo "🕌 Spiritual Reminder ($PRAYER_TIME):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$REMINDER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Bi idznillah - Done."
