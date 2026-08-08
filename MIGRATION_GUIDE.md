
# 🔄 MIGRATION GUIDE: Cara pakai Security Layer

## BEFORE (Risky):
```javascript
el.innerHTML = `<div>${user.nama}</div>`;
el.innerHTML = `<a href="${user.website}">Link</a>`;
window.myFunction = function() { ... };
```

## AFTER (Safe):
```javascript
el.innerHTML = `<div>${esc(user.nama)}</div>`;
el.innerHTML = `<a href="${safeUrl(user.website)}">Link</a>`;

// Error boundary
await safeExec(function() {
  // code yang bisa throw
}, this, function(err) {
  showToast('Gagal: ' + err.message, 'error');
});

// Event delegation (ganti inline onclick)
DreamOSSecurity.delegate('#container', 'click', '.btn-delete', function(e, btn) {
  const id = btn.dataset.id;
  deleteItem(id);
});

// Offline queue
DreamOSQueue.push('bookings', 'upsert', booking, { onConflict: 'id' });
```

## Gradual Migration:
1. Ganti `innerHTML` pakai `esc()` → priority HIGH
2. Wrap modul init dengan `safeExec()` → priority HIGH  
3. Ganti inline onclick → priority MEDIUM
4. Pakai `DreamOSQueue.push()` → priority MEDIUM
