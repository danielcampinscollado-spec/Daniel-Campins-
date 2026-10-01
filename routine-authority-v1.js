/* DCC — rutinas persistentes y rollback seguro */
(function(){
  'use strict';
  const BUILD='20260913-routine-authority-v5';
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

  function renderClientRoutine(id){
    if(typeof window.dccClientAdmin==='function')return window.dccClientAdmin(id,'training');
    console.error('DCC training: premium client admin authority unavailable');
    notify('No se pudo abrir el editor de entrenamiento');
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

  function plusOneMonthDate(){const d=new Date(),day=d.getDate(),x=new Date(d.getFullYear(),d.getMonth()+1,1);x.setDate(Math.min(day,new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));return [x.getFullYear(),String(x.getMonth()+1).padStart(2,'0'),String(x.getDate()).padStart(2,'0')].join('-')}

  window.dccSendRoutineToClient=async function(id){
    const d=appData(),routine=clone(d.routines?.[id])||[],client=d?.clients?.find?.(x=>String(x?.id)===String(id))||{},required=Math.max(1,Math.min(7,parseInt(client?.preferred_training_days,10)||routine.length||1)),configured=routine.filter(x=>Array.isArray(x?.exercises)&&x.exercises.length>0).length;
    if(configured<required){notify('Completa todos los días de entrenamiento antes de enviar la rutina');return false}
    const database=db();if(!database){notify('Sin conexión con el servidor');return false}
    try{
      await writeRoutine(id,routine);
      const next=plusOneMonthDate();
      const current=await database.rpc('dcc_get_coach_followup',{p_client_id:String(id)});if(current.error||!current.data)throw current.error||new Error('No se pudo cargar el seguimiento privado');
      const saved=await database.rpc('dcc_save_coach_followup',{p_client_id:String(id),p_checkin:current.data.checkin_frequency||'off',p_photo:current.data.photo_frequency||'off',p_diet:current.data.next_diet_review||null,p_routine:next});if(saved.error||!saved.data)throw saved.error||new Error('No se pudo programar la revisión de rutina');
      client.checkinFrequency=client.checkin_frequency=saved.data.checkin_frequency||'off';client.photoFrequency=client.photo_frequency=saved.data.photo_frequency||'off';client.nextDietReview=client.next_diet_review=saved.data.next_diet_review||'';client.next_routine_review=client.nextRoutineReview=saved.data.next_routine_review||next;if(Array.isArray(saved.data.coach_notes))client.coachNotes=saved.data.coach_notes;
      applyRoutine(id,routine);try{renderClientRoutine(id)}catch(renderError){console.warn('DCC render tras enviar rutina:',renderError)}notify('Rutina enviada correctamente');return true;
    }catch(error){console.error('DCC enviar rutina:',error);notify('No se pudo enviar la rutina');return false}
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
      renderClientRoutine(id);
      notify('Día de entrenamiento eliminado');
    }catch(error){
      console.error('DCC eliminar día server-first:',error);
      await reloadRoutines();
      alert('No se pudo eliminar el día. La rutina se mantiene sin cambios.');
    }
  };

  window.dccSaveRoutine=async function(id){
    const draft=clone(appData().routines?.[id])||[];
    let backup=null;
    try{
      if(window.__dccTrainingBackup!==undefined)backup=JSON.parse(window.__dccTrainingBackup);
    }catch(_){backup=null}

    try{
      await writeRoutine(id,draft);
      applyRoutine(id,draft);
      const client=appData()?.clients?.find?.(x=>String(x?.id)===String(id))||appData()?.clients?.[id]||{};
      const required=Math.max(1,Math.min(7,parseInt(client?.preferred_training_days,10)||draft.length||1));
      const configured=(Array.isArray(draft)?draft:[]).filter(d=>Array.isArray(d?.exercises)&&d.exercises.length>0).length;
      const remaining=Math.max(0,required-configured);
      window.__dccTrainingEdit=false;
      delete window.__dccTrainingBackup;
      window.__dccRoutineDraftDirty=false;
      window.__dccRoutineUnsavedBackup=undefined;
      window.__dccRoutineUnsavedBackupSet=false;
      window.__dccRoutineUnsavedClient='';
      renderClientRoutine(id);
      if(remaining>0)alert(`Sesión guardada como borrador.\n\nQuedan ${remaining} día${remaining===1?'':'s'} de entrenamiento por configurar. La rutina todavía no se enviará al cliente.`);else notify('Rutina completa. Ya puedes enviarla al cliente.');
    }catch(error){
      console.error('DCC guardar rutina premium:',error);
      if(backup!==null)applyRoutine(id,backup);
      else await reloadRoutines();
      window.__dccTrainingEdit=false;
      delete window.__dccTrainingBackup;
      window.__dccRoutineDraftDirty=false;
      window.__dccRoutineUnsavedBackup=undefined;
      window.__dccRoutineUnsavedBackupSet=false;
      window.__dccRoutineUnsavedClient='';
      renderClientRoutine(id);
      alert('No se pudo guardar la rutina. Se ha restaurado la versión anterior.');
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
    // Crear una rutina nueva empieza siempre como borrador local. La rutina activa
    // del servidor no se archiva ni se vacía hasta que el entrenador la guarda/envía.
    window.__dccTrainingBackup=JSON.stringify(current);
    window.__dccTrainingEdit=true;
    window.__dccRoutineDraftDirty=false;
    window.__dccRoutineUnsavedBackup=clone(current);
    window.__dccRoutineUnsavedBackupSet=true;
    window.__dccRoutineUnsavedClient=String(id);
    const d=appData();d.routines=d.routines||{};d.routines[id]=[];
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
    renderClientRoutine(id);
  };
})();
