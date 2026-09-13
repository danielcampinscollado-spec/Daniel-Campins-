/* DCC — cierre explícito y persistente del editor de alimentación */
(function(){
  'use strict';
  const BUILD='20260913-diet-editor-save-exit-v2';
  if(window.__dccDietEditorSaveExit===BUILD)return;
  window.__dccDietEditorSaveExit=BUILD;

  let editingClientId=null;
  let installTimer=null;

  function db(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient}catch(_){}return window.supabaseClient||null}
  function clone(v){return JSON.parse(JSON.stringify(v??null))}
  function notify(msg){try{if(typeof toast==='function')return toast(msg);if(typeof window.toast==='function')return window.toast(msg)}catch(_){}alert(msg)}

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

  function addSaveButton(id){
    if(!id||String(editingClientId)!==String(id))return false;
    const wrap=document.querySelector('#coach-main .dcc-ca-wrap');
    const pane=wrap?.lastElementChild;
    if(!pane)return false;
    if(pane.querySelector('.dcc-n2-save-plan-final'))return true;

    const button=document.createElement('button');
    button.type='button';
    button.className='dcc-n2-btn primary dcc-n2-save-plan-final';
    button.style.marginTop='14px';
    button.innerHTML='<span class="i">✓</span><span>Guardar plan<small>Confirma los cambios y vuelve al resumen</small></span><span class="dcc-n2-arrow">›</span>';
    button.addEventListener('click',async()=>{
      if(button.disabled)return;
      const old=button.innerHTML;
      button.disabled=true;
      button.innerHTML='<span class="i">…</span><span>Guardando plan<small>Confirmando cambios en el servidor</small></span><span class="dcc-n2-arrow">›</span>';
      try{
        await persistPlan(id);
        editingClientId=null;
        notify('Plan guardado correctamente');
        if(typeof window.dccNutritionV2Home==='function')window.dccNutritionV2Home(id);
        else if(typeof window.dccClientAdmin==='function')window.dccClientAdmin(id,'food');
      }catch(error){
        console.error('DCC guardar plan final:',error);
        alert('No se pudo confirmar el plan. Permaneces en edición para no perder ningún cambio.\n\n'+(error?.message||'Error del servidor'));
        button.disabled=false;
        button.innerHTML=old;
      }
    });
    pane.appendChild(button);
    return true;
  }

  function scheduleButton(id){
    requestAnimationFrame(()=>{
      addSaveButton(id);
      setTimeout(()=>addSaveButton(id),60);
    });
  }

  function install(){
    const edit=window.dccNutritionV2Edit;
    if(typeof edit==='function'&&!edit.__dccSaveExitV2){
      const wrappedEdit=function(id){
        editingClientId=String(id);
        const result=edit.apply(this,arguments);
        scheduleButton(String(id));
        return result;
      };
      wrappedEdit.__dccSaveExitV2=true;
      wrappedEdit.__base=edit;
      window.dccNutritionV2Edit=wrappedEdit;
    }

    const home=window.dccNutritionV2Home;
    if(typeof home==='function'&&!home.__dccSaveExitV2){
      const wrappedHome=function(id){
        editingClientId=null;
        return home.apply(this,arguments);
      };
      wrappedHome.__dccSaveExitV2=true;
      wrappedHome.__base=home;
      window.dccNutritionV2Home=wrappedHome;
    }

    const admin=window.dccClientAdmin;
    if(typeof admin==='function'&&!admin.__dccSaveExitV2){
      const wrappedAdmin=function(id,tab){
        const result=admin.apply(this,arguments);
        if(editingClientId!==null&&String(id)===String(editingClientId)&&String(tab||'')==='food')scheduleButton(String(id));
        return result;
      };
      wrappedAdmin.__dccSaveExitV2=true;
      wrappedAdmin.__base=admin;
      window.dccClientAdmin=wrappedAdmin;
    }

    return typeof window.dccNutritionV2Edit==='function'&&typeof window.dccClientAdmin==='function';
  }

  function keepInstalled(){
    install();
    if(editingClientId!==null)addSaveButton(String(editingClientId));
  }

  install();
  if(!installTimer)installTimer=setInterval(()=>{
    keepInstalled();
    if(window.dccNutritionV2Edit?.__dccSaveExitV2&&window.dccClientAdmin?.__dccSaveExitV2){clearInterval(installTimer);installTimer=null}
  },120);
  document.addEventListener('DOMContentLoaded',keepInstalled,{once:true});
  window.addEventListener('pageshow',keepInstalled);
})();