/* DCC — estabilidad visual del entrenador: sin saltos de navegación ni observers legacy */
(function(){
  'use strict';
  const BUILD='20260915-coach-render-stability-v1';
  if(window.__dccCoachRenderStability===BUILD)return;
  window.__dccCoachRenderStability=BUILD;

  function css(){
    if(document.getElementById('dcc-coach-render-stability-v1-css'))return;
    const s=document.createElement('style');
    s.id='dcc-coach-render-stability-v1-css';
    s.textContent=`
      html{scroll-behavior:auto!important}
      #coach-nav button,#coach-main .dcc-ca-tab{transition:none!important;animation:none!important}
      #coach-nav button.active,#coach-main .dcc-ca-tab.active{transform:none!important}
      #coach-main.dcc-ca .dcc-ca-head + .dcc-ca-profile-actions{display:none!important}
      #coach-main.dcc-ca .dcc-client-edit-authority-btn{display:none!important}
      #coach-main.dcc-ca .dcc-ca-card .dcc-summary-actions-bottom .dcc-ca-edit-client{display:block!important}
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function stopStoredLegacyObservers(){
    const main=document.getElementById('coach-main');if(!main)return;
    for(const key of ['__dccClientEditV2Observer','__dccRcCoachStabilityObserver']){
      const value=main[key];
      try{value?.disconnect?.()}catch(_){}
      main[key]={disconnect(){}};
    }
  }

  function boot(){css();stopStoredLegacyObservers()}
  boot();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  window.addEventListener('pageshow',boot);
  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#coach-nav,.dcc-ca-tabs'))stopStoredLegacyObservers();
  },true);
})();
