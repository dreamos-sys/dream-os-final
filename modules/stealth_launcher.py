#!/usr/bin/env python3
import socket, subprocess, time, sys, threading

SECRET_SEQ = [7000, 8000, 9000]  # Urutan knock rahasia
FLASK_CMD = ["python3", "/data/data/com.termux/files/home/dream-live/server_flask.py"]
flask_started = False

def listen_knock():
    global flask_started
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("0.0.0.0", 0))  # Listen all ports (raw socket)
    sock.settimeout(1)
    received = []
    print(f"🔐 Stealth mode: Waiting for knock {'->'.join(map(str, SECRET_SEQ))}")
    
    while not flask_started:
        try:
            data, addr = sock.recvfrom(1)
            port = addr[1]
            if port in SECRET_SEQ and (not received or SECRET_SEQ.index(port) == len(received)):
                received.append(port)
                print(f"🔑 Knock received: {port} ({len(received)}/{len(SECRET_SEQ)})")
                if received == SECRET_SEQ:
                    print("✅ Sequence correct! Starting Flask...")
                    subprocess.Popen(FLASK_CMD)
                    flask_started = True
                    break
            # Reset if wrong port or timeout
            if len(received) > 0 and port not in SECRET_SEQ:
                received = []
        except: continue

if __name__ == "__main__":
    threading.Thread(target=listen_knock, daemon=True).start()
    # Keep script alive
    while not flask_started: time.sleep(1)
