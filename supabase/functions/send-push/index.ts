// Supabase Edge Function: Send Web Push Notifications
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, body, url, target, role, userId } = await req.json()
    if (!title || !body) throw new Error('Title and body required')

    webpush.setVapidDetails(
      Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@dreamos.local',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    )

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let query = supabase.from('push_subscriptions').select('*')
    if (target === 'role' && role) query = query.eq('user_role', role)
    else if (target === 'user' && userId) query = query.eq('user_id', userId)

    const { data: subscriptions, error } = await query
    if (error) throw error

    console.log(`Sending push to ${subscriptions.length} subscriptions`)

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        }
        const payload = JSON.stringify({
          title, body,
          url: url || './index.html',
          icon: './assets/icon-192.png',
          badge: './assets/icon-192.png',
          tag: 'dreamos-push',
          data: { url: url || './index.html' },
        })
        try {
          await webpush.sendNotification(pushSubscription, payload)
          return { success: true, endpoint: sub.endpoint }
        } catch (err) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
          }
          return { success: false, error: err.message }
        }
      })
    )

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    return new Response(
      JSON.stringify({ success: true, count: successCount, failed: results.length - successCount, total: subscriptions.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Push error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
