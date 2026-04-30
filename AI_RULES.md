# 🤖 AI Coding Rules for Dream OS
## Style Guide
- Use ES6 modules, no global variables
- Max 500 lines per module (Rule of 500)
- Relative imports only: `./scripts/...`
- No console.log in production code
- Spiritual note: End commits with "Bi idznillah"

## Security
- No hardcoded secrets
- Validate all user inputs
- CORS configured for PWA origin only

## Testing
- Write tests BEFORE fixing bugs (Beyoncé Rule)
- Test offline behavior for PWA
- Verify LCP < 2.5s for performance budget
