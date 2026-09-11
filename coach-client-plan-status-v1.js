/* DCC — arranque estable + hotfixes de auditoría v1 */
(function(){
  'use strict';

  if(window.__dccAuditBootstrapV1)return;
  window.__dccAuditBootstrapV1=true;

  const baseSrc='./coach-client-plan-status-v1-base.js?v=20260911-audit1';

  function appData(){
    try{return data||{}}catch(_){return window.data||{}}
  }

  function saveLocal(){
    try{
      if(typeof saveData==='function')return saveData();
      if(typeof window.saveData==='function')return window.saveData();
    }catch(error){console.error('DCC audit — guardado local:',error)}
  }

  function notify(message){
    try{
      if(typeof toast==='function')return toast(message);
      if(typeof window.toast==='function')return window.toast(message);
    }catch(_){}
    console.log(message);
  }

  function copyMarkers(from,to){
    try{
      Object.keys(from||{}).forEach(key=>{
        if(key.startsWith('__dcc'))to[key]=from[key];
      });
    }catch(_){}
    to.__base=from;
    return to;
  }

  function installOrderedLoaders(){
    if(window.__dccOrderedLoadersV1)return;

    const clientsBase=window.loadClientsFromSupabase;
    if(typeof clientsBase!=='function')return;

    let clientsReady=false;
    let clientsInFlight=null;

    const clientsWrapped=copyMarkers(clientsBase,async function(){
      if(clientsInFlight)return clientsInFlight;
      const self=this,args=arguments;
      clientsInFlight=Promise.resolve()
        .then(()=>clientsBase.apply(self,args))
        .then(result=>{clientsReady=true;return result})
        .finally(()=>{clientsInFlight=null});
      return clientsInFlight;
    });
    clientsWrapped.__dccAuditOrderedV1=true;
    window.loadClientsFromSupabase=clientsWrapped;

    [
      'loadDietsFromSupabase',
      'loadRoutinesFromSupabase',
      'loadWorkoutHistoryFromSupabase',
      'loadWeightsFromSupabase',
      'loadBodyFatHistoryFromSupabase',
      'loadCheckinsFromSupabase',
      'loadMessagesFromSupabase',
      'loadNotificationStateFromSupabase'
    ].forEach(name=>{
      const base=window[name];
      if(typeof base!=='function'||base.__dccAuditOrderedV1)return;
      const wrapped=copyMarkers(base,async function(){
        if(!clientsReady)await window.loadClientsFromSupabase();
        return base.apply(this,arguments);
      });
      wrapped.__dccAuditOrderedV1=true;
      window[name]=wrapped;
    });

    window.__dccOrderedLoadersV1=true;
  }

  function installManualExerciseFix(){
    const base=window.continueTrainingExerciseSelection;
    if(typeof base!=='function'||base.__dccAuditManualV1)return;

    const wrapped=copyMarkers(base,function(id,dayIndex){
      const d=appData();
      const day=d?.routines?.[id]?.[dayIndex];

      if(day && Array.isArray(day.exercises) && day.exercises.length && !day.selectedExerciseIds?.length){
        day.trainingSetupStep='exerciseConfiguration';
        day.trainingSetupStarted=true;
        day.selectedExerciseIds=[];
        saveLocal();

        try{
          if(typeof renderTrainingExerciseConfiguration==='function'){
            return renderTrainingExerciseConfiguration(id,dayIndex);
          }
        }catch(error){
          console.error('DCC audit — configuración de ejercicio manual:',error);
        }

        notify('Ejercicio guardado. Continúa con su configuración.');
        return;
      }

      return base.apply(this,arguments);
    });
    wrapped.__dccAuditManualV1=true;
    window.continueTrainingExerciseSelection=wrapped;
  }

  function installBodyFatBlankFix(){
    const base=window.updateClientBodyFat;
    if(typeof base!=='function'||base.__dccAuditBlankFatV1)return;

    const wrapped=copyMarkers(base,function(){
      const result=base.apply(this,arguments);
      requestAnimationFrame(()=>{
        const overlay=document.getElementById('dcc-quality-metric-overlay');
        const input=overlay?.querySelector('#dcc-q-value');
        if(overlay?.dataset.metric==='bodyFat'&&input){
          input.value='';
          input.focus({preventScroll:true});
        }
      });
      return result;
    });
    wrapped.__dccAuditBlankFatV1=true;
    window.updateClientBodyFat=wrapped;
  }

  function installHotfixes(){
    installOrderedLoaders();
    installManualExerciseFix();
    installBodyFatBlankFix();
  }

  const script=document.createElement('script');
  script.src=baseSrc;
  script.async=false;
  script.onload=()=>{
    installHotfixes();
    setTimeout(installHotfixes,0);
    setTimeout(installHotfixes,250);
  };
  script.onerror=()=>console.error('DCC audit — no se pudo cargar la capa base de calidad');
  document.head.appendChild(script);
})();
