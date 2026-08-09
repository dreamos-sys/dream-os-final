# 🛡️ Security Triage — CodeQL Findings (2026-08-09)

Dokumen ini mencatat triage atas 16 temuan CodeQL (14 High, 2 Medium).
Prinsip: fix yang exploitable, harden bertahap, accept yang low-risk dengan alasan.

## ✅ Fixed
| Finding | File | Fix |
|---|---|---|
| Incomplete URL scheme check | js/security.js | Tambah `safeUrl()` allowlist protocol (https/http/mailto) via `new URL()` |
| Information exposure via stack trace | supabase edge fn | Hapus `stack` dari response error |

## 🔧 Harden Bertahap (Low-Medium, data mostly trusted/admin)
| Finding | File | Catatan |
|---|---|---|
| Incomplete string escaping | janitor-*, asset, qr | Sudah pakai `esc()`; data mayoritas input admin terautentikasi (RBAC), bukan arbitrary public input |
| DOM text reinterpreted as HTML | qr, janitor, setup-admin | innerHTML dengan `esc()`; lanjutkan migrasi bertahap ke textContent |

## ⚪ Accepted Risk (dengan alasan)
| Finding | Alasan |
|---|---|
| Bad HTML filtering regexp (validate-modules.mjs) | Alat dev/CI untuk ekstrak `<script>`, BUKAN security boundary |
| Inclusion from untrusted source (qr.html CDN) | jsdelivr = CDN standar industri; mitigasi: tambah SRI hash di fase v1.1 |

## 📌 Rencana v1.1
- Tambah SRI (Subresource Integrity) untuk semua CDN scripts
- Migrasi innerHTML → textContent / DOM API untuk data dinamis
- Jalankan CodeQL tiap Senin (sudah otomatis)
