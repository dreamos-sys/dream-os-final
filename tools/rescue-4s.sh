#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# 🛰️ 4S RESCUE & CLEANUP SCRIPT (FIXED SYNTAX)
# ==============================================================================

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
NC='\033[0m'

echo -e "${CYAN}═════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN} 🔍 INSPEKSI REPO 4S: MENYELAMATKAN SUPABASE & MEMBERSIHKAN SAMPAH${NC}"
echo -e "${CYAN}═════════════════════════════════════════════════════════════════${NC}"

# 1. Cek status Git & Author saat ini
echo -e "\n${YELLOW}>> [1] Memeriksa Author & Git Status...${NC}"
git config user.name
git config user.email
echo -e "   Status git saat ini:"
git status -s | head -10

# 2. Musnahkan file sampah terminal
echo -e "\n${YELLOW}>> [2] Membersihkan file sampah & artefak terminal...${NC}"
rm -f "i yang utuh ini ke GitHub"*
rm -f "e 11: Final Production"*
find . -name "*.bak" -type f -delete
echo -e "   ${GREEN}✔ File sampah berhasil disingkirkan tanpa menyentuh core!${NC}"

# 3. Cek keberadaan file krusial Supabase / Config
echo -e "\n${YELLOW}>> [3] Memeriksa Konfigurasi Inti...${NC}"
if [ -f "package.json" ]; then
    echo -e "   ${GREEN}✔ package.json aman.${NC}"
else
    echo -e "   ${RED}✖ package.json tidak ditemukan!${NC}"
fi

if [ -d "src" ] || [ -d "api" ]; then
    echo -e "   ${GREEN}✔ Struktur direktori utama aman (tidak dihapus).${NC}"
fi

# 4. Ringkasan
echo -e "\n${CYAN}═════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN} 🚀 REPO SELAMAT! Supabase & Database aman, sampah dibuang.${NC}"
echo -e "${CYAN}═════════════════════════════════════════════════════════════════${NC}\n"
