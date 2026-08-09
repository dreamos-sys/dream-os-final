#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backup_archive"
ARCHIVE_NAME="$BACKUP_DIR/dreamos_final_backup_$TIMESTAMP.tar.gz"

echo -e "\e[1;36m[ * ] Memulai pengemasan arsip Dream OS Final...\e[0m"

# Mengemas seluruh file source code dan aset Dream OS Final secara steril
tar -czf $ARCHIVE_NAME src/ public/ package.json index.html 2>/dev/null

if [ -f "$ARCHIVE_NAME" ]; then
    echo -e "\e[1;32m[ SUCCESS ] Arsip Dream OS Final berhasil diamankan ke: $ARCHIVE_NAME\e[0m"
    echo -e "\e[1;33m[ INFO ] Target sinkronisasi arsip & log: dreamos.sch.id@gmail.com\e[0m"
else
    echo -e "\e[1;31m[ ERROR ] Gagal membuat arsip backup.\e[0m"
fi
