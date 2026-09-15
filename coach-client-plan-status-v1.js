/* DCC — bootstrap estable: sin observer global ni repintados diferidos del perfil */
(function(){
  'use strict';
  const BUILD='20260915-client-quality-bootstrap-v6-stable';
  if(window.__dccAuditBootstrapStable===BUILD)return;
  window.__dccAuditBootstrapStable=BUILD;

  /* La antigua capa quality-v5 instalaba un MutationObserver sobre todo #coach-main,
     envolvía dccClientAdmin y volvía a decorar el perfil por RAF, 80 ms y tras una
     consulta de red. Eso generaba varios layouts por cada toque en Gestionar cliente.
     La marcamos como satisfecha para que no vuelva a arrancar desde otra carga. */
  window.__dccAppQualityV5=true;

  function load(src,key){
    if(document.querySelector('script[data-dcc-stable="'+key+'"]'))return;
    const s=document.createElement('script');
    s.src=src;s.async=false;s.dataset.dccStable=key;
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
  }

  /* Se mantienen únicamente dependencias funcionales que no repintan el perfil. */
  load('./exercise-premium-pectoral-v1.js?v=20260911-1','exercise-premium');
  load('./exercise-guidance-v1.js?v=20260911-1','exercise-guidance');
  load('./auth-premium-v1.js?v=20260914-auth-google-rc1','secure-auth');
})();
