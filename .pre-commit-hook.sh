#!/bin/bash
# Pre-commit hook: cek syntax JavaScript sebelum commit

echo "🔍 Checking JavaScript syntax..."

# Extract inline scripts dari HTML files
python3 << 'PY'
import re
import sys
from pathlib import Path

errors = []
for html_file in Path('.').rglob('*.html'):
    if 'backups/' in str(html_file) or 'node_modules/' in str(html_file):
        continue
    
    c = html_file.read_text(encoding='utf-8', errors='replace')
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', c, re.S)
    
    for i, script in enumerate(scripts):
        # Cek pola yang jelas rusak
        if re.search(r'\.then\(\(\) => \)', script):
            errors.append(f"{html_file}: script {i+1} has broken Promise chain")
        if re.search(r'\.then\(\(\) => \'', script):
            errors.append(f"{html_file}: script {i+1} has incomplete string")
        if re.search(r'\bcatch\(\(\) => \)', script):
            errors.append(f"{html_file}: script {i+1} has broken catch block")

if errors:
    print("❌ Syntax errors detected:")
    for err in errors:
        print(f"  {err}")
    sys.exit(1)
else:
    print("✅ All inline scripts look good")
    sys.exit(0)
PY
