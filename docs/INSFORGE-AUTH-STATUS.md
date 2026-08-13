# InsForge: Status & Keputusan Strategis (11 Agustus 2026, 17:40 WIB)

## Temuan
- Auth InsForge AKTIF (Email/Password + OAuth), TAPI tidak expose
  REST API (semua /auth/v1/* = 404).
- Root cause: InsForge = agent-first platform (SDK/CLI/MCP),
  bukan REST-first seperti Supabase. (Konfirmasi: roadmap
  feedback.insforge.dev — fokus pada agent tooling.)

## Keputusan Arsitektur
- AUTH: tetap Supabase (primary) + local offline login (fallback outage)
- DATA: InsForge = DR site (mirror tabel, daily backup otomatis ✅)
- FAILOVER: Circuit Breaker untuk data-layer, bukan auth

## Workaround User Baru Selama Outage Supabase
- Provisioning lokal via CMD Center (offline-first user seeding)
- Atau manual Add User di dashboard InsForge (untuk testing internal)

## Pelajaran
- Pilih backend sesuai filosofi app: static HTML → REST-first (Supabase)
- InsForge cocok untuk proyek agent-built berikutnya! 🤖
