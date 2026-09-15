/* DCC — puente único entre rutas premium y el estado interno legacy */
(function(){
  'use strict';
  const BUILD='20260915-coach-route-state-bridge-v2';
  if(window.__dccCoachRouteStateBridge===BUILD)return;
  window.__dccCoachRouteStateBridge=BUILD;

  const ROUTES=new Set(['dashboard','clients','calendar','checkins','messages']);

  function deepest(fn){
    let cur=fn,seen=new Set();
    while(typeof cur==='function'&&!seen.has(cur)){
      seen.add(cur);
      const next=cur.__base||cur.__original;
      if(typeof next!=='function'||seen.has(next))break;
      cur=next;
    }
    return cur;
  }

  function install(){
    const current=window.showCoach;
    if(typeof current!=='function'||current.__dccRouteStateBridgeV2)return false;
    const core=deepest(current);
    const wrapped=function(screen){
      if(!ROUTES.has(screen))return current.apply(this,arguments);
      window.__dccCoachRouteIntent=screen;

      /* Algunos renderers premium interceptan la ruta sin llegar al showCoach original.
         Sincronizamos primero el estado léxico interno y después pintamos el renderer
         premium, todo de forma síncrona dentro del mismo frame. */
      if((screen==='checkins'||screen==='messages'||screen==='calendar')&&core!==current){
        try{core.call(this,screen)}catch(e){console.warn('DCC route core sync:',e)}
      }

      const out=current.apply(this,arguments);
      window.currentScreen=screen;
      window.__dccCoachRouteIntent=screen;
      return out;
    };
    wrapped.__dccRouteStateBridgeV2=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  install();
  /* Check-in/Mensajes reinstalan wrappers a 300 y 900 ms. Durante dos segundos
     volvemos a colocar este puente por fuera si alguno de ellos cambia showCoach. */
  let tries=0;const timer=setInterval(()=>{tries++;install();if(tries>=24)clearInterval(timer)},100);
  window.addEventListener('pageshow',()=>{install();setTimeout(install,350);setTimeout(install,950)});
})();
