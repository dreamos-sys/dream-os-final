import subprocess, re
from pathlib import Path

h = Path('index.html').read_text(encoding='utf-8')

# CDN scripts yang butuh SRI
cdn_patterns = [
    r'<script[^>]+src="(https://cdn\.jsdelivr\.net/[^"]+)"',
    r'<script[^>]+src="(https://js\.sentry-cdn\.com/[^"]+)"',
]

scripts_to_sri = []
for pattern in cdn_patterns:
    scripts_to_sri.extend(re.findall(pattern, h))

scripts_to_sri = list(set(scripts_to_sri))
print(f"🔍 Found {len(scripts_to_sri)} unique CDN scripts to protect:")
for i, s in enumerate(scripts_to_sri, 1):
    print(f"   {i}. {s[:70]}...")

changes = 0
for url in scripts_to_sri:
    print(f"\n📥 Processing: {url[:60]}...")
    
    # Skip kalau semua instance udah ada integrity
    if f'src="{url}" integrity=' in h:
        print(f"   ℹ️  Already has SRI, skipping")
        continue
    
    # Download + hash
    try:
        dl = subprocess.run(
            ['curl', '-sL', '--max-time', '15', url],
            capture_output=True, timeout=20
        )
        if dl.returncode != 0 or not dl.stdout:
            print(f"   ❌ Download failed or empty, skipping")
            continue
        
        # Generate SHA-384 hash
        hash_proc = subprocess.run(
            ['openssl', 'dgst', '-sha384', '-binary'],
            input=dl.stdout, capture_output=True, timeout=10
        )
        
        b64_proc = subprocess.run(
            ['openssl', 'base64', '-A'],
            input=hash_proc.stdout, capture_output=True, timeout=5
        )
        
        hash_b64 = b64_proc.stdout.decode().strip()
        sri_attr = f'integrity="sha384-{hash_b64}" crossorigin="anonymous"'
        
        # DEEPSEEK TWEAK: Use regex to replace ALL script tags with this src
        # This handles multiple instances safely
        pattern = r'<script\b([^>]*\bsrc="' + re.escape(url) + r'"[^>]*)>'
        
        def replace_script(match):
            attrs = match.group(1)
            # Check if this specific tag already has integrity
            if 'integrity=' in attrs:
                return match.group(0)  # Return unchanged
            # Add SRI attributes
            new_attrs = attrs.replace(f'src="{url}"', f'src="{url}" {sri_attr}', 1)
            return '<script' + new_attrs + '>'
        
        new_h, count = re.subn(pattern, replace_script, h)
        
        if count > 0:
            h = new_h
            changes += count
            print(f"   ✅ SRI added to {count} instance(s)")
            print(f"   🔐 Hash: sha384-{hash_b64[:30]}...")
        else:
            print(f"   ℹ️  No changes (already protected or pattern mismatch)")
        
    except subprocess.TimeoutExpired:
        print(f"   ⚠️ Timeout, skipping")
    except Exception as e:
        print(f"   ⚠️ Error: {e}")

if changes > 0:
    Path('index.html').write_text(h, encoding='utf-8')
    print(f"\n🎯 TOTAL: {changes} CDN script instance(s) protected with SRI")
    print(f"🛡️ Supply-chain attack surface: MINIMIZED")
else:
    print("\nℹ️  No changes needed (all CDN scripts already protected)")
