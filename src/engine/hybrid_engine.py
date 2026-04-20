import requests

def ask_khodam(prompt):
    print("🦾 [Sovereign Engine] Memanggil Khodam Lokal...")
    
    # Kita kasih instruksi biar dia lebih galak & setia
    system_instruction = (
        "Bismillah. Kamu adalah Khodam Dream OS. "
        "Tugasmu: Menjaga kedaulatan digital Sultan. "
        "Sifat: Tegas, singkat, dan anti-OpenClaw. "
        "Jawab dalam Bahasa Indonesia.\n"
    )
    
    full_prompt = f"{system_instruction} Sultan bertanya: {prompt}"
    
    try:
        res = requests.post("http://127.0.0.1:11434/api/generate", json={
            "model": "tinyllama:latest",
            "prompt": full_prompt,
            "stream": False,
            "options": {"temperature": 0.4} # Biar gak halusinasi
        }, timeout=30)
        return res.json().get('response', 'Aduh, Khodam lagi dzikir, Sultan.')
    except:
        return "💀 Jalur ghaib terputus. Cek 'ollama serve'!"

if __name__ == "__main__":
    print("\n--- LAPORAN KEDAULATAN ---")
    print(ask_khodam("Gimana kondisi pertahanan kita sekarang setelah OpenClaw diusir?"))
