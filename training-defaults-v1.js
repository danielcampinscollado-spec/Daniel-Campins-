/* DCC — valores por defecto al añadir ejercicios */
(function(){
  'use strict';
  if(window.__dccTrainingDefaultsV1)return;
  window.__dccTrainingDefaultsV1=true;

  function routineDays(id){
    const r=window.data?.routines?.[id];
    return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[];
  }

  function applyDefault(id,di){
    const day=routineDays(String(id))?.[Number(di)];
    const ex=Array.isArray(day?.exercises)?day.exercises.at(-1):null;
    if(!ex)return;
    if(String(ex.sets??ex.series??'')==='3'){
      if(Object.prototype.hasOwnProperty.call(ex,'series'))ex.series='4';
      else ex.sets='4';
    }
    const reps=String(ex.reps??ex.repetitions??ex.repeticiones??'');
    if(!reps){
      if(Object.prototype.hasOwnProperty.call(ex,'repeticiones'))ex.repeticiones='10-12';
      else ex.reps='10-12';
    }
  }

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__dccFourSetDefault)return false;
    const wrapped=function(id,di){
      const result=fn.apply(this,arguments);
      applyDefault(id,di);
      try{if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(String(id),'training');}catch(_){ }
      return result;
    };
    wrapped.__dccFourSetDefault=true;
    wrapped.__dccOriginal=fn;
    window[name]=wrapped;
    return true;
  }

  function ensure(){
    wrap('dccChooseRoutineExercise');
    wrap('dccAddManualRoutineExercise');
    wrap('dccAddExercise');
  }

  ensure();
  document.addEventListener('DOMContentLoaded',ensure,{once:true});
  window.addEventListener('load',ensure,{once:true});
  window.addEventListener('pageshow',ensure);
  let tries=0;
  const timer=setInterval(()=>{ensure();if(++tries>80)clearInterval(timer)},150);
})();
