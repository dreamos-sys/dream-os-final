from flask import Flask, jsonify, request
from flask_cors import CORS
import requests, sqlite3
from pathlib import Path

app = Flask(__name__)
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
