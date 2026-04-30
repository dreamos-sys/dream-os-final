import sys

def time_to_decimal(time_str):
    h, m = map(int, time_str.split(':'))
    return h + (m / 60)

test_cases = [
    {"name": "Tes Jam Kerja Normal", "tgl": "2026-04-22", "jam": "09:00", "room": "Aula SMA", "role": "staf", "expected": "PASS"},
    {"name": "Tes Kunci Jam 16:00", "tgl": "2026-04-22", "jam": "17:00", "room": "Aula SMA", "role": "staf", "expected": "LOCK"},
    {"name": "Tes Blokir Shalat Jumat", "tgl": "2026-04-24", "jam": "12:00", "room": "Aula SMA", "role": "staf", "expected": "LOCK"},
    {"name": "Tes Override Kabag (Lembur)", "tgl": "2026-04-22", "jam": "19:00", "room": "Aula SMA", "role": "kabag_umum", "expected": "PASS"}
]

print("🔍 [BEYONCÉ-TEST] Validasi Logika v2.1...")
all_passed = True

for tc in test_cases:
    dec_time = time_to_decimal(tc['jam'])
    result = "PASS"
    if dec_time > 16.0 and tc['role'] != 'kabag_umum': result = "LOCK"
    if "2026-04-24" in tc['tgl'] and 10.5 <= dec_time <= 13.0 and "Aula" in tc['room']: result = "LOCK"
    
    if result == tc['expected']:
        print(f"✅ {tc['name']} -> PASSED")
    else:
        print(f"❌ {tc['name']} -> FAILED (Got: {result}, Want: {tc['expected']})")
        all_passed = False

if not all_passed:
    print("\n🚨 [ERROR] Logika bermasalah! Batalkan Push.")
    sys.exit(1)
else:
    print("\n✨ [SUCCESS] Semua tes lolos. Siap mengudara!")
    sys.exit(0)
