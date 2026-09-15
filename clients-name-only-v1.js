/* DCC — Clientes: nombre + botón directo Gestionar cliente */
(function(){
'use strict';
const BUILD='20260915-clients-manage-action-v2';
if(window.__dccClientsNameOnly===BUILD)return;window.__dccClientsNameOnly=BUILD;

function injectCss(){
  let s=document.getElementById('dcc-clients-name-only-v1');
  if(!s){s=document.createElement('style');s.id='dcc-clients-name-only-v1';document.head.appendChild(s)}
  s.textContent=`
    #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
      grid-template-columns:minmax(0,1fr) auto!important;
      min-height:82px!important;
      padding:12px 14px 12px 18px!important;
      gap:12px!important;
      align-items:center!important;
    }
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-goal,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-weight,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-ref-meta,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-active,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-training,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-manage{display:none!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-info{display:flex!important;align-items:center!important;min-width:0!important;min-height:44px!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-name{margin:0!important;font-size:16px!important;font-weight:800!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-chevron{
      box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;
      width:auto!important;height:44px!important;align-self:center!important;padding:0 13px!important;
      border:1px solid #d9aa4a!important;border-radius:14px!important;background:transparent!important;
      color:#9d6a13!important;font-size:12px!important;font-weight:800!important;line-height:1!important;
      white-space:nowrap!important;cursor:pointer!important;
    }
    #coach-main.dcc-premium-clients .dcc-cl-chevron .dcc-manage-arrow{margin-left:8px!important;font-size:21px!important;line-height:1!important;color:#b77b13!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-chevron{color:#f0c96b!important;border-color:#d9aa4a!important;background:rgba(217,170,74,.025)!important}
    @media(max-width:390px){
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{padding-left:14px!important;padding-right:10px!important;gap:8px!important}
      #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-name{font-size:15px!important}
      #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-chevron{height:42px!important;padding:0 10px!important;font-size:11px!important}
      #coach-main.dcc-premium-clients .dcc-cl-chevron .dcc-manage-arrow{margin-left:6px!important;font-size:19px!important}
    }
  `;
}

function apply(){
  injectCss();
  const main=document.getElementById('coach-main');
  if(!main||!main.classList.contains('dcc-premium-clients'))return;
  main.querySelectorAll('.dcc-cl-card.dcc-cl-card-ref').forEach(card=>{
    const arrow=card.querySelector('.dcc-cl-chevron');
    if(!arrow)return;
    if(arrow.dataset.manageReady!=='1'){
      arrow.dataset.manageReady='1';
      arrow.innerHTML='Gestionar cliente<span class="dcc-manage-arrow">›</span>';
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
