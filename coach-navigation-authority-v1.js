/* DCC — autoridad única de navegación del entrenador */
(function(){
  'use strict';
  const BUILD='20260915-coach-navigation-authority-v1';
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

  function buttons(){const nav=document.getElementById('coach-nav');return nav?[...nav.querySelectorAll('button')]:[]}
  function mark(screen){
    const index=ROUTES.indexOf(screen),list=buttons();if(index<0||list.length!==5)return;
    list.forEach((b,i)=>{const on=i===index;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }

  function installShowCoachAuthority(){
    const base=window.showCoach;
    if(typeof base!=='function'||base.__dccNavigationAuthorityV1)return false;
    const wrapped=function(screen){
      if(ROUTE_SET.has(screen)){syncState(screen);mark(screen)}
      const out=base.apply(this,arguments);
      if(ROUTE_SET.has(screen)){syncState(screen);mark(screen)}
      return out;
    };
    wrapped.__dccNavigationAuthorityV1=true;
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
    installShowCoachAuthority();
    if(patchNav())return;
    let tries=0;const timer=setInterval(()=>{tries++;installShowCoachAuthority();if(patchNav()||tries>=20)clearInterval(timer)},100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',()=>{installShowCoachAuthority();patchNav()});
})();
