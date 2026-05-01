#!/data/data/com.termux/files/usr/bin/bash
# 🛡️ ADB GHOST EXORCIST (For Patient Phones)
# 🤲 Bismillah... Membersihkan HP orang lain lewat kabel kedaulatan.

echo "🔍 Memindai parasit digital di HP Pasien..."
# Cari paket yang sering dipake adware/junk
junk_list=("com.vtools.adblock" "com.android.tools.security" "com.junk.cleaner")

for p in "${junk_list[@]}"; do
    if adb shell pm list packages | grep -q "$p"; then
        echo "⚔️ Menghapus: $p"
        adb shell pm uninstall --user 0 "$p"
    fi
done

echo "✅ Pembersihan Selesai. Bi idznillah."
