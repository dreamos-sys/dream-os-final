#!/data/data/com.termux/files/usr/bin/bash
WATCH_DIR="${1:-./modules}"
# Fix Termux: pakai $HOME/.dreamos/ bukan /tmp/
mkdir -p "$HOME/.dreamos"
BASE="$HOME/.dreamos/security.hash"
[ -d "$WATCH_DIR" ] || { echo "❌ $WATCH_DIR tidak ada"; exit 1; }
find "$WATCH_DIR" -type f -exec md5sum {} + | md5sum > "$BASE"
echo "🛡️ Sentinel aktif di $WATCH_DIR (baseline: $(cat $BASE))"
while true; do
  current=$(find "$WATCH_DIR" -type f -exec md5sum {} + | md5sum)
  if [ "$current" != "$(cat "$BASE")" ]; then
    echo ""; echo "🚨 PERUBAHAN terdeteksi:"
    git status --porcelain "$WATCH_DIR" | head -10
    read -p "   Rollback semua? [y/N] " ans
    if [ "$ans" = "y" ] || [ "$ans" = "Y" ]; then
      git checkout -- "$WATCH_DIR"; echo "✅ Rollback selesai."
    else
      echo "ℹ️ Dianggap sah — baseline diperbarui."
    fi
    find "$WATCH_DIR" -type f -exec md5sum {} + | md5sum > "$BASE"
  fi
  sleep 30
done
