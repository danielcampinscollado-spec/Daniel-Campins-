/* DCC — progreso persistente de días de entrenamiento con rollback seguro */
(function(){
  'use strict';
  const BUILD='20260913-training-progress-authority-v2';
  if(window.__dccTrainingProgressAuthority===BUILD)return;
  window.__dccTrainingProgressAuthority=BUILD;

  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function appData(){try{return data||window.data||null}catch(_){return window.data||null}}
  function persistLocal(){try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(error){console.warn('DCC training progress cache:',error)}}
  function normalizeDays(value){if(!Array.isArray(value))return[];return[...new Set(value.map(Number).filter(Number.isInteger).filter(n=>n>=0))].sort((a,b)=>a-b)}

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

  function wrapMarkCompleted(){
    const current=window.markTrainingDayCompleted;if(typeof current!=='function')return false;if(current.__dccTrainingProgressAuthority===BUILD)return true;
    const wrapped=function(clientId){
      const d=appData();const before=normalizeDays(d?.completedTrainingDays?.[clientId]);const result=current.apply(this,arguments);
      saveProgress(clientId).catch(error=>{
        console.error('DCC training progress save:',error);
        if(d){d.completedTrainingDays=d.completedTrainingDays||{};d.completedTrainingDays[clientId]=before;persistLocal()}
        try{if(typeof window.showClient==='function'&&window.__dccSecureRole==='client')window.showClient('training')}catch(_){}
        try{toast('No se pudo sincronizar el progreso. Se ha restaurado el estado anterior.')}catch(_){}
      });
      return result;
    };
    wrapped.__dccTrainingProgressAuthority=BUILD;wrapped.__base=current;window.markTrainingDayCompleted=wrapped;return true;
  }

  function wrapOpenApp(){
    const current=window.openApp;if(typeof current!=='function')return false;if(current.__dccTrainingProgressAuthority===BUILD)return true;
    const wrapped=async function(app){
      const result=await current.apply(this,arguments);if(result===false||app!=='client')return result;
      try{await loadProgress();if(window.__dccSecureRole==='client'){const screen=typeof currentScreen==='string'?currentScreen:window.currentScreen;if((screen==='home'||screen==='training')&&typeof window.showClient==='function')window.showClient(screen)}}catch(error){console.error('DCC training progress load:',error)}
      return result;
    };
    wrapped.__dccTrainingProgressAuthority=BUILD;wrapped.__base=current;window.openApp=wrapped;return true;
  }

  wrapMarkCompleted();wrapOpenApp();
  document.addEventListener('DOMContentLoaded',()=>{wrapMarkCompleted();wrapOpenApp()},{once:true});
  window.addEventListener('pageshow',()=>{wrapMarkCompleted();wrapOpenApp()});
})();
