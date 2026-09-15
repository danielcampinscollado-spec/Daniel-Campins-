/* DCC — bootstrap estable: autoridades activas de navegación, check-in y mensajes */
(function(){
  'use strict';
  const BUILD='20260915-client-quality-bootstrap-v8-nav';
  if(window.__dccAuditBootstrapStable===BUILD)return;
  window.__dccAuditBootstrapStable=BUILD;
  window.__dccAppQualityV5=true;

  function load(src,key,onload){
    const old=document.querySelector('script[data-dcc-stable="'+key+'"]');
    if(old){
      if(onload){
        if(old.dataset.loaded==='1')onload();
        else old.addEventListener('load',onload,{once:true});
      }
      return;
    }
    const s=document.createElement('script');
    s.src=src;s.async=false;s.dataset.dccStable=key;
    s.onload=()=>{s.dataset.loaded='1';if(onload)onload()};
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
  }

  load('./exercise-premium-pectoral-v1.js?v=20260911-1','exercise-premium');
  load('./exercise-guidance-v1.js?v=20260911-1','exercise-guidance');
  load('./auth-premium-v1.js?v=20260914-auth-google-rc1','secure-auth');

  /* Estas dos pantallas se cargan DESPUÉS de los wrappers legacy para que sean la autoridad visual real. */
  load('./checkin-premium.js?v=20260915-nav1','checkin-premium',()=>{
    load('./messages-premium.js?v=20260915-nav1','messages-premium',()=>{
      load('./dcc-coach-nav-final-v1.js?v=20260915-nav1','coach-nav-final');
    });
  });
})();
