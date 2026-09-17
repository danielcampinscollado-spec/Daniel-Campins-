/* DCC legacy compatibility stub + guardia de orden del editor de entrenamiento.
   La capa visual antigua sigue retirada. Esta guardia solo impide añadir ejercicios
   antes de definir los grupos musculares del día. */
(function(){
  'use strict';
  window.__dccRuntimeVisualStabilityV3='retired';
  const BUILD='20260917-training-muscle-first-v1';
  if(window.__dccTrainingMuscleFirst===BUILD)return;
  window.__dccTrainingMuscleFirst=BUILD;

  const appData=()=>{try{return typeof data!=='undefined'?data:(window.data||{})}catch(_){return window.data||{}}};
  const routineDays=id=>{const r=appData()?.routines?.[id];return Array.isArray(r)?r:Array.isArray(r?.routine)?r.routine:[]};
  const clean=v=>String(v||'').trim();
  function hasMuscles(day){
    if(Array.isArray(day?.muscleGroups)&&day.muscleGroups.some(x=>clean(x)))return true;
    if(Array.isArray(day?.muscles)&&day.muscles.some(x=>clean(x)&&!/^(sin grupos musculares|sin grupo muscular)$/i.test(clean(x))))return true;
    const raw=clean(day?.muscle??day?.group??'');
    return !!raw&&!/^(sin grupos musculares|sin grupo muscular)$/i.test(raw);
  }
  function openMuscleStep(id,di){
    window.selectedClient=id;
    window.__dccTrainingOpen=Number(di);
    if(typeof window.openTrainingDay==='function')return window.openTrainingDay(id,Number(di));
    if(typeof window.dccOpenMuscleModal==='function')return window.dccOpenMuscleModal(id,Number(di));
    if(typeof window.toast==='function')window.toast('Primero selecciona los grupos musculares del día');
    return false;
  }
  window.dccTrainingChooseMusclesFirst=openMuscleStep;

  function enforceButtons(){
    if(!window.__dccTrainingEdit)return;
    const id=String(window.selectedClient??'');
    if(!id)return;
    const ds=routineDays(id);
    document.querySelectorAll('#coach-main .dcc-tr-days>.dcc-tr-day').forEach((card,di)=>{
      const btn=card.querySelector('.dcc-tr-add');
      const day=ds[di];
      if(!btn||!day)return;
      if(!hasMuscles(day)){
        btn.textContent='＋ Añadir grupos musculares';
        btn.dataset.dccMuscleFirst='1';
        btn.setAttribute('onclick',`dccTrainingChooseMusclesFirst('${id}',${di})`);
      }else if(btn.dataset.dccMuscleFirst==='1'){
        btn.textContent='＋ Añadir ejercicio';
        delete btn.dataset.dccMuscleFirst;
        btn.setAttribute('onclick',`dccAddExercise('${id}',${di})`);
      }
    });
  }

  function installAddGuard(){
    const current=window.dccAddExercise;
    if(typeof current!=='function'||current.__dccMuscleFirstGuard)return;
    const base=current;
    const wrapped=function(id,di){
      const day=routineDays(String(id))[Number(di)];
      if(day&&!hasMuscles(day))return openMuscleStep(String(id),Number(di));
      return base.apply(this,arguments);
    };
    wrapped.__dccMuscleFirstGuard=true;
    wrapped.__base=base;
    window.dccAddExercise=wrapped;
  }

  let raf=0;
  function ensure(){installAddGuard();enforceButtons()}
  function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;ensure()})}
  function start(){
    ensure();
    const root=document.getElementById('coach-main');
    if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',ensure);
})();
