/**
 * 🔐 TELEGRAM ALERT PROXY
 * Simpan bot token di server, bukan di client!
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }
    
    try {
      const { type, data, timestamp } = await request.json();
      
      // Format message
      let message = '';
      switch (type) {
        case 'LOGIN_BLOCKED':
          message = `🚨 <b>LOGIN BLOCKED</b>\nEmail: ${data.email}\nAttempts: ${data.attempts}\nTime: ${new Date(timestamp).toLocaleString('id-ID')}`;
          break;
        case 'NEW_DEVICE':
          message = `📱 <b>NEW DEVICE</b>\nEmail: ${data.email}\nTime: ${new Date(timestamp).toLocaleString('id-ID')}`;
          break;
        case 'SUSPICIOUS_DEVICE':
          message = `⚠️ <b>SUSPICIOUS DEVICE</b>\nEmail: ${data.email}\nTime: ${new Date(timestamp).toLocaleString('id-ID')}`;
          break;
        default:
          message = `🔔 <b>SECURITY ALERT</b>\nType: ${type}\nData: ${JSON.stringify(data)}\nTime: ${new Date(timestamp).toLocaleString('id-ID')}`;
      }
      
      // Send to Telegram (token disimpan di server!)
      const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      return new Response(JSON.stringify({ success: true }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, 
        headers 
      });
    }
  }
};
