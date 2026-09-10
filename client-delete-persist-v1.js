/* DCC — eliminación definitiva de clientes: servidor + limpieza local */
(function(){
  'use strict';
  if(window.__dccClientDeletePersistV1Loaded)return;
  window.__dccClientDeletePersistV1Loaded=true;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const notify=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}alert(t)};
  const save=()=>{try{if(typeof saveData==='function')return saveData();if(typeof window.saveData==='function')return window.saveData()}catch(e){console.error(e)}};

  function removeLocalClient(id){
    const d=appData();
    d.clients=(d.clients||[]).filter(c=>String(c.id)!==String(id));
    ['checkins','diets','routines','weights','workoutHistory','bodyFatHistory','messages','notificationState'].forEach(key=>{
      if(d[key]&&typeof d[key]==='object')delete d[key][id];
    });
    ['calendarSessions','sessions','coachCalendarSessions'].forEach(key=>{
      if(Array.isArray(d[key]))d[key]=d[key].filter(row=>String(row?.client_id??row?.clientId??row?.client)!==String(id));
    });
    save();
  }

  function install(){
    const current=window.dccLegacyDelete;
    if(typeof current!=='function')return false;
    if(current.__dccDeletePersistV1)return true;

    const replacement=async function(id){
      const d=appData();
      const client=(d.clients||[]).find(c=>String(c.id)===String(id));
      const name=client?.name||'este cliente';
      if(!window.confirm(`¿Eliminar definitivamente a ${name}? Esta acción borrará también sus datos asociados.`))return;

      const database=db();
      if(!database){
        notify('No hay conexión con el servidor. El cliente no se ha eliminado.');
        return;
      }

      try{
        const result=await database.from('clients').delete().eq('id',id).select('id');
        if(result.error)throw result.error;
        if(!Array.isArray(result.data)||result.data.length===0)throw new Error('El servidor no confirmó la eliminación');

        removeLocalClient(id);
        notify('Cliente eliminado definitivamente');
        if(typeof window.showCoach==='function')window.showCoach('clients');
      }catch(error){
        console.error('DCC eliminación de cliente:',error);
        notify('No se pudo eliminar el cliente. No se ha borrado localmente.');
      }
    };

    replacement.__dccDeletePersistV1=true;
    replacement.__base=current;
    window.dccLegacyDelete=replacement;
    return true;
  }

  install();
  setTimeout(install,120);
  setTimeout(install,500);
  setTimeout(install,1400);
  setTimeout(install,3000);
  window.addEventListener('load',()=>setTimeout(install,180));
})();
