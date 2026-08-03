// supabase/functions/submit-booking/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ADMIN_ROLES = ['dev', 'kabag_umum', 'koordinator_umum'];
const WORK_START = 7.5;
const WORK_END = 16.0;

interface BookingPayload {
  tgl: string;
  tgl_selesai?: string;
  tgl_display?: string;
  ruang: string;
  nama_peminjam: string;
  no_hp: string;
  divisi: string;
  jam_mulai: string;
  jam_selesai: string;
  keperluan?: string;
  sarana_alat?: string;
}

function wibNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 7 * 60 * 60 * 1000);
}

function timeToFloat(t: string): number {
  const p = String(t || '0:0').split(':');
  return (parseInt(p[0], 10) || 0) + (parseInt(p[1], 10) || 0) / 60;
}

function toMinutes(t: string): number {
  const p = String(t || '0:0').split(':');
  return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
}

function rangesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  const a = toMinutes(s1), b = toMinutes(e1), c = toMinutes(s2), d = toMinutes(e2);
  return a < d && b > c;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('⛔ Token otorisasi wajib');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error('⛔ Token tidak valid atau sesi habis');

    const email = user.email?.toLowerCase() || '';
    const { data: userProfile } = await supabase
      .from('users')
      .select('role, nama')
      .eq('email', email)
      .maybeSingle();

    const role = String(userProfile?.role || 'staff').toLowerCase();
    const isAdmin = ADMIN_ROLES.includes(role);

    const payload: BookingPayload = await req.json();

    const required = ['tgl', 'ruang', 'nama_peminjam', 'no_hp', 'divisi', 'jam_mulai', 'jam_selesai'];
    for (const f of required) {
      if (!(payload as any)[f]) throw new Error(`⚠️ Field wajib: ${f}`);
    }

    const wib = wibNow();
    const serverHour = wib.getUTCHours();
    const serverMinute = wib.getUTCMinutes();
    const serverTime = serverHour + serverMinute / 60;
    const inWindow = serverTime >= WORK_START && serverTime <= WORK_END;

    if (!isAdmin && !inWindow) {
      throw new Error(`⛔ Pengajuan booking hanya 07:30–16:00 WIB. Server: ${String(serverHour).padStart(2,'0')}:${String(serverMinute).padStart(2,'0')} WIB.`);
    }

    const today = new Date(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate());
    const bookingDate = new Date(payload.tgl + 'T12:00:00');
    const diffDays = Math.floor((bookingDate.getTime() - today.getTime()) / 86400000);
    if (diffDays < 1) throw new Error('⚠️ Booking minimal H-1.');

    const startT = timeToFloat(payload.jam_mulai);
    const endT = timeToFloat(payload.jam_selesai);
    if (startT < WORK_START || endT > WORK_END || startT >= endT) {
      throw new Error('⛔ Jam acara harus 07:30–16:00 WIB.');
    }

    const dow = bookingDate.getDay();
    if (dow === 0) throw new Error('⛔ Minggu libur booking.');
    if (dow === 5 && (payload.ruang === 'Aula SMP' || payload.ruang === 'Serbaguna') && startT < 13 && endT > 10.5) {
      throw new Error('⛔ Jumat 10:30–13:00 Aula/Serbaguna untuk Shalat Jumat.');
    }

    const tglMulai = payload.tgl;
    const tglSelesai = payload.tgl_selesai || payload.tgl;

    const { data: existing, error: qErr } = await supabase
      .from('bookings')
      .select('id, nama_peminjam, ruang, jam_mulai, jam_selesai, tgl, tgl_selesai, status')
      .eq('ruang', payload.ruang)
      .neq('status', 'rejected')
      .order('created_at', { ascending: true });

    if (qErr) throw new Error('Gagal cek konflik: ' + qErr.message);

    let conflict: any = null;
    for (const b of (existing || [])) {
      const bEnd = b.tgl_selesai || b.tgl;
      if (String(tglMulai) <= String(bEnd) && String(b.tgl) <= String(tglSelesai)) {
        if (rangesOverlap(payload.jam_mulai, payload.jam_selesai, b.jam_mulai, b.jam_selesai)) {
          conflict = b;
          break;
        }
      }
    }

    if (conflict) {
      throw new Error(`⛔ BENTROK WAKTU dengan ${conflict.nama_peminjam || '-'} @ ${conflict.ruang} (${conflict.jam_mulai}–${conflict.jam_selesai}).`);
    }

    const bookingId = 'book_' + Date.now();
    const insertData = {
      id: bookingId,
      ...payload,
      status: 'pending',
      created_at: new Date().toISOString(),
      created_by: email,
    };

    const { data: inserted, error: insErr } = await supabase
      .from('bookings')
      .insert(insertData)
      .select()
      .single();

    if (insErr) throw new Error('Insert gagal: ' + insErr.message);

    return new Response(JSON.stringify({
      ok: true,
      id: bookingId,
      admin_override: isAdmin && !inWindow,
      server_time_wib: `${String(serverHour).padStart(2,'0')}:${String(serverMinute).padStart(2,'0')}`,
    }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message || String(e) }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
});
