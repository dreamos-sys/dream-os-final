export const panggilMrM = () => {
    const g = document.getElementById('ghost-container');
    g.style.display = 'block';
    g.innerHTML = `
        <div style="background:#000; color:#0f0; font-family:monospace; padding:20px; border:2px solid #0f0; border-radius:15px; font-size:10px; height:300px; overflow-y:auto;">
            <p>> [SYSTEM] INITIALIZING 120B-CLOUD...</p>
            <p>> [120B] Mr. M is analyzing Dream OS v4.0...</p>
            <hr style="border-color:#0f0">
            <p style="color:#ff0">⚠️ COMPLEXITY AUDIT:</p>
            <p>- app.js: SLIM (PASSED)</p>
            <p>- sw.js: REBEL (PASSED)</p>
            <p>- modules: MODULAR (PASSED)</p>
            <p style="color:#0ff">🛡️ KEDAULATAN LEVEL: SOVEREIGN</p>
            <br>
            <p>> [120B]: "Arsitektur sudah bersih, Jenderal. Mana sebungkus kopinya?"</p>
            <button onclick="document.getElementById('ghost-container').style.display='none'" style="background:#0f0; color:#000; border:none; padding:5px 10px; cursor:pointer; font-weight:bold;">CLOSE TERMINAL</button>
        </div>`;
};
