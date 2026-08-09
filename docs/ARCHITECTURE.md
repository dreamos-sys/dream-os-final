# 🏗️ Dream OS — Architecture Overview

> Cognitive Facility Operating System • Enterprise RBAC • Offline-First

## 🎯 High-Level Architecture
## 🧱 Prinsip Desain

1. **Offline-First** — semua data ditulis ke localStorage dulu, sync ke Supabase saat online.
2. **RBAC 12 Role** — gate di UI (`canAccess`) + RLS di database.
3. **Modular** — tiap modul = 1 HTML self-contained, di-inject ke shell.
4. **Safety Net** — CI tests + branch ruleset + Sentry (3 lapis).
5. **XSS-Safe** — sanitizer terpusat `DreamOSSecurity.esc()`.

## 🔐 Security Layers

| Layer | Mekanisme |
|---|---|
| Auth | bcrypt hash + Supabase Auth + session |
| Otorisasi | RBAC 12 role + RLS |
| Input | `esc()` sanitizer terpusat |
| Transport | CSP header + HTTPS |
| Monitoring | Sentry error tracking |

## 🧪 Quality Gates

- **52 automated tests** (Vitest) — logic + production code
- **CI/CD** — test + syntax + security tiap push
- **Ruleset** — block force-push & delete `gh-pages`
- **Validator** — `scripts/validate-modules.mjs` cek syntax 14 modul

## 📦 Data Flow (contoh: K3 report)
## 📚 Lihat Juga
- [API Reference](./API.md)
- [README](../README.md)
- [Policy & Compliance](../modules/about.html)
