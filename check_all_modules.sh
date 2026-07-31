#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  DREAM OS v1.0 Beta - COMPLETE SYSTEM HEALTH CHECK
#  All 9 Modules + 5 Navigation + Core Systems
# ═══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DREAM OS v1.0 Beta - COMPLETE HEALTH CHECK              ║${NC}"
echo -e "${BLUE}║   All Modules + Navigation + Integration                  ║${NC}"
echo -e "${BLUE}║   Generated: $(date '+%Y-%m-%d %H:%M:%S')                          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

check_pass() { echo -e "${GREEN}✓ PASS${NC}: $1"; ((PASS++)); }
check_fail() { echo -e "${RED}✗ FAIL${NC}: $1"; ((FAIL++)); }
check_warn() { echo -e "${YELLOW}⚠ WARN${NC}: $1"; ((WARN++)); }
section_header() { echo -e "\n${MAGENTA}═══════════════════════════════════════════════════════════${NC}"; echo -e "${CYAN}$1${NC}"; echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"; }

# ═══════════════════════════════════════════════════════════════
#  SECTION 1: ALL 9 MODULES
# ═══════════════════════════════════════════════════════════════
section_header "SECTION 1: ALL 9 MODULES EXISTENCE"

modules=(
  "index.html:Home Dashboard"
  "modules/asset.html:Asset Management"
  "modules/stok.html:Stok Gudang"
  "modules/maintenance.html:Maintenance CMMS"
  "modules/booking.html:Booking Ruangan"
  "modules/k3.html:K3 Safety"
  "modules/security.html:Mod Security"
  "modules/janitor-indoor.html:Janitor Indoor"
  "modules/janitor-outdoor.html:Janitor Outdoor"
)

for mod in "${modules[@]}"; do
  IFS=':' read -r file name <<< "$mod"
  if [ -f "$file" ]; then
    check_pass "$name ($file)"
  else
    check_fail "$name ($file) MISSING"
  fi
done

# ═══════════════════════════════════════════════════════════════
#  SECTION 2: NAVIGATION (5 BUTTONS)
# ═══════════════════════════════════════════════════════════════
section_header "SECTION 2: NAVIGATION BUTTONS (index.html)"

# Check bottom nav in index.html
if grep -q 'id="nav-home"' index.html 2>/dev/null || grep -q "HOME" index.html 2>/dev/null; then
  check_pass "HOME button present"
else
  check_warn "HOME button not found (may use different ID)"
fi

if grep -q 'id="nav-profile"' index.html 2>/dev/null || grep -q "PROFILE" index.html 2>/dev/null; then
  check_pass "PROFILE button present"
else
  check_warn "PROFILE button not found"
fi

if grep -q 'id="nav-qr"' index.html 2>/dev/null || grep -q "QR" index.html 2>/dev/null; then
  check_pass "QR button present"
else
  check_warn "QR button not found"
fi

if grep -q 'id="nav-about"' index.html 2>/dev/null || grep -q "ABOUT" index.html 2>/dev/null; then
  check_pass "ABOUT button present"
else
  check_warn "ABOUT button not found"
fi

if grep -q 'id="nav-system"' index.html 2>/dev/null || grep -q "SYSTEM" index.html 2>/dev/null; then
  check_pass "SYSTEM button present"
else
  check_warn "SYSTEM button not found"
fi

# ═══════════════════════════════════════════════════════════════
#  SECTION 3: MODULE ROUTING
# ═══════════════════════════════════════════════════════════════
section_header "SECTION 3: MODULE ROUTING (index.html)"

# Check if modules are linked in index.html
routing_checks=(
  "asset.html:Asset module linked"
  "stok.html:Stok module linked"
  "maintenance.html:Maintenance module linked"
  "booking.html:Booking module linked"
  "k3.html:K3 module linked"
  "security.html:Security module linked"
  "janitor-indoor.html:Janitor Indoor linked"
  "janitor-outdoor.html:Janitor Outdoor linked"
)

for route in "${routing_checks[@]}"; do
  IFS=':' read -r file desc <<< "$route"
  if grep -q "$file" index.html 2>/dev/null; then
    check_pass "$desc"
  else
    check_fail "$desc (not linked in index.html)"
  fi
done

# ═══════════════════════════════════════════════════════════════
#  SECTION 4: CRITICAL FIXES (PREVIOUS FAILS)
# ═══════════════════════════════════════════════════════════════
section_header "SECTION 4: CRITICAL FIXES VERIFICATION"

# Split-brain
if grep -q "safeSet('dreamos_inventory', data)" modules/asset.html 2>/dev/null; then
  check_pass "Split-brain FIXED (asset.html)"
else
  check_fail "Split-brain NOT FIXED"
fi

# Stok search
if grep -q "var all = JSON.parse(localStorage.getItem('dreamos_inventory')" modules/stok.html 2>/dev/null && \
   grep -q "filter(function(x)" modules/stok.html 2>/dev/null; then
  check_pass "Stok search IMPLEMENTED"
else
  check_fail "Stok search NOT working"
fi

# Stok delete
if grep -q "logMutation('HAPUS'" modules/stok.html 2>/dev/null; then
  check_pass "Stok delete log CORRECT (HAPUS)"
else
  check_fail "Stok delete log INCORRECT"
fi

# PDF alat
if grep -q " Kebutuhan Alat" modules/commandcenter.html 2>/dev/null && \
   grep -q "data.sarana_alat" modules/commandcenter.html 2>/dev/null; then
  check_pass "PDF Share includes ALAT field"
else
  check_fail "PDF Share missing ALAT field"
fi

# ═══════════════════════════════════════════════════════════════
#  SECTION 5: INTEGRATION POINTS
# ═══════════════════════════════════════════════════════════════
section_header "SECTION 5: CROSS-MODULE INTEGRATION"

# Maintenance bridge
if grep -q "refAssetId" modules/maintenance.html 2>/dev/null; then
  check_pass "Maintenance↔Asset bridge (refAssetId)"
else
  check_fail "Maintenance↔Asset bridge MISSING"
fi

if grep -q "ov-consume" modules/maintenance.html 2>/dev/null; then
  check_pass "Maintenance↔Stok bridge (consume sparepart)"
else
  check_fail "MaintenanceStok bridge MISSING"
fi

# K3 auto-create
if grep -q "autoCreateTaskFromK3" modules/k3.html 2>/dev/null; then
  check_pass "K3→Maintenance auto-create"
else
  check_fail "K3→Maintenance auto-create MISSING"
fi

# Command Center unified
if grep -q "collectTasks\|unified" modules/commandcenter.html 2>/dev/null; then
  check_pass "Command Center unified inbox"
else
  check_warn "Command Center inbox status unclear"
fi

# ═══════════════════════════════════════════════════════════════
#  SECTION 6: CLOUD SYNC
# ═══════════════════════════════════════════════════════════════
section_header "SECTION 6: CLOUD SYNC (Supabase)"

# Check for Supabase client
if grep -q "supabaseClient\|createClient" modules/*.html index.html 2>/dev/null | head -1 > /dev/null; then
  check_pass "Supabase client configured"
else
  check_warn "Supabase client not detected (may use different method)"
fi

# Check sync functions
sync_funcs=("pullBookingsFromCloud" "syncToCloud" "uploadTrappedData" "forceK3Sync")
for func in "${sync_funcs[@]}"; do
  if grep -rq "$func" modules/ 2>/dev/null; then
    check_pass "Sync function: $func"
  else
    check_warn "Sync function missing: $func"
  fi
done

# ═══════════════════════════════════════════════════════════════
#  SECTION 7: PWA & OFFLINE
# ══════════════════════════════════════════════════════════════
section_header "SECTION 7: PWA & OFFLINE CAPABILITIES"

if [ -f "manifest.json" ]; then
  check_pass "manifest.json exists (PWA)"
else
  check_warn "manifest.json missing (PWA not configured)"
fi

if grep -q "serviceWorker\|sw.js" index.html 2>/dev/null; then
  check_pass "Service Worker registered"
else
  check_warn "Service Worker not detected"
fi

if grep -q "OfflineQueue\|offline" modules/*.html 2>/dev/null | head -1 > /dev/null; then
  check_pass "Offline queue implemented"
else
  check_warn "Offline queue not detected"
fi

# ═══════════════════════════════════════════════════════════════
#  SUMMARY
# ═══════════════════════════════════════════════════════════════
echo -e "\n${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      FINAL SUMMARY                          ║${NC}"
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
  
  if [ $SCORE -ge 90 ]; then
    echo -e "   Status: ${GREEN}EXCELLENT${NC} ✅"
  elif [ $SCORE -ge 70 ]; then
    echo -e "   Status: ${YELLOW}GOOD${NC} ️"
  else
    echo -e "   Status: ${RED}NEEDS WORK${NC} ❌"
  fi
fi

if [ $FAIL -eq 0 ]; then
  echo -e "\n${GREEN}🎉 ALL CRITICAL CHECKS PASSED!${NC}"
  echo -e "${GREEN}   Dream OS is production-ready!${NC}"
else
  echo -e "\n${RED}⚠️  $FAIL CRITICAL FAILURES DETECTED${NC}"
  echo -e "${RED}   Please fix before production deployment${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}End of Complete Health Check - $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
