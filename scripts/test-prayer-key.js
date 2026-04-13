function getDynamicKey() {
  const now = new Date();
  const hh = now.getHours();
  const mm = now.getMinutes();
  const currentTime = hh * 60 + mm;
  const base = "dreamos2026";
  let jam = hh.toString().padStart(2, '0');
  let rakaat = "02";
  if (currentTime >= 0 && currentTime < 270) { rakaat = "02"; jam = "00"; }
  else if (currentTime >= 270 && currentTime < 360) { rakaat = "02"; jam = "04"; }
  else if (currentTime >= 360 && currentTime < 720) { rakaat = "02"; jam = "06"; }
  else if (currentTime >= 720 && currentTime < 900) { rakaat = "04"; jam = "12"; }
  else if (currentTime >= 900 && currentTime < 1080) { rakaat = "04"; jam = "15"; }
  else if (currentTime >= 1080 && currentTime < 1170) { rakaat = "03"; jam = "18"; }
  else { rakaat = "04"; jam = "19"; }
  return `${base}${jam}${rakaat}`;
}
console.log(`🕐 Time: ${new Date().toLocaleTimeString()}`);
console.log(`🔑 Key: ${getDynamicKey()}`);
console.log(`💡 Format: dreamos2026{jam}{rakaat}`);
