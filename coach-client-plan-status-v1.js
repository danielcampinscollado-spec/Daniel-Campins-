/* DCC — arranque estable + hotfixes de auditoría v4 */
(function(){
  'use strict';

  if(window.__dccAuditBootstrapV4)return;
  window.__dccAuditBootstrapV4=true;

  const baseSrc='./coach-client-plan-status-v1-base.js?v=20260911-audit2';
  const authSrc='./auth-premium-v1.js?v=20260911-auth1';
  const exercisePremiumSrc='./exercise-premium-pectoral-v1.js?v=20260911-1';
  const exerciseGuidanceSrc='./exercise-guidance-v1.js?v=20260911-1';

  function appData(){
    try{return data||{}}catch(_){return window.data||{}}
  }

  function database(){
    try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}
    return window.supabaseClient||null;
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
    if(window.__dccOrderedLoadersV2)return;

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
    clientsWrapped.__dccAuditOrderedV2=true;
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
      if(typeof base!=='function'||base.__dccAuditOrderedV2)return;
      const wrapped=copyMarkers(base,async function(){
        if(!clientsReady)await window.loadClientsFromSupabase();
        return base.apply(this,arguments);
      });
      wrapped.__dccAuditOrderedV2=true;
      window[name]=wrapped;
    });

    window.__dccOrderedLoadersV2=true;
  }

  function installManualExerciseFix(){
    const base=window.continueTrainingExerciseSelection;
    if(typeof base!=='function'||base.__dccAuditManualV2)return;

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
    wrapped.__dccAuditManualV2=true;
    window.continueTrainingExerciseSelection=wrapped;
  }

  function installBodyFatBlankFix(){
    const base=window.updateClientBodyFat;
    if(typeof base!=='function'||base.__dccAuditBlankFatV2)return;

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
    wrapped.__dccAuditBlankFatV2=true;
    window.updateClientBodyFat=wrapped;
  }

  function installLegacyAddExerciseFix(){
    if(window.addExercise?.__dccAuditSafeVideoV2)return;

    const safeAddExercise=async function(id,dayIndex){
      const d=appData();
      const day=d?.routines?.[id]?.[dayIndex];
      if(!day){notify('No se encontró el día');return;}
      if(!Array.isArray(day.exercises))day.exercises=[];

      const name=prompt('Nombre del ejercicio:');
      if(!name?.trim())return;
      const sets=prompt('Series:');
      if(sets===null||!sets.trim())return;
      const reps=prompt('Repeticiones:');
      if(reps===null||!reps.trim())return;
      const restBetweenSets=prompt('Descanso entre series (segundos):','0');
      if(restBetweenSets===null)return;
      const restBetweenExercises=prompt('Descanso después del ejercicio (segundos):','0');
      if(restBetweenExercises===null)return;
      const video=prompt('Enlace al vídeo del ejercicio (opcional):');

      const exercise={
        name:name.trim(),
        sets:sets.trim(),
        reps:reps.trim(),
        restBetweenSets:Math.max(0,parseInt(restBetweenSets,10)||0),
        restBetweenExercises:Math.max(0,parseInt(restBetweenExercises,10)||0),
        videoUrl:video===null?'':video.trim()
      };

      day.exercises.push(exercise);
      saveLocal();

      try{
        if(typeof saveRoutineToSupabase==='function'){
          const ok=await saveRoutineToSupabase(id);
          if(!ok){
            day.exercises.pop();
            saveLocal();
            notify('No se pudo sincronizar el ejercicio');
            return;
          }
        }else{
          const db=database();
          if(db){
            const {error}=await db.from('client_routines').upsert({
              client_id:id,
              routine:d.routines[id],
              updated_at:new Date().toISOString()
            },{onConflict:'client_id'});
            if(error)throw error;
          }
        }
      }catch(error){
        console.error('DCC audit — guardando ejercicio:',error);
        day.exercises.pop();
        saveLocal();
        notify('No se pudo guardar el ejercicio');
        return;
      }

      try{
        if(typeof showCoach==='function')showCoach('routines');
      }catch(_){}
      notify('Ejercicio guardado');
    };

    safeAddExercise.__dccAuditSafeVideoV2=true;
    window.addExercise=safeAddExercise;
  }

  function cleanMalformedCss(){
    if(window.__dccAuditCssCleanV2)return;
    try{
      [...document.querySelectorAll('style')].forEach(style=>{
        const text=style.textContent||'';
        if(text.includes('/* ===== FIN ELEVATE ===== */')&&/FIN ELEVATE[^]*?\n#\s*\n\/\* ===== MÓVIL ===== \*\//.test(text)){
          style.textContent=text.replace(/(\/\* ===== FIN ELEVATE ===== \*\/\s*)#\s*(\/\* ===== MÓVIL ===== \*\/)/,'$1$2');
        }
      });
      window.__dccAuditCssCleanV2=true;
    }catch(error){
      console.warn('DCC audit — limpieza CSS:',error);
    }
  }

  function installHotfixes(){
    installOrderedLoaders();
    installManualExerciseFix();
    installBodyFatBlankFix();
    installLegacyAddExerciseFix();
    cleanMalformedCss();
  }

  function loadSecureAuth(){
    if(window.__dccSecureAuthScriptRequested)return;
    window.__dccSecureAuthScriptRequested=true;
    const auth=document.createElement('script');
    auth.src=authSrc;
    auth.async=false;
    auth.onerror=()=>console.error('DCC audit — no se pudo cargar la capa de autenticación');
    document.head.appendChild(auth);
  }

  function loadPremiumExercises(){
    if(window.__dccPremiumExerciseScriptRequested)return;
    window.__dccPremiumExerciseScriptRequested=true;
    const premium=document.createElement('script');
    premium.src=exercisePremiumSrc;
    premium.async=false;
    premium.onerror=()=>console.error('DCC audit — no se pudieron cargar las ilustraciones premium');
    document.head.appendChild(premium);
  }

  function loadExerciseGuidance(){
    if(window.__dccExerciseGuidanceScriptRequested)return;
    window.__dccExerciseGuidanceScriptRequested=true;
    const guidance=document.createElement('script');
    guidance.src=exerciseGuidanceSrc;
    guidance.async=false;
    guidance.onerror=()=>console.error('DCC audit — no se pudo cargar la guía de ejercicios');
    document.head.appendChild(guidance);
  }

  const script=document.createElement('script');
  script.src=baseSrc;
  script.async=false;
  script.onload=()=>{
    installHotfixes();
    loadPremiumExercises();
    loadExerciseGuidance();
    loadSecureAuth();
    setTimeout(installHotfixes,0);
    setTimeout(installHotfixes,250);
  };
  script.onerror=()=>console.error('DCC audit — no se pudo cargar la capa base de calidad');
  document.head.appendChild(script);
})();
