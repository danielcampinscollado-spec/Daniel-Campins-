/* DCC — autoridad server-first para mutaciones del editor de alimentación */
(function(){
'use strict';
const BUILD='20260917-nutrition-editor-authority-v1';
if(window.__dccNutritionEditorAuthority===BUILD)return;
window.__dccNutritionEditorAuthority=BUILD;

const clone=v=>JSON.parse(JSON.stringify(v??null));
let busy=false;

function client(id){return (window.data?.clients||[]).find(x=>String(x.id)===String(id))||{}}
function avoidText(id){const c=client(id);return String(c.foods_to_avoid??c.foodsToAvoid??'').trim()}
function normalizeOptions(m){
  if(Array.isArray(m?.options)&&m.options.length)return m.options;
  if(Array.isArray(m?.foods))return[{name:'Opción 1',foods:m.foods}];
  return[{name:'Opción 1',foods:[]}];
}
function writeOptions(m,o){m.options=o;delete m.foods}
function normalizedPlan(id){
  const current=clone(window.data?.diets?.[id])||{};
  return{
    training:clone(current.training)||{calories:'',protein:'',meals:[]},
    rest:clone(current.rest)||{calories:'',protein:'',meals:[]}
  };
}
async function persist(id,next){
  if(!window.supabaseClient)throw new Error('Sin conexión con Supabase');
  const serverPlan={
    training:clone(next?.training)||{calories:'',protein:'',meals:[]},
    rest:clone(next?.rest)||{calories:'',protein:'',meals:[]}
  };
  const{data:ok,error}=await window.supabaseClient.rpc('dcc_save_diet_plan',{
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
  if(Number.isInteger(mi))window.__dccDietOpenMeal=mi;
  if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
}

window.dccDietAddFood=async function(id,type,mealIndex,optionIndex){
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
})();