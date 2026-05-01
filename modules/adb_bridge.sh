#!/data/data/com.termux/files/usr/bin/bash
# 🛡️ DREAM OS ADB BRIDGE (Wireless Local)
# 🤲 Bismillah... Membuka gerbang saraf pusat Somay.

# 1. Cek Alat Tempur
if ! command -v adb &> /dev/null; then
    echo "⚙️  Installing Android Tools..."
    pkg install android-tools -y
fi

clear
echo "=========================================="
echo "   🕶️  DREAM OS ADB WIRELESS BRIDGE"
echo "   🤲 Bismillah bi idznillah."
echo "=========================================="

case "$1" in
    "/pair")
        echo "🔗 MODE: Pairing (Perkenalan)"
        read -p "Masukkan IP:Port (contoh 192.168.1.5:45678): " ip_port
        read -p "Masukkan Pairing Code: " p_code
        adb pair "$ip_port" "$p_code"
        ;;
    "/connect")
        echo "🔌 MODE: Connecting (Menyambung Saraf)"
        read -p "Masukkan IP:Port dari Wireless Debugging: " ip_port
        adb connect "$ip_port"
        adb devices
        ;;
    "/status")
        adb devices
        ;;
    *)
        echo "Gunakan: mr /adb-bridge [/pair | /connect | /status]"
        ;;
esac
