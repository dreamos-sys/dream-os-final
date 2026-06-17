import hashlib
import os
# Simulasi user agent (ambil dari Termux environment)
ua = "Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36"
# Layar default HP Android (asumsi 412x915)
screen_info = "412x915-24"
lang = "id-ID"
raw = ua + screen_info + lang
hash_bytes = hashlib.sha256(raw.encode()).hexdigest()
# Ambil 8 karakter pertama dari SHA256 untuk konsistensi (bisa disesuaikan)
short_hash = hash_bytes[:8].upper()
print("DEV-" + short_hash)
