/* DCC — Diet editor state fix v1: destino estable + rollback server-first */
(function(){
  'use strict';
  if(window.__dccDietEditorStateFixV1)return;
  window.__dccDietEditorStateFixV1=true;

  const clone=v=>JSON.parse(JSON.stringify(v));
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(e){}return window.supabaseClient||null};
  const toastSafe=t=>{try{if(typeof toast==='function')return toast(t);if(typeof window.toast==='function')return window.toast(t)}catch(e){}console.log(t)};
  const getDiet=(id,type)=>window.data?.diets?.[id]?.[type]||null;
  const getMeal=(id,type,mi)=>getDiet(id,type)?.meals?.[mi]||null;
  const normalizeOptions=meal=>{
    if(Array.isArray(meal?.options)&&meal.options.length)return meal.options;
    if(Array.isArray(meal?.foods))return[{name:'Opción 1',foods:meal.foods}];
    return[{name:'Opción 1',foods:[]}];
  };
  const writeOptions=(meal,options)=>{meal.options=options;delete meal.foods};

  function currentType(){return window.__dccDietType==='rest'?'rest':'training'}
  function remember(mi,oi){
    window.__dccDietOpenMeal=mi;
    window.__dccDietOptionMap=window.__dccDietOptionMap||{};
    window.__dccDietOptionMap[mi]=oi;
  }
  function render(id){if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food')}

  async function persistType(id,type){
    const diet=getDiet(id,type),database=db();
    if(!diet||!database)throw new Error('No hay dieta o conexión disponible');
    const {error}=await database.from('client_diets').upsert({
      client_id:id,
      diet_type:type,
      calories:diet.calories||'',
      protein:diet.protein||'',
      meals:Array.isArray(diet.meals)?diet.meals:[],
      updated_at:new Date().toISOString()
    },{onConflict:'client_id,diet_type'});
    if(error)throw error;
  }

  function restore(id,type,backup){
    window.data.diets=window.data.diets||{};
    window.data.diets[id]=window.data.diets[id]||{};
    window.data.diets[id][type]=backup;
  }

  window.dccDietSelectOption=function(id,mi,oi){
    const type=currentType(),meal=getMeal(id,type,mi),options=normalizeOptions(meal);
    if(!meal||!options[oi])return;
    remember(mi,oi);
    render(id);
  };

  window.dccDietToggleMeal=function(id,mi){
    window.__dccDietOpenMeal=window.__dccDietOpenMeal===mi?null:mi;
    render(id);
  };

  window.dccDietAddFood=async function(id,type,mi,oi){
    const meal=getMeal(id,type,mi);
    if(!meal){toastSafe('No se encontró la comida seleccionada');return}
    const options=normalizeOptions(meal);
    if(!options[oi])oi=0;
    remember(mi,oi);

    const name=prompt('Nombre del alimento','');
    if(name===null||!name.trim())return;
    const quantity=prompt('Cantidad','');
    if(quantity===null)return;

    const backup=clone(getDiet(id,type));
    options[oi].foods=Array.isArray(options[oi].foods)?options[oi].foods:[];
    options[oi].foods.push([name.trim(),quantity.trim()]);
    writeOptions(meal,options);

    try{
      await persistType(id,type);
      remember(mi,oi);
      render(id);
      toastSafe('Alimento añadido');
    }catch(e){
      console.error('DCC dieta — añadir alimento:',e);
      restore(id,type,backup);
      remember(mi,oi);
      render(id);
      toastSafe('No se pudo guardar el alimento');
    }
  };
  window.dccDietAddFood.__dccNativeAvoidWarning=true;

  window.dccDietEditFood=async function(id,type,mi,fi,oi){
    const meal=getMeal(id,type,mi),options=normalizeOptions(meal),food=options?.[oi]?.foods?.[fi];
    if(!meal||!food)return;
    remember(mi,oi);
    const name=prompt('Nombre del alimento',food[0]??'');
    if(name===null)return;
    const quantity=prompt('Cantidad',food[1]??'');
    if(quantity===null)return;
    const backup=clone(getDiet(id,type));
    food[0]=name.trim()||food[0];food[1]=quantity.trim();writeOptions(meal,options);
    try{await persistType(id,type);remember(mi,oi);render(id);toastSafe('Alimento actualizado')}
    catch(e){console.error('DCC dieta — editar alimento:',e);restore(id,type,backup);remember(mi,oi);render(id);toastSafe('No se pudo guardar el cambio')}
  };

  window.dccDietRemoveFood=async function(id,type,mi,fi,oi){
    const meal=getMeal(id,type,mi),options=normalizeOptions(meal);if(!meal||!options?.[oi]?.foods?.[fi])return;
    if(!confirm('¿Eliminar este alimento?'))return;
    const backup=clone(getDiet(id,type));remember(mi,oi);options[oi].foods.splice(fi,1);writeOptions(meal,options);
    try{await persistType(id,type);remember(mi,oi);render(id)}
    catch(e){console.error('DCC dieta — eliminar alimento:',e);restore(id,type,backup);remember(mi,oi);render(id);toastSafe('No se pudo eliminar el alimento')}
  };

  window.dccDietAddOption=async function(id,type,mi){
    const meal=getMeal(id,type,mi),options=normalizeOptions(meal);if(!meal||options.length>=3)return;
    const backup=clone(getDiet(id,type));const oi=options.length;options.push({name:'Opción '+(oi+1),foods:[]});writeOptions(meal,options);remember(mi,oi);
    try{await persistType(id,type);remember(mi,oi);render(id)}
    catch(e){console.error('DCC dieta — añadir opción:',e);restore(id,type,backup);remember(mi,Math.max(0,oi-1));render(id);toastSafe('No se pudo añadir la opción')}
  };

  window.dccDietRemoveOption=async function(id,type,mi,oi){
    const meal=getMeal(id,type,mi),options=normalizeOptions(meal);if(!meal||oi<1||!options[oi])return;
    const backup=clone(getDiet(id,type));options.splice(oi,1);writeOptions(meal,options);remember(mi,0);
    try{await persistType(id,type);remember(mi,0);render(id)}
    catch(e){console.error('DCC dieta — eliminar opción:',e);restore(id,type,backup);remember(mi,Math.min(oi,options.length-1));render(id);toastSafe('No se pudo eliminar la opción')}
  };

  document.addEventListener('click',e=>{
    const button=e.target.closest?.('.dcc-diet-switch button');
    if(!button)return;
    window.__dccDietOpenMeal=null;
    window.__dccDietOptionMap={};
  },true);
})();
