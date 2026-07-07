// === SUPABASE PROFILE SYNC ===
// Fungsi ini akan MENIMPA fungsi saveProfile yang lama
window.saveProfile = async function() {
    const nama = document.getElementById('edit-nama').value;
    const phone = document.getElementById('edit-phone').value;
    const department = document.getElementById('edit-department').value;
    
    const user = JSON.parse(localStorage.getItem('dreamos_bound_user'));
    if (!user) return alert('❌ Sesi tidak valid.');
    
    try {
        const { error } = await window.parent.supabase
            .from('users')
            .upsert({
                id: user.id,
                email: user.email,
                nama: nama,
                role: user.role,
                phone: phone,
                department: department
            });
            
        if (error) throw error;
        
        // Update localStorage juga
        user.nama = nama;
        user.phone = phone;
        user.department = department;
        localStorage.setItem('dreamos_bound_user', JSON.stringify(user));
        
        // Update UI
        document.getElementById('display-name').textContent = nama;
        document.getElementById('info-nama').textContent = nama;
        
        alert('✅ Profile disimpan ke Cloud & Lokal!');
        
        // Audit log
        window.parent.supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'UPDATE_PROFILE',
            details: 'Profile updated'
        }).then(() => {});
        
    } catch (e) {
        alert('⚠️ Gagal simpan ke cloud: ' + e.message);
    }
};
