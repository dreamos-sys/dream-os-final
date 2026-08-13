# Security Incident Report — 13 Agustus 2026

## Summary
Salt values untuk encryption module (`js/config.js`) sempat ter-commit ke git history 
di commit 4144226 sebelum ditambahkan ke .gitignore.

## Timeline
- **15:18 WIB**: Initial commit with salts (accidentally committed)
- **15:24 WIB**: Issue detected → salts rotated immediately
- **15:25 WIB**: New salts generated locally (not committed)
- **15:26 WIB**: .gitignore verified working

## Impact Assessment
### Salt yang Bocor (TIDAK DIPAKAI LAGI):
- aesSalt: 205c8dc4f2951a66c4f75d9476f88681
- bankSalt: 681e4133f183b6583c15d27023830f8b
- secureStoreSalt: 534bb69311be17253f4148cf888c29b0

### Salt Baru (Production Active):
- Locally generated, not in git history
- Different from compromised salts

## Risk Analysis
- **Encrypted data lama** (localStorage user) masih bisa di-decrypt 
  pakai salt lama → **NEEDS MIGRATION**
- **New encrypted data** aman (pakai salt baru)
- Git history tidak bisa di-force-rewrite (branch protected)

## Mitigation Steps
1. ✅ Salt rotated (done)
2. ✅ New config.js created locally with fresh salts
3. ⏳ Migration: users need to re-authenticate to re-encrypt with new salts
4. ⏳ Add migration helper to detect stale encrypted data

## User Impact
- Users dengan encrypted data lama perlu login ulang
- Data sensitif lama perlu di-re-encrypt otomatis
- No data loss, only re-encryption needed
