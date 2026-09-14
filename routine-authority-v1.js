/* DCC — autoridad única de rutinas: persistencia, nueva rutina y rollback seguro */
(function(){
  'use strict';
  const BUILD='20260914-routine-authority-v6';
  if(window.__dccRoutineAuthority===BUILD)return;
  window.__dccRoutineAuthority=BUILD;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const clone=v=>JSON.parse(JSON.stringify(v??null));
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  function saveLocal(){
    try{
      if(typeof saveData==='function')return saveData();
      if(typeof window.saveData==='function')return window.saveData();
    }catch(_){}
  }

  function routineFor(id){
    const raw=appData().routines?.[id];
    return Array.isArray(raw)?raw:Array.isArray(raw?.routine)?raw.routine:[];
  }

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

  function applyRoutine(id,routine,{persist=true}={}){
    const d=appData();
    d.routines=d.routines||{};
    d.routines[id]=clone(routine)||[];
    if(persist)saveLocal();
  }

  function parseBackup(){
    if(window.__dccTrainingBackup===undefined)return null;
    try{
      const parsed=JSON.parse(window.__dccTrainingBackup);
      return Array.isArray(parsed)?parsed:Array.isArray(parsed?.routine)?parsed.routine:[];
    }catch(_){
      return null;
    }
  }

  function clearEditorState(){
    window.__dccTrainingEdit=false;
    delete window.__dccTrainingBackup;
    delete window.__dccTrainingCreatingNew;
    delete window.__dccTrainingArchiveOnSave;
  }

  function renderClientRoutine(id){
    if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'training');
    else if(typeof window.showCoach==='function')window.showCoach('routines');
  }

  async function archiveCurrentRoutine(id){
    const database=db();
    if(!database)throw new Error('No hay conexión con el servidor');
    const historyId='routine-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
    const result=await database.rpc('dcc_start_new_routine',{
      p_client_id:String(id),
      p_history_id:historyId
    });
    if(result.error)throw result.error;
    if(result.data!==true)throw new Error('El servidor no confirmó el archivado de la rutina anterior');
    return true;
  }

  window.saveRoutineToSupabase=async function(id){
    const routine=clone(routineFor(id))||[];
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

  const addExerciseServerFirst=async function(id,dayIndex){
    const currentRoutine=clone(routineFor(id))||[];
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
      renderClientRoutine(id);
      notify('Ejercicio guardado');
    }catch(error){
      console.error('DCC añadir ejercicio server-first:',error);
      await reloadRoutines();
      alert('No se pudo añadir el ejercicio. No se ha aplicado ningún cambio local.\n\n'+(error?.message||'Error del servidor'));
    }
  };
  addExerciseServerFirst.__dccAuditSafeVideoV2=true;
  addExerciseServerFirst.__dccRoutineAuthorityV6=true;
  window.addExercise=addExerciseServerFirst;

  window.removeExercise=async function(id,dayIndex,exerciseIndex){
    const next=clone(routineFor(id))||[];
    const day=next?.[dayIndex];
    if(!day||!Array.isArray(day.exercises)||!day.exercises[exerciseIndex])return;
    const exercise=day.exercises[exerciseIndex];
    if(!confirm(`¿Eliminar "${exercise.name||'este ejercicio'}" de esta rutina?`))return;
    day.exercises.splice(exerciseIndex,1);
    try{
      await writeRoutine(id,next);
      applyRoutine(id,next);
      renderClientRoutine(id);
      notify('Ejercicio eliminado');
    }catch(error){
      console.error('DCC eliminar ejercicio server-first:',error);
      await reloadRoutines();
      alert('No se pudo eliminar el ejercicio. La rutina se mantiene sin cambios.');
    }
  };

  window.removeTrainingDay=async function(id,dayIndex){
    const next=clone(routineFor(id))||[];
    if(!next[dayIndex])return;
    const label=next[dayIndex]?.muscle||`Día ${dayIndex+1}`;
    if(!confirm(`¿Eliminar ${label}?`))return;
    next.splice(dayIndex,1);
    next.forEach((day,index)=>{day.day=index+1});
    try{
      await writeRoutine(id,next);
      applyRoutine(id,next);
      renderClientRoutine(id);
      notify('Día de entrenamiento eliminado');
    }catch(error){
      console.error('DCC eliminar día server-first:',error);
      await reloadRoutines();
      alert('No se pudo eliminar el día. La rutina se mantiene sin cambios.');
    }
  };

  async function loadPrevious(id){
    const database=db();
    if(!database)return null;
    const result=await database.from('client_routine_history')
      .select('routine,archived_at')
      .eq('client_id',String(id))
      .order('archived_at',{ascending:false})
      .limit(1)
      .maybeSingle();
    if(result.error)throw result.error;
    const row=result.data;
    if(!row)return null;
    const d=appData();
    d.previousRoutines=d.previousRoutines||{};
    d.previousRoutines[id]={routine:clone(row.routine)||[],savedAt:row.archived_at};
    saveLocal();
    return d.previousRoutines[id];
  }
  window.dccLoadPreviousRoutineFromServer=loadPrevious;

  const createRoutine=async function(id){
    id=String(id||'');
    if(!id)return;
    const current=clone(routineFor(id))||[];
    if(current.length&&!confirm('La rutina actual se guardará como rutina anterior cuando confirmes los cambios. ¿Crear una nueva?'))return;

    window.__dccTrainingBackup=JSON.stringify(current);
    window.__dccTrainingCreatingNew=true;
    window.__dccTrainingArchiveOnSave=current.length>0;
    window.__dccTrainingEdit=true;
    window.__dccTrainingOpen=0;

    applyRoutine(id,[{day:1,muscle:'Sin grupos musculares',muscles:[],exercises:[]}],{persist:false});
    renderClientRoutine(id);
  };
  createRoutine.__dccRoutineAuthorityV6=true;
  window.dccCreateRoutine=createRoutine;

  const cancelRoutine=function(id){
    id=String(id||'');
    const backup=parseBackup();
    if(id&&backup!==null)applyRoutine(id,backup,{persist:false});
    clearEditorState();
    if(id)renderClientRoutine(id);
  };
  cancelRoutine.__dccRoutineAuthorityV6=true;
  window.dccCancelRoutine=cancelRoutine;

  const saveRoutine=async function(id){
    id=String(id||'');
    if(!id)return false;
    const draft=clone(routineFor(id))||[];
    const backup=parseBackup();
    const creatingNew=window.__dccTrainingCreatingNew===true;
    const shouldArchive=creatingNew&&window.__dccTrainingArchiveOnSave===true&&Array.isArray(backup)&&backup.length>0;
    let archived=false;

    try{
      if(shouldArchive){
        await archiveCurrentRoutine(id);
        archived=true;
      }
      await writeRoutine(id,draft);
      applyRoutine(id,draft);

      if(shouldArchive){
        const d=appData();
        d.previousRoutines=d.previousRoutines||{};
        d.previousRoutines[id]={routine:clone(backup),savedAt:new Date().toISOString()};
        saveLocal();
        try{await loadPrevious(id)}catch(error){console.warn('DCC routine history refresh:',error)}
      }

      clearEditorState();
      renderClientRoutine(id);
      notify(creatingNew?'Nueva rutina guardada':'Rutina guardada');
      return true;
    }catch(error){
      console.error('DCC guardar rutina premium:',error);

      if(archived&&Array.isArray(backup)){
        try{
          await writeRoutine(id,backup);
        }catch(rollbackError){
          console.error('DCC rollback rutina servidor:',rollbackError);
        }
      }

      if(Array.isArray(backup))applyRoutine(id,backup);
      else await reloadRoutines();
      clearEditorState();
      renderClientRoutine(id);
      alert('No se pudo guardar la rutina. Se ha restaurado la versión anterior.');
      return false;
    }
  };
  saveRoutine.__dccRoutineAuthorityV6=true;
  window.dccSaveRoutine=saveRoutine;

  window.startNewRoutine=createRoutine;
})();
