/* DCC — fuente server-first estricta para el plan alimenticio activo */
(function(){
  'use strict';
  const BUILD='20260913-diet-server-source-v2';
  if(window.__dccDietServerSource===BUILD)return;
  window.__dccDietServerSource=BUILD;

  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const appData=()=>{try{return data||window.data||{}}catch(_){return window.data||{}}};

  async function loadPlan(id){
    const database=db();if(!database)throw new Error('No hay conexión con Supabase');
    const sid=String(id);
    const {data:rows,error}=await database.from('client_diets').select('diet_type,calories,protein,meals,updated_at').eq('client_id',sid);if(error)throw error;
    const next={training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};
    (rows||[]).forEach(row=>{if(row?.diet_type!=='training'&&row?.diet_type!=='rest')return;next[row.diet_type]={calories:String(row.calories??''),protein:String(row.protein??''),meals:Array.isArray(row.meals)?row.meals:[]}});
    const d=appData();d.diets=d.diets||{};d.diets[sid]=next;
    try{if(typeof window.saveData==='function')window.saveData();else if(typeof saveData==='function')saveData()}catch(_){}
    return next;
  }

  function install(){
    const home=window.dccNutritionV2Home;
    if(typeof home==='function'&&!home.__dccDietServerSourceV2){
      const base=home;
      const wrapped=async function(id){
        try{await loadPlan(id)}catch(error){console.error('DCC dieta — cargar plan actual:',error);alert('No se pudo cargar la alimentación desde el servidor. No se mostrará una copia antigua del navegador.');return false}
        return base.apply(this,arguments);
      };
      wrapped.__dccDietServerSourceV2=true;wrapped.__base=base;window.dccNutritionV2Home=wrapped;
    }

    const edit=window.dccNutritionV2Edit;
    if(typeof edit==='function'&&!edit.__dccDietServerSourceV2){
      const base=edit;
      const wrapped=async function(id){
        try{await loadPlan(id)}catch(error){console.error('DCC dieta — cargar antes de editar:',error);alert('No se pudo cargar el plan actual del servidor. No se abrirá el editor para evitar sobrescribir datos.');return false}
        return base.apply(this,arguments);
      };
      wrapped.__dccDietServerSourceV2=true;wrapped.__base=base;window.dccNutritionV2Edit=wrapped;
    }
    return !!(window.dccNutritionV2Home?.__dccDietServerSourceV2&&window.dccNutritionV2Edit?.__dccDietServerSourceV2);
  }

  function selectedClient(){return window.selectedClient??window.__dccClientAdminId??null}
  function interceptFoodTab(event){
    const button=event.target?.closest?.('.dcc-ca-tab');if(!button||String(button.textContent||'').trim()!=='Alimentación')return;
    const id=selectedClient();if(!id)return;event.preventDefault();event.stopImmediatePropagation();Promise.resolve(window.dccNutritionV2Home?.(id)).catch(error=>console.error('DCC dieta — abrir Alimentación:',error));
  }

  window.dccLoadDietPlanFromSupabase=loadPlan;
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});
  window.addEventListener('pageshow',install);
  document.addEventListener('click',interceptFoodTab,true);
})();
