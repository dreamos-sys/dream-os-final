export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers });

    try {
      const { type, data, timestamp } = await request.json();
      let message = '';
      
      if (type === 'LOGIN_BLOCKED') message = `🚨 <b>LOGIN BLOCKED</b>\nEmail: ${data.email}\nAttempts: ${data.attempts}`;
      else if (type === 'NEW_DEVICE') message = ` <b>NEW DEVICE</b>\nEmail: ${data.email}`;
      else if (type === 'SUSPICIOUS_DEVICE') message = `️ <b>SUSPICIOUS DEVICE</b>\nEmail: ${data.email}`;
      else message = `🔔 <b>SECURITY ALERT</b>\nType: ${type}`;
      
      message += `\n⏰ ${new Date(timestamp).toLocaleString('id-ID')}`;

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
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }
};
