import subprocess
import sys
import json
import re

def extract_host(url):
    # Membersihkan URL jadi Host/IP saja
    host = re.sub(r'https?://', '', url).split('/')[0].split(':')[0]
    return host

def sting(target):
    host = extract_host(target)
    print(f"🕵️ V-Spider: Merayap ke {target}...")
    print(f"⚡ Menyuntikkan Nmap Venom ke {host}...")
    
    # Memanggil Nmap dari Nix (Unprivileged mode agar aman di proot/android)
    nmap_cmd = f"nmap -F -Pn --unprivileged {host}"
    scan_result = subprocess.getoutput(nmap_cmd)
    
    print("🧠 AI Judge: Menganalisa hasil gigitan...")
    # Mengirim hasil scan ke AI Judge untuk mencari kerentanan
    ai_cmd = f"echo 'Analyze this nmap output for security risks. Be concise. Output: {scan_result}' | ollama run qwen2.5:0.5b"
    analysis = subprocess.getoutput(ai_cmd)
    
    print("\n📝 --- LAPORAN INTEL V-SPIDER ---")
    print(f"🎯 Target: {host}")
    print(f"📊 Scan:\n{scan_result}")
    print(f"💡 AI Analysis:\n{analysis}")
    print("---------------------------------\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sting(sys.argv[1])
    else:
        print("Usage: python3 spider_venom.py <target>")
