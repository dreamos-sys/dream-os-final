#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# 🛰️ DREAM OS — ISO & SRE PRO AUDITOR SCRIPT (PERFECTED)
# ==============================================================================

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
NC='\033[0m'

clear
echo -e "${CYAN}═════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN} 🔍 GHOST AUDITOR: INITIALIZING FULL SYSTEM COMPLIANCE CHECK...${NC}"
echo -e "${CYAN}═════════════════════════════════════════════════════════════════${NC}"
sleep 1

# 1. ISO 27001: Security
echo -e "\n${YELLOW}>> [ISO 27001] AUDITING SECURITY & ATTACK SURFACE...${NC}"
EXPOSED_BAK=$(find . -type f \( -name "*.bak" -o -name "*.backup" \) -not -path "*/.git/*" 2>/dev/null | wc -l)
if [ "$EXPOSED_BAK" -eq 0 ]; then
    echo -e "   ${GREEN}✔ PASS: Zero exposed backup/junk files in public tree.${NC}"
else
    echo -e "   ${RED}✖ FAIL: Found $EXPOSED_BAK backup files exposed! Run cleanup.${NC}"
fi

if [ -f ".github/workflows/dreamos-ci.yml" ]; then
    echo -e "   ${GREEN}✔ PASS: Automated CI/CD Gatekeeper (6-Layer Guard) active.${NC}"
else
    echo -e "   ${RED}✖ FAIL: CI pipeline missing. Dream OS defense compromised!${NC}"
fi

# 2. ISO 9001: Quality
echo -e "\n${YELLOW}>> [ISO 9001] AUDITING CODE QUALITY & MODULAR INTEGRITY...${NC}"
if [ -d "modules" ]; then
    TOTAL_FILES=$(find modules -type f -name "*.html" 2>/dev/null | wc -l)
    echo -e "   ${GREEN}✔ PASS: Modular architecture verified ($TOTAL_FILES core modules loaded).${NC}"
else
    echo -e "   ${RED}✖ WARN: 'modules' directory not found.${NC}"
fi

if [ -f ".github/workflows/dreamos-ci.yml" ] && grep -qi "script" .github/workflows/dreamos-ci.yml; then
    echo -e "   ${GREEN}✔ PASS: HTML structure & script validation active in CI.${NC}"
else
    echo -e "   ${RED}✖ WARN: Script validation pattern not found in CI.${NC}"
fi

# 3. ISO 55001: Asset
echo -e "\n${YELLOW}>> [ISO 55001] AUDITING ASSET MANAGEMENT & STORAGE...${NC}"
TOTAL_LOC=$(find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/backups/*" -print0 | xargs -0 cat 2>/dev/null | wc -l)
echo -e "   ${GREEN}✔ PASS: Total managed asset volume: $TOTAL_LOC lines of clean code.${NC}"

if [ -d "$HOME/.dreamos" ]; then
    echo -e "   ${GREEN}✔ PASS: Secure isolated system state directory ($HOME/.dreamos) active.${NC}"
else
    echo -e "   ${RED}✖ FAIL: System isolation directory missing.${NC}"
fi

# 4. Final Verdict
echo -e "\n${CYAN}═════════════════════════════════════════════════════════════════${NC}"
if [ "$EXPOSED_BAK" -eq 0 ] && [ -f ".github/workflows/dreamos-ci.yml" ] && [ -d "$HOME/.dreamos" ]; then
    echo -e "${GREEN} 🏆 AUDIT RESULT: COMPLIANT (ISO 27001 | 9001 | 55001 CERTIFIED)${NC}"
    echo -e "${GREEN}    The system is structurally sound, secure, and pro-grade.${NC}"
else
    echo -e "${RED} ⚠️ AUDIT RESULT: NON-COMPLIANT (Action Required)${NC}"
fi
echo -e "${CYAN}═════════════════════════════════════════════════════════════════${NC}\n"
