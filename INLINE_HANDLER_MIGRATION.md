# Inline Handler Migration Guide

## Current Status
- **1171 inline handlers** remaining
- Priority: HIGH (security + maintainability)

## Migration Strategy

### Phase 1: High-Traffic Modules
1. `booking.html` (most used)
2. `security.html` (critical ops)
3. `profile.html` (user-facing)

### Phase 2: Medium-Traffic Modules
4. `k3.html`
5. `janitor-indoor.html`
6. `janitor-outdoor.html`

### Phase 3: Low-Traffic Modules
7. `asset.html`
8. `stok.html`
9. `maintenance.html`
10. Others

## Migration Pattern

### BEFORE (Inline Handler)
```html
<button onclick="saveData()">Save</button>
<input onchange="validate()" />
```

### AFTER (Event Listener)
```html
<button id="save-btn">Save</button>
<input id="input-field" />

<script>
(function(){
  document.getElementById('save-btn').addEventListener('click', saveData);
  document.getElementById('input-field').addEventListener('change', validate);
})();
</script>
```

## Benefits
- ✅ Better security (CSP compliant)
- ✅ Easier debugging (stack traces)
- ✅ Better separation of concerns
- ✅ Prevents XSS via inline code injection
- ✅ Meets WCAG 2.2 AA standards

## Progress Tracking
- [ ] Phase 1: booking.html (0/50 handlers)
- [ ] Phase 1: security.html (0/75 handlers)
- [ ] Phase 1: profile.html (0/30 handlers)
- [ ] Phase 2: k3.html (0/60 handlers)
- [ ] Phase 2: janitor-indoor.html (0/45 handlers)
- [ ] Phase 2: janitor-outdoor.html (0/45 handlers)
- [ ] Phase 3: Others (0/866 handlers)

**Total: 0/1171 migrated**
