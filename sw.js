// Service worker TABLET — notifikasi Web Push saat aplikasi ditutup / tablet idle / sleep
try{ importScripts('/sw-sync.js'); }catch(_){} // Background Sync + Periodic Sync (jika file gagal dimuat, SW & push tetap hidup)
const C='tab-v3',A=['/','/index.html','/manifest.json','/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c)).catch(()=>{})}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('/')))});

/* ---- Web Push: tampil saat aplikasi DITUTUP. Judul = nama tablet, suara = nada notifikasi bawaan sistem ---- */
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data.json()}catch(_){d={title:'Koneksi Tablet',body:e.data?e.data.text():''}}
  const tampil=self.registration.showNotification(d.title||'Koneksi Tablet',{
    body:d.body||'',
    icon:'/icon-192.png',
    badge:'/icon-192.png',
    tag:d.tag||'tablet',
    renotify:true,            // setiap push baru kembali berbunyi walau tag sama
    requireInteraction:true,
    silent:false,             // pakai nada sistem
    vibrate:[300,150,300,150,600],
    timestamp:Date.now(),
    data:d
  });
  // Jika aplikasi sedang terbuka, minta halaman membunyikan alarm keras
  const info=clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.forEach(c=>c.postMessage({type:'push-in'})));
  e.waitUntil(Promise.all([tampil,info]));
});

// Browser kadang mengganti langganan push -> minta halaman mendaftarkan ulang ke Supabase
self.addEventListener('pushsubscriptionchange',e=>{
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.forEach(c=>c.postMessage({type:'resub'}))));
});
