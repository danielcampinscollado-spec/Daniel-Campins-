/* DCC — editor de alimentación con borrador real + guardado explícito */
(function(){
  'use strict';
  const BUILD='20260924-diet-editor-save-exit-v7-owned-pane';
  if(window.__dccDietEditorSaveExit===BUILD)return;
  window.__dccDietEditorSaveExit=BUILD;

  let editingClientId=null;
  let originalPlan=null;
  let pendingTransition=null;
  let nativeEditor=null;

  const clone=v=>JSON.parse(JSON.stringify(v??null));
  const db=()=>{try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null};
  const notify=msg=>{try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)};
  const meal=(id,type,mi)=>window.data?.diets?.[id]?.[type]?.meals?.[mi]||null;
  const options=m=>Array.isArray(m?.options)&&m.options.length?m.options:(Array.isArray(m?.foods)?[{name:'Opción 1',foods:m.foods}]:[{name:'Opción 1',foods:[]}]);
  const writeOptions=(m,o)=>{m.options=o;delete m.foods};
  const remember=(mi,oi)=>{window.__dccDietOpenMeal=mi;window.__dccDietOptionMap=window.__dccDietOptionMap||{};window.__dccDietOptionMap[mi]=oi};
  const blankPlan=()=>({training:{calories:'',protein:'',meals:[]},rest:{calories:'',protein:'',meals:[]}});

  function chainHas(fn,marker){
    let cur=fn,depth=0;
    while(typeof cur==='function'&&depth++<12){if(cur[marker])return true;cur=cur.__base}
    return false;
  }
  function deepestBase(fn){
    let cur=fn,last=fn,depth=0;
    while(typeof cur==='function'&&depth++<12){last=cur;if(typeof cur.__base!=='function')break;cur=cur.__base}
    return last;
  }
  function pane(){return document.getElementById('dcc-coach-client-pane')}
  function isEditing(id){return editingClientId!==null&&String(editingClientId)===String(id)}
  function renderDraft(id){if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food')}

  async function refreshHistory(id){
    const database=db();if(!database)return;
    const {data:rows,error}=await database.from('client_diet_history').select('id,label,archived_at,plan').eq('client_id',String(id)).order('archived_at',{ascending:false}).limit(30);
    if(error)throw error;
    window.data.dietHistory=window.data.dietHistory||{};
    window.data.dietHistory[String(id)]=(rows||[]).map(x=>({id:x.id,label:x.label,archivedAt:x.archived_at,plan:x.plan}));
  }

  async function persistPlan(id){
    const database=db();
    if(!database)throw new Error('No hay conexión con Supabase');
    const sid=String(id);
    const plan=clone(window.data?.diets?.[sid])||blankPlan();

    if(pendingTransition?.archiveLabel){
      const historyId='diet-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
      const {data:ok,error}=await database.rpc('dcc_transition_diet_plan',{
        p_client_id:sid,
        p_new_plan:plan,
        p_archive_label:pendingTransition.archiveLabel,
        p_history_id:historyId
      });
      if(error)throw error;
      if(ok!==true)throw new Error('El servidor no confirmó el cambio de plan');
      await refreshHistory(sid);
    }else{
      const {data:ok,error}=await database.rpc('dcc_save_diet_plan',{
        p_client_id:sid,
        p_training:plan.training||{},
        p_rest:plan.rest||{}
      });
      if(error)throw error;
      if(ok!==true)throw new Error('El servidor no confirmó el guardado del plan');
    }

    try{if(typeof window.saveData==='function')window.saveData()}catch(_){}
    return true;
  }

  function beginEdit(id,originalOverride,transition=null){
    const sid=String(id);
    originalPlan=clone(arguments.length>=2?originalOverride:window.data?.diets?.[sid]);
    editingClientId=sid;
    pendingTransition=transition;
  }

  function clearEditState(){
    editingClientId=null;
    originalPlan=null;
    pendingTransition=null;
    window.__dccDietOpenMeal=null;
    window.__dccDietOptionMap={};
  }

  function cancelEdit(id){
    const sid=String(id);
    if(isEditing(sid)){
      window.data.diets=window.data.diets||{};
      if(originalPlan===null)delete window.data.diets[sid];
      else window.data.diets[sid]=clone(originalPlan);
    }
    clearEditState();
    if(typeof window.dccNutritionV2Home==='function')window.dccNutritionV2Home(sid);
    else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(sid,'food');
  }

  function addEditorHeader(id){
    if(!isEditing(id))return false;
    const p=pane();if(!p)return false;
    let top=p.querySelector('.dcc-n2-editorbar');
    if(!top){top=document.createElement('div');top.className='dcc-n2-editorbar';p.prepend(top)}
    if(top.dataset.dccDraftV6!=='1'){
      top.dataset.dccDraftV6='1';
      top.innerHTML='<div class="dcc-n2-backrow" style="margin:0"><button type="button" class="dcc-n2-back dcc-diet-cancel-edit">←</button><div><h2>Editar plan alimenticio</h2><p>Los cambios son un borrador hasta que pulses Guardar plan.</p></div></div>';
      top.querySelector('.dcc-diet-cancel-edit')?.addEventListener('click',()=>{
        if(confirm('¿Salir sin guardar los cambios del plan?'))cancelEdit(id);
      });
    }
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
        clearEditState();
        notify('Plan guardado correctamente');
        if(typeof window.dccNutritionV2Home==='function')await window.dccNutritionV2Home(id);
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

  async function loadServerPlanIfAvailable(id){
    if(typeof window.dccLoadDietPlanFromSupabase==='function')await window.dccLoadDietPlanFromSupabase(id);
  }

  async function startDerivedDraft(id,mode){
    const sid=String(id);
    try{await loadServerPlanIfAvailable(sid)}catch(error){
      console.error('DCC dieta — cargar antes de crear borrador:',error);
      alert('No se pudo cargar el plan actual del servidor. No se abrirá el editor para evitar perder datos.');
      return;
    }
    const before=clone(window.data?.diets?.[sid]);
    if(mode!=='blank'&&before===null){notify('No hay un plan actual para usar como base');return}

    let draft;
    let archiveLabel=null;
    if(mode==='blank'){
      draft=blankPlan();
      if(before!==null)archiveLabel='Plan anterior · antes de crear desde cero';
    }else if(mode==='renew'){
      draft=clone(before);
      archiveLabel='Plan anterior · renovación';
    }else{
      draft=clone(before);
      archiveLabel='Plan anterior · antes de duplicar';
    }

    window.data.diets=window.data.diets||{};
    window.data.diets[sid]=draft;
    beginEdit(sid,before,{mode,archiveLabel});
    window.__dccDietOpenMeal=null;
    window.__dccDietOptionMap={};

    const editor=nativeEditor||deepestBase(window.dccNutritionV2Edit);
    if(typeof editor!=='function')throw new Error('No se encontró el editor de alimentación');
    editor.call(window,sid);
    restoreEditor(sid);
  }

  function installDraftActions(){
    const addFood=window.dccDietAddFood;
    if(typeof addFood==='function'&&!chainHas(addFood,'__dccDraftV6')){
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
      fn.__dccDraftV6=true;fn.__base=base;window.dccDietAddFood=fn;
    }

    const editFood=window.dccDietEditFood;
    if(typeof editFood==='function'&&!chainHas(editFood,'__dccDraftV6')){
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
      fn.__dccDraftV6=true;fn.__base=base;window.dccDietEditFood=fn;
    }

    const removeFood=window.dccDietRemoveFood;
    if(typeof removeFood==='function'&&!chainHas(removeFood,'__dccDraftV6')){
      const base=removeFood;
      const fn=async function(id,type,mi,fi,oi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m);if(!os?.[oi]?.foods?.[fi])return;
        if(!confirm('¿Eliminar este alimento?'))return;
        os[oi].foods.splice(fi,1);writeOptions(m,os);remember(mi,oi);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV6=true;fn.__base=base;window.dccDietRemoveFood=fn;
    }

    const addOption=window.dccDietAddOption;
    if(typeof addOption==='function'&&!chainHas(addOption,'__dccDraftV6')){
      const base=addOption;
      const fn=async function(id,type,mi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m);if(!m||os.length>=3)return;
        const oi=os.length;os.push({name:'Opción '+(oi+1),foods:[]});writeOptions(m,os);
        remember(mi,oi);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV6=true;fn.__base=base;window.dccDietAddOption=fn;
    }

    const removeOption=window.dccDietRemoveOption;
    if(typeof removeOption==='function'&&!chainHas(removeOption,'__dccDraftV6')){
      const base=removeOption;
      const fn=async function(id,type,mi,oi){
        if(!isEditing(id))return base.apply(this,arguments);
        const m=meal(id,type,mi),os=options(m);if(!m||oi<1||!os[oi])return;
        if(!confirm('¿Eliminar esta opción?'))return;
        os.splice(oi,1);writeOptions(m,os);remember(mi,0);renderDraft(id);restoreEditor(String(id));
      };
      fn.__dccDraftV6=true;fn.__base=base;window.dccDietRemoveOption=fn;
    }


  }

  function install(){
    const edit=window.dccNutritionV2Edit;
    if(typeof edit==='function'){
      nativeEditor=nativeEditor||deepestBase(edit);
      if(!chainHas(edit,'__dccDraftV6')){
        const base=edit;
        const fn=async function(id){
          const result=await base.apply(this,arguments);
          beginEdit(id);
          restoreEditor(String(id));
          return result;
        };
        fn.__dccDraftV6=true;fn.__base=base;window.dccNutritionV2Edit=fn;
      }
    }

    if(typeof window.dccNutritionV2Blank==='function'&&!chainHas(window.dccNutritionV2Blank,'__dccDraftV6')){
      const old=window.dccNutritionV2Blank;
      const fn=function(id){const sid=String(id),p=window.data?.diets?.[sid],hasAny=['training','rest'].some(t=>Array.isArray(p?.[t]?.meals)&&p[t].meals.length);if(!hasAny&&typeof window.dccNutritionMealSetupStart==='function'){clearEditState();return Promise.resolve(window.dccNutritionMealSetupStart(sid))}return startDerivedDraft(sid,'blank')};
      fn.__dccDraftV6=true;fn.__base=old;window.dccNutritionV2Blank=fn;
    }
    if(typeof window.dccNutritionV2Renew==='function'&&!chainHas(window.dccNutritionV2Renew,'__dccDraftV6')){
      const old=window.dccNutritionV2Renew;
      const fn=function(id){return startDerivedDraft(id,'renew')};
      fn.__dccDraftV6=true;fn.__base=old;window.dccNutritionV2Renew=fn;
    }
    if(typeof window.dccNutritionV2Duplicate==='function'&&!chainHas(window.dccNutritionV2Duplicate,'__dccDraftV6')){
      const old=window.dccNutritionV2Duplicate;
      const fn=function(id){return startDerivedDraft(id,'duplicate')};
      fn.__dccDraftV6=true;fn.__base=old;window.dccNutritionV2Duplicate=fn;
    }

    const admin=window.dccClientAdmin;
    if(typeof admin==='function'&&!chainHas(admin,'__dccDraftV6')){
      const base=admin;
      const fn=function(id,tab){const result=base.apply(this,arguments);if(isEditing(id)&&String(tab||'')==='food')restoreEditor(String(id));return result};
      fn.__dccDraftV6=true;fn.__base=base;window.dccClientAdmin=fn;
    }

    installDraftActions();
  }

  function keepInstalled(){install();if(editingClientId!==null)restoreEditor(String(editingClientId))}

  install();
  document.addEventListener('DOMContentLoaded',keepInstalled,{once:true});
  window.addEventListener('pageshow',keepInstalled);
})();
