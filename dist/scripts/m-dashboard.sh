#!/bin/bash
DB_FILE="$HOME/dream-live/workspaces/koordinator_umum/reports/bookings.json"

echo "==============================================="
echo "📊 DASHBOARD BOOKING DIGITAL - DREAM OS"
echo "==============================================="
echo -e "RUANGAN\t\t| TANGGAL\t| JAM\t\t| USER"
echo "-----------------------------------------------"

python3 -c "
import json
try:
    with open('$DB_FILE', 'r') as f:
        data = json.load(f)
        for b in data:
            print(f\"{b['resource']}\t| {b['date']}\t| {b['start']}-{b['end']}\t| {b['user']}\")
except:
    print('Belum ada data booking.')
"
echo "==============================================="
