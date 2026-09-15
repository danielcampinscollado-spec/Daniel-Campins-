/* DCC — autoridad final de navegación del entrenador. Sin observers, sin polling, un toque = un render. */
(function(){
  'use strict';
  const BUILD='20260915-coach-nav-final-v1';
  if(window.__dccCoachNavFinal===BUILD)return;
  window.__dccCoachNavFinal=BUILD;

  const baseRoute=window.showCoach;
  if(typeof baseRoute!=='function')return;
  const screens=['dashboard','clients','calendar','checkins','messages'];
  let routing=false;

  function sync(screen){
    window.__dccCoachRouteIntent=screen;
    window.currentApp='coach';
    window.currentScreen=screen;
    try{currentApp='coach';currentScreen=screen}catch(e){}
  }

  function active(screen){
    const nav=document.getElementById('coach-nav');
    if(!nav)return;
    const i=screens.indexOf(screen);
    nav.querySelectorAll('button').forEach((b,n)=>b.classList.toggle('active',n===i));
  }

  function route(screen){
    if(!screens.includes(screen)||routing)return;
    routing=true;
    try{
      sync(screen);
      active(screen);
      const out=baseRoute.call(window,screen);
      sync(screen);
      active(screen);
      return out;
    }finally{
      routing=false;
    }
  }

  route.__dccCoachNavFinal=true;
  route.__base=baseRoute;
  window.showCoach=route;
  window.dccOpenCoachPrimary=route;

  const nav=document.getElementById('coach-nav');
  if(nav&&!nav.dataset.dccFinalNav){
    nav.dataset.dccFinalNav='1';
    nav.addEventListener('click',function(ev){
      const button=ev.target.closest('button');
      if(!button||!nav.contains(button))return;
      const buttons=[...nav.querySelectorAll('button')];
      const index=buttons.indexOf(button);
      const screen=screens[index];
      if(!screen)return;
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      route(screen);
    },true);
  }
})();
