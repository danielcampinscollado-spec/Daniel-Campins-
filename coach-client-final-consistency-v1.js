/* DCC — consistencia final de clientes del entrenador tras auth y rerenders */
(function(){
  'use strict';
  const BUILD='20260913-coach-client-final-consistency-v1';
  if(window.__dccCoachClientFinalConsistency===BUILD)return;
  window.__dccCoachClientFinalConsistency=BUILD;

  let syncRunning=false;
  let refreshQueued=false;
  let lastSyncAt=0;

  function db(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function coachVisible(){
    const el=document.getElementById('coach');
    if(!el)return false;
    try{return getComputedStyle(el).display!=='none'}catch(_){return true}
  }

  function dedupeEditButtons(){
    const root=document.querySelector('#coach-main.dcc-ca');
    if(!root)return;
    const candidates=[...root.querySelectorAll('button,a,[role="button"]')].filter(el=>
      String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase()==='editar cliente'
    );
    if(candidates.length<=1)return;
    const keep=candidates.find(el=>el.classList.contains('dcc-client-edit-authority-btn'))||candidates[0];
    candidates.forEach(el=>{if(el!==keep)el.remove()});
  }

  async function coachSessionReady(){
    if(window.__dccSecureRole==='coach')return true;
    const database=db();
    if(!database?.auth)return false;
    const sr=await database.auth.getSession();
    const session=sr?.data?.session;
    if(!session)return false;
    const pr=await database.from('app_profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    return !pr.error&&pr.data?.role==='coach';
  }

  async function forceSyncAndRender(){
    if(syncRunning||!coachVisible())return;
    if(!(await coachSessionReady()))return;
    const sync=window.dccCriticalSyncClients||window.dccSyncClientsFromServer;
    if(typeof sync!=='function')return;
    syncRunning=true;
    try{
      await sync(false);
      lastSyncAt=Date.now();
      if(typeof window.showCoach==='function'){
        const inClientAdmin=!!document.querySelector('#coach-main.dcc-ca');
        if(!inClientAdmin){
          const screen=window.currentScreen==='clients'?'clients':'dashboard';
          window.showCoach(screen);
        }
      }
      queueMicrotask(dedupeEditButtons);
      requestAnimationFrame(dedupeEditButtons);
    }catch(error){
      console.warn('DCC final coach consistency sync:',error);
    }finally{
      syncRunning=false;
    }
  }

  function refresh(){
    if(refreshQueued)return;
    refreshQueued=true;
    requestAnimationFrame(()=>{
      refreshQueued=false;
      dedupeEditButtons();
      const now=Date.now();
      const onOverview=!document.querySelector('#coach-main.dcc-ca');
      if(onOverview&&coachVisible()&&now-lastSyncAt>700)forceSyncAndRender();
    });
  }

  // Observa document.body, no un coach-main concreto: sobrevive a reemplazos completos del nodo.
  function bindGlobalObserver(){
    if(document.body?.__dccCoachFinalConsistencyBound)return;
    if(!document.body)return;
    document.body.__dccCoachFinalConsistencyBound=true;
    new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
  }

  function bootstrap(){
    bindGlobalObserver();
    dedupeEditButtons();
    forceSyncAndRender();
  }

  document.addEventListener('DOMContentLoaded',()=>queueMicrotask(bootstrap),{once:true});
  window.addEventListener('load',()=>queueMicrotask(bootstrap),{once:true});
  window.addEventListener('pageshow',()=>queueMicrotask(bootstrap));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)bootstrap()});
  document.addEventListener('click',e=>{
    const t=String(e.target?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(t==='clientes'||t==='panel'||t==='resumen'||t==='editar cliente')setTimeout(bootstrap,0);
  },true);

  [0,100,300,700,1400,2500,4000].forEach(ms=>setTimeout(bootstrap,ms));
})();
