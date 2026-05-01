#!/data/data/com.termux/files/usr/bin/bash
BASE_DIR="$HOME/dream-live"
HASH_FILE="$BASE_DIR/logs/.integrity_baseline.sha256"
LOGS_DIR="$BASE_DIR/logs"

mkdir -p "$LOGS_DIR"

case "$1" in
  "baseline")
    echo "📝 Membuat baseline integritas sistem..."
    sha256sum "$BASE_DIR/m-120b" "$BASE_DIR/server_flask.py" "$BASE_DIR/modules/dream_shield.py" "$BASE_DIR/modules/multitester.py" > "$HASH_FILE"
    echo "✅ Baseline tersimpan di $HASH_FILE"
    ;;
  "verify")
    if [ ! -f "$HASH_FILE" ]; then
      echo "❌ Baseline belum dibuat. Jalankan: integrity_check.sh baseline"
      exit 1
    fi
    echo "🔍 Memverifikasi integritas file kritis..."
    if sha256sum -c "$HASH_FILE" >/dev/null 2>&1; then
      echo "✅ Semua file utuh. Tidak ada modifikasi mencurigakan."
    else
      echo "⚠️  PERINGATAN: Ada file yang berubah atau dimodifikasi!"
      sha256sum -c "$HASH_FILE" 2>&1 | grep "FAILED"
    fi
    ;;
  "logs")
    echo "📊 Status Log:"
    ls -lh "$LOGS_DIR"/*.log "$LOGS_DIR"/*.json 2>/dev/null | awk '{print "  - "$5" | "$9}'
    echo "🤲 Bi idznillah — Audit lurus, sistem terjaga."
    ;;
  *) echo "Usage: integrity_check.sh [baseline|verify|logs]" >&2 ;;
esac
