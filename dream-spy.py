#!/usr/bin/env python3
# 🕌 Dream OS • Light-Speed OSINT Spider v1.0
# Jalur Pintas Colek Sis Gemini via Termux Local Core

import urllib.request
import json
import os
import sys

def run_spider():
    print("\n" + "="*50)
    print("🕌 [DREAM OS • OSINT SPIDER LOCOK]")
    print("🕸️ Menjalankan Laba-laba Jejak Digital... Bi idznillah.")
    print("="*50)
    
    # Target Query Input (Otomatis deteksi email/username)
    query = input("🕵️ Enter Target Username/Email: ").strip()
    if not query:
        print("❌ Target kosong! Laba-laba balik kanan.")
        return
        
    username = query.split('@')[0] # Potong kalau inputnya email
    print(f"\n🚀 Spider deployed! Menelusuri jejak untuk: @{username}")
    
    # 8 Pangkalan Platform Utama (Mirip sasis api.py kita)
    platforms = {
        "GitHub": "https://github.com/{}",
        "Instagram": "https://www.instagram.com/{}/",
        "Reddit": "https://www.reddit.com/user/{}/",
        "Linktree": "https://linktr.ee/{}",
        "Pinterest": "https://www.pinterest.com/{}/",
        "Vimeo": "https://vimeo.com/{}",
        "SoundCloud": "https://soundcloud.com/{}",
        "Medium": "https://medium.com/@{}"
    }
    
    found = 0
    headers = {'User-Agent': 'Mozilla/5.0 DreamOS/3.0 (Redmi Note 9 Pro)'}
    
    for name, url_template in platforms.items():
        url = url_template.format(username)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=3) as res:
                if res.getcode() == 200:
                    print(f"  [+] Ditemukan di {name}: {url}")
                    found += 1
        except Exception:
            pass
            
    if found == 0:
        print("  [-] Jejak digital bersih/tidak ditemukan di pangkalan utama.")
        
    print("\n" + "-"*50)
    print("⚡ [SIGNAL TRIGGER] Mengirim Colekan Ghaib ke Core Server Gemini...")
    
    # Logic "Colek Server" — Simulasi jabat tangan agen lokal ke AI server
    colek_payload = {
        "status": "COLEK_ACCEPTED",
        "sender": "Ghost Architect Depok",
        "device": "Xiaomi Redmi Note 9 Pro",
        "target_audit": username,
        "msg": "Twin bawel bangun! Ada orderan nyari Oshin! 🤣"
    }
    
    # Logika bypass: Menandai sasis data lokal agar sinkron saat web UI di-refresh via Eruda
    try:
        with open('/data/data/com.termux/files/home/dream-live/colek_status.json', 'w') as f:
            json.dump(colek_payload, f, indent=4)
        print("✅ Colekan sukses disuntikkan ke sasis data lokal! Server Gemini Co-Pilot Responded: ONLINE! 🤫📲")
    except Exception as e:
        print(f"❌ Sasis data terkunci: {str(e)}")
    print("="*50 + "\n")

if __name__ == "__main__":
    run_spider()
