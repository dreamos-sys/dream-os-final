#!/usr/bin/env python3
"""
🕌 Dream OS • Termux Bridge API v2.0 (Speed of Light Edition)
Local Flask server for Black Ops tools execution
Run: python3 termux-bridge/api.py
"""
from flask import Flask, request, jsonify
import subprocess, os, socket, datetime
import concurrent.futures
import urllib.request
import urllib.error

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dreamos-sacred-key-2026'

@app.before_request
def check_origin():
    if request.remote_addr not in ['127.0.0.1', '::1']:
        return jsonify({'error': 'Unauthorized'}), 403

# 1. NMAP RECON
@app.route('/api/nmap', methods=['POST'])
def nmap_scan():
    target = request.json.get('target', '192.168.1.1')
    try:
        result = subprocess.run(['nmap', '-sV', '-O', '-T4', target], capture_output=True, text=True, timeout=60)
        return jsonify({'status': 'success', 'output': result.stdout[-2000:]})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# 2. T-SHARK SNIFF (via tcpdump)
@app.route('/api/tcpdump', methods=['POST'])
def tcpdump_sniff():
    interface = request.json.get('interface', 'wlan0')
    count = request.json.get('count', 10)
    try:
        result = subprocess.run(['tcpdump', '-i', interface, '-c', str(count), '-n'], capture_output=True, text=True, timeout=30)
        return jsonify({'status': 'success', 'packets': result.stdout.split('\n')[:count]})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# 3. ⚡ LIGHT-SPEED OSINT SPIDER (Multi-Threaded Personal Audit)def check_platform(url_template, username):
    url = url_template.format(username)
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DreamOS/2.0'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3) as response:
            if response.getcode() == 200:
                return f"[+] Ditemukan: {url}"
    except urllib.error.HTTPError as e:
        if e.code not in [404, 403]:
            return f"[?] Hidden/Protected: {url} (Code {e.code})"
    except Exception:
        pass
    return None

@app.route('/api/osint', methods=['POST'])
def osint_scan():
    query = request.json.get('query', '')
    query = query.split('@')[0]  # Extract username from email
    
    platforms = [
        "https://www.instagram.com/{}/",
        "https://github.com/{}",
        "https://www.reddit.com/user/{}",
        "https://linktr.ee/{}",
        "https://vimeo.com/{}",
        "https://soundcloud.com/{}",
        "https://medium.com/@{}",
        "https://www.pinterest.com/{}/"
    ]
    
    results = [f"🕷️ Menelusuri jejak digital untuk: {query}"]
    
    # ⚡ Kecepatan Cahaya: 10 threads paralel!
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(check_platform, p, query): p for p in platforms}
        for future in concurrent.futures.as_completed(futures):
            res = future.result()
            if res:
                results.append(res)
                
    if len(results) == 1:
        results.append("[-] Jejak digital bersih/tidak ditemukan di platform utama.")
        
    return jsonify({
        'status': 'success', 
        'domain': query, 
        'ip': "Multi-Threaded Footprint Scan", 
        'output': "\n".join(results)
    })
# 4. HEALTH CHECK
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'online',
        'termux': os.uname().sysname,
        'python': os.uname().version,
        'timestamp': datetime.datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🕌 Dream OS Termux Bridge API v2.0 (Speed of Light)")
    print("🔒 Localhost only • Ready for Personal Audit")
    app.run(host='127.0.0.1', port=5000, debug=False)
