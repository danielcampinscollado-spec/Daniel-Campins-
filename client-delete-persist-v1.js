/* DCC — eliminación definitiva de clientes + acceso estable a gestionar cliente */
(function(){
  'use strict';
  if(window.__dccClientDeletePersistV3Loaded)return;
  window.__dccClientDeletePersistV3Loaded=true;

  const appData=()=>{try{return data||{}}catch(e){return window.data||{}}};
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

  async function deleteClientRelations(database,id){
    const tables=[
      'client_weights',
      'client_diets',
      'client_routines',
      'client_checkins',
      'client_messages',
      'workout_history',
      'client_notification_state',
      'coach_calendar_sessions',
      'client_body_fat_history',
      'app_user_roles'
    ];

    for(const table of tables){
      const result=await database.from(table).delete().eq('client_id',id);
      if(result.error){
        throw new Error(`${table}: ${result.error.message||result.error}`);
      }
    }

    try{
      const legacy=await database.from('dietas').delete().eq('client_id',id);
      if(legacy.error)console.warn('DCC delete legacy dietas:',legacy.error);
    }catch(error){
      console.warn('DCC delete legacy dietas:',error);
    }
  }

  function installDelete(){
    const current=window.dccLegacyDelete;
    if(typeof current!=='function')return false;
    if(current.__dccDeletePersistV3)return true;

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
        await deleteClientRelations(database,id);

        const result=await database.from('clients').delete().eq('id',id).select('id');
        if(result.error)throw result.error;
        if(!Array.isArray(result.data)||result.data.length===0)throw new Error('El servidor no confirmó la eliminación');

        removeLocalClient(id);
        window.selectedClient=null;
        window.__dccTrainingEdit=false;
        delete window.__dccTrainingBackup;
        if(typeof window.showCoach==='function')window.showCoach('clients');
        notify('Cliente eliminado definitivamente');
      }catch(error){
        console.error('DCC eliminación de cliente:',error);
        notify('No se pudo eliminar el cliente. Revisa la conexión e inténtalo de nuevo.');
      }
    };

    replacement.__dccDeletePersistV1=true;
    replacement.__dccDeletePersistV2=true;
    replacement.__dccDeletePersistV3=true;
    replacement.__base=current;
    window.dccLegacyDelete=replacement;
    return true;
  }

  function unwrapAdmin(fn){
    let current=fn,depth=0;
    while(typeof current==='function'&&typeof current.__base==='function'&&depth<12){
      current=current.__base;
      depth++;
    }
    return typeof current==='function'?current:null;
  }

  function openManagedClient(id){
    if(id==null||id==='')return false;

    const currentAdmin=window.dccClientAdmin;
    if(typeof currentAdmin==='function'){
      try{
        currentAdmin(String(id),'summary');
        return true;
      }catch(error){
        console.error('DCC gestionar cliente — wrapper:',error);
      }
    }

    const directAdmin=unwrapAdmin(currentAdmin)||unwrapAdmin(window.openClient);
    if(typeof directAdmin==='function'){
      try{
        directAdmin(String(id),'summary');
        return true;
      }catch(error){
        console.error('DCC gestionar cliente — directo:',error);
      }
    }

    return false;
  }

  function extractClientId(button){
    const explicit=button?.dataset?.clientId;
    if(explicit)return explicit;
    const code=button?.getAttribute?.('onclick')||'';
    const match=code.match(/openClient\(\s*['\"]([^'\"]+)['\"]\s*\)/i);
    return match?.[1]||null;
  }

  function installManageBridge(){
    if(typeof window.dccClientAdmin!=='function')return false;
    if(window.openClient?.__dccManageBridgeV2)return true;

    const previous=window.openClient;
    const bridge=function(id){
      if(openManagedClient(id))return;
      if(typeof previous==='function')return previous.apply(this,arguments);
    };
    bridge.__dccManageBridgeV2=true;
    bridge.__dccAdmin=true;
    bridge.__base=previous;
    window.openClient=bridge;
    window.showClientAdmin=bridge;
    return true;
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.dcc-cl-manage');
    if(!button)return;
    const id=extractClientId(button);
    if(!id)return;

    if(openManagedClient(id)){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);

  window.dccOpenManagedClient=openManagedClient;

  function installAll(){
    installDelete();
    installManageBridge();
  }

  installAll();
  setTimeout(installAll,120);
  setTimeout(installAll,500);
  setTimeout(installAll,1400);
  setTimeout(installAll,3000);
  window.addEventListener('load',()=>setTimeout(installAll,180));
})();
