#!/usr/bin/env python3
"""
Fix Komprehensif Command Center Dream OS
- Fix 1: Hapus script tags yang nyasar di template literal print (ROOT CAUSE)
- Fix 2: Tambah polyfill global (safeStorageSet, getUserRole, dll) — idempotent
- Fix 3: Verifikasi final
"""
import re
from pathlib import Path
import subprocess
import tempfile

# ============================================================
# FIX 1: Hapus script tags dari template literal print
# ============================================================
def fix_print_templates():
    print("🔧 FIX 1: Hapus script tags dari template literal...")
    files_to_fix = [
        'modules/janitor-indoor.html',
        'modules/janitor-outdoor.html',
        'modules/qr.html'
    ]
    
    for filepath in files_to_fix:
        path = Path(filepath)
        if not path.exists():
            print(f"  ⚠️  {filepath} tidak ditemukan")
            continue
        
        html = path.read_text(encoding='utf-8')
        original = html
        
        # Hapus Salt Migration Helper dari template literal
        html = re.sub(
            r'\s*\n\s*<!-- Salt Migration Helper -->\s*\n\s*<script src="[^"]*salt-migration\.js"></script>',
            '',
            html, flags=re.S
        )
        
        # Hapus Security Config dari template literal
        html = re.sub(
            r'\s*\n\s*<!-- Security Config \(DO NOT COMMIT\) -->\s*\n\s*<script src="[^"]*config\.js"></script>',
            '',
            html, flags=re.S
        )
        
        # Hapus DOMPurify dari template literal
        html = re.sub(
            r'\s*\n\s*<!-- DOMPurify for XSS protection -->\s*\n\s*<script src="[^"]*load-dompurify\.js"></script>',
            '',
            html, flags=re.S
        )
        
        # Block lengkap (kalau masih ada yang tersisa)
        html = re.sub(
            r'\s*\n\s*<!-- Salt Migration Helper -->.*?<script src="[^"]*salt-migration\.js"></script>\s*\n\s*\n\s*\n\s*<!-- Security Config.*?<script src="[^"]*config\.js"></script>',
            '',
            html, flags=re.S
        )
        
        if html != original:
            path.write_text(html, encoding='utf-8')
            print(f"  ✅ {filepath}")
        else:
            print(f"  ℹ️  {filepath} sudah clean")

# ============================================================
# FIX 2: Tambah polyfill (idempotent — cek dulu kalau sudah ada)
# ============================================================
def add_polyfill():
    print("\n🔧 FIX 2: Tambah polyfill global (idempotent)...")
    filepath = Path('modules/commandcenter.html')
    if not filepath.exists():
        print(f"  ❌ {filepath} tidak ditemukan")
        return
    
    html = filepath.read_text(encoding='utf-8')
    
    # Cek apakah polyfill sudah ada
    if '/* ===== POLYFILL DREAMOS COMMAND CENTER ===== */' in html:
        print("  ℹ️  Polyfill sudah ada, skip")
        return
    
    polyfill = """<script>
/* ===== POLYFILL DREAMOS COMMAND CENTER ===== */
/* 1. safeStorageSet (dipakai saveJSON) */
window.safeStorageSet = window.safeStorageSet || function(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (e) { console.error('[safeStorageSet]', e); return false; }
};

/* 2. __dreamosRegisterInterval */
window.__dreamosRegisterInterval = window.__dreamosRegisterInterval || function(id) {
  window.__dreamosLastInterval = id; return id;
};

/* 3. getUserRole */
window.getUserRole = window.getUserRole || function() {
  try { var b = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}'); return b.role || 'staff'; }
  catch (e) { return 'staff'; }
};

/* 4. CloudPhoto.dataURLtoBlob */
window.CloudPhoto = window.CloudPhoto || {};
window.CloudPhoto.dataURLtoBlob = window.CloudPhoto.dataURLtoBlob || function(dataUrl) {
  var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

/* 5. Supabase client placeholder */
if (!window.supabaseClient) {
  window.supabaseClient = null;
  console.warn('[DreamOS] supabaseClient belum diinisialisasi. Mode lokal aktif.');
}
</script>
"""
    
    # Sisipkan sebelum </head>
    if '</head>' in html:
        html = html.replace('</head>', polyfill + '\n</head>', 1)
        filepath.write_text(html, encoding='utf-8')
        print("  ✅ Polyfill ditambahkan ke commandcenter.html")
    else:
        print("  ❌ </head> tidak ditemukan")

# ============================================================
# FIX 3: Verifikasi final
# ============================================================
def verify_all():
    print("\n🔧 FIX 3: Verifikasi semua file...")
    import glob
    
    issues = 0
    for f in sorted(glob.glob('modules/*.html')):
        html = Path(f).read_text(encoding='utf-8')
        for m in re.finditer(r'<script([^>]*)>(.*?)</script>', html, re.S):
            attrs = m.group(1)
            content = m.group(2).strip()
            
            if 'src=' in attrs: continue
            if 'application/ld+json' in attrs or 'application/json' in attrs: continue
            if not content: continue
            if re.match(r'^\s*<script\s+src\s*=', content, re.I): continue
            
            with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as t:
                t.write(content); path = t.name
            r = subprocess.run(['node', '--check', path], capture_output=True, text=True)
            if r.returncode != 0:
                issues += 1
                line_no = html[:m.start()].count('\n') + 1
                print(f"  ❌ {f}:{line_no}")
    
    if issues == 0:
        print("  ✅ ALL MODULES CLEAN — 0 syntax errors!")
    else:
        print(f"  ⚠️  {issues} issue(s) remaining")
    return issues == 0

# ============================================================
# MAIN
# ============================================================
if __name__ == '__main__':
    print("🚀 DreamOS Command Center Fix v2.0\n")
    fix_print_templates()
    add_polyfill()
    success = verify_all()
    
    if success:
        print("\n🏆 Fix complete! Commit & push sekarang.")
        print("\n📋 Jalankan:")
        print("   git add -A")
        print('   git commit -m "fix(commandcenter): print template cleanup + polyfill"')
        print("   git push origin gh-pages")
    else:
        print("\n⚠️  Masih ada error, perlu fix manual.")
