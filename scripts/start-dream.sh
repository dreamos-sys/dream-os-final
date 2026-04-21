#!/bin/bash
echo "🚀 MEMBANGUNKAN DREAM OS NEURAL ENGINE..."

# Jalankan Llama-server di background
cd ~/dream-os
nohup llama-server -m ./models/small_brain.gguf -c 2048 --port 8080 --host 0.0.0.0 > neural.log 2>&1 &
echo "🧠 Neural Brain: LOADING (Check neural.log for status)"

sleep 2

# Jalankan Tunnel SSH
echo "🛰️ Membuka Jalur Awan (Tunnel)..."
ssh -R 80:localhost:8080 localhost.run
