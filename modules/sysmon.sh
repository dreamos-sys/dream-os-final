#!/data/data/com.termux/files/usr/bin/bash
echo "📊 DREAM OS SYSTEM MONITOR (Termux-Optimized)"
echo "----------------------------------------------"
echo "🧠 CPU Cores: $(nproc 2>/dev/null || echo '?') | Arch: $(uname -m)"
echo "💾 RAM: $(free -h 2>/dev/null | awk 'NR==2{print $3" / "$2}') | Used: $(free | awk 'NR==2{printf "%.1f%%", $3/$2*100}')"
echo "📂 Processes: $(ps -A 2>/dev/null | wc -l) | Threads: $(ps -A -T 2>/dev/null | wc -l)"
echo "🔥 Top 5 by Memory:"
ps -eo pid,pmem,comm --sort=-pmem 2>/dev/null | head -6
echo "----------------------------------------------"
echo "✅ Done. Bi idznillah — Niat lurus, sistem terjaga. 🤲"
