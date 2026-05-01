#!/bin/bash
# --- DREAM OS SYSTEM DIAGNOSTIC v2.1 ---
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🩺 [DIAGNOSTIC] Memulai pengecekan integritas Bash..."
echo "------------------------------------------------"

# 1. Cek Folder Utama
if [ -d "$HOME/dream-live" ]; then
    echo -e "📂 Folder dream-live: ${GREEN}OK${NC}"
else
    echo -e "📂 Folder dream-live: ${RED}MISSING${NC}"
fi

# 2. Cek Master Module v3.0
if [ -f "$HOME/dream-live/modules/commandcenter/module.js" ]; then
    echo -e "📑 Master Module v3.0: ${GREEN}READY${NC}"
else
    echo -e "📑 Master Module v3.0: ${RED}NOT FOUND${NC} (Lakukan 'micro' dulu!)"
fi

# 3. Cek Script-Script Sakti
scripts=("m-deploy.sh" "m-push.sh" "m-report-score.sh" "modular_brain.sh")
for s in "${scripts[@]}"; do
    if [ -x "$HOME/dream-live/scripts/$s" ]; then
        echo -e "📜 Script $s: ${GREEN}EXECUTABLE${NC}"
    else
        echo -e "📜 Script $s: ${RED}ERROR/NOT FOUND${NC}"
    fi
done

# 4. Cek Alias di .bashrc
if grep -q "alias m-deploy" ~/.bashrc; then
    echo -e "🔗 Alias m-deploy: ${GREEN}ACTIVE${NC}"
else
    echo -e "🔗 Alias m-deploy: ${RED}INACTIVE${NC} (Gunakan 'source ~/.bashrc')"
fi

echo "------------------------------------------------"
echo "✅ Pengecekan Selesai. Bi idznillah, sistem stabil!"
