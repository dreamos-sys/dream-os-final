#!/usr/bin/env python3
import subprocess, json, sys, os, datetime, re
from pathlib import Path

TARGET = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
MODE   = sys.argv[2] if len(sys.argv) > 2 else "quick"
LOG_DIR = Path.home() / "dream-live" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

def run(cmd, timeout=12):
    try:
        return subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout).stdout.strip()
    except Exception as e:
        return f"[timeout/error]: {e}"

def safe_nmap(t):
    out = run(f"nmap -sS -T4 -p 1-1024 --max-retries 1 {t} 2>/dev/null | grep -E 'open|closed|filtered'")
    return [l.strip() for l in out.splitlines() if l]

def safe_httpx(t):
    out = run(f"httpx -u http://{t} -silent -tech-detect -status-code -json 2>/dev/null | head -1")
    try: return json.loads(out) if out else {}
    except: return {}

def safe_nuclei(t):
    out = run(f"nuclei -u http://{t} -t http/technologies/ -silent -jsonl 2>/dev/null | head -3")
    return [json.loads(l) for l in out.splitlines() if l.strip()]

def sys_health():
    return {
        "listeners": run("ss -tuln 2>/dev/null | grep -c LISTEN || echo 0"),
        "memory": run("free -h 2>/dev/null | awk 'NR==2{print $3\"/\"$2}'"),
        "disk": run("df -h ~ 2>/dev/null | awk 'NR==2{print $3\"/\"$2}'")
    }

def ai_summary(data):
    prompt = f"Ringkas temuan teknis ini dalam 3 poin singkat. Format bullet. Akhiri: Bi idznillah.\n{json.dumps(data, indent=2)}"
    try:
        res = subprocess.run(
            ["curl","-s","-X","POST","http://127.0.0.1:8082/api/agent",
             "-H","Content-Type: application/json",
             "-d", json.dumps({"task":prompt})],
            capture_output=True, text=True, timeout=15
        )
        if res.status_code == 200: return json.loads(res.stdout).get("output","AI offline")
    except: return "AI summary unavailable"
def main():
    print(f"🔍 DREAM OS HIGH-END MULTITESTER — Target: {TARGET} | Mode: {MODE}")
    print("⏳ Scanning (Termux-safe, non-root optimized)...")

    results = {
        "target": TARGET, "mode": MODE,
        "timestamp": datetime.datetime.now().isoformat(),
        "network": safe_nmap(TARGET),
        "web_tech": safe_httpx(TARGET),
        "vuln_safe": safe_nuclei(TARGET),
        "system": sys_health()
    }

    log = LOG_DIR / f"multitester_{int(datetime.datetime.now().timestamp())}.json"
    with open(log, 'w') as f: json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n📊 RESULTS:")
    print(f"• Ports found: {len(results['network'])}")
    print(f"• Tech stack: {results['web_tech'].get('tech','N/A')}")
    print(f"• System: {results['system']}")

    if MODE == "full":
        print("\n🤖 AI Analysis:")
        print(ai_summary(results))

    print(f"\n✅ Log: {log}")
    print("🤲 Bi idznillah — Niat lurus, sistem terjaga.")

if __name__ == "__main__": main()
