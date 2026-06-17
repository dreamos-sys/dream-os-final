// Fungsi yang sama dengan di HTML
const ua = "Mozilla/5.0 (Linux; Android 12; Mobile)"; // kamu bisa ganti dengan user agent asli jika perlu
const screenInfo = screen ? `${screen.width}x${screen.height}-${screen.colorDepth}` : "412x915-24";
const raw = ua + screenInfo + (navigator ? navigator.language : "id-ID");
let h = 0;
for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h) + raw.charCodeAt(i);
    h |= 0;
}
console.log('DEV-' + Math.abs(h).toString(16).toUpperCase().slice(0,8));
