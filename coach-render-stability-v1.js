/* DCC — estabilidad visual del entrenador: sin saltos, sin animaciones de ruta */
(function(){
  'use strict';
  const BUILD='20260915-coach-render-stability-v2';
  if(window.__dccCoachRenderStability===BUILD)return;
  window.__dccCoachRenderStability=BUILD;

  function css(){
    if(document.getElementById('dcc-coach-render-stability-v2-css'))return;
    document.getElementById('dcc-coach-render-stability-v1-css')?.remove();
    const s=document.createElement('style');
    s.id='dcc-coach-render-stability-v2-css';
    s.textContent=`
      html{scroll-behavior:auto!important}
      #coach-nav button,#coach-main .dcc-ca-tab{transition:none!important;animation:none!important}
      #coach-nav button.active,#coach-main .dcc-ca-tab.active{transform:none!important}
      #coach-main.dcc-ca .dcc-ca-head + .dcc-ca-profile-actions{display:none!important}
      #coach-main.dcc-ca .dcc-client-edit-authority-btn{display:none!important}
      #coach-main.dcc-ca .dcc-ca-card .dcc-summary-actions-bottom .dcc-ca-edit-client{display:block!important}

      /* El buscador premium de Clientes tenía fondo oscuro heredado del tema base. */
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search{
        background:#fffefa!important;
        background-color:#fffefa!important;
        color:#6f7782!important;
        border:1px solid rgba(177,119,18,.25)!important;
        box-shadow:0 7px 18px rgba(78,58,28,.045)!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input{
        background:transparent!important;color:#17191d!important;-webkit-text-fill-color:#17191d!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main.dcc-premium-clients .dcc-cl-search input::placeholder{
        color:#858c96!important;-webkit-text-fill-color:#858c96!important;opacity:1!important;
      }
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
})();
