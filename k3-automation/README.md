# 🕌 Dream OS K3 Automation (Bash Edition)

> Zero Cost • Termux-First • Spiritual-Tech Synergy

## 🚀 Quick Start

```bash
# 1. Setup
cd ~/dream-live/k3-automation

# 2. Edit config (MASUKKAN API KEY!)
nano config.local.sh
# → Paste Dialagram API key di DIALAGRAM_API_KEY=""

# 3. Test
./k3.sh test

# 4. Create first report
./k3.sh report "Lobby Utama" "Lampu mati di resepsionis" high

# 5. Check status
./k3.sh status RPT-MAINT-XXXXXXXXXXXXX
```

## 📋 Commands

| Command | Description | Example |
|---------|-------------|---------|
| `test` | Run diagnostics | `./k3.sh test` |
| `report` | Create maintenance report | `./k3.sh report "Lobby" "AC rusak" high` |
| `status` | Check report | `./k3.sh status RPT-MAINT-xxx` |
| `list` | Show recent reports | `./k3.sh list` |
| `ai` | Test AI directly | `./k3.sh ai "Rekomendasi perbaikan"` |
| `help` | Show help | `./k3.sh help` |

## 🔑 Get Dialagram API Key (Gratis)

1.  Buka: https://www.dialagram.me/
2.  Klik "Launch Nexum Router"
3.  Sign up (gratis, no credit card)
4.  Buat API token
5.  Paste ke `config.local.sh`

## 🤲 Spiritual Integration

- Setiap output diawali `🤲 Bismillah` (jika `SPIRITUAL_MODE=true`)
- Setiap hasil diakhiri `🕌 Bi idznillah`
- Niat lurus + kode bersih = deploy berkah

## ⚠️ Security

- `config.local.sh` JANGAN di-commit ke Git!
- API keys disimpan di environment variables
- Input disanitize untuk prevent injection

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `jq: command not found` | `pkg install jq` |
| `curl: command not found` | `pkg install curl` |
| AI always returns `[mock]` | Set `DIALAGRAM_API_KEY` di config |
| Report not found | Check ID format: `RPT-MAINT-YYYYMMDDHHMMSS` |

## 🤝 Contributing

1.  Fork repo
2.  Buat branch fitur
3.  Test di Termux
4.  PR dengan deskripsi jelas

---

*Built with ❤️ and 🤲 by Dream Team • Bi idznillah*
