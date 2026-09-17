/* DCC — autoridad server-first para mutaciones del editor de alimentación */
(function(){
'use strict';
const BUILD='20260917-nutrition-editor-authority-v7-first-plan-direct';
if(window.__dccNutritionEditorAuthority===BUILD)return;
window.__dccNutritionEditorAuthority=BUILD;

const clone=v=>JSON.parse(JSON.stringify(v??null));
const getSupabase=()=>{try{return typeof supabaseClient!=='undefined'?supabaseClient:(window.supabaseClient||null)}catch(_){return window.supabaseClient||null}};
const getAppData=()=>{try{return typeof data!=='undefined'?data:(window.data||null)}catch(_){return window.data||null}};
function bridgeAppGlobals(){
  const db=getSupabase();
  const appData=getAppData();
  if(db)window.supabaseClient=db;
  if(appData)window.data=appData;
  return{db,appData};
}
bridgeAppGlobals();
let busy=false;
let firstPlanLoader=null;

function client(id){bridgeAppGlobals();return (window.data?.clients||[]).find(x=>String(x.id)===String(id))||{}}
function avoidText(id){const c=client(id);return String(c.foods_to_avoid??c.foodsToAvoid??'').trim()}
function normalizeOptions(m){
  if(Array.isArray(m?.options)&&m.options.length)return m.options;
  if(Array.isArray(m?.foods))return[{name:'Opción 1',foods:m.foods}];
  return[{name:'Opción 1',foods:[]}];
}
function writeOptions(m,o){m.options=o;delete m.foods}
function savedDay(day){return !!(day&&typeof day==='object'&&(day.updated_at||(Array.isArray(day.meals)&&day.meals.length>0)))}
function hasInitializedPlan(id){
  bridgeAppGlobals();
  const p=window.data?.diets?.[id];
  return !!(p&&typeof p==='object'&&(p.__dccPlanInitialized===true||savedDay(p.training)||savedDay(p.rest)));
}
function ensureFirstPlanSetup(){
  if(typeof window.dccNutritionMealSetupStart==='function')return Promise.resolve(true);
  if(firstPlanLoader)return firstPlanLoader;
  firstPlanLoader=new Promise(resolve=>{
    const s=document.createElement('script');
    s.src='./nutrition-meal-setup-v1.js?v=20260917-meal-authority-v11-real-globals';
    s.async=false;
    s.onload=()=>resolve(typeof window.dccNutritionMealSetupStart==='function');
    s.onerror=()=>{firstPlanLoader=null;resolve(false)};
    (document.head||document.documentElement).appendChild(s);
  });
  return firstPlanLoader;
}
function installFirstPlanDirect(){
  const current=window.dccNutritionV2New;
  if(typeof current!=='function'||current.__dccFirstPlanDirect)return;
  const base=current;
  const wrapped=async function(id){
    bridgeAppGlobals();
    window.selectedClient=id;
    if(!hasInitializedPlan(id)){
      const ready=await ensureFirstPlanSetup();
      if(!ready){
        alert('No se pudo cargar el asistente para crear la dieta.');
        return false;
      }
      if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      const opened=window.dccNutritionMealSetupStart(id);
      if(opened===false){
        alert('No se pudo abrir el asistente de comidas.');
        return false;
      }
      return opened;
    }
    return base.apply(this,arguments);
  };
  wrapped.__dccFirstPlanDirect=true;
  wrapped.__base=base;
  window.dccNutritionV2New=wrapped;
}
function normalizedPlan(id){
  bridgeAppGlobals();
  const current=clone(window.data?.diets?.[id])||{};
  return{
    training:clone(current.training)||{calories:'',protein:'',meals:[]},
    rest:clone(current.rest)||{calories:'',protein:'',meals:[]}
  };
}
async function persist(id,next){
  const{db}=bridgeAppGlobals();
  if(!db)throw new Error('Sin conexión con Supabase');
  const serverPlan={
    training:clone(next?.training)||{calories:'',protein:'',meals:[]},
    rest:clone(next?.rest)||{calories:'',protein:'',meals:[]}
  };
  const{data:ok,error}=await db.rpc('dcc_save_diet_plan',{
    p_client_id:String(id),
    p_training:serverPlan.training,
    p_rest:serverPlan.rest
  });
  if(error)throw error;
  if(ok!==true)throw new Error('El servidor no confirmó el guardado de la dieta');
  return serverPlan;
}
async function commit(id,mutate){
  if(busy){if(typeof window.toast==='function')window.toast('Guardando alimentación…');return false}
  busy=true;
  try{
    bridgeAppGlobals();
    const next=normalizedPlan(id);
    const changed=mutate(next);
    if(changed===false)return false;
    const saved=await persist(id,next);
    window.data=window.data||{};
    window.data.diets=window.data.diets||{};
    saved.__dccPlanInitialized=true;
    window.data.diets[id]=saved;
    if(typeof window.saveData==='function')window.saveData();
    return true;
  }catch(error){
    console.error('DCC nutrition editor server-first:',error);
    if(typeof window.toast==='function')window.toast('No se pudo guardar la alimentación');
    else alert('No se pudo guardar la alimentación. No se ha aplicado ningún cambio.');
    return false;
  }finally{busy=false}
}
function rerender(id,mi){
  bridgeAppGlobals();
  if(Number.isInteger(mi))window.__dccDietOpenMeal=mi;
  if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
}
function installNutritionRoute(){
  bridgeAppGlobals();
  const current=window.showCoach;
  if(typeof current!=='function'||current.__dccNutritionV2RouteGuard)return;
  const base=current;
  const wrapped=function(screen){
    bridgeAppGlobals();
    if(screen==='diets'){
      const id=window.selectedClient||window.__dccClientAdminId||null;
      if(id&&typeof window.dccNutritionV2Home==='function')return window.dccNutritionV2Home(id);
      return base.call(this,'clients');
    }
    return base.apply(this,arguments);
  };
  wrapped.__dccNutritionV2RouteGuard=true;
  wrapped.__base=base;
  window.showCoach=wrapped;
}
function installNutritionEntries(){
  bridgeAppGlobals();
  window.dccNewDietPlan=function(id){
    bridgeAppGlobals();
    window.__dccDietEditing=false;
    window.selectedClient=id;
    if(typeof window.dccNutritionV2New==='function')return window.dccNutritionV2New(id);
    if(typeof window.toast==='function')window.toast('Cargando creación de alimentación…');
    return false;
  };
  window.dccNewDietPlan.__dccNutritionV2Direct=true;

  window.dccEditDietPlan=function(id){
    bridgeAppGlobals();
    window.selectedClient=id;
    if(typeof window.dccNutritionV2Edit==='function')return window.dccNutritionV2Edit(id);
    if(typeof window.toast==='function')window.toast('Cargando editor de alimentación…');
    return false;
  };
  window.dccEditDietPlan.__dccNutritionV2Direct=true;
}

window.dccDietAddMeal=function(id,type){
  bridgeAppGlobals();
  if(typeof window.dccNutritionMealAddStart==='function')return window.dccNutritionMealAddStart(id,type||window.__dccDietType||'training');
  if(typeof window.toast==='function')window.toast('Cargando editor de alimentación…');
  return false;
};
window.dccDietAddMeal.__dccNutritionEditorAuthority=true;

window.dccDietAddFood=async function(id,type,mealIndex,optionIndex){
  bridgeAppGlobals();
  const avoid=avoidText(id);
  if(avoid)alert(`Aviso del cliente\nNo incluir: ${avoid}.`);
  const name=prompt('Nombre del alimento','');
  if(!name)return;
  const quantity=prompt('Cantidad','');
  if(quantity===null)return;
  const ok=await commit(id,next=>{
    const meal=next?.[type]?.meals?.[mealIndex];
    if(!meal)throw new Error('No existe la comida seleccionada');
    const options=normalizeOptions(meal);
    if(!options[optionIndex])throw new Error('No existe la opción seleccionada');
    options[optionIndex].foods=Array.isArray(options[optionIndex].foods)?options[optionIndex].foods:[];
    options[optionIndex].foods.push([name,quantity]);
    writeOptions(meal,options);
  });
  if(ok)rerender(id,mealIndex);
};
window.dccDietAddFood.__dccNutritionEditorAuthority=true;
window.dccDietAddFood.__dccNativeAvoidWarning=true;

window.dccDietRemoveFood=async function(id,type,mealIndex,foodIndex,optionIndex){
  bridgeAppGlobals();
  if(!confirm('¿Eliminar este alimento?'))return;
  const ok=await commit(id,next=>{
    const meal=next?.[type]?.meals?.[mealIndex];
    if(!meal)throw new Error('No existe la comida seleccionada');
    const options=normalizeOptions(meal);
    if(!options[optionIndex]||!Array.isArray(options[optionIndex].foods))throw new Error('No existe la opción seleccionada');
    options[optionIndex].foods.splice(foodIndex,1);
    writeOptions(meal,options);
  });
  if(ok)rerender(id,mealIndex);
};

window.dccDietAddOption=async function(id,type,mealIndex){
  bridgeAppGlobals();
  let newIndex=null;
  const ok=await commit(id,next=>{
    const meal=next?.[type]?.meals?.[mealIndex];
    if(!meal)throw new Error('No existe la comida seleccionada');
    const options=normalizeOptions(meal);
    if(options.length>=3)return false;
    options.push({name:'Opción '+(options.length+1),foods:[]});
    newIndex=options.length-1;
    writeOptions(meal,options);
  });
  if(ok){
    window.__dccDietOptionMap=window.__dccDietOptionMap||{};
    window.__dccDietOptionMap[mealIndex]=newIndex;
    rerender(id,mealIndex);
  }
};

window.dccDietRemoveOption=async function(id,type,mealIndex,optionIndex){
  bridgeAppGlobals();
  if(optionIndex<1)return;
  const ok=await commit(id,next=>{
    const meal=next?.[type]?.meals?.[mealIndex];
    if(!meal)throw new Error('No existe la comida seleccionada');
    const options=normalizeOptions(meal);
    if(!options[optionIndex])return false;
    options.splice(optionIndex,1);
    writeOptions(meal,options);
  });
  if(ok){
    window.__dccDietOptionMap=window.__dccDietOptionMap||{};
    window.__dccDietOptionMap[mealIndex]=0;
    rerender(id,mealIndex);
  }
};

window.dccDietEditFood=async function(id,type,mealIndex,foodIndex,optionIndex){
  bridgeAppGlobals();
  const current=window.data?.diets?.[id]?.[type]?.meals?.[mealIndex];
  if(!current)return;
  const currentOptions=normalizeOptions(current);
  const food=currentOptions?.[optionIndex]?.foods?.[foodIndex];
  if(!food)return;
  const name=prompt('Nombre del alimento',food[0]);
  if(name===null)return;
  const quantity=prompt('Cantidad',food[1]);
  if(quantity===null)return;
  const ok=await commit(id,next=>{
    const meal=next?.[type]?.meals?.[mealIndex];
    if(!meal)throw new Error('No existe la comida seleccionada');
    const options=normalizeOptions(meal);
    const target=options?.[optionIndex]?.foods?.[foodIndex];
    if(!target)throw new Error('No existe el alimento seleccionado');
    target[0]=name||target[0];
    target[1]=quantity;
    writeOptions(meal,options);
  });
  if(ok)rerender(id,mealIndex);
};

installNutritionRoute();
installNutritionEntries();
installFirstPlanDirect();
document.addEventListener('DOMContentLoaded',()=>{bridgeAppGlobals();installNutritionRoute();installNutritionEntries();installFirstPlanDirect()},{once:true});
window.addEventListener('pageshow',()=>{bridgeAppGlobals();installNutritionRoute();installNutritionEntries();installFirstPlanDirect()});
})();