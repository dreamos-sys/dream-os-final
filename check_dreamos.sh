#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  DREAM OS v1.0 Beta - SYSTEM HEALTH CHECK
#  Diagnostic Script - Read-Only (Safe to Run)
# ═══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     DREAM OS v1.0 Beta - SYSTEM HEALTH CHECK              ║${NC}"
echo -e "${BLUE}║     Generated: $(date '+%Y-%m-%d %H:%M:%S')                        ║${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Helper function
check_pass() { echo -e "${GREEN}✓ PASS${NC}: $1"; ((PASS++)); }
check_fail() { echo -e "${RED}✗ FAIL${NC}: $1"; ((FAIL++)); }
check_warn() { echo -e "${YELLOW}⚠ WARN${NC}: $1"; ((WARN++)); }

# ═══════════════════════════════════════════════════════════════
#  RONDE 0: FOUNDATION
# ═══════════════════════════════════════════════════════════════
echo -e "${BLUE}[RONDE 0] Foundation Checks${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 1: File existence
echo -e "\n${YELLOW}1. Core Files Existence${NC}"
for file in modules/asset.html modules/stok.html modules/maintenance.html modules/booking.html modules/commandcenter.html modules/k3.html index.html; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file MISSING"
    fi
done

# Check 2: Git status
echo -e "\n${YELLOW}2. Git Repository Status${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
    check_pass "Git repository initialized"
    BRANCH=$(git branch --show-current)
    echo -e "   Current branch: ${BLUE}$BRANCH${NC}"
    LAST_COMMIT=$(git log -1 --pretty=format:"%h - %s" 2>/dev/null)
    echo -e "   Last commit: ${BLUE}$LAST_COMMIT${NC}"
else
    check_fail "Not a git repository"
fi

# ═══════════════════════════════════════════════════════════════
#  RONDE 1: ASSET & STOK (A FIX)
# ══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}[RONDE 1] Asset & Stok Fixes (Critical - A)${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 3: Split-brain fix in asset.html
echo -e "\n${YELLOW}3. Split-Brain Fix (asset.html - Gudang tab)${NC}"
if grep -q "safeSet('dreamos_inventory', data)" modules/asset.html 2>/dev/null; then
    check_pass "Gudang writes to dreamos_inventory (split-brain FIXED)"
else
    if grep -q "safeSet('dreamos_gudang', data)" modules/asset.html 2>/dev/null; then
        check_fail "Gudang STILL writes to dreamos_gudang (split-brain NOT FIXED)"
    else
        check_warn "Could not determine Gudang storage key"
    fi
fi

# Check 4: Stok search functionality
echo -e "\n${YELLOW}4. Stok Search Functionality${NC}"
if grep -q "var all = JSON.parse(localStorage.getItem('dreamos_inventory')" modules/stok.html 2>/dev/null && \
   grep -q "filter(function(x)" modules/stok.html 2>/dev/null; then
    check_pass "Stok search implemented"
else
    check_fail "Stok search NOT implemented or broken"
fi

# Check 5: Stok delete fix
echo -e "\n${YELLOW}5. Stok Delete Fix${NC}"
if grep -q "logMutation('HAPUS'" modules/stok.html 2>/dev/null; then
    check_pass "Stok delete log fixed (HAPUS not MASUK)"
else
    check_fail "Stok delete log may still be incorrect"
fi

# Check 6: Unified storage keys
echo -e "\n${YELLOW}6. Storage Key Consistency${NC}"
STOK_INV=$(grep -c "dreamos_inventory" modules/stok.html 2>/dev/null || echo 0)
ASSET_INV=$(grep -c "dreamos_inventory" modules/asset.html 2>/dev/null || echo 0)
if [ "$STOK_INV" -gt 0 ] && [ "$ASSET_INV" -gt 0 ]; then
    check_pass "Both modules reference dreamos_inventory"
else
    check_warn "Storage key usage: stok=$STOK_INV, asset=$ASSET_INV"
fi

# ══════════════════════════════════════════════════════════════
#  RONDE 2: PDF BOOKING FIX
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}[RONDE 2] PDF Booking - Alat Field${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 7: PDF shareDirectPDF alat field
echo -e "\n${YELLOW}7. Share PDF (shareDirectPDF) - Alat Display${NC}"
if grep -q "🔌 Kebutuhan Alat" modules/commandcenter.html 2>/dev/null; then
    if grep -q "data.sarana_alat" modules/commandcenter.html 2>/dev/null; then
        check_pass "Share PDF includes sarana_alat field"
    else
        check_warn "PDF has label but may not render data.sarana_alat"
    fi
else
    check_fail "Share PDF missing alat field"
fi

# Check 8: cetakDokumen alat field
echo -e "\n${YELLOW}8. Print PDF (cetakDokumen) - Alat Display${NC}"
if grep -A5 "class=\"label\">🔌 Kebutuhan Alat" modules/commandcenter.html 2>/dev/null | grep -q "sarana_alat"; then
    check_pass "Print PDF includes sarana_alat field"
else
    check_warn "Print PDF may be missing alat field (non-critical)"
fi

# ═══════════════════════════════════════════════════════════════
#  RONDE 3: MAINTENANCE BRIDGE
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}[RONDE 3] Maintenance Bridge (Aset↔Perawatan↔Stok)${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 9: refAssetId field
echo -e "\n${YELLOW}9. Asset Reference Link (refAssetId)${NC}"
if grep -q "refAssetId" modules/maintenance.html 2>/dev/null; then
    check_pass "Maintenance has refAssetId for linking to strategic assets"
else
    check_fail "Maintenance missing refAssetId"
fi

# Check 10: Bridge modals
echo -e "\n${YELLOW}10. Bridge Modals (Equipment + Consume)${NC}"
if grep -q "ov-eq" modules/maintenance.html 2>/dev/null && \
   grep -q "ov-consume" modules/maintenance.html 2>/dev/null; then
    check_pass "Bridge modals present (add equipment + consume sparepart)"
else
    check_fail "Bridge modals missing"
fi

# Check 11: Asset read-only references
echo -e "\n${YELLOW}11. Read-Only Asset/Stok References${NC}"
if grep -q "K_ASSET='dreamos_assets'" modules/maintenance.html 2>/dev/null && \
   grep -q "K_INV='dreamos_inventory'" modules/maintenance.html 2>/dev/null; then
    check_pass "Maintenance reads from Aset & Stok modules"
else
    check_warn "Maintenance may not read from Aset/Stok"
fi

# ═══════════════════════════════════════════════════════════════
#  RONDE 4: BOOKING MODULE
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}[RONDE 4] Booking Module Health${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 12: Alat counter system
echo -e "\n${YELLOW}12. Alat Counter System${NC}"
if grep -q "alatQuantities" modules/booking.html 2>/dev/null && \
   grep -q "increaseAlat\|decreaseAlat" modules/booking.html 2>/dev/null; then
    check_pass "Alat counter system present"
else
    check_fail "Alat counter system missing"
fi

# Check 13: sarana_alat save
echo -e "\n${YELLOW}13. Save sarana_alat to Booking${NC}"
if grep -q "sarana_alat:saranaStr" modules/booking.html 2>/dev/null; then
    check_pass "Booking saves sarana_alat field"
else
    check_fail "Booking does not save sarana_alat"
fi

# ═══════════════════════════════════════════════════════════════
#  RONDE 5: K3 MODULE
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}[RONDE 5] K3 Module Health${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 14: Auto-create task
echo -e "\n${YELLOW}14. Auto-Create Task from K3${NC}"
if grep -q "autoCreateTaskFromK3" modules/k3.html 2>/dev/null; then
    check_pass "K3 auto-creates tasks in Maintenance"
else
    check_fail "K3 missing auto-create task function"
fi

# Check 15: Multi-device sync
echo -e "\n${YELLOW}15. K3 Multi-Device Sync${NC}"
if grep -q "uploadTrappedData" modules/k3.html 2>/dev/null && \
   grep -q "forceK3Sync" modules/k3.html 2>/dev/null; then
    check_pass "K3 has push/pull sync functions"
else
    check_warn "K3 sync functions may be incomplete"
fi

# ═══════════════════════════════════════════════════════════════
#  RONDE 6: COMMAND CENTER
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}[RONDE 6] Command Center Health${NC}"
echo "─────────────────────────────────────────────────────────────"

# Check 16: Unified inbox
echo -e "\n${YELLOW}16. Unified Task Inbox${NC}"
if grep -q "Unified Task Inbox\|unified-inbox" modules/commandcenter.html 2>/dev/null; then
    check_pass "Command Center has unified inbox"
else
    check_warn "Unified inbox status unclear"
fi

# ═══════════════════════════════════════════════════════════════
#  SUMMARY
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      SUMMARY                                ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   ${GREEN}PASS${NC}: $PASS"
echo -e "   ${RED}FAIL${NC}: $FAIL"
echo -e "   ${YELLOW}WARN${NC}: $WARN"
echo ""

TOTAL=$((PASS + FAIL))
if [ $TOTAL -gt 0 ]; then
    SCORE=$((PASS * 100 / TOTAL))
    echo -e "   Health Score: ${BLUE}${SCORE}%${NC}"
fi

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL CHECKS PASSED! Dream OS is healthy.${NC}"
elif [ $FAIL -eq 0 ]; then
    echo -e "\n${YELLOW}⚠️  Some warnings but no critical failures.${NC}"
else
    echo -e "\n${RED}️  CRITICAL FAILURES DETECTED. Please fix before deployment.${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}End of Health Check - $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
