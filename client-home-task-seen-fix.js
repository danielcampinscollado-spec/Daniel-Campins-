/* DCC — Marca la rutina como vista al abrirla desde Tareas pendientes */
(function(){
  'use strict';

  if(window.__dccClientHomeTaskSeenFixInstalled)return;
  window.__dccClientHomeTaskSeenFixInstalled=true;

  function currentId(){
    try{return currentClientId || null}catch(_){return window.currentClientId || null}
  }

  function markRoutineSeenLocally(clientId){
    if(!clientId)return;
    const now=new Date().toISOString();

    try{
      if(typeof data!=='undefined'){
        data.notificationState=data.notificationState||{};
        data.notificationState[clientId]=data.notificationState[clientId]||{};
        data.notificationState[clientId].routineSeenAt=now;
        if(typeof saveData==='function')saveData();
      }else if(window.data){
        window.data.notificationState=window.data.notificationState||{};
        window.data.notificationState[clientId]=window.data.notificationState[clientId]||{};
        window.data.notificationState[clientId].routineSeenAt=now;
        if(typeof window.saveData==='function')window.saveData();
      }
    }catch(error){
      console.error('DCC — no se pudo marcar la rutina como vista localmente:',error);
    }

    try{
      const sync=typeof markClientNotificationSeen==='function'
        ? markClientNotificationSeen
        : window.markClientNotificationSeen;
      if(typeof sync==='function'){
        Promise.resolve(sync('routine',clientId)).catch(error=>{
          console.error('DCC — no se pudo sincronizar la rutina vista:',error);
        });
      }
    }catch(error){
      console.error('DCC — error sincronizando rutina vista:',error);
    }
  }

  document.addEventListener('click',event=>{
    const task=event.target.closest('#client-main .dch-task-row');
    if(!task)return;

    const text=(task.textContent||'').toLowerCase();
    const action=task.getAttribute('onclick')||'';
    const isNewRoutine=text.includes('nueva rutina') && /showClient\s*\(\s*["']training["']\s*\)/i.test(action);
    if(!isNewRoutine)return;

    markRoutineSeenLocally(currentId());
  },true);
})();
