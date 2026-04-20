import requests
import numpy as np
from memory_bridge import SovereignBrain

class SovereignSoul:
    def __init__(self):
        # Otak 4-bit Kang Kebon (Dimension 896 untuk Qwen2.5 0.5B)
        self.brain = SovereignBrain(dimension=896, bit_width=4)
        self.ollama_emb_url = "http://localhost:11434/api/embeddings"
        self.model_name = "qwen2.5:0.5b"
        print(f"✨ [Soul] Khodam Digital Active | Model: {self.model_name}")

    def get_embedding(self, text):
        """Merubah kalimat Sultan jadi Vektor via Qwen"""
        payload = {"model": self.model_name, "prompt": text}
        try:
            res = requests.post(self.ollama_emb_url, json=payload)
            # Ambil array embedding dari response
            return np.array(res.json()["embedding"], dtype=np.float32)
        except Exception as e:
            print(f"🚩 [Error] Gagal ambil Ruh: {e}")
            return None

    def archive_wisdom(self, module, content):
        """Ikat Ruh data ke Kebun Vektor"""
        vector = self.get_embedding(content)
        if vector is not None:
            # Masukan ke Index Maturin (2D Array)
            self.brain.index.add(np.array([vector]))
            print(f"📥 [Archive] {module}: '{content[:30]}...' TERSIMPAN!")

if __name__ == "__main__":
    soul = SovereignSoul()
    soul.archive_wisdom("SYSTEM", "Bismillah, kedaulatan AI dimulai hari ini.")
    soul.archive_wisdom("CMD", "Beksi Xiomay Note 9 Pro menaklukan dunia.")
