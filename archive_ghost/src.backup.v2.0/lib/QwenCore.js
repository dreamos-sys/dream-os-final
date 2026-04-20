export const askQwen = async (query) => {
  const d = new Date();
  const hh = d.getHours().toString().padStart(2, '0');
  const t = d.getHours() * 60 + d.getMinutes();
  
  // Logika Rakaat Master (17:00++ = Ashar)
  let r = (t >= 1080 && t < 1170) ? "03" : ((t >= 270 && t < 720) ? "02" : "04");
  const ghostKey = `dreamos2026${hh}${r}`;

  const lowQuery = query.toLowerCase();

  // JIKA ADA LOCAL AI ENGINE (WASM / OLLAMA)
  try {
    // Master bisa arahkan ke localhost:11434 jika jalanin Ollama di Termux
    // const response = await fetch('http://localhost:11434/api/generate', { ... });
    
    if (lowQuery.includes("status")) return `Ghost Key Aktif: ${ghostKey}. CPU Load: 12% (WASM Active).`;
    if (lowQuery.includes("terminal")) return "WASM Terminal Bridge: Membuka jalur virtual ke /data/data/com.termux...";
    if (lowQuery.includes("scan")) return "AI Lokal: Sedang melakukan Deep Scanning pada direktori /src...";
    
    return "Qwen: Menunggu instruksi lanjutan untuk optimasi WASM...";
  } catch (e) {
    return "Qwen: Gagal terhubung ke AI Lokal, menggunakan Mode Standalone.";
  }
};
