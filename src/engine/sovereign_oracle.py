import requests
import numpy as np
from memory_bridge import SovereignBrain

class SovereignOracle:
    def __init__(self):
        # Dimensi 896 untuk Qwen2.5 0.5B
        self.brain = SovereignBrain(dimension=896, bit_width=4)
        self.ollama_url = "http://localhost:11434/api/embeddings"
        self.model_name = "qwen2.5:0.5b"
        print(f"🔮 [Oracle] Khodam Siap Bermeditasi...")

    def meditate(self, query):
        """Mencari Memori yang paling mirip dengan makna query"""
        print(f"🔍 [Meditasi] Menyelami makna: '{query}'")
        
        # 1. Ambil Ruh (Embedding) dari Ollama
        payload = {"model": self.model_name, "prompt": query}
        try:
            res = requests.post(self.ollama_url, json=payload)
            query_vec = np.array(res.json()["embedding"], dtype=np.float32)
            
            # 2. Cari di Kebun Vektor (Hantam langsung angkanya!)
            # Format: .search(array_input, jumlah_hasil)
            results = self.brain.index.search(np.array([query_vec]), 2)
            
            print(f"✨ [Hasil] Khodam menemukan koneksi ghaib!")
            print(f"📍 Jarak & Indeks: {results}")
            return results
        except Exception as e:
            print(f"🚩 [Gagal] Khodam terganggu: {e}")
            return None

if __name__ == "__main__":
    oracle = SovereignOracle()
    # Tanya soal Note 9 Pro
    oracle.meditate("Apa kabar Note 9 Pro?")
