/* DCC — bridge estable del panel entrenador
   Carga una única cadena de UI y una única capa visual. */
(function(){
  'use strict';

  const BUILD='20260912-coach-stable-v3';
  if(window.__dccLegacyCoachBridge===BUILD)return;
  window.__dccLegacyCoachBridge=BUILD;

  function add(src,key,onload){
    const base=src.split('?')[0].replace('./','');
    const existing=[...document.scripts].find(s=>(s.src||'').includes(base));
    if(existing){
      if(onload){
        if(existing.dataset.dccLoaded==='1')onload();
        else existing.addEventListener('load',onload,{once:true});
      }
      return existing;
    }
    const x=document.createElement('script');
    x.src=src;
    x.async=false;
    x.dataset[key]=BUILD;
    x.onload=()=>{x.dataset.dccLoaded='1';onload&&onload()};
    x.onerror=()=>console.error('DCC coach stable: no se pudo cargar '+base);
    (document.head||document.documentElement).appendChild(x);
    return x;
  }

  function loadStability(done){
    if(window.__dccProductionStabilityV1){
      done&&done();
      return;
    }
    add('./dcc-production-stability-v1.js?v=20260912-1','dccProductionStability',done);
  }

  function loadTheme(){
    add('./coach-light-stable-v1.js?v=20260912-1','dccCoachStableTheme');
  }

  function loadPanelState(){
    add('./coach-panel-state-v10.js?v=20260910-1918','dccPanelState');
  }

  function loadCoachUI(){
    add('./coach-ui-v11.js?v=20260910-1932','dccCoachUi');
  }

  function installAddExerciseCancelGuard(){
    const original=window.addExercise;
    if(typeof original!=='function'||original.__dccCancelGuard)return;

    async function guardedAddExercise(){
      const nativePrompt=window.prompt;
      window.prompt=function(message,defaultValue){
        const value=nativePrompt.call(window,message,defaultValue);
        if(value===null&&/enlace al v[ií]deo/i.test(String(message||'')))return '';
        return value;
      };
      try{
        return await original.apply(this,arguments);
      }finally{
        window.prompt=nativePrompt;
      }
    }
    guardedAddExercise.__dccCancelGuard=true;
    guardedAddExercise.__dccOriginal=original;
    window.addExercise=guardedAddExercise;
  }

  function loadCoachLayers(){
    installAddExerciseCancelGuard();
    loadTheme();
    loadPanelState();

    const current=[...document.scripts].find(s=>/coach-premium-v8\.js(?:\?|$)/.test(s.src||''));
    if(current){
      loadCoachUI();
      return;
    }

    add('./coach-premium-v8.js?v=20260910-1817','dccCoachLoader',()=>{
      loadPanelState();
      loadCoachUI();
      loadTheme();
      installAddExerciseCancelGuard();
    });
  }

  function ensureCoach(){
    installAddExerciseCancelGuard();
    loadStability(loadCoachLayers);
  }

  ensureCoach();
  document.addEventListener('DOMContentLoaded',ensureCoach,{once:true});
  window.addEventListener('load',()=>{installAddExerciseCancelGuard();ensureCoach()},{once:true});
  window.addEventListener('pageshow',()=>{installAddExerciseCancelGuard();ensureCoach()});
})();
