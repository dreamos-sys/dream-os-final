#!/bin/bash
echo -e "\e[32m[Bismillah] Memeriksa Sirkuit Dream OS...\e[0m"

# 1. Cek Service API Server (120B)
nc -z -v -w3 127.0.0.1 8082 2>&1

if [ $? -eq 0 ]; then
    echo -e "\e[32m[+] Server Port 8082 Listening.\e[0m"
else
    echo -e "\e[31m[-] Service offline.\e[0m"
fi

# 2. Cek koneksi internet (menggunakan ping github yang santai)
echo -e "\n\e[33m--- Testing Koneksi Internet --- \e[0m"
ping -c 2 github.com > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "\e[32m[+] Koneksi Internet Terhubung. Sirkuit Aman.\e[0m"
else
    echo -e "\e[31m[-] Tidak ada koneksi, tapi server lokal aman.\e[0m"
fi
