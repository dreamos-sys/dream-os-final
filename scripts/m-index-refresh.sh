#!/bin/bash
WS_PATH=$(pwd)
INDEX_FILE="$WS_PATH/workspace_index.md"

# Cek apakah ini folder workspace yang bener
if [[ ! -d "docs" && ! -d "tasks" ]]; then
    echo "❌ [ERROR] Mr. M, ini bukan folder Ruang Kerja! Masuk dulu pakai 'cc-kabag' atau 'cc-koor'."
    exit 1
fi

echo "# 📒 BUKU BESAR DIGITAL - $(basename $WS_PATH | tr '_' ' ' | awk '{print toupper($0)}')" > $INDEX_FILE
echo "*Terakhir di-audit: $(date '+%Y-%m-%d %H:%M:%S')*" >> $INDEX_FILE
echo -e "\n## 📂 DAFTAR BERKAS AKTIF\n" >> $INDEX_FILE

for dir in docs tasks reports archives; do
    if [ -d "$dir" ]; then
        echo "### 📁 $(echo $dir | awk '{print toupper($0)}')" >> $INDEX_FILE
        ls -p "$dir" 2>/dev/null | grep -v / | sed 's/^/- [ ] /' >> $INDEX_FILE
        echo "" >> $INDEX_FILE
    fi
done

echo "---" >> $INDEX_FILE
echo "## 📝 CATATAN ASISTEN" >> $INDEX_FILE
echo "- [ ] Segera klasifikasikan berkas baru di folder 'archives'." >> $INDEX_FILE
echo "- [ ] Update status tugas di folder 'tasks'." >> $INDEX_FILE

echo "✅ Buku Besar (workspace_index.md) telah di-refresh!"
