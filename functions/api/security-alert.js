export async function onRequestPost(context) {
  const { request, env } = context;
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  try {
    const { type, data, timestamp } = await request.json();
    
    // Debug: Cek env vars
    const debugInfo = {
      hasBotToken: !!env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!env.TELEGRAM_CHAT_ID,
      botTokenLength: env.TELEGRAM_BOT_TOKEN ? env.TELEGRAM_BOT_TOKEN.length : 0,
      chatIdValue: env.TELEGRAM_CHAT_ID,
      chatIdType: typeof env.TELEGRAM_CHAT_ID
    };
    
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return new Response(JSON.stringify({ 
        error: 'Telegram not configured',
        debug: debugInfo
      }), { status: 500, headers });
    }
    
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
    
    // Convert chat_id ke string (jaga-jaga)
    const chatId = String(env.TELEGRAM_CHAT_ID).trim();
    const botToken = String(env.TELEGRAM_BOT_TOKEN).trim();
    
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );
    
    const tgResult = await tgResponse.json();
    
    return new Response(JSON.stringify({ 
      success: tgResult.ok,
      telegram: tgResult,
      debug: debugInfo,
      sentTo: `chat_id: ${chatId}`
    }), { headers });
    
  } catch (e) {
    return new Response(JSON.stringify({ 
      error: e.message,
      stack: e.stack
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
