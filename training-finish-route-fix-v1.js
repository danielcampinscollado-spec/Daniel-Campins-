/* DCC — entrenamiento: compatibilidad de ruta al finalizar sesión */
(function(){
  'use strict';
  if(window.__dccTrainingFinishRouteFixV1)return;
  window.__dccTrainingFinishRouteFixV1=true;

  function install(){
    const base=window.showClient;
    if(typeof base!=='function'||base.__dccTrainingFinishRouteFixV1)return false;

    const wrapped=function(screen){
      const target=screen==='profile'?'home':screen;
      const args=Array.from(arguments);
      args[0]=target;
      return base.apply(this,args);
    };
    wrapped.__dccTrainingFinishRouteFixV1=true;
    wrapped.__base=base;
    window.showClient=wrapped;
    return true;
  }

  if(!install()){
    document.addEventListener('DOMContentLoaded',install,{once:true});
  }
})();
