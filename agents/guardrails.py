#!/usr/bin/env python3
"""
🛡️ Dream OS Agent Guardrails — Safety, Validation, Audit
Lapisan keamanan: validasi input, sanitasi output, rate limit
"""

import re
from pathlib import Path
from datetime import datetime, timedelta

# ── CONFIG ────────────────────────────────────────
MAX_INPUT_LENGTH = 1000
MAX_OUTPUT_LENGTH = 5000
RATE_LIMIT_WINDOW = 60  # detik
RATE_LIMIT_MAX_REQUESTS = 10
DANGEROUS_PATTERNS = [
    r"rm\s+-rf",
    r"chmod\s+777",
    r"sudo",
    r"curl.*\|\s*bash",
    r"DROP\s+TABLE",
    r"DELETE\s+FROM",
]
# ──────────────────────────────────────────────────

class RateLimiter:
    """Simple rate limiter in-memory"""
    def __init__(self):
        self.requests = []
    
    def is_allowed(self) -> bool:
        now = datetime.now()
        # Bersihin request lama
        self.requests = [
            req for req in self.requests 
            if now - req < timedelta(seconds=RATE_LIMIT_WINDOW)
        ]
        
        if len(self.requests) >= RATE_LIMIT_MAX_REQUESTS:
            return False
        
        self.requests.append(now)
        return True

rate_limiter = RateLimiter()

def validate_input(text: str) -> tuple[bool, str]:
    """
    Validasi input user    Return: (is_valid, error_message)
    """
    if not text:
        return False, "Input kosong"
    
    if len(text) > MAX_INPUT_LENGTH:
        return False, f"Input terlalu panjang (max {MAX_INPUT_LENGTH} chars)"
    
    # Cek dangerous patterns
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return False, "Input mengandung pola berbahaya"
    
    return True, ""

def sanitize_output(text: str) -> str:
    """Sanitasi output sebelum ditampilkan"""
    if len(text) > MAX_OUTPUT_LENGTH:
        text = text[:MAX_OUTPUT_LENGTH] + "\n... [truncated]"
    
    # Hapus karakter kontrol
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    
    return text

def log_security_event(event_type: str, details: str):
    """Log event keamanan ke file"""
    log_file = Path.home() / "dream-live" / "logs" / "security.log"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().isoformat()
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {event_type}: {details}\n")

def check_human_approval(action: str) -> bool:
    """
    Cek apakah perlu approval manusia
    Return: True jika aman dijalankan, False jika perlu review
    """
    # Action yang butuh approval
    risky_actions = ["delete", "modify", "deploy", "commit"]
    
    for risky in risky_actions:
        if risky in action.lower():
            print(f"\n⚠️  ACTION REQUIRES APPROVAL: {action}")
            approval = input("Continue? (y/n): ").strip().lower()
            return approval == 'y'
    
    return True
# Test guardrails
if __name__ == "__main__":
    print("🧪 Testing guardrails...")
    
    # Test valid input
    valid, msg = validate_input("Review app.js")
    print(f"1. Valid input: {valid} ({msg or 'OK'})")
    
    # Test dangerous input
    valid, msg = validate_input("rm -rf /")
    print(f"2. Dangerous input: {valid} ({msg})")
    
    # Test rate limit
    print(f"3. Rate limit: {rate_limiter.is_allowed()}")
    
    print("✅ Guardrails ready!")
