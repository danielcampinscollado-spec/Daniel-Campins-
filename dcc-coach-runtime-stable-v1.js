/* DCC — runtime estable del entrenador: una ruta, un render, cero observers */
(function(){
  'use strict';
  const BUILD='20260915-dcc-coach-runtime-stable-v1';
  if(window.__dccCoachRuntimeStable===BUILD)return;
  window.__dccCoachRuntimeStable=BUILD;

  const PRIMARY=['dashboard','clients','calendar','checkins','messages'];
  let installed=false;
  let routeChain=null;

  function coachVisible(){
    const coach=document.getElementById('coach');
    if(!coach)return false;
    try{return getComputedStyle(coach).display!=='none'}catch(_){return true}
  }

  function syncState(screen){
    window.currentScreen=screen;
    window.__dccCoachRouteIntent=screen;
    try{window.eval('currentScreen='+JSON.stringify(screen)+';currentApp="coach"')}catch(_){}
  }

  function markNav(screen){
    const index=PRIMARY.indexOf(screen);
    if(index<0)return;
    const nav=document.getElementById('coach-nav');
    if(!nav)return;
    [...nav.querySelectorAll('button')].forEach((button,i)=>{
      const active=i===index;
      button.classList.toggle('active',active);
      if(active)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }

  function stableRoute(screen){
    if(!screen||!coachVisible())return;
    syncState(screen);
    markNav(screen);

    try{
      /* Check-in dispone de renderer directo: evitamos por completo la antigua
         cadena que sincronizaba y volvía a pintar la pantalla por segunda vez. */
      if(screen==='checkins'&&typeof window.dccRenderCoachCheckins==='function'){
        window.dccRenderCoachCheckins();
      }else if(typeof routeChain==='function'){
        routeChain.call(window,screen);
      }
    }catch(error){
      console.error('DCC stable coach route:',screen,error);
    }

    syncState(screen);
    markNav(screen);
  }
  stableRoute.__dccStableCoachRouterV1=true;

  function directClient(id){
    if(!id||typeof window.dccClientAdmin!=='function')return;
    syncState('clients');
    window.selectedClient=id;
    window.scrollTo(0,0);
    return window.dccClientAdmin(id,'summary');
  }
  directClient.__dccClientAdminPremium=true;
  directClient.__dccSingleAuthority=true;

  function installFinal(){
    if(installed)return;
    const current=window.showCoach;
    if(typeof current!=='function')return;

    /* Capturamos la cadena ya terminada después de que hayan cargado los módulos
       legacy/premium. A partir de aquí nadie vuelve a decidir la navegación. */
    routeChain=current;
    window.showCoach=stableRoute;
    window.openClient=directClient;
    window.showClientAdmin=directClient;
    window.dccOpenCoachPrimary=index=>stableRoute(PRIMARY[index]);
    window.dccOpenCoachCalendar=()=>stableRoute('calendar');
    window.dccOpenCoachCheckins=()=>stableRoute('checkins');
    window.dccOpenCoachMessages=()=>stableRoute('messages');

    const nav=document.getElementById('coach-nav');
    if(nav&&!nav.__dccStableCoachNavV1){
      nav.__dccStableCoachNavV1=true;
      nav.addEventListener('click',event=>{
        const button=event.target?.closest?.('button');
        if(!button)return;
        const buttons=[...nav.querySelectorAll('button')];
        const index=buttons.indexOf(button);
        if(index<0||index>=PRIMARY.length)return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        stableRoute(PRIMARY[index]);
      },true);
    }

    installed=true;
    document.documentElement.dataset.dccStableCoachRuntime='1';
  }

  /* Los módulos antiguos terminan sus instalaciones diferidas a los 2,2 s.
     Instalamos la autoridad final una sola vez después de ese punto; no hay polling,
     MutationObserver ni re-render automático. */
  setTimeout(installFinal,2600);
  window.addEventListener('load',()=>setTimeout(installFinal,2600),{once:true});
})();
