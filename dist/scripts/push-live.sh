#!/bin/bash
# =================================================================
# 🚀 Dream OS: Push-Live Script (Cloud-Build Workflow) - FIXED
# Philosophy: Zero Cost Wisdom, Termux-First, Bi Idznillah.
# =================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

TIMESTAMP=$(date +"%H:%M:%S")

echo ""
echo "📦 DREAM OS DEPLOY MANAGER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 2. AUTOMATED COMMIT MESSAGE
if [ -z "$1" ]; then
    COMMIT_MSG="🚀 Dream OS Auto-Update v14 [$TIMESTAMP]"
    echo -e "📝 Using auto-message: ${BLUE}$COMMIT_MSG${NC}"
else
    COMMIT_MSG="$1 [$TIMESTAMP]"
    echo -e "📝 Using custom message: ${BLUE}$COMMIT_MSG${NC}"
fi

# 3. CHECK SYNC & CHANGES
echo -e "\n🔍 Step 1: Checking local status..."
GIT_STATUS=$(git status --porcelain)

if [ -z "$GIT_STATUS" ]; then
    echo -e "✅ ${GREEN}Working directory is clean. Nothing to commit!${NC}"
    exit 0
fi

echo -e "📊 Changes detected. Preparing upload..."

# 4. PRE-PUSH SYNC CHECK
echo -e "\n☁️ Step 2: Syncing with GitHub (Cloud Check)..."
if git fetch origin > /dev/null 2>&1; then
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main 2>/dev/null)
    if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
        echo -e "⚠️ ${RED}Warning: Local differs from origin!${NC}"
        echo "🔄 Attempting to pull rebase..."
        git pull --rebase origin main
    else
        echo -e "✅ ${GREEN}Synced with GitHub.${NC}"
    fi
else
    echo -e "⚠️ ${RED}Connection issue?${NC}"
    read -p "Continue anyway? (y/n): " CHOICE
    if [ "$CHOICE" != "y" ]; then exit 1; fi
fi

# 5. EXECUTE DEPLOY
echo -e "\n🚀 Step 3: Uploading Source Code..."
git add .
git commit -m "$COMMIT_MSG"

if git push origin main; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "✅ ${GREEN}SUCCESS! SOURCE CODE UPLOADED.${NC}"
    echo -e "👻 ${BLUE}Vercel is building your UI in the Cloud...${NC}"
    echo -e "🌐 ${CYAN}Live: https://dream-os-v21-pro.vercel.app/${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 6. SHALAWAT TRIGGER
    echo ""
    echo "🤲 SUBHANALLAH, ALHAMDULILLAH, ALLAHU AKBAR 🤲"
    echo -e "✨ ${GREEN}Bi idznillah, Dream OS sent to the sky.${NC}"
    echo -e "🔋 Storage saved. RAM preserved.${NC}"
else
    echo -e "❌ ${RED}Push failed.${NC}"
fi
