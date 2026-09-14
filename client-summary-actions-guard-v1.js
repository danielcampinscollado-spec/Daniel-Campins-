/* DCC — acciones de cliente solo en Resumen */
(function(){
  'use strict';
  const BUILD='20260914-client-summary-actions-v2';
  if(window.__dccClientSummaryActions===BUILD)return;
  window.__dccClientSummaryActions=BUILD;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  let queued=false;

  function editControls(root){
    return [...root.querySelectorAll('button,a,[role="button"],[onclick]')].filter(el=>norm(el.textContent)==='editar cliente');
  }
  function isSummary(root){return norm(root.querySelector('.dcc-ca-tab.active')?.textContent)==='resumen'}

  function apply(){
    const root=document.querySelector('#coach-main.dcc-ca');
    if(!root)return;
    const edits=editControls(root);

    if(!isSummary(root)){
      edits.forEach(el=>el.remove());
      root.querySelectorAll('.dcc-ca-profile-actions,.dcc-summary-actions-bottom').forEach(box=>box.remove());
      return;
    }

    if(edits.length>1){
      const keep=edits.find(el=>el.classList?.contains('dcc-client-edit-authority-btn'))||edits[0];
      edits.forEach(el=>{if(el!==keep)el.remove()});
    }
    root.querySelectorAll('.dcc-ca-profile-actions').forEach(box=>{if(!box.children.length)box.remove()});
  }

  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
  function boot(){
    apply();
    if(document.body&&!document.body.__dccClientSummaryActionsObserverV2){
      document.body.__dccClientSummaryActionsObserverV2=true;
      new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
  }

  document.addEventListener('click',()=>setTimeout(schedule,0),true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',boot);
})();
