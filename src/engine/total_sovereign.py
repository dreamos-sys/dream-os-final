import requests
import numpy as np
from memory_bridge import SovereignBrain

class SovereignSystem:
    def __init__(self):
        # Gunakan dimensi 896 (Qwen2.5:0.5b)
        self.brain = SovereignBrain(dimension=896, bit_width=4)
        self.url = "http://localhost:11434/api/embeddings"
        self.model = "qwen2.5:0.5b"
        print(f"🏛️ [Sovereign] System Online. Hardware: Redmi Note 9 Pro")

    def get_ruh(self, text):
        res = requests.post(self.url, json={"model": self.model, "prompt": text})
        return np.array(res.json()["embedding"], dtype=np.float32)

    def learn_and_meditate(self):
        # 1. KASIH INGATAN (Tanam Salak)
        print("\n🌱 [Step 1] Menanam Ingatan...")
        data_pintar = [
            "Redmi Note 9 Pro adalah mesin tempur Sultan",
            "Beksi adalah jurus silat kedaulatan digital",
            "Mas Maturin sekarang jadi Kang Kebon di Dream OS"
        ]
        
        for info in data_pintar:
            vec = self.get_ruh(info)
            self.index_id = self.brain.index.add(np.array([vec]))
            print(f"📥 Tersimpan: {info[:30]}...")

        # 2. TANYA KHODAM (Meditasi)
        print("\n🔮 [Step 2] Khodam Bermeditasi...")
        pertanyaan = "Gimana kabar Xiomay Sultan?"
        print(f"❓ Sultan Nanya: '{pertanyaan}'")
        
        q_vec = self.get_ruh(pertanyaan)
        dist, idx = self.brain.index.search(np.array([q_vec]), 1)
        
        print(f"\n✨ [Hasil Meditasi]")
        print(f"📍 Indeks Memori: {idx}")
        print(f"📍 Tingkat Kemiripan (Distance): {dist}")
        
        if idx.size > 0:
            match_idx = idx[0][0]
            print(f"💡 Khodam Terhubung ke: '{data_pintar[match_idx]}'")
            print("👑 STATUS: BERDAULAT!")
        else:
            print("🚩 Khodam gagal fokus, Sultan!")

if __name__ == "__main__":
    sys = SovereignSystem()
    sys.learn_and_meditate()
