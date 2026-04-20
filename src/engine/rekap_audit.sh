#!/data/data/com.termux/files/usr/bin/bash
echo "📋 [REKAPITULASI KEAMANAN DREAM OS]"
echo "======================================"
for file in logs_*.txt; do
    echo -n "📧 Email: ${file#logs_} "
    HITS=$(grep "\[+\]" "$file" | wc -l)
    if [ "$HITS" -eq 0 ]; then
        echo "✅ BERSIH (0 Hits)"
    else
        echo "🚨 TERDETEKSI ($HITS Hits)"
        grep "\[+\]" "$file" | sed 's/\[+\]/  - /g'
    fi
    echo "--------------------------------------"
done
