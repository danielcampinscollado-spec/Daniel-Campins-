/* DCC authoritative server data guards */
(function(){
  'use strict';
  const BUILD='20260912-data-authority-v1';
  if(window.__dccDataAuthority===BUILD)return;
  window.__dccDataAuthority=BUILD;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  function save(){try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(error){console.warn('DCC authority cache:',error)}}

  const domains={
    loadDietsFromSupabase:['diets'],
    loadRoutinesFromSupabase:['routines','routineUpdatedAt'],
    loadWorkoutHistoryFromSupabase:['workoutHistory'],
    loadWeightsFromSupabase:['weights'],
    loadMessagesFromSupabase:['messages'],
    loadCheckinsFromSupabase:['checkins'],
    loadNotificationStateFromSupabase:['notificationState']
  };

  function clearDomains(keys){
    const d=appData();
    keys.forEach(key=>{d[key]={}});
    save();
  }

  function wrapLoader(name,keys){
    const current=window[name];
    if(typeof current!=='function')return false;
    if(current.__dccAuthoritativeLoader===BUILD)return true;
    const wrapped=async function(){
      clearDomains(keys);
      try{
        const result=await current.apply(this,arguments);
        save();
        return result;
      }catch(error){
        console.error('DCC authoritative loader '+name+':',error);
        clearDomains(keys);
        throw error;
      }
    };
    wrapped.__dccAuthoritativeLoader=BUILD;
    wrapped.__base=current;
    window[name]=wrapped;
    return true;
  }

  function install(){Object.entries(domains).forEach(([name,keys])=>wrapLoader(name,keys))}
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
})();
