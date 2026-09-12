/* DCC — acciones críticas server-first */
(function(){
  'use strict';
  const BUILD='20260912-server-actions-v2';
  if(window.__dccServerActions===BUILD)return;
  window.__dccServerActions=BUILD;

  const appData=()=>{try{return data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const getClient=id=>(appData().clients||[]).find(c=>String(c.id)===String(id));
  const clone=value=>JSON.parse(JSON.stringify(value??null));
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  async function refreshWeightState(id){
    if(typeof window.loadWeightsFromSupabase==='function')await window.loadWeightsFromSupabase();
    if(typeof window.dccSyncClientsFromServer==='function')await window.dccSyncClientsFromServer({render:false});
    if(typeof window.showClientAdmin==='function')window.showClientAdmin(id,'progress');
  }

  async function refreshClientDomains(){
    const tasks=[];
    if(typeof window.dccSyncClientsFromServer==='function')tasks.push(window.dccSyncClientsFromServer({render:false}));
    for(const name of ['loadDietsFromSupabase','loadRoutinesFromSupabase','loadWeightsFromSupabase','loadCheckinsFromSupabase']){
      if(typeof window[name]==='function')tasks.push(window[name]());
    }
    await Promise.allSettled(tasks);
  }

  async function saveDietTypeServerFirst(id,type,nextDiet){
    const database=db();
    if(!database)throw new Error('No hay conexión con el servidor');
    const row={
      client_id:String(id),
      diet_type:type,
      calories:nextDiet?.calories||'',
      protein:nextDiet?.protein||'',
      meals:Array.isArray(nextDiet?.meals)?nextDiet.meals:[],
      updated_at:new Date().toISOString()
    };
    const result=await database.from('client_diets').upsert(row,{onConflict:'client_id,diet_type'});
    if(result.error)throw result.error;
    const d=appData();
    d.diets=d.diets||{};
    d.diets[id]=d.diets[id]||{};
    d.diets[id][type]=clone(nextDiet);
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
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

  window.createClient=async function(){
    const name=String(document.getElementById('new-name')?.value||'').trim();
    const weightText=String(document.getElementById('new-weight')?.value||'').trim();
    const bodyFatText=String(document.getElementById('new-body-fat')?.value||'').trim();
    const goal=String(document.getElementById('new-goal')?.value||'').trim();
    if(!name||!weightText||!bodyFatText||!goal){notify('Completa todos los campos');return}
    const weight=Number(weightText.replace(',','.'));
    const bodyFat=Number(bodyFatText.replace(',','.'));
    if(!Number.isFinite(weight)||weight<=0||weight>=500){notify('Introduce un peso válido');return}
    if(!Number.isFinite(bodyFat)||bodyFat<=0||bodyFat>=70){notify('Introduce un % de grasa válido');return}
    const database=db();
    if(!database){alert('No hay conexión con el servidor. El cliente no se ha creado.');return}
    const id='client_'+Date.now();
    try{
      const result=await database.rpc('dcc_create_client',{p_id:id,p_name:name,p_goal:goal,p_weight:weight,p_body_fat:bodyFat});
      if(result.error)throw result.error;
      if(result.data!==true)throw new Error('El servidor no confirmó la creación del cliente');
      await refreshClientDomains();
      if(typeof window.closeModal==='function')window.closeModal();
      if(typeof window.showCoach==='function')window.showCoach('clients');
      notify('Cliente creado correctamente');
    }catch(error){
      console.error('DCC creación atómica de cliente:',error);
      alert('No se pudo crear el cliente. No se ha guardado ningún estado parcial.\n\n'+(error?.message||'Error del servidor'));
    }
  };

  window.editDietMarcos=async function(id,type){
    const current=clone(appData().diets?.[id]?.[type])||{calories:'',protein:'',meals:[]};
    const calories=prompt('Calorías:',current.calories||'');
    if(calories===null)return;
    const protein=prompt('Proteína:',current.protein||'');
    if(protein===null)return;
    const next={...current,calories,protein};
    try{
      await saveDietTypeServerFirst(id,type,next);
      window.coachDietType=type;
      if(typeof window.showCoach==='function')window.showCoach('diets');
      notify('Datos de la dieta guardados');
    }catch(error){
      console.error('DCC macros server-first:',error);
      alert('No se pudieron guardar los datos de la dieta. No se ha aplicado ningún cambio local.');
    }
  };

  window.addMeal=async function(id,type){
    const name=prompt('Nombre de la comida:');
    if(!name||!name.trim())return;
    const current=clone(appData().diets?.[id]?.[type])||{calories:'',protein:'',meals:[]};
    current.meals=Array.isArray(current.meals)?current.meals:[];
    current.meals.push({name:name.trim(),options:[{name:'Opción 1',foods:[]}]});
    try{
      await saveDietTypeServerFirst(id,type,current);
      window.coachDietType=type;
      if(typeof window.showCoach==='function')window.showCoach('diets');
      notify('Comida añadida');
    }catch(error){
      console.error('DCC comida server-first:',error);
      alert('No se pudo añadir la comida. No se ha aplicado ningún cambio local.');
    }
  };
})();
