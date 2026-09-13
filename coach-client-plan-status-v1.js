/* DCC — complementos visuales de ejercicios.
   Este archivo ya no contiene autoridades de cliente, auth, métricas ni rutinas. */
(function(){
  'use strict';
  const BUILD='20260913-exercise-visual-addons-v5';
  if(window.__dccExerciseVisualAddons===BUILD)return;
  window.__dccExerciseVisualAddons=BUILD;

  function loadOnce(src,key){
    if(document.querySelector(`script[data-${key}]`))return;
    const base=src.split('?')[0].replace('./','');
    if([...document.scripts].some(s=>(s.src||'').includes(base)))return;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.dataset[key]='1';
    script.onerror=()=>console.error('DCC: no se pudo cargar '+base);
    (document.head||document.documentElement).appendChild(script);
  }

  loadOnce('./exercise-premium-pectoral-v1.js?v=20260913-2325','dccExercisePremium');
  loadOnce('./exercise-guidance-v1.js?v=20260913-2325','dccExerciseGuidance');
})();