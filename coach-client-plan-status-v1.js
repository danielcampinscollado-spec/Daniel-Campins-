/* DCC — bootstrap estable y realmente conectado al index activo */
(function(){
  'use strict';
  const BUILD='20260915-client-quality-bootstrap-v7-runtime';
  if(window.__dccAuditBootstrapStable===BUILD)return;
  window.__dccAuditBootstrapStable=BUILD;

  /* Evita que vuelva a arrancar la antigua capa quality-v5 con observers globales. */
  window.__dccAppQualityV5=true;

  function load(src,key){
    if(document.querySelector('script[data-dcc-stable="'+key+'"]'))return;
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset.dccStable=key;
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
  }

  load('./exercise-premium-pectoral-v1.js?v=20260911-1','exercise-premium');
  load('./exercise-guidance-v1.js?v=20260911-1','exercise-guidance');
  load('./auth-premium-v1.js?v=20260914-auth-google-rc1','secure-auth');

  /* Estas tres cargas salen de un archivo que index.html sí ejecuta. Antes varias
     correcciones estaban en ficheros que no formaban parte del runtime real. */
  load('./checkin-premium.js?v=20260915-runtime1','coach-checkin-runtime');
  load('./messages-premium.js?v=20260915-runtime1','coach-messages-runtime');
  load('./dcc-coach-runtime-stable-v1.js?v=20260915-1','coach-stable-runtime');
})();
