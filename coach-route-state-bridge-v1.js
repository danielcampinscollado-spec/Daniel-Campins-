/* DCC — estado único de navegación del entrenador, sin doble render */
(function(){
  'use strict';
  const BUILD='20260915-coach-route-state-bridge-v3';
  if(window.__dccCoachRouteStateBridge===BUILD)return;
  window.__dccCoachRouteStateBridge=BUILD;

  const ROUTES=new Set(['dashboard','clients','calendar','checkins','messages']);

  function syncLegacy(screen){
    window.currentScreen=screen;
    window.__dccCoachRouteIntent=screen;
    /* index.html declara currentScreen con let, por lo que no es la misma variable
       que window.currentScreen. Un eval global sincroniza ese binding sin renderizar
       una pantalla intermedia. Esto sustituye el antiguo core.call(...), que dibujaba
       dos veces Check-in/Mensajes y provocaba vibraciones y retornos a Panel. */
    try{window.eval('currentScreen='+JSON.stringify(screen))}catch(_){}
  }

  function install(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccRouteStateBridgeV3)return false;
    const wrapped=function(screen){
      if(ROUTES.has(screen))syncLegacy(screen);
      const out=current.apply(this,arguments);
      if(ROUTES.has(screen))syncLegacy(screen);
      return out;
    };
    wrapped.__dccRouteStateBridgeV3=true;
    wrapped.__dccPremiumV9=!!current.__dccPremiumV9;
    wrapped.__dccPremiumV6=!!current.__dccPremiumV6;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  install();
  if(!window.showCoach?.__dccRouteStateBridgeV3){
    let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>=12)clearInterval(timer)},120);
  }
  window.addEventListener('pageshow',install);
})();
