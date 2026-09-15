/* DCC — resumen cliente: elimina actividad redundante en la misma pasada de render */
(function(){
  'use strict';
  const BUILD='20260915-client-summary-cleanup-v2-stable';
  if(window.__dccClientSummaryCleanup===BUILD)return;
  window.__dccClientSummaryCleanup=BUILD;
  window.__dccClientSummaryCleanupV1=true;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  function cleanup(){
    const main=document.querySelector('#coach-main.dcc-ca');if(!main)return;
    const active=norm(main.querySelector('.dcc-ca-tab.active')?.textContent);
    if(active!=='resumen'&&active!=='summary')return;
    main.querySelectorAll('.dcc-ca-activity-head').forEach(head=>{
      if(norm(head.querySelector('h2')?.textContent)==='actividad de entrenamiento')head.closest('.dcc-ca-card')?.remove();
    });
  }

  function wrap(){
    const base=window.dccClientAdmin;
    if(typeof base!=='function'||base.__dccSummaryCleanupStableV2)return false;
    const wrapped=function(){const out=base.apply(this,arguments);cleanup();return out};
    wrapped.__dccSummaryCleanupStableV2=true;wrapped.__base=base;window.dccClientAdmin=wrapped;return true;
  }

  function boot(){if(!wrap()){let tries=0;const timer=setInterval(()=>{tries++;if(wrap()||tries>=12)clearInterval(timer)},100)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
