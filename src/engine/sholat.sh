#!/bin/bash

# Konfigurasi Kota
CITY="Jakarta"
COUNTRY="ID"
METHOD=11

echo "🕌 [DREAM OS] Menjemput Jadwal Langit..."
echo "--------------------------------------"

# Tambahkan -k (insecure) dan -L (location) buat jaga-jaga
RESPONSE=$(curl -skL "https://api.aladhan.com/v1/timingsByCity?city=$CITY&country=$COUNTRY&method=$METHOD")

# Cek apakah variabel RESPONSE kosong
if [[ -z "$RESPONSE" ]]; then
    echo "🚨 Server AlAdhan tidak merespon. Coba ketik: ping api.aladhan.com"
    exit 1
fi

STATUS=$(echo $RESPONSE | jq -r '.status' 2>/dev/null)

if [[ "$STATUS" == "OK" ]]; then
    echo "📍 Lokasi  : $CITY, $COUNTRY"
    echo "📅 Tanggal : $(echo $RESPONSE | jq -r '.data.date.readable')"
    echo "--------------------------------------"
    echo "✨ Imsak   : $(echo $RESPONSE | jq -r '.data.timings.Imsak')"
    echo "🌅 Subuh   : $(echo $RESPONSE | jq -r '.data.timings.Fajr')"
    echo "☀️ Dzuhur  : $(echo $RESPONSE | jq -r '.data.timings.Dhuhr')"
    echo "🕒 Ashar   : $(echo $RESPONSE | jq -r '.data.timings.Asr')"
    echo "🌇 Maghrib : $(echo $RESPONSE | jq -r '.data.timings.Maghrib')"
    echo "🌙 Isya    : $(echo $RESPONSE | jq -r '.data.timings.Isha')"
    echo "--------------------------------------"
    echo "🦾 Status  : Dream OS Barokah Mode Aktif."
else
    echo "🚨 Gagal parsing data atau JQ belum terinstall."
    echo "Coba ketik: pkg install jq -y"
fi
