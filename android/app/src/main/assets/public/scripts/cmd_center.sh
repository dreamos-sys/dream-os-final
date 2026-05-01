#!/bin/bash
WORKSPACE=$1
REGISTRY="$HOME/dream-live/config/registry.workspaces.json"

if [[ -z "$WORKSPACE" ]]; then
    echo "🕶️ [COMMAND-CENTER] Pilih Ruang Kerja: kabag_umum | koordinator_umum"
    return 1 2>/dev/null || exit 1
fi

# Ambil data
AGENT=$(python3 -c "import json, sys; d=json.load(open('$REGISTRY')); print(d['$WORKSPACE']['agent'])")
WPATH=$(python3 -c "import json, sys; d=json.load(open('$REGISTRY')); print(d['$WORKSPACE']['path'])")

# EVALUASI PATH (PENTING!)
ACTUAL_PATH=$(eval echo $WPATH)

if [ -d "$ACTUAL_PATH" ]; then
    cd "$ACTUAL_PATH"
    echo "------------------------------------------------"
    echo "🏛️ MEMASUKI RUANG KERJA: $WORKSPACE"
    echo "👤 ASISTEN AKTIF: m-$AGENT"
    echo "📂 LOKASI: $PWD"
    echo "------------------------------------------------"
    
    # Refresh index otomatis pas masuk
    bash ~/dream-live/scripts/m-index-refresh.sh
    
    # Briefing
    bash ~/dream-live/scripts/modular_brain.sh $AGENT "Saya sudah duduk. Berikan ringkasan cepat berkas di meja ini."
else
    echo "❌ Folder tidak ditemukan: $ACTUAL_PATH"
fi
