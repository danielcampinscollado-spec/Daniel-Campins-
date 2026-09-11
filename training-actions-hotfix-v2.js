/* DCC — puente de runtime estable
   Se conserva este nombre de archivo porque index.html ya lo carga.
   NO sobrescribe startWorkout, showClient ni ninguna navegación.
   Solo expone de forma segura el estado global léxico a los módulos externos.
*/
(function(){
  'use strict';
  if(window.__dccStableRuntimeBridgeV1)return;
  window.__dccStableRuntimeBridgeV1=true;

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

  window.__dccRuntimeBridgeReady=true;
  try{window.dispatchEvent(new CustomEvent('dcc:runtime-bridge-ready'));}catch(_){}
})();
