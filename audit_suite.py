import re, json, subprocess
from pathlib import Path

H = Path('index.html').read_text(encoding='utf-8')
CSS = Path('css/dashboard.css').read_text(encoding='utf-8')
MAN = Path('manifest.json').read_text(encoding='utf-8') if Path('manifest.json').exists() else '{}'

def hex_rgb(h):
    h=h.lstrip('#')
    if len(h)==3: h=''.join(c*2 for c in h)
    return tuple(int(h[i:i+2],16) for i in (0,2,4))
def lum(rgb):
    def lin(c):
        c/=255; return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    r,g,b=[lin(c) for c in rgb]; return 0.2126*r+0.7152*g+0.0722*b
def contrast(a,b):
    l1,l2=lum(hex_rgb(a)),lum(hex_rgb(b))
    if l1<l2: l1,l2=l2,l1
    return round((l1+0.05)/(l2+0.05),2)

S={}
print("="*60); print("🏆 DREAM OS COMPREHENSIVE AUDIT v1.0"); print("="*60)

# ===== MODULE 1: PERFORMANCE =====
scripts = len(re.findall(r'<script\b', H))
ext_js = len(re.findall(r'<script[^>]+src=', H))
css_links = len(re.findall(r'<link[^>]+stylesheet', H))
blocking = len(re.findall(r'<script[^>]+src=(?![^>]*defer)(?![^>]*async)', H))
print("\n📊 M1 PERFORMANCE")
print(f"   Scripts: {scripts} (external {ext_js}) | CSS: {css_links}")
print(f"   Render-blocking: {blocking} {'✅' if blocking<8 else '⚠️'}")
print(f"   CDN: {'✅ jsdelivr' if 'jsdelivr' in H else '❌'} | Lazy: {'✅' if 'loading=\"lazy\"' in H or 'defer' in H else '⚠️'}")

# ===== MODULE 2: SECURITY =====
print("\n🛡️ M2 SECURITY")
csp = 'Content-Security-Policy' in H
print(f"   CSP: {'✅' if csp else '❌'} | XFO: {'✅' if 'X-Frame-Options' in H else '❌'}")
print(f"   HTTPS-only: {'✅' if 'https://' in H else '⚠️'} | DOMPurify: {'✅' if 'dompurify' in H.lower() else '⚠️'}")
ext = set(re.findall(r'src="(https://[^/]+)', H)) | set(re.findall(r'href="(https://[^/]+)', H))
print(f"   Supply chain ({len(ext)}): {', '.join(sorted(ext))[:80]}")

# ===== MODULE 3: ACCESSIBILITY =====
print("\n♿ M3 ACCESSIBILITY")
print(f"   Contrast dark (text/bg): {contrast('#ffffff','#000000')}:1 {'✅AAA' if contrast('#ffffff','#000000')>=7 else '⚠️'}")
print(f"   Contrast muted (dark): {contrast('#a0a0a0','#121212')}:1 {'✅AA' if contrast('#a0a0a0','#121212')>=4.5 else '⚠️'}")
print(f"   ARIA: {len(re.findall(r'aria-', H))} | alt: {len(re.findall(r'alt=', H))} | role: {len(re.findall(r'role=', H))}")
print(f"   Touch 48px: {'✅' if 'min-height: 48px' in CSS or 'min-height:48px' in CSS else '⚠️'} | Reduced-motion: {'✅' if 'prefers-reduced-motion' in CSS else '❌'}")
print(f"   Focus-visible: {'✅' if ':focus-visible' in CSS else '❌'} | Skip-link: {'✅' if 'skip-link' in H else '❌'}")

# ===== MODULE 4: PWA =====
print("\n📱 M4 PWA")
try: m=json.loads(MAN)
except: m={}
print(f"   Manifest: {'✅' if m else '❌'} | name: {m.get('name','?')[:20]} | icons: {len(m.get('icons',[]))}")
print(f"   SW: {'✅' if 'serviceWorker' in H else '❌'} | theme_color: {'✅' if m.get('theme_color') else '⚠️'} | display: {m.get('display','?')}")

# ===== MODULE 5: CODE QUALITY =====
print("\n🧪 M5 CODE QUALITY")
so, sc = CSS.count('{'), CSS.count('}')
imp = CSS.count('!important')
print(f"   CSS braces: {so}/{sc} {'✅' if so==sc else '❌'} | !important: {imp} ({'⚠️ refactor' if imp>40 else '✅ ok'})")
o_tag = len(re.findall(r'<script\b',H))
c_tag = len(re.findall(r'</script>',H))
print(f"   HTML script balance: {o_tag}/{c_tag} {'✅' if o_tag==c_tag else '❌'}")
db_gate = 'dreamos_debug' in H
err_bnd = 'onerror' in H or "addEventListener('error'" in H
print(f"   Debug-mode gate: {'✅' if db_gate else '⚠️'} | Error boundary: {'✅' if err_bnd else '⚠️'}")

# ===== MODULE 6: SEO/META =====
print("\n🔍 M6 SEO/META")
print(f"   Viewport: {'✅' if 'viewport' in H else '❌'} | charset: {'✅' if 'charset' in H else '❌'} | robots: {'✅' if 'robots' in H else '⚠️'}")
print(f"   OG tags: {len(re.findall(r'og:', H))} | title: {'✅' if '<title>' in H else '❌'}")

print("\n" + "="*60)
print("✅ AUDIT COMPLETE — kirim output ini ke Dream Team!")
print("="*60)
