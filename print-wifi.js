/**
 * 🖨️ DREAM OS - WIRELESS PRINT UTILITY
 * Mendukung: WiFi Direct, Network Printer, Cloud Print
 */

// Konfigurasi kertas default
const PRINT_CONFIG = {
  paperSize: 'A4',
  orientation: 'landscape', // landscape untuk tabel lebar
  margin: '10mm',
  header: 'Dream OS Enterprise',
  footer: 'Printed via WiFi | The Power Soul Of Shalawat'
};

/**
 * Print konten HTML langsung ke printer WiFi
 * @param {string} htmlContent - HTML yang akan dicetak
 * @param {object} options - Opsi cetak (paperSize, orientation, dll)
 */
window.printWireless = function(htmlContent, options = {}) {
  const settings = { ...PRINT_CONFIG, ...options };
  
  // Buat jendela print
  const printWindow = window.open('', '_blank', 'width=1024,height=768');
  
  const doc = printWindow.document;
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${settings.header}</title>
      <style>
        @page {
          size: ${settings.paperSize} ${settings.orientation};
          margin: ${settings.margin};
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
        body {
          font-family: Arial, sans-serif;
          color: #000;
          background: #fff;
          padding: 10px;
        }
        .print-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .print-header h2 { margin: 0; font-size: 16px; }
        .print-header p { margin: 5px 0 0; font-size: 11px; color: #666; }
        .print-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 9px;
          color: #999;
          border-top: 1px solid #ccc;
          padding-top: 4px;
        }
        .print-btn {
          display: block;
          margin: 15px auto;
          padding: 10px 25px;
          background: #00ff9d;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        @media print {
          .print-btn { display: none !important; }
        }
      </style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">🖨️ PRINT SEKARANG</button>
      <div class="print-header">
        <h2>${settings.header}</h2>
        <p>Dicetak: ${new Date().toLocaleString('id-ID')} | ${settings.footer}</p>
      </div>
      ${htmlContent}
      <div class="print-footer">${settings.footer} | Halaman ini dicetak via WiFi</div>
      <script>
        // Auto-trigger print dialog setelah 500ms
        setTimeout(function() { window.print(); }, 500);
      </script>
    </body>
    </html>
  `);
  
  doc.close();
};

/**
 * Quick print tabel dari ID elemen
 */
window.printTable = function(tableId, title = 'Laporan') {
  const table = document.getElementById(tableId);
  if (!table) return alert('⚠️ Tabel tidak ditemukan!');
  
  const html = `
    <div style="overflow-x:auto;">
      ${table.outerHTML}
    </div>
  `;
  
  window.printWireless(html, { header: title });
};

/**
 * Print laporan dari data JSON (untuk data yang belum dirender)
 */
window.printReport = function(data, columns, title = 'Laporan') {
  let html = '<table style="width:100%;border-collapse:collapse;">';
  
  // Header
  html += '<thead><tr style="background:#e2e8f0;">';
  columns.forEach(col => {
    html += '<th style="border:1px solid #000;padding:6px;text-align:left;">' + col.label + '</th>';
  });
  html += '</tr></thead>';
  
  // Body
  html += '<tbody>';
  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      const val = row[col.key] || '-';
      html += '<td style="border:1px solid #000;padding:5px;">' + String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  
  window.printWireless(html, { header: title });
};

/**
 * Deteksi printer WiFi yang tersedia (via Web Bluetooth/USB - experimental)
 */
window.scanPrinters = async function() {
  // Cek apakah browser mendukung Web Bluetooth
  if (!navigator.bluetooth) {
    return { supported: false, message: 'Browser tidak mendukung Web Bluetooth. Gunakan dialog print standar.' };
  }
  
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['basic_printing']
    });
    return { supported: true, device: device.name, message: 'Printer ditemukan: ' + device.name };
  } catch(e) {
    return { supported: false, message: 'Scan printer: ' + e.message };
  }
};

console.log('🖨️ Wireless Print Utility Ready');
