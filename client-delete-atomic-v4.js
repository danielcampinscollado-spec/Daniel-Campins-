/* DCC — borrado fiable de clientes */
(function(){
  'use strict';
  if(window.__dccClientDeleteAtomicV6)return;
  window.__dccClientDeleteAtomicV6=true;

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

  function goClients(){
    window.selectedClient=null;
    window.__dccTrainingEdit=false;
    delete window.__dccTrainingBackup;
    if(typeof window.showCoach==='function'){
      window.showCoach('clients');
      return;
    }
    const clientsBtn=document.querySelector('#coach-nav [data-screen="clients"],#coach-nav button:nth-child(2)');
    clientsBtn?.click?.();
  }

  async function deleteFromServer(db,id){
    // La tabla clients ya tiene ON DELETE CASCADE para todos los datos relacionados.
    // Usamos primero el DELETE normal protegido por RLS de entrenador; es la ruta más directa.
    const direct=await db.from('clients').delete().eq('id',String(id)).select('id');
    if(!direct.error&&Array.isArray(direct.data)&&direct.data.some(row=>String(row.id)===String(id))){
      try{await db.from('dietas').delete().eq('client_id',String(id))}catch(_){ }
      return true;
    }

    // Fallback a la función atómica del servidor por compatibilidad.
    const rpc=await db.rpc('dcc_delete_client',{p_client_id:String(id)});
    if(rpc.error){
      const first=direct.error?.message||'El servidor no confirmó el borrado directo';
      throw new Error(`${first}. ${rpc.error.message||rpc.error}`);
    }
    if(rpc.data!==true)throw new Error('El servidor no confirmó la eliminación del cliente');
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
      goClients();
      notify('Cliente eliminado definitivamente');
    }catch(error){
      console.error('DCC borrado de cliente:',error);
      alert(`No se pudo eliminar el cliente.\n\n${error?.message||'Error desconocido del servidor'}`);
      if(button){button.disabled=false;button.textContent=oldText||'Eliminar cliente'}
    }
  }

  function install(){
    const current=window.dccLegacyDelete;
    if(typeof current!=='function')return false;
    if(current.__dccDeleteAtomicV6)return true;
    const fn=function(id){return deleteClient(id,document.querySelector('#coach-main .dcc-ca-delete'))};
    fn.__dccDeleteAtomicV6=true;
    fn.__base=current;
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
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>40)clearInterval(timer);
  },250);
  window.addEventListener('pageshow',install);
})();
