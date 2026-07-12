/**
 * 🏛️ TRINITY PROXY
 * Handle security alerts & Telegram notifications
 */

export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }
    
    try {
      const url = new URL(request.url);
      
      // Security alert endpoint
      if (url.pathname === '/api/security-alert') {
        const { type, data, timestamp } = await request.json();
        
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
            message = `🔔 <b>SECURITY ALERT</b>\nType: ${type}`;
        }
        
        message += `\nTime: ${new Date(timestamp).toLocaleString('id-ID')}`;
        
        // Send to Telegram
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      
      return new Response('Not found', { status: 404, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, 
        headers 
      });
    }
  }
};
