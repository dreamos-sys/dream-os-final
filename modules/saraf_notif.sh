#!/data/data/com.termux/files/usr/bin/bash
# 🤲 Bismillah bi idznillah.
echo "👂 Saraf Notif Aktif..."
termux-notification-list | jq . > ~/dream-live/logs/notif.log
