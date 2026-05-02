#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# 🛡️ DREAM OS LAUNCHER v2.0 — BASH EDITION
# Sovereign Modular AI Agent | Termux + GitHub Ready
# ==============================================================================

# ── CONFIG ────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RESET='\033[0m'
PROJECT_DIR="$HOME/dream-live"
GITHUB_REPO="https://github.com/dreamos-sys/dream-os-final.git"
# ──────────────────────────────────────────────────

# Header
echo -e "${CYAN}╔═══════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║   🛡️  DREAM OS LAUNCHER v2.0  🛡️   ║${RESET}"
echo -e "${CYAN}║   Sovereign • Modular • Silent      ║${RESET}"
echo -e "${CYAN}╚═══════════════════════════════════════╝${RESET}"

# Cek dependency
check_deps() {
    local missing=()
    command -v git >/dev/null || missing+=("git")
    command -v node >/dev/null || missing+=("nodejs")
    command -v python3 >/dev/null || missing+=("python3")
    
    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "${YELLOW}[!] Installing missing: ${missing[*]}${RESET}"
        pkg install ${missing[*]} -y >/dev/null 2>&1
    fi
}

# Setup struktur folder modular (Addy Osmani style)
setup_structure() {
    echo -e "${GREEN}[1/5] Setting up modular structure...${RESET}"
    mkdir -p "$PROJECT_DIR"/{core,modules/{auth,dashboard,command,qr,settings},assets,styles,locales,.github/workflows}
    
    # .gitignore untuk gh-pages (hanya static files)
    cat > "$PROJECT_DIR/.gitignore" << 'GITIGNORE'
# Backend (jangan expose ke gh-pages)
*.py
__pycache__/
*.pyc
venv/
.env

# Dev tools
node_modules/
*.log
.DS_Store
# Secrets (jangan commit!)
config/secrets.json
*.key
GITIGNORE
}

# Save index.html (yang user paste tadi)
save_index_html() {
    echo -e "${GREEN}[2/5] Saving index.html (fully wired)...${RESET}"
    cat > "$PROJECT_DIR/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="id" dir="ltr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0f172a">
    <title>Dream OS v2.0 — Sovereign Agent</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        spiritual: { 500: '#22c55e', 700: '#15803d' },
                        gold: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
                        slate: { 850: '#172033', 900: '#0f172a' }
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .font-arabic { font-family: 'Amiri', serif; }
        .view { display: none; opacity: 0; transition: opacity 0.2s ease; }
        .view.active { display: block; opacity: 1; }
        #dream-logo { touch-action: manipulation; transition: transform 0.1s; }
        #dream-logo:active { transform: scale(0.92); }
        .grid-item:active { transform: scale(0.95); }
    </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-screen flex flex-col overflow-hidden">
    <!-- AUTH SCREEN -->
    <section id="auth-view" class="view active flex flex-col items-center justify-center h-full p-6 text-center">
        <div id="dream-logo" class="mb-6 cursor-pointer select-none">
            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/30 flex items-center justify-center text-4xl font-bold text-white">D</div>
            <p class="text-xs text-gold-500 mt-2 font-semibold tracking-widest">DREAM OS</p>
        </div>        <h1 class="font-arabic text-3xl text-gold-600 mb-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h1>
        <p class="text-sm text-spiritual-500 mb-8">اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ</p>
        <div class="w-full max-w-sm bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div class="relative mb-6">
                <input type="password" id="access-key" placeholder="Access Key" class="w-full px-4 py-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-gold-500 text-center tracking-widest text-lg">
                <button id="toggle-pw" class="absolute right-3 top-4 text-slate-400 hover:text-gold-500">
                    <svg id="eye-off" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    <svg id="eye-on" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
            </div>
            <button id="btn-login" class="w-full py-4 bg-gradient-to-r from-spiritual-500 to-spiritual-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">ACCESS SYSTEM</button>
            <p class="text-xs text-slate-400 mt-4">Bi idznillah — Niat lurus, sistem terjaga.</p>
        </div>
    </section>
    <!-- MAIN APP -->
    <div id="app-view" class="view flex flex-col h-full">
        <header class="px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-white font-bold text-xs">D</div>
                <div><h1 class="text-sm font-bold leading-none">Dream OS</h1><span class="text-[10px] text-slate-500">v2.0 • Limited 2026</span></div>
            </div>
            <div class="flex items-center gap-3">
                <span id="role-badge" class="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold rounded-md uppercase text-slate-500">STAFF</span>
                <button id="btn-logout" class="text-slate-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
            </div>
        </header>
        <main class="flex-1 overflow-y-auto p-4 pb-20 space-y-6">
            <div id="view-dashboard" class="view-section active space-y-4">
                <div class="bg-gradient-to-r from-spiritual-600 to-spiritual-800 p-4 rounded-2xl text-white shadow-lg">
                    <p class="text-sm opacity-90">Selamat Pagi, Saudara.</p>
                    <h2 class="text-xl font-bold mt-1">Siap Melayani.</h2>
                </div>
                <div class="grid grid-cols-3 gap-3" id="staff-grid"></div>
            </div>
            <div id="view-command" class="view-section hidden space-y-4">
                <div class="flex justify-between items-center"><h2 class="text-lg font-bold text-gold-500">Command Center</h2><span class="text-xs bg-slate-700 px-2 py-1 rounded">AI Ready</span></div>
                <div class="bg-slate-800 p-3 rounded-xl border border-slate-700"><input type="text" placeholder="🔍 Cari 'AC 2016' atau 'SPJ Maret'..." class="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"></div>
                <div class="grid grid-cols-2 gap-3" id="command-grid"></div>
            </div>
        </main>
        <nav class="fixed bottom-0 w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 flex justify-around items-center h-16 z-50">
            <button class="nav-btn active flex flex-col items-center gap-1 text-gold-500 w-full" data-target="dashboard"><span class="text-xl">🏠</span><span class="text-[10px]">Home</span></button>
            <button class="nav-btn flex flex-col items-center gap-1 text-slate-400 w-full" data-target="profile"><span class="text-xl">👤</span><span class="text-[10px]">User</span></button>
            <button class="nav-btn flex flex-col items-center gap-1 text-slate-400 w-full" data-target="qr"><span class="text-xl">📷</span><span class="text-[10px]">QR</span></button>
            <button class="nav-btn flex flex-col items-center gap-1 text-slate-400 w-full" data-target="info"><span class="text-xl">ℹ️</span><span class="text-[10px]">Info</span></button>
            <button class="nav-btn flex flex-col items-center gap-1 text-slate-400 w-full" data-target="config"><span class="text-xl">⚙️</span><span class="text-[10px]">Config</span></button>
        </nav>
    </div>    <script>
        const state = { role: 'STAFF', currentView: 'dashboard', ghostTaps: 0, ghostTimer: null };
        const grids = {
            staff: [
                {icon:'📅', label:'Booking'}, {icon:'⚠️', label:'K3 Form'}, {icon:'🔧', label:'Maintenance'},
                {icon:'🛡️', label:'Sekuriti'}, {icon:'🧹', label:'Janitor In'}, {icon:'🌿', label:'Janitor Out'},
                {icon:'📦', label:'Stok Alat'}, {icon:'🛠️', label:'Maintenance'}, {icon:'🏢', label:'Inventaris'}
            ],
            command: [
                {icon:'📊', label:'Kinerja Global'}, {icon:'💰', label:'Keuangan & SPJ'},
                {icon:'📦', label:'Inventaris Aset'}, {icon:'🤝', label:'Vendor Tracker'},
                {icon:'👥', label:'SDM & Tugas'}, {icon:'📈', label:'Laporan Bulanan'},
                {icon:'🔍', label:'Audit Trail'}, {icon:'⚙️', label:'System Config'}
            ]
        };
        const $ = id => document.getElementById(id);
        const showView = id => { document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden')); $(id).classList.remove('hidden'); };
        const switchTab = id => { document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-gold-500'); b.classList.add('text-slate-400'); }); document.querySelector(`[data-target="${id}"]`).classList.replace('text-slate-400','text-gold-500'); };
        const renderGrid = (containerId, data) => {
            const container = $(containerId);
            container.innerHTML = data.map(item => `<div class="grid-item bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-center aspect-square hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition-all active:scale-95" onclick="alert('Modul ${item.label} dipanggil!')"><span class="text-2xl">${item.icon}</span><span class="text-xs font-semibold">${item.label}</span></div>`).join('');
        };
        window.addEventListener('DOMContentLoaded', () => {
            renderGrid('staff-grid', grids.staff);
            renderGrid('command-grid', grids.command);
            $('toggle-pw').onclick = () => { const input = $('access-key'); const isPass = input.type === 'password'; input.type = isPass ? 'text' : 'password'; $('eye-off').classList.toggle('hidden', isPass); $('eye-on').classList.toggle('hidden', !isPass); };
            $('btn-login').onclick = () => { const key = $('access-key').value; if(!key) return alert('Masukkan Access Key!'); state.role = key.includes('admin') || key.includes('kepala') ? 'KEPALA_BAGIAN' : 'STAFF'; $('role-badge').textContent = state.role.replace('_', ' '); $('auth-view').classList.remove('active'); $('app-view').classList.add('active'); if(state.role === 'KEPALA_BAGIAN') $('view-command').classList.remove('hidden'); else showView('view-dashboard'); };
            $('btn-logout').onclick = () => { $('app-view').classList.remove('active'); $('auth-view').classList.add('active'); $('access-key').value = ''; state.role = 'STAFF'; };
            document.querySelectorAll('.nav-btn').forEach(btn => { btn.onclick = () => { const target = btn.dataset.target; switchTab(target); if(target === 'dashboard') showView('view-dashboard'); else if(target === 'profile') alert('👤 Profile (ISO 27001 Ready)'); else if(target === 'qr') alert('📷 QR Scanner Loaded'); else if(target === 'info') alert('ℹ️ About Dream OS v2.0'); else if(target === 'config') alert('⚙️ Settings: Theme, Language, Geo-Prayer'); }; });
            $('dream-logo').addEventListener('pointerdown', () => { state.ghostTaps++; if(state.ghostTaps === 1) state.ghostTimer = setTimeout(() => state.ghostTaps = 0, 2000); if(state.ghostTaps >= 7) { clearTimeout(state.ghostTimer); state.ghostTaps = 0; alert('👻 GHOST PROTOCOL ACTIVATED\nSilent OSINT, Spider & AI Scanner Ready.'); }; });
        });
    </script>
</body>
</html>
HTMLEOF
}

# Create manifest.json (PWA installable)
create_pwa_files() {
    echo -e "${GREEN}[3/5] Creating PWA files...${RESET}"
    
    # manifest.json
    cat > "$PROJECT_DIR/manifest.json" << 'MANIFEST'
{
  "name": "Dream OS — Smiling General",
  "short_name": "DreamOS",
  "description": "Sovereign Modular AI Agent Framework",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#0f172a",  "theme_color": "#10b981",
  "icons": [],
  "lang": "id",
  "dir": "ltr"
}
MANIFEST

    # sw.js (Service Worker minimal)
    cat > "$PROJECT_DIR/sw.js" << 'SW'
const CACHE = 'dream-os-v2.0';
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/index.html', '/manifest.json']))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
SW
}

# Start local server for testing
start_server() {
    echo -e "${GREEN}[4/5] Starting local server...${RESET}"
    echo -e "${CYAN}-------------------------------------------------${RESET}"
    echo -e "${YELLOW}🌐 Open in browser: http://127.0.0.1:8080${RESET}"
    echo -e "${CYAN}🔑 Test login: ketik 'admin' untuk role KEPALA_BAGIAN${RESET}"
    echo -e "${CYAN}👻 Ghost Mode: tap logo 'D' 7x cepat${RESET}"
    echo -e "${CYAN}-------------------------------------------------${RESET}"
    cd "$PROJECT_DIR"
    python3 -m http.server 8080
}

# Push ke GitHub (gh-pages branch)
push_github() {
    echo -e "${GREEN}[5/5] Preparing GitHub deploy...${RESET}"
    
    cd "$PROJECT_DIR"
    
    # Init git kalau belum
    if [ ! -d ".git" ]; then
        git init
        git remote add origin "$GITHUB_REPO" 2>/dev/null || true
    fi
    
    # Input commit message
    echo -ne "${YELLOW}Commit message${RESET} [default: 'feat: launch dream-os v2.0']: "
    read msg
    MSG=${msg:-"feat: launch dream-os v2.0"}
    
    # Checkout/create gh-pages branch
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    
    # Add files (hanya static files untuk gh-pages)
    git add index.html manifest.json sw.js .nojekyll assets/ styles/ locales/ core/ modules/ 2>/dev/null
        # Commit & push
    git commit -m "$MSG"
    git push origin gh-pages --force
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SUCCESS! Dream OS Live at:${RESET}"
        echo -e "${CYAN}   https://dreamos-sys.github.io/dream-os-final/${RESET}"
    else
        echo -e "${RED}❌ Push failed. Check: git remote -v${RESET}"
    fi
}

# Menu utama
show_menu() {
    echo -e "\n${YELLOW}╔══ MAIN MENU ═════════════════╗${RESET}"
    echo -e "${YELLOW}║${RESET}  ${GREEN}1${RESET}) 🚀 Start Local Server (Test)  ${YELLOW}║${RESET}"
    echo -e "${YELLOW}║${RESET}  ${GREEN}2${RESET}) 📦 Build & Push to GitHub     ${YELLOW}║${RESET}"
    echo -e "${YELLOW}║${RESET}  ${GREEN}3${RESET}) 👻 Test Ghost Mode (Silent)   ${YELLOW}║${RESET}"
    echo -e "${YELLOW}║${RESET}  ${GREEN}4${RESET}) 📁 View Project Structure    ${YELLOW}║${RESET}"
    echo -e "${YELLOW}║${RESET}  ${RED}0${RESET}) ❌ Exit                        ${YELLOW}║${RESET}"
    echo -e "${YELLOW}╚══════════════════════════════╝${RESET}\n"
    echo -ne "${CYAN}Pilih [1-4/0]: ${RESET}"
    read choice
}

# Main loop
main() {
    check_deps
    setup_structure
    save_index_html
    create_pwa_files
    
    while true; do
        show_menu
        case $choice in
            1) start_server; break;;
            2) push_github; break;;
            3) echo -e "${CYAN}[i] Tap logo 'D' 7x cepat di browser untuk test Ghost Mode${RESET}"; sleep 2;;
            4) tree -L 2 "$PROJECT_DIR" 2>/dev/null || ls -la "$PROJECT_DIR";;
            0) echo -e "\n${GREEN}Bi idznillah — Sistem berhenti.${RESET}"; exit 0;;
            *) echo -e "${RED}Pilihan tidak valid.${RESET}"; sleep 1;;
        esac
    done
}

# Run
main "$@"
