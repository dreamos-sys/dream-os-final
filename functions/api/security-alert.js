/**
 * 🛡️ DREAM OS SECURITY ALERTS - HARDCODED VERSION (Testing)
 */

// HARDCODE BUAT TESTING - NANTI DIPINDAH KE ENV VARS!
const TELEGRAM_BOT_TOKEN = '8769945646:AAG_myHkLd_hvo4yj4uwe4uuL5hOhgwy0bo';
const TELEGRAM_CHAT_ID = '1298505314';

export async function onRequestPost(context) {
  const { request } = context;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  try {
    const { type, data, timestamp } = await request.json();
    
    let message = '';
    if (type === 'LOGIN_BLOCKED') {
      message = `🚨 <b>LOGIN BLOCKED</b>\n📧 Email: ${data.email}\n🔄 Attempts: ${data.attempts}`;
    } else if (type === 'NEW_DEVICE') {
      message = `📱 <b>NEW DEVICE</b>\n📧 Email: ${data.email}`;
    } else if (type === 'SUSPICIOUS_DEVICE') {
      message = `⚠️ <b>SUSPICIOUS DEVICE</b>\n📧 Email: ${data.email}`;
    } else {
      message = `🔔 <b>SECURITY ALERT</b>\n📋 Type: ${type}`;
    }
    
    message += `\n⏰ ${new Date(timestamp).toLocaleString('id-ID')}`;
    
    // Kirim ke Telegram
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
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
