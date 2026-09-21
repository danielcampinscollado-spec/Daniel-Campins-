/* DCC — progreso semanal de entrenamiento + secuencia continua */
(function(){
  'use strict';
  const BUILD='20260921-training-progress-authority-v3-weekly';
  if(window.__dccTrainingProgressAuthority===BUILD)return;
  window.__dccTrainingProgressAuthority=BUILD;

  function db(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
  }

  function appData(){
    try{return typeof data!=='undefined'?data:(window.data||null)}catch(_){return window.data||null}
  }

  function currentWeek(){
    if(typeof window.getCurrentWeekKey==='function')return window.getCurrentWeekKey();
    try{if(typeof getCurrentWeekKey==='function')return getCurrentWeekKey()}catch(_){}
    const now=new Date(),d=now.getDay(),m=new Date(now);
    m.setDate(now.getDate()+(d===0?-6:1-d));m.setHours(0,0,0,0);
    return m.getFullYear()+'-'+String(m.getMonth()+1).padStart(2,'0')+'-'+String(m.getDate()).padStart(2,'0');
  }

  async function loadProgress(){
    if(typeof window.dccLoadTrainingProgressFromSupabase==='function'){
      const ok=await window.dccLoadTrainingProgressFromSupabase();
      const d=appData();
      try{
        const id=typeof currentClientId!=='undefined'?currentClientId:window.currentClientId;
        const routine=Array.isArray(d?.routines?.[id])?d.routines[id]:[];
        if(id&&routine.length&&typeof window.dccGetTrainingNextDayIndex==='function'){
          window.trainingDayTab=window.dccGetTrainingNextDayIndex(id,routine.length);
        }
      }catch(_){}
      return ok;
    }

    const client=db(),d=appData();
    if(!client||!d)return false;
    const {data:rows,error}=await client.from('client_training_progress').select('client_id,completed_days,next_day_index,week_start');
    if(error)throw error;
    const week=currentWeek();
    d.completedTrainingDays=d.completedTrainingDays||{};
    d.trainingNextDayIndex=d.trainingNextDayIndex||{};
    d.trainingProgressWeekStart=d.trainingProgressWeekStart||{};
    for(const row of rows||[]){
      const id=String(row.client_id);
      d.trainingNextDayIndex[id]=Math.max(0,parseInt(row.next_day_index)||0);
      d.trainingProgressWeekStart[id]=week;
      d.completedTrainingDays[id]=String(row.week_start||'')===week&&Array.isArray(row.completed_days)?row.completed_days.map(Number).filter(Number.isInteger):[];
    }
    try{if(typeof saveData==='function')saveData()}catch(_){}
    return true;
  }

  async function saveProgress(clientId){
    if(typeof window.dccSaveTrainingProgressToSupabase==='function'){
      return window.dccSaveTrainingProgressToSupabase(clientId);
    }
    return false;
  }

  function wrapMarkCompleted(){
    const current=window.markTrainingDayCompleted;
    if(typeof current!=='function')return false;
    if(current.__dccTrainingProgressAuthority===BUILD)return true;
    const wrapped=function(clientId){
      const result=current.apply(this,arguments);
      saveProgress(clientId).catch(error=>console.error('DCC training progress save:',error));
      return result;
    };
    wrapped.__dccTrainingProgressAuthority=BUILD;
    wrapped.__base=current;
    window.markTrainingDayCompleted=wrapped;
    return true;
  }

  function wrapOpenApp(){
    const current=window.openApp;
    if(typeof current!=='function')return false;
    if(current.__dccTrainingProgressAuthority===BUILD)return true;
    const wrapped=async function(app){
      const result=await current.apply(this,arguments);
      if(result===false)return result;
      try{
        await loadProgress();
        if(app==='client'){
          const screen=typeof currentScreen==='string'?currentScreen:window.currentScreen;
          if((screen==='home'||screen==='training')&&typeof window.showClient==='function')window.showClient(screen);
        }
      }catch(error){console.error('DCC training progress load:',error)}
      return result;
    };
    wrapped.__dccTrainingProgressAuthority=BUILD;
    wrapped.__base=current;
    window.openApp=wrapped;
    return true;
  }

  window.dccReloadTrainingProgress=loadProgress;
  wrapMarkCompleted();
  wrapOpenApp();
  document.addEventListener('DOMContentLoaded',()=>{wrapMarkCompleted();wrapOpenApp()},{once:true});
  window.addEventListener('pageshow',()=>{wrapMarkCompleted();wrapOpenApp()});
})();