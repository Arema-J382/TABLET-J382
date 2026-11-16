importScripts('/sw-sync.js'); // Background Sync + Periodic Sync (file baru)
const C='tab-v2',A=['/','/index.html','/manifest.json','/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('/')))});

/* ---- Web Push: tampil saat aplikasi DITUTUP. Judul = nama tablet, suara = suara notifikasi bawaan sistem ---- */
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data.json()}catch(_){d={title:'Koneksi Tablet',body:e.data?e.data.text():''}}
  // Suara & getar sepenuhnya mengikuti pengaturan notifikasi perangkat (silent:false = pakai nada sistem)
  e.waitUntil(self.registration.showNotification(d.title||'Koneksi Tablet',{
    body:d.body||'',
    icon:'/icon-192.png',
    badge:'/icon-192.png',
    tag:d.tag||'tablet',
    renotify:true,
    requireInteraction:true,
    silent:false,
    data:d
  }));
});
