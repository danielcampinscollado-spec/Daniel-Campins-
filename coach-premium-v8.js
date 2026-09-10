/* DCC coach premium loader — core + state + unified UI */
(function(){
  'use strict';
  if(window.__dccCoachPremiumLoaderV12)return;
  window.__dccCoachPremiumLoaderV12=true;

  function add(src,key,onload){
    if(document.querySelector(`script[data-dcc-${key}]`)){ if(onload)onload(); return; }
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset['dcc'+key.charAt(0).toUpperCase()+key.slice(1)]='1';
    if(onload)s.onload=onload;
    s.onerror=()=>console.error('DCC: no se pudo cargar '+src);
    (document.head||document.documentElement).appendChild(s);
  }

  function loadEnhancers(){
    add('./coach-panel-state-v10.js?v=20260910-1918','panelState',()=>{
      add('./coach-ui-v11.js?v=20260910-1932','coachUi');
    });
  }

  function hasPremium(fn,depth){
    if(!fn||typeof fn!=='function'||depth>8)return false;
    if(fn.__dccPremiumV9||fn.__dccPremiumV6)return true;
    return hasPremium(fn.__base,depth+1)||hasPremium(fn.__original,depth+1);
  }

  if(hasPremium(window.showCoach,0)){
    loadEnhancers();
  }else{
    add('./coach-premium-core-v9.js?v=20260910-1938','coachCore',loadEnhancers);
  }
})();
