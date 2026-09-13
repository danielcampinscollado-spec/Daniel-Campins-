/* DCC — acciones server-first auxiliares de dieta. Las autoridades de cliente/métricas viven en módulos dedicados. */
(function(){
  'use strict';
  const BUILD='20260913-server-actions-v3';
  if(window.__dccServerActions===BUILD)return;
  window.__dccServerActions=BUILD;

  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const clone=value=>JSON.parse(JSON.stringify(value??null));
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};

  async function saveDietTypeServerFirst(id,type,nextDiet){
    const database=db();if(!database)throw new Error('No hay conexión con el servidor');
    const row={client_id:String(id),diet_type:type,calories:nextDiet?.calories||'',protein:nextDiet?.protein||'',meals:Array.isArray(nextDiet?.meals)?nextDiet.meals:[],updated_at:new Date().toISOString()};
    const result=await database.from('client_diets').upsert(row,{onConflict:'client_id,diet_type'});if(result.error)throw result.error;
    const d=appData();d.diets=d.diets||{};d.diets[id]=d.diets[id]||{};d.diets[id][type]=clone(nextDiet);
    try{if(typeof saveData==='function')saveData();else if(typeof window.saveData==='function')window.saveData()}catch(_){}
  }

  window.editDietMarcos=async function(id,type){
    const current=clone(appData().diets?.[id]?.[type])||{calories:'',protein:'',meals:[]};const calories=prompt('Calorías:',current.calories||'');if(calories===null)return;const protein=prompt('Proteína:',current.protein||'');if(protein===null)return;const next={...current,calories,protein};
    try{await saveDietTypeServerFirst(id,type,next);window.coachDietType=type;if(typeof window.showCoach==='function')window.showCoach('diets');notify('Datos de la dieta guardados')}catch(error){console.error('DCC macros server-first:',error);alert('No se pudieron guardar los datos de la dieta. No se ha aplicado ningún cambio local.')}
  };

  window.addMeal=async function(id,type){
    const name=prompt('Nombre de la comida:');if(!name||!name.trim())return;const current=clone(appData().diets?.[id]?.[type])||{calories:'',protein:'',meals:[]};current.meals=Array.isArray(current.meals)?current.meals:[];current.meals.push({name:name.trim(),options:[{name:'Opción 1',foods:[]}]});
    try{await saveDietTypeServerFirst(id,type,current);window.coachDietType=type;if(typeof window.showCoach==='function')window.showCoach('diets');notify('Comida añadida')}catch(error){console.error('DCC comida server-first:',error);alert('No se pudo añadir la comida. No se ha aplicado ningún cambio local.')}
  };
})();
