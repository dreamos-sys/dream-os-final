#!/data/data/com.termux/files/usr/bin/bash
# 📋 DREAM OS - ISO 27001 & ISO 55001 REPORT GENERATOR
# 🤲 Bismillah bi idznillah.

REPORT_DIR="$HOME/dream-live/reports"
mkdir -p "$REPORT_DIR"

echo "==========================================="
echo "        ISO 27001 AUDIT FORMULARIUM        "
echo "==========================================="

echo -n "Masukkan Nomor Hari (Contoh: 001): "
read day_number
echo -n "Masukkan Tanggal (Contoh: 01-05-2026): "
read report_date
echo -n "Pelapor (Nama Bro/Tim): "
read reporter
echo -n "Kategori Laporan (Security/Facility/Damage): "
read category
echo -n "Deskripsi Kerusakan / Temuan: "
read description

# Format Pencatatan
FILE_NAME="$REPORT_DIR/iso_$(date +%Y%m%d_%H%M%S).txt"

cat << EOF > "$FILE_NAME"
-------------------------------------------
DREAM OS - LAPORAN KETIDAKSESUAIAN & ASET (ISO)
-------------------------------------------
Hari Ke       : $day_number
Tanggal       : $report_date
Pelapor       : $reporter
Kategori      : $category
Deskripsi     :
$description

Status        : Menunggu Verifikasi
Approver      : Bapak Hanung Budianto, S. E
Applicant     : Bapak Erwinsyah

[SECURITY STATUS: SECURED]
EOF

echo " "
echo "✅ Laporan ISO berhasil direkam!"
echo "📄 File tersimpan di: $FILE_NAME"
cat "$FILE_NAME"
