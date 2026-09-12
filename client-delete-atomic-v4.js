/* DCC — borrado atómico y fiable de clientes */
(function(){
  'use strict';
  if(window.__dccClientDeleteAtomicV4)return;
  window.__dccClientDeleteAtomicV4=true;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  function cleanupLocal(id){
    const d=appData();
    d.clients=(d.clients||[]).filter(c=>String(c.id)!==String(id));
    ['checkins','diets','routines','weights','workoutHistory','bodyFatHistory','messages','notificationState'].forEach(k=>{
      if(d[k]&&typeof d[k]==='object')delete d[k][id];
    });
    ['calendarSessions','sessions','coachCalendarSessions'].forEach(k=>{
      if(Array.isArray(d[k]))d[k]=d[k].filter(row=>String(row?.client_id??row?.clientId??row?.client)!==String(id));
    });
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){console.error(e)}
  }

  function install(){
    const current=window.dccLegacyDelete;
    if(typeof current!=='function')return false;
    if(current.__dccDeleteAtomicV4)return true;

    const fn=async function(id){
      const d=appData();
      const client=(d.clients||[]).find(c=>String(c.id)===String(id));
      const name=client?.name||'este cliente';
      if(!window.confirm(`¿Eliminar definitivamente a ${name}? Esta acción borrará también sus datos asociados.`))return;

      const db=database();
      if(!db){notify('No hay conexión con el servidor. El cliente no se ha eliminado.');return}

      try{
        const {data:deleted,error}=await db.rpc('dcc_delete_client',{p_client_id:String(id)});
        if(error)throw error;
        if(deleted!==true)throw new Error('El servidor no confirmó la eliminación');

        cleanupLocal(id);
        window.selectedClient=null;
        window.__dccTrainingEdit=false;
        delete window.__dccTrainingBackup;
        if(typeof window.showCoach==='function')window.showCoach('clients');
        notify('Cliente eliminado definitivamente');
      }catch(error){
        console.error('DCC borrado atómico de cliente:',error);
        notify('No se pudo eliminar el cliente.');
      }
    };

    fn.__dccDeleteAtomicV4=true;
    fn.__base=current;
    window.dccLegacyDelete=fn;
    return true;
  }

  install();
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>40)clearInterval(timer);
  },250);
  window.addEventListener('pageshow',install);
})();
