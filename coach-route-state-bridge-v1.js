/* DCC — puente entre rutas premium y el estado interno legacy, sin parpadeos */
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

      window.currentScreen=screen;
      window.__dccCoachRouteIntent=screen;

      /* Algunos renderers premium interceptan estas rutas sin ejecutar el showCoach
         original. Sincronizamos el estado lexical legacy de forma atómica y ocultamos
         únicamente ese render intermedio durante la misma tarea de JavaScript. */
      const needsCoreSync=(screen==='checkins'||screen==='messages'||screen==='calendar')&&core!==current;
      const main=document.getElementById('coach-main');
      const oldVisibility=main?.style?.visibility||'';
      if(needsCoreSync&&main)main.style.visibility='hidden';
      try{
        if(needsCoreSync){try{core.call(this,screen)}catch(e){console.warn('DCC route core sync:',e)}}
        const out=current.apply(this,arguments);
        window.currentScreen=screen;
        window.__dccCoachRouteIntent=screen;
        return out;
      }finally{
        if(needsCoreSync&&main)main.style.visibility=oldVisibility;
      }
    };
    wrapped.__dccRouteStateBridgeV2=true;
    wrapped.__base=current;
    window.showCoach=wrapped;
    return true;
  }

  install();
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>=12)clearInterval(timer)},120);
  window.addEventListener('pageshow',install);
})();
