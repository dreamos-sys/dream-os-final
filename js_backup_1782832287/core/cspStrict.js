(function(){
    document.addEventListener('click', function(e){
        const target = e.target.closest('[data-action]');
        if(!target) return;
        const action = target.getAttribute('data-action');
        let params = [];
        try {
            let raw = target.getAttribute('data-params');
            if(raw){
                // Graceful parser: ganti single quote → double quote, wrap array jika perlu
                raw = raw.replace(/'/g, '"').trim();
                if(!raw.startsWith('[')) raw = '['+raw+']';
                params = JSON.parse(raw);
            }
        } catch(err) {
            // Fallback: ambil param pertama dari string apapun
            const match = (target.getAttribute('data-params')||'').match(/['"]([^'"]+)['"]/);
            params = match ? [match[1]] : [];
        }

        if(typeof window[action] === 'function'){
            e.preventDefault();
            window[action].apply(target, params);
        } else if(typeof SafeExec !== 'undefined' && SafeExec.bridge){
            e.preventDefault();
            SafeExec.bridge(action, e, ...params);
        }
    });
    console.log('🛡️ Dream OS v1.0 Beta: CSP Delegator Active (Forgiving Parser)');
})();
