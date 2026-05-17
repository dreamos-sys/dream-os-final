# 🕌 Dream OS • Termux Bridge API v2.0

Local Flask server for executing Black Ops tools from web UI.

## 🔐 Security
- **Localhost only**: Only accepts connections from 127.0.0.1
- **No external exposure**: Never run with `--host=0.0.0.0`
- **Secret key**: Change `SECRET_KEY` in production

## 🚀 Setup
```bash
# 1. Install dependencies
pkg install python flask nmap tcpdump -y
pip install flask

# 2. Start the bridge
cd ~/dream-os-hybrid-static
python3 termux-bridge/api.py

# 3. Keep it running (optional: use tmux)
# In Termux: tmux new -s dreamos
# Then run the API, detach with Ctrl+B D
```

## 🛠️ Usage
1. Open Dream OS web UI in browser2. Enter Ghost Mode (7-tap logo)
3. Click Black Ops tools:
   - 🕸️ NMAP Recon: Scan local network
   - 🦈 T-Shark Sniff: Capture packets
   - 🕷️ OSINT Spider: Query domain/username info
   - 🔌 Termux Bridge: Check connection status

## ⚠️ Permissions
Some tools require Termux permissions:
```bash
# For network tools:
termux-setup-storage
# For packet capture (may require root):
# pkg install tcpdump (works without root for basic capture)
```

## 🧪 Test
```bash
curl http://127.0.0.1:5000/api/health
# Expected: {"status":"online","termux":"Linux",...}
```

Bi idznillah — Teknologi untuk kebaikan, bukan kerusakan. 🤲
