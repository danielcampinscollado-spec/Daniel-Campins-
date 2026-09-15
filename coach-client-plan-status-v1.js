/* DCC — bootstrap estable: sin observer global ni repintados diferidos del perfil */
(function(){
  'use strict';
  const BUILD='20260915-client-quality-bootstrap-v6-stable';
  if(window.__dccAuditBootstrapStable===BUILD)return;
  window.__dccAuditBootstrapStable=BUILD;
  window.__dccAppQualityV5=true;
  function load(src,key){
    if(document.querySelector('script[data-dcc-stable="'+key+'"]'))return;
    const s=document.createElement('script');s.src=src;s.async=false;s.dataset.dccStable=key;
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
  }
  load('./exercise-premium-pectoral-v1.js?v=20260911-1','exercise-premium');
  load('./exercise-guidance-v1.js?v=20260911-1','exercise-guidance');
  load('./auth-premium-v1.js?v=20260914-auth-google-rc1','secure-auth');
})();
