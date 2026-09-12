/* DCC — tema entrenador: bootstrap único y estable
   Este archivo sí está cargado directamente por index.html.
   No contiene lógica de negocio; sólo activa la capa visual única. */
(function(){
  'use strict';
  if(window.__dccCoachThemeBootstrapStableV1)return;
  window.__dccCoachThemeBootstrapStableV1=true;

  function loadStableTheme(){
    const name='coach-light-stable-v1.js';
    const existing=[...document.scripts].find(s=>(s.src||'').includes(name));
    if(existing)return;

    const script=document.createElement('script');
    script.src='./coach-light-stable-v1.js?v=20260912-2';
    script.async=false;
    script.dataset.dccCoachStable='1';
    script.onerror=()=>console.error('DCC: no se pudo cargar el tema estable del entrenador');
    (document.head||document.documentElement).appendChild(script);
  }

  loadStableTheme();
  document.addEventListener('DOMContentLoaded',loadStableTheme,{once:true});
  window.addEventListener('pageshow',loadStableTheme);
})();
