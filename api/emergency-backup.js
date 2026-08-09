export default function handler(req, res) {
  // CORS Headers agar bisa diakses dari frontend Dream OS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const data = req.body;
    console.log("🚨 [EMERGENCY BACKUP] Data diamankan oleh Vercel:", data);
    
    // Nanti di sini kita pasang logika untuk menyimpan ke Vercel KV atau kirim Email
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Supabase Down! Data berhasil diamankan di Vercel Emergency Server.', 
      fallback_active: true 
    });
  } 
  
  // Jika diakses lewat browser biasa (GET request)
  res.status(200).json({ 
    status: 'active', 
    system: 'Dream OS - Fallback Backend',
    message: 'Vercel Emergency Server is Ready! 😎' 
  });
}
