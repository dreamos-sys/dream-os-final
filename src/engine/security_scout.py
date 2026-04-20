import subprocess
import os

def run_scout(target_email):
    # Bersihkan email dari spasi atau karakter newline yang gak keliatan
    target_email = target_email.strip()
    
    print(f"📡 [Audit] Mengintai jejak digital: {target_email}...")
    
    try:
        # Gunakan shell=False (lebih aman) dan pastikan argumen bersih
        cmd = ["holehe", target_email, "--only-used"]
        result = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
        
        print("\n🔎 [Findings] Email ditemukan di:")
        print(result)
        
        with open("audit_report.txt", "w") as f:
            f.write(f"Audit Target: {target_email}\nFindings:\n{result}")
            
    except subprocess.CalledProcessError as e:
        print(f"🚩 Holehe Protes! Output: {e.output}")
    except Exception as e:
        print(f"🚩 Jalur Ghaib Terputus: {e}")

if __name__ == "__main__":
    email = input("Masukkan Email Audit (Gunakan huruf standar): ")
    run_scout(email)
