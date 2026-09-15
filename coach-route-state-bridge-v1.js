/* DCC — puente único entre rutas premium y el estado interno legacy */
(function(){
  'use strict';
  const BUILD='20260915-coach-route-state-bridge-v1';
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
    if(typeof current!=='function'||current.__dccRouteStateBridgeV1)return false;
    const core=deepest(current);
    const wrapped=function(screen){
      if(!ROUTES.has(screen))return current.apply(this,arguments);

      window.__dccCoachRouteIntent=screen;

      /* Check-in, Mensajes y Calendario pueden ser interceptados por renderers premium
         antes de llegar al showCoach original. Ejecutar primero el núcleo sincroniza
         el `let currentScreen` interno de index.html. Todo ocurre en el mismo frame. */
      if((screen==='checkins'||screen==='messages'||screen==='calendar')&&core!==current){
        try{core.call(this,screen)}catch(e){console.warn('DCC route core sync:',e)}
      }

      const out=current.apply(this,arguments);
      window.currentScreen=screen;
      window.__dccCoachRouteIntent=screen;
      return out;
    };
    wrapped.__dccRouteStateBridgeV1=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  install();
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>=20)clearInterval(timer)},100);
  window.addEventListener('pageshow',install);
})();
