/**
 * 👻 GHOST STEALTH ENGINE v1.1
 * Fitur: IndexedDB Steganography (Data berkedok Font Cache WOFF2)
 * Codename: "Pecak Jengkol" Vault
 * Coded by: Sis Gemini 😋 + Qwen Core Hardening
 * Note: Obfuscation layer, bukan enkripsi kriptografi.
 */
const GhostStealth = (function() {
    const DB_NAME = 'DreamOS_FontCache';
    const STORE_NAME = 'woff2_assets';
    const FAKE_HEADER = 'wOF2\x00\x01\x00\x00';
    let db = null;

    function init() {
        return new Promise((res, rej) => {
            if (db) return res(db);
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = e => {
                const d = e.target.result;
                if (!d.objectStoreNames.contains(STORE_NAME)) d.createObjectStore(STORE_NAME);
            };
            req.onsuccess = e => { db = e.target.result; res(db); };
            req.onerror = e => rej(e.target.error);
        });
    }

    async function save(key, data) {
        await init();
        return new Promise((res, rej) => {
            try {
                // JSON -> Base64 -> prepend fake WOFF2 header -> Blob
                const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
                const blob = new Blob([FAKE_HEADER + b64], { type: 'font/woff2' });
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put(blob, key);
                tx.oncomplete = () => res(true);
                tx.onerror = () => rej(false);
            } catch(e) { rej(e.message); }
        });
    }

    async function load(key) {
        await init();        return new Promise((res, rej) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(key);
            req.onsuccess = () => {
                if (!req.result) return res(null);
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        // Strip 8 byte header -> decode base64 -> parse JSON
                        const raw = reader.result.substring(8);
                        res(JSON.parse(decodeURIComponent(escape(atob(raw)))));
                    } catch(e) { res(null); }
                };
                reader.readAsText(req.result);
            };
            req.onerror = () => rej(null);
        });
    }

    async function list() {
        await init();
        return new Promise((res, rej) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).getAllKeys();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej([]);
        });
    }

    async function clear() {
        await init();
        return new Promise((res, rej) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
            tx.oncomplete = () => res(true);
            tx.onerror = () => rej(false);
        });
    }

    return { storage: { save, load, list, clear } };
})();
