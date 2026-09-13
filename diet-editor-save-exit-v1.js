/* DCC — cierre explícito del editor de alimentación */
(function(){
  'use strict';
  const BUILD='20260913-diet-editor-save-exit-v1';
  if(window.__dccDietEditorSaveExit===BUILD)return;
  window.__dccDietEditorSaveExit=BUILD;

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
    const wrap=document.querySelector('#coach-main .dcc-ca-wrap');
    const pane=wrap?.lastElementChild;
    if(!pane)return;
    if(pane.querySelector('.dcc-n2-save-plan-final'))return;

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
        notify('Plan guardado correctamente');
        if(typeof window.dccNutritionV2Home==='function')window.dccNutritionV2Home(id);
      }catch(error){
        console.error('DCC guardar plan final:',error);
        alert('No se pudo confirmar el plan. Permaneces en edición para no perder ningún cambio.\n\n'+(error?.message||'Error del servidor'));
        button.disabled=false;
        button.innerHTML=old;
      }
    });
    pane.appendChild(button);
  }

  function install(attempt=0){
    const base=window.dccNutritionV2Edit;
    if(typeof base!=='function'){
      if(attempt<30)setTimeout(()=>install(attempt+1),100);
      return false;
    }
    if(base.__dccSaveExitV1)return true;
    const wrapped=function(id){
      const result=base.apply(this,arguments);
      requestAnimationFrame(()=>addSaveButton(String(id)));
      return result;
    };
    wrapped.__dccSaveExitV1=true;
    wrapped.__base=base;
    window.dccNutritionV2Edit=wrapped;
    return true;
  }

  install();
  document.addEventListener('DOMContentLoaded',()=>install(),{once:true});
  window.addEventListener('pageshow',()=>install());
})();
