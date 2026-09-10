/* DCC — eliminación definitiva de clientes + acceso estable a gestionar cliente */
(function(){
  'use strict';
  if(window.__dccClientDeletePersistV2Loaded)return;
  window.__dccClientDeletePersistV2Loaded=true;

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

  function installDelete(){
    const current=window.dccLegacyDelete;
    if(typeof current!=='function')return false;
    if(current.__dccDeletePersistV1||current.__dccDeletePersistV2)return true;

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
    replacement.__dccDeletePersistV2=true;
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

  /* El listado premium se vuelve a dibujar dinámicamente. Capturamos el toque
     directamente para que no dependa de wrappers antiguos de openClient. */
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
