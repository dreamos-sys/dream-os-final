#!/usr/bin/env python3
"""Dream OS Agent Memory - AUTO-INIT & ROBUST"""
import sqlite3, os
from pathlib import Path

DREAM_ROOT = Path.home() / "dream-live"
DB_PATH = DREAM_ROOT / "logs" / "agent_memory.db"
DOCS_DIR = DREAM_ROOT / "docs"

def _get_conn():
    """Helper: get connection + ensure tables exist"""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    # Create tables if not exist (idempotent)
    c.execute("CREATE TABLE IF NOT EXISTS context (id INTEGER PRIMARY KEY, path TEXT UNIQUE, content TEXT, keywords TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, task TEXT, prompt TEXT, response TEXT, action TEXT)")
    conn.commit()
    return conn

def index_docs():
    """Index docs folder (safe, idempotent)"""
    if not DOCS_DIR.exists(): return
    conn = _get_conn()
    c = conn.cursor()
    for f in DOCS_DIR.rglob("*.md"):
        try:
            txt = f.read_text(encoding="utf-8")[:5000]  # Limit size
            kw = " ".join(txt.split()[:10]).lower()
            c.execute("INSERT OR REPLACE INTO context (path,content,keywords) VALUES (?,?,?)", 
                     (str(f.relative_to(DREAM_ROOT)), txt, kw))
        except: pass
    conn.commit()
    conn.close()

def query_context(query: str, limit: int = 3) -> str:
    """Query context (AUTO-INIT: calls _get_conn which creates tables)"""
    conn = _get_conn()  # ✅ This ensures tables exist!
    c = conn.cursor()
    results = []
    for kw in query.lower().split():
        if len(kw) < 3: continue
        c.execute("SELECT path,content FROM context WHERE keywords LIKE ? LIMIT ?", (f"%{kw}%", limit))
        results.extend(c.fetchall())
    conn.close()
    if not results: return "No context found."
    out = "Context:\n"
    for p, txt in results[:3]:
        out += f"📄 {p}: {txt[:200]}...\n"
    return out

def log_audit(task, prompt, resp, action):
    conn = _get_conn()
    c = conn.cursor()
    c.execute("INSERT INTO audit (task,prompt,response,action) VALUES (?,?,?,?)", 
             (task, prompt[:300], resp[:300], action))
    conn.commit()
    conn.close()

# ✅ AUTO-INIT: Run once when module is imported
if not DB_PATH.exists() or os.path.getsize(DB_PATH) == 0:
    index_docs()  # This calls _get_conn() which creates tables

if __name__ == "__main__":
    print("✅ Memory ready:", query_context("Dream")[:80])
