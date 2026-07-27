/* LegadoERP - Service Worker seguro v36
   Não intercepta navegação, Supabase, favicon ou arquivos do ERP.
*/
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Sem listener de fetch propositalmente.
// O navegador acessa a rede normalmente e o ERP não sofre interferência.
