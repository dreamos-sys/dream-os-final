import json
import sys
from datetime import datetime

def check_collision(new_booking, existing_bookings):
    for b in existing_bookings:
        if b['resource'] == new_booking['resource'] and b['date'] == new_booking['date']:
            # Logika Overlap: (StartA < EndB) and (EndA > StartB)
            if (new_booking['start'] < b['end']) and (new_booking['end'] > b['start']):
                return True, b
    return False, None

def main():
    if len(sys.argv) < 5:
        print("Usage: python3 book_resource.py [Resource] [Date] [Start] [End] [User]")
        return

    new_data = {
        "resource": sys.argv[1],
        "date": sys.argv[2],
        "start": sys.argv[3],
        "end": sys.argv[4],
        "user": sys.argv[5]
    }

    db_path = "/data/data/com.termux/files/home/dream-live/workspaces/koordinator_umum/reports/bookings.json"
    
    with open(db_path, 'r+') as f:
        data = json.load(f)
        collision, conflict_with = check_collision(new_data, data)
        
        if collision:
            print(f"❌ ERROR: Ruangan/Alat sudah dibooking oleh {conflict_with['user']} pada jam {conflict_with['start']}-{conflict_with['end']}")
            sys.exit(1)
        
        data.append(new_data)
        f.seek(0)
        json.dump(data, f, indent=2)
        f.truncate()
        print(f"✅ SUCCESS: Booking {new_data['resource']} berhasil dicatat untuk {new_data['user']}!")

if __name__ == "__main__":
    main()
