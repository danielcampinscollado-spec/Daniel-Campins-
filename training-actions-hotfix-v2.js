/* DCC — puente de runtime estable + refinamientos cliente
   Se conserva este nombre de archivo porque index.html ya lo carga.
   NO sobrescribe startWorkout, showClient ni ninguna navegación.
   Expone el estado global léxico y aplica solo ajustes visuales/lectura seguros.
*/
(function(){
  'use strict';
  if(window.__dccStableRuntimeBridgeV5)return;
  window.__dccStableRuntimeBridgeV5=true;

  function bridgeAccessor(name,getter,setter){
    try{
      const descriptor=Object.getOwnPropertyDescriptor(window,name);
      if(descriptor && descriptor.configurable===false)return;
      Object.defineProperty(window,name,{
        configurable:true,
        enumerable:true,
        get:getter,
        set:setter||function(){}
      });
    }catch(error){
      console.warn('DCC runtime bridge:',name,error);
    }
  }

  try{
    if(typeof data!=='undefined'){
      bridgeAccessor('data',()=>data,value=>{data=value;});
    }
  }catch(error){console.warn('DCC runtime bridge data:',error);}

  try{
    if(typeof currentClientId!=='undefined'){
      bridgeAccessor('currentClientId',()=>currentClientId,value=>{currentClientId=value;});
    }
  }catch(error){console.warn('DCC runtime bridge client:',error);}

  try{
    if(typeof supabaseClient!=='undefined' && supabaseClient){
      bridgeAccessor('supabaseClient',()=>supabaseClient);
    }
  }catch(error){console.warn('DCC runtime bridge supabase:',error);}

  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  function primaryMuscle(name,current){
    const n=norm(name);
    if(/press banca|press inclinado|press declinado|press pecho|apertura|cruce|pec deck|pullover|flexion/.test(n))return 'Pectoral';
    if(/elevacion lateral|elevaciones laterales|elevacion frontal|press militar|press hombro|pajaro|face pull/.test(n))return 'Hombro';
    if(/triceps|extension de triceps|extension triceps|patada/.test(n))return 'Tríceps';
    if(/curl|biceps/.test(n))return 'Bíceps';
    if(/remo|jalon|dominada|dorsal/.test(n))return 'Espalda';
    if(/sentadilla|prensa|extension de cuadriceps|extension cuadriceps|cuadriceps/.test(n))return 'Cuádriceps';
    if(/femoral|isquio|peso muerto rumano/.test(n))return 'Femoral';
    if(/hip thrust|gluteo|abduccion/.test(n))return 'Glúteo';
    if(/gemelo|pantorrilla/.test(n))return 'Gemelo';
    if(/abdominal|core|plancha|crunch/.test(n))return 'Core';

    const first=String(current||'').split(/[·,+/&]/)[0].trim();
    const f=norm(first);
    if(f==='pecho'||f==='pectoral')return 'Pectoral';
    if(f==='hombros'||f==='hombro'||f==='deltoides'||f==='deltoide')return 'Hombro';
    if(f==='triceps')return 'Tríceps';
    if(f==='biceps')return 'Bíceps';
    if(f==='espalda'||f==='dorsal'||f==='dorsales')return 'Espalda';
    if(f==='cuadriceps')return 'Cuádriceps';
    if(f==='femoral'||f==='isquios'||f==='isquiotibiales')return 'Femoral';
    if(f==='gluteo'||f==='gluteos')return 'Glúteo';
    if(f==='gemelo'||f==='gemelos')return 'Gemelo';
    return first||'';
  }

  function muscleImage(muscle){
    const m=norm(muscle);
    if(m==='pectoral')return './assets/muscles/pecho.png';
    if(m==='hombro')return './assets/muscles/hombros.png';
    if(m==='triceps')return './assets/muscles/triceps.png';
    if(m==='biceps')return './assets/muscles/biceps.png';
    if(m==='espalda')return './assets/muscles/espalda.png';
    if(m==='cuadriceps')return './assets/muscles/cuadriceps.png';
    if(m==='femoral')return './assets/muscles/isquios.png';
    if(m==='gluteo')return './assets/muscles/gluteos.png';
    if(m==='gemelo')return './assets/muscles/gemelos.png';
    if(m==='core')return './assets/muscles/core.png';
    return '';
  }

  function installClientRefinements(){
    if(document.getElementById('dcc-client-refinements-20260911-v5'))return;
    document.getElementById('dcc-client-refinements-20260911')?.remove();
    document.getElementById('dcc-client-refinements-20260911-v3')?.remove();
    document.getElementById('dcc-client-refinements-20260911-v4')?.remove();
    const style=document.createElement('style');
    style.id='dcc-client-refinements-20260911-v5';
    style.textContent=`
      /* Inicio: alinear el texto de "Todo al día" con la columna de Progreso y Próximo entrenamiento. */
      #client-main .dch-task-empty{min-height:64px!important;grid-template-columns:50px minmax(0,1fr)!important;gap:12px!important;padding:10px 15px!important;align-items:center!important}
      #client-main .dch-task-empty .dch-iconbox{width:38px!important;height:38px!important;justify-self:center!important}
      #client-main .dct3-days{grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:4px!important;margin-bottom:11px!important}
      #client-main .dct3-day{height:44px!important;min-height:44px!important;padding:0 1px!important;border-radius:11px!important;gap:2px!important}
      #client-main .dct3-day span{font-size:6px!important;line-height:1!important;letter-spacing:.8px!important}
      #client-main .dct3-day b{font-size:14px!important;line-height:1!important}
      #client-main .dct3-actions{display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:wrap!important;gap:8px!important;margin-top:12px!important}
      #client-main .dct3-start,#client-main .dct3-view{width:auto!important;min-width:0!important;min-height:39px!important;height:39px!important;padding:0 14px!important;border-radius:12px!important;font-size:10.5px!important;line-height:1!important;font-weight:780!important;letter-spacing:.05px!important;box-shadow:none!important}
      #client-main .dct3-start{border:1px solid rgba(240,201,107,.82)!important;background:linear-gradient(145deg,rgba(217,170,74,.12),rgba(12,15,19,.98))!important;color:#f1c861!important}
      #client-main .dct3-view{border:1px solid rgba(255,255,255,.13)!important;background:linear-gradient(145deg,#12171d,#0a0e13)!important;color:#c3c9d1!important}
      #client-main .dcc-active-exercise-advice,#client-main .dcc-exercise-client-advice{display:none!important}
      @media(max-width:390px){
        #client-main .dch-task-empty{min-height:60px!important;grid-template-columns:50px minmax(0,1fr)!important;gap:12px!important;padding:9px 15px!important}
        #client-main .dch-task-empty .dch-iconbox{width:36px!important;height:36px!important;justify-self:center!important}
        #client-main .dct3-days{gap:3px!important}
        #client-main .dct3-day{height:41px!important;min-height:41px!important;border-radius:10px!important}
        #client-main .dct3-day span{font-size:5.5px!important;letter-spacing:.65px!important}
        #client-main .dct3-day b{font-size:13px!important}
        #client-main .dct3-start,#client-main .dct3-view{height:37px!important;min-height:37px!important;padding:0 12px!important;font-size:10px!important}
      }
    `;
    document.head.appendChild(style);
  }

  let adviceQueued=false;
  function syncWorkoutAdvice(){
    adviceQueued=false;
    try{
      const workout=window.activeWorkout;
      if(!workout)return;
      const exercise=workout.exercises?.[Number(workout.currentExercise)||0];
      const body=document.querySelector('#client-main .dwa3-tip .dwa3-tip-body');
      const adviceFn=window.dccExerciseAdvice;
      if(exercise&&body&&typeof adviceFn==='function'){
        const advice=String(adviceFn(exercise)||'').trim();
        if(advice&&body.textContent!==advice)body.textContent=advice;
      }
    }catch(error){console.warn('DCC advice sync:',error);}
  }

  function refineTrainingLabels(){
    try{
      document.querySelectorAll('#client-main .dct3-title, #client-main .dct3-routine h3').forEach(el=>{
        const next=(el.textContent||'').replace(/\bPecho\b/gi,'Pectoral');
        if(next!==el.textContent)el.textContent=next;
      });
    }catch(error){console.warn('DCC training label refinement:',error);}
  }

  function refineExerciseRows(){
    try{
      document.querySelectorAll('#client-main .dct3-exercise').forEach(row=>{
        const name=row.querySelector('strong')?.textContent||'';
        const label=row.querySelector('small');
        if(!label)return;
        const primary=primaryMuscle(name,label.textContent);
        if(primary)label.textContent=primary.toUpperCase();
        const img=row.querySelector('.dct3-ex-img img');
        const src=muscleImage(primary);
        if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);
      });
    }catch(error){console.warn('DCC primary muscle refinement:',error);}
  }

  function scheduleAdviceSync(){
    if(adviceQueued)return;
    adviceQueued=true;
    requestAnimationFrame(()=>{
      syncWorkoutAdvice();
      refineTrainingLabels();
      refineExerciseRows();
    });
  }

  installClientRefinements();
  const main=document.getElementById('client-main');
  if(main&&!main.__dccClientRefinementsObserverV5){
    const observer=new MutationObserver(scheduleAdviceSync);
    observer.observe(main,{childList:true,subtree:true});
    main.__dccClientRefinementsObserverV5=observer;
  }
  window.addEventListener('dcc:exercise-library-ready',scheduleAdviceSync);
  document.addEventListener('DOMContentLoaded',()=>{
    installClientRefinements();
    scheduleAdviceSync();
  });
  scheduleAdviceSync();

  window.__dccRuntimeBridgeReady=true;
  try{window.dispatchEvent(new CustomEvent('dcc:runtime-bridge-ready'));}catch(_){}
})();