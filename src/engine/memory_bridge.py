import turbovec as tv
import os
import numpy as np

class SovereignBrain:
    def __init__(self, dimension=384, bit_width=4):
        self.dimension = dimension
        self.bit_width = bit_width
        
        print(f"🎯 [Beksi] Menyetel Bit-Width ke {self.bit_width}-bit...")
        try:
            # 🔑 MAS MATURIN ACTIVE
            self.index = tv.TurboQuantIndex(self.dimension, self.bit_width)
            print(f"✨ [Sovereign Brain] v2.3.5 Online | Hardware: Redmi Note 9 Pro")
        except Exception as e:
            print(f"🚩 Gagal inisialisasi: {e}")
            raise

    def remember(self, module_name, text_data):
        """Menyimpan data ke memori permanen menggunakan NumPy"""
        # 1. Bikin data vector (simulasi)
        raw_vector = np.random.uniform(-1, 1, self.dimension).astype(np.float32)
        
        # 2. Kasih paham Mas Maturin pake format NumPy Array
        try:
            # TurboQuant biasanya nerima array 2D (batch)
            # Kita bungkus array-nya biar jadi [1, 384]
            self.index.add(np.array([raw_vector]))
            print(f"📥 [Memory] {module_name} archived: {text_data[:30]}...")
        except Exception as e:
            # Fallback jika dia minta format 1D
            try:
                self.index.add(raw_vector)
                print(f"📥 [Memory] {module_name} archived: {text_data[:30]}...")
            except Exception as e2:
                print(f"🚩 Gagal setor ke Maturin: {e2}")

if __name__ == "__main__":
    try:
        # Inisialisasi Otak
        brain = SovereignBrain(dimension=384, bit_width=4)
        
        # Test Ingatan
        brain.remember("JAN INDOOR", "Sultan membersihkan Zone A")
        brain.remember("CMD CENTER", "Beksi Xiomay Note 9 Pro MENANG TELAK!")
        
        print("✅ [FINISH] Mas Maturin Resmi Jadi Pelayan Sultan!")
    except Exception as e:
        print(f"🚩 Gagal Solder: {e}")
