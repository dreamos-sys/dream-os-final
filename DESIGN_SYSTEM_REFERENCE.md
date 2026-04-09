# 🎨 ISO DESIGN SYSTEM - QUICK REFERENCE CARD

## 📐 Layout Structure

```
┌─────────────────────────────────────┐  ← Top
│  HEADER (Static, ~50px)             │
├─────────────────────────────────────┤
│  INFO CARD (~120px)                 │
│  • User profile                     │
│  • Quick stats                      │
├─────────────────────────────────────┤
│  7-SLIDE CAROUSEL (~400px)          │
│  • Auto-advance 7s                  │
│  • Progress bar                     │
│  • Quick nav 3x3                    │
├─────────────────────────────────────┤
│  9-GRID PANEL (~380px)              │
│  • 3x3 layout                       │
│  • 110px per card                   │
│  • 12px gaps                        │
├─────────────────────────────────────┤
│  SPACER (90px)                      │
├─────────────────────────────────────┤
│  NAVBAR (70px + safe area)          │
│  • 5 items                          │
│  • Center QR (56px float)           │
└─────────────────────────────────────┘  ← Bottom
```

---

## 🎨 Color Palette

### Primary Colors:
```
🟢 Primary Green:    #10b981
🔵 Primary Blue:     #3b82f6
🟣 Primary Purple:   #a855f7
🟠 Primary Orange:   #f59e0b
🔴 Primary Red:      #ef4444
🟣 Primary Indigo:   #6366f1
```

### Neutral Colors:
```
⚫ Dark:            #1e293b
⚪ Slate:           #64748b
⚪ Light:           #94a3b8
⚪ Lighter:         #cbd5e1
⚪ Lightest:        #f1f5f9
⚪ White:           #ffffff
```

### Grid Module Colors:
```
🟣 Command Center:  #a855f7
🟢 Booking:         #10b981
🟠 K3 Agent:        #f59e0b
🔵 Security:        #3b82f6
🔵 Janitor Indoor:  #06b6d4
🟢 Janitor Outdoor: #10b981
🟠 Stock:           #f59e0b
🔵 Maintenance:     #3b82f6
⚪ Inventory:       #64748b
```

---

## 🔤 Typography

### Font Families:
```css
Primary:  'Inter', -apple-system, sans-serif
Display:  'Poppins', sans-serif
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Type Scale:
```
0.5rem  (8px)   - Badge text, 800 weight
0.55rem (9px)   - Nav labels, 800 weight
0.6rem  (10px)  - Card subtitles, 500 weight
0.65rem (11px)  - Nav labels, 600-700 weight
0.7rem  (11px)  - Card labels, 700 weight
0.75rem (12px)  - Section titles, 700 weight
0.8rem  (13px)  - Body small, 600 weight
0.85rem (14px)  - Body text, 600 weight
0.9rem  (14px)  - Body large, 600 weight
0.95rem (15px)  - Titles, 700 weight
1.0rem  (16px)  - Base size
1.1rem  (18px)  - Slide titles, 800 weight
1.3rem  (21px)  - Icons, regular
1.5rem  (24px)  - Large icons
```

---

## 📏 Spacing System

### Scale (4px base):
```
4px   - Micro spacing
8px   - Small gaps, icon spacing
12px  - Medium gaps, section padding
16px  - Large padding, container padding
20px  - XL padding
24px  - XXL padding, border radius
```

### Component Spacing:
```
Grid Cards:      12px gap
Nav Items:       4px gap (flex distribute)
Sections:        12px gap
Container:       12px padding
Card Internal:   16px padding
```

---

## 🔲 Border Radius

```
6px   - Badges, small tags
10px  - Detail items, inputs
12px  - Small cards, buttons
14px  - Quick nav items
16px  - Icon containers
20px  - Grid cards
24px  - Main containers, carousel
28px  - Legacy support
50%   - Circular elements (QR button)
```

---

## 🌑 Shadows System

### Level 1 (Rest):
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
```

### Level 2 (Hover):
```css
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
```

### Level 3 (Active):
```css
box-shadow: 
  0 8px 20px rgba(0, 0, 0, 0.15),
  0 4px 12px rgba(0, 0, 0, 0.1);
```

### Level 4 (Floating - QR Button):
```css
box-shadow: 
  0 8px 24px rgba(16, 185, 129, 0.4),
  0 4px 12px rgba(16, 185, 129, 0.3),
  0 0 0 4px rgba(16, 185, 129, 0.1);
```

### Level 5 (Navbar):
```css
box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
```

---

## 🎭 Glassmorphism Formula

### Standard Glass Card:
```css
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.8);
box-shadow: 
  0 4px 20px rgba(0, 0, 0, 0.05),
  0 1px 3px rgba(0, 0, 0, 0.03);
```

### Navbar Glass Effect:
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(20px) saturate(180%);
border-top: 1px solid rgba(226, 232, 240, 0.5);
box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
```

---

## ⚡ Animation Standards

### Timing Functions:
```css
Standard:  cubic-bezier(0.4, 0, 0.2, 1)  /* Material ease */
Bounce:    cubic-bezier(0.68, -0.55, 0.265, 1.55)
Smooth:    cubic-bezier(0.25, 0.1, 0.25, 1)
```

### Duration Scale:
```
150ms  - Micro interactions (button press)
200ms  - Small transitions (hover)
300ms  - Standard transitions (card hover)
500ms  - Major transitions (slide change)
```

### GPU Accelerated Properties:
```css
✅ transform (translate, scale, rotate)
✅ opacity
✅ filter
✅ backdrop-filter

❌ width, height (layout thrashing)
❌ top, left (layout thrashing)
❌ margin, padding (layout thrashing)
```

---

## 📱 Responsive Breakpoints

### Breakpoint System:
```css
/* Small phones */
@media (max-width: 360px) { ... }

/* Standard phones */
@media (min-width: 361px) and (max-width: 767px) { ... }

/* Tablets */
@media (min-width: 768px) { ... }

/* Landscape phones */
@media (max-height: 667px) { ... }
```

---

## 🎯 Touch Target Sizes

### Minimum Sizes (Play Store Standard):
```
48x48px  - Minimum touch target (Material Design)
44x44px  - Minimum touch target (Apple HIG)
56x56px  - QR Scanner button
60px     - Nav items (distributed)
```

### Actual Implementation:
```
Nav Items:      ~60px width (flex distribute)
QR Button:      56x56px (plus 4px ring = 64px)
Grid Cards:     ~110x110px
Quick Nav:      ~90x70px
```

---

## 🌗 Dark Mode Colors (Future)

### Backgrounds:
```css
Dark BG:       #0f172a, #1e293b
Card BG:       rgba(30, 41, 59, 0.7)
Border:        rgba(51, 65, 85, 0.5)
```

### Text:
```css
Primary Text:  #f1f5f9
Secondary:     #cbd5e1
Tertiary:      #94a3b8
```

---

## 🏗️ Z-Index Scale

```
1    - Default
10   - Cards, buttons
50   - Dropdowns
100  - Navbar
200  - Modals
500  - Dialogs
1000 - Toasts, notifications
2000 - Loading overlays
3000 - Tooltips
```

---

## 📊 Component Specifications

### 7-Slide Carousel:
```
Height:       ~400px
Min-height:   380px
Slide Time:   7000ms (7s)
Transition:   500ms ease-out
Indicators:   7 buttons (42x42px)
Quick Nav:    3x3 grid (8px gap)
Progress:     3px height, gradient
```

### 9-Grid Panel:
```
Card Size:    ~110x110px (min)
Icon:         48x48px (16px border-radius)
Gap:          12px
Padding:      16px container
Border:       20px radius
Hover:        -4px translateY
```

### Navbar:
```
Height:       70px + safe area
Items:        5 (flex distributed)
QR Button:    56x56px, -20px offset
Icon:         28x28px container
Label:        0.65rem, 600 weight
Pulse:        3s infinite ease-in-out
```

---

## 🎨 CSS Custom Properties

### Usage Pattern:
```css
/* Define in component */
style="--card-color: #a855f7"

/* Use in CSS */
.card-icon {
  background: var(--card-color);
}
```

### Common Variables:
```css
--card-color       - Grid card accent
--active-color     - Active state color
--nav-color        - Navbar item color
```

---

## ✅ Accessibility Checklist

### Per Component:
```
✓ ARIA labels
✓ Role attributes
✓ Focus visible states
✓ Keyboard navigation
✓ Color contrast (4.5:1)
✓ Touch targets (48px min)
✓ Screen reader text
✓ Reduced motion support
```

---

## 🚀 Performance Targets

### Metrics:
```
First Paint:     < 1s (3G)
Interactive:     < 2s (3G)
Total Bundle:    < 100 KB (gzipped: 30 KB)
FPS:             60 (animations)
Memory:          < 50 MB
```

---

**"Design system yang konsisten, profesional, dan siap produksi!"** 🎨✨
