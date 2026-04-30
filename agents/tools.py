#!/usr/bin/env python3
"""
🛠️ Dream OS Agent Tools — Safe, Audited, Sovereign
Tool wrapper untuk eksekusi aman: CLI, file I/O, Ollama call
"""

import subprocess
import json
import os
from pathlib import Path

# ── CONFIG ────────────────────────────────────────
DREAM_ROOT = Path.home() / "dream-live"
OLLAMA_URL = "http://localhost:11434/api/generate"
ALLOWED_COMMANDS = {
    "ls", "cat", "grep", "find", "wc", "git", "curl", "echo"
}
# ──────────────────────────────────────────────────

def call_ollama(prompt: str, model: str = "tinyllama:latest") -> str:
    """Panggil Ollama local dengan timeout"""
    try:
        import requests
        res = requests.post(
            OLLAMA_URL,
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=30
        )
        if res.status_code == 200:
            return res.json().get("response", "")
        return f"❌ Ollama error: HTTP {res.status_code}"
    except Exception as e:
        return f"❌ Connection error: {str(e)}"

def run_cli(command: str, args: list = None) -> dict:
    """
    Jalankan CLI command yang aman (whitelist only)
    Return: {"success": bool, "output": str, "error": str}
    """
    if command not in ALLOWED_COMMANDS:
        return {"success": False, "output": "", "error": f"Command '{command}' not allowed"}
    
    try:
        cmd = [command] + (args or [])
        result = subprocess.run(
            cmd,
            cwd=str(DREAM_ROOT),
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        }
    except Exception as e:
        return {"success": False, "output": "", "error": str(e)}

def read_file(filepath: str) -> dict:
    """Baca file dengan path validation"""
    try:
        full_path = (DREAM_ROOT / filepath).resolve()
        if not str(full_path).startswith(str(DREAM_ROOT)):
            return {"success": False, "content": "", "error": "Path traversal detected"}
        
        with open(full_path, 'r', encoding='utf-8') as f:
            return {"success": True, "content": f.read(), "error": ""}
    except Exception as e:
        return {"success": False, "content": "", "error": str(e)}

def parse_json_response(text: str) -> dict:
    """Parse JSON dari LLM response (tolerant)"""
    try:
        # Cari blok JSON dalam text
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
        return {"error": "No JSON found"}
    except json.JSONDecodeError as e:
        return {"error": f"JSON parse error: {str(e)}", "raw": text}

# Test tools
if __name__ == "__main__":
    print("🧪 Testing tools...")
    print("1. Ollama call:", call_ollama("Hi")[:50] + "...")
    print("2. CLI ls:", run_cli("ls", ["-la"])["success"])
    print("3. Read file:", read_file("app.js")["success"])
    print("✅ Tools ready!")
#!/usr/bin/env python3
"""Dream OS Agent Tools — Safe Wrapper"""
import subprocess, json, os
from pathlib import Path

DREAM_ROOT = Path.home() / "dream-live"
OLLAMA_URL = "http://localhost:11434/api/generate"
ALLOWED_COMMANDS = {"ls", "cat", "grep", "find", "wc", "git", "curl", "echo"}

def call_ollama(prompt: str, model: str = "tinyllama:latest") -> str:
    try:
        import requests
        res = requests.post(OLLAMA_URL, json={"model": model, "prompt": prompt, "stream": False}, timeout=30)
        return res.json().get("response", "") if res.status_code == 200 else f"❌ HTTP {res.status_code}"
    except Exception as e:
        return f"❌ {e}"

def run_cli(command: str, args: list = None) -> dict:
    if command not in ALLOWED_COMMANDS:
        return {"success": False, "error": f"Command '{command}' not allowed"}
    try:
        result = subprocess.run([command] + (args or []), cwd=str(DREAM_ROOT), capture_output=True, text=True, timeout=10)
        return {"success": result.returncode == 0, "output": result.stdout, "error": result.stderr}
    except Exception as e:
        return {"success": False, "error": str(e)}

def read_file(filepath: str) -> dict:
    try:
        full_path = (DREAM_ROOT / filepath).resolve()
        if not str(full_path).startswith(str(DREAM_ROOT)):
            return {"success": False, "error": "Path traversal detected"}
        with open(full_path, 'r', encoding='utf-8') as f:
            return {"success": True, "content": f.read()}
    except Exception as e:
        return {"success": False, "error": str(e)}

def parse_json_response(text: str) -> dict:
    try:
        start, end = text.find("{"), text.rfind("}") + 1
        return json.loads(text[start:end]) if start >= 0 and end > start else {"error": "No JSON"}
    except:
        return {"error": "JSON parse failed", "raw": text}

if __name__ == "__main__":
    print("✅ Tools loaded")
