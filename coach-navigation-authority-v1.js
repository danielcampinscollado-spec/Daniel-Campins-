/* DCC — autoridad única de navegación del entrenador */
(function(){
  'use strict';
  const BUILD='20260915-coach-navigation-authority-v2';
  if(window.__dccCoachNavigationAuthority===BUILD)return;
  window.__dccCoachNavigationAuthority=BUILD;

  const ROUTES=['dashboard','clients','calendar','checkins','messages'];
  const ROUTE_SET=new Set(ROUTES);

  function syncState(screen){
    if(!ROUTE_SET.has(screen))return;
    window.currentScreen=screen;
    window.__dccCoachRouteIntent=screen;
    try{window.eval('currentScreen='+JSON.stringify(screen)+';currentApp="coach"')}catch(_){}
    if(screen!=='dashboard'){
      const main=document.getElementById('coach-main');
      if(main?.dataset?.dccInstant)delete main.dataset.dccInstant;
    }
  }

  function deepest(fn){
    const seen=new Set();let current=fn;
    while(typeof current==='function'&&!seen.has(current)){
      seen.add(current);const next=current.__base||current.__original;
      if(typeof next!=='function'||next===current)break;current=next;
    }
    return current;
  }

  function buttons(){const nav=document.getElementById('coach-nav');return nav?[...nav.querySelectorAll('button')]:[]}
  function mark(screen){
    const index=ROUTES.indexOf(screen),list=buttons();if(index<0||list.length!==5)return;
    list.forEach((b,i)=>{const on=i===index;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }

  function installShowCoachAuthority(){
    const base=window.showCoach;
    if(typeof base!=='function'||base.__dccNavigationAuthorityV2)return false;
    const core=deepest(base);
    const wrapped=function(screen){
      if(!ROUTE_SET.has(screen))return base.apply(this,arguments);
      syncState(screen);mark(screen);
      const main=document.getElementById('coach-main');
      const needsCore=(screen==='checkins'||screen==='messages')&&typeof core==='function'&&core!==base;
      const oldVisibility=main?.style?.visibility||'';
      if(needsCore&&main)main.style.visibility='hidden';
      try{
        /* Check-in y Mensajes premium interceptan showCoach y antes no actualizaban el
           binding `let currentScreen` de index.html. El núcleo se ejecuta oculto en la
           misma tarea y el renderer premium queda como único render visible. */
        if(needsCore){try{core.apply(this,arguments)}catch(error){console.warn('DCC sync núcleo '+screen+':',error)}syncState(screen)}
        const out=base.apply(this,arguments);
        syncState(screen);mark(screen);return out;
      }finally{if(needsCore&&main)main.style.visibility=oldVisibility}
    };
    wrapped.__dccNavigationAuthorityV2=true;
    wrapped.__dccPremiumV9=!!base.__dccPremiumV9;
    wrapped.__dccPremiumV6=!!base.__dccPremiumV6;
    wrapped.__base=base;
    window.showCoach=wrapped;
    return true;
  }

  function open(screen){
    if(!ROUTE_SET.has(screen)||typeof window.showCoach!=='function')return;
    syncState(screen);mark(screen);
    try{window.showCoach(screen)}catch(error){console.error('DCC navegación '+screen+':',error)}
    syncState(screen);mark(screen);
  }

  function patchNav(){
    const list=buttons();if(list.length!==5)return false;
    list.forEach((b,index)=>{b.onclick=null;b.setAttribute('data-dcc-route',ROUTES[index]);b.removeAttribute('onclick')});
    return true;
  }

  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('#coach-nav button');if(!button)return;
    const list=buttons();if(list.length!==5)return;
    const index=list.indexOf(button),screen=ROUTES[index];if(!screen)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();open(screen);
  },true);

  window.dccOpenCoachPrimary=index=>open(ROUTES[index]);
  window.dccOpenCoachCalendar=()=>open('calendar');
  window.dccOpenCoachCheckins=()=>open('checkins');
  window.dccOpenCoachMessages=()=>open('messages');

  function boot(){
    installShowCoachAuthority();patchNav();
    /* Check-in y Mensajes vuelven a intentar instalar sus wrappers a 300 y 900 ms.
       Durante 1,6 s recolocamos esta autoridad por fuera; después no hay polling. */
    let tries=0;const timer=setInterval(()=>{tries++;installShowCoachAuthority();patchNav();if(tries>=16)clearInterval(timer)},100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>{installShowCoachAuthority();patchNav()});
})();
