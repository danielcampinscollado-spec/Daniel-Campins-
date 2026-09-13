/* DCC — peso entrenador: autoridad server-first atómica */
(function(){
  'use strict';
  if(window.__dccCoachWeightAuthorityV1)return;
  window.__dccCoachWeightAuthorityV1=true;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}console.log(msg)};
  const parseNumber=v=>{const n=parseFloat(String(v??'').trim().replace(',','.'));return Number.isFinite(n)?n:null};

  window.addWeight=async function(id){
    const d=appData();
    const client=(d.clients||[]).find(c=>String(c.id)===String(id));
    if(!client){notify('No se encontró el cliente');return}

    const text=prompt('Nuevo peso (kg):');
    if(text===null)return;
    const value=parseNumber(text);
    if(value===null||value<=0||value>500){notify('Introduce un peso válido');return}

    const database=db();
    if(!database){notify('No hay conexión con el servidor');return}

    try{
      const {data:ok,error}=await database.rpc('dcc_add_weight',{p_client_id:String(id),p_weight:value});
      if(error)throw error;
      if(ok!==true)throw new Error('El servidor no confirmó el peso');

      client.weight=value;
      client.status='Pendiente';
      d.weights=d.weights||{};
      d.weights[id]=Array.isArray(d.weights[id])?d.weights[id]:[];
      d.weights[id].push(value);
      d.checkins=d.checkins||{};
      d.checkins[id]=d.checkins[id]||{};
      d.checkins[id].weight=value.toFixed(1).replace('.',',')+' kg';
      d.checkins[id].reviewed=false;

      try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
      if(typeof window.showClientAdmin==='function')window.showClientAdmin(id);
      else if(typeof showClientAdmin==='function')showClientAdmin(id);
      notify('Peso actualizado correctamente');
    }catch(error){
      console.error('DCC coach weight authority:',error);
      notify('No se pudo guardar el peso');
    }
  };
})();
