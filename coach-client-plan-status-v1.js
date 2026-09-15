/* DCC — loader temporal para conservar auditoría y cargar clientes compactos */
(function(){
  'use strict';
  if(window.__dccCoachStatusLoaderCompactV1)return;
  window.__dccCoachStatusLoaderCompactV1=true;
  function load(src,done){const s=document.createElement('script');s.src=src;s.async=false;s.onload=()=>done&&done();s.onerror=()=>console.error('DCC: no se pudo cargar '+src);document.head.appendChild(s)}
  load('./coach-client-plan-status-v1-original.js?v=20260915-1',()=>load('./clients-compact-v1.js?v=20260915-1'));
})();
