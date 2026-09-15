/* DCC — cabecera compacta del cliente, solo CSS: cero MutationObserver y cero movimientos de DOM */
(function(){
  'use strict';
  const BUILD='20260914-client-header-compact-v8-stable';
  if(window.__dccClientHeaderCompact===BUILD)return;
  window.__dccClientHeaderCompact=BUILD;

  const STYLE_ID='dcc-client-header-compact-css';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    #coach-main.dcc-ca .dcc-ca-wrap{padding-top:0!important}
    #coach-main.dcc-ca .dcc-ca-back{margin:0 0 10px!important}
    #coach-main.dcc-ca .dcc-ca-head{
      margin:0 2px 10px!important;
      padding:0!important;
      min-height:0!important;
      height:auto!important;
      display:block!important;
    }
    #coach-main.dcc-ca .dcc-ca-head h1{
      margin:0!important;
      padding:0!important;
      font-size:29px!important;
      line-height:1!important;
      letter-spacing:-.8px!important;
    }
    #coach-main.dcc-ca .dcc-ca-goal{
      margin:4px 0 0!important;
      padding:0!important;
      font-size:12px!important;
      line-height:1.15!important;
    }
    #coach-main.dcc-ca .dcc-ca-metrics{margin-top:0!important}

    /* Las acciones pertenecen únicamente al Resumen y quedan dentro de Información general. */
    #coach-main.dcc-ca .dcc-summary-actions-bottom,
    #coach-main.dcc-ca .dcc-ca-profile-actions{
      display:grid!important;
      grid-template-columns:1fr 1fr!important;
      gap:8px!important;
      margin:14px 0 0!important;
      padding:13px 0 0!important;
      border-top:1px solid rgba(177,119,18,.16)!important;
    }
    #coach-main.dcc-ca .dcc-summary-actions-bottom>button,
    #coach-main.dcc-ca .dcc-ca-profile-actions>button{
      width:100%!important;
      min-height:42px!important;
      height:42px!important;
      margin:0!important;
      padding:8px 12px!important;
      border-radius:14px!important;
      font-size:10px!important;
      font-weight:800!important;
      box-shadow:none!important;
    }
    #coach-main.dcc-ca .dcc-ca-profile-actions:empty{display:none!important}

    @media(max-width:430px){
      #coach-main.dcc-ca .dcc-ca-head h1{font-size:27px!important}
      #coach-main.dcc-ca .dcc-ca-goal{font-size:10px!important}
      #coach-main.dcc-ca .dcc-summary-actions-bottom>button,
      #coach-main.dcc-ca .dcc-ca-profile-actions>button{min-height:40px!important;height:40px!important;font-size:9px!important}
    }
  `;
  (document.head||document.documentElement).appendChild(s);
})();
