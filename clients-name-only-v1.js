/* DCC — Clientes: nombre + botón compacto Gestionar cliente */
(function(){
'use strict';
const BUILD='20260915-clients-manage-action-v3';
if(window.__dccClientsNameOnly===BUILD)return;window.__dccClientsNameOnly=BUILD;

function injectCss(){
  let s=document.getElementById('dcc-clients-name-only-v1');
  if(!s){s=document.createElement('style');s.id='dcc-clients-name-only-v1';document.head.appendChild(s)}
  s.textContent=`
    #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{
      grid-template-columns:minmax(0,1fr) 138px!important;
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
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-manage,
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-chevron{display:none!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-info{display:flex!important;align-items:center!important;min-width:0!important;min-height:44px!important}
    #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-name{margin:0!important;font-size:16px!important;font-weight:800!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    #coach-main.dcc-premium-clients .dcc-manage-client-btn{
      box-sizing:border-box!important;width:138px!important;height:42px!important;margin:0!important;padding:0 10px!important;
      display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;
      border:1px solid #d9aa4a!important;border-radius:13px!important;background:rgba(255,255,255,.36)!important;
      color:#8f6112!important;font-family:inherit!important;font-size:11.5px!important;font-weight:800!important;line-height:1!important;
      letter-spacing:0!important;text-transform:none!important;white-space:nowrap!important;box-shadow:none!important;cursor:pointer!important;
    }
    #coach-main.dcc-premium-clients .dcc-manage-client-btn .dcc-manage-arrow{font-size:19px!important;line-height:1!important;color:#b77b13!important;font-weight:700!important}
    html:not(.dcc-theme-light-premium) #coach-main.dcc-premium-clients .dcc-manage-client-btn{color:#f0c96b!important;border-color:#d9aa4a!important;background:rgba(217,170,74,.025)!important}
    @media(max-width:390px){
      #coach-main.dcc-premium-clients .dcc-cl-card.dcc-cl-card-ref{grid-template-columns:minmax(0,1fr) 126px!important;padding-left:14px!important;padding-right:10px!important;gap:8px!important}
      #coach-main.dcc-premium-clients .dcc-cl-card-ref .dcc-cl-name{font-size:15px!important}
      #coach-main.dcc-premium-clients .dcc-manage-client-btn{width:126px!important;height:40px!important;padding:0 8px!important;font-size:10.5px!important;gap:5px!important}
      #coach-main.dcc-premium-clients .dcc-manage-client-btn .dcc-manage-arrow{font-size:18px!important}
    }
  `;
}

function apply(){
  injectCss();
  const main=document.getElementById('coach-main');
  if(!main||!main.classList.contains('dcc-premium-clients'))return;
  main.querySelectorAll('.dcc-cl-card.dcc-cl-card-ref').forEach(card=>{
    if(card.querySelector('.dcc-manage-client-btn'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='dcc-manage-client-btn';
    btn.setAttribute('aria-label','Gestionar cliente');
    btn.innerHTML='Gestionar cliente<span class="dcc-manage-arrow">›</span>';
    card.appendChild(btn);
  });
}

document.addEventListener('dcc:coach-screen',e=>{if(e.detail?.screen==='clients')requestAnimationFrame(apply)});
const obs=new MutationObserver(()=>{if(document.getElementById('coach-main')?.classList.contains('dcc-premium-clients'))apply()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()},{once:true});
else{injectCss();obs.observe(document.body,{childList:true,subtree:true});apply()}
})();
