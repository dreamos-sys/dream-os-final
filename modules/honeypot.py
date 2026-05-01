#!/usr/bin/env python3
import socket, datetime, os, threading, json, sys

PORT = 2222  # Pancingan SSH palsu
LOG = os.path.expanduser("~/dream-live/logs/honeypot.json")
os.makedirs(os.path.dirname(LOG), exist_ok=True)

def log_attempt(ip, port):
    entry = {"time": datetime.datetime.now().isoformat(), "ip": ip, "target_port": port}
    with open(LOG, "a") as f: f.write(json.dumps(entry) + "\n")
    try:
        os.system(f"termux-notification --title '🚨 Honeypot' --content '{ip} coba akses port {port}' 2>/dev/null")
    except: pass
    print(f"🚨 [{entry['time']}] {ip} → port {port}")

def run():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(("0.0.0.0", PORT))
    s.listen(5)
    print(f"🕵️ Honeypot listening on :{PORT} (Ctrl+C to stop)")
    while True:
        try:
            conn, addr = s.accept()
            log_attempt(addr[0], PORT)
            conn.close()
        except KeyboardInterrupt: break
        except: continue

if __name__ == "__main__": run()
