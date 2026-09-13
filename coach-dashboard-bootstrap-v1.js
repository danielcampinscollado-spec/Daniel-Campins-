/* DCC — fuerza la sincronización inicial del panel de entrenador tras Auth */
(function(){
  'use strict';
  const BUILD='20260913-coach-dashboard-bootstrap-v1';
  if(window.__dccCoachDashboardBootstrap===BUILD)return;
  window.__dccCoachDashboardBootstrap=BUILD;

  let running=false;
  let done=false;

  function coachVisible(){
    const el=document.getElementById('coach');
    if(!el)return false;
    const style=window.getComputedStyle?getComputedStyle(el):null;
    return style?style.display!=='none':true;
  }

  async function syncAndRender(){
    if(running||done)return;
    if(window.__dccSecureRole!=='coach')return;
    if(!coachVisible())return;
    const sync=window.dccCriticalSyncClients||window.dccSyncClientsFromServer;
    if(typeof sync!=='function')return;
    running=true;
    try{
      const result=await sync(false);
      if(result===false)return;
      if(typeof window.showCoach==='function'){
        const screen=(window.currentScreen==='clients')?'clients':'dashboard';
        window.showCoach(screen);
      }
      done=true;
    }catch(error){
      console.warn('DCC coach dashboard bootstrap:',error);
    }finally{
      running=false;
    }
  }

  const attempts=[0,80,220,500,900,1500,2500];
  attempts.forEach(ms=>setTimeout(syncAndRender,ms));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!done)syncAndRender()});
  window.addEventListener('pageshow',()=>{if(!done)syncAndRender()});
})();
