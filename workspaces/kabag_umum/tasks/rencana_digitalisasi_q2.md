# 📝 RENCANA KERJA Q2 - DIGITALISASI (DREAM OS) v1.2

## 🎯 DAFTAR TUGAS UTAMA
1. **Scan Log Booking 2025**: Digitalisasi 100% log manual ke `reports/bookings.json`.
   - **KPI**: Error rate < 1%.
   - **AC**: Data dapat di-search di Dashboard.
2. **Anti-Double Booking Integration**: Validasi jadwal via `book_resource.py`.
   - **KPI**: Zero double-booking incidents.
   - **AC**: Lulus 10x simulasi tabrakan (Beyoncé Rule).
3. **Training Staf**: Pelatihan Command Center Termux.
   - **KPI**: 100% staf bisa `m-book` mandiri.
   - **AC**: Staf lulus kuis simulasi error.

## ⚠️ MANAJEMEN RISIKO & DEPENDENSI
| Risiko | Mitigasi |
|--------|----------|
| OCR Gagal baca tulisan tangan | Input manual cadangan oleh admin khusus. |
| Staf kesulitan pakai Termux | Disediakan "Panduan Saku" (`docs/panduan_staf_termux.md`). |
| Jaringan lemot | Sistem dibuat Offline-First (Sync saat ada sinyal). |

**Dependensi**: Termux v0.118+, Python 3.10, Akses folder `workspaces/`.
**Monitoring**: Laporan mingguan otomatis via `m-refresh` ke Dashboard Utama.

**Status**: 🟢 Ready for Review
**PIC**: Mr. M
**Timeline**: Week 1-8 (April-Mei 2026)
