const VERSION="2004041619",FILES=["/","/dist/gate.js"],CACHE="APP_"+VERSION,OFFLINE="OFFLINE_"+VERSION,DATAFILE="/config";self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(e=>{e.addAll(FILES)}).then(()=>self.skipWaiting()))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(async e=>{for(const t of e)t!==CACHE&&await caches.delete(t);self.clients.claim()}))}),self.addEventListener("fetch",e=>{const{request:t,request:{url:n,method:s}}=e;if(n.match(DATAFILE))return"POST"===s?(t.json().then(e=>caches.open(CACHE).then(t=>t.put(DATAFILE,new Response(JSON.stringify(e))))),e.respondWith(new Response("{}"))):e.respondWith(caches.match(DATAFILE).then(e=>e||new Response("{}")));"POST"!==s&&e.respondWith(caches.open(CACHE).then(t=>t.match(e.request).then(t=>t||fetch(e.request).then(e=>e))))});