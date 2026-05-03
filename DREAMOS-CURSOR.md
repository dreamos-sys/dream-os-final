# Using Dream OS with Cursor & Termux

Dream OS is designed for **mobile-first development** (Termux on Android), but you can also use **Cursor** on desktop for complex edits. This guide helps you apply Karpathy-inspired guidelines across both environments.

---

## 🔄 Hybrid Workflow: Termux + Cursor
[200~### Sync Strategy
1. **Develop in Termux** for 80% of work (mobile-native)
2. **Pull to Cursor** when you need:
   - Multi-file search/replace
   - Visual Git history
   - AI-assisted refactoring (with Karpathy guidelines)
3. **Push back to GitHub** → auto-deploy to Pages
4. **Test in Termux/Kiwi** to confirm mobile compatibility

---

## 🧭 Karpathy Guidelines for Dream OS

When using Cursor AI to help with Dream OS development, these principles ensure quality:

### 1. 🧠 Think Before Coding (Dream OS Context)
```javascript
// ❌ Don't assume:
// "User wants React migration" 

// ✅ Do ask/clarify:
// "Dream OS uses vanilla JS for Termux compatibility. 
//  Should we keep it vanilla, or add a build step?"

// Before suggesting changes, confirm:
// • Will this still run in Termux?
// • Does this increase bundle size significantly?
// • Is this compatible with GitHub Pages static hosting?
```

### 2. ⚡ Simplicity First (Zero-Build Philosophy)
```javascript
// ❌ Avoid:
import { useState, useEffect } from 'react';
// Requires npm, webpack, build step → breaks Termux workflow

// ✅ Prefer:
const state = { count: 0 };
function update() { /* vanilla JS */ }
// Works everywhere, no dependencies

// Rule of thumb: If it needs `package.json`, reconsider.
```

### 3. 🔪 Surgical Changes (Modular Pattern)
```javascript
// When editing js/app.js:
// ✅ DO: Add new module via DreamOS.register()
DreamOS.register('newFeature', {
    init() { /* isolated logic */ }
});

// ❌ DON'T: Rewrite core engine or break existing modules
// DreamOS.run() signature must stay compatible

// Test: After your change, can you still:
// • Login? • Open Command Center? • Activate Ghost Mode?
// If no → revert and try smaller change.
```

### 4. 🎯 Goal-Driven Execution (Verifiable Tests)
```javascript
// Instead of vague: "Fix Command Center"
// Use verifiable goals:

// GOAL: openCommandCenter() toggles UI
console.assert(typeof openCommandCenter === 'function');
openCommandCenter();
console.assert(
    document.getElementById('command-center').style.display === 'block'
);

// GOAL: Menu "Command" card triggers openCommandCenter
const cmdCard = Array.from(document.querySelectorAll('.menu-card'))
    .find(c => c.textContent.includes('Command'));
console.assert(cmdCard?.onclick?.toString().includes('openCommandCenter'));
```

---

## ⚙️ Cursor Setup for Dream OS

### Recommended Settings (`settings.json`)
```json
{
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/*.backup.*": true
  },
  "editor.formatOnSave": false,  // Keep manual control
  "editor.tabSize": 4,           // Match existing style
  "files.associations": {
    "*.html": "html",
    "*.js": "javascript"
  }
}
```

### Project Rules (`.cursor/rules/dreamos-guidelines.mdc`)
```markdown
# Dream OS Development Guidelines

## Context
- Vanilla HTML/CSS/JS only (no build tools)
- Target: Termux + Android browser + GitHub Pages
- File count: Keep ≤3 main files (index.html, js/app.js, optional command-center.js)
- Spiritual elements: Bismillah/Shalawat in UI, prayer-time awareness

## Rules
1. Never suggest npm packages unless explicitly requested
2. Prefer inline functions over complex module systems
3. Test changes against mobile viewport (360px width)
4. Preserve existing CSS class names (no breaking style changes)
5. When in doubt, ask: "Will this still work in Termux?"

## Success Criteria
- ✅ Code runs in Kiwi Browser on Android
- ✅ No console errors after changes
- ✅ File size stays minimal (<50KB gzipped ideal)
- ✅ Git diff shows only intended changes
```

### Optional: Personal Agent Skill
If you use Cursor's agent features, create `~/.cursor/skills/dreamos-assistant.md`:

```markdown
# Dream OS Assistant Skill

You are helping develop Dream OS, a spiritual facility management PWA.

## Key Constraints
- Platform: Termux (Android) + GitHub Pages
- Stack: Vanilla JS, Tailwind CDN, no build step
- Philosophy: Zero-cost, modular, spiritual-first

## Response Guidelines
1. Always confirm mobile compatibility before suggesting changes
2. Prefer surgical edits over rewrites
3. Include console.assert() tests for verifiable goals
4. Respect existing code style (4-space indent, single quotes)
5. When uncertain, ask clarifying questions

## Common Tasks
- Adding new menu modules → use DreamOS.register() pattern
- Fixing UI issues → check CSS specificity & class conflicts
- Debugging → suggest console.log() + Kiwi DevTools workflow
```

---

## 🧪 Testing in Cursor

### Preview Locally
```bash
# In Cursor terminal (or sync to Termux):
python -m http.server 8080
# Open: http://localhost:8080
```

### Mobile Viewport Simulation
1. Open DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
2. Select "Samsung Galaxy S9" or custom 360×640
3. Test touch interactions (tap, swipe, long-press)

### Console Diagnostic Snippet
```javascript
// Paste in Cursor console to verify Dream OS state:
(function diagnose() {
  console.group('🔍 Dream OS Diagnostic');
  console.log('✅ DreamOS:', typeof window.DreamOS);
  console.log('✅ Modules:', Object.keys(window.DreamOS?.modules || {}));
  console.log('✅ Command Center:', typeof window.openCommandCenter);
  console.log('✅ Containers:', {
    cc: !!document.getElementById('command-center'),
    mg: !!document.getElementById('menu-grid')
  });
  console.groupEnd();
})();
```

---

## 🔄 Sync Workflow: Termux ↔ Cursor

### Push from Termux → Cursor
```bash
# In Termux:
cd ~/dream-live
git push origin gh-pages

# In Cursor:
git pull origin gh-pages
# Now you have latest changes to edit
```

### Push from Cursor → Termux
```bash
# In Cursor:
git add -A
git commit -m "feat: your change ✨"
git push origin gh-pages

# In Termux:
git pull origin gh-pages
# Test in Kiwi Browser
```

### Conflict Prevention
- ✅ Edit different files in each environment
- ✅ Pull before starting work in either place
- ✅ Keep changes small & focused (Karpathy Principle #3)
- ✅ Test in Termux after every Cursor session

---

## 🚨 Troubleshooting Cursor + Dream OS

### ❌ "Module not found" errors
```javascript
// Cause: Cursor suggested import statement
// Fix: Replace with vanilla JS pattern
import { something } from 'module';  // ❌ Breaks Termux
const something = window.DreamOS?.modules?.something;  // ✅ Works
```

### ❌ CSS not applying after edit
```css
/* Cause: Cursor added !important or new class */
/* Fix: Match existing specificity */
.glass { /* existing */ }  /* ✅ Keep */
.glass { background: red !important; }  /* ❌ Avoid */
```

### ❌ Console shows "openCommandCenter is not defined"
```javascript
// Cause: Script tag order or cache issue
// Fix: 
// 1. Hard refresh browser
// 2. Check <script> order in index.html:
//    app.js → command-center.js → inline init
// 3. Verify file loads in Network tab (status 200)
```

---

## 🤲 Spiritual Reminder for AI-Assisted Development

> *"Teknologi adalah alat. Niat adalah fondasi.  
>  Setiap baris kode yang lo tulis dengan ikhlas,  
>  bisa jadi amal jariyah yang terus mengalir."*

When using Cursor AI:
- 🤲 Start with Bismillah
- 🎯 Keep user benefit (Kabag Umum) as the goal
- ⚖️ Balance AI suggestions with human wisdom
- 🔍 Verify every change aligns with Dream OS values

---

## 📚 Further Reading

- [Karpathy Guidelines](https://github.com/forrestchang/andrej-karpathy-skills) — Behavioral principles for LLM coding
- [Termux Wiki](https://wiki.termux.com/) — Mobile Linux environment docs
- [GitHub Pages Docs](https://docs.github.com/en/pages) — Static hosting guide
- [Vanilla JS Guide](https://vanillajsguide.com/) — No-framework best practices

---

<div align="center">

### 🤲 Dream OS • Cursor Integration

*"Bi idznillah — dari kolaborasi manusia & AI, lahir sistem yang bermanfaat."*

**v1.3.1 • Sultan Edition**  
*Out of The Box Inside • Spiritual Layer Active*

</div>
