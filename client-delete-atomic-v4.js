/* DCC — borrado definitivo verificado de clientes */
(function(){
  'use strict';
  if(window.__dccClientDeleteAtomicV8)return;
  window.__dccClientDeleteAtomicV8=true;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const database=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  function cleanupLocal(id){
    const d=appData();
    d.clients=(d.clients||[]).filter(c=>String(c.id)!==String(id));
    [
      'checkins','diets','routines','previousRoutines','routineUpdatedAt',
      'weights','workoutHistory','bodyFatHistory','messages','notificationState',
      'completedTrainingDays','dietHistory'
    ].forEach(k=>{
      if(d[k]&&typeof d[k]==='object')delete d[k][id];
    });
    ['calendarSessions','sessions','coachCalendarSessions'].forEach(k=>{
      if(Array.isArray(d[k]))d[k]=d[k].filter(row=>String(row?.client_id??row?.clientId??row?.client)!==String(id));
    });
    try{localStorage.removeItem('dcc:diet-history:v2:'+String(id))}catch(_){}
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(e){console.error(e)}
  }

  function goClients(){
    window.selectedClient=null;
    window.__dccTrainingEdit=false;
    delete window.__dccTrainingBackup;
    if(typeof window.showCoach==='function')window.showCoach('clients');
    else document.querySelector('#coach-nav [data-screen="clients"],#coach-nav button:nth-child(2)')?.click?.();
  }

  async function requireCoachSession(db){
    if(!db?.auth)throw new Error('Supabase Auth no está disponible');
    const sessionResult=await db.auth.getSession();
    if(sessionResult.error)throw sessionResult.error;
    if(!sessionResult.data?.session)throw new Error('Necesitas iniciar la sesión segura de entrenador antes de eliminar clientes');
    if(window.__dccSecureRole&&window.__dccSecureRole!=='coach')throw new Error('La sesión activa no corresponde al entrenador');
  }

  async function deleteFromServer(db,id){
    await requireCoachSession(db);

    // ÚNICA ruta de borrado: función protegida del servidor.
    // No usamos DELETE directo porque RLS puede devolver 200 sin borrar ninguna fila.
    const rpc=await db.rpc('dcc_delete_client',{p_client_id:String(id)});
    if(rpc.error)throw new Error(rpc.error.message||String(rpc.error));
    if(rpc.data!==true)throw new Error('El servidor no confirmó la eliminación del cliente');

    // Verificación posterior con la misma sesión de entrenador.
    const check=await db.from('clients').select('id').eq('id',String(id)).maybeSingle();
    if(check.error)throw check.error;
    if(check.data)throw new Error('El cliente sigue existiendo en Supabase después del borrado');
    return true;
  }

  async function deleteClient(id,button){
    if(id==null||id==='')return;
    const d=appData();
    const client=(d.clients||[]).find(c=>String(c.id)===String(id));
    const name=client?.name||'este cliente';
    if(!window.confirm(`¿Eliminar definitivamente a ${name}? Esta acción borrará también sus datos asociados.`))return;

    const db=database();
    if(!db){alert('No hay conexión con el servidor. El cliente no se ha eliminado.');return}

    const oldText=button?.textContent;
    if(button){button.disabled=true;button.textContent='Eliminando…'}

    try{
      await deleteFromServer(db,id);
      cleanupLocal(id);
      if(typeof window.dccSyncClientsFromServer==='function'){
        const ok=await window.dccSyncClientsFromServer({render:false});
        if(ok===false)throw new Error('El cliente se eliminó, pero no se pudo refrescar la lista desde Supabase');
      }
      goClients();
      notify('Cliente eliminado definitivamente');
    }catch(error){
      console.error('DCC borrado definitivo de cliente:',error);
      alert(`No se pudo eliminar el cliente.\n\n${error?.message||'Error desconocido del servidor'}`);
      if(button){button.disabled=false;button.textContent=oldText||'Eliminar cliente'}
    }
  }

  function install(){
    const current=window.dccLegacyDelete;
    if(typeof current==='function'&&current.__dccDeleteAtomicV8)return true;
    const previous=typeof current==='function'?current:null;
    const fn=function(id){return deleteClient(id,document.querySelector('#coach-main .dcc-ca-delete'))};
    fn.__dccDeleteAtomicV8=true;
    fn.__base=previous;
    window.dccLegacyDelete=fn;
    return true;
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.dcc-ca-delete');
    if(!button)return;
    const id=window.selectedClient;
    if(id==null||id==='')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    deleteClient(String(id),button);
  },true);

  install();
  window.addEventListener('pageshow',install);
})();
