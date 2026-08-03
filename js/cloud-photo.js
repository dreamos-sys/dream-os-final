// js/cloud-photo.js — Dream OS Cloud Photo Helper (Supabase Storage)
(function(){
  'use strict';
  window.CloudPhoto = {
    // Kompres via canvas: max 1280px, JPEG 0.82 (hemat bandwidth & storage)
    compress: function(file, maxDim, quality){
      maxDim = maxDim || 1280; quality = quality || 0.82;
      return new Promise(function(resolve, reject){
        var reader = new FileReader();
        reader.onload = function(ev){
          var img = new Image();
          img.onload = function(){
            var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
            var canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = reject;
          img.src = ev.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    dataURLtoBlob: function(dataUrl){
      var parts = dataUrl.split(',');
      var mime = (parts[0].match(/data:(.*?);/) || [,'image/jpeg'])[1];
      var bin = atob(parts[1]);
      var arr = new Uint8Array(bin.length);
      for (var i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: mime });
    },
    // Upload ke bucket → return URL publik. Gagal = throw (caller fallback base64)
    upload: async function(file, bucket){
      if (!window.supabaseClient) throw new Error('offline');
      var dataUrl = await CloudPhoto.compress(file);
      var blob = CloudPhoto.dataURLtoBlob(dataUrl);
      var ext = ((file.name||'').split('.').pop() || 'jpg').toLowerCase();
      var path = new Date().toISOString().slice(0,10) + '/' + Date.now() + '_' + Math.random().toString(36).slice(2,8) + '.' + ext;
      var res = await window.supabaseClient.storage.from(bucket).upload(path, blob, { contentType: 'image/jpeg', upsert: false });
      if (res.error) throw new Error(res.error.message);
      return window.supabaseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    }
  };
})();
