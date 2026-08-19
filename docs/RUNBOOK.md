# 🛰️ DREAM OS — OPERATIONAL RUNBOOK
**Versi:** 1.0 · **Klasifikasi:** INTERNAL · **Pemilik:** Mr. M
**Tim:** Pilot Project Dream Team Family
**Stack:** PWA + GitHub Pages + Supabase + Vercel + Sentry

> "Buku panduan saat ada kebakaran". Baca §6 kalau panik. 😅

## 1. ARSITEKTUR SINGKAT
User(PWA) → GitHub Pages(gh-pages) → Supabase(Auth+RLS+EdgeFn)
→ Vercel(api) + Sentry(error). Prinsip: offline-first,
kalau Supabase mati app tetap jalan dari localStorage.

## 2. DEPLOY (normal)
1) cp modules/X.html modules/X.html.bak-$(date +%s)
2) edit + test lokal
3) bump CACHE_VERSION di sw.js
4) git add -A && git commit -m "..." && git push origin gh-pages
5) verifikasi: Incognito + cek Sentry + cek Actions

## 3. ROLLBACK
A) file:  cp modules/X.html.bak-TS modules/X.html → commit → push
B) commit: git revert HEAD --no-edit → push
C) full:  git checkout <COMMIT> -- . → commit → push
⚠️ Selalu bump CACHE_VERSION setelah rollback!

## 4. CACHE & SERVICE WORKER
- CACHE_VERSION (sw.js) = saklar master cache klien
- css/dashboard.css?v=XXX = cache-busting CSS
- User lihat versi lama? → hard-refresh / clear site data

## 5. MONITORING
- Sentry      : error JS realtime        → tiap alert
- GH Actions  : status CI                → tiap push
- Supabase    : DB/RLS/EdgeFn/storage    → harian
- Slide dash  : data operasional live    → harian

## 6. INCIDENT RESPONSE
SEV-1 sistem down (blank/login gagal) → SEKARANG, rollback
SEV-2 fitur inti rusak (K3/booking/sync) → < 1 jam
SEV-3 kosmetik/minor → hari kerja berikutnya

Langkah: DETEKSI → ASESMEN → MITIGASI(rollback §3)
→ KOMUNIKASI → POSTMORTEM(§10)

## 7. PLAYBOOKS
7.1 Sentry spike setelah deploy
    → cek commit terakhir → git revert HEAD → push

7.2 Blank screen / nyangkut versi lama
    → bump CACHE_VERSION → push → umumkan hard-refresh

7.3 Cloud sync gagal (🟠)
    → cek Supabase status + RLS + anon key js/config.js
    → app tetap offline; sync retry otomatis

7.4 Login/auth error
    → cek RLS auth.uid() + js/salt-migration.js

7.5 Storage quota exceeded
    → safeSet auto-trim audit log; bersihkan key dreamos_*

## 8. BACKUP & RESTORE
- Code : git history = source of truth + 96 file .bak-*
- DB   : Supabase → Dashboard → Database → Backups
- User : tabel user_settings (RLS per-user)

## 9. CHECKLIST RUTIN
Harian  : cek Sentry · cek Actions · lihat slide dashboard
Mingguan: review audit log · cek storage quota
          · test restore 1 file dari .bak

## 10. LOG POSTMORTEM
| Tanggal    | Sev | Kejadian                 | Root Cause        | Fix                |
|------------|-----|--------------------------|-------------------|--------------------|
| 2026-08-18 | 3   | reconcileK3 syntax error | try tanpa catch   | commit 175e7bc     |
| 2026-08-18 | 3   | CI merah Path precedence | bug regex extract | commit 661831e     |

---
*Engineered by Family Dream Team · The Power Soul Of Shalawat* 🇮🇩
