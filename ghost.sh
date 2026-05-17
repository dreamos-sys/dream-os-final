#!/data/data/com.termux/files/usr/bin/bash

# Dream OS • Ghost Intelligence Script v1.0
# Developed for Sultan Erwin

# Warna biar Sultan nggak pusing
G='\033[0;32m'
R='\033[0;31m'
B='\033[0;34m'
Y='\033[1;33m'
NC='\033[0m'

# Folder Hasil Audit
LOG_DIR="$HOME/dream-os-audit"
mkdir -p $LOG_DIR

clear
echo -e "${Y}=========================================="
echo -e "   👻 GHOST INTELLIGENCE SYSTEM v1.0   "
echo -e "      DEEP ANALYSIS & OSINT HUB       "
echo -e "==========================================${NC}"

echo -e "${B}[1]${NC} Network Audit (Nmap Deep Scan)"
echo -e "${B}[2]${NC} Social Media OSINT (Sherlock)"
echo -e "${B}[3]${NC} Traffic Analysis (Tshark Capture)"
echo -e "${B}[4]${NC} System Cleanup (Clean Cache)"
echo -e "${B}[5]${NC} Check Audit Logs"
echo -e "${B}[6]${NC} Exit"
echo ""
read -p "Sultan Erwin, pilih menu [1-6]: " choice

case $choice in
    1)
        read -p "Masukkan IP/Domain target: " target
        echo -e "${G}🔍 Scanning $target...${NC}"
        nmap -sV -A -T4 $target -oN "$LOG_DIR/nmap_$target.txt"
        echo -e "${Y}✅ Scan selesai. Log disimpan di folder audit.${NC}"
        ;;
    2)
        read -p "Masukkan Username target: " username
        echo -e "${G}👤 Searching social media for $username...${NC}"
        sherlock $username --timeout 5 --output "$LOG_DIR/sherlock_$username.txt"
        ;;
    3)
        echo -e "${G}🦈 Starting Tshark Capture (10 packets)...${NC}"
        tshark -c 10 -w "$LOG_DIR/traffic_$(date +%F_%T).pcap"
        echo -e "${Y}✅ Traffic captured!${NC}"
        ;;
    4)
        echo -e "${R}🗑️ Cleaning Termux Junk...${NC}"
        apt autoremove -y && apt clean
        find . -type f -name "*.tmp" -delete
        echo -e "${G}✨ System Cleaned!${NC}"
        ;;
    5)
        echo -e "${Y}📋 Daftar Log Audit Sultan:${NC}"
        ls -lh $LOG_DIR
        ;;
    6)
        echo "Exiting Ghost Mode. Stay Stealthy!"
        exit 0
        ;;
    *)
        echo -e "${R}❌ Pilihan salah, Sultan!${NC}"
        ;;
esac
