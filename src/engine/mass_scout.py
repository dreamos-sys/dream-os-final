import subprocess
import time

def mass_audit():
    with open("target_emails.txt", "r") as f:
        emails = f.readlines()
    
    print(f"🚀 [Sovereign Audit] Memulai penyisiran {len(emails)} email...")
    
    for email in emails:
        email = email.strip()
        if not email: continue
        
        print(f"\n--- 📧 Auditing: {email} ---")
        try:
            # Jalankan holehe
            res = subprocess.check_output(["holehe", email, "--only-used"], text=True)
            print(res)
            # Simpan log per email
            with open(f"logs_{email}.txt", "w") as log:
                log.write(res)
        except:
            print(f"🚩 Gagal cek {email}")
        
        time.sleep(2) # Biar gak kena rate limit (Sabar itu thuma'ninah)

if __name__ == "__main__":
    mass_audit()
