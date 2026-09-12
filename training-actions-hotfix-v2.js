/* DCC — puente de runtime canónico. Sin observers globales ni capas visuales duplicadas. */
(function(){
  'use strict';
  if(window.__dccStableRuntimeBridgeV10)return;
  window.__dccStableRuntimeBridgeV10=true;

  function bridgeAccessor(name,getter,setter){
    try{
      const descriptor=Object.getOwnPropertyDescriptor(window,name);
      if(descriptor&&descriptor.configurable===false)return;
      Object.defineProperty(window,name,{configurable:true,enumerable:true,get:getter,set:setter||function(){}});
    }catch(error){console.warn('DCC runtime bridge:',name,error)}
  }

  try{if(typeof data!=='undefined')bridgeAccessor('data',()=>data,value=>{data=value})}catch(_){}
  try{if(typeof currentClientId!=='undefined')bridgeAccessor('currentClientId',()=>currentClientId,value=>{currentClientId=value})}catch(_){}
  try{if(typeof supabaseClient!=='undefined'&&supabaseClient)bridgeAccessor('supabaseClient',()=>supabaseClient)}catch(_){}

  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function primaryMuscle(name,current){
    const n=norm(name);
    if(/press banca|press inclinado|press declinado|press pecho|apertura|cruce|pec deck|pullover|flexion/.test(n))return 'Pectoral';
    if(/elevacion lateral|elevaciones laterales|elevacion frontal|press militar|press hombro|pajaro|face pull/.test(n))return 'Hombro';
    if(/triceps|extension de triceps|extension triceps|patada/.test(n))return 'Tríceps';
    if(/curl|biceps/.test(n))return 'Bíceps';
    if(/remo|jalon|dominada|dorsal/.test(n))return 'Espalda';
    if(/sentadilla|prensa|cuadriceps/.test(n))return 'Cuádriceps';
    if(/femoral|isquio|peso muerto rumano/.test(n))return 'Femoral';
    if(/hip thrust|gluteo|abduccion/.test(n))return 'Glúteo';
    if(/gemelo|pantorrilla/.test(n))return 'Gemelo';
    if(/abdominal|core|plancha|crunch/.test(n))return 'Core';
    return String(current||'').split(/[·,+/&]/)[0].trim();
  }

  function syncWorkoutAdvice(){
    try{
      const workout=window.activeWorkout;if(!workout)return;
      const exercise=workout.exercises?.[Number(workout.currentExercise)||0];if(!exercise)return;
      const name=exercise.name||exercise.exercise||exercise.title||'';
      const muscle=primaryMuscle(name,exercise.muscle||'');
      const advice=typeof window.dccExerciseAdvice==='function'?window.dccExerciseAdvice(name,muscle):'';
      const body=document.querySelector('#client-main .dwa3-tip .dwa3-tip-body');
      if(body&&advice&&body.textContent!==advice)body.textContent=advice;
    }catch(error){console.warn('DCC advice sync',error)}
  }

  function loadOnce(src,datasetKey,readyFlag){
    if(readyFlag&&window[readyFlag])return;
    if(document.querySelector(`script[data-dcc-loader="${datasetKey}"]`))return;
    const script=document.createElement('script');script.src=src;script.async=false;script.dataset.dccLoader=datasetKey;document.head.appendChild(script);
  }

  function boot(){
    loadOnce('./dcc-theme-system-v1.js','theme','__dccThemeSystemV2');
    loadOnce('./dcc-runtime-core-v1.js','runtime-core','__dccRuntimeCoreV1');
    syncWorkoutAdvice();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('dcc:screen-rendered',syncWorkoutAdvice);
  window.addEventListener('dcc:exercise-library-ready',syncWorkoutAdvice);
  document.addEventListener('click',()=>setTimeout(syncWorkoutAdvice,0),true);

  window.__dccRuntimeBridgeReady=true;
  try{window.dispatchEvent(new CustomEvent('dcc:runtime-bridge-ready'))}catch(_){}
})();
