/**
 * 🏛️ TRINITY PROXY - SECURITY ALERTS
 */
export default {
  async fetch(request, env) {
    // CORS headers - ALLOW GitHub Pages!
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    }
    
    try {
      const url = new URL(request.url);
      
      if (url.pathname === '/api/security-alert') {
        const { type, data, timestamp } = await request.json();
        
        // Check env vars
        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
          return new Response(JSON.stringify({ 
            error: 'Telegram not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Worker env vars.' 
          }), { status: 500, headers });
        }
        
        let message = '';
        switch (type) {
          case 'LOGIN_BLOCKED':
            message = `🚨 <b>LOGIN BLOCKED</b>\nEmail: ${data.email}\nAttempts: ${data.attempts}`;
            break;
          case 'NEW_DEVICE':
            message = `📱 <b>NEW DEVICE</b>\nEmail: ${data.email}`;
            break;
          case 'SUSPICIOUS_DEVICE':
            message = `⚠️ <b>SUSPICIOUS DEVICE</b>\nEmail: ${data.email}`;
            break;
          case 'HONEYPOT_TRIGGERED':
            message = `🍯 <b>HONEYPOT TRIGGERED</b>\nURL: ${data.url}`;
            break;
          default:
            message = `🔔 <b>SECURITY ALERT</b>\nType: ${type}\nData: ${JSON.stringify(data)}`;
        }
        
        message += `\n⏰ ${new Date(timestamp).toLocaleString('id-ID')}`;
        
        // Send to Telegram
        const tgResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        const tgResult = await tgResponse.json();
        
        return new Response(JSON.stringify({ 
          success: tgResult.ok,
          telegram: tgResult 
        }), { headers });
      }
      
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }
};
