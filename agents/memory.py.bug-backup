#!/usr/bin/env python3
"""
💾 Dream OS Agent Memory — SQLite + JSON Context
Lightweight RAG (Retrieval-Augmented Generation) tanpa vector DB berat
"""

import sqlite3
import json
from pathlib import Path
from datetime import datetime

# ── CONFIG ───────────────────────────────────────
DREAM_ROOT = Path.home() / "dream-live"
DB_PATH = DREAM_ROOT / "logs" / "agent_memory.db"
DOCS_DIR = DREAM_ROOT / "docs"
# ──────────────────────────────────────────────────

def init_db():
    """Inisialisasi SQLite database"""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    # Tabel context (cache dokumen)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS context (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE,
            content TEXT,
            keywords TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Tabel audit (log aktivitas agent)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT,
            prompt TEXT,
            response TEXT,
            action TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()
    print(f"✅ Database initialized: {DB_PATH}")
def index_docs():
    """Index semua file di docs/ folder"""
    if not DOCS_DIR.exists():
        print("⚠️ docs/ folder not found")
        return
    
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    count = 0
    
    for file_path in DOCS_DIR.rglob("*.md"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract keywords sederhana (first 10 words)
            keywords = " ".join(content.split()[:10]).lower()
            
            cursor.execute("""
                INSERT OR REPLACE INTO context (path, content, keywords)
                VALUES (?, ?, ?)
            """, (str(file_path.relative_to(DREAM_ROOT)), content, keywords))
            count += 1
        except Exception as e:
            print(f"⚠️ Skip {file_path}: {e}")
    
    conn.commit()
    conn.close()
    print(f"✅ Indexed {count} documents")

def query_context(query: str, limit: int = 3) -> str:
    """Cari konteks relevan dari database"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    # Simple keyword search (bisa upgrade ke BM25 nanti)
    keywords = query.lower().split()
    results = []
    
    for keyword in keywords:
        if len(keyword) < 3:
            continue
        cursor.execute("""
            SELECT path, content FROM context 
            WHERE keywords LIKE ?
            LIMIT ?
        """, (f"%{keyword}%", limit))
        results.extend(cursor.fetchall())
        conn.close()
    
    if not results:
        return "No relevant context found."
    
    # Format hasil
    context_text = "Relevant documentation:\n"
    for path, content in results[:3]:  # Max 3 results
        context_text += f"\n📄 {path}:\n{content[:300]}...\n"
    
    return context_text

def log_audit(task: str, prompt: str, response: str, action: str):
    """Log aktivitas agent untuk transparansi"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO audit (task, prompt, response, action)
        VALUES (?, ?, ?, ?)
    """, (task, prompt[:500], response[:500], action))
    conn.commit()
    conn.close()

# Initialize on import
init_db()
index_docs()

# Test
if __name__ == "__main__":
    print("\n🧪 Testing memory...")
    print("Query 'spec':", query_context("spec")[:100])
    print("✅ Memory ready!")
