import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 🔒 Role yang boleh bikin user (defense-in-depth: client guard di CC + server guard di sini)
const ADMIN_ROLES = ['dev', 'admin', 'kabag_umum', 'koordinator_umum']

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // ============================================================
    // 🔒 SERVER GUARD: verifikasi caller adalah admin/dev
    //    Tanpa ini, siapa pun yang tau URL + anon key bisa bikin user.
    // ============================================================
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401,
      })
    }

    // Pakai anon client + caller's JWT untuk verifikasi sesi
    const supabaseCaller = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user: caller }, error: callerErr } = await supabaseCaller.auth.getUser()
    if (callerErr || !caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized: sesi tidak valid.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401,
      })
    }

    const callerRole = String(caller.user_metadata?.role || '').toLowerCase()
    if (!ADMIN_ROLES.includes(callerRole)) {
      return new Response(JSON.stringify({
        error: 'Forbidden: hanya admin/dev yang boleh membuat user. Role Anda: ' + (callerRole || 'staff')
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403,
      })
    }

    // ============================================================
    // Parse & validasi body (server-side validation — jangan cuma percaya client)
    // ============================================================
    const { email, password, nama, role, divisi } = await req.json()
    if (!email || !password || !role) throw new Error('Email, password, dan role wajib diisi.')
    if (String(password).length < 6) throw new Error('Password minimal 6 karakter.')

    // ============================================================
    // Buat user via Admin API (service role — cuma ada di server)
    // ============================================================
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nama, role, divisi }
    })
    if (error) throw error

    // ============================================================
    // Return: id di top-level (biar CC langsung tangkep) + user lengkap
    // ============================================================
    return new Response(JSON.stringify({
      success: true,
      id: data.user.id,
      user: data.user
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
