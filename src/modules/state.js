export const State = {
    async sync() {
        console.log("🛰️ Syncing Body State...");
        try {
            // Tarik data dari pilar folder data/
            const [prayRes, zikirRes] = await Promise.all([
                fetch('./data/prayer.json'),
                fetch('./data/zikir.json')
            ]);
            
            if (!prayRes.ok || !zikirRes.ok) throw new Error("Cloud Data Unreachable");

            const pray = await prayRes.json();
            const zikir = await zikirRes.json();
            
            return { pray, zikir };
        } catch (e) { 
            console.error("❌ State Sync Failed:", e);
            return null; 
        }
    }
};
