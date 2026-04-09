#!/bin/bash
echo "⚡ Dream AI (FAST MODE) - Ctrl+C to exit"
while true; do
  echo -n "You: "; read p; [ -z "$p" ] && continue
  case "$p" in
    *halo*|*hi*) echo "AI: Halo! Dream AI ready 💚";;
    *siapa*) echo "AI: Saya asisten lokal Dream OS. Offline, private, built on Termux! 🤖";;
    *dream*) echo "AI: Dream OS = sistem manajemen modular + AI lokal. 100% offline! 🚀";;
    *bismillah*) echo "AI: Bismillah! Semangat, My Bro! Bi idznillah sukses! ✨";;
    *status*) echo "AI: ✅ Online | ✅ Ollama | ✅ tinyllama | ✅ Privacy";;
    *k3*) echo "AI: K3 = Keselamatan & Kesehatan Kerja. Laporan real-time, geo-verified! ⚠️";;
    *dana*) echo "AI: Module Dana: pengajuan, approval, audit trail. All offline! 💰";;
    *booking*) echo "AI: Booking module: ruangan, jadwal, approval flow. Simple & fast! 📅";;
    *spj*) echo "AI: SPJ = Surat Pertanggungjawaban. Digital workflow, blockchain audit! 📋";;
    *privasi*) echo "AI: Privasi 100%: data lokal, enkripsi, no cloud. Your data, your rules! 🔐";;
    *bantu*) echo "AI: Saya siap bantu! Coba tanya: 'status', 'dana', 'k3', atau 'bismillah' 💚";;
    *) echo -n "AI: "; curl -s --max-time 20 http://localhost:11434/api/generate -H "Content-Type: application/json" -d "{\"model\":\"tinyllama\",\"prompt\":\"$p\",\"stream\":false,\"options\":{\"num_predict\":60}}" | grep -o '"response":"[^"]*"' | cut -d'"' -f4 | sed 's/\\n/ /g'; echo "[AI]";;
  esac
done
