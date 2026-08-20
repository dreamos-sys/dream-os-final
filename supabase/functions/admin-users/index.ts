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

    // 2) Parse body
    const body = await req.json().catch(() => ({}))
    const action = body.action || 'list'

    // 3) Action Router
    switch (action) {
      case 'list': {
        const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 })
        if (error) return json({ error: error.message }, 500)

        const users = data.users.map((u) => ({
          id: u.id,
          email: u.email || '-',
          nama: (u.user_metadata && u.user_metadata.nama) || '-',
          role: (u.user_metadata && u.user_metadata.role) || 'user',
          status: u.banned_until ? 'banned' : (u.email_confirmed_at ? 'active' : 'pending'),
          created_at: u.created_at,
          last_sign_in: u.last_sign_in_at || null,
        }))

        return json({ total: users.length, users })
      }

      case 'create': {
        const { email, password, nama, role } = body
        if (!email || !password) return json({ error: 'Email dan password wajib' }, 400)

        const { data, error } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { nama, role },
        })

        if (error) return json({ error: error.message }, 500)

        return json({
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            nama: (data.user.user_metadata && data.user.user_metadata.nama) || '-',
            role: (data.user.user_metadata && data.user.user_metadata.role) || 'user',
            status: 'active',
            created_at: data.user.created_at,
          }
        })
      }

      case 'update': {
        const { id, nama, role, status } = body
        if (!id) return json({ error: 'ID user wajib' }, 400)

        const updates: any = {
          user_metadata: { nama, role },
        }
        if (status === 'banned') {
          updates.banned_until = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
        } else if (status === 'active') {
          updates.banned_until = null
        }

        const { data, error } = await admin.auth.admin.updateUserById(id, updates)
        if (error) return json({ error: error.message }, 500)

        return json({ success: true, user: data.user })
      }

      case 'delete': {
        const { id } = body
        if (!id) return json({ error: 'ID user wajib' }, 400)

        const { error } = await admin.auth.admin.deleteUser(id)
        if (error) return json({ error: error.message }, 500)

        return json({ success: true, deleted: id })
      }

      case 'reset-password': {
        const { email } = body
        if (!email) return json({ error: 'Email wajib' }, 400)

        const { error } = await admin.auth.resetPasswordForEmail(email, {
          redirectTo: url + '/reset-password',
        })
        if (error) return json({ error: error.message }, 500)

        return json({ success: true, message: 'Email reset dikirim ke ' + email })
      }

      default:
        return json({ error: 'Action tidak valid: ' + action }, 400)
    }
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
