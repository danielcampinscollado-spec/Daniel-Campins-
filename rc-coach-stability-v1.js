/* DCC — RC coach stability hotfix: dashboard client sync + single edit action */
(function(){
  'use strict';

  const BUILD='20260913-rc-coach-stability-v1';
  if(window.__dccRcCoachStability===BUILD)return;
  window.__dccRcCoachStability=BUILD;

  let dashboardSyncing=false;
  let dedupeQueued=false;

  function appData(){
    try{return data||{}}catch(_){return window.data||{}}
  }

  function normalizeText(value){
    return String(value||'').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function dedupeEditClientButtons(){
    const main=document.querySelector('#coach-main.dcc-ca');
    if(!main)return;

    const buttons=[...main.querySelectorAll('button')]
      .filter(button=>normalizeText(button.textContent)==='editar cliente');

    if(buttons.length<=1)return;

    const preferred=
      buttons.find(button=>button.classList.contains('dcc-client-edit-authority-btn')) ||
      buttons[0];

    buttons.forEach(button=>{
      if(button!==preferred)button.remove();
    });
  }

  function queueDedupe(){
    if(dedupeQueued)return;
    dedupeQueued=true;
    requestAnimationFrame(()=>{
      dedupeQueued=false;
      dedupeEditClientButtons();
    });
  }

  async function ensureDashboardClients(){
    if(dashboardSyncing)return;
    if(window.currentApp!=='coach'||window.currentScreen!=='dashboard')return;

    const d=appData();
    if(Array.isArray(d.clients)&&d.clients.length>0)return;
    if(typeof window.dccSyncClientsFromServer!=='function')return;

    dashboardSyncing=true;
    try{
      const ok=await window.dccSyncClientsFromServer({render:false});
      if(
        ok &&
        window.currentApp==='coach' &&
        window.currentScreen==='dashboard' &&
        typeof window.showCoach==='function'
      ){
        window.showCoach('dashboard');
      }
    }catch(error){
      console.error('DCC RC coach stability — dashboard clients:',error);
    }finally{
      dashboardSyncing=false;
    }
  }

  function wrapShowCoach(){
    const base=window.showCoach;
    if(typeof base!=='function'||base.__dccRcCoachStabilityV1)return;

    const wrapped=function(screen){
      const result=base.apply(this,arguments);
      queueDedupe();
      if(screen==='dashboard')queueMicrotask(ensureDashboardClients);
      return result;
    };

    wrapped.__dccRcCoachStabilityV1=true;
    wrapped.__base=base;
    window.showCoach=wrapped;
  }

  function wrapClientAdmin(){
    const base=window.dccClientAdmin;
    if(typeof base!=='function'||base.__dccRcCoachStabilityV1)return;

    const wrapped=function(){
      const result=base.apply(this,arguments);
      queueDedupe();
      requestAnimationFrame(queueDedupe);
      return result;
    };

    wrapped.__dccRcCoachStabilityV1=true;
    wrapped.__base=base;
    window.dccClientAdmin=wrapped;
  }

  function installObserver(){
    const main=document.getElementById('coach-main');
    if(!main||main.__dccRcCoachStabilityObserver)return;

    main.__dccRcCoachStabilityObserver=true;
    const observer=new MutationObserver(()=>{
      queueDedupe();
      if(window.currentScreen==='dashboard')queueMicrotask(ensureDashboardClients);
    });
    observer.observe(main,{childList:true,subtree:true});
  }

  function install(){
    wrapShowCoach();
    wrapClientAdmin();
    installObserver();
    queueDedupe();
    queueMicrotask(ensureDashboardClients);
  }

  install();

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    install();
    if(tries>=80)clearInterval(timer);
  },100);

  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',()=>{
    install();
    queueMicrotask(ensureDashboardClients);
  });
})();
