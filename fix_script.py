from pathlib import Path
import re

p = Path('index.html')
h = p.read_text(encoding='utf-8')

# Step 1: Cari semua <script> dengan line number
opens = []
for m in re.finditer(r'<script\b', h):
    opens.append((m.start(), h[:m.start()].count('\n') + 1))

print(f"📊 Total <script> buka: {len(opens)}")

# Step 2: Cari kebocoran (script yang TIDAK punya </script> sebelum <script> berikutnya)
for i in range(len(opens) - 1):
    pos_start, line_start = opens[i]
    pos_next, line_next = opens[i + 1]
    
    between = h[pos_start:pos_next]
    
    if '</script>' not in between:
        print(f"\n🕳️  KEBocoran: line {line_start} kebuka sampai line {line_next}")
        
        # Cari IIFE closing di range ini (paling aman)
        iife_pattern = re.compile(r'\}\)\s*\(\s*\)\s*;?\s*\n|\}\)\s*;?\s*\n')
        matches = list(iife_pattern.finditer(between))
        
        if matches:
            # Ambil yang PALING AKHIR (sebelum <script> next)
            last = matches[-1]
            inject_pos = pos_start + last.end()
            inject_line = h[:inject_pos].count('\n') + 1
            
            h = h[:inject_pos] + '</script>\n\n' + h[inject_pos:]
            p.write_text(h, encoding='utf-8')
            
            print(f"✅ </script> disisipkan di line {inject_line}")
        else:
            print(f"⚠️ Tidak ada IIFE closing di range — fallback: inject sebelum line {line_next}")
            h = h[:pos_next] + '</script>\n\n' + h[pos_next:]
            p.write_text(h, encoding='utf-8')
            print(f"✅ </script> disisipkan sebelum line {line_next}")
        
        break
else:
    print("✅ Tidak ada kebocoran (atau kebocoran di script terakhir)")

# Final balance check
o = len(re.findall(r'<script\b', h))
c = len(re.findall(r'</script>', h))
print(f"\n⚖️  Buka: {o} | Tutup: {c} | Selisih: {o - c}")
if o == c:
    print("✅ SEIMBANG!")
