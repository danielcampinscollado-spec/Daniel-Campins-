/* DCC — rutinas persistentes y rollback seguro */
(function(){
  'use strict';
  const BUILD='20260913-routine-authority-v3';
  if(window.__dccRoutineAuthority===BUILD)return;
  window.__dccRoutineAuthority=BUILD;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const clone=v=>JSON.parse(JSON.stringify(v??null));
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  async function reloadRoutines(){
    if(typeof window.loadRoutinesFromSupabase==='function'){
      try{await window.loadRoutinesFromSupabase()}catch(error){console.error('DCC routine reload:',error)}
    }
  }

  async function writeRoutine(id,routine){
    const database=db();
    if(!database)throw new Error('No hay conexión con el servidor');
    const result=await database.from('client_routines').upsert({
      client_id:String(id),
      routine:clone(routine)||[],
      updated_at:new Date().toISOString()
    },{onConflict:'client_id'});
    if(result.error)throw result.error;
    return true;
  }

  function applyRoutine(id,routine){
    const d=appData();
    d.routines=d.routines||{};
    d.routines[id]=clone(routine)||[];
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
  }

  window.saveRoutineToSupabase=async function(id){
    const routine=clone(appData().routines?.[id])||[];
    try{
      await writeRoutine(id,routine);
      applyRoutine(id,routine);
      return true;
    }catch(error){
      console.error('DCC routine server-first:',error);
      await reloadRoutines();
      return false;
    }
  };

  window.addExercise=async function(id,dayIndex){
    const currentRoutine=clone(appData().routines?.[id])||[];
    const day=currentRoutine?.[dayIndex];
    if(!day){notify('No se encontró el día');return}

    const name=prompt('Nombre del ejercicio:');
    if(!name?.trim())return;
    const sets=prompt('Series:');
    if(!sets?.trim())return;
    const reps=prompt('Repeticiones:');
    if(!reps?.trim())return;
    const restBetweenSets=prompt('Descanso entre series (segundos):','0');
    if(restBetweenSets===null)return;
    const restBetweenExercises=prompt('Descanso después del ejercicio (segundos):','0');
    if(restBetweenExercises===null)return;
    const video=prompt('Enlace al vídeo del ejercicio (opcional):');
    if(video===null)return;

    day.exercises=Array.isArray(day.exercises)?day.exercises:[];
    day.exercises.push({
      name:name.trim(),
      sets:sets.trim(),
      reps:reps.trim(),
      restBetweenSets:Math.max(0,parseInt(restBetweenSets,10)||0),
      restBetweenExercises:Math.max(0,parseInt(restBetweenExercises,10)||0),
      videoUrl:video.trim()
    });

    try{
      await writeRoutine(id,currentRoutine);
      applyRoutine(id,currentRoutine);
      if(typeof window.showCoach==='function')window.showCoach('routines');
      notify('Ejercicio guardado');
    }catch(error){
      console.error('DCC añadir ejercicio server-first:',error);
      await reloadRoutines();
      alert('No se pudo añadir el ejercicio. No se ha aplicado ningún cambio local.\n\n'+(error?.message||'Error del servidor'));
    }
  };

  window.removeExercise=async function(id,dayIndex,exerciseIndex){
    const next=clone(appData().routines?.[id])||[];
    const day=next?.[dayIndex];
    if(!day||!Array.isArray(day.exercises)||!day.exercises[exerciseIndex])return;
    const exercise=day.exercises[exerciseIndex];
    if(!confirm(`¿Eliminar "${exercise.name||'este ejercicio'}" de esta rutina?`))return;
    day.exercises.splice(exerciseIndex,1);
    try{
      await writeRoutine(id,next);
      applyRoutine(id,next);
      if(typeof window.showCoach==='function')window.showCoach('routines');
      notify('Ejercicio eliminado');
    }catch(error){
      console.error('DCC eliminar ejercicio server-first:',error);
      await reloadRoutines();
      alert('No se pudo eliminar el ejercicio. La rutina se mantiene sin cambios.');
    }
  };

  window.removeTrainingDay=async function(id,dayIndex){
    const next=clone(appData().routines?.[id])||[];
    if(!next[dayIndex])return;
    const label=next[dayIndex]?.muscle||`Día ${dayIndex+1}`;
    if(!confirm(`¿Eliminar ${label}?`))return;
    next.splice(dayIndex,1);
    next.forEach((day,index)=>{day.day=index+1});
    try{
      await writeRoutine(id,next);
      applyRoutine(id,next);
      if(typeof window.showCoach==='function')window.showCoach('routines');
      notify('Día de entrenamiento eliminado');
    }catch(error){
      console.error('DCC eliminar día server-first:',error);
      await reloadRoutines();
      alert('No se pudo eliminar el día. La rutina se mantiene sin cambios.');
    }
  };

  async function loadPrevious(id){
    const database=db();if(!database)return null;
    const result=await database.from('client_routine_history').select('routine,archived_at').eq('client_id',String(id)).order('archived_at',{ascending:false}).limit(1).maybeSingle();
    if(result.error)throw result.error;
    const row=result.data;if(!row)return null;
    const d=appData();
    d.previousRoutines=d.previousRoutines||{};
    d.previousRoutines[id]={routine:clone(row.routine)||[],savedAt:row.archived_at};
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
    return d.previousRoutines[id];
  }

  window.dccLoadPreviousRoutineFromServer=loadPrevious;

  window.startNewRoutine=async function(id){
    if(!id)return;
    const current=clone(appData().routines?.[id])||[];
    if(!current.length){notify('No hay una rutina actual para guardar');return}
    const database=db();
    if(!database){alert('No hay conexión con el servidor. La rutina no se ha modificado.');return}
    const historyId='routine-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
    try{
      const result=await database.rpc('dcc_start_new_routine',{p_client_id:String(id),p_history_id:historyId});
      if(result.error)throw result.error;
      if(result.data!==true)throw new Error('El servidor no confirmó la nueva rutina');
      const d=appData();
      d.routines=d.routines||{};
      d.routines[id]=[];
      d.previousRoutines=d.previousRoutines||{};
      d.previousRoutines[id]={routine:current,savedAt:new Date().toISOString()};
      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
      await reloadRoutines();
      await loadPrevious(id);
      if(typeof window.showCoach==='function')window.showCoach('routines');
      notify('Nueva rutina creada');
    }catch(error){
      console.error('DCC nueva rutina atómica:',error);
      await reloadRoutines();
      alert('No se pudo crear la nueva rutina. La rutina actual se mantiene intacta.\n\n'+(error?.message||'Error del servidor'));
    }
  };
})();
