#!/usr/bin/env python3
import os, sys, json, subprocess, datetime, socket
from pathlib import Path

LOG_DIR = Path.home() / "dream-live" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

def check_process(name):
    try:
        out = subprocess.run(["pgrep", "-f", name], capture_output=True, text=True)
        return bool(out.stdout.strip())
    except: return False

def check_port(port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        result = s.connect_ex(("127.0.0.1", port))
        s.close()
        return result == 0
    except: return False

def status():
    print("🛡️  DREAM SHIELD STATUS — " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("-" * 50)
    
    # Layer 1: Stealth
    stealth = check_process("stealth_launcher")
    port_open = check_port(8082)
    print(f"🔐 Stealth Mode: {'✅ Aktif' if stealth else '❌ Nonaktif'} | Port 8082: {'🔓 Terbuka' if port_open else '🔒 Tertutup'}")
    
    # Layer 2: Rate Limit
    limiter = os.path.exists("/data/data/com.termux/files/home/dream-live/server_flask.py")
    with open("/data/data/com.termux/files/home/dream-live/server_flask.py") as f:
        has_limiter = "flask_limiter" in f.read()
    print(f"🛑 Rate Limiter: {'✅ Terpasang' if has_limiter else '❌ Belum'}")
    
    # Layer 3: Honeypot
    honey = check_process("honeypot")
    honey_port = check_port(2222)
    print(f"🕵️  Honeypot: {'✅ Aktif (port 2222)' if honey and honey_port else '❌ Nonaktif'}")
    
    # Logs
    blocked = LOG_DIR / "blocked_ips.log"
    honey_log = LOG_DIR / "honeypot.json"
    print(f"\n📊 Logs:")
    print(f"   • Blocked IPs: {blocked.stat().st_size if blocked.exists() else 0} bytes")
    print(f"   • Honeypot hits: {honey_log.stat().st_size if honey_log.exists() else 0} bytes")    
    print("\n🤲 Bi idznillah — Niat lurus, sistem terjaga.")

def start_all():
    print("🚀 Starting Dream Shield layers...")
    # Start honeypot
    if not check_process("honeypot"):
        subprocess.Popen(["python3", str(Path.home()/ "dream-live"/ "modules"/ "honeypot.py")], 
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("✅ Honeypot started")
    # Start stealth launcher
    if not check_process("stealth_launcher"):
        subprocess.Popen(["python3", str(Path.home()/ "dream-live"/ "modules"/ "stealth_launcher.py")],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("✅ Stealth launcher started")
    print("🤲 Bi idznillah.")

def stop_all():
    print("🛑 Stopping Dream Shield layers...")
    for name in ["honeypot", "stealth_launcher"]:
        try:
            subprocess.run(["pkill", "-f", name], capture_output=True)
            print(f"✅ {name} stopped")
        except: pass
    print("🤲 Bi idznillah.")

def tail_log(logfile, lines=5):
    path = LOG_DIR / logfile
    if not path.exists():
        print(f"📄 {logfile}: Belum ada data")
        return
    with open(path) as f:
        content = f.readlines()[-lines:]
        print(f"\n📋 Last {lines} entries from {logfile}:")
        for line in content:
            print("   " + line.strip())

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status": status()
    elif cmd == "start": start_all()
    elif cmd == "stop": stop_all()
    elif cmd == "logs": 
        tail_log("blocked_ips.log")
        tail_log("honeypot.json")
    else: print(f"Usage: dream_shield.py [status|start|stop|logs]")
