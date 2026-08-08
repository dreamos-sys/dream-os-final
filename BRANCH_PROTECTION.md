# 🔐 Branch Protection Setup (Manual, 5 menit)

1. Buka: https://github.com/dreamos-sys/dream-os-final/settings/branches
2. "Add branch protection rule" → pattern: `gh-pages`
3. ✅ Require status checks → pilih "Run Vitest Tests"
4. ✅ Require branches to be up to date
5. Save

**Result:** Tidak bisa merge kalau test gagal = "check engine light"! 🏆
