/**
 * 🏛️ TRINITY PROXY - SECURITY ALERTS
 * Cloudflare Pages Function untuk Telegram notifications
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  try {
    const { type, data, timestamp } = await request.json();
    
    // Check env vars
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return new Response(JSON.stringify({ 
        error: 'Telegram not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Pages env vars.' 
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
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );
    
    const tgResult = await tgResponse.json();
    
    return new Response(JSON.stringify({ 
      success: tgResult.ok,
      telegram: tgResult 
    }), { headers });
    
  } catch (e) {
    return new Response(JSON.stringify({ 
      error: e.message 
    }), { status: 500, headers });
  }
}

// Handle OPTIONS untuk CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
