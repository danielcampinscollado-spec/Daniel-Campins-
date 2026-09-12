/* DCC — acciones críticas server-first */
(function(){
  'use strict';
  const BUILD='20260912-server-actions-v1';
  if(window.__dccServerActions===BUILD)return;
  window.__dccServerActions=BUILD;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const getClient=id=>(appData().clients||[]).find(c=>String(c.id)===String(id));
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  async function refreshWeightState(id){
    if(typeof window.loadWeightsFromSupabase==='function')await window.loadWeightsFromSupabase();
    if(typeof window.dccSyncClientsFromServer==='function')await window.dccSyncClientsFromServer({render:false});
    if(typeof window.showClientAdmin==='function')window.showClientAdmin(id,'progress');
  }

  window.addWeight=async function(id){
    const c=getClient(id);
    if(!c)return;
    const raw=prompt('Nuevo peso (kg)',c.weight??'');
    if(raw===null)return;
    const w=Number(String(raw).replace(',','.'));
    if(!Number.isFinite(w)||w<=0||w>=500){notify('Introduce un peso válido');return}

    const database=db();
    if(!database){alert('No hay conexión con el servidor. El peso no se ha guardado.');return}

    try{
      const result=await database.rpc('dcc_record_weight',{p_client_id:String(id),p_weight:w});
      if(result.error)throw result.error;
      if(result.data!==true)throw new Error('El servidor no confirmó el registro del peso');
      await refreshWeightState(id);
      notify('Peso añadido');
    }catch(error){
      console.error('DCC peso server-first:',error);
      alert('No se pudo guardar el peso. No se ha aplicado ningún cambio local.\n\n'+(error?.message||'Error del servidor'));
    }
  };
})();
