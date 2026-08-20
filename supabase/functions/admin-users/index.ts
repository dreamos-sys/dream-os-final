import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1) Verifikasi pemanggil = admin/dev
    const token = (req.headers.get('Authorization') || '').replace('Bearer ', '')
    const { data: { user }, error: uerr } = await admin.auth.getUser(token)
    if (uerr || !user) return json({ error: 'UNAUTHORIZED' }, 401)

    const role = (user.user_metadata && user.user_metadata.role) || 'user'
    if (!['dev', 'admin', 'kabag_umum', 'koordinator_umum'].includes(role)) {
      return json({ error: 'FORBIDDEN — khusus admin' }, 403)
    }

    // 2) Ambil daftar user (server-side, aman)
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 })
    if (error) return json({ error: error.message }, 500)

    const users = data.users.map((u) => ({
      id: u.id,
      email: u.email || '-',
      nama: (u.user_metadata && u.user_metadata.nama) || '-',
      role: (u.user_metadata && u.user_metadata.role) || 'user',
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at || null,
      banned: !!u.banned_until,
      confirmed: !!u.email_confirmed_at,
    }))

    return json({ total: users.length, users })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
