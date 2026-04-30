#!/bin/bash
# Module: audit.sh — System health + spiritual metrics
check_status() {
  echo "🔍 INSPEKSI TOTAL DREAM OS..." >&2
  pgrep ollama >/dev/null && echo "🤖 Ollama: BERDENYUT ✅" >&2 || echo "🤖 Ollama: PINGSAN ❌" >&2
  pgrep -f server_flask.py >/dev/null && echo "🌐 Flask: AKTIF ✅" >&2 || echo "🌐 Flask: TERPUTUS ❌" >&2
  df -h ~ | awk 'NR==2 {print "💾 Storage: " $4 " tersisa 📦"}' >&2
  if [ -d ~/dream-live/.git ]; then
    T=$(git -C ~/dream-live rev-list --count HEAD 2>/dev/null || echo 0)
    B=$(git -C ~/dream-live log --oneline 2>/dev/null | grep -ic "bi idznillah" || echo 0)
    echo "🕌 Rasio Berkah: $B/$T ($((B*100/T))%) 🤲" >&2
  fi
}
[[ "${BASH_SOURCE[0]}" != "${0}" ]] && export -f check_status
