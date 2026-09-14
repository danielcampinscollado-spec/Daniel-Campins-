/* DCC coach dashboard authority v1 — refresh dashboard only after Supabase clients are synchronized */
(function(){
  'use strict';
  if(window.__dccCoachDashboardAuthorityV1)return;
  window.__dccCoachDashboardAuthorityV1=true;

  function isCoachDashboard(){
    try{
      return window.currentApp==='coach' && window.currentScreen==='dashboard';
    }catch(e){return false;}
  }

  function refreshDashboard(){
    if(!isCoachDashboard() || typeof window.showCoach!=='function')return;
    const main=document.getElementById('coach-main');
    if(main) delete main.dataset.dccInstant;
    try{ window.showCoach('dashboard'); }catch(e){ console.error('DCC dashboard refresh:',e); }
  }

  function wrapClientsLoader(){
    const fn=window.loadClientsFromSupabase;
    if(typeof fn!=='function' || fn.__dccDashboardAuthorityV1)return false;
    const wrapped=async function(){
      const result=await fn.apply(this,arguments);
      refreshDashboard();
      return result;
    };
    wrapped.__dccDashboardAuthorityV1=true;
    wrapped.__original=fn;
    window.loadClientsFromSupabase=wrapped;
    return true;
  }

  let tries=0;
  const timer=setInterval(function(){
    tries++;
    if(wrapClientsLoader() || tries>80)clearInterval(timer);
  },50);
  wrapClientsLoader();
})();