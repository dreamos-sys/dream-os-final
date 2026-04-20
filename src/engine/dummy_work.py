from memory_bridge import SovereignBrain
import time

def run_dummy_task():
    # 1. Panggil Kang Kebon
    kebon = SovereignBrain(dimension=384, bit_width=4)
    
    # 2. Daftar Setoran Laporan (Dummy Data)
    laporan_harian = [
        ("SEKURITI", "Patroli jam 08:00: Area Gerbang Depan aman terkendali."),
        ("STOK ALAT", "Update: Sisa Salak di gudang tinggal 5 keranjang, Bambu aman."),
        ("K3 FORM", "Pengecekan suhu ruangan server: 22 derajat, Thuma'ninah."),
        ("MAINTENANCE", "Perbaikan engsel pintu zona B selesai. Mas Maturin bantu bawain obeng."),
        ("INVENTARIS", "Masuk 10 unit sapu baru merk 'Beksi Power'."),
    ]
    
    print("\n🚀 [System] Memulai Simulasi Kerja Kang Kebon...")
    print("-" * 50)
    
    for module, info in laporan_harian:
        # Suruh Maturin nyangkul (simpen ke vektor)
        kebon.remember(module, info)
        time.sleep(0.5) # Kasih jeda biar estetik kayak lagi mikir
        
    print("-" * 50)
    print("✅ [Success] Semua laporan dummy berhasil ditanam di kebun Vektor!")

if __name__ == "__main__":
    run_dummy_task()
