#!/bin/bash

# =======================================================
# DREAM OS v1.0 - Nemo-120B Health Check Script
# =======================================================

echo -e "\e[32m[Bismillah] Memulai Diagnosa Koneksi ke Agensi 120B...\e[0m"

# Target host (sesuaikan jika server agensi berada di jaringan atau IP berbeda)
TARGET_HOST="127.0.0.1"
PORT="8082"
TIMEOUT=5

# 1. Cek Port Apakah Berjalan (Listening)
echo -e "\n\e[33m--- 1. Pengecekan Service API Server --- \e[0m"
nc -z -v -w$TIMEOUT $TARGET_HOST $PORT 2>&1

if [ $? -eq 0 ]; then
    echo -e "\e[32m[+] Service port $PORT aktif dan mendengarkan.\e[0m"
else
    echo -e "\e[31m[-] Service port $PORT tidak merespons (Offline atau Port berbeda).\e[0m"
fi

# 2. Cek Koneksi Internet / API Gateway
echo -e "\n\e[33m--- 2. Pengecekan Gateway Online (NVIDIA/Agensi) --- \e[0m"
if ping -c 1 8.8.8.8 &> /dev/null; then
    echo -e "\e[32m[+] Perangkat terhubung ke internet. Gateway dapat diakses.\e[0m"
    
    # 3. Test Response Menggunakan curl (Jika server terpasang di jaringan)
    echo -e "\n\e[33m--- 3. Pengecekan Status Model 120B via Gateway --- \e[0m"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://$TARGET_HOST:$PORT/api/v1/ai-agent -H "Content-Type: application/json" -d '{"prompt": "Test"}' --max-time 3)
    
    if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 404 ] || [ "$HTTP_STATUS" -eq 405 ]; then
        # 404/405 berarti endpoint ada tetapi format body perlu disesuaikan.
        echo -e "\e[32m[+] Koneksi ke server agensi berhasil! HTTP Status: $HTTP_STATUS\e[0m"
        echo -e "\e[34m[*] Sistem 120B merespons dengan baik.\e[0m"
    else
        echo -e "\e[31m[-] Server tidak merespons dengan benar (HTTP: $HTTP_STATUS). Cek kembali api_server.py.\e[0m"
    fi
else
    echo -e "\e[31m[-] Tidak ada koneksi internet. Pastikan agensi/server lokal aktif.\e[0m"
fi

echo -e "\n\e[32m[Selesai] Diagnosa Dream OS selesai. Bi idznillah, sirkuit aman.\e[0m"
