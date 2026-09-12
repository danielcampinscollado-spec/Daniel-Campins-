/* DCC — Coach stability foundation v1
   Guardas de estabilidad de bajo riesgo para el area entrenador.
   No cambia estructura de datos ni tablas Supabase. */
(function(){
  'use strict';
  if(window.__dccCoachStabilityFoundationV1)return;
  window.__dccCoachStabilityFoundationV1=true;

  const STYLE_ID='dcc-coach-stability-foundation-v1';

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
    const cs=getComputedStyle(coach);
    return cs.display!=='none' && cs.visibility!=='hidden';
  }

  function ensureThemeBase(){
    try{
      const stored=localStorage.getItem('dcc:theme:v1');
      if(stored!=='dark' && coachVisible()){
        document.documentElement.classList.add('dcc-theme-light-premium');
      }
    }catch(_){
      if(coachVisible())document.documentElement.classList.add('dcc-theme-light-premium');
    }
  }

  function installVisualGuard(){
    let s=document.getElementById(STYLE_ID);
    if(!s){
      s=document.createElement('style');
      s.id=STYLE_ID;
      document.head.appendChild(s);
    }
    s.textContent=`
      html.dcc-theme-light-premium body #coach #coach-main.dcc-p9-dashboard{
        background:radial-gradient(circle at 88% 0,rgba(214,163,61,.08),transparent 25%),linear-gradient(180deg,#fffaf1 0%,#f5efe4 62%,#f0e8dc 100%)!important;
        color:#17191d!important;
      }
      html.dcc-theme-light-premium body #coach #coach-main .dcc-cal-day.today{
        background:#fff2ca!important;
        color:#895807!important;
        border-color:#d9aa4a!important;
        box-shadow:inset 0 0 0 1px rgba(217,170,74,.18)!important;
      }
    `;
  }

  function installSafeAddExercise(){
    const original=window.addExercise;
    if(typeof original!=='function' || original.__dccSafeAddExerciseV1)return;

    const wrapped=async function(id,dayIndex){
      const day=window.data?.routines?.[id] || (typeof data!=='undefined' ? data.routines?.[id] : null);
      const targetDay=Array.isArray(day)?day[dayIndex]:null;
      if(!targetDay){
        if(typeof window.toast==='function')window.toast('No se encontró el día');
        return;
      }

      const name=window.prompt('Nombre del ejercicio:');
      if(!name || !name.trim())return;

      const sets=window.prompt('Series:');
      if(!sets || !sets.trim())return;

      const reps=window.prompt('Repeticiones:');
      if(!reps || !reps.trim())return;

      const restBetweenSets=window.prompt('Descanso entre series (segundos):','0');
      if(restBetweenSets===null)return;

      const restBetweenExercises=window.prompt('Descanso después del ejercicio (segundos):','0');
      if(restBetweenExercises===null)return;

      const video=window.prompt('Enlace al vídeo del ejercicio (opcional):');

      if(!Array.isArray(targetDay.exercises))targetDay.exercises=[];
      targetDay.exercises.push({
        name:name.trim(),
        sets:sets.trim(),
        reps:reps.trim(),
        restBetweenSets:Math.max(0,parseInt(restBetweenSets,10)||0),
        restBetweenExercises:Math.max(0,parseInt(restBetweenExercises,10)||0),
        videoUrl:(video||'').trim()
      });

      if(typeof window.saveData==='function')window.saveData();
      else if(typeof saveData==='function')saveData();

      try{
        if(typeof window.saveRoutineToSupabase==='function'){
          const ok=await window.saveRoutineToSupabase(id);
          if(ok===false){
            if(typeof window.toast==='function')window.toast('Guardado local, pero no en Supabase');
            return;
          }
        }else if(window.supabaseClient){
          const all=window.data || (typeof data!=='undefined'?data:null);
          const result=await window.supabaseClient.from('client_routines').upsert({client_id:id,routine:all?.routines?.[id]||[]});
          if(result?.error)throw result.error;
        }
      }catch(err){
        console.error('DCC stability: error guardando rutina',err);
        if(typeof window.toast==='function')window.toast('Guardado local, pero no en Supabase');
        return;
      }

      if(typeof window.showCoach==='function')window.showCoach('routines');
      if(typeof window.toast==='function')window.toast('Ejercicio guardado');
    };

    wrapped.__dccSafeAddExerciseV1=true;
    wrapped.__original=original;
    window.addExercise=wrapped;
  }

  function refresh(){
    ensureThemeBase();
    installVisualGuard();
    installSafeAddExercise();
  }

  refresh();
  document.addEventListener('DOMContentLoaded',refresh,{once:true});
  window.addEventListener('load',refresh,{once:true});
  window.addEventListener('pageshow',refresh);
  setTimeout(refresh,250);
  setTimeout(refresh,1200);
})();
