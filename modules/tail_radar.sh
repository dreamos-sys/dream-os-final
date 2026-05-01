#!/data/data/com.termux/files/usr/bin/bash
echo "📡 TAIL-RADAR: Memindai Jaringan Lokal..."
echo "--------------------------------------------------"

# Coba Tailscale dulu
if command -v tailscale >/dev/null 2>&1; then
  TS=$(tailscale status --json 2>/dev/null)
  if [ -n "$TS" ]; then
    echo "$TS" | jq -r '.Peer | to_entries[] | "🖥️ \(.key): \(.value.Hostname) | \(.value.TailscaleIPs[0])"' 2>/dev/null
  fi
fi

# Fallback: scan LAN lokal pakai nmap
echo "🔍 Scanning LAN lokal (192.168.1.0/24)..."
nmap -sn 192.168.1.0/24 2>/dev/null | grep "Nmap scan" | sed 's/Nmap scan report for /🖥️  /'

echo "🤲 Bi idznillah — Jaringan Keluarga terpantau."
