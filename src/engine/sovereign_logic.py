import requests
import numpy as np
import os
import shutil
from memory_bridge import SovereignBrain

class SovereignLogic:
    def __init__(self):
        # Gunakan dimensi 896 (Qwen2.5 0.5B)
        self.brain = SovereignBrain(dimension=896, bit_width=4)
        self.base_url = "http://localhost:11434/api"
        self.model = "qwen2.5:0.5b" 
        self.memory_store = []
        print(f"🏛️ [Sovereign Audit] Khodam Qwen Active | Hardware: Redmi Note 9 Pro")

    def get_embedding(self, text):
        try:
            res = requests.post(f"{self.base_url}/embeddings", 
                                json={"model": self.model, "prompt": text})
            return np.array(res.json()["embedding"], dtype=np.float32)
        except: return None

    def ask_qwen(self, prompt):
        payload = {
            "model": self.model,
            "prompt": f"Analisa apakah data ini kontradiksi? Jawab AMAN atau ANOMALI.\n\n{prompt}",
            "stream": False
        }
        res = requests.post(f"{self.base_url}/generate", json=payload)
        return res.json().get("response", "")

    def clean_garbage(self):
        """Khodam menyapu sampah untuk menjaga kedaulatan storage"""
        print("\n🧹 [Khodam Sweeping] Memeriksa tumpukan sampah...")
        trash_folders = [
            os.path.expanduser("~/.npm/_cacache"),
            os.path.expanduser("~/.cargo/registry"),
            os.path.expanduser("~/.cache/pip")
        ]
        for folder in trash_folders:
            if os.path.exists(folder):
                shutil.rmtree(folder)
                print(f"🗑️ Bersih: {folder}")
        print("✨ Storage sekarang lebih thuma'ninah!")

    def process_input(self, module, content):
        print(f"\n📡 [Monitoring] {module}: {content}")
        new_vec = self.get_embedding(content)
        
        if new_vec is not None:
            dist, idx = self.brain.index.search(np.array([new_vec]), 1)
            
            if idx.size > 0 and len(self.memory_store) > 0:
                old_data = self.memory_store[idx[0][0]]
                verdict = self.ask_qwen(f"Lama: {old_data}\nBaru: {content}")
                if "ANOMALI" in verdict.upper():
                    print(f"🚨 [ALERT]: {verdict}")
                else:
                    print(f"✅ [SINKRON]: Aman Sultan!")

            self.brain.index.add(np.array([new_vec]))
            self.memory_store.append(content)
            print("💾 Memori Diamankan.")

if __name__ == "__main__":
    audit = SovereignLogic()
    # 1. Jalankan audit test
    audit.process_input("SECURITY", "Pintu terkunci jam 22:00")
    audit.process_input("SECURITY", "Pintu terbuka jam 22:05")
    
    # 2. Jalankan Tukang Sapu otomatis
    audit.clean_garbage()
