/* DCC — acciones de cliente solo en Resumen */
(function(){
  'use strict';
  const BUILD='20260914-client-summary-actions-v1';
  if(window.__dccClientSummaryActions===BUILD)return;
  window.__dccClientSummaryActions=BUILD;

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLowerCase();
  let queued=false;

  function editControls(root){
    return [...root.querySelectorAll('button,a,[role="button"],[onclick]')].filter(el=>norm(el.textContent)==='editar cliente');
  }

  function isSummary(root){
    const active=root.querySelector('.dcc-ca-tab.active');
    return norm(active?.textContent)==='resumen';
  }

  function apply(){
    const root=document.querySelector('#coach-main.dcc-ca');
    if(!root)return;
    const edits=editControls(root);

    if(!isSummary(root)){
      edits.forEach(el=>el.remove());
      root.querySelectorAll('.dcc-ca-profile-actions').forEach(box=>{
        if(!box.children.length)box.remove();
      });
      return;
    }

    if(!edits.length)return;
    const keep=edits.find(el=>el.classList?.contains('dcc-client-edit-authority-btn'))||edits[0];
    edits.forEach(el=>{if(el!==keep)el.remove()});

    const deleteBtn=[...root.querySelectorAll('button')].find(el=>norm(el.textContent).includes('eliminar cliente'));
    if(deleteBtn&&keep!==deleteBtn.previousElementSibling){
      keep.style.width='100%';
      keep.style.marginTop='10px';
      keep.style.minHeight='44px';
      deleteBtn.parentElement?.insertBefore(keep,deleteBtn);
    }
    root.querySelectorAll('.dcc-ca-profile-actions').forEach(box=>{
      if(!box.children.length)box.remove();
    });
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  }

  function boot(){
    apply();
    if(document.body&&!document.body.__dccClientSummaryActionsObserver){
      document.body.__dccClientSummaryActionsObserver=true;
      new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
  }

  document.addEventListener('click',()=>setTimeout(schedule,0),true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',boot);
})();