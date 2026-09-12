/* DCC — rutinas persistentes y rollback seguro */
(function(){
  'use strict';
  const BUILD='20260912-routine-authority-v1';
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

  window.saveRoutineToSupabase=async function(id){
    const database=db();
    if(!database){await reloadRoutines();return false}
    const routine=clone(appData().routines?.[id])||[];
    try{
      const result=await database.from('client_routines').upsert({client_id:String(id),routine,updated_at:new Date().toISOString()},{onConflict:'client_id'});
      if(result.error)throw result.error;
      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
      return true;
    }catch(error){
      console.error('DCC routine server-first:',error);
      await reloadRoutines();
      return false;
    }
  };

  async function loadPrevious(id){
    const database=db();
    if(!database)return null;
    const result=await database.from('client_routine_history').select('routine,archived_at').eq('client_id',String(id)).order('archived_at',{ascending:false}).limit(1).maybeSingle();
    if(result.error)throw result.error;
    const row=result.data;
    if(!row)return null;
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
