/* DCC — resumen cliente: elimina bloque redundante de actividad de entrenamiento */
(function(){
  'use strict';
  if(window.__dccClientSummaryCleanupV1)return;
  window.__dccClientSummaryCleanupV1=true;

  function cleanup(){
    const main=document.getElementById('coach-main');
    if(!main)return;
    main.querySelectorAll('.dcc-ca-activity-head').forEach(head=>{
      const title=head.querySelector('h2');
      if(String(title?.textContent||'').trim()==='Actividad de entrenamiento'){
        head.closest('.dcc-ca-card')?.remove();
      }
    });
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;cleanup()});
  }

  cleanup();
  const observer=new MutationObserver(schedule);
  const start=()=>{
    const main=document.getElementById('coach-main');
    if(main)observer.observe(main,{childList:true,subtree:true});
    cleanup();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('pageshow',schedule);
})();
