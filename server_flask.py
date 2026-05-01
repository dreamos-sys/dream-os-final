from flask import Flask, jsonify, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
import requests, sqlite3
from pathlib import Path

app = Flask(__name__)
limiter = Limiter(get_remote_address, app=app, default_limits=["100 per hour", "20 per minute"], storage_uri="memory://")
CORS(app)
DR = Path.home() / "dream-live"
DB = DR / "logs" / "agent_memory.db"
OLL = "http://127.0.0.1:11434/api/generate"

def _db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB))
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS context(id INTEGER PRIMARY KEY, path TEXT UNIQUE, content TEXT, keywords TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, task TEXT, prompt TEXT, response TEXT, action TEXT)")
    conn.commit()
    return conn

def qc(q):
    conn = _db(); c = conn.cursor(); r = []
    for k in q.lower().split():
        if len(k) < 3: continue
        c.execute("SELECT path, content FROM context WHERE keywords LIKE ? LIMIT 3", (f"%{k}%",))
        r.extend(c.fetchall())
    conn.close()
    return "Context:\n" + "".join([f"[{p}]: {t[:200]}...\n" for p, t in r[:3]]) if r else ""

def la(t, p, r, a):
    conn = _db(); c = conn.cursor()
    c.execute("INSERT INTO audit(task, prompt, response, action) VALUES (?, ?, ?, ?)", (t, p[:300], r[:300], a))
    conn.commit(); conn.close()

def cq(pr, m="qwen2.5:0.5b"):
    for _ in range(3):
        try:
            x = requests.post(OLL, json={"model": m, "prompt": pr, "stream": False}, timeout=60)
            if x.status_code == 200:
                return x.json().get("response", "").strip() or "No content"
        except: continue
    return "Timeout"

@app.route("/")
def rt(): return jsonify({"status": "Dream OS Backend v4.1", "sovereign": True})

@app.route("/api/agent", methods=["POST"])
def ag():
    try:
        d = request.get_json()
        if not d or "task" not in d: return jsonify({"success": False, "error": "Missing task"}), 400
        t = d["task"]; print(f"Processing: {t}"); ctx = qc(t)
        # Prompt super simple: AI cuma bantu jelasin, nggak perlu format ketat
        pr = f"Anda Mr. M, asisten Dream OS Ghost Mode. User: {t}. Jika terkait security/OSINT: jawab teknis singkat, tekankan 'edukasi & kedaulatan defensif'. Akhiri: 'Bi idznillah — Niat lurus, sistem terjaga'."
        print("Thinking..."); lr = cq(pr); o = lr.strip() if lr else "No response"
        # Auto-append closing kalau lupa
        if "Bi idznillah" not in o: o = o.rstrip() + " Bi idznillah"
        la(t, pr, lr, "raw")
        return jsonify({"success": True, "output": o}), 200
    except Exception as e:
        print(f"Error: {e}"); return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print("Dream OS Backend v4.1 starting..."); app.run(host="0.0.0.0", port=8082, debug=False)

@app.errorhandler(429)
def ratelimit_handler(e):
    import datetime, os
    ip = request.remote_addr
    with open("logs/blocked_ips.log", "a") as f:
        f.write(f"[{datetime.datetime.now()}] BLOCKED (429): {ip}\n")
    os.system(f"termux-notification --title '🛡️ Rate Limit' --content 'Too many requests from {ip}' 2>/dev/null")
    return {"error": "Rate limit exceeded. Bi idznillah."}, 429
# --- DREAM OS UI & SMILING GENERAL TRAP ---
import time, json, datetime, os
from flask import render_template, jsonify, request

@app.route('/')
def dashboard():
    return render_template('index.html')

@app.route('/api/status')
def api_status():
    stealth = any('stealth' in p for p in os.popen('pgrep -f stealth_launcher').read().split())
    ratelimit = 'flask_limiter' in open('/data/data/com.termux/files/home/dream-live/server_flask.py').read()
    honeypot = any('honeypot' in p for p in os.popen('pgrep -f honeypot').read().split())
    integrity = '✅ Utuh' if os.popen('bash ~/dream-live/modules/integrity_check.sh verify 2>/dev/null | grep -q "utuh" && echo 1').read().strip() == '1' else '⚠️ Perlu cek'
    return jsonify({"stealth": stealth, "ratelimit": ratelimit, "honeypot": honeypot, "integrity": integrity})

@app.route('/api/logs')
def api_logs():
    logs = []
    try:
        with open('logs/honeypot.json') as f:
            for line in f.readlines()[-5:]:
                d = json.loads(line)
                logs.append({"time": d['time'][:19], "ip": d['ip'], "path": f":{d['target_port']}"})
    except: pass
    return jsonify(logs)

# SMILING GENERAL TRAP (Safe, non-crashing, adaptive)
@app.route('/honeypot/<path:path>', defaults={'path': 'root'})
@app.route('/<path:path>')
def smile_trap(path):
    ip = request.remote_addr
    ua = request.headers.get('User-Agent', 'Unknown')
    log_entry = {"time": datetime.datetime.now().isoformat(), "ip": ip, "path": f"/{path}", "ua": ua}
    
    with open("logs/honeypot.json", "a") as f: f.write(json.dumps(log_entry) + "\n")
    
    # "Bonus" 1001^99 style: graceful delay + decoy payload
    time.sleep(1.5)
    decoy = {"status": "200 OK", "message": "Welcome to Dream OS 🤲", "note": "Enjoy the serenity.", "data": "🌿"}
    return jsonify(decoy), 200
