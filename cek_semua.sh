#!/bin/bash
echo "==========================================="
echo "       AUDIT KEDAULATAN DREAM OS v3.6      "
echo "==========================================="
echo "-> Direktori Utama (Root Files):"
ls -p | grep -v /
echo "-------------------------------------------"
echo "-> Direktori Sistem (Folders):"
ls -d */
echo "==========================================="
echo "✅ Audit Selesai. Bi idznillah!"
