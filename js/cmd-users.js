/**
 * Dream OS — Command Center Users domain
 * Load after polyfills (safeJSON / saveJSON / showToast / supabaseClient).
 * onclick di HTML tetap memakai window.createNewUser, dll.
 */
(function (global) {
  'use strict';

  var MOUNTED = false;

  function escU(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeJSON(key, fallback) {
    if (typeof global.safeJSON === 'function') return global.safeJSON(key, fallback);
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function saveJSON(key, val) {
    if (typeof global.saveJSON === 'function') return global.saveJSON(key, val);
    try {
      var str = JSON.stringify(val);
      if (typeof global.safeStorageSet === 'function') return global.safeStorageSet(key, str);
      localStorage.setItem(key, str);
      return true;
    } catch (e) {
      return false;
    }
  }

  function toast(msg, type) {
    if (typeof global.showToast === 'function') global.showToast(msg, type || 'info');
    else console.log('[users]', type, msg);
  }

  function roleOf() {
    if (typeof global.getUserRole === 'function') return global.getUserRole();
    try {
      var b = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
      return b.role || 'staff';
    } catch (e) {
      return 'staff';
    }
  }

  function isDev() {
    return roleOf() === 'dev';
  }

  function isAdmin() {
    if (typeof global.isAdmin === 'boolean') return global.isAdmin;
    if (typeof global.isAdmin === 'function') return !!global.isAdmin();
    var r = roleOf();
    return r === 'dev' || r === 'kabag' || r === 'kabag_umum' || r === 'koordinator_umum' || r === 'management';
  }

  function canManage(targetRole) {
    if (typeof global.canManage === 'function') return global.canManage(targetRole);
    if (isDev()) return true;
    if (!isAdmin()) return false;
    var t = String(targetRole || '').toLowerCase();
    return t !== 'dev';
  }

  function pushLocalUser(u) {
    var users = safeJSON('dreamos_users_db', []);
    var i = users.findIndex(function (x) {
      return (x.email || '').toLowerCase() === (u.email || '').toLowerCase();
    });
    if (i > -1) users[i] = Object.assign({}, users[i], u);
    else users.push(u);
    saveJSON('dreamos_users_db', users);
  }

  async function callAdminUsers(action, payload) {
    if (!global.supabaseClient) throw new Error('offline');
    var r = await global.supabaseClient.functions.invoke('admin-users', {
      body: Object.assign({ action: action }, payload || {})
    });
    if (r.error) throw new Error(r.error.message || 'Edge Function error');
    if (r.data && r.data.error) throw new Error(r.data.error);
    return r.data;
  }

  function renderUsers() {
    var users = safeJSON('dreamos_users_db', []);
    var tbody = document.getElementById('users-body');
    if (!tbody) return;
    if (!users.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2rem;">Belum ada user</td></tr>';
      return;
    }
    tbody.innerHTML = users
      .map(function (u, i) {
        var tr = String(u.role || 'staff');
        var canEdit = isAdmin() && canManage(tr);
        var canDel = isDev();
        return (
          '<tr><td>' +
          escU(u.nama || '-') +
          '</td><td>' +
          escU(u.email || '-') +
          '</td><td><span class="badge badge-pending">' +
          escU(tr) +
          '</span></td><td><span class="badge badge-approved">' +
          escU(u.status || 'active') +
          '</span></td><td style="white-space:nowrap;">' +
          (canEdit
            ? '<button type="button" class="btn btn-primary btn-sm" data-users-act="edit" data-idx="' +
              i +
              '">✏️</button> <button type="button" class="btn btn-warning btn-sm" data-users-act="reset" data-id="' +
              escU(u.id) +
              '">🔑</button> '
            : '') +
          (canDel
            ? '<button type="button" class="btn btn-danger btn-sm" data-users-act="delete" data-id="' +
              escU(u.id) +
              '">🗑️</button>'
            : '') +
          '</td></tr>'
        );
      })
      .join('');
  }

  async function createNewUser() {
    if (!isAdmin()) {
      toast('⛔ Hanya admin yang dapat menambah user.', 'error');
      return;
    }
    var namaEl = document.getElementById('new-user-nama');
    var emailEl = document.getElementById('new-user-email');
    var roleEl = document.getElementById('new-user-role');
    var passEl = document.getElementById('new-user-pass');
    var fb = document.getElementById('user-form-feedback');
    var nama = (namaEl && namaEl.value || '').trim();
    var email = (emailEl && emailEl.value || '').trim();
    var role = (roleEl && roleEl.value) || 'staff';
    var pass = (passEl && passEl.value) || '';
    var minLen = (global.CFG && global.CFG.MIN_PASSWORD_LENGTH) || 8;

    if (!nama || !email || !pass) {
      toast('Lengkapi semua input user!', 'error');
      return;
    }
    if (pass.length < minLen) {
      toast('⛔ Password minimal ' + minLen + ' karakter!', 'error');
      return;
    }
    var users = safeJSON('dreamos_users_db', []);
    if (users.find(function (u) { return (u.email || '').toLowerCase() === email.toLowerCase(); })) {
      toast('Email sudah terdaftar!', 'error');
      return;
    }

    if (fb) fb.textContent = 'Menyimpan…';
    var createdId = 'usr_' + Date.now();
    var cloudOk = false;
    try {
      var res = await callAdminUsers('create', {
        email: email,
        password: pass,
        nama: nama,
        role: role
      });
      if (res && res.id) createdId = res.id;
      cloudOk = true;
    } catch (e) {
      console.warn('admin-users create gagal, fallback lokal:', e && e.message);
    }

    pushLocalUser({
      id: createdId,
      email: email,
      nama: nama,
      role: role,
      status: 'active',
      source: cloudOk ? 'cloud' : 'local-only',
      created_at: new Date().toISOString()
    });

    if (global.BankAudit) {
      try {
        global.BankAudit.log('USER_CREATE', { email: email, role: role, cloud: cloudOk });
      } catch (_) {}
    }

    renderUsers();
    if (namaEl) namaEl.value = '';
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    if (fb) {
      fb.textContent = cloudOk ? 'Tersinkron cloud' : 'Lokal saja — deploy Edge admin-users untuk login lintas device';
      fb.style.color = cloudOk ? 'var(--success)' : 'var(--gold)';
    }
    toast(
      cloudOk
        ? '✅ User ' + nama + ' dibuat & tersinkron cloud'
        : '⚠️ User tersimpan LOKAL saja. Deploy Edge Function admin-users.',
      cloudOk ? 'success' : 'warning'
    );
  }

  function openEditModal(idx) {
    var users = safeJSON('dreamos_users_db', []);
    var u = users[idx];
    if (!u) return;
    var ix = document.getElementById('edit-user-index');
    var n = document.getElementById('edit-user-nama');
    var em = document.getElementById('edit-user-email');
    var ro = document.getElementById('edit-user-role');
    var st = document.getElementById('edit-user-status');
    var modal = document.getElementById('edit-user-modal');
    if (ix) ix.value = String(idx);
    if (n) n.value = u.nama || '';
    if (em) em.value = u.email || '';
    if (ro) ro.value = u.role || 'staff';
    if (st) st.value = u.status || 'active';
    if (modal) modal.classList.add('show');
  }

  function closeEditModal() {
    var modal = document.getElementById('edit-user-modal');
    if (modal) modal.classList.remove('show');
  }

  async function saveEditUser() {
    if (!isAdmin()) {
      toast('⛔ Hanya admin yang dapat mengubah user.', 'error');
      return;
    }
    var idx = parseInt((document.getElementById('edit-user-index') || {}).value, 10);
    var users = safeJSON('dreamos_users_db', []);
    if (!users[idx]) return;
    var nama = ((document.getElementById('edit-user-nama') || {}).value || '').trim();
    var email = ((document.getElementById('edit-user-email') || {}).value || '').trim();
    var role = (document.getElementById('edit-user-role') || {}).value;
    var status = (document.getElementById('edit-user-status') || {}).value;
    if (!nama || !email) {
      toast('Nama & email wajib diisi', 'error');
      return;
    }
    var id = users[idx].id;
    var cloudOk = false;
    try {
      await callAdminUsers('update', {
        id: id,
        nama: nama,
        email: email,
        role: role,
        status: status
      });
      cloudOk = true;
    } catch (e) {
      console.warn('admin-users update gagal:', e && e.message);
    }
    users[idx] = Object.assign({}, users[idx], {
      nama: nama,
      email: email,
      role: role,
      status: status
    });
    saveJSON('dreamos_users_db', users);
    if (global.BankAudit) {
      try {
        global.BankAudit.log('USER_UPDATE', { id: id, role: role, cloud: cloudOk });
      } catch (_) {}
    }
    renderUsers();
    closeEditModal();
    toast(
      cloudOk ? '✅ User diupdate (cloud)' : '⚠️ User diupdate lokal saja',
      cloudOk ? 'success' : 'warning'
    );
  }

  async function deleteUser(id) {
    if (!isAdmin()) {
      toast('⛔ Hanya admin yang dapat menghapus user.', 'error');
      return;
    }
    var users = safeJSON('dreamos_users_db', []);
    var u = users.find(function (x) { return x.id === id; });
    if (!confirm('Hapus user ' + (u ? u.nama || u.email : id) + '?')) return;
    var cloudOk = false;
    try {
      await callAdminUsers('delete', { id: id });
      cloudOk = true;
    } catch (e) {
      console.warn('admin-users delete gagal:', e && e.message);
    }
    saveJSON(
      'dreamos_users_db',
      users.filter(function (x) { return x.id !== id; })
    );
    renderUsers();
    toast(
      cloudOk ? '✅ User dihapus (cloud)' : '⚠️ User dihapus lokal saja',
      cloudOk ? 'success' : 'warning'
    );
  }

  async function resetUserPassword(id) {
    if (!isAdmin()) {
      toast('⛔ Hanya admin.', 'error');
      return;
    }
    var np = prompt('Password baru (minimal 8 karakter):');
    if (np === null) return;
    np = String(np);
    if (np.length < 8) {
      toast('⛔ Password minimal 8 karakter!', 'error');
      return;
    }
    var cloudOk = false;
    try {
      await callAdminUsers('reset', { id: id, password: np });
      cloudOk = true;
    } catch (e) {
      console.warn('admin-users reset gagal:', e && e.message);
    }
    toast(
      cloudOk
        ? '✅ Password direset via cloud'
        : '⚠️ Gagal reset cloud — deploy admin-users',
      cloudOk ? 'success' : 'warning'
    );
  }

  function onClick(e) {
    var t = e.target.closest('[data-users-act]');
    if (!t) return;
    var act = t.getAttribute('data-users-act');
    if (act === 'edit') openEditModal(parseInt(t.getAttribute('data-idx'), 10));
    else if (act === 'delete') deleteUser(t.getAttribute('data-id'));
    else if (act === 'reset') resetUserPassword(t.getAttribute('data-id'));
  }

  /** Opsional: tarik list dari cloud jika ada helper lama */
  async function syncUsersFromSupabase() {
    if (typeof global.syncUsersFromSupabase === 'function' && global.syncUsersFromSupabase !== syncUsersFromSupabase) {
      try {
        await global.syncUsersFromSupabase();
      } catch (e) {
        console.warn('[cmd-users] sync', e);
      }
    }
  }

  function mount() {
    if (MOUNTED) {
      renderUsers();
      return;
    }
    document.addEventListener('click', onClick);
    MOUNTED = true;
    Promise.resolve(syncUsersFromSupabase()).finally(function () {
      renderUsers();
    });
  }

  function unmount() {
    if (!MOUNTED) return;
    document.removeEventListener('click', onClick);
    MOUNTED = false;
  }

  // API publik + kompat onclick HTML lama
  var api = {
    mount: mount,
    unmount: unmount,
    renderUsers: renderUsers,
    createNewUser: createNewUser,
    saveEditUser: saveEditUser,
    openEditModal: openEditModal,
    closeEditModal: closeEditModal,
    deleteUser: deleteUser,
    resetUserPassword: resetUserPassword,
    callAdminUsers: callAdminUsers
  };

  global.CmdUsers = api;
  global.createNewUser = createNewUser;
  global.saveEditUser = saveEditUser;
  global.renderUsers = renderUsers;
  global.openEditModal = openEditModal;
  global.closeEditModal = closeEditModal;
  global.deleteUser = deleteUser;
  global.resetUserPassword = resetUserPassword;

  console.log('[cmd-users] module ready');
})(typeof window !== 'undefined' ? window : globalThis);
