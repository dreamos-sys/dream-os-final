// DREAM OS — admin-users Edge Function (service_role provisioning)
// Aksi: create | update | delete | reset. Pemanggil WAJIB admin (role di user_metadata).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: any, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const ADMIN_ROLES = ['dev', 'kabag_umum', 'koordinator_umum'];
const ALL_ROLES = ['dev','kabag_umum','koordinator_umum','management','komite','guru','security','komandan_regu','janitor_indoor','janitor_outdoor','maintenance','staff'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    // 1) autentikasi pemanggil dari header Authorization (getUser memvalidasi token)
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: uerr } = await userClient.auth.getUser();
    if (uerr || !user) return json({ error: 'Unauthorized' }, 401);
    const role = (user.user_metadata && user.user_metadata.role) || '';
    if (!ADMIN_ROLES.includes(role)) return json({ error: 'Forbidden: hanya admin' }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === 'create') {
      const { email, password, nama, role: r } = body;
      if (!email || !password || !r) return json({ error: 'email, password, role wajib' }, 400);
      if (String(password).length < 8) return json({ error: 'password minimal 8 karakter' }, 400);
      if (!ALL_ROLES.includes(r)) return json({ error: 'role tidak valid' }, 400);
      const displayNama = nama || String(email).split('@')[0];
      const { data, error } = await admin.auth.admin.createUser({
        email, password, email_confirm: true, // auto-confirm: provisioning admin langsung aktif
        user_metadata: { nama: displayNama, role: r, status: 'active' },
      });
      if (error) return json({ error: error.message }, 400);
      const uid = data.user.id;
      await admin.from('users').upsert(
        { id: uid, email: String(email).toLowerCase(), nama: displayNama, role: r, status: 'active', updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
      return json({ id: uid, email, nama: displayNama, role: r });
    }

    if (action === 'update') {
      const { id, nama, role: r, status } = body;
      if (!id) return json({ error: 'id wajib' }, 400);
      const { data: existing } = await admin.auth.admin.getUserById(id);
      const md: any = { ...((existing && existing.user && existing.user.user_metadata) || {}) };
      if (nama !== undefined) md.nama = nama;
      if (r !== undefined) md.role = r;
      if (status !== undefined) md.status = status;
      const { error } = await admin.auth.admin.updateUserById(id, { user_metadata: md });
      if (error) return json({ error: error.message }, 400);
      await admin.from('users').update({ nama: md.nama, role: md.role, status: md.status || 'active', updated_at: new Date().toISOString() }).eq('id', id);
      return json({ ok: true });
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) return json({ error: 'id wajib' }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      await admin.from('users').delete().eq('id', id);
      return json({ ok: true });
    }

    if (action === 'reset') {
      const { id, password } = body;
      if (!id || !password) return json({ error: 'id & password wajib' }, 400);
      if (String(password).length < 8) return json({ error: 'password minimal 8 karakter' }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: 'action tidak dikenal' }, 400);
  } catch (e: any) {
    return json({ error: (e && e.message) || 'server error' }, 500);
  }
});
