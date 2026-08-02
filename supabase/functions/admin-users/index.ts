// DREAM OS — admin-users (provisioning ber-hierarki)
// MGMT: dev/kabag_umum/koordinator_umum. Tiap peran hanya mengelola peran DI BAWAHNYA.
// Delete permanen = dev-only. Soft-stop (status inactive) = via update.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: any, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const ALL_ROLES = ['dev','kabag_umum','koordinator_umum','management','komite','guru','security','komandan_regu','janitor_indoor','janitor_outdoor','maintenance','staff'];
const MGMT_ROLES = ['dev','kabag_umum','koordinator_umum'];
const MANAGEABLE: Record<string, string[]> = {
  dev: ALL_ROLES,
  kabag_umum: ALL_ROLES.filter(r => r !== 'dev' && r !== 'kabag_umum'),
  koordinator_umum: ALL_ROLES.filter(r => !['dev','kabag_umum','koordinator_umum'].includes(r)),
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: uerr } = await userClient.auth.getUser();
    if (uerr || !user) return json({ error: 'Unauthorized' }, 401);
    const callerRole = (user.user_metadata && user.user_metadata.role) || '';
    if (!MGMT_ROLES.includes(callerRole)) return json({ error: 'Forbidden: hanya dev / kabag / koord' }, 403);
    const can = MANAGEABLE[callerRole] || [];

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    async function targetRole(id: string): Promise<string> {
      const { data } = await admin.auth.admin.getUserById(id);
      const mdRole = data && data.user && data.user.user_metadata && data.user.user_metadata.role;
      if (mdRole) return mdRole;
      const { data: row } = await admin.from('users').select('role').eq('id', id).maybeSingle();
      return (row && row.role) || '';
    }

    if (action === 'create') {
      const { email, password, nama, role } = body;
      if (!email || !password || !role) return json({ error: 'email, password, role wajib' }, 400);
      if (String(password).length < 8) return json({ error: 'password minimal 8 karakter' }, 400);
      if (!can.includes(role)) return json({ error: 'Anda tidak berwenang membuat role: ' + role }, 403);
      const displayNama = nama || String(email).split('@')[0];
      const { data, error } = await admin.auth.admin.createUser({
        email, password, email_confirm: true,
        user_metadata: { nama: displayNama, role, status: 'active' },
      });
      if (error) return json({ error: error.message }, 400);
      const uid = data.user.id;
      await admin.from('users').upsert(
        { id: uid, email: String(email).toLowerCase(), nama: displayNama, role, status: 'active', source: 'edge-create', updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
      return json({ id: uid, email, nama: displayNama, role });
    }

    if (action === 'update') {
      const { id, nama, role, status } = body;
      if (!id) return json({ error: 'id wajib' }, 400);
      const tRole = await targetRole(id);
      if (!can.includes(tRole)) return json({ error: 'Anda tidak berwenang mengubah akun role: ' + tRole }, 403);
      if (role !== undefined && !can.includes(role)) return json({ error: 'Anda tidak berwenang memberi role: ' + role }, 403);
      const { data: existing } = await admin.auth.admin.getUserById(id);
      const md: any = { ...((existing && existing.user && existing.user.user_metadata) || {}) };
      if (nama !== undefined) md.nama = nama;
      if (role !== undefined) md.role = role;
      if (status !== undefined) md.status = status;
      const { error } = await admin.auth.admin.updateUserById(id, { user_metadata: md });
      if (error) return json({ error: error.message }, 400);
      await admin.from('users').update({ nama: md.nama, role: md.role, status: md.status || 'active', updated_at: new Date().toISOString() }).eq('id', id);
      return json({ ok: true });
    }

    if (action === 'delete') { // hard-delete = dev-only (via MANAGEABLE: hanya dev yang 'can' mencakup semua)
      const { id } = body;
      if (!id) return json({ error: 'id wajib' }, 400);
      const tRole = await targetRole(id);
      if (!can.includes(tRole)) return json({ error: 'Anda tidak berwenang menghapus akun role: ' + tRole }, 403);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      await admin.from('users').delete().eq('id', id);
      return json({ ok: true });
    }

    if (action === 'reset') {
      const { id, password } = body;
      if (!id || !password) return json({ error: 'id & password wajib' }, 400);
      if (String(password).length < 8) return json({ error: 'password minimal 8 karakter' }, 400);
      const tRole = await targetRole(id);
      if (!can.includes(tRole)) return json({ error: 'Anda tidak berwenang reset password akun role: ' + tRole }, 403);
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: 'action tidak dikenal' }, 400);
  } catch (e: any) {
    return json({ error: (e && e.message) || 'server error' }, 500);
  }
});
