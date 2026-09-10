/* DCC — Puente Progreso v8.
   Carga una única capa final de Progreso y la sincronización de métricas.
   Se eliminan los listeners antiguos para evitar parpadeos y dobles renders. */
(function(){
  'use strict';
  if(window.__dccProgressV8BridgeLoaded) return;
  window.__dccProgressV8BridgeLoaded=true;

  function loadOnce(src,key){
    if(document.querySelector(`script[data-dcc-${key}]`)) return;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.dataset[`dcc${key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())}`]='1';
    document.head.appendChild(script);
  }

  loadOnce('./client-progress-final-v9.js?v=20260910-3','progress-final-v9');
  loadOnce('./client-metrics-sync-v10.js?v=20260910-bfh11','metrics-sync-v10');
  loadOnce('./client-delete-persist-v1.js?v=20260910-2243','client-delete-persist-v1');
})();
