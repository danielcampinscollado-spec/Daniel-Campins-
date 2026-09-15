/* DCC — Clientes: nombre + acceso directo a gestionar cliente */
(function(){
'use strict';
const BUILD='20260915-clients-name-only-v1';
if(window.__dccClientsNameOnly===BUILD)return;window.__dccClientsNameOnly=BUILD;

function injectCss(){
  if(document.getElementById('dcc-clients-name-only-v1'))return;
  const s=document.createElement('style');
  s.id='dcc-clients-name-only-v1';
  s.textContent=`
    #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
      grid-template-columns:minmax(0,1fr) 32px!important;
      min-height:68px!important;
      padding:12px 16px!important;
      gap:12px!important;
      align-items:center!important;
    }
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-goal,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-weight,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-ref-meta,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-active,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-training,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-manage{display:none!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-info{display:flex!important;align-items:center!important;min-height:40px!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-name{margin:0!important;font-size:16px!important;font-weight:800!important;line-height:1.2!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-chevron{
      display:flex!important;align-items:center!important;justify-content:flex-end!important;
      width:32px!important;height:100%!important;align-self:stretch!important;
      color:#d9aa4a!important;font-size:28px!important;line-height:1!important;
      cursor:pointer!important;
    }
  `;
  document.head.appendChild(s);
}

function apply(){
  injectCss();
  const main=document.getElementById('coach-main');
  if(!main||!main.classList.contains('dcc-premium-clients'))return;
  main.querySelectorAll('.dcc-cl-card.dcc-cl-card-ref').forEach(card=>{
    const arrow=card.querySelector('.dcc-cl-chevron');
    if(arrow){
      arrow.setAttribute('role','button');
      arrow.setAttribute('aria-label','Gestionar cliente');
      arrow.setAttribute('title','Gestionar cliente');
    }
  });
}

document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen==='clients')requestAnimationFrame(apply)});
const obs=new MutationObserver(()=>{if(document.getElementById('coach-main')?.classList.contains('dcc-premium-clients'))apply()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()},{once:true});
else{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()}
})();
