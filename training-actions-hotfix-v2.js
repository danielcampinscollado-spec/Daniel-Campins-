/* DCC — puente de runtime estable + refinamientos cliente
   Se conserva este nombre de archivo porque index.html ya lo carga.
   NO sobrescribe startWorkout, showClient ni ninguna navegación.
   Expone el estado global léxico y aplica solo ajustes visuales/lectura seguros.
*/
(function(){
  'use strict';
  if(window.__dccStableRuntimeBridgeV2)return;
  window.__dccStableRuntimeBridgeV2=true;

  function bridgeAccessor(name,getter,setter){
    try{
      const descriptor=Object.getOwnPropertyDescriptor(window,name);
      if(descriptor && descriptor.configurable===false)return;
      Object.defineProperty(window,name,{
        configurable:true,
        enumerable:true,
        get:getter,
        set:setter||function(){}
      });
    }catch(error){
      console.warn('DCC runtime bridge:',name,error);
    }
  }

  /* `data` está declarado con let en index.html, por eso no nace como window.data. */
  try{
    if(typeof data!=='undefined'){
      bridgeAccessor('data',()=>data,value=>{data=value;});
    }
  }catch(error){console.warn('DCC runtime bridge data:',error);}

  /* Mantener currentClientId sincronizado en ambas formas de acceso. */
  try{
    if(typeof currentClientId!=='undefined'){
      bridgeAccessor('currentClientId',()=>currentClientId,value=>{currentClientId=value;});
    }
  }catch(error){console.warn('DCC runtime bridge client:',error);}

  /* Supabase está declarado con const: solo exponemos lectura, nunca lo reemplazamos. */
  try{
    if(typeof supabaseClient!=='undefined' && supabaseClient){
      bridgeAccessor('supabaseClient',()=>supabaseClient);
    }
  }catch(error){console.warn('DCC runtime bridge supabase:',error);}

  function installClientRefinements(){
    if(document.getElementById('dcc-client-refinements-20260911'))return;
    const style=document.createElement('style');
    style.id='dcc-client-refinements-20260911';
    style.textContent=`
      /* Inicio: el estado vacío mantiene la misma retícula que las filas de tareas. */
      #client-main .dch-task-empty{
        min-height:64px!important;
        grid-template-columns:38px minmax(0,1fr)!important;
        gap:11px!important;
        padding:10px 15px!important;
        align-items:center!important;
      }
      #client-main .dch-task-empty .dch-iconbox{
        width:38px!important;
        height:38px!important;
      }

      /* Entrenamiento: selector preparado visualmente para hasta siete días. */
      #client-main .dct3-days{
        grid-template-columns:repeat(7,minmax(0,1fr))!important;
        gap:4px!important;
        margin-bottom:11px!important;
      }
      #client-main .dct3-day{
        height:44px!important;
        min-height:44px!important;
        padding:0 1px!important;
        border-radius:11px!important;
        gap:2px!important;
      }
      #client-main .dct3-day span{
        font-size:6px!important;
        line-height:1!important;
        letter-spacing:.8px!important;
      }
      #client-main .dct3-day b{
        font-size:14px!important;
        line-height:1!important;
      }

      /* Nunca volver a mostrar una segunda tarjeta de consejo sobre la sesión. */
      #client-main .dcc-active-exercise-advice,
      #client-main .dcc-exercise-client-advice{
        display:none!important;
      }

      @media(max-width:390px){
        #client-main .dch-task-empty{
          min-height:60px!important;
          grid-template-columns:36px minmax(0,1fr)!important;
          gap:10px!important;
          padding:9px 14px!important;
        }
        #client-main .dch-task-empty .dch-iconbox{
          width:36px!important;
          height:36px!important;
        }
        #client-main .dct3-days{gap:3px!important}
        #client-main .dct3-day{
          height:41px!important;
          min-height:41px!important;
          border-radius:10px!important;
        }
        #client-main .dct3-day span{font-size:5.5px!important;letter-spacing:.65px!important}
        #client-main .dct3-day b{font-size:13px!important}
      }
    `;
    document.head.appendChild(style);
  }

  /*
    El panel desplegable nativo de la sesión es el único lugar donde se muestra
    el consejo. Si el módulo de consejos ya está disponible, sincronizamos aquí
    el texto específico del ejercicio activo como protección adicional.
  */
  let adviceQueued=false;
  function syncWorkoutAdvice(){
    adviceQueued=false;
    try{
      const workout=window.activeWorkout;
      if(!workout)return;
      const exercise=workout.exercises?.[Number(workout.currentExercise)||0];
      const body=document.querySelector('#client-main .dwa3-tip .dwa3-tip-body');
      const adviceFn=window.dccExerciseAdvice;
      if(exercise&&body&&typeof adviceFn==='function'){
        const advice=String(adviceFn(exercise)||'').trim();
        if(advice&&body.textContent!==advice)body.textContent=advice;
      }
    }catch(error){
      console.warn('DCC advice sync:',error);
    }
  }

  function scheduleAdviceSync(){
    if(adviceQueued)return;
    adviceQueued=true;
    requestAnimationFrame(syncWorkoutAdvice);
  }

  installClientRefinements();
  const main=document.getElementById('client-main');
  if(main&&!main.__dccClientRefinementsObserver){
    const observer=new MutationObserver(scheduleAdviceSync);
    observer.observe(main,{childList:true,subtree:true});
    main.__dccClientRefinementsObserver=observer;
  }
  window.addEventListener('dcc:exercise-library-ready',scheduleAdviceSync);
  document.addEventListener('DOMContentLoaded',()=>{
    installClientRefinements();
    scheduleAdviceSync();
  });

  window.__dccRuntimeBridgeReady=true;
  try{window.dispatchEvent(new CustomEvent('dcc:runtime-bridge-ready'));}catch(_){}
})();