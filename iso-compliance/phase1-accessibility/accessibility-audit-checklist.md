# Dream OS - Accessibility Audit Checklist (WCAG 2.2 Level AA)

## A. PERCEIVABLE (Dapat Dirasakan)

### 1.1 Text Alternatives
- [ ] Semua icon punya aria-label
- [ ] Semua gambar punya alt text
- [ ] Icon button punya descriptive label
- [ ] Emoji diganti dengan text alternatif

### 1.2 Time-based Media
- [ ] Video/audio punya caption (jika ada)
- [ ] Audio description tersedia

### 1.3 Adaptable
- [ ] Konten bisa ditampilkan dalam layout berbeda
- [ ] Reading order logis
- [ ] Instructions tidak bergantung pada sensory characteristics

### 1.4 Distinguishable
- [ ] Color contrast ratio >= 4.5:1 (text normal)
- [ ] Color contrast ratio >= 3:1 (text besar 18pt+)
- [ ] Text bisa di-zoom 200% tanpa broken
- [ ] Tidak mengandalkan warna saja untuk informasi
- [ ] Audio autoplay bisa dikontrol

## B. OPERABLE (Dapat Dioperasikan)

### 2.1 Keyboard Accessible
- [ ] Semua fungsi bisa diakses via keyboard
- [ ] Tidak ada keyboard trap
- [ ] Shortcut keyboard bisa dimatikan

### 2.2 Enough Time
- [ ] Waktu cukup untuk membaca & menggunakan
- [ ] Bisa pause/stop/move konten bergerak
- [ ] Session timeout bisa diperpanjang

### 2.3 Seizures and Physical Reactions
- [ ] Tidak ada konten berkedip > 3x/detik
- [ ] Animation bisa dimatikan

### 2.4 Navigable
- [ ] Skip to content link tersedia
- [ ] Page title deskriptif
- [ ] Focus order logis
- [ ] Link purpose jelas dari text
- [ ] Multiple ways untuk find page
- [ ] Headings & labels deskriptif
- [ ] Focus visible (ada indicator)

### 2.5 Input Modalities
- [ ] Touch target minimal 44x44 pixels
- [ ] Pointer gestures bisa dibatalkan
- [ ] Motion actuation bisa dimatikan
- [ ] Target size minimal 24x24 CSS pixels

## C. UNDERSTANDABLE (Dapat Dipahami)

### 3.1 Readable
- [ ] Language of page didefinisikan
- [ ] Language of parts didefinisikan

### 3.2 Predictable
- [ ] On focus tidak ada perubahan unexpected
- [ ] On input tidak ada perubahan unexpected
- [ ] Consistent navigation
- [ ] Consistent identification

### 3.3 Input Assistance
- [ ] Error identification jelas
- [ ] Labels & instructions tersedia
- [ ] Error suggestion ada
- [ ] Error prevention untuk important actions

## D. ROBUST (Kokoh)

### 4.1 Compatible
- [ ] Valid HTML/ARIA
- [ ] Name, role, value complete
- [ ] Status messages bisa diprogram
