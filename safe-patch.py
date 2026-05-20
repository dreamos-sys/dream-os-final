#!/usr/bin/env python3
# Dream OS Safe HTML Patcher v1.0 - NO REGEX, NO SPLIT BUG

import sys
import os

def safe_patch_html(filepath):
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("📡 Reading index.html...")
    
    # ✅ SAFE: Just append before </body> - no complex string ops
    payload = """
<!-- Dream OS Safe Override v1.0 -->
<style>
  .grid-cols-3 { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 0.75rem !important; }
</style>
<script>
console.log("🛡️ Dream OS Safe Load");
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
}
</script>
"""
    
    # ✅ SAFE: Simple replace, no split/join complexity
    if "</body>" in html:
        html = html.replace("</body>", payload + "\n</body>")
        print("✅ Safe injection complete")
    else:
        print("⚠️ </body> not found - appending to end")
        html += payload
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("🎉 index.html patched safely!")
    return True

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "index.html"
    safe_patch_html(path)
