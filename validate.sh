#!/bin/bash
# ==============================================================================
# 🕌 DREAM OS • PRE-PUSH VALIDATOR v1.2 (Global Bridge + Anti-Zonk)
# Prinsip: Karpathy × Addy × Dream OS — Reliability First
# ==============================================================================
set -e

echo -e "\033[0;36m============================================"
echo -e "   🕌 DREAM OS • VALIDATOR v1.2"
echo -e "============================================\033[0m"

# 1. File Size Check (<10KB per module)
echo -e "\n\033[1;33m📦 [1/5] Checking module sizes...\033[0m"
for f in js/*.js; do
    SIZE=$(wc -c < "$f")
    if [ "$SIZE" -gt 10240 ]; then
        echo -e "   \033[0;31m❌ $f too large (${SIZE} bytes). Max 10KB.\033[0m"
        exit 1
    fi
done
echo -e "   \033[0;32m✅ All modules <10KB\033[0m"

# 2. Critical Function Global Exposure Check
echo -e "\n\033[1;33m🌉 [2/5] Checking Global Bridge exposure...\033[0m"
CRITICAL_FUNCS=("handleLogin" "togglePassword" "openCommandCenter" "showMain" "closeGhost" "handleLogout")
MISSING=0
for func in "${CRITICAL_FUNCS[@]}"; do
    # Check if function is exposed to window OR defined inline in index.html
    if ! grep -rq "window\.$func\s*=" js/ && ! grep -rq "function $func" index.html; then
        echo -e "   \033[0;31m⚠️  $func NOT exposed to window or inline\033[0m"
        MISSING=$((MISSING+1))
    else
        echo -e "   \033[0;32m✅ $func exposed\033[0m"
    fi
done
if [ $MISSING -gt 0 ]; then
    echo -e "\n\033[0;31m❌ $MISSING critical function(s) not exposed. Fix before push!\033[0m"
    exit 1
fi

# 3. DOM Safety Pattern Check (null checks)
echo -e "\n\033[1;33m🔍 [3/5] Checking DOM safety patterns...\033[0m"
UNSAFE=$(grep -r "document\.getElementById" js/ --include="*.js" | grep -v "?\." | grep -v "if.*null" | wc -l)
if [ "$UNSAFE" -gt 0 ]; then
    echo -e "   \033[0;33m⚠️  Found $UNSAFE getElementById without null check. Review manually.\033[0m"
else
    echo -e "   \033[0;32m✅ DOM safety patterns OK\033[0m"
fi

# 4. Event Delegation Hint (for dynamic content)
echo -e "\n\033[1;33m🎯 [4/5] Checking event delegation usage...\033[0m"
if grep -rq "addEventListener.*click.*e\.target" js/; then
    echo -e "   \033[0;32m✅ Event delegation detected\033[0m"
else
    echo -e "   \033[0;33mℹ️  Consider event delegation for dynamic elements\033[0m"
fi

# 5. Secret Scan
echo -e "\n\033[1;33m🔐 [5/5] Scanning for secrets...\033[0m"
if grep -rE "(API_KEY|PASSWORD|SECRET|TOKEN)" js/ --exclude='*.md' 2>/dev/null | grep -v -i "placeholder\|example"; then
    echo -e "   \033[0;31m❌ Potential secret found!\033[0m"
    exit 1
fi
echo -e "   \033[0;32m✅ No hardcoded secrets\033[0m"

echo -e "\n\033[0;32m============================================"
echo -e "   🎉 ALL CHECKS PASSED! READY TO DEPLOY."
echo -e "============================================\033[0m"
echo -e "\033[0;36m⚠️  REMINDER: Test di Incognito + Console verify sebelum push!\033[0m\n"
