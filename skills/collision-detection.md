# SKILL: Anti-Double Booking Logic
- **Input**: Resource_ID, Date, Start_Time, End_Time.
- **Logic**: (StartA < EndB) AND (EndA > StartB).
- **Verification**: Jika overlap ditemukan, return Error 409 (Conflict).
- **Atomic**: Proses pengecekan dan penulisan harus dilakukan dalam satu rangkaian (Locking mechanism).
