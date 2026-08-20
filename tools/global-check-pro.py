#!/usr/bin/env python3
"""Dream OS Global Check Pro — Termux-safe (no fragile bash case/colors)."""
from __future__ import annotations
import json, os, re, subprocess, urllib.request, urllib.error
from pathlib import Path

ROOT = Path.cwd()
TMP = Path.home() / "dreamos-audit"
TMP.mkdir(exist_ok=True)
PASS = WARN = FAIL = 0

def ok(msg):
    global PASS; PASS += 1; print("   OK  ", msg)

def warn(msg):
    global WARN; WARN += 1; print("   WARN", msg)

def bad(msg):
    global FAIL; FAIL += 1; print("   FAIL", msg)

def sh(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return ""

def http_code(url, timeout=15):
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0

def http_head(url, timeout=15):
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return {k.lower(): v for k, v in r.headers.items()}
    except Exception:
        return {}

def http_post_json(url, body, timeout=20):
    try:
        data = json.dumps(body).encode()
        req = urllib.request.Request(url, data=data, method="POST",
            headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        try:
            return e.read().decode("utf-8", "replace")
        except Exception:
            return f"HTTP_{e.code}"
    except Exception as e:
        return f"CURL_FAIL:{e}"

print("=== Dream OS Global Audit ===")
print()

# 1 Git
print("[1/7] Git")
print("   Operator:", sh("git config user.name") or "unknown")
print("   Branch  :", sh("git rev-parse --abbrev-ref HEAD") or "?")
st = sh("git status --short")
if not st:
    ok("working tree clean")
else:
    warn("uncommitted changes")
    for line in st.splitlines()[:20]:
        print("     ", line)
for line in sh("git log --oneline -3").splitlines():
    print("     ", line)
print()

# 2 CI
print("[2/7] GitHub Actions")
try:
    url = "https://api.github.com/repos/dreamos-sys/dream-os-final/actions/runs?per_page=5"
    with urllib.request.urlopen(url, timeout=15) as r:
        d = json.loads(r.read().decode())
    runs = d.get("workflow_runs") or []
    if not runs:
        warn("no workflow runs")
    else:
        for r in runs:
            stt = r.get("conclusion") or r.get("status") or "?"
            name = r.get("name") or "?"
            msg = ((r.get("head_commit") or {}).get("message") or "").splitlines()
            msg = (msg[0][:40] if msg else "")
            line = f"{stt} | {name} | {msg}"
            if stt == "success":
                ok(line)
            elif stt in ("in_progress", "queued"):
                warn(line)
            else:
                bad(line)
except Exception as e:
    warn(f"fetch Actions gagal: {e}")
print()

# 3 Live
print("[3/7] Live pages")
for u in (
    "https://dreamos-sys.github.io/dream-os-final/",
    "https://dreamos-sys.github.io/dream-os-final/index.html",
    "https://dreamos-sys.github.io/dream-os-final/manifest.json",
):
    c = http_code(u)
    (ok if c == 200 else warn)(f"HTTP {c} {u}")
print()

# 4 Headers
print("[4/7] Headers")
h = http_head("https://dreamos-sys.github.io/dream-os-final/")
hl = " ".join(h.keys())
if "content-security-policy" in hl:
    ok("CSP in headers")
else:
    warn("CSP not in headers (meta HTML OK)")
if "x-frame-options" in hl or "content-security-policy" in hl:
    # frame-ancestors only inside CSP value often
    ok("host headers readable")
else:
    warn("limited security headers on GitHub Pages")
if "strict-transport-security" in hl:
    ok("HSTS")
else:
    warn("no HSTS")
print()

# 5 Edge
print("[5/7] Edge admin-users")
resp = http_post_json(
    "https://gbigjdhifispatrrskgh.supabase.co/functions/v1/admin-users",
    {"action": "list"},
)
low = resp.lower()
if any(x in low for x in ("unauthorized", "jwt", "401", "not authenticated", "invalid jwt", "missing authorization", "bearer")):
    ok("guard rejects unauthenticated call")
elif resp.startswith("CURL_FAIL"):
    bad("cannot reach edge function")
elif "not found" in low or low.strip() in ("http_404",):
    bad("admin-users function missing")
else:
    warn("unexpected: " + resp.replace("\n", " ")[:120])
print()

# 6 Keys
print("[6/7] Key sync")
text_index = (ROOT / "index.html").read_text(encoding="utf-8", errors="replace") if (ROOT / "index.html").exists() else ""
keys = re.findall(r"sb_publishable_[A-Za-z0-9_-]+", text_index)
if not keys and (ROOT / "js/config.js").exists():
    keys = re.findall(r"sb_publishable_[A-Za-z0-9_-]+", (ROOT / "js/config.js").read_text(encoding="utf-8", errors="replace"))
if not keys:
    keys = re.findall(r"eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+", text_index)
if keys:
    key = keys[0]
    print("   sample:", key[:18] + "...")
    for f in ("index.html", "signup.html", "js/config.js", "setup-admin.html", ".supabase_anon"):
        p = ROOT / f
        if not p.exists():
            warn(f"{f} missing"); continue
        body = p.read_text(encoding="utf-8", errors="replace")
        (ok if key in body else warn)(f"{f} {'synced' if key in body else 'key mismatch'}")
else:
    bad("no anon/publishable key found")
print()

# 7 Size
print("[7/7] File size")
w = f = 0
for p in sorted(ROOT.rglob("*")):
    if not p.is_file():
        continue
    if any(x in p.parts for x in (".git", "node_modules", "dist")):
        continue
    if p.suffix not in {".html", ".js", ".css"}:
        continue
    if ".bak" in p.name:
        continue
    s = p.stat().st_size
    if s > 250 * 1024:
        print(f"   FAIL {p.relative_to(ROOT)} {s//1024}KB"); f += 1
    elif s > 150 * 1024:
        print(f"   WARN {p.relative_to(ROOT)} {s//1024}KB"); w += 1
if f == 0 and w == 0:
    ok("no file >150KB")
print()

# Bonus CMD syntax
print("[bonus] commandcenter syntax")
cmd = ROOT / "modules/commandcenter.html"
if cmd.exists():
    try:
        from html.parser import HTMLParser
        class S(HTMLParser):
            def __init__(self):
                super().__init__(); self.scripts=[]; self._c=None
            def handle_starttag(self, t, a):
                if t == "script":
                    d = dict(a); self._c = [] if "src" not in d else None
            def handle_endtag(self, t):
                if t == "script" and self._c is not None:
                    self.scripts.append("".join(self._c)); self._c = None
            def handle_data(self, d):
                if self._c is not None:
                    self._c.append(d)
        p = S()
        p.feed(cmd.read_text(encoding="utf-8", errors="replace"))
        if not p.scripts:
            warn("no inline scripts")
        else:
            big = max(p.scripts, key=len)
            out = TMP / "cmd-big.js"
            out.write_text(big, encoding="utf-8")
            r = subprocess.run(["node", "--check", str(out)], capture_output=True, text=True)
            if r.returncode == 0:
                ok(f"commandcenter JS syntax ({len(big)} bytes)")
            else:
                bad("commandcenter syntax error")
                print((r.stderr or "")[:300])
    except FileNotFoundError:
        warn("node not installed")
    except Exception as e:
        warn(f"CMD check error: {e}")
else:
    warn("commandcenter.html missing")

print()
print(f"=== Summary pass={PASS} warn={WARN} fail={FAIL} ===")
if FAIL:
    print("Status: FIX FAILURES"); raise SystemExit(1)
if WARN:
    print("Status: OK WITH NOTES"); raise SystemExit(0)
print("Status: CLEAN"); raise SystemExit(0)
