/* DCC — editor de alimentación con borrador + guardado explícito */
(function(){
  'use strict';
  const BUILD='20260913-diet-editor-save-exit-v4';
  if(window.__dccDietEditorSaveExit===BUILD)return;
  window.__dccDietEditorSaveExit=BUILD;

  let editingClientId=null;
  let originalPlan=null;
  let installTimer=null;

  const clone=v=>JSON.parse(JSON.stringify(v??null));
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};
  const currentType=()=>window.__dccDietType==='rest'?'rest':'training';
  const meal=(id,type,mi)=>window.data?.diets?.[id]?.[type]?.meals?.[mi]||null;
  const options=m=>Array.isArray(m?.options)&&m.options.length?m.options:(Array.isArray(m?.foods)?[{name:'Opción 1',foods:m.foods}]:[{name:'Opción 1',foods:[]}]);
  const writeOptions=(m,o)=>{m.options=o;delete m.foods};
  const remember=(mi,oi)=>{window.__dccDietOpenMeal=mi;window.__dccDietOptionMap=window.__dccDietOptionMap||{};window.__dccDietOptionMap[mi]=oi};

  function pane(){const wrap=document.querySelector('#coach-main .dcc-ca-wrap');return wrap?.lastElementChild||null}
  function isEditing(id){return editingClientId!==null&&String(editingClientId)===String(id)}
  function renderDraft(id){if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food')}

  async function persistPlan(id){
    const database=db();
    if(!database)throw new Error('No hay conexión con Supabase');
    const p=clone(window.data?.diets?.[id])||{training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}};
    const {data:ok,error}=await database.rpc('dcc_save_diet_plan',{
      p_client_id:String(id),
      p_training:p.training||{},
      p_rest:p.rest||{}
    });
    if(error)throw error;
    if(ok!==true)throw new Error('El servidor no confirmó el guardado del plan');
    try{if(typeof window.saveData==='function')window.saveData()}catch(_){}
    return true;
  }

  function beginEdit(id){
    const sid=String(id);
    if(!isEditing(sid))originalPlan=clone(window.data?.diets?.[sid]);
    editingClientId=sid;
  }

  function cancelEdit(id){
    const sid=String(id);
    if(isEditing(sid)){
      window.data.diets=window.data.diets||{};
      if(originalPlan===null)delete window.data.diets[sid];
      else window.data.diets[sid]=clone(originalPlan);
    }
    editingClientId=null;
    originalPlan=null;
    window.__dccDietOpenMeal=null;
    window.__dccDietOptionMap={};
    if(typeof window.dccNutritionV2Home==='function')window.dccNutritionV2Home(sid);
    else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(sid,'food');
  }

  function addEditorHeader(id){
    if(!isEditing(id))return false;
    const p=pane();if(!p)return false;
    if(p.querySelector('.dcc-n2-editorbar'))return true;
    const top=document.createElement('div');
    top.className='dcc-n2-editorbar';
    top.innerHTML='<div class="dcc-n2-backrow" style="margin:0"><button type="button" class="dcc-n2-back dcc-diet-cancel-edit">←</button><div><h2>Editar plan alimenticio</h2><p>Los cambios son un borrador hasta que pulses Guardar plan.</p></div></div>';
    top.querySelector('.dcc-diet-cancel-edit')?.addEventListener('click',()=>{
      if(confirm('¿Salir sin guardar los cambios del plan?'))cancelEdit(id);
    });
    p.prepend(top);
    return true;
  }

  function addSaveButton(id){
    if(!isEditing(id))return false;
    const p=pane();if(!p)return false;
    if(p.querySelector('.dcc-n2-save-plan-final'))return true;
    const button=document.createElement('button');
    button.type='button';
    button.className='dcc-n2-btn primary dcc-n2-save-plan-final';
    button.style.marginTop='14px';
    button.innerHTML='<span class="i">✓</span><span>Guardar plan<small>Guarda todos los cambios y vuelve al resumen</small></span><span class="dcc-n2-arrow">›</span>';
    button.addEventListener('click',async()=>{
      if(button.disabled)return;
      const old=button.innerHTML;
      button.disabled=true;
      button.innerHTML='<span class="i">…</span><span>Guardando plan<small>Confirmando el plan completo en el servidor</small></span><span class="dcc-n2-arrow">›</span>';
      try{
        await persistPlan(id);
        editingClientId=null;
        originalPlan=null;
        window.__dccDietOpenMeal=null;
        window.__dccDietOptionMap={};
        notify('Plan guardado correctamente');
        if(typeof window.dccNutritionV2Home==='function')window.dccNutritionV2Home(id);
        else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      }catch(error){
        console.error('DCC guardar plan final:',error);
        alert('No se pudo guardar el plan. El borrador sigue abierto y no se ha perdido ningún cambio.\n\n'+(error?.message||'Error del servidor'));
        button.disabled=false;
        button.innerHTML=old;
      }
    });
    p.appendChild(button);
    return true;
  }

  function restoreEditor(id){
    if(!isEditing(id))return;
    requestAnimationFrame(()=>{
      addEditorHeader(id);addSaveButton(id);
      setTimeout(()=>{addEditorHeader(id);addSaveButton(id)},50);
    });
  }

  function installDraftActions(){
    const addFood=window.dccDietAddFood;
    if(typeof addFood==='function'&&!addFood.__dccDraftV4){
      const base=addFood;
      const fn=async function(id,type,mi,oi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi);if(!m)return;
        const os=options(m);if(!os[oi])oi=0;remember(mi,oi);
        const c=(window.data?.clients||[]).find(x=>String(x.id)===String(id));
        const avoid=String(c?.foods_to_avoid??c?.foodsToAvoid??'').trim();
        if(avoid)alert('Aviso del cliente\nNo incluir: '+avoid+'.');
        const name=prompt('Nombre del alimento','');if(name===null||!name.trim())return;
        const quantity=prompt('Cantidad','');if(quantity===null)return;
        os[oi].foods=Array.isArray(os[oi].foods)?os[oi].foods:[];
        os[oi].foods.push([name.trim(),quantity.trim()]);
        writeOptions(m,os);remember(mi,oi);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV4=true;fn.__base=base;window.dccDietAddFood=fn;
    }

    const editFood=window.dccDietEditFood;
    if(typeof editFood==='function'&&!editFood.__dccDraftV4){
      const base=editFood;
      const fn=async function(id,type,mi,fi,oi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m),food=os?.[oi]?.foods?.[fi];if(!food)return;
        remember(mi,oi);
        const name=prompt('Nombre del alimento',food[0]??'');if(name===null)return;
        const quantity=prompt('Cantidad',food[1]??'');if(quantity===null)return;
        food[0]=name.trim()||food[0];food[1]=quantity.trim();writeOptions(m,os);
        remember(mi,oi);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV4=true;fn.__base=base;window.dccDietEditFood=fn;
    }

    const removeFood=window.dccDietRemoveFood;
    if(typeof removeFood==='function'&&!removeFood.__dccDraftV4){
      const base=removeFood;
      const fn=async function(id,type,mi,fi,oi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m);if(!os?.[oi]?.foods?.[fi])return;
        if(!confirm('¿Eliminar este alimento?'))return;
        os[oi].foods.splice(fi,1);writeOptions(m,os);remember(mi,oi);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV4=true;fn.__base=base;window.dccDietRemoveFood=fn;
    }

    const addOption=window.dccDietAddOption;
    if(typeof addOption==='function'&&!addOption.__dccDraftV4){
      const base=addOption;
      const fn=async function(id,type,mi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m);if(!m||os.length>=3)return;
        const oi=os.length;os.push({name:'Opción '+(oi+1),foods:[]});writeOptions(m,os);
        remember(mi,oi);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV4=true;fn.__base=base;window.dccDietAddOption=fn;
    }

    const removeOption=window.dccDietRemoveOption;
    if(typeof removeOption==='function'&&!removeOption.__dccDraftV4){
      const base=removeOption;
      const fn=async function(id,type,mi,oi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m);if(!m||oi<1||!os[oi])return;
        if(!confirm('¿Eliminar esta opción?'))return;
        os.splice(oi,1);writeOptions(m,os);remember(mi,0);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV4=true;fn.__base=base;window.dccDietRemoveOption=fn;
    }

    const addMeal=window.dccDietAddMeal;
    if(typeof addMeal==='function'&&!addMeal.__dccDraftV4){
      const base=addMeal;
      const fn=async function(id,type){
        if(!isEditing(id))return base.apply(this,arguments);
        const diet=window.data?.diets?.[id]?.[type];if(!diet)return;
        const name=prompt('Nombre de la comida','');if(name===null||!name.trim())return;
        diet.meals=Array.isArray(diet.meals)?diet.meals:[];
        const mi=diet.meals.length;
        diet.meals.push({name:name.trim(),options:[{name:'Opción 1',foods:[]}]});
        remember(mi,0);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV4=true;fn.__base=base;window.dccDietAddMeal=fn;
    }
  }

  function install(){
    const edit=window.dccNutritionV2Edit;
    if(typeof edit==='function'&&!edit.__dccDraftV4){
      const base=edit;
      const fn=function(id){beginEdit(id);const result=base.apply(this,arguments);restoreEditor(String(id));return result};
      fn.__dccDraftV4=true;fn.__base=base;window.dccNutritionV2Edit=fn;
    }

    ['dccNutritionV2Blank','dccNutritionV2Renew','dccNutritionV2Duplicate'].forEach(name=>{
      const base=window[name];
      if(typeof base!=='function'||base.__dccDraftV4)return;
      const fn=async function(id){beginEdit(id);try{return await base.apply(this,arguments)}finally{restoreEditor(String(id))}};
      fn.__dccDraftV4=true;fn.__base=base;window[name]=fn;
    });

    const admin=window.dccClientAdmin;
    if(typeof admin==='function'&&!admin.__dccDraftV4){
      const base=admin;
      const fn=function(id,tab){const result=base.apply(this,arguments);if(isEditing(id)&&String(tab||'')==='food')restoreEditor(String(id));return result};
      fn.__dccDraftV4=true;fn.__base=base;window.dccClientAdmin=fn;
    }

    installDraftActions();
  }

  function keepInstalled(){install();if(editingClientId!==null)restoreEditor(String(editingClientId))}

  install();
  installTimer=setInterval(()=>{
    keepInstalled();
    if(window.dccNutritionV2Edit?.__dccDraftV4&&window.dccClientAdmin?.__dccDraftV4&&window.dccDietAddFood?.__dccDraftV4){clearInterval(installTimer);installTimer=null}
  },120);
  document.addEventListener('DOMContentLoaded',keepInstalled,{once:true});
  window.addEventListener('pageshow',keepInstalled);
})();