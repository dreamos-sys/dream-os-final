#!/bin/bash

# Konfigurasi Warna CLI
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${CYAN}====================================================${NC}"
echo -e "${MAGENTA} 👁️  GHOST AUDITOR ENGINE - DREAM OS ENTERPRISE 👁️ ${NC}"
echo -e "${CYAN}====================================================${NC}"
echo -e "Menjalankan pemindaian standar ISO 27001, 9001 & 55001...\n"

TARGET_DIR="."
REPORT_FILE="dreamos-audit-report.txt"
> $REPORT_FILE

TOTAL_ISSUES=0

log_issue() {
    local TYPE=$1
    local MSG=$2
    local FILE=$3
    local LINE=$4
    echo -e "${TYPE} | File: ${FILE} | Baris: ${LINE} | ${MSG}"
    echo "[${TYPE}] File: ${FILE} (Baris ${LINE}) - ${MSG}" >> $REPORT_FILE
    ((TOTAL_ISSUES++))
}

# 1. MEMORY LEAK DETECTOR (ISO 9001)
echo -e "${YELLOW}[1/4] Memindai Memory Leaks & Zombie Processes...${NC}"
find $TARGET_DIR -type f \( -name "*.html" -o -name "*.js" \) -print0 | while IFS= read -r -d '' file; do
    # Deteksi setInterval yang tidak diregistrasi
    grep -n "setInterval(" "$file" | grep -v "__dreamosRegisterInterval" | while read -r line; do
        lineno=$(echo "$line" | cut -d: -f1)
        log_issue "${RED}LEAK-RISK${NC}" "setInterval ditemukan tanpa wrapper __dreamosRegisterInterval" "$file" "$lineno"
    done
    
    # Deteksi penumpukan event listener tanpa perlindungan flag
    grep -n "window.addEventListener(" "$file" | grep -v "__langListenerAdded\|{passive:\|once:" | while read -r line; do
        lineno=$(echo "$line" | cut -d: -f1)
        log_issue "${YELLOW}PERF-WARN${NC}" "Event listener global berpotensi ganda jika modul di-load ulang" "$file" "$lineno"
    done
done

# 2. DATA LOSS & STORAGE QUOTA BOMB (ISO 27001 / ISO 55001)
echo -e "${YELLOW}[2/4] Memindai Kerentanan Data Loss & Quota...${NC}"
find $TARGET_DIR -type f \( -name "*.html" -o -name "*.js" \) -print0 | while IFS= read -r -d '' file; do
    # Deteksi raw localStorage (tanpa try-catch)
    awk '/localStorage\.setItem/ { print NR, $0 }' "$file" | while read -r lineno content; do
        # Pengecekan sederhana: apakah ada kata 'try' di 3 baris sebelum/sesudahnya (pendekatan basic grep)
        if ! grep -B 3 -A 3 -n "$content" "$file" | grep -q "try {"; then
            log_issue "${RED}DATA-LOSS${NC}" "Raw localStorage.setItem berisiko jebol Quota (5MB), wajib dibungkus try...catch" "$file" "$lineno"
        fi
    done
done

# 3. SECURITY & XSS VULNERABILITIES (ISO 27001)
echo -e "${YELLOW}[3/4] Memindai Celah Keamanan (Stealth Audit)...${NC}"
find $TARGET_DIR -type f \( -name "*.html" -o -name "*.js" \) -print0 | while IFS= read -r -d '' file; do
    # Bahaya injeksi eval()
    grep -n "eval(" "$file" | while read -r line; do
        lineno=$(echo "$line" | cut -d: -f1)
        log_issue "${RED}CRITICAL${NC}" "Fungsi eval() terdeteksi! Celah Remote Code Execution (RCE)" "$file" "$lineno"
    done
    
    # Bahaya innerHTML manipulasi DOM (XSS) - Mengabaikan yang sudah aman
    grep -n "\.innerHTML\s*=" "$file" | grep -v "esc(" | grep -v "replace(" | while read -r line; do
        lineno=$(echo "$line" | cut -d: -f1)
        log_issue "${YELLOW}XSS-RISK${NC}" "Penggunaan innerHTML berpotensi XSS. Pastikan data sudah di-escape (Gunakan esc())" "$file" "$lineno"
    done
done

# 4. ENTERPRISE UX & CODE QUALITY (ISO 9001)
echo -e "${YELLOW}[4/4] Memindai Kualitas UX dan Standar Trinity Architecture...${NC}"
find $TARGET_DIR -type f \( -name "*.html" -o -name "*.js" \) -print0 | while IFS= read -r -d '' file; do
    # Deteksi alert() blocking UI
    grep -n "alert(" "$file" | grep -v "showToast" | while read -r line; do
        lineno=$(echo "$line" | cut -d: -f1)
        log_issue "${MAGENTA}UX-BLOCK${NC}" "Blocking alert() terdeteksi. Gunakan showToast() sesuai standar UI" "$file" "$lineno"
    done
    
    # Deteksi absolute routing Vercel yang bisa bikin error saat offline
    grep -n "href=\"/modules/" "$file" | while read -r line; do
        lineno=$(echo "$line" | cut -d: -f1)
        log_issue "${MAGENTA}ASSET-ERR${NC}" "Absolute path (/) terdeteksi. Gunakan relative path (./ atau ../) untuk PWA" "$file" "$lineno"
    done
done

echo -e "\n${CYAN}====================================================${NC}"
if [ $TOTAL_ISSUES -gt 0 ]; then
    echo -e "${RED}⚠️ AUDIT SELESAI: Ditemukan $TOTAL_ISSUES kerentanan/peringatan!${NC}"
    echo -e "Detail laporan telah disimpan dalam: ${GREEN}$REPORT_FILE${NC}"
else
    echo -e "${GREEN}✅ AUDIT SELESAI: 100% CLEAN! Sistem Dream OS memenuhi standar Code Engineer Enterprise.${NC}"
fi
echo -e "${CYAN}====================================================${NC}"
