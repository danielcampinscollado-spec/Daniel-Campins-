/* DCC — progreso persistente de días de entrenamiento + ciclo coherente */
(function(){
  'use strict';
  const BUILD='20260913-training-progress-authority-v3';
  if(window.__dccTrainingProgressAuthority===BUILD)return;
  window.__dccTrainingProgressAuthority=BUILD;

  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function appData(){try{return data||window.data||null}catch(_){return window.data||null}}
  function persistLocal(){try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(error){console.warn('DCC training progress cache:',error)}}
  function normalizeDays(value){if(!Array.isArray(value))return[];return[...new Set(value.map(Number).filter(Number.isInteger).filter(n=>n>=0))].sort((a,b)=>a-b)}
  function routineFor(clientId){const d=appData();const raw=d?.routines?.[clientId];return Array.isArray(raw)?raw:Array.isArray(raw?.routine)?raw.routine:[]}
  function nextDayIndex(clientId,totalDays){
    const d=appData();
    const total=Math.max(0,Number.isInteger(Number(totalDays))?Number(totalDays):routineFor(clientId).length);
    if(!total)return 0;
    const completed=new Set(normalizeDays(d?.completedTrainingDays?.[clientId]).filter(i=>i<total));
    for(let i=0;i<total;i++)if(!completed.has(i))return i;
    return 0;
  }

  window.dccNextTrainingDayIndex=nextDayIndex;

  async function loadProgress(){
    const client=db(),d=appData();if(!client||!d)return false;
    const {data:rows,error}=await client.from('client_training_progress').select('client_id,completed_days');if(error)throw error;
    const next={};(rows||[]).forEach(row=>{next[String(row.client_id)]=normalizeDays(row.completed_days)});d.completedTrainingDays=next;persistLocal();return true;
  }

  async function saveProgress(clientId){
    const client=db(),d=appData();if(!client||!d||!clientId)return false;
    const completed=normalizeDays(d.completedTrainingDays?.[clientId]);
    const {error}=await client.from('client_training_progress').upsert({client_id:String(clientId),completed_days:completed,updated_at:new Date().toISOString()},{onConflict:'client_id'});if(error)throw error;return true;
  }

  function installHomeCycle(){
    const current=window.getWeeklyWorkoutCount;
    if(typeof current!=='function')return false;
    if(current.__dccTrainingCycleAuthority===BUILD)return true;
    const wrapped=function(clientId){
      const routine=routineFor(clientId);
      if(!routine.length)return 0;
      return nextDayIndex(clientId,routine.length);
    };
    wrapped.__dccTrainingCycleAuthority=BUILD;
    wrapped.__base=current;
    window.getWeeklyWorkoutCount=wrapped;
    return true;
  }

  function wrapMarkCompleted(){
    const current=window.markTrainingDayCompleted;if(typeof current!=='function')return false;if(current.__dccTrainingProgressAuthority===BUILD)return true;
    const wrapped=function(clientId,dayIndex,totalDays){
      const d=appData();const before=normalizeDays(d?.completedTrainingDays?.[clientId]);const result=current.apply(this,arguments);
      window.trainingDayTab=nextDayIndex(clientId,Number(totalDays)||routineFor(clientId).length);
      saveProgress(clientId).catch(error=>{
        console.error('DCC training progress save:',error);
        if(d){d.completedTrainingDays=d.completedTrainingDays||{};d.completedTrainingDays[clientId]=before;persistLocal()}
        window.trainingDayTab=nextDayIndex(clientId,Number(totalDays)||routineFor(clientId).length);
        try{if(typeof window.showClient==='function'&&window.__dccSecureRole==='client')window.showClient('training')}catch(_){}
        try{toast('No se pudo sincronizar el progreso. Se ha restaurado el estado anterior.')}catch(_){}
      });
      return result;
    };
    wrapped.__dccTrainingProgressAuthority=BUILD;wrapped.__base=current;window.markTrainingDayCompleted=wrapped;return true;
  }

  function wrapShowClient(){
    const current=window.showClient;if(typeof current!=='function')return false;if(current.__dccTrainingCycleDefault===BUILD)return true;
    const wrapped=function(screen){
      if(screen==='training'&&!window.activeWorkout){
        let id=null;try{id=currentClientId||null}catch(_){id=window.currentClientId||null}
        const routine=routineFor(id);
        if(routine.length&&(typeof window.trainingDayTab!=='number'||window.trainingDayTab<0||window.trainingDayTab>=routine.length)){
          window.trainingDayTab=nextDayIndex(id,routine.length);
        }
      }
      return current.apply(this,arguments);
    };
    wrapped.__dccTrainingCycleDefault=BUILD;wrapped.__base=current;window.showClient=wrapped;return true;
  }

  function wrapOpenApp(){
    const current=window.openApp;if(typeof current!=='function')return false;if(current.__dccTrainingProgressAuthority===BUILD)return true;
    const wrapped=async function(app){
      const result=await current.apply(this,arguments);if(result===false||app!=='client')return result;
      try{
        await loadProgress();
        let id=null;try{id=currentClientId||null}catch(_){id=window.currentClientId||null}
        const routine=routineFor(id);if(routine.length)window.trainingDayTab=nextDayIndex(id,routine.length);
        if(window.__dccSecureRole==='client'){
          const screen=typeof currentScreen==='string'?currentScreen:window.currentScreen;
          if((screen==='home'||screen==='training')&&typeof window.showClient==='function')window.showClient(screen);
        }
      }catch(error){console.error('DCC training progress load:',error)}
      return result;
    };
    wrapped.__dccTrainingProgressAuthority=BUILD;wrapped.__base=current;window.openApp=wrapped;return true;
  }

  function install(){installHomeCycle();wrapMarkCompleted();wrapShowClient();wrapOpenApp()}
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
})();
