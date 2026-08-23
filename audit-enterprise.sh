#!/system/bin/env bash
set -u

PASS=0; WARN=0; FAIL=0

check() {
  local status="$1" msg="$2"
  case "$status" in
    PASS) echo "  ✅ PASS | $msg"; PASS=$((PASS+1));;
    WARN) echo "  ⚠️  WARN | $msg"; WARN=$((WARN+1));;
    FAIL) echo "  ❌ FAIL | $msg"; FAIL=$((FAIL+1));;
  esac
}

echo "═══ [1] KEAMANAN ═══"
grep -rn "user-scalable=no" --include="*.html" --exclude-dir=backups . >/dev/null 2>&1 && check FAIL "Ditemukan user-scalable=no" || check PASS "Tidak ada user-scalable=no"
INLINE_HANDLERS=$(grep -rn "on[a-z]*=" --include="*.html" --exclude-dir=backups . | wc -l)
[ "$INLINE_HANDLERS" -gt 50 ] && check FAIL "Banyak inline event handler ($INLINE_HANDLERS)" || check PASS "Inline handler terkendali"
INNERHTML_COUNT=$(grep -rn "innerHTML" --include="*.html" --exclude-dir=backups . | wc -l)
SANITIZE_COUNT=$(grep -rn "DOMPurify.sanitize\|DreamOSSecurity.esc" --include="*.html" --include="*.js" --exclude-dir=backups . | wc -l)
if [ "$INNERHTML_COUNT" -gt 0 ] && [ "$SANITIZE_COUNT" -eq 0 ]; then check FAIL "innerHTML tanpa sanitasi"; elif [ "$INNERHTML_COUNT" -gt 0 ] && [ "$SANITIZE_COUNT" -lt "$INNERHTML_COUNT" ]; then check WARN "Sanitasi $SANITIZE_COUNT dari $INNERHTML_COUNT innerHTML"; else check PASS "Sanitasi innerHTML memadai"; fi
grep -n "Content-Security-Policy" index.html >/dev/null && check PASS "CSP meta ada" || check FAIL "CSP meta tidak ada"
grep -n "X-Frame-Options" index.html >/dev/null && check PASS "X-Frame-Options ada" || check FAIL "X-Frame-Options tidak ada"

echo "═══ [2] AKSESIBILITAS ═══"
grep -n "skip-link" index.html >/dev/null && check PASS "Skip link ada" || check FAIL "Skip link tidak ada"
ARIA_COUNT=$(grep -rn "aria-label=" --include="*.html" --exclude-dir=backups . | wc -l)
[ "$ARIA_COUNT" -gt 10 ] && check PASS "ARIA label $ARIA_COUNT" || check WARN "ARIA label sedikit"
CSS_MIN_HEIGHT=$(grep -c "min-height: 48px\|min-height:48px" css/dashboard.css)
[ "$CSS_MIN_HEIGHT" -gt 0 ] && check PASS "Touch target 48px ada" || check FAIL "Touch target 48px tidak ada"
grep -n "prefers-reduced-motion" css/dashboard.css >/dev/null && check PASS "Reduced motion didukung" || check FAIL "Reduced motion tidak ada"
grep -n "focus-visible" css/dashboard.css >/dev/null && check PASS "Focus-visible styling ada" || check FAIL "Focus-visible tidak ada"

echo "═══ [3] PERFORMANCE ═══"
SIZE_INDEX=$(wc -c < index.html)
[ "$SIZE_INDEX" -gt 200000 ] && check FAIL "index.html $((SIZE_INDEX/1024))KB terlalu besar" || check PASS "index.html $((SIZE_INDEX/1024))KB wajar"
SIZE_CSS=$(wc -c < css/dashboard.css)
[ "$SIZE_CSS" -gt 100000 ] && check WARN "dashboard.css $((SIZE_CSS/1024))KB besar" || check PASS "CSS wajar"
INTERVAL_COUNT=$(grep -rn "setInterval" --include="*.html" --include="*.js" --exclude-dir=backups . | wc -l)
[ "$INTERVAL_COUNT" -gt 10 ] && check WARN "Banyak setInterval ($INTERVAL_COUNT)" || check PASS "Interval terkendali"
LAZY_COUNT=$(grep -rn "defer\|async" index.html | wc -l)
[ "$LAZY_COUNT" -gt 5 ] && check PASS "Script async/defer $LAZY_COUNT" || check WARN "Kurang async/defer"

echo "═══ [4] PWA / OFFLINE ═══"
grep -n "manifest.json" index.html >/dev/null && check PASS "Manifest ada" || check FAIL "Manifest tidak ada"
grep -n "serviceWorker.register" index.html >/dev/null && check PASS "Service worker register ada" || check FAIL "SW tidak ada"
[ -f offline.html ] && check PASS "offline.html ada" || check WARN "offline.html tidak ada"

echo "═══ [5] RELIABILITAS ═══"
grep -n "sentry" index.html >/dev/null && check PASS "Sentry aktif" || check FAIL "Tidak ada error monitoring"
grep -n "safeStorageSet" index.html >/dev/null && check PASS "safeStorageSet ada" || check WARN "safeStorageSet tidak ada"
grep -n "Element.prototype.closest" index.html >/dev/null && check PASS "Null safety ada" || check WARN "Null safety tidak ada"

echo "═══ [6] CODE QUALITY ═══"
CONSOLE_COUNT=$(grep -rn "console.log" --include="*.html" --include="*.js" --exclude-dir=backups . | wc -l)
[ "$CONSOLE_COUNT" -gt 20 ] && check WARN "Banyak console.log ($CONSOLE_COUNT)" || check PASS "console.log terkendali"
DUPLICATE_CSS=$(grep -c "MODULE SHELL ULTIMATE STABILITY" css/dashboard.css)
[ "$DUPLICATE_CSS" -gt 1 ] && check FAIL "Duplikasi blok CSS MODULE SHELL ($DUPLICATE_CSS kali)" || check PASS "Tidak ada duplikasi blok besar CSS"
[ -f README.md ] && check PASS "README.md ada" || check WARN "README.md tidak ada"

echo ""
echo "═══════════════════════════"
echo "  📊 HASIL AUDIT"
echo "═══════════════════════════"
echo "  ✅ PASS: $PASS"
echo "  ⚠️  WARN: $WARN"
echo "  ❌ FAIL: $FAIL"
if [ "$FAIL" -eq 0 ] && [ "$WARN" -le 5 ]; then echo "  🟢 ENTERPRISE READY"; elif [ "$FAIL" -eq 0 ]; then echo "  🟡 PRODUCTION READY (dengan catatan)"; else echo "  🔴 PERLU PERBAIKAN"; fi
echo "═══════════════════════════"
