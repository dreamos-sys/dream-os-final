#!/system/bin/env bash
set -e

# Backup files
timestamp=$(date +%s)
for f in $(grep -rl "user-scalable=no" --include="*.html" .); do
  cp "$f" "$f.bak-$timestamp"
done
cp css/dashboard.css css/dashboard.css.bak-$timestamp

# 1) Hapus user-scalable=no dari semua file HTML
python3 << 'PY'
from pathlib import Path
import re

files = list(Path('.').rglob('*.html'))
for f in files:
    text = f.read_text(encoding='utf-8', errors='replace')
    new = re.sub(r'user-scalable=no\s*', '', text)
    if new != text:
        f.write_text(new, encoding='utf-8')
        print(f'  ✅ user-scalable dihapus: {f}')
PY

# 2) Hapus duplikasi blok MODULE SHELL ULTIMATE STABILITY di dashboard.css
python3 << 'PY'
from pathlib import Path
import re

p = Path('css/dashboard.css')
css = p.read_text(encoding='utf-8')

marker = "/* ============================================================\n   MODULE SHELL ULTIMATE STABILITY"
# Hitung kemunculan blok marker
count = css.count(marker)
if count > 1:
    # Ambil posisi marker kedua dan seterusnya, hapus hingga sebelum marker berikutnya atau akhir
    # Simpan bagian sebelum marker kedua
    idx_first = css.find(marker)
    idx_second = css.find(marker, idx_first + 1)
    if idx_second != -1:
        # Hapus semua dari marker kedua sampai akhir (karena blok duplikat biasanya ada di akhir)
        css = css[:idx_second].rstrip() + "\n"
        p.write_text(css, encoding='utf-8')
        print(f'  ✅ Duplikasi blok MODULE SHELL dihapus (dari {count} menjadi 1)')
    else:
        print('  ⚠️ Marker kedua tidak ditemukan, cek manual')
else:
    print('  ℹ️ Tidak ada duplikasi, skip')
PY

echo "✅ Perbaikan selesai. Silakan jalankan ulang audit."
