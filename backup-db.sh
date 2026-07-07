#!/bin/bash
# Dream OS Database Backup Script
# Simpan di cronjob atau jalankan manual

BACKUP_DIR="$HOME/dream-os-final/db-backups"
mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/dreamos_backup_$DATE.json"

echo "🔄 Membackup data dari Supabase..."

# Backup semua tabel publik (gunakan anon key untuk select)
curl -s -X GET "https://gbigjdhifispatrrskgh.supabase.co/rest/v1/users?select=*" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k" \
  > "$BACKUP_FILE.users"

curl -s -X GET "https://gbigjdhifispatrrskgh.supabase.co/rest/v1/k3_reports?select=*" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k" \
  > "$BACKUP_FILE.k3"

curl -s -X GET "https://gbigjdhifispatrrskgh.supabase.co/rest/v1/audit_logs?select=*" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k" \
  > "$BACKUP_FILE.audit"

echo "✅ Backup selesai: $BACKUP_FILE.*"
echo "📁 Lokasi: $BACKUP_DIR"
